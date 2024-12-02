import styles from './SavedRoutes.module.css';
import { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../GlobalContext';
import { useNavigate } from 'react-router-dom';
import SavedRoute from './SavedRoute';
const SavedRouteView = () => {
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
    const onYourProfileClick = () => {
        navigate("/yourprofile");
    };

    const onOptimalizeRouteClick = () => {
        navigate("/mainpage");
    };

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
                Wprowadź lokalizacje
            </div>
            <SavedRoute/>
        </div>
    );
}

export default SavedRouteView;    