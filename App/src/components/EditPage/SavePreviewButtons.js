import React from 'react';

const SavePreviewButtons = ({ isSaving, isPlaying, onSave, onPreview }) => {
  return (
    <div className="button-group-container">
      <button type="button" className="bright-button" onClick={onSave}>
        {isSaving ? <span className="spinner"></span> : 'Save'}
      </button>
      <button type="button" className="bright-button" onClick={onPreview}>
        {isPlaying ? 'Stop Previewing' : 'Preview'}
      </button>
    </div>
  );
};

export default SavePreviewButtons;





