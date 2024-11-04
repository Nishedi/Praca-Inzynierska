import styles from './Login.module.css';
import { useState, useContext } from 'react'
import {useNavigate} from 'react-router-dom'
import { GlobalContext } from '../GlobalContext';

const Register = () => {
    const {supabase } = useContext(GlobalContext);
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [numberOfVehicles, setNumberOfVehicles] = useState("");
    const navigate = useNavigate();
   
    const tryRegister = async () => {
        let { data, error } = await supabase.auth.signUp({
            // email: 'minecraftkonrad872@gmail.com',
            // password: 'TestCzemu!123'
            email: '263948@student.pwr.edu.pl',
            password: 'TestCzemu!123'
        });
    
        if (error) {
            console.error('Error during sign-up:', error);
            return;
        }
    
        if (data?.user) {
            // Bezpośrednio po rejestracji użyj data.user, a nie session
            const id = data.user.id;
            console.log('User ID:', data?.user?.id);
    
            const { data: data2, error: insertError } = await supabase
                .from('users_details')
                .insert([
                    {
                        user_id: id,
                        test: 'someValue'
                    }
                ])
                .select();
    
            if (insertError) {
                console.error('Error inserting user details:', insertError);
            } else {
                console.log('User details inserted:', data2);
            }
    
            navigate('/mainpage');
        }
    };
    

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
                <div className={styles.wholeInput}>
                    <div className={styles.inputName}>
                        Imię
                    </div>
                    <input value={name} type="text" placeholder="Podaj imię" className={styles.input}/>
                </div>
                <div className={styles.wholeInput}>
                    <div className={styles.inputName}>
                        Nazwisko
                    </div>
                    <input value={surname} type="text" placeholder="Podaj nazwisko" className={styles.input}/>
                </div>
                <div className={styles.wholeInput}>
                    <div className={styles.inputName}>
                        Liczba pojazdów
                    </div>
                    <input  value={numberOfVehicles} onChange={(e)=>setNumberOfVehicles(e.target.value)} type="number" placeholder="Liczba pojadów" className={styles.input}/>
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
