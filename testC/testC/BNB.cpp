#include "BNB.h"

int BNB::lowerBound(std::vector<int> currentPath, std::vector<std::vector<int>> distances, int currentPathSize) {
	if (currentPathSize == numberOfCities) return -1;
	int value = 0;
	for (int i = 1; i < currentPathSize; i++) {
		value += distances[currentPath[i - 1]][currentPath[i]];
	}
	for (int i = 0; i < numberOfCities; i++) {
		rest[i] = 0;
	}
	for (int i = 0; i < currentPathSize; i++) {
		rest[currentPath[i]] = 1;
	}
	for (int i = 0; i < numberOfCities; i++) {
		if (rest[i] == 1 && currentPath[currentPathSize - 1] != i) continue;
		int min = 100000;
		for (int j = 0; j < numberOfCities; j++) {
			if (rest[j] == 1 || i == j) continue;
			if (distances[i][j] < min)min = distances[i][j];
		}

		if (rest[i] != 1) {
			if (distances[i][0] < min)min = distances[i][0];
		}

		value += min;
	}
	return value;
}

int BNB::bnb(std::vector<std::vector<int>> Distances, int currentCity, int currentCost) {
	if (tempPathSize == this->numberOfCities && Distances[currentCity][0] != -1) {
		int cost = Distances[currentCity][0];
		if (currentCost + cost <= minCost) {
			minCost = currentCost + cost;
			tempPath[this->numberOfCities] = 0;
			bestPath[0] = 0;

			for (int i = 0; i <= this->numberOfCities; i++) {
				bestPath[i] = tempPath[i];
			}
		}
		return -1;
	}
	for (int i = 0; i < this->numberOfCities; i++) {
		if (visited[i] == -1 && Distances[currentCity][i] != -1) {
			if (Distances[currentCity][i] + currentCost < minCost) {
				visited[i] = 1;
				tempPathSize++;
				tempPath[tempPathSize - 1] = i;
				if (lowerBound(tempPath, Distances, tempPathSize) < minCost)
					bnb(Distances, i, currentCost + Distances[currentCity][i]);
				visited[i] = -1;
				tempPathSize--;
			}
		}
	}
	return minCost;
}

std::vector<int> BNB::bnb_execute(std::vector<std::vector<int>> routes) {
	int currentCity = 0;
	int currentCost = 0;
	this->visited[0] = 1;
	this->tempPath[0] = currentCity;
	int result = 0;
	bnb(routes, currentCity, currentCost);
	this->bestPath.pop_back();
	return this->bestPath;
}