#pragma once
#include <vector>
#include <chrono>
class GeneralMethods {
public:
    std::vector<int> generateInitialSolution(int size, std::vector<std::vector<int>> distances, int gennumber) {
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
        return firstSolution;
    }
    int calculateTotalDistance(std::vector<int> path, int pathSize, std::vector<std::vector<int>> distances) {
        int totalDistance = 0;
        for (int i = 0; i < pathSize - 1; i++) {
            totalDistance += distances[path[i]][path[i + 1]];

        }
        return totalDistance += distances[path[pathSize - 1]][path[0]];
    }
};