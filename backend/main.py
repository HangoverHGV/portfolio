"""
This is the main file of the FastAPI application. It is the entry point of the application.
"""

from configs import app
from user.endpoints import router as user_router
from blogpost.endpoints import router as blogpost_router
from management.endpoints import router as management_router

app.include_router(user_router, prefix="/user")
app.include_router(blogpost_router, prefix="/blogpost")
app.include_router(management_router, prefix="/management")


if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=8000, reload=True)


