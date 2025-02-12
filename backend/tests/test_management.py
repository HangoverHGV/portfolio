"""
Tests for the Management API endpoints using FastAPI TestClient and an in-memory SQLite database.

"""
from http.client import responses

from conftest import client_with_db

user1 = {
    "name": "Test User",
    "email": "test@example.com",
    "password": "password"
}

superuser = {
    "name": "superuser",
    "email": "superuser@example.com",
    "password": "password",
    "is_superuser": True,
}

schedule1 = {
    "title": "Test Schedule1"
}

schedule2 = {
    "title": "Test Schedule2"
}

resource1 = {
    "name": "Test Resource1",
    "datetime_started": "2021-01-01T00:00:00",
    "datetime_ended": "2021-01-01T01:00:00"
}

resource2 = {
    "name": "Test Resource2",
    "datetime_started": "2021-01-01T02:00:00",
    "datetime_ended": "2021-01-01T03:00:00"
}


class TestManagement:
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

    def create_schedule(self, client_with_db, schedule_json, token):
        response = client_with_db.post("/management/schedules", json=schedule_json,
                                       headers={"Authorization": f"Bearer {token.json()['access_token']}"})
        return response

    def create_resource(self, client_with_db, resource_json, token):
        response = client_with_db.post("/management/resources", json=resource_json,
                                       headers={"Authorization": f"Bearer {token.json()['access_token']}"})
        return response

    def test_get_all_schedules(self, client_with_db):
        response = client_with_db.get("/management/schedules")
        assert response.status_code == 401
        assert response.json() == {"detail": "Not authenticated"}
        # login as user
        user = self.create_user(client_with_db, user1)
        token = self.get_token(client_with_db, user1['email'], user1['password'])
        response = client_with_db.get("/management/schedules",
                                      headers={"Authorization": f"Bearer {token.json()['access_token']}"})
        assert response.status_code == 200

    def test_create_schedule(self, client_with_db):
        response = client_with_db.post("/management/schedules", json=schedule1)
        assert response.status_code == 401
        # login as user
        user = self.create_user(client_with_db, user1)
        token = self.get_token(client_with_db, user1['email'], user1['password'])
        response = self.create_schedule(client_with_db, schedule1, token)
        assert response.status_code == 201
        assert response.json() == {
            "id": 1,
            "title": "Test Schedule1",
            "user_id": 1,
            "created_at": response.json()['created_at'],
            "updated_at": response.json()['updated_at']
        }

    def test_get_one_schedule(self, client_with_db):
        response = client_with_db.get("/management/schedules/1")
        assert response.status_code == 401
        assert response.json() == {"detail": "Not authenticated"}

        # create user
        user = self.create_user(client_with_db, user1)
        # create schedule
        token = self.get_token(client_with_db, user1['email'], user1['password'])
        schedule = self.create_schedule(client_with_db, schedule1, token)
        # get schedule
        response = client_with_db.get("/management/schedules/1",
                                      headers={"Authorization": f"Bearer {token.json()['access_token']}"})
        assert response.status_code == 200
        assert response.json() == {
            "id": 1,
            "title": "Test Schedule1",
            "user_id": 1,
            "created_at": response.json()['created_at'],
            "updated_at": response.json()['updated_at']
        }

        response = client_with_db.get("/management/schedules/2",
                                      headers={"Authorization": f"Bearer {token.json()['access_token']}"})
        assert response.status_code == 404
        assert response.json() == {"detail": "Schedule not found"}

    def test_edit_schedule(self, client_with_db):
        response = client_with_db.put("/management/schedules/1", json={"title": "New Title"})
        assert response.status_code == 401
        assert response.json() == {"detail": "Not authenticated"}

        # create user
        user = self.create_user(client_with_db, user1)
        # create schedule
        token = self.get_token(client_with_db, user1['email'], user1['password'])
        schedule = self.create_schedule(client_with_db, schedule1, token)
        # edit schedule
        response = client_with_db.put("/management/schedules/1", json={"title": "New Title"},
                                      headers={"Authorization": f"Bearer {token.json()['access_token']}"})
        assert response.status_code == 200
        assert response.json() == {
            "id": 1,
            "title": "New Title",
            "user_id": 1,
            "created_at": response.json()['created_at'],
            "updated_at": response.json()['updated_at']
        }

        response = client_with_db.put("/management/schedules/2", json={"title": "New Title"},
                                      headers={"Authorization": f"Bearer {token.json()['access_token']}"})
        assert response.status_code == 404
        assert response.json() == {"detail": "Schedule not found"}

    def test_delete_schedule(self, client_with_db):
        response = client_with_db.delete("/management/schedules/1")
        assert response.status_code == 401
        assert response.json() == {"detail": "Not authenticated"}

        # create user
        user = self.create_user(client_with_db, user1)
        # create schedule
        token = self.get_token(client_with_db, user1['email'], user1['password'])
        schedule = self.create_schedule(client_with_db, schedule1, token)
        # delete schedule
        response = client_with_db.delete("/management/schedules/1",
                                         headers={"Authorization": f"Bearer {token.json()['access_token']}"})
        assert response.status_code == 200
        assert response.json() == {"detail": "Schedule deleted successfully"}

        response = client_with_db.delete("/management/schedules/2",
                                            headers={"Authorization": f"Bearer {token.json()['access_token']}"})
        assert response.status_code == 404
        assert response.json() == {"detail": "Schedule not found"}

    def test_get_all_resources(self, client_with_db):
        response = client_with_db.get("/management/resources")
        assert response.status_code == 401
        assert response.json() == {"detail": "Not authenticated"}
        # login as user
        user = self.create_user(client_with_db, user1)
        token = self.get_token(client_with_db, user1['email'], user1['password'])
        response = client_with_db.get("/management/resources",
                                      headers={"Authorization": f"Bearer {token.json()['access_token']}"})
        assert response.status_code == 200

    def test_create_resource(self, client_with_db):
        response = client_with_db.post("/management/resources", json=resource1)
        assert response.status_code == 401
        # login as user
        user = self.create_user(client_with_db, user1)
        token = self.get_token(client_with_db, user1['email'], user1['password'])
        schedule = self.create_schedule(client_with_db, schedule1, token)
        resource1['schedule_id'] = 1
        response = self.create_resource(client_with_db, resource1, token)
        assert response.status_code == 201
        assert response.json() == {
            "id": 1,
            "name": "Test Resource1",
            "datetime_started": "2021-01-01T00:00:00",
            "datetime_ended": "2021-01-01T01:00:00",
            "schedule_id": 1,
            "user_id": 1,
            "created_at": response.json()['created_at'],
            "updated_at": response.json()['updated_at']
        }

    def test_get_one_resource(self, client_with_db):
        response = client_with_db.get("/management/resources/1")
        assert response.status_code == 401
        assert response.json() == {"detail": "Not authenticated"}

        # create user
        user = self.create_user(client_with_db, user1)
        # create resource
        token = self.get_token(client_with_db, user1['email'], user1['password'])
        schedule = self.create_schedule(client_with_db, schedule1, token)
        resource1['schedule_id'] = 1
        resource = self.create_resource(client_with_db, resource1, token)
        # get resource
        response = client_with_db.get("/management/resources/1",
                                      headers={"Authorization": f"Bearer {token.json()['access_token']}"})
        assert response.status_code == 200
        assert response.json() == {
            "id": 1,
            "name": "Test Resource1",
            "datetime_started": "2021-01-01T00:00:00",
            "datetime_ended": "2021-01-01T01:00:00",
            "schedule_id": 1,
            "user_id": 1,
            "created_at": response.json()['created_at'],
            "updated_at": response.json()['updated_at']
        }

        response = client_with_db.get("/management/resources/2",
                                      headers={"Authorization": f"Bearer {token.json()['access_token']}"})
        assert response.status_code == 404
        assert response.json() == {"detail": "Resource not found"}

    def test_edit_resource(self, client_with_db):
        response = client_with_db.put("/management/resources/1", json={"name": "New Name"})
        assert response.status_code == 401
        assert response.json() == {"detail": "Not authenticated"}

        user = self.create_user(client_with_db, user1)
        token = self.get_token(client_with_db, user1['email'], user1['password'])
        schedule = self.create_schedule(client_with_db, schedule1, token)
        resource = self.create_resource(client_with_db, resource1, token)
        response = client_with_db.put("/management/resources/1", json={"name": "New Name"},
                                      headers={"Authorization": f"Bearer {token.json()['access_token']}"})
        assert response.status_code == 200
        assert response.json() == {
            "id": 1,
            "name": "New Name",
            "datetime_started": "2021-01-01T00:00:00",
            "datetime_ended": "2021-01-01T01:00:00",
            "schedule_id": 1,
            "user_id": 1,
            "created_at": response.json()['created_at'],
            "updated_at": response.json()['updated_at']
        }

        response = client_with_db.put("/management/resources/2", json={"name": "New Name"},
                                      headers={"Authorization": f"Bearer {token.json()['access_token']}"})
        assert response.status_code == 404
        assert response.json() == {"detail": "Schedule or Resource not found"}

        response = client_with_db.put("/management/resources/1", json={"name": "New Name", "schedule_id": 2},
                                        headers={"Authorization": f"Bearer {token.json()['access_token']}"})
        assert response.status_code == 404
        assert response.json() == {"detail": "Schedule or Resource not found"}

        sch2 = self.create_schedule(client_with_db, schedule2, token)
        response = client_with_db.put("/management/resources/1", json={"name": "New Name", "schedule_id": 2},
                                        headers={"Authorization": f"Bearer {token.json()['access_token']}"})
        assert response.status_code == 200
        assert response.json() == {
            "id": 1,
            "name": "New Name",
            "datetime_started": "2021-01-01T00:00:00",
            "datetime_ended": "2021-01-01T01:00:00",
            "schedule_id": 2,
            "user_id": 1,
            "created_at": response.json()['created_at'],
            "updated_at": response.json()['updated_at']
        }


