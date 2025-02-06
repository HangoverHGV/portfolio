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

    def create_blogpost(self, client_with_db, blogpost_json, token):
        response = client_with_db.post("/blogpost/", json=blogpost_json, headers={"Authorization": f"Bearer {token.json()['access_token']}"})
        return response

    def test_get_all_blogposts(self, client_with_db):
        response = client_with_db.get("/blogpost/")
        assert response.status_code == 200
        assert response.json() == []

    def test_create_blogpost(self, client_with_db):
        user = self.create_user(client_with_db, user1)
        token = self.get_token(client_with_db, user1['email'], user1['password'])
        response = self.create_blogpost(client_with_db, blogpost1, token)
        assert response.status_code == 201
        assert response.json() == {
            "id": 1,
            "title": "Test Blog Post",
            "content": "This is a test blog post.",
            "user_id": user.json()['id'],
            "created_at": response.json()['created_at'],
            "updated_at": response.json()['updated_at']
        }
