import React, { useState, useEffect } from 'react';
import * as Tone from 'tone';

const NoteRow = ({ note, instrumentData, selectedInstrument, onToggle, playNote }) => {
  // 1. Set the initial state of rowData using instrumentData and selectedInstrument
  const [rowData, setRowData] = useState(instrumentData[selectedInstrument][note]);

  // 2. Update the row data based on changes in instrumentData or selectedInstrument
  useEffect(() => {
    setRowData(instrumentData[selectedInstrument][note]);
  }, [instrumentData, selectedInstrument, note]);

  const handleToggle = (note, index) => {
    playNote(note);  // Use the playNote prop to play the note
    const updatedRowData = [...rowData];
    updatedRowData[index] = !updatedRowData[index];
    setRowData(updatedRowData);
    onToggle(note, index);
  };

  return (
    <div className="toggle-row-container" key={note}>
      <div className="row-label">
        <h4>{note}</h4>
      </div>
      <div className="sequence-row-container">
        {rowData.map((isActive, index) => (
          <button 
            key={index}
            className={isActive ? 'toggle-selected' : 'toggle'}
            onClick={() => handleToggle(note, index)}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default NoteRow;
