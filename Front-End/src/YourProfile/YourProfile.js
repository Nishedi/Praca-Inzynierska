import styles from './YourProfile.module.css';
import { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../GlobalContext';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
const YourProfile = () => {
    const {supabase} = useContext(GlobalContext);
    const {userName, setUserName} = useState('');
    const {userSurname, setUserSurname} = useState('');
    const {userEmail, setUserEmail} = useState('');
    const {userPassword, setUserPassword} = useState('');

    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 2); 
    const [firstDate, setFirstDate] = useState(firstDayOfMonth.toISOString().split('T')[0]);
    const [secondDate, setSecondDate] = useState(new Date().toISOString().split('T')[0]);
    const [usedFuel, setUsedFuel] = useState();
    const [distance, setDistance] = useState();
    const [saveClick, setSaveClick] = useState(false);  

    const navigate = useNavigate();
    const [fuelDiary, setFuelDiary] = useState([
        // {date: '2023-01-01', fuel: 12, distance: 71},
        // {date: '2023-01-08', fuel: 7, distance: 65},
        // {date: '2023-01-10', fuel: 10, distance: 110},
        // {date: '2023-01-11', fuel: 9, distance: 108},
        // {date: '2023-01-12', fuel: 12, distance: 53},
        // {date: '2023-01-14', fuel: 5, distance: 78},
        // {date: '2023-01-17', fuel: 7, distance: 112},
        // {date: '2023-01-19', fuel: 6, distance: 78},
        // {date: '2023-01-22', fuel: 14, distance: 91},
        // {date: '2023-01-25', fuel: 5, distance: 72},
        // {date: '2023-02-01', fuel: 14, distance: 93},
        // {date: '2023-02-07', fuel: 13, distance: 73},
        // {date: '2023-02-09', fuel: 12, distance: 67},
        // {date: '2023-02-10', fuel: 13, distance: 82},
        // {date: '2023-02-11', fuel: 10, distance: 79},
        // {date: '2023-02-12', fuel: 5, distance: 55},
        // {date: '2023-02-13', fuel: 7, distance: 96},
        // {date: '2023-02-14', fuel: 14, distance: 90},
        // {date: '2023-02-15', fuel: 13, distance: 103},
        // {date: '2023-03-06', fuel: 12, distance: 118},
        // {date: '2023-03-12', fuel: 6, distance: 81},
        // {date: '2023-03-13', fuel: 12, distance: 79},
        // {date: '2023-03-19', fuel: 13, distance: 71},
        // {date: '2023-03-21', fuel: 10, distance: 113},
        // {date: '2023-03-29', fuel: 14, distance: 119},
        // {date: '2023-04-03', fuel: 11, distance: 54},
        // {date: '2023-04-08', fuel: 7, distance: 119},
        // {date: '2023-04-10', fuel: 9, distance: 112},
        // {date: '2023-04-12', fuel: 6, distance: 66},
        // {date: '2023-04-13', fuel: 11, distance: 70},
        // {date: '2023-04-14', fuel: 12, distance: 50},
        // {date: '2023-04-17', fuel: 10, distance: 77},
        // {date: '2023-04-20', fuel: 6, distance: 70},
        // {date: '2023-04-29', fuel: 5, distance: 89},
        // {date: '2023-05-02', fuel: 13, distance: 107},
        // {date: '2023-05-05', fuel: 8, distance: 84},
        // {date: '2023-05-12', fuel: 6, distance: 124},
        // {date: '2023-05-13', fuel: 6, distance: 109},
        // {date: '2023-05-16', fuel: 7, distance: 97},
        // {date: '2023-05-26', fuel: 7, distance: 123},
        // {date: '2023-06-03', fuel: 14, distance: 76},
        // {date: '2023-06-04', fuel: 6, distance: 77},
        // {date: '2023-06-13', fuel: 10, distance: 61},
        // {date: '2023-06-14', fuel: 11, distance: 65},
        // {date: '2023-06-17', fuel: 7, distance: 84},
        // {date: '2023-06-19', fuel: 11, distance: 64},
        // {date: '2023-06-20', fuel: 10, distance: 77},
        // {date: '2023-06-22', fuel: 10, distance: 88},
        // {date: '2023-06-24', fuel: 7, distance: 60},
        // {date: '2023-06-28', fuel: 6, distance: 73},
        // {date: '2023-06-30', fuel: 12, distance: 82},
        // {date: '2023-07-02', fuel: 9, distance: 102},
        // {date: '2023-07-03', fuel: 11, distance: 89},
        // {date: '2023-07-06', fuel: 7, distance: 97},
        // {date: '2023-07-09', fuel: 5, distance: 72},
        // {date: '2023-07-10', fuel: 11, distance: 59},
        // {date: '2023-07-12', fuel: 6, distance: 71},
        // {date: '2023-07-14', fuel: 8, distance: 118},
        // {date: '2023-07-25', fuel: 7, distance: 78},
        // {date: '2023-07-29', fuel: 9, distance: 79},
        // {date: '2023-08-01', fuel: 5, distance: 109},
        // {date: '2023-08-04', fuel: 10, distance: 96},
        // {date: '2023-08-24', fuel: 5, distance: 50},
        // {date: '2023-08-30', fuel: 14, distance: 59},
        // {date: '2023-09-03', fuel: 5, distance: 122},
        // {date: '2023-09-04', fuel: 6, distance: 75},
        // {date: '2023-09-05', fuel: 12, distance: 85},
        // {date: '2023-09-07', fuel: 6, distance: 114},
        // {date: '2023-09-13', fuel: 12, distance: 92},
        // {date: '2023-09-19', fuel: 8, distance: 104},
        // {date: '2023-09-30', fuel: 9, distance: 110},
        // {date: '2023-10-06', fuel: 8, distance: 118},
        // {date: '2023-10-09', fuel: 7, distance: 120},
        // {date: '2023-10-15', fuel: 10, distance: 88},
        // {date: '2023-10-17', fuel: 8, distance: 93},
        // {date: '2023-10-18', fuel: 11, distance: 110},
        // {date: '2023-10-20', fuel: 10, distance: 104},
        // {date: '2023-10-22', fuel: 11, distance: 119},
        // {date: '2023-10-24', fuel: 9, distance: 60},
        // {date: '2023-10-27', fuel: 12, distance: 111},
        // {date: '2023-10-28', fuel: 10, distance: 53},
        // {date: '2023-10-29', fuel: 12, distance: 92},
        // {date: '2023-11-05', fuel: 14, distance: 69},
        // {date: '2023-11-09', fuel: 11, distance: 64},
        // {date: '2023-11-10', fuel: 10, distance: 72},
        // {date: '2023-11-12', fuel: 5, distance: 108},
        // {date: '2023-11-18', fuel: 5, distance: 102},
        // {date: '2023-11-26', fuel: 5, distance: 89},
        // {date: '2023-11-28', fuel: 5, distance: 69},
        // {date: '2023-12-01', fuel: 14, distance: 106},
        // {date: '2023-12-05', fuel: 10, distance: 56},
        // {date: '2023-12-11', fuel: 10, distance: 72},
        // {date: '2023-12-12', fuel: 8, distance: 111},
        // {date: '2023-12-29', fuel: 9, distance: 106},
        // {date: '2023-12-30', fuel: 11, distance: 106},
        
    ]);

    // USTAW SOBIE ZGODNIE Z BAZĄ PLSSSSS
    useEffect(() => {
        const getUserProfile = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            const id = session?.user?.id;
            if (!id) {
                navigate("/");
            } else {
                // Fetch the user profile data
                const { data, error } = await supabase
                    .from('profiles')
                    .select('name, email')
                    .eq('user_id', id)
                    .single();
                if (error) {
                    console.log("Error fetching profile:", error);
                } else {
                    setUserName(data?.name || "N/A");
                    setUserEmail(data?.email || "N/A");
                }
            }
        };
        getUserProfile();
    }, []);

    useEffect(() => {
        const getData = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            const id = session?.user?.id;
            const { data, error } = await supabase
                .from('fuel_diary')
                .select('*')
                .eq('user_id', id)
            if (error) {
                console.log(error);
                alert("Wystąpił problem podczas zapisywania danych!");
            }
            if(data.length>0){
                console.log(data);
                const currentData = data
                    .filter(entry => entry.date === new Date().toISOString().split('T')[0])
                    .map(entry => ({
                        date: entry.date,
                        used_fuel: entry.used_fuel,
                        distance: entry.distance
                    }));    
                setUsedFuel(currentData[0]?.used_fuel);
                setDistance(currentData[0]?.distance);
                setFuelDiary(data);
            }
        }
        getData();
    }, [saveClick]);

    const [processedData, setProcessedData] = useState([]);

    useEffect(() => {
        const data = fuelDiary.map(entry => ({
                    date: entry.date,
                    averageConsumption: (entry.used_fuel / entry.distance) * 100 // Przekształcenie do litrów na 100 km
                }));
        // Wygeneruj wszystkie daty z pełnego zakresu
        const fullDateRange = [];
        const startDate = new Date(firstDate);
        const endDate = new Date(secondDate); 

        // Użyj pętli do utworzenia zakresu dat
        for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
            const formattedDate = d.toISOString().split('T')[0];
            const entry = data.find(item => item.date === formattedDate);
            fullDateRange.push({
                date: formattedDate,
                averageConsumption: entry ? entry.averageConsumption : 0 // Ustaw na 0, jeśli brak danych
            });
        }

        setProcessedData(fullDateRange);
    }, [firstDate, secondDate, fuelDiary]);

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

    const onSaveButtonClick = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        const id = session?.user?.id;
        if(!id){
            alert("Wystąpił problem podczas zapisywania danych!");
            return;
        }
        const todayDate = new Date().toISOString().split('T')[0];
        const { data, error } = await supabase
            .from('fuel_diary')
            .select('*')
            .eq('user_id', id)
            .eq('date', todayDate)
        if (error) {
            console.log(error);
            alert("Wystąpił problem podczas zapisywania danych!");
        }
        else {
            if(data.length===0){
                const { data, error } = await supabase
                    .from('fuel_diary')
                    .insert([
                        { user_id: id, used_fuel: usedFuel, distance: distance, date: todayDate }
                    ])
                if (error) {
                    console.log(error);
                    alert("Wystąpił problem podczas zapisywania danych!");
                }
                if(data){
                    console.log(data);
                };
            }
            else{
                const { data, error } = await supabase
                    .from('fuel_diary')
                    .update({ used_fuel: usedFuel, distance: distance })
                    .eq('user_id', id)
                    .eq('date', todayDate)
                    .select('*')
                if (error) {
                    console.log(error);
                    alert("Wystąpił problem podczas aktualizowania danych!");
                }
            }
            
            setSaveClick(!saveClick);
        }
    }


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
            <div style={{
                    display: 'flex',
                    flexDirection: 'column', 
                    justifyContent: 'center', 
                    backgroundColor: '#ffffff'
                }}
            >
                <div className={styles.profile}>
                        <p>Imię: <strong>Konrad</strong></p>
                        <p>Nazwisko: <strong>Pempi</strong></p>
                        <p>Email: <strong>konrad@email.com</strong></p>
                        <p>idk co jeszcze jakieś uwagi czy coś, czy liczba samochodow w firmie</p>        
                </div>
            </div>
            <div className={styles.mainWritting}>
                Dzienniczek paliwowy
            </div>
            <div className={styles.todayStats}>
                <p>Dzisiejsze statystyki</p>
                <div className={styles.inputs}>
                    <div className={styles.wholeInput}>
                        <div className={styles.name}>
                        Wykorzystane paliwo
                        </div>
                        <input
                            type="number"
                            value={usedFuel}
                            placeholder='Wykorzystane paliwo'
                            onChange={(e) => setUsedFuel(e.target.value)}
                        />
                    </div>
                    <div className={styles.wholeInput}>
                        <div className={styles.name}>
                        Przejechany dystans
                        </div>
                        <input
                            type="number"
                            value={distance}
                            placeholder='Przejechany dystans'
                            onChange={(e) => setDistance(e.target.value)}
                        />
                    </div>
                </div>
                <button onClick={onSaveButtonClick}>Zapisz</button>
            </div>
            <div className={styles.inputs}>
                <input
                    type="date"
                    value={firstDate}
                    onChange={(e) => setFirstDate(e.target.value)}
                />
                <input
                    type="date"
                    value={secondDate}
                    onChange={(e) => setSecondDate(e.target.value)}
                />
            </div>
            <div className={styles.chartSection}>
                <LineChart width={900} height={400} data={processedData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                    <CartesianGrid strokeDasharray="5 5" />
                    <XAxis dataKey="date" label={{ value: 'Data', position: 'bottom', offset: 0 }} minTickGap={15} />
                    <YAxis label={{ value: 'Średnie Spalanie (l/100 km)', angle: -90, position: 'insideLeft', dy: 100 }}/>

                    <Line
                        type="monotone"
                        dataKey="averageConsumption"
                        stroke={'#77AEFF'} // Ustal kolor na podstawie wartości
                        dot={false} // Możesz ustawić na true, jeśli chcesz wyświetlić kropki
                    />
                </LineChart>
            </div>
        </div>
    );
}

export default YourProfile;    