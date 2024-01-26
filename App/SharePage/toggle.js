import React, { useState } from 'react';

function ShareToggle() {
    // Initialize the isSelected state with true
    const [isSelected, setIsSelected] = useState(true);

    return (
        <div>
            <Toggle locationName="Location 1" isSelected={isSelected} setIsSelected={setIsSelected} />
        </div>
    );
}

function Toggle({ locationName, isSelected, setIsSelected }) {
    // Add click handlers to the buttons to update isSelected
    const handleSharedClick = () => setIsSelected(true);
    const handleNotSharedClick = () => setIsSelected(false);

    return (
        <div className="toggle-row-container">
            <div className="location-name-label">
                <h4>{locationName}</h4>
            </div>
            <div className="sequence-row-container">
                <button className={isSelected ? "toggle-selected" : "toggle"} onClick={handleSharedClick}>Shared</button>
                <button className={!isSelected ? "toggle-selected" : "toggle"} onClick={handleNotSharedClick}>Not Shared</button>
            </div>
        </div>
    );
}

export default ShareToggle;
