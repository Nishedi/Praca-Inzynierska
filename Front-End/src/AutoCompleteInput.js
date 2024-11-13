import React, { useEffect, useState } from 'react';
import styles from './AutoComplete.module.css';
import { FaRegTrashAlt } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";

const AutoCompleteInput = ({ exercise, setSelectedExercises, remove, isBase}) => {
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
        // return;
        if(location.length >= 5)
            getSuggestions(location);
    },[location]);


    return (
        <div>
            {/* <div>{exercise?.location}</div> */}
            <div className={styles.exercise_details}>
                
                <div className={styles.wholeInput}>
                    <input
                        type="text"
                        placeholder={isBase ? "Podaj lokalizację bazy" : "Podaj lokalizację"}
                        value={location}
                        onKeyDownCapture={() => setIsDropdownVisible(true)}
                        onChange={(e)=>{setLocation(e.target.value);}}
                        style={{border: isBase ? "2px solid #214225" : "1px solid #77777750 "}}
                    />
                    <IoIosClose
                        onClick={() => {
                                    setLocation("");
                                    setIsDropdownVisible(false);
                                    setSuggestions([]);
                                    setSelectedExercises((prevExercises) =>
                                        prevExercises.map((item) =>(
                                            item.id === exercise.id
                                                ? { ...item, location: ""}
                                                : item 
                                        ))
                                    );
                                }}
                        className={styles.Xbutton} 
                    />
                    {isDropdownVisible && (
                    <div className={styles.suggestions}>
                        {suggestions.map((suggestion, index) => (
                            <div key={index} className={styles.suggestion}
                                onClick={() => {
                                    setLocation(suggestion.properties.formatted);
                                    setIsDropdownVisible(false);
                                    setSuggestions([]);
                                    setSelectedExercises((prevExercises) =>
                                        prevExercises.map((item) =>(
                                            item.id === exercise.id
                                                ? { ...item, location: suggestion.properties.formatted, others: suggestion.properties }
                                                : item 
                                        ))
                                    );
                                }}
                            >
                                {suggestion?.properties?.formatted ? suggestion.properties.formatted : suggestion.properties.name} 
                            </div>
                        ))}
                    </div>
                    )}
                </div>
                <FaRegTrashAlt
                        onClick={() => {remove(exercise.id); setLocation(exercise.location);}}
                        className={styles.trash}
                    />
            </div>
        </div>
    );
};

export default AutoCompleteInput;
