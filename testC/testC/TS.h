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

    std::vector<Neigbor> generateNeighbor1(int pathSize, std::vector<int>& path, int numberOfMaxMoves, int seed) {
        srand(time(NULL) * seed + seed);
        std::vector<Neigbor> neighborhood;
        for (int iter = 0; iter < numberOfMaxMoves && iter < 1000000; iter++) {
            int i = rand() % pathSize;
            int j = rand() % pathSize;
            while (i == j) {
                j = rand() % pathSize;
            }
            int valueToMove = path[i];
            std::vector<int> neighbor(path);
            neighbor.erase(neighbor.begin() + i);
            neighbor.insert(neighbor.begin() + j, valueToMove);
            neighborhood.emplace_back(neighbor, pathSize, i, j, 0, 0);
        }
        return neighborhood;
    }

    std::vector<Neigbor> generateNeighbor2(int pathSize, std::vector<int>& path, int numberOfMaxSwaps, int seed) {
        std::vector<Neigbor> neighborhood;
        srand(time(NULL) * seed + seed);
        for (int iter = 0; iter < numberOfMaxSwaps && iter < 1000000; iter++) {
            int i = std::rand() % pathSize;
            int j = std::rand() % pathSize;
            while (j == i) {
                j = std::rand() % pathSize;
            }

            int k = std::rand() % pathSize;
            while (k == i || k == j) {
                k = std::rand() % pathSize;
            }
            std::vector<int> neighbor(path);
            std::swap(neighbor[i], neighbor[j]);
            std::swap(neighbor[k], neighbor[i]);
            neighborhood.emplace_back(neighbor, pathSize, i, j, k, 0);
        }
        return neighborhood;
    }

    std::vector<Neigbor> generateNeighbor3(int pathSize, const std::vector<int>& path) {
        std::vector<Neigbor> neighborhood;
        for (int i = 0; i < pathSize - 2; i++) {
            for (int j = i + 1; j < pathSize - 1; j++) {
                for (int k = j + 1; k < pathSize; k++) {
                    std::vector<int> neighbor(path.begin(), path.end());
                    reverse(neighbor.begin() + i, neighbor.begin() + j, neighbor.begin() + k);
                    neighborhood.emplace_back(neighbor, pathSize, i, j, k, 0);
                }
            }
        }
        return neighborhood;
    }

    void reverse(std::vector<int>::iterator start, std::vector<int>::iterator middle, std::vector<int>::iterator end) {
        std::reverse(start, middle);
        std::reverse(middle, end + 1);
        std::reverse(start, end + 1);
    }

    std::vector<Neigbor> generateNeighbour(int pathSize, const std::vector<int>& path) {
        std::vector<Neigbor> neighborhood;
        for (int i = 0; i < pathSize; i++) {
            for (int j = i + 1; j < pathSize; j++) {
                std::vector<int> neighbor(path);
                std::swap(neighbor[i], neighbor[j]);
                neighborhood.emplace_back(neighbor, pathSize, i, j, 0, 0);
            }
        }
        return neighborhood;
    }

    std::vector<int> tabuSearch(std::vector<std::vector<int>> distances, int distancesSize, int tabuSize, int maxTime, int numOfStartSolution, int neighborType) {
        int updates = 0;
        std::vector<int> bestResults;
        std::vector<int> times;
        std::vector<int> bestSolution;
        int bestSolutionLength = 9999999999;
        std::vector<int> currentSolution;
        int currentSolutionLength;
        for (int i = 0; i < numOfStartSolution; i++) {
            currentSolution = gm.generateInitialSolution(distancesSize, distances, i * tabuSize / maxTime);
            if (bestSolution.size() == 0) {
                bestSolution = currentSolution;
                bestSolutionLength = gm.calculateTotalDistance(bestSolution, distancesSize, distances);
            }
            currentSolutionLength = gm.calculateTotalDistance(currentSolution, distancesSize, distances);
            if (currentSolutionLength < bestSolutionLength) {
                bestSolution = currentSolution;
                bestSolutionLength = currentSolutionLength;
            }
        }
        int greedily = gm.calculateTotalDistance(bestSolution, distancesSize, distances);
        maxTime = maxTime * 1000;
        std::vector<Neigbor> tabuList;
        long startTime = std::chrono::duration_cast<std::chrono::milliseconds>(std::chrono::system_clock::now().time_since_epoch()).count();
        bestResults.push_back(bestSolutionLength);
        times.push_back(0.0);
        long currentTime;
        long found;
        int f = 0;
        int nochange = 0;
        currentSolution = bestSolution;
        for (int i = 0; (currentTime = std::chrono::duration_cast<std::chrono::milliseconds>(std::chrono::system_clock::now().time_since_epoch()).count()) - startTime <= maxTime; i++) {
            std::vector<Neigbor> neighborhood;
            if (nochange > 5 * distancesSize) {
                currentSolution = gm.generateInitialSolution(distancesSize, distances, 53);
                int start = 0; int middle = distancesSize / 2; int end = distancesSize - 1;
                reverse(currentSolution.begin(), currentSolution.begin() + middle, currentSolution.begin() + end);
                for (int i = 0; i < 10; i++) {
                    start = rand() % distancesSize;
                    middle = rand() % distancesSize;
                    end = rand() % distancesSize;
                    while (middle == start)middle = rand() % distancesSize;
                    while (end == middle || end == start) end = rand() % distancesSize;
                    if (start > end) std::swap(start, end);
                    if (middle < start) std::swap(middle, start);
                    if (middle > end) std::swap(middle, end);
                    reverse(currentSolution.begin() + start, currentSolution.begin() + middle, currentSolution.begin() + end);
                }
                nochange = 0;
                tabuList.clear();
            }
            if (neighborType == 1)
                neighborhood = generateNeighbor1(distancesSize, currentSolution, (distancesSize * distancesSize) / 2, currentTime);
            if (neighborType == 2)
                neighborhood = generateNeighbor2(distancesSize, currentSolution, distancesSize * distancesSize * (distancesSize / 2), currentTime);
            if (neighborType == 3)
                neighborhood = generateNeighbor3(distancesSize, currentSolution);
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
                bestSolution = currentSolution;
                bestSolutionLength = currentSolutionLength;
                f++;
                found = std::chrono::duration_cast<std::chrono::milliseconds>(std::chrono::system_clock::now().time_since_epoch()).count() - startTime;
                updates++;
                bestResults.emplace_back(bestSolutionLength);
                times.emplace_back(found);
            }
            else {
                nochange++;
            }

        }
        /*std::cout << f <<" "<<nochange << std::endl;*/
        if (f > 0) {
            //Result* result = new Result(greedily, updates, found, bestSolution, distancesSize, times, bestResults);
            return bestSolution;
        } else {
            return currentSolution;
        }
    }
};
