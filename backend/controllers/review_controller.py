from sqlalchemy.orm import sessionmaker, joinedload
from model.models import engine, Review
from pydantic import BaseModel
import uuid
from fastapi.responses import JSONResponse
from typing import Optional

Session = sessionmaker(bind=engine)
session = Session()

class ReviewModel(BaseModel):
    reviewName: str
    rating: Optional[float] = None
    comment: str
    produitId: str
    userId: str
    
def get_reviews():
    reviews = session.query(Review).options(joinedload(Review.produit),joinedload(Review.user)).all()
    return {"success":True, "reviews":reviews}

def add_review(body: ReviewModel):
    session.rollback()
    try:
        review = Review(
            id=str(uuid.uuid4()),
            reviewName=body.reviewName,
            rating=body.rating,
            comment=body.comment,
            produitId=body.produitId,
            userId=body.userId
        )
        session.add(review)
        session.commit()
        return {"success":True}  
    except Exception as exc:
        return JSONResponse(content={"success":False,"error":str(exc)}, status_code=500)
    
def delete_review(id: str):
    review = session.query(Review).filter(Review.id == id).first()
    if not review:
        return JSONResponse(content={"success":False,"error":"Review introuvable"}, status_code=500)
    session.delete(review)
    session.commit()
    return {"success":True}

def update_review(body: ReviewModel ,id: str):
    review = session.query(Review).filter(Review.id == id).first()
    if not review:
        return JSONResponse(content={"success":False,"error":"Review introuvable"}, status_code=500)
    review.reviewName=body.reviewName
    review.rating=body.rating
    review.comment=body.comment
    session.commit()
    return {"success":True}