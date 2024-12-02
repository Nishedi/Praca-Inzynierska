#pragma once
#include <iostream>
#include <string>
#include <sstream>
#include <vector>
#include <fstream>


using namespace std;

std::vector<std::string> split(const std::string& str, char delimiter) {
    std::vector<std::string> tokens;
    std::stringstream ss(str);
    std::string token;
    while (std::getline(ss, token, delimiter)) {
        tokens.push_back(token);
    }
    return tokens;
}

int greedyVehicleAllocation(const vector<vector<int>>& costMatrix) {
    int numVehicles = 0;
    int numPoints = costMatrix.size() - 1;
    vector<bool> visited(numPoints, false);

    while (true) {
        bool allVisited = true;
        for (bool v : visited) {
            if (!v) {
                allVisited = false;
                break;
            }
        }
        if (allVisited) break;

        numVehicles++;
        int minCost = numeric_limits<int>::max();
        int bestChoice = -1;

        for (int j = 1; j <= numPoints; ++j) {
            if (!visited[j - 1]) {
                if (costMatrix[0][j] < minCost) {
                    minCost = costMatrix[0][j];
                    bestChoice = j - 1;
                }
            }
        }

        if (bestChoice != -1) {
            visited[bestChoice] = true;

            for (int k = 1; k <= numPoints; ++k) {
                if (!visited[k - 1] && costMatrix[bestChoice + 1][k] < costMatrix[0][k]) {
                    visited[k - 1] = true;
                }
            }
        }
    }

    return numVehicles;
}

std::string loadDataFromFile(std::string filename) {
    std::ifstream inputFile( filename);
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
        char delimiter = '|';
        std::vector<std::string> parts = split(input, delimiter);
        int numOfCities = std::stoi(parts[0]);
        char separator = ',';
        std::vector<std::string> distances = split(loadDataFromFile(parts[1]), separator);
        std::vector<std::vector<int>> distancesInt(numOfCities, std::vector<int>(numOfCities, 0));
        for (int i = 0; i < distances.size(); i++) {
            int num = std::stoi(distances[i]);
            distancesInt[i / numOfCities][i % numOfCities] = num;
        }
        for (int i = 0; i < distancesInt.size(); i++) {
            for (int j = 0; j < distancesInt.size(); j++) {
                if (distancesInt[i][j] == 0) distancesInt[i][j] = std::numeric_limits<int>::max();
            }
        }
        std::cout << greedyVehicleAllocation(distancesInt);
    }
}