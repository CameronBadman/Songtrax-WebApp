import React, { useState, useEffect } from 'react';
import SongCard from '../HomePage/SongCard';
import CreateCard from '../HomePage/CreateCard';
import { getSamples } from '../api/api';
import { Link } from 'react-router-dom';

/**
 * Home component displays a list of songs and provides an option to create a new song.
 */
const Home = () => {
    /**
     * @type {Array} songs - List of songs.
     */
    const [songs, setSongs] = useState([]);

    /**
     * @type {boolean} isSorted - Flag to check if songs are sorted. test functionality
     */
    const [isSorted, setIsSorted] = useState(false);

    /**
     * @type {string} search - Search input value. test functionality
     */
    const [search, setSearch] = useState('');

    /**
     * Fetch songs when the component mounts.
     */
    useEffect(() => {
        async function fetchSongs() {
            const samples = await getSamples();
            setSongs(samples);
        }
        
        fetchSongs();
    }, []);

    /**
     * Sorts songs alphabetically by name. testing function 
     */
    const sortSongs = () => {
        const sortedSongs = [...songs].sort((a, b) => a.name.localeCompare(b.name));
        setSongs(sortedSongs);
        setIsSorted(true);
    }

    /**
     * Filters songs based on the search input. testing function 
     */
    const searchSong = () => {
        const SearchedSongs = songs.filter(song => song.name.toLowerCase().includes(search.toLocaleLowerCase()));
        setSongs(SearchedSongs);
    }

    return (
        <main>
            <h2 className="title">Welcome to the Home Page</h2>
            
            {songs.length === 0 ? (
                    <CreateCard />
            ) : (
                <div className="songs-container">
                    <CreateCard />
                    
                    {songs.map((song) => (
                        <SongCard key={song.id} id={song.id} name={song.name} date={song.datetime} 
                        sequence_data={[song.type, song.recording_data]} />
                    ))}
                    <div style={{ marginTop: '2rem' }}></div> {/* Gap */}
                    
                    <CreateCard />
                
                </div>
            )}
        </main>
    );
};

export default Home;
