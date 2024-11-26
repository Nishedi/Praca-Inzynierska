import json
import unittest

import postgrest
from supabase import create_client, Client


class AppTestCaseDataBase(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        url = 'https://sxudgukfwlwgjflfnnhe.supabase.co'
        key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4dWRndWtmd2x3Z2pmbGZubmhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAxMzYzODEsImV4cCI6MjA0NTcxMjM4MX0.tOzn4tok-O-zNGMiBJb9Up86jlGagWNQQNA_SPSNLIM";
        cls.supabase: Client = create_client(url, key)
        try:
            cls.user = {
                "name": "Konrad",
                "surname": "Testowy",
                "number_of_trucks": 2,
                "user_id": '0a5ac221-7445-4561-9ec4-ecd6786047a6'
            }
            auth_response = cls.supabase.auth.sign_in_with_password(
                {"email": "263948@student.pwr.edu.pl", "password": "Konrad123!"}
            )
            cls.auth_user = auth_response
        except Exception as e:
            print("Login failed:", e)

    def test_0_login(self):
        if(self.auth_user is None):
            self.fail("Login failed")
        else:
            self.assertIsNotNone(self.auth_user, "Login failed")

    def test_1_insert_new_records_to_users_details(self):
        if self.auth_user is not None:
            to_insert = self.user
            response = self.supabase.table("users_details").insert(to_insert).execute()
            self.assertIsNotNone(response, "Error inserting data")
            if(response is not None):
                json_data = response.model_dump_json()
                data_dict = json.loads(json_data)
                self.assertEqual(data_dict['data'][0]['name'], self.user['name'], "Incorrect name")
                self.assertEqual(data_dict['data'][0]['surname'], self.user['surname'], "Incorrect surname")
                self.assertEqual(data_dict['data'][0]['number_of_trucks'], self.user['number_of_trucks'], "Incorrect number of trucks")
                self.assertEqual(data_dict['data'][0]['user_id'], self.user['user_id'], "Incorrect user id")

    def test_2_get_user_details(self):
        if(self.auth_user is None):
            self.fail("Login failed")
        else:
            response = self.supabase.table("users_details").select("*").execute()
            self.assertIsNotNone(response, "Error fetching data")
            if response is not None:
                json_data = response.model_dump_json()
                data_dict = json.loads(json_data)
                self.assertEqual(data_dict['data'][0]['name'], self.user['name'], "Incorrect name")
                self.assertEqual(data_dict['data'][0]['surname'], self.user['surname'], "Incorrect surname")
                self.assertEqual(data_dict['data'][0]['number_of_trucks'], self.user['number_of_trucks'], "Incorrect number of trucks")
                self.assertEqual(data_dict['data'][0]['user_id'], self.user['user_id'], "Incorrect user id")
            else:
                self.fail("Error fetching data - getting user details")

    def test_3_update_user_details(self):
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

            if response is not None:
                json_data = response.model_dump_json()
                data_dict = json.loads(json_data)
                self.assertEqual(data_dict['data'][0]['name'], to_change['name'], "Incorrect name")
                self.assertEqual(data_dict['data'][0]['surname'], to_change['surname'], "Incorrect surname")
                self.assertEqual(data_dict['data'][0]['number_of_trucks'], to_change['number_of_trucks'], "Incorrect number of trucks")
                self.assertEqual(data_dict['data'][0]['user_id'], self.user['user_id'], "Incorrect user id")
            else:
                self.fail("Error updating data - updating user details")

    def test_4_try_adding_same_data(self):
        if self.auth_user is not None:
            to_insert = self.user

            with self.assertRaises(postgrest.exceptions.APIError) as cm:
                response = self.supabase.table("users_details").insert(to_insert).execute()
    def test_5_delete_inserted_rows(self):
        if self.auth_user is not None:
            to_delete = {
                "name": "Kacperek",
                "surname": "Zmieniony",
                "number_of_trucks": 3,
            }
            response = self.supabase.table("users_details").delete().eq("user_id", self.user['user_id']).execute()
            self.assertIsNotNone(response, "Error deleting data")
            if(response is not None):
                json_data = response.model_dump_json()
                data_dict = json.loads(json_data)
                self.assertEqual(data_dict['data'][0]['name'], to_delete['name'], "Incorrect name")
                self.assertEqual(data_dict['data'][0]['surname'], to_delete['surname'], "Incorrect surname")
                self.assertEqual(data_dict['data'][0]['number_of_trucks'], to_delete['number_of_trucks'], "Incorrect number of trucks")
                self.assertEqual(len(data_dict['data']), 1)
            else:
                self.fail("Error deleting data - deleting fuel diary records")

    @classmethod
    def tearDownClass(cls):
        if cls.supabase.auth.get_user():
            cls.supabase.auth.sign_out()



if __name__ == "__main__":
    unittest.main()
