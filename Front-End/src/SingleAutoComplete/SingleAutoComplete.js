import React, { useEffect, useState } from 'react';
import styles from './SingleAutoComplete.module.css';
import { FaRegTrashAlt } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";

const SingleAutoCompleteInput = ({ exercise, setExercise, isBase}) => {
    const [location, setLocation] = useState(exercise?.location || "");
    const [suggestions, setSuggestions] = useState([]);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const getSuggestions = async (value) => {
        const promise = new Promise((resolve, reject) => {        
            const apiKey = "3351739dfa204e19a0a0177749229cc9";
            // const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent("Wrocław " + location)}&limit=1&apiKey=${apiKey}`;
            const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(location)}&limit=1&apiKey=${apiKey}`;
            if (location.length >= 3) {
                fetch(url)
                    .then(response => {
                        if (response.ok) {
                            return response.json();
                        } else {
                            return response.json().then(data => {
                                reject(data);
                                throw new Error(data);
                            });
                        }
                    })
                    .then(data => {
                        resolve(data);
                    })
                    .catch(error => {
                        console.error("Error:", error);
                    });
            }
        });
    
        promise.then((data) => {
            setSuggestions(data.features);
        }
        );
    }

    useEffect(() => {
        setLocation(exercise?.location|| "");
    }
    ,[exercise]);

    useEffect(() => {
        if(location.length >= 5)
            getSuggestions(location);
    },[location]);


    return (
        <div style={{position: 'relative'}}>
        <input
            type="text"
            placeholder={"Podaj lokalizację bazy"}
            value={location}
            onKeyDownCapture={() => setIsDropdownVisible(true)}
            onChange={(e)=>{setLocation(e.target.value);}}
        />                    
        {isDropdownVisible && (
            <div className={styles.suggestions}>
                {suggestions.map((suggestion, index) => (
                    <div key={index} className={styles.suggestion}
                        onClick={() => {
                            setLocation(suggestion.properties.formatted);
                            setIsDropdownVisible(false);
                            setSuggestions([]);
                            const newItem = {
                                id: new Date(),
                                location: suggestion.properties.formatted,
                                others: {
                                    name: suggestion.properties.name,
                                    city: suggestion.properties.city,
                                    state: suggestion.properties.state,
                                    lon: suggestion.properties.lon,
                                    lat: suggestion.properties.lat,
                                    formatted: suggestion.properties.formatted,
                                    address_line1: suggestion.properties.address_line1,
                                    address_line2: suggestion.properties.address_line2

                                }};
                            setExercise(newItem);
                        }}
                    >
                        {suggestion?.properties?.formatted ? suggestion.properties.formatted : suggestion.properties.name} 
                    </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SingleAutoCompleteInput;
