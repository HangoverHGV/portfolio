"""
Tests for the User API endpoints using FastAPI TestClient and an in-memory SQLite database.

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


class TestUser:

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

    # Login Unrestricted Tests

    def test_get_all_users(self, client_with_db):
        response = client_with_db.get("/user/")
        assert response.status_code == 200
        assert response.json() == []

    def test_get_user(self, client_with_db):
        self.create_user(client_with_db, user1)
        response = client_with_db.get("/user/1")
        response_json = response.json()
        response_json.pop('created_at', None)
        response_json.pop('updated_at', None)

        assert response.status_code == 200
        assert response_json == {
            "id": 1,
            "name": "Test User",
            "email": "test@email.com",
            "is_active": True,
            "is_superuser": False
        }

    def test_get_user_not_found(self, client_with_db):
        response = client_with_db.get("/user/1")
        assert response.status_code == 404
        assert response.json() == {"detail": "User not found"}

    def test_get_all_users_after_create(self, client_with_db):
        self.create_user(client_with_db, user1)
        self.create_user(client_with_db, user2)
        response = client_with_db.get("/user/")
        response_json = response.json()
        for r in response_json:
            r.pop('created_at', None)
            r.pop('updated_at', None)

        assert response.status_code == 200
        assert len(response_json) == 2
        assert response_json == [{
            "id": 1,
            "name": "Test User",
            "email": "test@email.com",
            "is_active": True,
            "is_superuser": False
        }, {
            "id": 2,
            "name": "Test User 2",
            "email": "test2@email.com",
            "is_active": True,
            "is_superuser": False
        }]

    def test_create_user(self, client_with_db):
        response = self.create_user(client_with_db, user1)

        response_json = response.json()

        response_json.pop('created_at', None)
        response_json.pop('updated_at', None)

        assert response.status_code == 201
        assert response_json == {
            "id": 1,
            "name": "Test User",
            "email": "test@email.com",
            "is_active": True,
            "is_superuser": False
        }

    def test_create_user_email_already_registered(self, client_with_db):
        self.create_user(client_with_db, user1)
        response = self.create_user(client_with_db, user1)
        assert response.status_code == 400
        assert response.json() == {"detail": "Email already registered"}

    def test_success_create_superuser(self, client_with_db):
        response = client_with_db.post("/user/superuser/",
                                       json={
                                           "name": "Test User",
                                           "email": "test1@email.com",
                                           "password": "password",
                                           "is_superuser": True,
                                           "secret_token": "supersecret"
                                       })
        response_json = response.json()
        response_json.pop('created_at', None)
        response_json.pop('updated_at', None)

        assert response.status_code == 201
        assert response_json == {
            "id": 1,
            "name": "Test User",
            "email": "test1@email.com",
            "is_active": True,
            "is_superuser": True
        }

    # Login Restricted Tests
    ## No Login tests
    def test_delete_user_not_logged(self, client_with_db):
        self.create_user(client_with_db, user1)
        response = client_with_db.delete("/user/1")
        assert response.status_code == 401
        assert response.json() == {"detail": "Not authenticated"}

    def test_delete_user_not_found_not_logged(self, client_with_db):
        response = client_with_db.delete("/user/1")
        assert response.status_code == 401
        assert response.json() == {"detail": "Not authenticated"}

    def test_edit_user_not_logged(self, client_with_db):
        self.create_user(client_with_db, user1)
        response = client_with_db.put("/user/1", json={"name": "New Name"})

        response_json = response.json()
        response_json.pop('created_at', None)
        response_json.pop('updated_at', None)

        assert response.status_code == 401
        assert response_json == {"detail": "Not authenticated"}

    ## Logged tests (Not Superuser)
    def test_edit_user_me(self, client_with_db):
        self.create_user(client_with_db, user1)
        token = self.get_token(client_with_db, user1["email"], user1["password"]).json()["access_token"]

        response = client_with_db.put("/user/1", json={"name": "New Name"}, headers={"Authorization": f"Bearer {token}"})

        response_json = response.json()
        response_json.pop('created_at', None)
        response_json.pop('updated_at', None)

        assert response.status_code == 200
        assert response_json == {
            "id": 1,
            "name": "New Name",
            "email": user1["email"],
            "is_active": True,
            "is_superuser": False
        }

    def test_edit_user_other(self, client_with_db):
        self.create_user(client_with_db, user1)
        self.create_user(client_with_db, user2)
        token = self.get_token(client_with_db, user1["email"], user1["password"]).json()["access_token"]

        response = client_with_db.put("/user/2", json={"name": "New Name"}, headers={"Authorization": f"Bearer {token}"})

        assert response.status_code == 401
        assert response.json() == {"detail": "You don't have permission to edit this user"}

    def test_delete_user_me(self, client_with_db):
        self.create_user(client_with_db, user1)
        token = self.get_token(client_with_db, user1["email"], user1["password"]).json()["access_token"]

        response = client_with_db.delete("/user/1", headers={"Authorization": f"Bearer {token}"})
        assert response.status_code == 200
        assert response.json() == {"detail": "User deleted successfully"}

    def test_delete_user_other(self, client_with_db):
        self.create_user(client_with_db, user1)
        self.create_user(client_with_db, user2)
        token = self.get_token(client_with_db, user1["email"], user1["password"]).json()["access_token"]

        response = client_with_db.delete("/user/2", headers={"Authorization": f"Bearer {token}"})
        assert response.status_code == 401
        assert response.json() == {"detail": "You don't have permission to delete this user"}


    ## Logged tests (Superuser)
    def test_edit_user_other_superuser(self, client_with_db):
        self.create_user(client_with_db, user1)
        self.create_user(client_with_db, user2)
        self.create_superuser(client_with_db, superuser_json)
        token = self.get_token(client_with_db, superuser_json["email"], superuser_json["password"]).json()["access_token"]

        response = client_with_db.put("/user/2", json={"name": "New Name"}, headers={"Authorization": f"Bearer {token}"})

        response_json = response.json()
        response_json.pop('created_at', None)
        response_json.pop('updated_at', None)

        assert response.status_code == 200
        assert response_json == {
            "id": 2,
            "name": "New Name",
            "email": user2["email"],
            "is_active": True,
            "is_superuser": False
        }

    def test_delete_user_other_superuser(self, client_with_db):
        self.create_user(client_with_db, user1)
        self.create_user(client_with_db, user2)
        self.create_superuser(client_with_db, superuser_json)
        token = self.get_token(client_with_db, superuser_json["email"], superuser_json["password"]).json()["access_token"]

        response = client_with_db.delete("/user/2", headers={"Authorization": f"Bearer {token}"})
        assert response.status_code == 200
        assert response.json() == {"detail": "User deleted successfully"}

    def test_delete_user_not_found(self, client_with_db):
        self.create_superuser(client_with_db, superuser_json)
        token = self.get_token(client_with_db, superuser_json["email"], superuser_json["password"]).json()["access_token"]

        response = client_with_db.delete("/user/2", headers={"Authorization": f"Bearer {token}"})
        assert response.status_code == 404
        assert response.json() == {"detail": "User not found"}

