import React, { useState, useEffect } from 'react';
import '../MainActivity.css';
import AutoCompleteInput from '../AutoCompleteInput';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import { useContext } from 'react';
import L from 'leaflet'; // Importujemy Leaflet do niestandardowej ikony
import 'leaflet/dist/leaflet.css';
import markerIconPng from 'leaflet/dist/images/marker-icon.png'; // Import domyślnego markera
import markerShadowPng from 'leaflet/dist/images/marker-shadow.png'; // Import cienia markera
import { FaTruck } from "react-icons/fa";
import { GlobalContext } from '../GlobalContext';

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

function SavedRoute() {
    const {supabase } = useContext(GlobalContext);
    const [sugerowanaTrasa, setSugerowanaTrasa] = useState([]);
    const [listOfLocations, setListOfLocations] = useState([]);
    const [mapCenter] = useState([51.110307, 17.033225]);
    const colors = ['#08ff00', '#ff0800', '#fff700', '#00e8ff', '#00e8ff',
        '#ff00f7', '#000000'];
    const [groups, setGroups] = useState([]);
    const [groupsRoute, setGroupsRoute] = useState([]);
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
        if (groups.length > 0) {
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
                setGroupsRoute(groupRoutes2);
            }
        };
        fetchRoutes(); 
        const groupToFit = [];
        for(const groupX of groups){
            for(const locationX of groupX){
                groupToFit.push(locationX);
            }
        }
        setListOfLocations(groupToFit);
            
    }, [groups]);
    
    useEffect(() => {
        const fetchRoute = async () => {
            const { data, error } = await supabase
                .from('saved_routes')
                .select('data')
                .eq('id', 12);
            if (error) {
                console.log(error);
            }
            else {
                if(data && data[0] && data[0].data){
                    const parsed = JSON.parse(data[0].data);
                    if(parsed&&parsed.length > 0){
                        setGroups(parsed);
                    }
                }
            }
        }
        fetchRoute();
    }, []);

    return (
        <>
            <div className={`${listOfLocations.length <= 8 ?  'flex-container':'flex-container-column'}`}>
                <div style={{ width: '100%', height: '700px', display: 'flex', flexDirection: 'column', gap: '30px', flex: '1' }}>
                    <MapContainer key={listOfLocations.length} center={mapCenter} zoom={13} scrollWheelZoom={false} style={{height: '600px', width: '100%' }}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                    
                        <>
                            {listOfLocations.map((location, index) => (
                                location?.others?.lat && location?.others?.lon ?
                                <Marker key={index} position={[location?.others?.lat, location?.others?.lon]} icon={index === 0 ? baseIcon: defaultIcon}>
                                    <Popup>{location.location}</Popup>
                                </Marker> : null  ))  }
                                <FitMapToBounds locations={listOfLocations} /> 
                        </>
                        {groupsRoute.length > 0  && groupsRoute.map((route, routeIndex) => (
                            route.map((coords, index) => (
                                <Polyline key={index} positions={coords} color={colors[routeIndex]} />
                            ))
                        ))    
                        }
                    </MapContainer> 
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

export default SavedRoute;
