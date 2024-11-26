import json
import unittest

import postgrest
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
                "user_id": '0a5ac221-7445-4561-9ec4-ecd6786047a6',
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

    def test_1_insert_new_records_to_fuel_diary(self):
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

    def test_2_select_inserted_rows_from_fuel_diary(self):
        if self.auth_user is not None:
            to_insert = self.fuel_diary
            response = self.supabase.table("fuel_diary").select("*").execute()
            self.assertIsNotNone(response, "Error fetching data")
            if(response is not None):
                json_data = response.model_dump_json()
                data_dict = json.loads(json_data)
                for i in range(len(data_dict['data'])):
                    self.assertEqual(data_dict['data'][i]['user_id'], self.user['user_id'], "Incorrect user id")
                    self.assertEqual(data_dict['data'][i]['date'], to_insert[i]['date'], "Incorrect date")
                    self.assertEqual(data_dict['data'][i]['used_fuel'], to_insert[i]['used_fuel'],"Incorrect used fuel")
                    self.assertEqual(data_dict['data'][i]['distance'], to_insert[i]['distance'], "Incorrect distance")
                self.assertEqual(len(data_dict['data']), len(to_insert))

    def test_3_delete_inserted_rows(self):
        if self.auth_user is not None:
            response = self.supabase.table("fuel_diary").delete().eq("user_id", self.user['user_id']).execute()
            self.assertIsNotNone(response, "Error deleting data")
            if(response is not None):
                json_data = response.model_dump_json()
                data_dict = json.loads(json_data)
                self.assertEqual(len(data_dict['data']), len(self.fuel_diary), "Incorrect number of deleted records")
            else:
                self.fail("Error deleting data - deleting fuel diary records")

    def test_4_check_adding_whitout_incorrect_distance(self):
        if self.auth_user is not None:
            to_insert = {
                "user_id": self.user['user_id'],
                "date": "2021-09-21",
                "used_fuel": 50,
            }
            with self.assertRaises(postgrest.exceptions.APIError) as cm:
                response = self.supabase.table("fuel_diary").insert(to_insert).execute()
            to_insert = {
                "user_id": self.user['user_id'],
                "date": "2021-09-21",
                "used_fuel": 50,
                "distance": "A"
            }
            with self.assertRaises(postgrest.exceptions.APIError) as cm:
                response = self.supabase.table("fuel_diary").insert(to_insert).execute()
            to_insert = {
                "user_id": self.user['user_id'],
                "date": "2021-09-21",
                "used_fuel": 50,
                "distance": -10
            }
            with self.assertRaises(postgrest.exceptions.APIError) as cm:
                response = self.supabase.table("fuel_diary").insert(to_insert).execute()

    def test_5_check_adding_whitout_incorrect_distance(self):
        if self.auth_user is not None:
            to_insert = {
                "user_id": self.user['user_id'],
                "date": "2021-09-21",
                "distance": 10,
            }
            with self.assertRaises(postgrest.exceptions.APIError) as cm:
                response = self.supabase.table("fuel_diary").insert(to_insert).execute()
            to_insert = {
                "user_id": self.user['user_id'],
                "date": "2021-09-21",
                "used_fuel": "A",
                "distance": 10
            }
            with self.assertRaises(postgrest.exceptions.APIError) as cm:
                response = self.supabase.table("fuel_diary").insert(to_insert).execute()
            to_insert = {
                "user_id": self.user['user_id'],
                "date": "2021-09-21",
                "used_fuel": -50,
                "distance": 10
            }
            with self.assertRaises(postgrest.exceptions.APIError) as cm:
                response = self.supabase.table("fuel_diary").insert(to_insert).execute()

    def test_6_check_adding_whitout_incorrect_data(self):
        if self.auth_user is not None:
            to_insert = {
                "user_id": self.user['user_id'],
                "distance": 10,
                "used_fuel": 50
            }
            with self.assertRaises(postgrest.exceptions.APIError) as cm:
                response = self.supabase.table("fuel_diary").insert(to_insert).execute()
                
    @classmethod
    def tearDownClass(cls):
        if cls.supabase.auth.get_user():
            cls.supabase.auth.sign_out()



if __name__ == "__main__":
    unittest.main()
