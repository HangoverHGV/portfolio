GET_ALL_SCHEDULES = {
    200: {
        "content": {
            "application/json": {
                "example": [
                    {
                        "id": 1,
                        "title": "Schedule 1",
                        "user_id": 1,
                        "created_at": "2021-01-01T00:00:00",
                        "updated_at": "2021-01-01T00:00:00"
                    },
                    {
                        "id": 2,
                        "title": "Schedule 2",
                        "user_id": 2,
                        "created_at": "2021-01-01T00:00:00",
                        "updated_at": "2021-01-01T00:00:00"
                    }
                ]
            },
        },
        "description": "Schedules fetched successfully"
    },
}

CREATE_SCHEDULE = {
    200: {
        "content": {
            "application/json": {
                "example": {
                    "title": "Test Schedule1",
                    "user_id": 1,
                    "created_at": "2021-01-01T00:00:00",
                    "updated_at": "2021-01-01T00:00:00"
                }
            },
        },
        "description": "Schedule created successfully"
    },
    401: {
        "description": "Not authenticated"
    },
}

GET_ONE_SCHEDULE = {
    200: {
        "content": {
            "application/json": {
                "example": {
                    "id": 1,
                    "title": "Test Schedule1",
                    "user_id": 1,
                    "created_at": "2021-01-01T00:00:00",
                    "updated_at": "2021-01-01T00:00:00"
                }
            },
        },
        "description": "Schedule fetched successfully"
    },
    401: {
        "description": "Not authenticated"
    },
    404: {
        "description": "Schedule not found"
    },
}

EDIT_SCHEDULE = {
    200: {
        "content": {
            "application/json": {
                "example": {
                    "title": "Test Schedule1",
                    "user_id": 1,
                    "created_at": "2021-01-01T00:00:00",
                    "updated_at": "2021-01-01T00:00:00"
                }
            },
        },
        "description": "Schedule updated successfully"
    },
    401: {
        "description": "Not authenticated"
    },
    404: {
        "description": "Schedule not found"
    },
}

DELETE_SCHEDULE = {
    200: {
        "content": {
            "application/json": {
                "example": {
                    "detail": "Schedule deleted successfully"
                }
            },
        },
        "description": "Schedule deleted successfully"
    },
    401: {
        "description": "Not authenticated"
    },
    404: {
        "description": "Schedule not found"
    },
}

GET_ALL_RESOURCES = {
    200: {
        "content": {
            "application/json": {
                "example": [
                    {
                        "id": 1,
                        "name": "Resource 1",
                        "datetime_started": "2021-01-01T00:00:00",
                        "datetime_ended": "2021-01-01T00:00:00",
                        "schedule_id": 1,
                        "user_id": 1,
                        "created_at": "2021-01-01T00:00:00",
                        "updated_at": "2021-01-01T00:00:00"
                    },
                    {
                        "id": 2,
                        "name": "Resource 2",
                        "datetime_started": "2021-01-01T00:00:00",
                        "datetime_ended": "2021-01-01T00:00:00",
                        "schedule_id": 2,
                        "user_id": 2,
                        "created_at": "2021-01-01T00:00:00",
                        "updated_at": "2021-01-01T00:00:00"
                    }
                ]
            },
        },
        "description": "Resources fetched successfully"
    },
}

CREATE_RESOURCE = {
    200: {
        "content": {
            "application/json": {
                "example": {
                    "name": "Test Resource1",
                    "datetime_started": "2021-01-01T00:00:00",
                    "datetime_ended": "2021-01-01T01:00:00",
                    "schedule_id": 1,
                    "user_id": 1,
                    "created_at": "2021-01-01T00:00:00",
                    "updated_at": "2021-01-01T00:00:00"
                }
            },
        },
        "description": "Resource created successfully"
    },
    401: {
        "description": "Not authenticated"
    },
    404: {
        "description": "Schedule not found"
    },
}

GET_ONE_RESOURCE = {
    200: {
        "content": {
            "application/json": {
                "example": {
                    "id": 1,
                    "name": "Test Resource1",
                    "datetime_started": "2021-01-01T00:00:00",
                    "datetime_ended": "2021-01-01T01:00:00",
                    "schedule_id": 1,
                    "user_id": 1,
                    "created_at": "2021-01-01T00:00:00",
                    "updated_at": "2021-01-01T00:00:00"
                }
            },
        },
        "description": "Resource fetched successfully"
    },
    401: {
        "description": "Not authenticated"
    },
    404: {
        "description": "Resource not found"
    },
}

EDIT_RESOURCE = {
    200: {
        "content": {
            "application/json": {
                "example": {
                    "name": "Test Resource1",
                    "datetime_started": "2021-01-01T00:00:00",
                    "datetime_ended": "2021-01-01T01:00:00",
                    "schedule_id": 1,
                    "user_id": 1,
                    "created_at": "2021-01-01T00:00:00",
                    "updated_at": "2021-01-01T00:00:00"
                }
            },
        },
        "description": "Resource updated successfully"
    },
    401: {
        "description": "Not authenticated"
    },
    404: {
        "description": "Schedule or Resource not found"
    },
}

