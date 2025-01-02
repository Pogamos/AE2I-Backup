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

def test_get_articles(client):
    response = client.get('/articles/')
    assert response.status_code == 200
    assert response.json['success'] is True

def test_get_article_by_id(client):
    response = client.get('/articles/1')
    assert response.status_code in [200, 404]

def test_create_article(client):
    response = client.post('/articles/', json={
        "title": "New Article",
        "price": 10.0
    })
    assert response.status_code in [201, 403]

def test_update_article(client):
    response = client.put('/articles/1', json={"title": "Updated Title"})
    assert response.status_code in [200, 403, 404]

def test_delete_article(client):
    response = client.delete('/articles/1')
    assert response.status_code in [200, 403, 404]
