import styles from './SavedRoutes.module.css';
import { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../GlobalContext';
import { useNavigate } from 'react-router-dom';
const SavedRoutes = () => {
    const {supabase} = useContext(GlobalContext);
    const navigate = useNavigate();
    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            const id = session?.user?.id;
            if (!id) {
                navigate("/");
            }
        }
        checkUser();
    }, []);

    const logOut = async () => {
        let { error } = await supabase.auth.signOut()
        if (error) {
            console.log(error);
        }
        else {
            navigate("/mainpage");
        }
    }

    const [routes, setRoutes] = useState([]);

    const getAllRoutes = async () => {
        const { data, error } = await supabase
            .from('saved_routes')
            .select('*')
        if (error) {
            console.log(error);
        }
        else {
            setRoutes(data);
        }
    }

    useEffect(() => {
        getAllRoutes();
    }, []);

    const onYourProfileClick = () => {
        navigate("/yourprofile");
    };

    const onOptimalizeRouteClick = () => {
        navigate("/mainpage");
    };

    return (
        <div className={styles.background}>
            <div className={styles.navbar}>
                <div className = {styles.title}>
                    Mniej kilometrów,<br/> więcej zadowolenia
                </div>
                <div className={styles.bookmarks}>
                    <div onClick={onOptimalizeRouteClick} className={styles.bookmark}>
                        Optymalizuj trasę
                    </div>
                    <div onClick={onYourProfileClick} className={styles.bookmark}>
                        Twój profil
                    </div>
                    <div onClick={logOut} className={styles.login}>
                        Wyloguj
                    </div>
                </div>
            </div>
            <div className={styles.mainWritting}>
                Zapisane trasy
            </div>
            <div className = {styles.table} style={{ display: 'table', width: '75%' }}>
                <div className={styles.routeTableHeader}>
                    <div className={styles.routeNumber}>
                        Numer
                    </div>
                    <div className={styles.routeDate}>
                        Data
                    </div>
                    <div className={styles.routePath}>
                        Trasa
                    </div>
                </div>
                {
                    routes.map((route, index) => (
                        <div onClick={()=>navigate(`/savedroute/${route.id}`)}
                            className={styles.routeTableHeaderContent}
                        >
                            <div className={styles.routeNumberContent}>
                                {route.id}
                            </div>
                            <div className={styles.routeDateContent}>
                                {new Date(route.created_at).toLocaleDateString()}
                            </div>
                            {
                            JSON.parse(route.data).map((singleRoute, index) => (
                                <div style={{ fontSize: '12px', flex: 1, border: '1px solid #ddd' }}>
                                    <ol style={{ paddingLeft: '20px' }}> {/* Add padding for indentation */}
                                        {
                                            singleRoute.map((point, index) => (
                                                index !== 0 && index !== singleRoute.length - 1 ?  // Skip first and last points
                                                    <li key={index} className={styles.routePathContent}>
                                                        {point.others.formatted.length > 45
                                                            ? point.others.formatted.slice(0, 45) + '...'
                                                            : point.others.formatted}
                                                    </li>
                                                    : null
                                            ))
                                        }
                                    </ol>
                                </div>
                            ))
                        }

                        </div>
                    ))
                }
            </div>
        </div>
    );
}

export default SavedRoutes;    