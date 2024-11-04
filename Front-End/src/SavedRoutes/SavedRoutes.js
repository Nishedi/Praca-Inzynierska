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

    return (
        <div className={styles.background}>
            <div className={styles.navbar}>
                <div className = {styles.title}>
                    Mniej kilometrów,<br/> więcej zadowolenia
                </div>
                <div className={styles.bookmarks}>
                    <div className={styles.bookmark}>
                        O nas
                    </div>
                    <div className={styles.bookmark}>
                        Optymalizuj trasę
                    </div>
                    <div className={styles.bookmark}>
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
            <div className = {styles.table}>
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
                        <div onClick={()=>navigate("/savedroute/1")} className={styles.routeTableHeaderContent}>
                            <div className={styles.routeNumberContent}>
                                {route.id}
                            </div>
                            <div className={styles.routeDateContent}>
                                {new Date(route.created_at).toLocaleDateString()}
                            </div>
                            {
                                JSON.parse(route.data).map((singleRoute, index) => (
                                    <div style={{fontSize: '12px', flex: 1}}>
                                    {
                                        singleRoute.map((point, index) => (
                                        <div className={styles.routePathContent}>
                                            {index !== 0 && index !== singleRoute.length - 1 ? 
                                            <>
                                            {index}. 
                                            {point.others.formatted.length > 45
                                            ? point.others.formatted.slice(0, 45) + '...'
                                            : point.others.formatted}
                                            </>:null}
                                            
                                        </div>
                                        ))
                                    }
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