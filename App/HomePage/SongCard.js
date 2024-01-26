import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as Tone from 'tone';

const SYNTH_MAPPING = {
  'Piano': () => new Tone.PolySynth({
    oscillator: {
      type: 'amtriangle4',
      harmonicity: 0.3
    },
    envelope: {
      attack: 0.005,
      decay: 0.3,
      sustain: 0.1,
      release: 1.2
    }
  }),
  'Guitar': () => new Tone.Synth({ oscillator: { type: 'triangle' } }),
  'French Horn': () => new Tone.Synth({
    oscillator: {
      type: 'sine'
    },
    envelope: {
      attack: 0.05,
      decay: 0.3,
      sustain: 0.4,
      release: 1.5
    }
  }),
  'Drums': () => new Tone.MembraneSynth()
};

const capitalizeFirstLetter = string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const playSelectedInstrumentSequence = async (selectedInstrument, instrumentDataString, setIsPlaying) => {
  selectedInstrument = capitalizeFirstLetter(selectedInstrument);
  
  if (typeof SYNTH_MAPPING[selectedInstrument] !== "function") {
    console.error(`No matching synth found for ${selectedInstrument}`);
    return;
  }

  await Tone.start();
  const synth = SYNTH_MAPPING[selectedInstrument]();
  synth.toDestination();

  let sequenceLength = 0;
  const instrumentData = JSON.parse(instrumentDataString);

  instrumentData.forEach(data => {
    const { note, sequence } = data;
    sequence.forEach((isActive, timeIndex) => {
      if (isActive) {
        const triggerTime = Tone.now() + timeIndex * 0.5;
        synth.triggerAttackRelease(note + '4', '8n', triggerTime);
        if (triggerTime > sequenceLength) {
          sequenceLength = triggerTime;
        }
      }
    });
  });

  setTimeout(() => setIsPlaying(false), sequenceLength * 1000); // Convert to milliseconds
};

function SongCard({ id, name, date, sequence_data }) {
  const [isPlaying, setIsPlaying] = useState(false);
  
  const handlePreviewClick = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      playSelectedInstrumentSequence(sequence_data[0], sequence_data[1], setIsPlaying);
    }
  }

  return (
    <div className="card">
      <div className="song-details">
        <h4>{name}</h4>
        <p>{date}</p>
      </div>
      <div className="button-group-container">
        <Link className="btn" to={`/share/${id}`}>Share</Link>
        <button 
          type="button" 
          className="bright-button" 
          onClick={handlePreviewClick}>
          {isPlaying ? 'Stop Previewing' : 'Preview'}
        </button>
        <Link className="btn" to={`/edit/${id}`}>Edit</Link>
      </div>
    </div>
  );
}

export default SongCard;
