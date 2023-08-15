from fastapi import APIRouter
from controllers.user_controller import get_user,create_user,delete_user,update_user,get_user_by_id, search_user, update_user_role

user_router = APIRouter()

user_router.get('/')(get_user)
user_router.post('/')(create_user)
user_router.get('/{id}')(get_user_by_id)
user_router.put('/{id}')(update_user)
user_router.delete('/{id}')(delete_user)
user_router.get('/search/{val}')(search_user)
user_router.put('/role/{id}')(update_user_role)


