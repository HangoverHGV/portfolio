"""
Tests for the Blogpost API endpoints using FastAPI TestClient and an in-memory SQLite database.

"""
from conftest import client_with_db


user1 = {
    "name": "Test User",
    "email": "test@email.com",
    "password": "password"
}

user2 = {
    "name": "Test User 2",
    "email": "test2@email.com",
    "password": "password"
}

superuser_json = {
    "name": "Test User",
    "email": "tst@super.com",
    "password": "password",
    "is_superuser": True,
    "secret_token": "supersecret"
}

blogpost1 = {
    "title": "Test Blog Post",
    "content": "This is a test blog post."
}


class TestBlogPost:

    def create_user(self, client_with_db, user_json):
        response = client_with_db.post("/user/",
                                       json=user_json)
        return response

    def create_superuser(self, client_with_db, user_json):
        response = client_with_db.post("/user/superuser/",
                                       json=user_json)
        return response

    def get_token(self, client_with_db, email, password):
        response = client_with_db.post("/user/token", data={"username": email, "password": password})
        return response

    def test_get_all_blogposts(self, client_with_db):
        response = client_with_db.get("/blogpost/")
        assert response.status_code == 200
        assert response.json() == []

