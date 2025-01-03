# import pytest
# from flask import Flask
# from app.app import create_app
# from app.app.models.users import User

# @pytest.fixture
# def app():
#     app = create_app()
#     app.config['TESTING'] = True
#     return app

# @pytest.fixture
# def client(app):
#     return app.test_client()

# def test_get_users(client):
#     response = client.get('/users/')
#     assert response.status_code == 200
#     assert response.json['success'] is True

# def test_get_user_by_email(client):
#     response = client.get('/users/test@example.com')
#     assert response.status_code in [200, 404]

# def test_update_user(client):
#     response = client.put('/users/1', json={"firstName": "NewName"})
#     assert response.status_code in [200, 403, 404]

# def test_delete_user(client):
#     response = client.delete('/users/1')
#     assert response.status_code in [200, 403, 404]

# def test_add_to_cart(client):
#     response = client.post('/users/1/cart', json={"productId": "123", "quantity": 1, "price": 10.0})
#     assert response.status_code in [200, 403]

# def test_get_cart(client):
#     response = client.get('/users/1/cart')
#     assert response.status_code in [200, 403]

# def test_delete_from_cart(client):
#     response = client.delete('/users/1/cart/123')
#     assert response.status_code in [200, 403]

# def test_flush_cart(client):
#     response = client.delete('/users/1/cart')
#     assert response.status_code in [200, 403]
