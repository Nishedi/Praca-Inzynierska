// import React, { useState } from 'react';
// import './MainActivity.css';
// import AutoCompleteInput from './AutoCompleteInput';
// import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet'
// import 'leaflet/dist/leaflet.css'; 
// function MainActivity() {
//     const [sugerowanaTrasa, setSugerowanaTrasa] = useState('');
//     const [listOfLocations, setListOfLocations] = useState([
//         // {
//         //     lat: '17.021325',
//         //     lng: '51.104418',
//         //     name: 'Wrocław'
//         // },
//         // {
//         //     lat: '19.021807',
//         //     lng: '50.264798',
//         //     name: 'Katowice'
//         // },
//         // {
//         //     lat: '16.915342',
//         //     lng: '52.407560',
//         //     name: 'Poznań'
//         // },
//         // {
//         //     lat: '19.469902',
//         //     lng: '51.760327',
//         //     name: 'Łódź'
//         // }
//     ]);
//     const handleChange = (e, index) => {
//         console.log(e.target.value);
//         const newValues = [...listOfLocations];
//         newValues[index] = e.target.value;
//         setListOfLocations(newValues);
//     };
//     const handleAddInput = () => {
//         if(listOfLocations.at(-1)==="") return; // Jeśli ostatni input jest pusty, nie dodajemy nowego
//         setListOfLocations([...listOfLocations, {id: new Date()}]); // Dodajemy nowy pusty input
//     };

//     const remove = (id) => {
//         setListOfLocations((prevListOfLocations) => prevListOfLocations.filter((location) => location.id !== id));
//     };

//     const [testInput, setTestInput] = useState('');

//     const makeRequest = async () => {
//         const message = listOfLocations;
        
//         const response = await fetch('http://localhost:3000/run-script', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ message: message }),
//         });
//         const data = await response.json();
//         setSugerowanaTrasa("Optymalna trasa: "+data.sortedLocations.map(location => location.name).join(' -> '));
//     };
//     return (
//         <div className='flex-container'>
//             {console.log(listOfLocations)}
//             <button className='item' onClick={() => makeRequest(testInput)}>Run Script</button>
          
//             {listOfLocations.map((value, index) => (
//                 <div key={value.id}>
//                     {/* {console.log(value)}     */}
//                     <AutoCompleteInput 
//                         exercise={value} // Przekaż obiekt lokalizacji (lat, lng, name)
//                         setSelectedExercises={setListOfLocations} // Ustaw nową listę lokalizacji
//                         setItem={(location) => handleChange(location, index)} // Podmień cały obiekt
//                         initialValue={value}  // Przekaż początkową wartość lokalizacji (obiekt z lat, lng, name)
//                         remove={() => remove(value.id)} // Usuń lokalizację z listy
//                         // inne opcje AutoCompleteInput...
//                     />
//                 </div>
//             ))}
//             {/* {listOfLocations.map((value, index) => (
//                 <div>
//                     {index}:{value.name}
//                 </div>    
//             ))} */}
//             <button onClick={handleAddInput}>Add input</button>
//             {sugerowanaTrasa && <div className='item'>{sugerowanaTrasa}</div>}
//             <div>
//             <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
//                 <TileLayer
//                     attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//                     url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                 />
//                 <Marker position={[51.505, -0.09]}>
//                     <Popup>
//                     A pretty CSS3 popup. <br /> Easily customizable.
//                     </Popup>
//                 </Marker>
//             </MapContainer>
//             </div>
//         </div>
//     )
// }

// export default MainActivity;
import React, { useState, useEffect } from 'react';
import './MainActivity.css';
import AutoCompleteInput from './AutoCompleteInput';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet'; // Importujemy Leaflet do niestandardowej ikony
import 'leaflet/dist/leaflet.css';
import markerIconPng from 'leaflet/dist/images/marker-icon.png'; // Import domyślnego markera
import markerShadowPng from 'leaflet/dist/images/marker-shadow.png'; // Import cienia markera

// Ustawienie ikony markera
const defaultIcon = L.icon({
    iconUrl: markerIconPng,
    shadowUrl: markerShadowPng,
    iconSize: [25, 41], // Rozmiar markera
    iconAnchor: [12, 41], // Punkt zakotwiczenia, który wskazuje lokalizację
    popupAnchor: [1, -34], // Punkt zakotwiczenia dla popupu
    shadowSize: [41, 41]  // Rozmiar cienia
});

function MainActivity() {
    const [sugerowanaTrasa, setSugerowanaTrasa] = useState([]);
    const [listOfLocations, setListOfLocations] = useState([
        {
            "id": "2024-10-19T15:06:16.679Z",
            "location": "Avenida Poznań, Stanisława Matyi 2, 61-586 Poznan, Poland",
            "others": {
                "datasource": {
                    "sourcename": "openstreetmap",
                    "attribution": "© OpenStreetMap contributors",
                    "license": "Open Database License",
                    "url": "https://www.openstreetmap.org/copyright"
                },
                "name": "Avenida Poznań",
                "old_name": "Poznań City Center",
                "country": "Poland",
                "country_code": "pl",
                "state": "Greater Poland Voivodeship",
                "city": "Poznan",
                "postcode": "61-586",
                "district": "Wierzbięcice",
                "suburb": "Wilda",
                "street": "Stanisława Matyi",
                "housenumber": "2",
                "lon": 16.91344156323907,
                "lat": 52.40071895,
                "result_type": "amenity",
                "formatted": "Avenida Poznań, Stanisława Matyi 2, 61-586 Poznan, Poland",
                "address_line1": "Avenida Poznań",
                "address_line2": "Stanisława Matyi 2, 61-586 Poznan, Poland",
                "category": "commercial.shopping_mall",
                "timezone": {
                    "name": "Europe/Warsaw",
                    "offset_STD": "+01:00",
                    "offset_STD_seconds": 3600,
                    "offset_DST": "+02:00",
                    "offset_DST_seconds": 7200,
                    "abbreviation_STD": "CET",
                    "abbreviation_DST": "CEST"
                },
                "plus_code": "9F4RCW27+79",
                "rank": {
                    "importance": 0.19324803174625985,
                    "confidence": 0,
                    "match_type": "full_match"
                },
                "place_id": "513eeb684ed7e9304059989130c24a334a40f00102f901fe4ffb1500000000c0020192030f4176656e69646120506f7a6e61c584"
            }
        },
        {
            "id": "2024-10-19T15:06:28.712Z",
            "location": "Wrocławska 41, 81-552 Gdynia, Poland",
            "others": {
                "datasource": {
                    "sourcename": "openstreetmap",
                    "attribution": "© OpenStreetMap contributors",
                    "license": "Open Database License",
                    "url": "https://www.openstreetmap.org/copyright"
                },
                "name": "Wrocławska 41",
                "country": "Poland",
                "country_code": "pl",
                "state": "Pomeranian Voivodeship",
                "city": "Gdynia",
                "suburb": "Orłowo",
                "lon": 18.536440421999213,
                "lat": 54.4838659,
                "district": "Orłowo",
                "result_type": "amenity",
                "postcode": "81-552",
                "formatted": "Wrocławska 41, 81-552 Gdynia, Poland",
                "address_line1": "Wrocławska 41",
                "address_line2": "81-552 Gdynia, Poland",
                "timezone": {
                    "name": "Europe/Warsaw",
                    "offset_STD": "+01:00",
                    "offset_STD_seconds": 3600,
                    "offset_DST": "+02:00",
                    "offset_DST_seconds": 7200,
                    "abbreviation_STD": "CET",
                    "abbreviation_DST": "CEST"
                },
                "plus_code": "9F6WFGMP+GH",
                "plus_code_short": "FGMP+GH Gdynia, Pomeranian Voivodeship, Poland",
                "rank": {
                    "importance": 0.10667666666666664,
                    "confidence": 0.6666666666666666,
                    "match_type": "full_match"
                },
                "place_id": "5133bdd428548932405926135c51ef3d4b40f00102f90180ce2f4700000000c0020192030e57726f63c5826177736b61203431"
            }
        },
        {
            "id": "2024-10-19T15:06:39.669Z",
            "location": "Centrostal-Wrocław SA Oddział w Płocku, Kobiałka 7B, 09-411 Płock, Poland",
            "others": {
                "datasource": {
                    "sourcename": "openstreetmap",
                    "attribution": "© OpenStreetMap contributors",
                    "license": "Open Database License",
                    "url": "https://www.openstreetmap.org/copyright"
                },
                "name": "Centrostal-Wrocław SA Oddział w Płocku",
                "country": "Poland",
                "country_code": "pl",
                "state": "Masovian Voivodeship",
                "city": "Płock",
                "postcode": "09-411",
                "district": "Osiedle Młodych",
                "suburb": "Winiary",
                "street": "Kobiałka",
                "housenumber": "7B",
                "lon": 19.665253525962605,
                "lat": 52.567319499999996,
                "result_type": "amenity",
                "formatted": "Centrostal-Wrocław SA Oddział w Płocku, Kobiałka 7B, 09-411 Płock, Poland",
                "address_line1": "Centrostal-Wrocław SA Oddział w Płocku",
                "address_line2": "Kobiałka 7B, 09-411 Płock, Poland",
                "timezone": {
                    "name": "Europe/Warsaw",
                    "offset_STD": "+01:00",
                    "offset_STD_seconds": 3600,
                    "offset_DST": "+02:00",
                    "offset_DST_seconds": 7200,
                    "abbreviation_STD": "CET",
                    "abbreviation_DST": "CEST"
                },
                "plus_code": "9F4XHM88+W4",
                "plus_code_short": "HM88+W4 Płock, Masovian Voivodeship, Poland",
                "rank": {
                    "importance": 0.21000999999999997,
                    "confidence": 1,
                    "confidence_city_level": 1,
                    "match_type": "inner_part"
                },
                "place_id": "51de8e190e4eaa3340590871e5ec9d484a40f00102f9014c1af02e00000000c0020192032943656e74726f7374616c2d57726f63c5826177205341204f64647a6961c58220772050c5826f636b75"
            }
        },
        {
            "id": "2024-10-19T15:06:50.464Z",
            "location": "Wrocławska, 71-034 Szczecin, Poland",
            "others": {
                "datasource": {
                    "sourcename": "openstreetmap",
                    "attribution": "© OpenStreetMap contributors",
                    "license": "Open Database License",
                    "url": "https://www.openstreetmap.org/copyright"
                },
                "name": "Wrocławska",
                "country": "Poland",
                "country_code": "pl",
                "state": "West Pomeranian Voivodeship",
                "city": "Szczecin",
                "postcode": "71-034",
                "district": "Zachód",
                "neighbourhood": "Słowieńsko",
                "suburb": "Gumieńce",
                "street": "Wrocławska",
                "lon": 14.4916328,
                "lat": 53.4170392,
                "result_type": "street",
                "formatted": "Wrocławska, 71-034 Szczecin, Poland",
                "address_line1": "Wrocławska",
                "address_line2": "71-034 Szczecin, Poland",
                "timezone": {
                    "name": "Europe/Warsaw",
                    "offset_STD": "+01:00",
                    "offset_STD_seconds": 3600,
                    "offset_DST": "+02:00",
                    "offset_DST_seconds": 7200,
                    "abbreviation_STD": "CET",
                    "abbreviation_DST": "CEST"
                },
                "plus_code": "9F5PCF8R+RM",
                "plus_code_short": "CF8R+RM Szczecin, West Pomeranian Voivodeship, Poland",
                "rank": {
                    "importance": 0.0533433333333333,
                    "confidence": 0,
                    "match_type": "full_match"
                },
                "place_id": "5125485b4bb7fb2c405933935e8a61b54a40f00102f90167f5e91e00000000c0020492030b57726f63c5826177736b61"
            }
        },
        {
            "id": "2024-10-19T15:07:00.037Z",
            "location": "Zielona Góra, Wrocławska, 65-427 Zielona Góra, Poland",
            "others": {
                "datasource": {
                    "sourcename": "openstreetmap",
                    "attribution": "© OpenStreetMap contributors",
                    "license": "Open Database License",
                    "url": "https://www.openstreetmap.org/copyright"
                },
                "name": "Zielona Góra",
                "country": "Poland",
                "country_code": "pl",
                "state": "Lubusz Voivodeship",
                "city": "Zielona Góra",
                "postcode": "65-427",
                "district": "Osiedle Tysiąclecia",
                "street": "Wrocławska",
                "lon": 15.5131728,
                "lat": 51.9377399,
                "result_type": "amenity",
                "formatted": "Zielona Góra, Wrocławska, 65-427 Zielona Góra, Poland",
                "address_line1": "Zielona Góra",
                "address_line2": "Wrocławska, 65-427 Zielona Góra, Poland",
                "category": "tourism.attraction.artwork",
                "timezone": {
                    "name": "Europe/Warsaw",
                    "offset_STD": "+01:00",
                    "offset_STD_seconds": 3600,
                    "offset_DST": "+02:00",
                    "offset_DST_seconds": 7200,
                    "abbreviation_STD": "CET",
                    "abbreviation_DST": "CEST"
                },
                "plus_code": "9F3QWGQ7+37",
                "plus_code_short": "Q7+37 Zielona Góra, Lubusz Voivodeship, Poland",
                "rank": {
                    "importance": 0.00000999999999995449,
                    "confidence": 0.5,
                    "match_type": "full_match"
                },
                "place_id": "51bc64d295be062f4059c0536ddc07f84940f00103f9011b8eb18a02000000c0020192030d5a69656c6f6e612047c3b37261"
            }
        },
        {
            "id": "2024-10-19T15:07:08.360Z",
            "location": "Wrocławska, 01-466 Warsaw, Poland",
            "others": {
                "datasource": {
                    "sourcename": "openstreetmap",
                    "attribution": "© OpenStreetMap contributors",
                    "license": "Open Database License",
                    "url": "https://www.openstreetmap.org/copyright"
                },
                "name": "Wrocławska",
                "country": "Poland",
                "country_code": "pl",
                "state": "Masovian Voivodeship",
                "city": "Warsaw",
                "postcode": "01-466",
                "district": "Bemowo II",
                "suburb": "Bemowo",
                "quarter": "Bemowo-Lotnisko",
                "street": "Wrocławska",
                "lon": 20.921425,
                "lat": 52.2494093,
                "result_type": "street",
                "formatted": "Wrocławska, 01-466 Warsaw, Poland",
                "address_line1": "Wrocławska",
                "address_line2": "01-466 Warsaw, Poland",
                "timezone": {
                    "name": "Europe/Warsaw",
                    "offset_STD": "+01:00",
                    "offset_STD_seconds": 3600,
                    "offset_DST": "+02:00",
                    "offset_DST_seconds": 7200,
                    "abbreviation_STD": "CET",
                    "abbreviation_DST": "CEST"
                },
                "plus_code": "9G426WXC+QH",
                "plus_code_short": "6WXC+QH Warsaw, Masovian Voivodeship, Poland",
                "rank": {
                    "importance": 0.0533433333333333,
                    "confidence": 0,
                    "match_type": "full_match"
                },
                "place_id": "5180b74082e2eb344059bd68d9a4ec1f4a40f00102f9010f36020900000000c0020492030b57726f63c5826177736b61"
            }
        },
        {
            "id": "2024-10-19T15:07:28.217Z",
            "location": "Muzeum Podlaskie w Białymstoku - Ratusz, 10, 15-091 Białystok, Poland",
            "others": {
                "datasource": {
                    "sourcename": "openstreetmap",
                    "attribution": "© OpenStreetMap contributors",
                    "license": "Open Database License",
                    "url": "https://www.openstreetmap.org/copyright"
                },
                "name": "Muzeum Podlaskie w Białymstoku - Ratusz",
                "country": "Poland",
                "country_code": "pl",
                "state": "Podlaskie Voivodeship",
                "city": "Białystok",
                "postcode": "15-091",
                "district": "Osiedle Waryńskiego",
                "suburb": "Centrum",
                "housenumber": "10",
                "lon": 23.1587714,
                "lat": 53.1323898,
                "result_type": "amenity",
                "formatted": "Muzeum Podlaskie w Białymstoku - Ratusz, 10, 15-091 Białystok, Poland",
                "address_line1": "Muzeum Podlaskie w Białymstoku - Ratusz",
                "address_line2": "10, 15-091 Białystok, Poland",
                "category": "entertainment.museum",
                "timezone": {
                    "name": "Europe/Warsaw",
                    "offset_STD": "+01:00",
                    "offset_STD_seconds": 3600,
                    "offset_DST": "+02:00",
                    "offset_DST_seconds": 7200,
                    "abbreviation_STD": "CET",
                    "abbreviation_DST": "CEST"
                },
                "plus_code": "9G5545J5+XG",
                "plus_code_short": "J5+XG Białystok, Podlaskie Voivodeship, Poland",
                "rank": {
                    "importance": 0.23859140675544002,
                    "confidence": 0,
                    "match_type": "full_match"
                },
                "place_id": "51468a123ea52837405978a92226f2904a40f00103f90139742c3200000000c002019203284d757a65756d20506f646c61736b6965207720426961c582796d73746f6b75202d2052617475737a"
            }
        },
        {
            "id": "2024-10-19T15:07:40.812Z",
            "location": "Wrocławska, 31-307 Krakow, Poland",
            "others": {
                "datasource": {
                    "sourcename": "openstreetmap",
                    "attribution": "© OpenStreetMap contributors",
                    "license": "Open Database License",
                    "url": "https://www.openstreetmap.org/copyright"
                },
                "name": "Wrocławska",
                "country": "Poland",
                "country_code": "pl",
                "state": "Lesser Poland Voivodeship",
                "city": "Krakow",
                "postcode": "31-307",
                "district": "Krowodrza",
                "suburb": "Krowodrza",
                "quarter": "Łobzów",
                "street": "Wrocławska",
                "lon": 19.915423,
                "lat": 50.0822108,
                "result_type": "street",
                "formatted": "Wrocławska, 31-307 Krakow, Poland",
                "address_line1": "Wrocławska",
                "address_line2": "31-307 Krakow, Poland",
                "timezone": {
                    "name": "Europe/Warsaw",
                    "offset_STD": "+01:00",
                    "offset_STD_seconds": 3600,
                    "offset_DST": "+02:00",
                    "offset_DST_seconds": 7200,
                    "abbreviation_STD": "CET",
                    "abbreviation_DST": "CEST"
                },
                "plus_code": "9F2X3WJ8+V5",
                "rank": {
                    "importance": 0.0533433333333333,
                    "confidence": 0,
                    "match_type": "full_match"
                },
                "place_id": "519701672959ea33405962b02ce2850a4940f00102f901c4252e0100000000c0020492030b57726f63c5826177736b61"
            }
        },
        {
            "id": "2024-10-19T15:07:48.568Z",
            "location": "Wrocławska, 26-603 Radom, Poland",
            "others": {
                "datasource": {
                    "sourcename": "openstreetmap",
                    "attribution": "© OpenStreetMap contributors",
                    "license": "Open Database License",
                    "url": "https://www.openstreetmap.org/copyright"
                },
                "name": "Wrocławska",
                "country": "Poland",
                "country_code": "pl",
                "state": "Masovian Voivodeship",
                "city": "Radom",
                "postcode": "26-603",
                "suburb": "Dzierzków",
                "street": "Wrocławska",
                "lon": 21.1898445,
                "lat": 51.4011654,
                "result_type": "street",
                "formatted": "Wrocławska, 26-603 Radom, Poland",
                "address_line1": "Wrocławska",
                "address_line2": "26-603 Radom, Poland",
                "timezone": {
                    "name": "Europe/Warsaw",
                    "offset_STD": "+01:00",
                    "offset_STD_seconds": 3600,
                    "offset_DST": "+02:00",
                    "offset_DST_seconds": 7200,
                    "abbreviation_STD": "CET",
                    "abbreviation_DST": "CEST"
                },
                "plus_code": "9G33C52Q+FW",
                "plus_code_short": "C52Q+FW Radom, Masovian Voivodeship, Poland",
                "rank": {
                    "importance": 0.1533433333333333,
                    "confidence": 0.5,
                    "confidence_city_level": 1,
                    "confidence_street_level": 1,
                    "match_type": "match_by_street"
                },
                "place_id": "5152d32ea69930354059b4a4486359b34940f00102f9011828b50a00000000c0020492030b57726f63c5826177736b61"
            }
        },
        {
            "id": "2024-10-19T15:07:58.365Z",
            "location": "Wrocławska, 40-219 Katowice, Poland",
            "others": {
                "datasource": {
                    "sourcename": "openstreetmap",
                    "attribution": "© OpenStreetMap contributors",
                    "license": "Open Database License",
                    "url": "https://www.openstreetmap.org/copyright"
                },
                "name": "Wrocławska",
                "country": "Poland",
                "country_code": "pl",
                "state": "Silesian Voivodeship",
                "county": "Metropolis GZM",
                "city": "Katowice",
                "postcode": "40-219",
                "district": "Osiedle Jerzego Kukuczki",
                "suburb": "Bogucice",
                "street": "Wrocławska",
                "lon": 19.0492897,
                "lat": 50.2665035,
                "result_type": "street",
                "formatted": "Wrocławska, 40-219 Katowice, Poland",
                "address_line1": "Wrocławska",
                "address_line2": "40-219 Katowice, Poland",
                "timezone": {
                    "name": "Europe/Warsaw",
                    "offset_STD": "+01:00",
                    "offset_STD_seconds": 3600,
                    "offset_DST": "+02:00",
                    "offset_DST_seconds": 7200,
                    "abbreviation_STD": "CET",
                    "abbreviation_DST": "CEST"
                },
                "plus_code": "9F2X728X+JP",
                "plus_code_short": "728X+JP Katowice, Metropolis GZM, Poland",
                "rank": {
                    "importance": 0.0533433333333333,
                    "confidence": 0,
                    "match_type": "full_match"
                },
                "place_id": "519787f13f9e0c334059806264c91c224940f00102f9017d366c1100000000c0020492030b57726f63c5826177736b61"
            }
        },
        {
            "id": "2024-10-19T15:08:01.502Z",
            "location": "Poznańska, 53-630 Wrocław, Poland",
            "others": {
                "country": "Poland",
                "city": "Wrocław",
                "postcode": "53-630",
                "district": "Szczepin",
                "state": "Lower Silesian Voivodeship",
                "datasource": {
                    "sourcename": "openstreetmap",
                    "attribution": "© OpenStreetMap contributors",
                    "license": "Open Database License",
                    "url": "https://www.openstreetmap.org/copyright"
                },
                "country_code": "pl",
                "street": "Poznańska",
                "lon": 17.0076417,
                "lat": 51.1181114,
                "result_type": "street",
                "name": "Poznańska",
                "suburb": "Szczepin",
                "formatted": "Poznańska, 53-630 Wrocław, Poland",
                "address_line1": "Poznańska",
                "address_line2": "53-630 Wrocław, Poland",
                "timezone": {
                    "name": "Europe/Warsaw",
                    "offset_STD": "+01:00",
                    "offset_STD_seconds": 3600,
                    "offset_DST": "+02:00",
                    "offset_DST_seconds": 7200,
                    "abbreviation_STD": "CET",
                    "abbreviation_DST": "CEST"
                },
                "plus_code": "9F3V4295+63",
                "plus_code_short": "4295+63 Wrocław, Lower Silesian Voivodeship, Poland",
                "rank": {
                    "importance": 0.2733433333333333,
                    "confidence": 0,
                    "match_type": "full_match"
                },
                "place_id": "51fa9573cef40131405973243c461e8f4940f00102f901c5fe740100000000c0020492030a506f7a6e61c584736b61"
            }
        },
        {
            "id": "2024-10-19T15:08:12.635Z",
            "location": "Krasińskiego, Przemyśl, Subcarpathian Voivodeship, Poland",
            "others": {
                "datasource": {
                    "sourcename": "openstreetmap",
                    "attribution": "© OpenStreetMap contributors",
                    "license": "Open Database License",
                    "url": "https://www.openstreetmap.org/copyright"
                },
                "name": "Krasińskiego",
                "country": "Poland",
                "country_code": "pl",
                "state": "Subcarpathian Voivodeship",
                "city": "Przemyśl",
                "postcode": "37-700",
                "district": "Osiedle Zygmunta Krasińskiego",
                "suburb": "Krasińskiego",
                "lon": 22.7720839,
                "lat": 49.7892064,
                "result_type": "suburb",
                "formatted": "Krasińskiego, Przemyśl, Subcarpathian Voivodeship, Poland",
                "address_line1": "Krasińskiego",
                "address_line2": "Przemyśl, Subcarpathian Voivodeship, Poland",
                "category": "populated_place",
                "timezone": {
                    "name": "Europe/Warsaw",
                    "offset_STD": "+01:00",
                    "offset_STD_seconds": 3600,
                    "offset_DST": "+02:00",
                    "offset_DST_seconds": 7200,
                    "abbreviation_STD": "CET",
                    "abbreviation_DST": "CEST"
                },
                "plus_code": "8GX4QQQC+MR",
                "plus_code_short": "QC+MR Przemyśl, Subcarpathian Voivodeship, Poland",
                "rank": {
                    "importance": 0.14667666666666662,
                    "confidence": 0,
                    "match_type": "full_match"
                },
                "place_id": "51a4445c4aa7c53640599ee51eb704e54840f00103f901eee3f51d02000000c0020592030d4b72617369c584736b6965676f"
            }
        },
        {
            "id": "2024-10-19T15:11:57.158Z",
            "location": "Wrocławska, 16-402 Suwałki, Poland",
            "others": {
                "datasource": {
                    "sourcename": "openstreetmap",
                    "attribution": "© OpenStreetMap contributors",
                    "license": "Open Database License",
                    "url": "https://www.openstreetmap.org/copyright"
                },
                "name": "Wrocławska",
                "country": "Poland",
                "country_code": "pl",
                "state": "Podlaskie Voivodeship",
                "city": "Suwałki",
                "postcode": "16-402",
                "street": "Wrocławska",
                "lon": 22.9199991,
                "lat": 54.0771662,
                "result_type": "street",
                "formatted": "Wrocławska, 16-402 Suwałki, Poland",
                "address_line1": "Wrocławska",
                "address_line2": "16-402 Suwałki, Poland",
                "timezone": {
                    "name": "Europe/Warsaw",
                    "offset_STD": "+01:00",
                    "offset_STD_seconds": 3600,
                    "offset_DST": "+02:00",
                    "offset_DST_seconds": 7200,
                    "abbreviation_STD": "CET",
                    "abbreviation_DST": "CEST"
                },
                "plus_code": "9G643WG9+VX",
                "plus_code_short": "3WG9+VX Suwałki, Podlaskie Voivodeship, Poland",
                "rank": {
                    "importance": 0.0533433333333333,
                    "confidence": 0,
                    "match_type": "full_match"
                },
                "place_id": "5174d99e0f85eb364059a5ad0095e0094b40f00102f901a7355e0a00000000c0020492030b57726f63c5826177736b61"
            }
        },
        {
            "id": "2024-10-19T15:12:15.096Z",
            "location": "Gdańska, 75-438 Koszalin, Poland",
            "others": {
                "datasource": {
                    "sourcename": "openstreetmap",
                    "attribution": "© OpenStreetMap contributors",
                    "license": "Open Database License",
                    "url": "https://www.openstreetmap.org/copyright"
                },
                "name": "Gdańska",
                "ref": "112",
                "country": "Poland",
                "country_code": "pl",
                "state": "West Pomeranian Voivodeship",
                "city": "Koszalin",
                "postcode": "75-438",
                "district": "Koszalin",
                "street": "Gdańska",
                "lon": 16.2453236,
                "lat": 54.2235076,
                "result_type": "street",
                "formatted": "Gdańska, 75-438 Koszalin, Poland",
                "address_line1": "Gdańska",
                "address_line2": "75-438 Koszalin, Poland",
                "timezone": {
                    "name": "Europe/Warsaw",
                    "offset_STD": "+01:00",
                    "offset_STD_seconds": 3600,
                    "offset_DST": "+02:00",
                    "offset_DST_seconds": 7200,
                    "abbreviation_STD": "CET",
                    "abbreviation_DST": "CEST"
                },
                "plus_code": "9F6R66FW+C4",
                "plus_code_short": "66FW+C4 Koszalin, West Pomeranian Voivodeship, Poland",
                "rank": {
                    "importance": 0.0533433333333333,
                    "confidence": 0,
                    "match_type": "full_match"
                },
                "place_id": "51deef0687cd3e3040592734a4e59b1c4b40f00102f90105f9453500000000c00204920308476461c584736b61"
            }
        },
        {
            "id": "2024-10-19T15:13:55.052Z",
            "location": "Wrocławska, 63-460 Kalisz, Poland",
            "others": {
                "datasource": {
                    "sourcename": "openstreetmap",
                    "attribution": "© OpenStreetMap contributors",
                    "license": "Open Database License",
                    "url": "https://www.openstreetmap.org/copyright"
                },
                "name": "Wrocławska",
                "country": "Poland",
                "country_code": "pl",
                "state": "Greater Poland Voivodeship",
                "city": "Kalisz",
                "suburb": "Szczypiorno",
                "street": "Wrocławska",
                "lon": 18.0280612,
                "lat": 51.7279325,
                "district": "Szczypiorno",
                "result_type": "street",
                "postcode": "63-460",
                "formatted": "Wrocławska, 63-460 Kalisz, Poland",
                "address_line1": "Wrocławska",
                "address_line2": "63-460 Kalisz, Poland",
                "timezone": {
                    "name": "Europe/Warsaw",
                    "offset_STD": "+01:00",
                    "offset_STD_seconds": 3600,
                    "offset_DST": "+02:00",
                    "offset_DST_seconds": 7200,
                    "abbreviation_STD": "CET",
                    "abbreviation_DST": "CEST"
                },
                "plus_code": "9F3WP2HH+56",
                "plus_code_short": "P2HH+56 Kalisz, Greater Poland Voivodeship, Poland",
                "rank": {
                    "importance": 0.0533433333333333,
                    "confidence": 0,
                    "match_type": "full_match"
                },
                "place_id": "515949d0042f07324059079964e42cdd4940f00102f901f4d1341400000000c0020492030b57726f63c5826177736b61"
            }
        },
        {
            "id": "2024-10-19T15:13:57.224Z",
            "location": "Sieradzka, 50-532 Wrocław, Poland",
            "others": {
                "datasource": {
                    "sourcename": "openstreetmap",
                    "attribution": "© OpenStreetMap contributors",
                    "license": "Open Database License",
                    "url": "https://www.openstreetmap.org/copyright"
                },
                "name": "Sieradzka",
                "country": "Poland",
                "country_code": "pl",
                "state": "Lower Silesian Voivodeship",
                "city": "Wrocław",
                "postcode": "50-532",
                "suburb": "Huby",
                "quarter": "Glinianki",
                "street": "Sieradzka",
                "lon": 17.0334773,
                "lat": 51.092815,
                "district": "Huby",
                "result_type": "street",
                "formatted": "Sieradzka, 50-532 Wrocław, Poland",
                "address_line1": "Sieradzka",
                "address_line2": "50-532 Wrocław, Poland",
                "timezone": {
                    "name": "Europe/Warsaw",
                    "offset_STD": "+01:00",
                    "offset_STD_seconds": 3600,
                    "offset_DST": "+02:00",
                    "offset_DST_seconds": 7200,
                    "abbreviation_STD": "CET",
                    "abbreviation_DST": "CEST"
                },
                "plus_code": "9F3V32VM+49",
                "plus_code_short": "VM+49 Wrocław, Lower Silesian Voivodeship, Poland",
                "rank": {
                    "importance": 0.0533433333333333,
                    "confidence": 0,
                    "match_type": "full_match"
                },
                "place_id": "518ca8e4f7910831405904caa65ce18b4940f00102f9017046101e00000000c002049203095369657261647a6b61"
            }
        }
    ]);
    const [mapCenter] = useState([51.110307, 17.033225]);
    const [routeCoordinates, setRouteCoordinates] = useState([]);
    const [isEditing, setIsEditing] = useState(true);
    const [firstGroup, setFirstGroup] = useState([]);
    const [secondGroup, setSecondGroup] = useState([]);
    const [firstGroupRoute, setFirstGroupRoute] = useState([]);
    const [secondGroupRoute, setSecondGroupRoute] = useState([]);

    const handleChange = (e, index) => {
        const newValues = [...listOfLocations];
        newValues[index] = e.target.value;
        setListOfLocations(newValues);
    };
    const handleAddInput = () => {
        if(listOfLocations.at(-1) === "") return; 
        setListOfLocations([...listOfLocations, {id: new Date()}]);
    };

    const remove = (id) => {
        setListOfLocations((prevListOfLocations) => prevListOfLocations.filter((location) => location.id !== id));
    };

    const makeRequest = async () => {
        const message = listOfLocations;
        const response = await fetch('http://localhost:3000/run-script', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: message }),
        });
        const data = await response.json();
        if (Array.isArray(data.sortedLocations)) {
            setSugerowanaTrasa(data.sortedLocations);
            setIsEditing(false);


            const firstGroup = [];
            const secondGroup = [];
            let isSettingFirstGrup = true;
            data.sortedLocations.forEach(location => {
                if(isSettingFirstGrup){
                    if (location.id !== listOfLocations[0].id)
                        firstGroup.push(location);
                    else{
                        firstGroup.unshift(location);
                        isSettingFirstGrup = false;
                    }       
                }else{
                    if (location.id !== listOfLocations[0].id)
                        secondGroup.push(location);
                    else{
                        secondGroup.unshift(location);
                        isSettingFirstGrup = true;
                    }
                }
            });
            setFirstGroup(firstGroup);
            setSecondGroup(secondGroup);
        } else {
            console.error('sortedLocations is not an array:', data.sortedLocations);
        }
    };

    const FitMapToBounds = ({ locations }) => {
        const map = useMap();

        useEffect(() => {
            if (locations.length > 0) {
                const bounds = locations.map(location => {
                    if (!location.others || !location.others.lat || !location.others.lon) {
                        return null;
                    }
                    return [location.others.lat, location.others.lon];
                });
                if(bounds.includes(null)) return;
                map.fitBounds(bounds);  
            }
        }, [locations, map]);

        return null;
    };

    const fetchRoute = async (firstLocation, secondLocation) => {
        if (listOfLocations.length > 1) {
            const response = await fetch(`http://localhost:5000/route/v1/driving/${firstLocation.lon},${firstLocation.lat};${secondLocation.lon},${secondLocation.lat}?overview=full&geometries=geojson`);
            const data = await response.json();

            if (data.routes.length > 0) {
                const coordinates = data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]); // Zamień kolejność lat/lon na lon/lat
                return coordinates;
            }
        }
    };

    const getRouteCoordinates = async() => {
        if(sugerowanaTrasa.length < 2) return;
        let allRoutes = [];
        for(let i=0; i<sugerowanaTrasa.length; i++){
            if(i+1 === sugerowanaTrasa.length){
                const firstLocation = sugerowanaTrasa[i].others;
                const secondLocation = sugerowanaTrasa[0].others;
                const resp = await fetchRoute(firstLocation, secondLocation);
                allRoutes.push(resp);
            }else{
                const firstLocation = sugerowanaTrasa[i].others;
                const secondLocation = sugerowanaTrasa[i+1].others;
                const resp = await fetchRoute(firstLocation, secondLocation);
                allRoutes.push(resp);
            }
        }
        setRouteCoordinates(allRoutes);
    };

    const getRouteCoordTest = async(group, setGroup) => {
        if(group.length < 2) return;
        let allRoutes = [];
        for(let i=0; i<group.length; i++){
            if(i+1 === group.length){
                const firstLocation = group[i].others;
                const secondLocation = group[0].others;
                const resp = await fetchRoute(firstLocation, secondLocation);
                allRoutes.push(resp);
            }else{
                const firstLocation = group[i].others;
                const secondLocation = group[i+1].others;
                const resp = await fetchRoute(firstLocation, secondLocation);
                allRoutes.push(resp);
            }
        }
        setGroup(allRoutes);
    };




    useEffect(() => {
        getRouteCoordinates();
    }, [sugerowanaTrasa]);
    
    useEffect(() => {
        getRouteCoordTest(firstGroup, setFirstGroupRoute);
    }, [firstGroup]);

    useEffect(() => {
        getRouteCoordTest(secondGroup, setSecondGroupRoute);
    }, [secondGroup]);

    

    return (
        <>
        {/* <h1 style={{display: 'flex', alignItems: 'center', color: 'white'}}>Kocham Amelkę 😊❤️</h1> */}
        <div className='flex-container'>
        <div className={`grid-container ${listOfLocations.length > 8 ? listOfLocations.length > 16 ? 'three-columns' :'two-columns' : 'one-column'}`}>
            {/* <div className='inputs'>  */}
                {listOfLocations.map((value, index) => (
                    <div key={value.id} onChange={()=>setIsEditing(true)}>
                        <AutoCompleteInput 
                            exercise={value} 
                            setSelectedExercises={setListOfLocations} 
                            setItem={(location) => handleChange(location, index)} 
                            initialValue={value} 
                            remove={() => remove(value.id)} 
                        />
                    </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
                <button onClick={handleAddInput}>Add input</button>
                <button onClick={() => makeRequest()}>Run Script</button>
                </div>
            </div>  
            <div style={{ width: '500px', height: '500px' }}>
                <MapContainer center={mapCenter} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                   
                    {sugerowanaTrasa && sugerowanaTrasa.length>0 && !isEditing ?  
                    <>
                        {sugerowanaTrasa.map((location, index) => (
                            location?.others?.lat && location?.others?.lon ?
                            <Marker key={index} position={[location?.others?.lat, location?.others?.lon]} icon={defaultIcon}>
                                <Popup>{index+". "+location.location}</Popup>
                            </Marker> : null  )) }
                            <FitMapToBounds locations={sugerowanaTrasa} />
                    </>
                    :
                        <>
                        {console.log(listOfLocations)}
                        {listOfLocations.map((location, index) => (
                            location?.others?.lat && location?.others?.lon ?
                            <Marker key={index} position={[location?.others?.lat, location?.others?.lon]} icon={defaultIcon}>
                                <Popup>{location.location}</Popup>
                            </Marker> : null  ))  }
                            <FitMapToBounds locations={listOfLocations} /> 
                        </>
                    }
                    
                    {routeCoordinates.length > 0 && !isEditing && <Polyline positions={routeCoordinates} color="blue" />}
                    {/* {firstGroupRoute.length > 0 && !isEditing && <Polyline positions={firstGroupRoute} color="red" />} */}
                    {/* {secondGroupRoute.length > 0 && !isEditing && <Polyline positions={secondGroupRoute} color="green" />} */}
                </MapContainer>
            </div>
        </div>
        </>
    );
}

export default MainActivity;
