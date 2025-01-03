# import pytest
# from flask import Flask
# from app.app import create_app

# @pytest.fixture
# def app():
#     app = create_app()
#     app.config['TESTING'] = True
#     return app

# @pytest.fixture
# def client(app):
#     return app.test_client()

# def test_register(client):
#     response = client.post('/auth/register', json={
#         "lastName": "Doe",
#         "firstName": "John",
#         "email": "john.doe@example.com",
#         "password": "Password123!"
#     })
#     assert response.status_code in [201, 400]

# def test_login(client):
#     response = client.post('/auth/login', json={
#         "email": "john.doe@example.com",
#         "password": "Password123!"
#     })
#     assert response.status_code in [200, 401]
