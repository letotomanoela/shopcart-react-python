from fastapi import APIRouter
from controllers.review_controller import get_reviews, add_review, delete_review, update_review

review_router = APIRouter()

review_router.get('/')(get_reviews)
review_router.post('/')(add_review)
review_router.delete('/{id}')(delete_review)
review_router.put('/{id}')(update_review)

