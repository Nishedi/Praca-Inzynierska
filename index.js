const { exec } = require('child_process');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());

app.post('/run-script', async (req, res) => {
  const locations = req.body.message;
  const dataForDistances= locations
  .map(location => `${location.others.lon},${location.others.lat}`) // Przekształcenie każdego obiektu w string
  .join(';'); 
  const url = "http://localhost:5000/table/v1/driving/"+dataForDistances+"?annotations=distance";
  try{
    const response = await fetch(url);
    const data = await response.json();
    const algorithResponse = await runScript(data.distances[0].length+"|"+data.distances);
    const indices = algorithResponse.trim().split(" ");
    const sortedLocations = indices.map(index => locations[index]);
    res.send({sortedLocations});
  }catch (error) {
    console.error('Error fetching API:', error);
    res.status(500).send('Error fetching API');
  } 
});


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

app.post('/', (req, res) => {
  const message = req.body.message;
  console.log("Running")
  runScript(message);
  res.send({message});
});

app.get('/', (req, res) => {
  const message = "Hello from extended Node.js!";
  runScript(message);
  res.send(`output: ${message}`	);
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
