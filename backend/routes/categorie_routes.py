from fastapi import APIRouter
from controllers.categorie_controller import get_categories, create_categorie, update_categorie, delete_categorie, get_categorie_by_id

categorie_router = APIRouter()

categorie_router.get('/')(get_categories)
categorie_router.post('/')(create_categorie)
categorie_router.put('/{id}')(update_categorie)
categorie_router.delete('/{id}')(delete_categorie)
categorie_router.get('/{id}')(get_categorie_by_id)