#pragma once
#include <vector>
#include <chrono>
#include <algorithm>
#include <cmath> 
class GeneralMethods {
    int iter = 0;
public:
   int calculateTotalDistance(std::vector<int> path, int pathSize, std::vector<std::vector<int>> distances) {
        int totalDistance = 0;
        std::vector<int> truckDistances;
        int currentDistance = 0;
        int max = 0;
        for (int i = 0; i < path.size()-1; i++) {
            if (path[i] == 0 && path[i + 1] == 0) {
                return 9999999999999999;
            }
        }  
        if (path[0] == 0 && path[path.size()-1] == 0) {
            return 9999999999999999;
        }
       
        for (int i = 0; i < path.size() - 1; i++) {
            int x = path[i];
            int y = path[i + 1];
            currentDistance += distances[x][y];
            if (currentDistance > max)max = currentDistance;
            if (y == 0 || i == path.size() - 2) {
                truckDistances.push_back(currentDistance);
                currentDistance = 0;
            }
        }
        for (int i = 0; i < path.size() - 1; i++) {
            int x = path[i];
            int y = path[i + 1];
            totalDistance += distances[x][y];
        }
        totalDistance += distances[path[path.size() - 1]][path[0]];

        int imbalancePenalty = 0;
        int maxDistance = *max_element(truckDistances.begin(), truckDistances.end());
        int minDistance = *min_element(truckDistances.begin(), truckDistances.end());

        if (maxDistance - minDistance > minDistance/2) {
            imbalancePenalty = maxDistance - minDistance;
        }
        return totalDistance + 100 * imbalancePenalty;
    } 
    std::string calculateTotalDistance2(std::vector<int> path, int pathSize, std::vector<std::vector<int>> distances) {
        int totalDistance = 0;
        std::vector<int> truckDistances;
        int currentDistance = 0;
        int max = 0;
        for (int i = 0; i < path.size() - 1; i++) {
            if (path[i] == 0 && path[i + 1] == 0) {
                return std::to_string(9999999999999999) + " " + std::to_string(100 * 9999999999999999);
            }
        }
        for (int i = 0; i < path.size() - 1; i++) {
            int x = path[i];
            int y = path[i + 1];
            currentDistance += distances[x][y];
            if (currentDistance > max)max = currentDistance;
            if (y == 0 || i == path.size() - 2) {
                truckDistances.push_back(currentDistance);
                currentDistance = 0;
            }
        }
        for (int i = 0; i < path.size() - 1; i++) {
            int x = path[i];
            int y = path[i + 1];
            totalDistance += distances[x][y];
        }
        totalDistance += distances[path[path.size() - 1]][path[0]];

        int imbalancePenalty = 0;
        int maxDistance = *max_element(truckDistances.begin(), truckDistances.end());
        int minDistance = *min_element(truckDistances.begin(), truckDistances.end());

        if (maxDistance - minDistance > minDistance / 2) {
            imbalancePenalty = maxDistance - minDistance;
        }
        return std::to_string(totalDistance) + " " + std::to_string(100*imbalancePenalty);
    }
        
    
   
    std::vector<int> generateInitialSolution(int size, std::vector<std::vector<int>> distances, int numOfVechicles) {
        std::vector<int> firstSolution;
        int start = 0;
        int* visited = new int[size];
        for (int i = 0; i < size; i++)
            visited[i] = 0; 
        int allVisited = 0;
        int currentNode = start;
        firstSolution.emplace_back(start);
        while (allVisited < size - 1) {
            visited[currentNode] = 1;
            int bestNextNode = -1;
            int min = 999999999;
            for (int i = 0; i < size; i++) {
                if (visited[i] == 0 && i != currentNode) {
                    if (distances[currentNode][i] < min) {
                        bestNextNode = i;
                        min = distances[currentNode][i];
                    }
                }
            }
            currentNode = bestNextNode;
            allVisited++;
            firstSolution.emplace_back(bestNextNode);
        }
        delete[] visited;
        for (int i = 1; i < numOfVechicles; i++)
            firstSolution.insert(firstSolution.begin() + (i*firstSolution.size()/numOfVechicles) + 2, 0);
        return firstSolution;
    }
    

    std::vector<int> generateInitialSolutionStartPoint(int size, std::vector<std::vector<int>> distances, int startpoint, int numOfVechicles) {
        std::vector<int> firstSolution;
        int start = startpoint;
        int* visited = new int[size];
        for (int i = 0; i < size; i++)
            visited[i] = 0;
        int allVisited = 0;
        int currentNode = start;
        firstSolution.emplace_back(start);
        
        while (allVisited < size - 1) {
            visited[currentNode] = 1;
            int bestNextNode = -1;
            int min = 99999999;
            for (int i = 0; i < size; i++) {
                if (visited[i] == 0 && i != currentNode) {
                    if (distances[currentNode][i] < min) {
                        bestNextNode = i;
                        min = distances[currentNode][i];
                    }
                }
            }
            currentNode = bestNextNode;
            allVisited++;
            firstSolution.emplace_back(bestNextNode);
        }
        delete[] visited;
        for (int i = 1; i < numOfVechicles; i++)
            firstSolution.insert(firstSolution.begin() + (i * firstSolution.size() / numOfVechicles) + 2, 0);
        return firstSolution;
    }
    std::vector<int> generateInitialSolutionMutated(int size, std::vector<std::vector<int>> distances, int gennumber, int numOfVechicles) {
        std::vector<int> firstSolution;
        srand(time(NULL) + (gennumber * 511512) * iter++);
        int start = 0;
        int* visited = new int[size];
        for (int i = 0; i < size; i++)
            visited[i] = 0;
        int allVisited = 0;
        int currentNode = start;
        firstSolution.emplace_back(start);
        while (allVisited < size - 1) {
            visited[currentNode] = 1;
            int bestNextNode = -1;
            int min = 99999999;
            for (int i = 0; i < size; i++) {
                if (visited[i] == 0 && i != currentNode) {
                    if (distances[currentNode][i] < min) {
                        bestNextNode = i;
                        min = distances[currentNode][i];
                    }
                }
            }
            currentNode = bestNextNode;
            allVisited++;
            firstSolution.emplace_back(bestNextNode);
        }
        delete[] visited;
        srand(time(NULL) + (gennumber * 511512) * iter++);
        for (int i = 0; i < size*size; i++) {
            int first = (rand() % (size - 1)) + 1;
            int second = (rand() % (size - 1)) + 1;
            while (first == second) {
                second = (rand() % (size - 1)) + 1;
            }
            if (firstSolution[first] == 0) {
                second = second + (rand() % 5 - 2);
            }
            else if (firstSolution[second] == 0) {
                first = first + (rand() % 5 - 2);
            }
            int swap = firstSolution[first];
            firstSolution[first] = firstSolution[second];
            firstSolution[second] = swap;
        }
        for (int i = 1; i < numOfVechicles; i++)
            firstSolution.insert(firstSolution.begin() + (i * firstSolution.size() / numOfVechicles) + 1, 0);
        return firstSolution;
    }
    std::vector<int> generateRandomSolution(int size, std::vector<std::vector<int>> distances, int gennumber) {
        std::vector<int> firstSolution(size);
        for (int i = 0; i < size; i++) {
            firstSolution[i] = i;
        }
        srand(time(NULL) + (gennumber * 511512) * iter++);
        for (int i = 0; i < size * size; i++) {
            int first = std::rand() % size;
            int second = std::rand() % size;
            while (second == first) second = std::rand() % size;
            int swap = firstSolution[first];
            firstSolution[first] = firstSolution[second];
            firstSolution[second] = swap;
        }
        return firstSolution;
    }
};