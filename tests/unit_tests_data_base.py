import json
import unittest
from supabase import create_client, Client


class AppTestCaseDataBase(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        with open('tests_data/fuel_diary.json', 'r') as file:
            cls.fuel_diary = json.load(file)
        url = 'https://sxudgukfwlwgjflfnnhe.supabase.co'
        key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4dWRndWtmd2x3Z2pmbGZubmhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAxMzYzODEsImV4cCI6MjA0NTcxMjM4MX0.tOzn4tok-O-zNGMiBJb9Up86jlGagWNQQNA_SPSNLIM";
        cls.supabase: Client = create_client(url, key)
        try:
            cls.user = {
                "email": "263948@student.pwr.edu.pl",
                "password": "Konrad123!",
                "name": "Konrad",
                "surname": "Testowy",
                "number_of_trucks": 2,
                "user_id": '0a5ac221-7445-4561-9ec4-ecd6786047a6',
                "id": 18
            }
            auth_response = cls.supabase.auth.sign_in_with_password(
                {"email": "263948@student.pwr.edu.pl", "password": "Konrad123!"}
            )
            cls.auth_user = auth_response
        except Exception as e:
            print("Login failed:", e)

    def test_login(self):
        if(self.auth_user is None):
            self.fail("Login failed")
        else:
            self.assertIsNotNone(self.auth_user, "Login failed")

    def test_get_user_details(self):
        if(self.auth_user is None):
            self.fail("Login failed")
        else:
            response = self.supabase.table("users_details").select("*").execute()
            self.assertIsNotNone(response, "Error fetching data")
            if response is not None:
                json_data = response.model_dump_json()
                data_dict = json.loads(json_data)
                self.assertEqual(data_dict['data'][0]['id'], self.user['id'], "Incorrect user id")
                self.assertEqual(data_dict['data'][0]['name'], self.user['name'], "Incorrect name")
                self.assertEqual(data_dict['data'][0]['surname'], self.user['surname'], "Incorrect surname")
                self.assertEqual(data_dict['data'][0]['number_of_trucks'], self.user['number_of_trucks'], "Incorrect number of trucks")
                self.assertEqual(data_dict['data'][0]['user_id'], self.user['user_id'], "Incorrect user id")
            else:
                self.fail("Error fetching data - getting user details")

    def test_update_user_details(self):
        if (self.auth_user is None):
            self.fail("Login failed")
        else:
            to_change = {
                "name": "Kacperek",
                "surname": "Zmieniony",
                "number_of_trucks": 3,
            }
            response = self.supabase.table("users_details").update(to_change).eq("user_id", self.user['user_id']).execute()
            self.assertIsNotNone(response, "Error updating data")
            print(response, self.user['user_id'])

            if response is not None:
                json_data = response.model_dump_json()
                data_dict = json.loads(json_data)
                self.assertEqual(data_dict['data'][0]['id'], self.user['id'], "Incorrect user id")
                self.assertEqual(data_dict['data'][0]['name'], to_change['name'], "Incorrect name")
                self.assertEqual(data_dict['data'][0]['surname'], to_change['surname'], "Incorrect surname")
                self.assertEqual(data_dict['data'][0]['number_of_trucks'], to_change['number_of_trucks'], "Incorrect number of trucks")
                self.assertEqual(data_dict['data'][0]['user_id'], self.user['user_id'], "Incorrect user id")
            else:
                self.fail("Error updating data - updating user details")
            to_change = {
                "name": "Konrad",
                "surname": "Testowy",
                "number_of_trucks": 2,
            }
            response = self.supabase.table("users_details").update(to_change).eq("user_id", self.user['user_id']).execute()
            self.assertIsNotNone(response, "Error updating data")
            if response is not None:
                json_data = response.model_dump_json()
                data_dict = json.loads(json_data)
                self.assertEqual(data_dict['data'][0]['id'], self.user['id'], "Incorrect user id")
                self.assertEqual(data_dict['data'][0]['name'], to_change['name'], "Incorrect name")
                self.assertEqual(data_dict['data'][0]['surname'], to_change['surname'], "Incorrect surname")
                self.assertEqual(data_dict['data'][0]['number_of_trucks'], to_change['number_of_trucks'],
                                 "Incorrect number of trucks")
                self.assertEqual(data_dict['data'][0]['user_id'], self.user['user_id'], "Incorrect user id")
            else:
                self.fail("Error updating data - updating user details")

    def test_insert_new_records_to_fuel_diary(self):
        if self.auth_user is not None:
            to_insert = self.fuel_diary
            response = self.supabase.table("fuel_diary").insert(to_insert).execute()
            self.assertIsNotNone(response, "Error inserting data")
            if(response is not None):
                json_data = response.model_dump_json()
                data_dict = json.loads(json_data)
                for i in range(len(data_dict['data'])):
                    self.assertEqual(data_dict['data'][i]['user_id'], self.user['user_id'], "Incorrect user id")
                    self.assertEqual(data_dict['data'][i]['date'], to_insert[i]['date'], "Incorrect date")
                    self.assertEqual(data_dict['data'][i]['used_fuel'], to_insert[i]['used_fuel'], "Incorrect used fuel")
                    self.assertEqual(data_dict['data'][i]['distance'], to_insert[i]['distance'], "Incorrect distance")
                self.assertEqual(len(data_dict['data']), len(to_insert))

    def test_delete_inserted_rows(self):
        if self.auth_user is not None:
            response = self.supabase.table("fuel_diary").delete().eq("user_id", self.user['user_id']).execute()
            self.assertIsNotNone(response, "Error deleting data")
            # if(response is not None):
            #     json_data = response.model_dump_json()
            #     data_dict = json.loads(json_data)
            #     self.assertEqual(data_dict['data'][0]['user_id'], self.user['user_id'], "Incorrect user id")
            #     self.assertEqual(data_dict['data'][0]['date'], self.fuel_diary[0]['date'], "Incorrect date")
            #     self.assertEqual(data_dict['data'][0]['used_fuel'], self.fuel_diary[0]['used_fuel'], "Incorrect used fuel")
            #     self.assertEqual(data_dict['data'][0]['distance'], self.fuel_diary[0]['distance'], "Incorrect distance")
            # else:
            #     self.fail("Error deleting data - deleting fuel diary records")



    @classmethod
    def tearDownClass(cls):
        if cls.supabase.auth.get_user():
            cls.supabase.auth.sign_out()
        print("Test cleanup done.")



if __name__ == "__main__":
    unittest.main()
