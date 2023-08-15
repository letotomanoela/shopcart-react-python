from fastapi import APIRouter
from controllers.auth_controller import login

auth_router = APIRouter()

auth_router.post('/login')(login)