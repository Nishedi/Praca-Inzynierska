#pragma once

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
		for (int i = 0; i < distancesSize; i++) {
			population[i] = gm.generateInitialSolutionStartPoint(distancesSize, distances, i, numberOfVechicles);
		}
		for (int i = distancesSize; i < this->populationSize; i++) {
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


	std::vector<int>  geneticSolve(std::vector<std::vector<int>> distances, int distancesSize, int maxTime, int mutationType, int crossoverType, double crossoverRate, double mutationRate, int numberOfVechicles) {
		maxTime = maxTime * 1000;
		int changes = 0;
		int bestDistance = 9999999;
		int bestTime = 0;
		std::vector<int> times;
		std::vector<int> bestResults;
		times.push_back(0);
		vector<int> bestTour(distancesSize+numberOfVechicles-1);
		long startTime = std::chrono::duration_cast<std::chrono::milliseconds>(std::chrono::system_clock::now().time_since_epoch()).count();
		long currentTime;
		vector<vector<int>> population = initializePopulation(numberOfVechicles);
		for (int generation = 0;
			(currentTime = std::chrono::duration_cast<std::chrono::milliseconds>(std::chrono::system_clock::now().time_since_epoch()).count()) - startTime <= maxTime;
			generation++) {
			vector<vector<int>> newPopulation(populationSize);

			for (int i = 0; i < populationSize; i++) {
				vector<int> first = selectParent(population);
				vector<int> second = selectParent(population);
				int iter = 0;
				/*while (iter++ < 100 && std::equal(first.begin(), first.end(), second.begin())) {
					second = selectParent(population);
				}*/

				vector<int> child;
				if (std::equal(first.begin(), first.end(), second.begin())) {
					child = cs.PMXCrossOver(first, second, distancesSize, 0);
				}
				else {
					if (crossoverType == 0) child = cs.PMXCrossOver(first, second, distancesSize, crossoverRate);
					if (crossoverType == 1) child = cs.orderCrossover(first, second, distancesSize, crossoverRate);
				}
				if (mutationType == 0)mt.insertionMutate(child, distancesSize, mutationRate);
				if (mutationType == 1)mt.swapMutate(child, distancesSize, mutationRate);
				newPopulation[i] = child;
			}
			int lastBest = bestDistance;
			for (int i = 0; i < populationSize; i++) {
				int distance = gm.calculateTotalDistance(newPopulation[i], newPopulation[i].size(), distances);
				if (distance < bestDistance) {
					changes++;
					bestResults.push_back(distance);
					int found = std::chrono::duration_cast<std::chrono::milliseconds>(std::chrono::system_clock::now().time_since_epoch()).count() - startTime;
					times.emplace_back(found);
					bestTime = found;
					//cout << ".";
					bestDistance = distance;
					for (int j = 0; j < newPopulation[i].size(); j++) {
						bestTour[j] = newPopulation[i][j];
					}
				}
				if (distance < 2.5 * lastBest) {//test1
					std::uniform_int_distribution<int> distribution(0, population.size() - 1);
					int randomIndex = distribution(generator);
					population[randomIndex] = newPopulation[i];
				}
				
			}
		}
		
		return bestTour;
	}

};
