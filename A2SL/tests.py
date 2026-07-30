from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient


class WebApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user_model = get_user_model()

    def test_signup_login_and_convert_flow(self):
        signup_response = self.client.post(
            '/api/auth/signup/',
            {'username': 'webuser', 'password1': 'StrongPass123!', 'password2': 'StrongPass123!'},
            format='json',
        )
        self.assertEqual(signup_response.status_code, 201)
        self.assertIn('token', signup_response.data)

        login_response = self.client.post(
            '/api/auth/login/',
            {'username': 'webuser', 'password': 'StrongPass123!'},
            format='json',
        )
        self.assertEqual(login_response.status_code, 200)
        self.assertIn('token', login_response.data)

        convert_response = self.client.post(
            '/api/convert/',
            {'sen': 'Hello there'},
            format='json',
            HTTP_AUTHORIZATION=f"Token {login_response.data['token']}",
        )
        self.assertEqual(convert_response.status_code, 200)
        self.assertEqual(convert_response.data['text'], 'Hello there')
        self.assertTrue(convert_response.data['words'])
