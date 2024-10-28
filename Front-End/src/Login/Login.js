import styles from './Login.module.css';
import { useState, useContext } from 'react'
import {useNavigate} from 'react-router-dom'
import { GlobalContext } from '../GlobalContext';

const Login = () => {
    const {supabase } = useContext(GlobalContext);
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const tryLogin = async () => {
        let { data, error } = await supabase.auth.signInWithPassword({
        email: 'konrad.pempera@gmail.com',
        password: '123456'
        })
        if(data){
            console.log(data);
            // navigate('/mainpage');
        }
    }

    const registerClick = () => {
        navigate('/register');
    }

    return (
        <div className={styles.background}>
            <div className={styles.navbar}>
                <div className = {styles.title}>
                    Mniej kilometrów,<br/> więcej zadowolenia
                </div>
            </div>
            <div className={styles.loginSection}>
                <div className={styles.name}>
                    Zaloguj się
                </div>
                <div className={styles.wholeInput}>
                    <div className={styles.inputName}>
                        Login
                    </div>
                    <input value={login} type="text" placeholder="Login" className={styles.input} onChange={(e)=>setLogin(e.target.value)}/>
                </div>
                <div className={styles.wholeInput}>
                    <div className={styles.inputName}>
                        Hasło
                    </div>
                    <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" placeholder="Hasło" className={styles.input}/>
                </div>
                <button className={styles.login} onClick={tryLogin}> Zaloguj </button>
                <div className={styles.dontHaveAccountContainer}>
                    <div className={styles.spacer}></div>
                    Nie masz konta?
                    <div className={styles.spacer}></div>
                </div>
                <button onClick={registerClick} className={styles.register}> Zarejestruj </button>
            </div>
            <div className={styles.footer}>
            </div>
        </div>
    );
}
export default Login;
