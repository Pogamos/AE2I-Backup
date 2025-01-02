import pytest
from flask import Flask
from app.app import create_app

@pytest.fixture
def app():
    app = create_app()
    app.config['TESTING'] = True
    return app

@pytest.fixture
def client(app):
    return app.test_client()

def test_user_registration_and_login(client):
    # Register a new user
    response = client.post('/auth/register', json={
        "lastName": "Doe",
        "firstName": "John",
        "email": "john.doe@example.com",
        "password": "Password123!"
    })
    assert response.status_code == 201

    # Login with the new user
    response = client.post('/auth/login', json={
        "email": "john.doe@example.com",
        "password": "Password123!"
    })
    assert response.status_code == 200
    tokens = response.json
    assert "access_token" in tokens
    assert "refresh_token" in tokens

def test_article_creation_and_retrieval(client):
    # Login as admin
    response = client.post('/auth/login', json={
        "email": "admin@example.com",
        "password": "AdminPassword123!"
    })
    assert response.status_code == 200
    access_token = response.json["access_token"]

    # Create a new article
    response = client.post('/articles/', json={
        "title": "New Article",
        "price": 10.0
    }, headers={"Authorization": f"Bearer {access_token}"})
    assert response.status_code == 201

    # Get the created article
    article_id = response.json["article"]["_id"]
    response = client.get(f'/articles/{article_id}')
    assert response.status_code == 200
    assert response.json["article"]["title"] == "New Article"

def test_cart_operations(client):
    # Login as user
    response = client.post('/auth/login', json={
        "email": "john.doe@example.com",
        "password": "Password123!"
    })
    assert response.status_code == 200
    access_token = response.json["access_token"]

    # Add item to cart
    response = client.post('/users/1/cart', json={
        "productId": "123",
        "quantity": 1,
        "price": 10.0
    }, headers={"Authorization": f"Bearer {access_token}"})
    assert response.status_code == 200

    # Get the cart
    response = client.get('/users/1/cart', headers={"Authorization": f"Bearer {access_token}"})
    assert response.status_code == 200
    assert len(response.json["cart"]) > 0

    # Delete item from cart
    response = client.delete('/users/1/cart/123', headers={"Authorization": f"Bearer {access_token}"})
    assert response.status_code == 200

    # Flush the cart
    response = client.delete('/users/1/cart', headers={"Authorization": f"Bearer {access_token}"})
    assert response.status_code == 200
