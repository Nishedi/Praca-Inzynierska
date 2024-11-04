import styles from './YourProfile.module.css';
import { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../GlobalContext';
import { useNavigate } from 'react-router-dom';
const YourProfile = () => {
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

    const onOptimalizeRouteClick = () => {
        navigate("/mainpage");
    };

    const onYourRoutesClick = () => {
        navigate("/savedroutes");
    };

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
                    <div onClick={onOptimalizeRouteClick} className={styles.bookmark}>
                        Optymalizuj trasę
                    </div>
                    <div onClick={onYourRoutesClick} className={styles.bookmark}>
                        Twoje trasy
                    </div>
                    <div onClick={logOut} className={styles.login}>
                        Wyloguj
                    </div>
                </div>
            </div>
            <div className={styles.mainWritting}>
                Twój profil
            </div>
        </div>
    );
}

export default YourProfile;    