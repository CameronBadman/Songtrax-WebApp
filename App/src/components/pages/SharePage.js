import React, { useState, useEffect } from 'react';
import Toggle from '../SharePage/toggle';
import { useParams } from 'react-router-dom';
import { getSample } from '../api/api';
import * as Tone from 'tone';

function SongTraxPage() {
    const { id } = useParams();

    const [sampleName, setSampleName] = useState('');
    const [dateCreated, setDateCreated] = useState('');
    const [isSelected, setIsSelected] = useState(true);
    const [recordingData, setRecordingData] = useState([]);

    useEffect(() => {
        // Fetch sample data from the API based on the id parameter
        fetchSampleData(id);
    }, [id]);

    const fetchSampleData = async (sampleId) => {
        try {
            const sample = await getSample(sampleId);
            console.log(sample)
              
        } catch (error) {
            console.error("Error fetching sample data:", error);
        }
    };

    const playSample = async () => {
        if (recordingData.length === 0) return;

        const synth = new Tone.Synth().toDestination();
        const now = Tone.now();

        recordingData.forEach((item) => {
            const { note, sequence, duration } = item;

            // Check if the sequence is active before triggering the note
            if (sequence) {
                synth.triggerAttackRelease(note + '4', duration, now);
            }
        });
    };

    return (
        <div>
            <MainContent
                sampleName={sampleName}
                dateCreated={dateCreated}
                isSelected={isSelected}
                setIsSelected={setIsSelected}
                onPreview={playSample}
            />
        </div>
    );
}

function MainContent({ sampleName, dateCreated, isSelected, setIsSelected, onPreview }) {
    return (
        <main>
            <h2 className="title">Share This Sample</h2>
            <Card sampleName={sampleName} dateCreated={dateCreated} onPreview={onPreview} />
            <Toggle locationName="Location 1" isSelected={isSelected} setIsSelected={setIsSelected} />
        </main>
    );
}

function Card({ sampleName, dateCreated, onPreview }) {
    return (
        <div className="card">
            <div className="song-details">
                <h3>{sampleName}</h3>
                <p>Date Created: {dateCreated}</p>
            </div>
            <div className="buttons">
                <button onClick={onPreview} className="bright-button">Preview</button>
            </div>
        </div>
    );
}

function Footer() {
    return <footer className="page-footer"></footer>;
}

export default SongTraxPage;
