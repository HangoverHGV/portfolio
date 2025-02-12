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