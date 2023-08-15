from fastapi import APIRouter
from controllers.produit_controller import get_produits, delete_produit, update_produit, create_produit, search_produit,get_produit_by_id, get_random_produits

produit_router = APIRouter()

produit_router.get('/')(get_produits)
produit_router.get('/get/random')(get_random_produits)
produit_router.post('/')(create_produit)
produit_router.get('/{id}')(get_produit_by_id)
produit_router.delete('/{id}')(delete_produit)
produit_router.put('/{id}')(update_produit)
produit_router.get('/search/{val}')(search_produit)

