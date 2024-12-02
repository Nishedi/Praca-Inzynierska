const { exec } = require('child_process');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());

const saveDistancesToFile = (data) => {
  // Zamiana tablicy dwuwymiarowej na wiersze CSV
  const distancesCsv = data.distances.map(row => row.join(',')).join(',');
  fs.writeFileSync('distances/distances'+data.distances[0].length+'.csv', distancesCsv, 'utf8');
  return 'distances/distances'+data.distances[0].length+'.csv';
};

app.post('/run-script', async (req, res) => {
  const timeOfExecution = req.body.timeOfExecution;
  let numberOfVehicles = req.body.numberOfvehicles;
  const locations = req.body.message;
  let alg = req.body.alg;
  const dataForDistances= locations
  .map(location => `${location.others.lon},${location.others.lat}`) // Przekształcenie każdego obiektu w string
  .join(';'); 
  const url = "http://localhost:5000/table/v1/driving/"+dataForDistances+"?annotations=distance";
  try{
    const response = await fetch(url);
    const data = await response.json();
    // console.log(data.distances[0].length+"|"+data.distances);
    // return;
    // const algorithResponse = await runScript(data.distances[0].length+"|2|"+data.distances);
    // const indices = algorithResponse.trim().split(" ");
    // const sortedLocations = indices.map(index => locations[index]);
    // const sortedLocationsWithIndices = sortedLocations.map((location, i) => ({
    //   location: location,
    //   id: indices[i] // Dodajemy odpowiadający 'indices' jako 'id'
    // }));
    // doIt(sortedLocationsWithIndices);
    const fileName = saveDistancesToFile(data);
    alg = "0";
    if(data.distances[0].length <= 20 && data.distances[0].length >= 10){
      alg = "1";
    }
    if(numberOfVehicles == 1 && data.distances[0].length < 14){
      alg = "2";
    }
    const algorithmResponses = await runScript(timeOfExecution+"|"+data.distances[0].length+"|"+numberOfVehicles+"|"+fileName+"|"+alg);
    const algorithResponse = algorithmResponses.split("|");
    const numberOfvehicles = algorithResponse[1];
    const path = algorithResponse[0];
    const splittedPath = path.split(/(?<!\d)0(?!\d)/);
    if(splittedPath.length>numberOfvehicles){
        splittedPath[0] = splittedPath[splittedPath.length - 1] + " " + splittedPath[0];
        splittedPath.pop();
    }
    const result = splittedPath.map(subArray => subArray.trim().split(" ").map(index => locations[index]));
    res.send({result});
    
    }catch (error) {
      console.error('Error fetching API:', error);
      res.status(500).send('Error fetching API');
    } 
  });

app.post('/suggest-vehicles', async (req, res) => {
  const locations = req.body.message;
  let numberOfvehicles = 1;
  if(!locations || locations.length < 2){
    res.send({numberOfvehicles});
    return;
  }
  const dataForDistances= locations
  .map(location => `${location.others.lon},${location.others.lat}`) // Przekształcenie każdego obiektu w string
  .join(';');
  const url = "http://localhost:5000/table/v1/driving/"+dataForDistances+"?annotations=distance";
  try{
    const response = await fetch(url);
    const data = await response.json();
    const fileName = saveDistancesToFile(data);
    numberOfvehicles= await getNumberOfVechicles(data.distances[0].length+"|"+fileName);
    while(data.distances[0].length/numberOfvehicles<3){
      numberOfvehicles--;
    }
    res.send({numberOfvehicles});
    
    }
    catch (error) {
      console.error('Error fetching API:', error);
      res.status(500).send('Error fetching API');
    }
  });

const getNumberOfVechicles = (locations) => {
  return new Promise((resolve, reject) => {
    exec(`GreedyVechicleAllocation\\x64\\Release\\GreedyVechicleAllocation.exe "${locations}"`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        reject(error); // Odrzuć obietnicę w przypadku błędu
        return;
      }
      if (stderr) {
        console.error(`Stderr: ${stderr}`);
        reject(new Error(stderr)); // Odrzuć obietnicę w przypadku błędu w stderr
        return;
      }
      console.log(`Output to co zwraca: ${stdout}`);
      resolve(stdout); // Rozwiąż obietnicę z wynikiem
    });
  });
};

const runScript = (message) => {
  return new Promise((resolve, reject) => {
    exec(`testC\\x64\\Release\\testC.exe "${message}"`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        reject(error); // Odrzuć obietnicę w przypadku błędu
        return;
      }
      if (stderr) {
        console.error(`Stderr: ${stderr}`);
        reject(new Error(stderr)); // Odrzuć obietnicę w przypadku błędu w stderr
        return;
      }
      console.log(`Output to co zwraca: ${stdout}`);
      resolve(stdout); // Rozwiąż obietnicę z wynikiem
    });
  });
};

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
