import styles from './Login.module.css';
import { useState, useContext } from 'react'
import {useNavigate} from 'react-router-dom'
import { GlobalContext } from '../GlobalContext';

const Register = () => {
    const {supabase } = useContext(GlobalContext);
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();
    const tryRegister = async () => {
        let { data, error } = await supabase.auth.signUp({
            email: 'minecraftkonrad872@gmail.com',
            password: 'TestCzemu!123'
        })
        if(data){
            console.log(data);
            const { data2, error } = await supabase
                .from('users_details')
                .insert([
                    { test: 'someValue' },
                ])
                .select()
            // navigate('/mainpage');
        }
    }

    const loginClick = () => {
        navigate('/');
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
                    Zarejestruj się
                </div>
                <div className={styles.wholeInput}>
                    <div className={styles.inputName}>
                        E-mail
                    </div>
                    <input value={login} type="text" placeholder="Login" className={styles.input} onChange={(e)=>setLogin(e.target.value)}/>
                </div>
                <div className={styles.wholeInput}>
                    <div className={styles.inputName}>
                        Hasło
                    </div>
                    <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" placeholder="Hasło" className={styles.input}/>
                </div>
                <div className={styles.wholeInput}>
                    <div className={styles.inputName}>
                        Powtórz hasło
                    </div>
                    <input value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} type="password" placeholder="Powtórz hasło" className={styles.input}/>
                </div>
                <button className={styles.login} onClick={tryRegister}> Zarejestruj </button>
                <div className={styles.dontHaveAccountContainer}>
                    <div className={styles.spacer}></div>
                    Masz już konto?
                    <div className={styles.spacer}></div>
                </div>
                <button onClick={loginClick} className={styles.register}> Zaloguj </button>
            </div>
            <div className={styles.footer}>
            </div>
        </div>
    );
}
export default Register;
