#pragma once
#include <vector>
class Result {
public:
	int zachlannie = 0;
	int updates = 0;
	int timeFound = 0;
	int* bestSolution = NULL;
	double temperature = 0.0;
	std::vector<int> bestSolution_vec;
	std::vector<int> times;
	std::vector<int> bestResults;

	Result(int zachlannie, int updates, int timeFound, std::vector<int>& bestsolution_vec, int size) {
		this->zachlannie = zachlannie;
		this->updates = updates;
		this->timeFound = timeFound;
		this->bestSolution_vec = bestsolution_vec;
	}
	Result(int zachlannie, int updates, int timeFound, std::vector<int>& bestsolution_vec, int size, std::vector<int> times, std::vector<int> bestResults, double temperature) {
		this->zachlannie = zachlannie;
		this->updates = updates;
		this->timeFound = timeFound;
		this->bestSolution_vec = bestsolution_vec;
		this->times = times;
		this->bestResults = bestResults;
		this->temperature = temperature;
	}

	Result(int zachlannie, int updates, int timeFound, std::vector<int>& bestsolution_vec, int size, std::vector<int> times, std::vector<int> bestResults) {
		this->zachlannie = zachlannie;
		this->updates = updates;
		this->timeFound = timeFound;
		this->bestSolution_vec = bestsolution_vec;
		this->times = times;
		this->bestResults = bestResults;
		this->temperature = temperature;
	}
	Result() {}
	~Result() {
		//delete[] bestSolution;
	}
};
