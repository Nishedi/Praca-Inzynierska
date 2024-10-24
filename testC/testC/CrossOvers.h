
#pragma once 
#include <iostream>
#include <vector>
#include <random>
using namespace std;
class CrossOvers {
public:
    std::vector<int> PMXCrossOver(std::vector<int>& parent1, std::vector<int>& parent2, int numCities, double crossoverRate) {
        std::random_device rd;
        std::mt19937 generator(rd());
        std::uniform_int_distribution<int> distribution(0, parent1.size() - 1);
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
        std::vector<int> temp(parent1.size(), -1);
        for (int i = startPos; i <= endPos; i++) {
            temp[parent1[i]] = 1;
        }
        std::vector<int> included1;
        for (int i = 0; i < temp.size(); i++) {
            if (temp[i] == 1) included1.push_back(i);
        }
        for (int i = startPos; i <= endPos; i++) {
            int boolean = 0;
            for (int j = 0; j < included1.size(); j++) {
                if (parent2[i] == included1[j]) {
                    boolean = 1;
                }
            }
            if (boolean == 0) {
                int index = find(parent2, parent1[i]);
                while (index <= endPos && index >= startPos) {
                    index = find(parent2, parent1[index]);
                }
                child[index] = parent2[i];
            }
        }
        for (int i = 0; i < child.size(); i++) {
            if (child[i] == -1) {
                child[i] = parent2[i];
            }
        }
        return child;
    }
    int find(std::vector<int> parent, int value) {
        for (int i = 0; i < parent.size(); i++) {
            if (parent[i] == value) return i;
        }
        return -1;
    }


    std::vector<int> orderCrossover(std::vector<int>& parent1, std::vector<int>& parent2, int numCities, double crossoverRate) {
        std::random_device rd;
        std::mt19937 generator(rd());
        std::uniform_int_distribution<int> distribution(0, parent1.size() - 1);
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
    bool contains(vector<int> tour, int value) {
        for (int i = 0; i < tour.size(); i++) {
            if (tour[i] == value) return true;
        }
        return false;
    }
};
