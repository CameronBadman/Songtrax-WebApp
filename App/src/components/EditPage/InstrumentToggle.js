import React from 'react';

const InstrumentToggle = ({ instruments, selectedInstrument, onSelect }) => {
  const selectedInstrumentIndex = instruments.indexOf(selectedInstrument);

  return (
    <div className="toggle-row-container">
      <div className="row-label">
        <h4>Instrument</h4>
      </div>
      <div className="sequence-row-container">
        {instruments.map((instrument, index) => (
          <button 
            key={instrument}
            className={index === selectedInstrumentIndex ? 'toggle-selected' : 'toggle'}
            onClick={() => onSelect(instrument)}
          >
            {instrument}
          </button>
        ))}
      </div>
    </div>
  );
};

export default InstrumentToggle;
