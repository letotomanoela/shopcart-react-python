from sqlalchemy.orm import sessionmaker, joinedload
from model.models import engine, Produit, Review
from pydantic import BaseModel
import uuid
from fastapi.responses import JSONResponse
from sqlalchemy import or_
from fastapi import Depends
from typing import Optional
import asyncio
from sqlalchemy.sql import func
import random


Session = sessionmaker(bind=engine)
session = Session()


class ProduitModel(BaseModel):
    productName: str
    image: str
    description: Optional[str] = None
    qteStock: int
    prix: float
    color: Optional[str] = None
    colorCode: Optional[str] = None
    categoryId: str


async def get_produits():
    await asyncio.sleep(1.5)
    session.rollback()
    produits = session.query(Produit).options(joinedload(Produit.categorie), joinedload(
        Produit.reviews)).order_by(Produit.productName.asc()).all()
    return {"success": True, "data": produits}

def get_random_produits():
    try:
        session.rollback()
        produits = session.query(Produit).order_by(func.dbms_random.random()).limit(7).all()
        return {"data": produits}
    except Exception as exc:
        return JSONResponse(content={"success": False, "error": str(exc)}, status_code=400)

async def create_produit(body: ProduitModel):

    session.rollback()
    try:
        produit = Produit(
            id=str(uuid.uuid4()),
            productName=body.productName,
            image=body.image,
            description=body.description,
            qteStock=body.qteStock,
            prix=body.prix,
            color=body.color,
            colorCode=body.colorCode,
            categoryId=body.categoryId,
        )

        session.add(produit)
        session.commit()
        await asyncio.sleep(1.5)
        return {"success": True}
    except Exception as exc:
        return JSONResponse(content={"success": False, "error": str(exc)}, status_code=400)


def update_produit(body: ProduitModel, id: str):
    produit = session.query(Produit).filter(Produit.id == id).first()
    if not produit:
        return JSONResponse(content={"success": False, "error": "Produit introuvable"}, status_code=400)
    try:
        produit.productName = body.productName
        produit.image = body.image
        produit.description = body.description
        produit.qteStock = body.qteStock
        produit.prix = body.prix
        produit.color = body.color
        produit.colorCode = body.colorCode
        produit.categoryId = body.categoryId
        session.commit()
        return {"success": True}
    except Exception as exc:
        return JSONResponse(content={"success": False, "error": str(exc)}, status_code=400)


def delete_produit(id: str):
    produit = session.query(Produit).filter(Produit.id == id).first()
    if not produit:
        return JSONResponse(content={"success": False, "error": "Produit introuvable"}, status_code=400)
    session.delete(produit)
    session.commit()
    return {"success": True}


async def search_produit(val: str):
    await asyncio.sleep(1.5)
    produit = session.query(Produit).options(joinedload(
        Produit.reviews).joinedload(Review.user)).filter(or_(Produit.description.ilike(
            f'%{val}%'), Produit.productName.ilike(f'%{val}%'))).all()
    if not produit:
        return JSONResponse(content={"success": False, "error": "Produit introuvable"}, status_code=400)
    return {"success": True, "produit": produit}


def get_produit_by_id(id: str):
    produit = session.query(Produit).options(joinedload(
        Produit.reviews).joinedload(Review.user)).filter(Produit.id == id).first()
    if not produit:
        return JSONResponse(content={"success": False, "error": "Produit introuvable"}, status_code=400)
    return {"success": True, "produit": produit}

    produit = session.query(Produit).f
