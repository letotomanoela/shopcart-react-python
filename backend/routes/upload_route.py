from fastapi import APIRouter
from controllers.upload_controller import upload_image

upload_router = APIRouter()

upload_router.post("/")(upload_image)