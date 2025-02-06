BLOGPOST_GET_ALL_RESPONSE_CONFIG = {
    200: {
        "content": {
            "application/json": {
                "example": [
                    {
                        "id": 1,
                        "title": "Blog Post 1",
                        "content": "Content of blog post 1",
                        "user_id": 1,
                        "created_at": "2021-01-01T00:00:00",
                        "updated_at": "2021-01-01T00:00:00"

                    },
                    {
                        "id": 2,
                        "title": "Blog Post 2",
                        "content": "Content of blog post 2",
                        "user_id": 2,
                        "created_at": "2021-01-01T00:00:00",
                        "updated_at": "2021-01-01T00:00:00"
                    }
                ]
            },
        },
        "description": "Blog Posts fetched successfully"
    },
}
BLOGPOST_GET_RESPONSE_CONFIG = {
    200: {
        "content": {
            "application/json": {
                "example": {
                    "id": 1,
                    "title": "Blog Post 1",
                    "content": "Content of blog post 1",
                    "user_id": 1,
                    "created_at": "2021-01-01T00:00:00",
                    "updated_at": "2021-01-01T00:00:00"
                }
            },
        },
        "description": "Blog Post fetched successfully"
    },
    404: {
        "description": "Blog Post not found",
        "content": {
            "application/json": {
                "example": {
                    "detail": "Blog Post not found"
                }
            }
        }
    }
}

BLOGPOST_POST_RESPONSE_CONFIG = {
    201:{
        "description": "Blog Post created successfully",
        "content": {
            "application/json": {
                "example": {
                    "id": 1,
                    "title": "Blog Post 1",
                    "content": "Content of blog post 1",
                    "user_id": 1,
                    "created_at": "2021-01-01T00:00:00",
                    "updated_at": "2021-01-01T00:00:00"
                }
            },
        },
    },
    401:{
        "description": "Not authenticated or not authorized",
        "content": {
            "application/json": {
                "example": {
                    "detail": "Not authenticated or not authorized"
                }
            }
        }
    }
}

BLOGPOST_PUT_RESPONSE_CONFIG = {
    200: {
        "description": "Blog Post updated successfully",
        "content": {
            "application/json": {
                "example": {
                    "id": 1,
                    "title": "Blog Post 1",
                    "content": "Content of blog post 1",
                    "user_id": 1,
                    "created_at": "2021-01-01T00:00:00",
                    "updated_at": "2021-01-01T00:00:00"
                }
            },
        },
    },
    401: {
        "description": "Not authenticated or not authorized",
        "content": {
            "application/json": {
                "example": {
                    "detail": "Not authenticated or not authorized"
                }
            }
        }
    }
}
