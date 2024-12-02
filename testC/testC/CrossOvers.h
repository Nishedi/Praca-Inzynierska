
#pragma once 
#include <iostream>
#include <vector>
#include <random>
using namespace std;
class CrossOvers {
public:
    
    int find(std::vector<int> parent, int value) {
        for (int i = 0; i < parent.size(); i++) {
            if (parent[i] == value) return i;
        }
        return -1;
    }


    std::vector<int> orderCrossover(std::vector<int>& parent1, std::vector<int>& parent2, int numCities, double crossoverRate, int numOfVechicles) {
        std::random_device rd;
        std::mt19937 generator(rd());
        std::uniform_int_distribution<int> distribution(1, parent1.size() - 1);
        std::uniform_real_distribution<double> crossoverDistribution(0.0, 1.0);
        if (crossoverDistribution(generator) > crossoverRate) {
            return parent1;
        }
        int startPos = distribution(generator);
        int endPos = distribution(generator);

        if (startPos > endPos) {
            std::swap(startPos, endPos);
        }
        std::vector<int> child(parent1.size(), -1);
        for (int i = startPos; i <= endPos; i++) {
            child[i] = parent1[i];
        }
        int currentIndex = 0;
        for (int i = 0; i < parent1.size(); i++) {
            if (currentIndex == startPos) {
                currentIndex = endPos + 1;
            }
            if (currentIndex >= parent1.size()) break;
            if (child[currentIndex] == -1 && std::find(child.begin(), child.end(), parent2[i]) == child.end()) {
                child[currentIndex++] = parent2[i];
            }else if (child[currentIndex] == -1 && parent2[i] == 0 && count0Occures(child)<numOfVechicles) {
                child[currentIndex++] = parent2[i];
            }
        }
        for (int i = 0; i < child.size(); i++) {
            if (child[i] == -1) {
                child[i] = 0;
            }
        }
        return child;
    }


private:
   
    int count0Occures(vector<int> tour) {
        int counter = 0;
        for (int i = 0; i < tour.size(); i++) {
            if (tour[i] == 0) counter++;
        }
        return counter;
    }
};
