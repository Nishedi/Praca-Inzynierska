import json
import unittest
import requests

class AppTestCaseNumberOfVechicles(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        with open('tests_data/16_cities.json', 'r') as file:
            cls.data = json.load(file)
            cls.test_input = {
                "message": cls.data
            }
            cls.response = requests.post('http://localhost:3000/suggest-vehicles', json=cls.test_input)

    def test_number_of_vechicles(self):
        if self.response.status_code == 200:
            response_data = self.response.json()
            try:
                self.assertGreaterEqual(
                    int(response_data['numberOfvehicles']),
                    0,
                    "Incorrect number of vehicles")
            except ValueError:
                self.fail("Number of vehicles is not a number")
        else:
            self.assertEqual(self.response.status_code, 200, "Error fetching data, status code: " + str(self.response.status_code))


if __name__ == "__main__":
    unittest.main()
