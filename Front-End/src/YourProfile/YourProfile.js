import styles from './YourProfile.module.css';
import { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../GlobalContext';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import SingleAutoCompleteInput from '../SingleAutoComplete/SingleAutoComplete';
const YourProfile = () => {
    const {supabase} = useContext(GlobalContext);
    const [userName, setUserName] = useState('');
    const [userSurname, setUserSurname] = useState('');
    const [numberOfVehicle, setNumberOfVehicle] = useState('');
    const [baseLocation, setBaseLocation] = useState('');
    const [saveComplete, setSaveComplete] = useState(false);

    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 2); 
    const [firstDate, setFirstDate] = useState(firstDayOfMonth.toISOString().split('T')[0]);
    const [secondDate, setSecondDate] = useState(new Date().toISOString().split('T')[0]);
    const [usedFuel, setUsedFuel] = useState();
    const [distance, setDistance] = useState();
    const [saveClick, setSaveClick] = useState(false);  

    const navigate = useNavigate();
    const [fuelDiary, setFuelDiary] = useState([]);

    const getUserProfile = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        const id = session?.user?.id;
        if (!id) {
            navigate("/");
        } else {
            // Fetch the user profile data
            const { data, error } = await supabase
                .from('users_details')
                .select('*')
                .eq('user_id', id)
            if (error) {
                console.log("Error fetching profile:", error);
            } else {
                console.log(data[0]?.base_location);
                setUserName(data[0]?.name || "");
                setUserSurname(data[0]?.surname || "");
                setNumberOfVehicle(data[0]?.number_of_trucks || 0);
                setBaseLocation(data[0]?.base_location || "");
            }
        }
    };
    const updateProfile = async () => {
        if(!userName || !userSurname ){
            alert("Wypełnij wszystkie pola!");
            return;
        }

        const { data: { session } } = await supabase.auth.getSession();
        const id = session?.user?.id;
        const { data, error } = await supabase
            .from('users_details')
            .update({ name: userName, surname: userSurname, number_of_trucks: numberOfVehicle, base_location: baseLocation })
            .eq('user_id', id)
            if (error) {
                alert("Wystąpił problem podczas zapisywania danych!");
                console.log("Error fetching profile:", error);
            } else{
                setSaveComplete(true);
                const interval = setInterval(() => {
                    setSaveComplete(false);
                }, 5000);
            }
    };
    useEffect(() => {
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
        const validConsumptions = data.filter(entry => typeof entry.averageConsumption === 'number');
        const avgConsumption = validConsumptions.reduce((acc, entry) => acc + entry.averageConsumption, 0) / (validConsumptions.length || 1);


        // Użyj pętli do utworzenia zakresu dat
        for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
            const formattedDate = d.toISOString().split('T')[0];
            const entry = data.find(item => item.date === formattedDate);
            fullDateRange.push({
                date: formattedDate,
                averageConsumption: entry ? entry.averageConsumption : avgConsumption // Ustaw na 0, jeśli brak danych
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
            <div className={styles.mainProfile}>
            <div className={styles.profile}>
                <div className={styles.formRow}>
                    <p>Imię:</p>
                    <div>
                        <input type="text" placeholder='Podaj imię' value={userName} onChange={(e)=>setUserName(e.target.value)}/>
                    </div>
                    </div>
                    
                <div className={styles.formRow}>
                    <p>Nazwisko:</p>
                    <div>
                        <input type="text" placeholder="Podaj nazwisko" value={userSurname} onChange={(e)=>setUserSurname(e.target.value)} />
                    </div>
                </div>
                <div className={styles.formRow}>
                    <p>Liczba pojazdów:</p>
                    <div>
                        <input type="number" placeholder="Podaj liczbę samochodów w firmie" value={numberOfVehicle} onChange={(e)=>setNumberOfVehicle(e.target.value)} />

                    </div>
                </div>
                <div className={styles.formRow}>
                    <p>Centrum firmowe:</p>
                    <SingleAutoCompleteInput exercise={baseLocation} setExercise={setBaseLocation} isBase={true}/>
                 </div>

                <div className={styles.buttons}>
                    <button onClick={updateProfile}>{!saveComplete? "Zapisz": "Zapisano!"}</button>
                </div>
            </div>

            </div>
            <div className={styles.mainWritting}>
                Dzienniczek paliwowy
            </div>
            <div className={styles.dzienniczek}>
                <div className={styles.todayStatsStyle}>
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
                    <div className={styles.wholeInput}>
                        <div className={styles.name}>
                            Data od
                        </div>
                        <input
                            type="date"
                            value={firstDate}
                            onChange={(e) => setFirstDate(e.target.value)}
                            />
                    </div>
                    <div className={styles.wholeInput}>
                        <div className={styles.name}>
                            Data do
                        </div>
                        <input
                            type="date"
                            value={secondDate}
                            onChange={(e) => setSecondDate(e.target.value)}
                        />
                    </div>
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
            </div>
           
            <div className={styles.footerEnd}>
            </div>
        </div>
    );
}

export default YourProfile;    