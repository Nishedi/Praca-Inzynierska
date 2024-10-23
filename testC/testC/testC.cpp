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


std::vector<std::string> split(const std::string& str, char delimiter) {
    std::vector<std::string> tokens;
    std::stringstream ss(str);
    std::string token;
    while (std::getline(ss, token, delimiter)) {
        tokens.push_back(token);
    }
    return tokens;
}

int bnb_run(int numOfCities, std::vector<std::vector<int>> distancesInt) {
    BNB algorithm(numOfCities);
    std::vector<int> result = algorithm.bnb_execute(distancesInt);
    int totalLength = 0;
    
    int res = 0;
    for (int i = 0; i < result.size() - 1; i++) {
        res += distancesInt[result[i]][result[i + 1]];
    }
    res += distancesInt[result[result.size() - 1]][result[0]];
    return res;

}

int ts_run(int numOfCities, std::vector<std::vector<int>> distances, int neighbourType, int tabuSize, int numOfVechicles) {// neigh 2 - slabe
    TS* tabuSearch = new TS(numOfCities);
    std::vector<int> result = tabuSearch->tabuSearch(distances, numOfCities, tabuSize, 5, numOfCities, neighbourType, numOfVechicles);
   /* for (int i = 0; i < result.size(); i++) {
        std::cout << result[i] << " ";
    }*/
    int res = 0;
    for (int i = 0; i < result.size() - 1; i++) {
        res += distances[result[i]][result[i + 1]];
    }
    res += distances[result[result.size() - 1]][result[0]];
    

    return res;
}

int genetic_run(int numOfCities, std::vector<std::vector<int>> distances) {
    Genetic* genetic = new Genetic(distances, numOfCities, 6000);
    std::vector<int> result = genetic->geneticSolve(distances, numOfCities, 5, 0,0,0.8,0.1);
    int res = 0;
    for (int i = 0; i < result.size() - 1; i++) {
        res += distances[result[i]][result[i + 1]];
    }
    res += distances[result[result.size()-1]][result[0]];
    


    GeneralMethods gn;
    gn.calculateTotalDistance(result, result.size(), distances);
    return res;
}


int main(int argc, char* argv[]) {
    if (argc > 1) {
        std::string input = argv[1];
        char delimiter = '|';
        std::vector<std::string> parts = split(input, delimiter);
        int numOfCities = std::stoi(parts[0]);
        int numOfVechicles = std::stoi(parts[1]);
        char separator = ',';
        std::vector<std::string> distances = split(parts[2], separator);
        std::vector<std::vector<int>> distancesInt(numOfCities, std::vector<int>(numOfCities, 0));

        for (int i = 0; i < distances.size(); i++) {
            int num = std::stoi(distances[i]);
            distancesInt[i / numOfCities][i % numOfCities] = num;
        }

        GreedyVechicleAllocation gva;

        int numberOfVechicles = gva.greedyVehicleAllocation(distancesInt);
        numberOfVechicles = 1;

        for (int i = 0; i < 5; i++) {
            std::cout << std::endl << i << ". " << std::endl;
            //std::cout << "   " << bnb_run(numOfCities, distancesInt) << std::endl;
            std::cout << "   " << ts_run(numOfCities, distancesInt, 1, numOfCities, numberOfVechicles) << std::endl;
            std::cout << "   " << genetic_run(numOfCities, distancesInt) << std::endl;
        }


    }
    //else {
    //    /*std::cout << "No argument provided! Loading example data" << std::endl;
    //    int numOfCities = 5;
    //    std::vector<std::vector<int>> distances(numOfCities, std::vector<int>(numOfCities, 0));
    //    distances[0][0] = -1; distances[0][1] = 180; distances[0][2] = 200; distances[0][3] = 226; distances[0][4] = 257;
    //    distances[1][0] = 184; distances[1][1] = -1; distances[1][2] = 383; distances[1][3] = 216; distances[1][4] = 439;
    //    distances[2][0] = 194; distances[2][1] = 379; distances[2][2] = -1; distances[2][3] = 206; distances[2][4] = 258;
    //    distances[3][0] = 227; distances[3][1] = 223; distances[3][2] = 205; distances[3][3] = -1; distances[3][4] = 448;
    //    distances[4][0] = 257; distances[4][1] = 439; distances[4][2] = 258; distances[4][3] = 448; distances[4][4] = -1;
    //    bnb_run(numOfCities, distances);*/

    //    std::string filename = "Polska-15.txt"; 
    //    std::ifstream inputFile(filename);
    //    if (!inputFile.is_open()) {
    //        std::cerr << "Cannot open test file: " << filename << std::endl;
    //        return 1; // Zakończ program z błędem
    //    }
    //    std::stringstream buffer; 
    //    buffer << inputFile.rdbuf(); 
    //    std::string input = buffer.str(); 
    //    inputFile.close(); 

    //    char delimiter = '|';
    //    std::vector<std::string> parts = split(input, delimiter);
    //    int numOfCities = std::stoi(parts[0]);
    //    int numOfVechicles = std::stoi(parts[1]);
    //    char separator = ',';
    //    std::vector<std::string> distances = split(parts[2], separator);
    //    std::vector<std::vector<int>> distancesInt(numOfCities, std::vector<int>(numOfCities, 0));

    //    for (int i = 0; i < distances.size(); i++) {
    //        int num = std::stoi(distances[i]);
    //        distancesInt[i / numOfCities][i % numOfCities] = num;
    //    }

    //    //std::cout << std::endl;
    //    /*for (int i = 0; i < numOfCities; i++) {
    //        for (int j = 0; j < numOfCities; j++) {
    //            std::cout << distancesInt[i][j] << " ";
    //        }
    //        std::cout << "\n";
    //    }*/
    //    //bnb_run(numOfCities, distancesInt);
    //    /*for (int ts = 27; ts < 7*27; ts += 27) {
    //        std::cout << ts;
    //        for (int n = 1; n < 4; n++) {
    //             std::cout<< " " << n << ":"; ts_run(numOfCities, distancesInt, n, ts);
    //        }
    //        std::cout << "\n";
    //    }*/
    //    ts_run(numOfCities, distancesInt, 1, numOfCities, numOfVechicles);
    //}
    return 0;
}
