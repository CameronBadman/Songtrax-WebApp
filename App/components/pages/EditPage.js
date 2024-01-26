/**
 * Imports for React components and libraries.
 */
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import * as Tone from 'tone';
import InstrumentToggle from '../EditPage/InstrumentToggle';
import NoteRow from '../EditPage/NoteRow';
import SavePreviewButtons from '../EditPage/SavePreviewButtons';
import { createSample, getSample, updateSample } from '../api/api';

/**
 * Array of available instruments.
 * @type {string[]}
 */
const instruments = ['Guitar', 'Piano', 'Violin', 'Drums'];

/**
 * Array of available notes.
 * @type {string[]}
 */
const notes = ['B', 'A', 'G', 'F', 'E', 'D', 'C'];

/**
 * Mapping of instrument names to their respective Tone.js synth constructors.
 * @type {Object}
 */
const SYNTH_MAPPING = {
  'Piano': () => new Tone.PolySynth().toDestination(),
  'Guitar': () => new Tone.Synth({ oscillator: { type: 'triangle' } }).toDestination(),
  'Violin': () => new Tone.Synth({ oscillator: { type: 'sine' } }).toDestination(),
  'Drums': () => new Tone.MembraneSynth().toDestination()
};

/**
 * Initializes the initial instrument data structure.
 * @returns {Object} An object containing instrument and note data.
 */
const createInitialInstrumentData = () => instruments.reduce((acc, instrument) => ({
  ...acc, [instrument]: notes.reduce((noteAcc, note) => ({ ...noteAcc, [note]: Array(16).fill(false) }), {})
}), {});

/**
 * React component for editing a sample.
 */
const EditSample = () => {
  const { id } = useParams();

  // State variables for various aspects of the sample.
  const [selectedInstrument, setSelectedInstrument] = useState(instruments[0]);
  const [instrumentData, setInstrumentData] = useState(createInitialInstrumentData());
  const [songName, setSongName] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  /**
   * Effect hook to fetch sample data when the component mounts.
   * @param {string} id - The ID of the sample to fetch.
   */
  useEffect(() => {
    if (id !== "new") {
      fetchSampleData(id);
    }
  }, [id]);

  /**
   * Fetches sample data from the API and updates component state.
   * @param {string} sampleId - The ID of the sample to fetch.
   */
  const fetchSampleData = async (sampleId) => {
    const sample = await getSample(sampleId);
    setSongName(sample.name);
    const updatedInstrumentData = { ...instrumentData };
    sample.recording_data.forEach(item => {
      const instrumentName = capitalizeFirstLetter(sample.type);
      if (notes.includes(item.note)) updatedInstrumentData[instrumentName][item.note] = item.sequence;
    });
    setInstrumentData(updatedInstrumentData);

    // Update the selectedInstrument state based on the fetched data
    const fetchedInstrument = capitalizeFirstLetter(sample.type);
    if (instruments.includes(fetchedInstrument)) {
      setSelectedInstrument(fetchedInstrument);
    }
  };

  /**
   * Plays a specific note using the selected instrument's synth.
   * @param {string} note - The note to play.
   */
  const playNote = (note) => {
    const SynthType = SYNTH_MAPPING[selectedInstrument] || Tone.Synth;
    const synth = SynthType();
    synth.triggerAttackRelease(note + '4.mp3', '8n');
  };

  /**
   * Capitalizes the first letter of a string.
   * @param {string} string - The input string.
   * @returns {string} The input string with the first letter capitalized.
   */
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  /**
   * Plays the sequence of the selected instrument.
   */
  const playSelectedInstrumentSequence = () => {
    const SynthType = SYNTH_MAPPING[selectedInstrument] || Tone.Synth;
    const synth = SynthType();
    Object.entries(instrumentData[selectedInstrument]).forEach(([note, sequence]) => {
      sequence.forEach((isActive, timeIndex) => {
        if (isActive) synth.triggerAttackRelease(note + '4', '8n', Tone.now() + timeIndex * 0.5);
      });
    });
  };

  /**
   * Saves the sample data to the API.
   * @returns {Promise<void>} A Promise that resolves when the save operation is complete.
   */
  const saveSampleData = async () => {
    setIsSaving(true);
    const data = {
      type: selectedInstrument.toLowerCase(),
      name: songName,
      recording_data: Object.entries(instrumentData[selectedInstrument]).map(([note, sequence]) => ({ note, sequence }))
    };
    try {
      id === "new" ? await createSample(data.type, data.name, data.recording_data) : await updateSample(id, data.type, data.name, data.recording_data);
    } catch (error) {
      setSaveError(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main>
      <h2 className="title">Edit Sample:</h2>
      {saveError && <p className="error-message">{saveError}</p>}
      <form className="card edit-card">
        <input type="text" value={songName} onChange={(e) => setSongName(e.target.value)} placeholder="Song Name" />
        <SavePreviewButtons isSaving={isSaving} isPlaying={isPlaying} onSave={saveSampleData} onPreview={playSelectedInstrumentSequence} />
      </form>
      <InstrumentToggle 
        instruments={instruments}
        selectedInstrument={selectedInstrument}
        onSelect={setSelectedInstrument}
        instrumentData={instrumentData}
      />
      {notes.map(note => 
      <NoteRow 
        key={note} 
        note={note} 
        instrumentData={instrumentData} 
        selectedInstrument={selectedInstrument} 
        onToggle={(row, index) => setInstrumentData(prevData => {
          const newRow = [...prevData[selectedInstrument][row]];
          newRow[index] = !newRow[index];
          return { ...prevData, [selectedInstrument]: { ...prevData[selectedInstrument], [row]: newRow } };
        })}
        playNote={playNote}  // Pass the playNote function
      />
    )}
    </main>
  );
};

export default EditSample;
