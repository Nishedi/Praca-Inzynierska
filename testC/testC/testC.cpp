#include <iostream>
#include <string>
#include <sstream>
#include "GeneralMethods.h"
#include <vector>
#include "BNB.h"
#include "TS.h"
#include <fstream>
#include "Genetic.h"
#include "GreedyVechicleAlocation.h"
#include <limits>


std::vector<std::string> split(const std::string& str, char delimiter) {
    std::vector<std::string> tokens;
    std::stringstream ss(str);
    std::string token;
    while (std::getline(ss, token, delimiter)) {
        tokens.push_back(token);
    }
    return tokens;
}

std::string bnb_run(int numOfCities, std::vector<std::vector<int>> distancesInt) {
    BNB algorithm(numOfCities);
    std::vector<int> result = algorithm.bnb_execute(distancesInt);
    GeneralMethods gm;
    for (int i = 0; i < result.size() ; i++) {
        std::cout << result[i] << " ";
    }
    return gm.calculateTotalDistance2(result, result.size(), distancesInt);

}

std::string ts_run(int numOfCities, std::vector<std::vector<int>> distances, int neighbourType, int tabuSize, int numOfVechicles, int timeOfExecton) {// neigh 2 - slabe
    TS* tabuSearch = new TS(numOfCities);
    std::vector<int> result = tabuSearch->tabuSearch(distances, numOfCities, tabuSize, timeOfExecton, numOfCities, neighbourType, numOfVechicles);
    int res = 0;
    for (int i = 0; i < result.size() - 1; i++) {
        if (result[i] == 0 && result[i + 1] == 0) {
            int swap = result[i + 2];
            result[i + 2] = result[i + 1];
            result[i + 1] = swap;
        }
    }
    if (result[result.size() - 1] == 0) {
        int swap = result[result.size() - 1];
        result[result.size() - 1] = result[result.size() - 2];
        result[result.size() - 2] = swap;
    }
    for (int i = 0; i < result.size() - 1; i++) {
        res += distances[result[i]][result[i + 1]];
        std::cout << result[i] << " ";
    }
    std::cout << result[result.size() - 1]<<" ";
    res += distances[result[result.size() - 1]][result[0]];
    GeneralMethods gm;
    std::string resultstr = gm.calculateTotalDistance2(result, result.size(), distances);
    return resultstr;
}

std::string genetic_run(int numOfCities, std::vector<std::vector<int>> distances, int numOfVechicles, int timeOfExecton, int genSize) {
    Genetic* genetic = new Genetic(distances, numOfCities, genSize);
    std::vector<int> result = genetic->geneticSolve(distances, numOfCities, timeOfExecton, 0.8,0.1, numOfVechicles);
    int res = 0;
    for (int i = 0; i < result.size() - 1; i++) {
        if (result[i] == 0 && result[i + 1] == 0) {
            int swap = result[i + 2];
            result[i + 2] = result[i + 1];
            result[i + 1] = swap;
        }
    }
    if (result[result.size() - 1] == 0) {
        int swap = result[result.size() - 1];
        result[result.size() - 1] = result[result.size() - 2];
        result[result.size() - 2] = swap;
    }
    for (int i = 0; i < result.size() - 1; i++) {
        res += distances[result[i]][result[i + 1]];
        std::cout << result[i]<<" ";
    }
    std::cout << result[result.size()-1] << " ";
    res += distances[result[result.size()-1]][result[0]];
    GeneralMethods gm;
    std::string resultstr = gm.calculateTotalDistance2(result, result.size(), distances);
    return resultstr;
}

std::string loadDataFromFile(std::string filename) {
    std::ifstream inputFile("C:\\Users\\KONRAD PEMPERA\\Desktop\\Praca-Inzynierska\\"+filename);
    //std::ifstream inputFile(filename);
    if (!inputFile.is_open()) {
        std::cerr << "Cannot open test file: " << filename << std::endl << std::endl;
        return "Error"; 
    }
    std::stringstream buffer;
    buffer << inputFile.rdbuf();
    std::string input = buffer.str();
    inputFile.close();
    return input;
}


int main(int argc, char* argv[]) {
    if (argc > 1) {
        std::string input = argv[1];
        std::vector<std::string> parts = split(input, '|');
        int timeOfExecution = std::stoi(parts[0]);
        int numOfCities = std::stoi(parts[1]);
        int numOfVechicles = std::stoi(parts[2]);
        std::vector<std::string> distances = split(loadDataFromFile(parts[3]), ',');

        std::vector<std::vector<int>> distancesInt(numOfCities, std::vector<int>(numOfCities, 0));
        int alg = std::stoi(parts[4]);

        for (int i = 0; i < distances.size(); i++) {
            int num = std::stoi(distances[i]);
            distancesInt[i / numOfCities][i % numOfCities] = num;
        }
        for (int i = 0; i < distancesInt.size(); i++) {
            for (int j = 0; j < distancesInt.size(); j++) {
                if (distancesInt[i][j] == 0 && i == j) distancesInt[i][j] = std::numeric_limits<int>::max();

            }
        }

        GreedyVechicleAllocation gva;
        int numberOfVechicles = gva.greedyVehicleAllocation(distancesInt);
        if (numOfVechicles > numOfCities) {
            numOfVechicles = numOfCities;
        }
        numberOfVechicles = numOfVechicles;
        for (int x = 0; x < 1; x++)
        {
            if (alg == 0) {
                std::string x = ts_run(numOfCities, distancesInt, 1, 100 * numOfCities, numberOfVechicles, timeOfExecution);
                std::cout << "|" << numberOfVechicles << "|" << x << "TS\n";
            }
            if (alg == 1) {
                std::string y = genetic_run(numOfCities, distancesInt, numberOfVechicles, timeOfExecution, numOfCities * 300);
                std::cout << "|" << numberOfVechicles << "|" << y << "G\n";
            }
            if (alg == 2) {
                std::string z = bnb_run(numOfCities, distancesInt);
                std::cout << "|" << numberOfVechicles << "|" << z << "BnB\n";
            }
        }
        
    }
    return 0;
}
