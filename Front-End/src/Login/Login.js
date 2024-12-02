import styles from './Login.module.css';
import { useState, useContext } from 'react'
import {useNavigate} from 'react-router-dom'
import { GlobalContext } from '../GlobalContext';

const Login = () => {
    const {supabase } = useContext(GlobalContext);
    const [login, setLogin] = useState("minecraftkonrad872@gmail.com");
    const [password, setPassword] = useState("TestCzemu!123");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const tryLogin = async () => {
        // email: 'konrad.pempera@gmail.com',
        // password: '123456'
        let { data, error } = await supabase.auth.signInWithPassword({
        // email: 'konrad.pempera@gmail.com',
        // password: '123456'
        email: login,
        password: password
        })
        if(data.user){
            console.log(data);
            navigate('/mainpage');
        }else{
            setError(error.code);
            console.log(error.code);
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
                {/* {passwordError === 'tooShort' && <div className={styles.inputName} style={errorStyle} > Hasło jest za krótkie </div>} */}
                    <div className={styles.inputName} style={{ color: error !== ''? 'red' : '#777'}} >
                        E-mail
                    </div>
                    <input
                        style={{ borderColor: error !== ''? 'red' : '#777'}} 
                        value={login} type="text" placeholder="E-mail" className={styles.input} onChange={(e)=>setLogin(e.target.value)}/>
                </div>
                <div className={styles.wholeInput}>
                    <div className={styles.inputName} style={{ color: error !== ''? 'red' : '#777'}} >
                        Hasło
                    </div>
                    <input 
                        style={{ borderColor: error !== ''? 'red' : '#777'}} 
                        value={password} onChange={(e)=>setPassword(e.target.value)} 
                        type="password" placeholder="Hasło" className={styles.input}/>
                </div>
                {error === 'invalid_credentials' && <div className={styles.inputName} style={{color: 'red', fontSize: '12px'}} > Niepoprawny e-mail lub hasło </div>}
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
