#pragma once
#include <iostream>
#include <vector>
#include <limits>

using namespace std;
class GreedyVechicleAllocation {
public:

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
};