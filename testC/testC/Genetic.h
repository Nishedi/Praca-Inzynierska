#pragma once
#include "GeneralMethods.h"
#include "Mutations.h"
#include "CrossOvers.h"
#include <iostream>
#include <cstdlib>
#include <ctime>
using namespace std;
class Genetic {
private:
	std::vector<std::vector<int>> distances;
	int distancesSize = 0;
	int populationSize = 0;
	CrossOvers cs;
	GeneralMethods gm;
	Mutations mt;
	std::mt19937 generator;
	int seed = 0;



public:
	Genetic(std::vector<std::vector<int>> distances, int distancesSize, int populationSize) :generator(std::random_device()()) {
		this->distances = distances;
		this->distancesSize = distancesSize;
		this->populationSize = populationSize;
	}
private:
	vector<vector<int>> initializePopulation(int numberOfVechicles) {
		vector<vector<int>> population(this->populationSize);
		population[0] = gm.generateInitialSolutionStartPoint(distancesSize, distances, 0, numberOfVechicles);
		for (int i = 1; i < this->populationSize; i++) {
			population[i] = gm.generateInitialSolutionMutated(distancesSize, this->distances, (this->distancesSize + 151) * 191, numberOfVechicles);
		}	
		
		return population;
	}

	std::vector<int> selectParent(const std::vector<std::vector<int>>& population) {
		int tournamentSize = population[0].size() / 2; //pierwotnie 2
		std::vector<std::vector<int>> tournament(tournamentSize, std::vector<int>());
		for (int i = 0; i < tournamentSize; i++) {
			std::uniform_int_distribution<int> distribution(0, population.size() - 1);
			int randomIndex = distribution(generator);
			tournament[i] = population[randomIndex];
		}
		int bestTourIndex = 0;
		int bestTourDistance = gm.calculateTotalDistance(tournament[0], tournament[0].size(), distances);
		for (int i = 1; i < tournamentSize; i++) {
			int distance = gm.calculateTotalDistance(tournament[i], tournament[i].size(), distances);
			if (distance < bestTourDistance) {
				bestTourDistance = distance;
				bestTourIndex = i;
			}
		}
		return tournament[bestTourIndex];
	}

public:
	std::vector<int>  geneticSolve(std::vector<std::vector<int>> distances, int distancesSize, int maxTime,  double crossoverRate, double mutationRate, int numberOfVechicles) {
		maxTime = maxTime * 1000;
		int bestDistance = 9999999;
		distancesSize = distancesSize + numberOfVechicles - 1;
		vector<int> bestTour(distancesSize);
		long startTime = std::chrono::duration_cast<std::chrono::milliseconds>(std::chrono::system_clock::now().time_since_epoch()).count();
		long currentTime;
		vector<vector<int>> population = initializePopulation(numberOfVechicles);
		for (int j = 0; j < population[0].size(); j++) {
			bestTour[j] = population[0][j];
		}
		if (gm.calculateTotalDistance(population[0], population[0].size(), distances) < bestDistance)
			bestDistance = gm.calculateTotalDistance(population[0], population[0].size(), distances);
		for (int generation = 0;
			(currentTime = std::chrono::duration_cast<std::chrono::milliseconds>(std::chrono::system_clock::now().time_since_epoch()).count()) - startTime <= maxTime;
			generation++) {
			vector<vector<int>> newPopulation(populationSize);
			for (int i = 0; i < populationSize; i++) {
				vector<int> first = selectParent(population);
				vector<int> second = selectParent(population);
				vector<int> child = cs.orderCrossover(first, second, distancesSize, crossoverRate, numberOfVechicles);
				mt.swapMutate(child, distancesSize, 0.05);
				if (child[child.size() - 1] == 0) {
					child[child.size() - 1] = child[child.size() - 2];
					child[child.size() - 2] = 0;
				}
				newPopulation[i] = child;
			}
			int lastBest = bestDistance;
			for (int i = 0; i < populationSize; i++) {
				int distance = gm.calculateTotalDistance(newPopulation[i], newPopulation[i].size(), distances);
				if (distance < bestDistance) {
					bestDistance = distance;
					for (int j = 0; j < newPopulation[i].size(); j++) {
						bestTour[j] = newPopulation[i][j];
					}
				}
				if (distance < 2.5 * lastBest) {
					std::uniform_int_distribution<int> distribution(0, population.size() - 1);
					int randomIndex = distribution(generator);
					population[randomIndex] = newPopulation[i];
				}		
			}
		}
		//gm.calculateTotalDistance(bestTour, bestTour.size(), distances);
		return bestTour;
	}

};
