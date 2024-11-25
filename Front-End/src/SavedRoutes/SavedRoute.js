import React, { useState, useEffect } from 'react';
import styles from '../MainActivity.module.css';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import { useContext } from 'react';
import L from 'leaflet'; // Importujemy Leaflet do niestandardowej ikony
import 'leaflet/dist/leaflet.css';
import markerIconPng from 'leaflet/dist/images/marker-icon.png'; // Import domyślnego markera
import markerShadowPng from 'leaflet/dist/images/marker-shadow.png'; // Import cienia markera
import { FaTruck } from "react-icons/fa";
import { GlobalContext } from '../GlobalContext';
import { useNavigate, useParams } from 'react-router-dom';

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
    const routeID =  useParams().id;
    const navigate = useNavigate();
    const [listOfLocations, setListOfLocations] = useState([]);
    const [mapCenter] = useState([51.110307, 17.033225]);
    const colors = ['#007bff', '#dc3545', '#ffc107', '#28a745', '#6f42c1', '#343a40', '#f8f9fa'];

    const [groups, setGroups] = useState([]);
    const [groupsRoute, setGroupsRoute] = useState([]);
    const [modal, setModal] = useState(false);
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
                .eq('id', routeID);
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
                if(data.length === 0){
                    setModal(true);
                }
            }
        }
        fetchRoute();
    }, []);

    const Modal = () => {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0,0,0,0.5)'
            }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '20px',
                    backgroundColor: '#fff',
                    borderRadius: '5px',
                    width: '50%',
                    height: '50%',
                    overflow: 'auto',
                    fontFamily: 'Montserrat-Bold',
                }}>
                    <p>Nieautoryzowany dostęp</p>
                    
                    <button style={
                        {
                            fontSize: '14px',
                            fontFamily: 'Montserrat-Bold',
                            color: 'white',
                            backgroundColor: '#7D9F81',
                            border: '0px',
                            width: '30%',
                            borderRadius: '10px',
                            padding: '10px 20px',
                            letterSpacing: '0.25em',
                            textTransform: 'uppercase',
                            margin: '20px 0px',
                            border: '1px solid #7D9F81'
                        }

                    } onClick={() => navigate("/mainpage")}>Zamknij</button>
                </div>
            </div>
        );
    }

    return (
        <>  
        {modal ? <Modal /> : 
        <>
           <div className={`${listOfLocations.length <= 6 ? styles['flex-container'] : styles['flex-container-column']}`}>
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
            <div className={styles.routesList}>
                {groups.length > 0  && groups.map((route, routeIndex) => (
                        <div className={styles.routeList} key={routeIndex}>
                            <div style={{
                                        textAlign: 'center',
                                        fontWeight: 'bold',
                                        fontSize: '20px',
                                        
                                    }}>
                                Trasa nr {routeIndex + 1} {/* Dodany napis */}
                            </div>
                            <div className={styles.emoticoneDiv}>
                                <FaTruck style={{color: colors[routeIndex]}}/>
                            </div>
                            <ol>
                            {route.map((coords, index) => (
                                <div style={index === 0 || index === route.length-1? { fontWeight: 'bold' } : {}}>
                                    
                                        <li>{coords.location}</li>
                                    
                                </div>
                            ))}
                            </ol>
                        </div>
                            
                        ))    
                        }
                </div>
            </>
            }
        </>
    );
}

export default SavedRoute;
