#pragma once

#include "Neigbor.h"
#include "GeneralMethods.h"
#include <algorithm>
#include <random>
#include "Result.h"
#include <stdlib.h>
#include <crtdbg.h>
#include <iostream>
class TS {
public:
    int cityNumber = 0;
    GeneralMethods gm;
    TS(int cityNumber) {
        this->cityNumber = cityNumber;
    }

    std::vector<Neigbor> generateNeighbor(int pathSize, std::vector<int>& path, int numberOfMaxMoves, int seed) {
        srand(time(NULL) * seed + seed);
        std::vector<Neigbor> neighborhood;
        for (int iter = 0; iter < numberOfMaxMoves && iter < 1000000; iter++) {
            int i = (rand() % (pathSize - 1)) + 1;
            while (path[i] == 0)i = (rand() % (pathSize - 1)) + 1;
            int j = (rand() % (pathSize - 1)) + 1;
            while (i == j) {
                j = (rand() % (pathSize - 1)) + 1;
            }
            int valueToMove = path[i];
            std::vector<int> neighbor(path);
            neighbor.erase(neighbor.begin() + i);
            neighbor.insert(neighbor.begin() + j, valueToMove);
            Neigbor newNeighbor(neighbor, pathSize, i, j, 0, 0);
            if (std::find(neighborhood.begin(), neighborhood.end(), newNeighbor) == neighborhood.end()) {
                neighborhood.push_back(newNeighbor);
            }
            //neighborhood.emplace_back(neighbor, pathSize, i, j, 0, 0);
        }
        return neighborhood;
    }


    std::vector<int> tabuSearch(std::vector<std::vector<int>> distances, int distancesSize, int tabuSize, int maxTime, int numOfStartSolution, int neighborType, int numOfVechicles) {
        distancesSize = distancesSize + numOfVechicles - 1;
        std::vector<int> bestSolution;
        int bestSolutionLength = 9999999999;
        std::vector<int> currentSolution;
        int currentSolutionLength;
        currentSolution = gm.generateInitialSolution(distancesSize - numOfVechicles + 1, distances, numOfVechicles);
        bestSolution = currentSolution;
        currentSolutionLength = gm.calculateTotalDistance(currentSolution, distancesSize, distances);
        bestSolutionLength = currentSolutionLength;
        maxTime = maxTime * 1000;
        std::vector<Neigbor> tabuList;
        long startTime = std::chrono::duration_cast<std::chrono::milliseconds>(std::chrono::system_clock::now().time_since_epoch()).count();
        long currentTime;
        int cnt = 0;
        currentSolution = bestSolution;
        for (int i = 0; (currentTime = std::chrono::duration_cast<std::chrono::milliseconds>(std::chrono::system_clock::now().time_since_epoch()).count()) - startTime <= maxTime; i++) {
            std::vector<Neigbor> neighborhood;
            cnt++;
            if (cnt > numOfVechicles*5) {
                cnt = 0;
                currentSolution = gm.generateInitialSolution(distancesSize - numOfVechicles + 1, distances, numOfVechicles);
            }
            neighborhood = generateNeighbor(distancesSize, currentSolution, (distancesSize * distancesSize) / 2, currentTime);
            std::sort(neighborhood.begin(), neighborhood.end(), [&distancesSize, &distances](const Neigbor& a, const Neigbor& b) {
                TS ts(distancesSize);
            return ts.gm.calculateTotalDistance(a.path_vec, distancesSize, distances) < ts.gm.calculateTotalDistance(b.path_vec, distancesSize, distances);
                });
            for (const Neigbor& neighbor : neighborhood) {
                if (std::find(tabuList.begin(), tabuList.end(), neighbor) == tabuList.end()
                    || gm.calculateTotalDistance(neighbor.path_vec, distancesSize, distances) < bestSolutionLength) {
                    currentSolution = neighbor.path_vec;
                    tabuList.push_back(neighbor);
                    if (tabuList.size() > tabuSize) {
                        tabuList.erase(tabuList.begin());
                    }
                    break;
                }
            }
            currentSolutionLength = gm.calculateTotalDistance(currentSolution, distancesSize, distances);
            if (currentSolutionLength < bestSolutionLength) {
                cnt = 0;
                std::vector<int> occures;
                for (int i = 0; i < currentSolution.size(); i++) {
                    if (currentSolution[i] == 0) {
                        occures.push_back(i);
                    }
                }
                int redux = occures[1] - occures[0];
                if (redux > 0.2 * currentSolution.size() && redux < 0.8*currentSolution.size()) {
                    bestSolution = currentSolution;
                    bestSolutionLength = currentSolutionLength;
                } 
            }
        }
        //gm.calculateTotalDistance2(bestSolution, bestSolutionLength, distances);
        return bestSolution;
    }
};
