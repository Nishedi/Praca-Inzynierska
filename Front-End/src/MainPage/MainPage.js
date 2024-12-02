import styles from './MainPage.module.css';
import MainActivity from '../MainActivity';
import { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../GlobalContext';
import { useNavigate } from 'react-router-dom';

const MainPage = () => {
    const {supabase} = useContext(GlobalContext);
    const [isLogged, setIsLogged] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            const id = session?.user?.id;
            if (id) {
                setIsLogged(true);
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
            setIsLogged(false);
        }
    }

    const onYourProfileClick = () => {
        navigate("/yourprofile");
    };
    
    return (
        <div className={styles.background}>
            <div className={styles.navbar}>
                <div className = {styles.title}>
                    Mniej kilometrów,<br/> więcej zadowolenia
                </div>
                <div className={styles.bookmarks}>
                    
                    {isLogged && 
                    <>
                        <div onClick={()=>navigate("/savedroutes")} className={styles.bookmark}>
                            Twoje trasy
                        </div>
                        <div onClick={onYourProfileClick} className={styles.bookmark}>
                            Twój profil
                        </div>
                        <div onClick={logOut} className={styles.login}>
                        Wyloguj
                        </div>
                    </>
                    }
                    {!isLogged && 
                    <div onClick={()=>navigate("/")} className={styles.login}>
                        Zaloguj
                    </div>
                    }
                </div>
            </div>
            <div className={styles.mainWritting}>
                Wprowadź lokalizacje
            </div>
            <MainActivity isLogged = {isLogged}/>
        </div>
    );
}

export default MainPage;    