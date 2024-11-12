import json
import unittest
import requests

class AppTestCase(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        with open('tests_data/16_cities.json', 'r') as file:
            cls.data = json.load(file)
            cls.test_input = {
                "timeOfExecution": 5,
                "numberOfvehicles": 2,
                "alg": 0,
                "message": cls.data
            }
            cls.response = requests.post('http://localhost:3000/run-script', json=cls.test_input)

    def test_number_of_vechicles(self):
        if self.response.status_code == 200:
            response_data = self.response.json()
            self.assertLessEqual(
                len(response_data['result']),
                self.test_input['numberOfvehicles'],
                "Incorrect number of vehicles")
        else:
            self.assertEqual(self.response.status_code, 200, "Error fetching data, status code: " + str(self.response.status_code))

    def test_check_if_all_frrom_response_are_in_input_data(self):
        if self.response.status_code == 200:
            response_data = self.response.json()
            # Check if all cities from response are in the input data
            for group in response_data['result']:
                for city in group:
                    self.assertIn(city, self.data)
        else:
            self.assertEqual(self.response.status_code, 200, "Error fetching data, status code: " + str(self.response.status_code))

    def test_check_if_all_from_input_data_are_in_response(self):
        if self.response.status_code == 200:
            response_data = self.response.json()
            numberOfCities = 0
            for group in response_data['result']:
                for _ in group:
                    numberOfCities += 1
            # Check if all cities from input data are in the response
            self.assertEqual(
                numberOfCities,
                len(self.data) - 1,
                "Not all cities from input data are in the response (Incorrect number of cities)")
            cities = []
            for group in response_data['result']:
                for city in group:
                    cities.append(city)
            for city in self.data:
                if (city != self.data[0]):
                    self.assertIn(city, cities, "City is not in the response:" + city['location'])
        else:
            self.assertEqual(self.response.status_code, 200, "Error fetching data, status code: " + str(self.response.status_code))

    def test_check_if_all_cities_are_in_only_one_group(self):
        if self.response.status_code == 200:
            response_data = self.response.json()
            # Check if every city is in only one group
            cities = []
            for group in response_data['result']:
                for city in group:
                    cities.append(city['location'])
            self.assertEqual(
                len(cities),
                len(set(cities)),
                "City is in more than one group")
        else:
            self.assertEqual(self.response.status_code, 200, "Error fetching data, status code: " + str(self.response.status_code))

if __name__ == "__main__":
    unittest.main()
