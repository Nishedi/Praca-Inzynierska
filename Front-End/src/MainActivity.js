import React, { useState, useEffect } from 'react';
import './MainActivity.css';
import AutoCompleteInput from './AutoCompleteInput';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import { useContext } from 'react';
import L from 'leaflet'; // Importujemy Leaflet do niestandardowej ikony
import 'leaflet/dist/leaflet.css';
import markerIconPng from 'leaflet/dist/images/marker-icon.png'; // Import domyślnego markera
import markerShadowPng from 'leaflet/dist/images/marker-shadow.png'; // Import cienia markera
import { FaTruck } from "react-icons/fa";
import { GlobalContext } from './GlobalContext';

// Ustawienie ikony markera
const defaultIcon = L.icon({
    iconUrl: markerIconPng,
    shadowUrl: markerShadowPng,
    iconSize: [25, 41], // Rozmiar markera
    iconAnchor: [12, 41], // Punkt zakotwiczenia, który wskazuje lokalizację
    popupAnchor: [1, -34], // Punkt zakotwiczenia dla popupu
    shadowSize: [41, 41]  // Rozmiar cienia
});

const baseIcon = L.icon({
    iconUrl: markerIconPng,
    shadowUrl: markerShadowPng,
    color: 'red',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

function MainActivity() {
    const {supabase } = useContext(GlobalContext);
    const [sugerowanaTrasa, setSugerowanaTrasa] = useState([]);
    const [listOfLocations, setListOfLocations] = useState(
        [
            {
                "id": "2024-10-19T15:06:16.679Z",
                "location": "Avenida Poznań, Stanisława Matyi 2, 61-586 Poznan, Poland",
                "others": {
                    "name": "Avenida Poznań",
                    "city": "Poznan",
                    "state": "Greater Poland Voivodeship",
                    "lon": 16.91344156323907,
                    "lat": 52.40071895,
                    "formatted": "Avenida Poznań, Stanisława Matyi 2, 61-586 Poznan, Poland",
                    "address_line1": "Avenida Poznań",
                    "address_line2": "Stanisława Matyi 2, 61-586 Poznan, Poland"
                }
            },
            {
                "id": "2024-10-19T15:06:28.712Z",
                "location": "Wrocławska 41, 81-552 Gdynia, Poland",
                "others": {
                    "name": "Wrocławska 41",
                    "city": "Gdynia",
                    "state": "Pomeranian Voivodeship",
                    "lon": 18.536440421999213,
                    "lat": 54.4838659,
                    "formatted": "Wrocławska 41, 81-552 Gdynia, Poland",
                    "address_line1": "Wrocławska 41",
                    "address_line2": "81-552 Gdynia, Poland"
                }
            },
            {
                "id": "2024-10-19T15:06:39.669Z",
                "location": "Centrostal-Wrocław SA Oddział w Płocku, Kobiałka 7B, 09-411 Płock, Poland",
                "others": {
                    "name": "Centrostal-Wrocław SA Oddział w Płocku",
                    "city": "Płock",
                    "state": "Masovian Voivodeship",
                    "lon": 19.665253525962605,
                    "lat": 52.567319499999996,
                    "formatted": "Centrostal-Wrocław SA Oddział w Płocku, Kobiałka 7B, 09-411 Płock, Poland",
                    "address_line1": "Centrostal-Wrocław SA Oddział w Płocku",
                    "address_line2": "Kobiałka 7B, 09-411 Płock, Poland"
                }
            },
            {
                "id": "2024-10-19T15:06:50.464Z",
                "location": "Wrocławska, 71-034 Szczecin, Poland",
                "others": {
                    "name": "Wrocławska",
                    "city": "Szczecin",
                    "state": "West Pomeranian Voivodeship",
                    "lon": 14.4916328,
                    "lat": 53.4170392,
                    "formatted": "Wrocławska, 71-034 Szczecin, Poland",
                    "address_line1": "Wrocławska",
                    "address_line2": "71-034 Szczecin, Poland"
                }
            },
            {
                "id": "2024-10-19T15:07:00.037Z",
                "location": "Zielona Góra, Wrocławska, 65-427 Zielona Góra, Poland",
                "others": {
                    "name": "Zielona Góra",
                    "city": "Zielona Góra",
                    "state": "Lubusz Voivodeship",
                    "lon": 15.5131728,
                    "lat": 51.9377399,
                    "formatted": "Zielona Góra, Wrocławska, 65-427 Zielona Góra, Poland",
                    "address_line1": "Zielona Góra",
                    "address_line2": "Wrocławska, 65-427 Zielona Góra, Poland"
                }
            },
            {
                "id": "2024-10-19T15:07:08.360Z",
                "location": "Wrocławska, 01-466 Warsaw, Poland",
                "others": {
                    "name": "Wrocławska",
                    "city": "Warsaw",
                    "state": "Masovian Voivodeship",
                    "lon": 20.921425,
                    "lat": 52.2494093,
                    "formatted": "Wrocławska, 01-466 Warsaw, Poland",
                    "address_line1": "Wrocławska",
                    "address_line2": "01-466 Warsaw, Poland"
                }
            },
            {
                "id": "2024-10-19T15:07:28.217Z",
                "location": "Muzeum Podlaskie w Białymstoku - Ratusz, 10, 15-091 Białystok, Poland",
                "others": {
                    "name": "Muzeum Podlaskie w Białymstoku - Ratusz",
                    "city": "Białystok",
                    "state": "Podlaskie Voivodeship",
                    "lon": 23.1587714,
                    "lat": 53.1323898,
                    "formatted": "Muzeum Podlaskie w Białymstoku - Ratusz, 10, 15-091 Białystok, Poland",
                    "address_line1": "Muzeum Podlaskie w Białymstoku - Ratusz",
                    "address_line2": "10, 15-091 Białystok, Poland"
                }
            },
            {
                "id": "2024-10-19T15:07:40.812Z",
                "location": "Wrocławska, 31-307 Krakow, Poland",
                "others": {
                    "name": "Wrocławska",
                    "city": "Krakow",
                    "state": "Lesser Poland Voivodeship",
                    "lon": 19.915423,
                    "lat": 50.0822108,
                    "formatted": "Wrocławska, 31-307 Krakow, Poland",
                    "address_line1": "Wrocławska",
                    "address_line2": "31-307 Krakow, Poland"
                }
            },
            {
                "id": "2024-10-19T15:07:48.568Z",
                "location": "Wrocławska, 26-603 Radom, Poland",
                "others": {
                    "name": "Wrocławska",
                    "city": "Radom",
                    "state": "Masovian Voivodeship",
                    "lon": 21.1898445,
                    "lat": 51.4011654,
                    "formatted": "Wrocławska, 26-603 Radom, Poland",
                    "address_line1": "Wrocławska",
                    "address_line2": "26-603 Radom, Poland"
                }
            },
            {
                "id": "2024-10-19T15:07:58.365Z",
                "location": "Wrocławska, 40-219 Katowice, Poland",
                "others": {
                    "name": "Wrocławska",
                    "city": "Katowice",
                    "state": "Silesian Voivodeship",
                    "lon": 19.0492897,
                    "lat": 50.2665035,
                    "formatted": "Wrocławska, 40-219 Katowice, Poland",
                    "address_line1": "Wrocławska",
                    "address_line2": "40-219 Katowice, Poland"
                }
            },
            {
                "id": "2024-10-19T15:08:01.502Z",
                "location": "Poznańska, 53-630 Wrocław, Poland",
                "others": {
                    "name": "Poznańska",
                    "city": "Wrocław",
                    "state": "Lower Silesian Voivodeship",
                    "lon": 17.0076417,
                    "lat": 51.1181114,
                    "formatted": "Poznańska, 53-630 Wrocław, Poland",
                    "address_line1": "Poznańska",
                    "address_line2": "53-630 Wrocław, Poland"
                }
            },
            {
                "id": "2024-10-19T15:08:12.635Z",
                "location": "Krasińskiego, Przemyśl, Subcarpathian Voivodeship, Poland",
                "others": {
                    "name": "Krasińskiego",
                    "city": "Przemyśl",
                    "state": "Subcarpathian Voivodeship",
                    "lon": 22.7720839,
                    "lat": 49.7892064,
                    "formatted": "Krasińskiego, Przemyśl, Subcarpathian Voivodeship, Poland",
                    "address_line1": "Krasińskiego",
                    "address_line2": "Przemyśl, Subcarpathian Voivodeship, Poland"
                }
            },
            {
                "id": "2024-10-19T15:11:57.158Z",
                "location": "Wrocławska, 16-402 Suwałki, Poland",
                "others": {
                    "name": "Wrocławska",
                    "city": "Suwałki",
                    "state": "Podlaskie Voivodeship",
                    "lon": 22.9199991,
                    "lat": 54.0771662,
                    "formatted": "Wrocławska, 16-402 Suwałki, Poland",
                    "address_line1": "Wrocławska",
                    "address_line2": "16-402 Suwałki, Poland"
                }
            },
            {
                "id": "2024-10-19T15:12:15.096Z",
                "location": "Gdańska, 75-438 Koszalin, Poland",
                "others": {
                    "name": "Gdańska",
                    "city": "Koszalin",
                    "state": "West Pomeranian Voivodeship",
                    "lon": 16.2453236,
                    "lat": 54.2235076,
                    "formatted": "Gdańska, 75-438 Koszalin, Poland",
                    "address_line1": "Gdańska",
                    "address_line2": "75-438 Koszalin, Poland"
                }
            },
            {
                "id": "2024-10-19T15:13:55.052Z",
                "location": "Wrocławska, 63-460 Kalisz, Poland",
                "others": {
                    "name": "Wrocławska",
                    "city": "Kalisz",
                    "state": "Greater Poland Voivodeship",
                    "lon": 18.0280612,
                    "lat": 51.7279325,
                    "formatted": "Wrocławska, 63-460 Kalisz, Poland",
                    "address_line1": "Wrocławska",
                    "address_line2": "63-460 Kalisz, Poland"
                }
            },
            {
                "id": "2024-10-19T15:13:57.224Z",
                "location": "Sieradzka, 50-532 Wrocław, Poland",
                "others": {
                    "name": "Sieradzka",
                    "city": "Wrocław",
                    "state": "Lower Silesian Voivodeship",
                    "lon": 17.0334773,
                    "lat": 51.092815,
                    "formatted": "Sieradzka, 50-532 Wrocław, Poland",
                    "address_line1": "Sieradzka",
                    "address_line2": "50-532 Wrocław, Poland"
                }
            }
        ])
    const [mapCenter] = useState([51.110307, 17.033225]);
    const [isEditing, setIsEditing] = useState(true);
    const [isOptimizing, setIsOptimizing] = useState(false);
    const colors = ['#08ff00', '#ff0800', '#fff700', '#00e8ff', '#00e8ff',
        '#ff00f7', '#000000'];

    const [groups, setGroups] = useState([]);
    const [groupsRoute, setGroupsRoute] = useState([]);
    const [numberOfvehicles, setNumberOfVehicles] = useState(1);
    const [timeLeft, setTimeLeft] = useState(0);
    const [timeOfExecution, setTimeOfExecution] = useState(10);
    const [saveRouteDrawing, setSaveRouteDrawing] = useState("Zapisz trasę");
    const [activeRoute, setActiveRoute] = useState(null);  


    useEffect(() => {
        if (timeLeft <= 0) {
            return;
        }

        const interval = setInterval(() => {
            setTimeLeft(prevTime => prevTime - 1); 
        }, 1000);

        return () => clearInterval(interval);
    }, [timeLeft]);

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

    const getSuggestedNumberOfVehicles = async () => {
        const message = listOfLocations.filter(location => 
            location.location && location.location.trim() !== ""
        );
        const response = await fetch('http://localhost:3000/suggest-vehicles', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: message }),
        });
        const data = await response.json();
        if(data?.numberOfvehicles){
            setNumberOfVehicles(data.numberOfvehicles);
        } 
    };
    
    const saveRoute = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        const id = session?.user?.id;
        if (!id) {
            console.error('Użytkownik nie jest zalogowany.');
            return;
        }
    
        if (!groups || groups.length === 0) return;
    
        const { data, error } = await supabase
            .from('saved_routes')
            .insert([
                {
                    user_id: id, // Dodaj user_id, jeśli jest wymagane przez politykę RLS
                    created_at: new Date().toISOString(),
                    data: JSON.stringify(groups),
                }
            ])
            .select();
    
        if (error) {
            console.error('Error saving route:', error);
        } else {
            setSaveRouteDrawing('Zapisano!');
            const interval = setInterval(() => {
                setSaveRouteDrawing('Zapisz trasę');
            }, 10000);
        }
    };
    

    useEffect(() => {
        getSuggestedNumberOfVehicles();
    }, [listOfLocations.length]);

    const makeRequest = async () => {
        setIsOptimizing(true);
        setTimeLeft(timeOfExecution);
        const message = listOfLocations.filter(location => 
            location.location && location.location.trim() !== ""
        );
        const filteredListOfLocations = message.map(location =>({
            id: location.id,
            location: location.location,
            others: {
                name: location.others.name,
                city: location.others.city,
                state : location.others.state,
                lon: location.others.lon,
                lat: location.others.lat,
                formatted: location.others.formatted,
                address_line1: location.others.address_line1,
                address_line2: location.others.address_line2
            }
        }))
        setListOfLocations(filteredListOfLocations);
        const response = await fetch('http://localhost:3000/run-script', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: filteredListOfLocations, numberOfvehicles: numberOfvehicles, timeOfExecution: timeOfExecution }),
        });
        const data = await response.json();
        if(data?.result){
            const routes = [];
            data.result.map((route, index) => {
                route.unshift(listOfLocations[0]);
                route.push(listOfLocations[0]);
                routes.push(route);

            });
            setGroups(routes);
        }
        setIsOptimizing(false);
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
                }).filter(Boolean); // Filter out any null values
                
                if (bounds.length > 0) {
                    map.fitBounds(bounds);  
                }
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

    const getRouteCoordTest = async(group) => {
        if(group.length < 2) return;
        let allRoutes = [];
        for(let i=0; i<group.length-1; i++){
            const firstLocation = group[i].others;
            const secondLocation = group[i+1].others;
            const resp = await fetchRoute(firstLocation, secondLocation);
            allRoutes.push(resp);
        }
        return allRoutes;
    };


    useEffect(() => {
        const fetchRoutes = async () => {
            const groupRoutes2 = [];
            if (groups.length > 0) {
                for (const group of groups) {
                    const route = await getRouteCoordTest(group); 
                    groupRoutes2.push(route);
                }
                setIsEditing(false);
                setGroupsRoute(groupRoutes2);
            }
        };
        fetchRoutes(); 
    }, [groups]);    

    useEffect(() => {
        setIsEditing(true);
    }, [listOfLocations.length]);

    return (
        <>
            <div className={`${listOfLocations.length <= 8 ?  'flex-container':'flex-container-column'}`}>
                <div className='input_section'>
                    
                    <div className="localisation_title">Lokalizacje</div>
                    <div className={`grid-container ${listOfLocations.length > 8 ? listOfLocations.length > 16 ? 'three-columns' :'two-columns' : 'one-column'}`}>
                        {listOfLocations.map((value, index) => (
                            <div key={value.id} onChange={()=>setIsEditing(true)}>
                                <AutoCompleteInput 
                                    exercise={value} 
                                    setSelectedExercises={setListOfLocations} 
                                    setItem={(location) => handleChange(location, index)} 
                                    initialValue={value} 
                                    onChange={()=>setIsEditing(true)}
                                    remove={() => remove(value.id)} 
                                />
                            </div>
                        ))}
                       
                    </div> 
                    <button className='addButton' onClick={handleAddInput}>Add input</button> 
                    
                    <button
                        className='optymaliseButton'
                        onClick={() => makeRequest()}
                        disabled={isOptimizing}  // Przycisk będzie nieklikalny, gdy isOptimizing jest true
                        >
                        {!isOptimizing ? 'Optymalizuj' : `Trwa optymalizacja...${timeLeft > 0 ? timeLeft: ''}`}
                        </button>
                    <div className='allParameters'>
                    <div className='parameters'>DODATKOWE PARAMETRY</div>
                    <div className='optional'>
                        <div className='optionalText'>
                            <div>Sugerowana liczba pojazdów: </div>
                            <div>Czas działania: </div>
                        </div>
                        <div className='optionalInput' >
                            <input type="number" value={numberOfvehicles} onChange={(e) => setNumberOfVehicles(e.target.value)} />
                            <div className="sliderContainer">
                                <input type="range" min="0" max="100" value={timeOfExecution} onChange={(e) => setTimeOfExecution(e.target.value)} />
                                <span className="sliderValue">{timeOfExecution}</span>
                            </div>
                        </div>
                        
                    </div>
                    </div>
                </div>
                <div style={{ width: '100%', height: '700px', display: 'flex', flexDirection: 'column', gap: '30px', flex: '1' }}>
                    <MapContainer key={listOfLocations.length} center={mapCenter} zoom={13} scrollWheelZoom={false} style={{height: '600px', width: '100%' }}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                    
                        {sugerowanaTrasa && sugerowanaTrasa.length>0 && !isEditing ?  
                        <>
                            {sugerowanaTrasa.map((location, index) => (
                                location?.others?.lat && location?.others?.lon ?
                                <Marker key={index} position={[location?.others?.lat, location?.others?.lon]} icon={index === 0 ? baseIcon: defaultIcon}>
                                    <Popup>{index+". "+location.location}</Popup>
                                </Marker> : null  )) }
                                <FitMapToBounds locations={sugerowanaTrasa} />
                        </>
                        :
                            <>
                            {listOfLocations.map((location, index) => (
                                location?.others?.lat && location?.others?.lon ?
                                <Marker key={index} position={[location?.others?.lat, location?.others?.lon]} icon={index === 0 ? baseIcon: defaultIcon}>
                                    <Popup>{location.location}</Popup>
                                </Marker> : null  ))  }
                                <FitMapToBounds locations={listOfLocations} /> 
                            </>
                        }
                        {!isEditing && groupsRoute.length > 0  && groupsRoute.map((route, routeIndex) => (
                            route.map((coords, index) => (
                                <Polyline key={index} positions={coords} color={colors[routeIndex]} />
                            ))
                        ))    
                        }
                    </MapContainer>
                    {groups && groups.length>0&&<button onClick={saveRoute} className='saveRoute'>{saveRouteDrawing}</button> }
                    
                </div>
                
            </div>
            <div className='routesList'>
                {groups.length > 0  && groups.map((route, routeIndex) => (
                        <div className='routeList'>
                            <div className='emoticoneDiv'>
                                <FaTruck style={{color: colors[routeIndex]}}/>
                            </div>
                            
                            {route.map((coords, index) => (
                                <div style={index === 0 || index === route.length-1? { fontWeight: 'bold' } : {}}>
                                    
                                    {index}. {coords.location}
                                </div>
                            ))}
                        </div>
                            
                        ))    
                        }
                </div>
        </>
    );
}

export default MainActivity;
