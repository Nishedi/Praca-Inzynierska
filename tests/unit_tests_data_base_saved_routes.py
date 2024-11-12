import datetime
import json
import unittest

import postgrest
from supabase import create_client, Client


class AppTestCaseDataBase(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        with open('tests_data/16_cities_ready_to_save.json', 'r') as file:
            cls.data = json.load(file)
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
        if (self.auth_user is None):
            self.fail("Login failed")
        else:
            self.assertIsNotNone(self.auth_user, "Login failed")

    def test_1_insert_new_records_to_saved_routes(self):
        if self.auth_user is not None:
            to_insert = {
                "user_id": self.user['user_id'],  # Ustaw 'user_id' zgodnie z wymaganiami RLS
                "data": json.dumps(self.data)  # Serializuje obiekt 'groups' do formatu JSON
            }
            response = self.supabase.table("saved_routes").insert(to_insert).execute()
            self.assertIsNotNone(response, "Error inserting data")

    def test_2_select_inserted_rows_from_saved_routes(self):
        if self.auth_user is not None:
            response = self.supabase.table("saved_routes").select("*").execute()
            self.assertIsNotNone(response, "Error fetching data")
            if response is not None:
                json_data = response.model_dump_json()
                data_dict = json.loads(json_data)
                self.assertEqual(data_dict['data'][0]['user_id'], self.user['user_id'], "Incorrect user id")
            else:
                self.fail("Error fetching data - getting user details")


    def test_3_delete_inserted_rows_from_saved_routes(self):
        if self.auth_user is not None:
            response = self.supabase.table("saved_routes").delete().eq("user_id", self.user['user_id']).execute()
            self.assertIsNotNone(response, "Error deleting data")

            response = self.supabase.table("saved_routes").select("*").execute()
            self.assertIsNotNone(response, "Error fetching data")
            if response is not None:
                json_data = response.model_dump_json()
                data_dict = json.loads(json_data)
                self.assertEqual(len(data_dict['data']), 0, "Data not deleted")


    @classmethod
    def tearDownClass(cls):
        if cls.supabase.auth.get_user():
            cls.supabase.auth.sign_out()


if __name__ == "__main__":
    unittest.main()
