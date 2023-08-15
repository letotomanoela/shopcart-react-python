from fastapi import APIRouter
from controllers.commande_controller import get_commandes, add_commande, delete_commande,update_commande, is_delivered, is_paid


commande_router = APIRouter()

commande_router.get('/')(get_commandes)
commande_router.post('/')(add_commande)
commande_router.delete('/{id}')(delete_commande)
commande_router.put('/{id}')(update_commande)
commande_router.put('/is_delivered/{id}')(is_delivered)
commande_router.put('/is_paid/{id}')(is_paid)