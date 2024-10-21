#pragma once
#include <vector>
class Neigbor {
public:
    int i;
    int j;
    int k;
    int l;
    std::vector<int> path_vec;
    Neigbor(std::vector<int> path_vec, int pathSize, int i, int j, int k, int l) {
        this->path_vec = path_vec;
        this->i = i;
        this->j = j;
        this->k = k;
        this->l = l;
    }
    Neigbor() {

    }
    bool operator==(const Neigbor& other) const {
        return (i == other.i) && (j == other.j) && (k == other.k) && (l == other.l) &&
            std::equal(std::begin(path_vec), std::end(path_vec), std::begin(other.path_vec));
    }
};

