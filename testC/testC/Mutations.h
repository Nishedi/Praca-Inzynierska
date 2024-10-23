
#pragma once
#include <iostream>
#include <vector>
#include <random>
using namespace std;
class Mutations {
public:
    void insertionMutate(std::vector<int>& tour, int numCities, double mutationRate) {
        std::random_device rd;
        std::mt19937 generator(rd());
        std::uniform_int_distribution<int> distribution(0, numCities - 1);
        std::uniform_real_distribution<double> probabilityDistribution(0.0, 1.0);
        if (probabilityDistribution(generator) > mutationRate) return;
        int pos1 = distribution(generator);
        int pos2;
        vector<int> copyTour(tour.size());
        for (int i = 0; i < tour.size(); i++) {
            copyTour[i] = tour[i];
        }
        do {
            pos2 = distribution(generator);
        } while (pos1 == pos2);
        int cityToMove = tour[pos1];
        tour.erase(tour.begin() + pos1);
        pos2 = (pos1 < pos2) ? (pos2 - 1) : pos2;
        tour.insert(tour.begin() + pos2, cityToMove);
        tour[pos2] = cityToMove;

    }

    void swapMutate(std::vector<int>& tour, int numCities, double MUTATION_RATE) {
        std::random_device rd;
        std::mt19937 generator(rd());
        std::uniform_int_distribution<int> distribution(0, numCities - 1);
        std::uniform_real_distribution<double> mutationDistribution(0.0, 1.0);
        if (mutationDistribution(generator) > MUTATION_RATE) return;
        for (int i = 0; i < 1; i++) {
            int pos1 = distribution(generator);
            int pos2;
            do {
                pos2 = distribution(generator);
            } while (pos1 == pos2);
            int temp = tour[pos1];
            tour[pos1] = tour[pos2];
            tour[pos2] = temp;
        }
    }


    //void inversionMutate(std::vector<int>& tour, int numCities, double mutationrate) {
    //    std::random_device rd;
    //    std::mt19937 generator(rd());
    //    std::uniform_int_distribution<int> distribution(0, numCities - 1);
    //    std::uniform_real_distribution<double> probabilityDistribution(0.0, 1.0);
    //    if (probabilityDistribution(generator) > mutationrate) return;
    //    int pos1 = distribution(generator);
    //    int pos2;

    //    do {
    //        pos2 = distribution(generator);
    //    } while (pos1 == pos2);

    //    // Ensure pos1 < pos2
    //    if (pos1 > pos2) {
    //        std::swap(pos1, pos2);
    //    }

    //    // Reverse the subsequence between pos1 and pos2
    //    std::reverse(tour.begin() + pos1, tour.begin() + pos2 + 1);
    //}

    void contains(vector<int> tour, vector<int> copyTour) {
        vector<int> wystapienia(tour.size());
        for (int j = 0; j < tour.size(); j++) {
            for (int i = 0; i < tour.size(); i++) {
                if (tour[i] == j) wystapienia[j]++;
            }
        }

        for (int i = 0; i < tour.size(); i++) {
            if (wystapienia[i] != 1) {
                cout << "\n"; cout << i << "\n";
                std::sort(tour.begin(), tour.end());
                for (int i = 0; i < tour.size(); i++) {
                    cout << tour[i] << " ";
                }cout << "\n";
                std::sort(copyTour.begin(), copyTour.end());
                for (int i = 0; i < tour.size(); i++) {
                    cout << copyTour[i] << " ";
                }
                cout << "\n";
            }
        }
    }
};
#pragma once
