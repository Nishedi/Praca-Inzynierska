import styles from './Login.module.css';
import { useState, useContext, useEffect } from 'react'
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
    const [passwordError, setPasswordError] = useState('');
    const [emailError, setEmailError] = useState('');

    useEffect(() => {
        setPasswordError('');
    }, [password, confirmPassword]);
   
    const tryRegister = async () => {
        const emailRegex = new RegExp('^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$');
        if (!emailRegex.test(login)) {
            setEmailError('invalid');
            return;
        }

        if (password.length < 8) {
            setPasswordError('tooShort');
            return;
        }
        const regex = new RegExp('(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])');
        if (!regex.test(password)) {
            setPasswordError('notSecure');
            return;
        }

        if (password !== confirmPassword) {
            setPasswordError('notMatching');
            return;
        }
        let { data, error } = await supabase.auth.signUp({
            email: login,
            password: password
        });
    
        if (error) {
            console.error('Error during sign-up:', error);
            if(error.code === 'user_already_exists') {
                setEmailError('alreadyExists');
            }else{
                alert('Wystąpił błąd podczas rejestracji');
            }
            return;
        }
    
        if (data?.user) {
            const id = data.user.id;
            const { data: data2, error: insertError } = await supabase
                .from('users_details')
                .insert([
                    {
                        user_id: id,
                        name: name,
                        surname: surname,
                        number_of_trucks: numberOfVehicles
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

    const errorStyle = {
        color: 'red',
        fontSize: '12px',
        fontFamily: 'Arial'
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
                    <div className={styles.inputName} style={{color:emailError !== ''? 'red' : '#777' }}>
                        E-mail
                    </div>
                    <input value={login} type="text" placeholder="Login" className={styles.input} style={{borderColor: emailError !== ''? 'red' : '#777'}} onChange={(e)=>setLogin(e.target.value)}/>
                    {emailError === 'invalid' && <div className={styles.inputName} style={errorStyle} > Niepoprawny adres e-mail </div>}
                    {emailError === 'alreadyExists' && <div className={styles.inputName} style={errorStyle} > Konto o podanym adresie e-mail już istnieje </div>}
                </div>
                <div className={styles.wholeInput} >
                    <div className={styles.inputName} style={{ color: passwordError === ''? '#777' : 'red'}} >
                        Hasło
                    </div>
                    <input  style={{ borderColor: passwordError !== ''? 'red' : '#777'}} value={password} onChange={(e)=>setPassword(e.target.value)} type="password" placeholder="Hasło" className={styles.input} />
                    {passwordError === 'tooShort' && <div className={styles.inputName} style={errorStyle} > Hasło jest za krótkie </div>}
                    {passwordError === 'notSecure' && <div className={styles.inputName} style={errorStyle} > Hasło musi zawierać co najmniej jedną dużą literę, jedną małą literę, jedną cyfrę oraz jeden znak specjalny </div>}
                </div>
                <div className={styles.wholeInput}>
                    <div className={styles.inputName} style={{ color: passwordError === 'notMatching'? 'red' : '#777'}} >
                        Powtórz hasło
                    </div>
                    <input style={{ borderColor: passwordError === 'notMatching'? 'red' : '#777'}}  value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} type="password" placeholder="Powtórz hasło" className={styles.input}/>
                    {passwordError === 'notMatching' && <div className={styles.inputName} style={errorStyle} > Hasła nie są takie same </div>}
                </div>
                <div className={styles.wholeInput}>
                    <div className={styles.inputName}>
                        Imię
                    </div>
                    <input value={name} type="text" placeholder="Podaj imię" onChange={(e)=>setName(e.target.value)} className={styles.input}/>
                </div>
                <div className={styles.wholeInput}>
                    <div className={styles.inputName}>
                        Nazwisko
                    </div>
                    <input value={surname} type="text" placeholder="Podaj nazwisko" onChange={(e)=>setSurname(e.target.value)} className={styles.input}/>
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
