#pragma once
#include <iostream>
#include <vector>
class BNB {
public:
	int numberOfCities = 0;
	std::vector<int> tempPath;
	int tempPathSize = 1;
	int* visited = NULL;
	int minCost = 1000000000;
	std::vector<int> bestPath;
	int* rest = NULL;
	BNB(int n) {
		this->numberOfCities = n;
		for (int i = 0; i < n+1; i++) {
			tempPath.push_back(0);
		}
		this->visited = new int[n];
		for (int i = 0; i < n; i++) {
			visited[i] = -1;
		}
		for (int i = 0; i < n + 1; i++) {
			bestPath.push_back(0);
		}
		rest = new int[n];
	}
	~BNB() {
		delete[] visited;
		delete[] rest;
	}
	void restoreTables() {
		int minCost = 1000000000;
		int temp_size = 1;
		for (int i = 0; i < numberOfCities; i++) {
			tempPath[i] = -1;
		}
		for (int i = 0; i < numberOfCities; i++) {
			visited[i] = -1;
		}
		for (int i = 0; i < numberOfCities + 1; i++) {
			bestPath[i] = -1;
		}
	}
	int lowerBound(std::vector<int> currentPath, std::vector<std::vector<int>> distances, int currentPathSize);

	int bnb(std::vector<std::vector<int>> routes, int currentCity, int currentCost);

	std::vector<int> bnb_execute(std::vector<std::vector<int>> routes);

};