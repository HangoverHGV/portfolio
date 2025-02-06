BLOGPOST_GET_ALL_RESPONSE_CONFIG = {
    200: {
        "content": {
            "application/json": {
                "example": [
                    {
                        "id": 1,
                        "title": "Blog Post 1",
                        "content": "Content of blog post 1"
                    },
                    {
                        "id": 2,
                        "title": "Blog Post 2",
                        "content": "Content of blog post 2"
                    }
                ]
            },
        },
        "description": "Blog Posts fetched successfully"
    },
}