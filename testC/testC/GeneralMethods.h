#pragma once
#include <vector>
#include <chrono>
class GeneralMethods {
    int iter = 0;
public:
    std::vector<int> generateInitialSolution(int size, std::vector<std::vector<int>> distances, int gennumber, int numOfVechicles) {
        std::vector<int> firstSolution;
        srand(time(NULL) + (gennumber * 51));
        int start = std::rand() % size;
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
        for(int i = 0; i < numOfVechicles-1; i++)
            firstSolution.insert(firstSolution.begin() + std::rand() % firstSolution.size() + 1, 0);
        return firstSolution;
    }
    int calculateTotalDistance(std::vector<int> path, int pathSize, std::vector<std::vector<int>> distances) {
        int totalDistance = 0;
        for (int i = 0; i < path.size() - 1; i++) {
            int x = path[i];
            int y = path[i + 1];
            totalDistance += distances[x][y];

        }
        return totalDistance += distances[path[path.size() - 1]][path[0]];
    }

    std::vector<int> generateInitialSolutionStartPoint(int size, std::vector<std::vector<int>> distances, int startpoint, int numberOfVechicles) {
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
        for (int i = 0; i < numberOfVechicles - 1; i++)
            firstSolution.insert(firstSolution.begin() + std::rand() % firstSolution.size() + 1, 0);
        return firstSolution;
    }
    std::vector<int> generateInitialSolutionMutated(int size, std::vector<std::vector<int>> distances, int gennumber, int numberOfVechicles) {
        std::vector<int> firstSolution;
        srand(time(NULL) + (gennumber * 511512) * iter++);
        int start = std::rand() % size;
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
        for (int i = 0; i < size; i++) {
            int first = std::rand() % size;
            int second = std::rand() % size;
            while (second == first) second = std::rand() % size;
            int swap = firstSolution[first];
            firstSolution[first] = firstSolution[second];
            firstSolution[second] = swap;
        }
        for (int i = 0; i < numberOfVechicles - 1; i++)
            firstSolution.insert(firstSolution.begin() + std::rand() % firstSolution.size() + 1, 0);
        return firstSolution;
    }
    std::vector<int> generateRandomSolution(int size, std::vector<std::vector<int>> distances, int gennumber) {
        std::vector<int> firstSolution(size);
        for (int i = 0; i < size; i++) {
            firstSolution[i] = i;
        }
        srand(time(NULL) + (gennumber * 511512) * iter++);
        for (int i = 0; i < 5 * size; i++) {
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