import styles from './MainPage.module.css';
import MainActivity from '../MainActivity';

const MainPage = () => {
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
                        Twoje trasy
                    </div>
                    <div className={styles.bookmark}>
                        Twój profil
                    </div>
                    <div className={styles.login}>
                        Wyloguj
                    </div>
                </div>
            </div>
            <div className={styles.mainWritting}>
                Wprowadź lokalizacje
            </div>
            <MainActivity/>
        </div>
    );
}

export default MainPage;    