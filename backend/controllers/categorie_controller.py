from sqlalchemy.orm import sessionmaker, joinedload
from model.models import engine, Categorie
from pydantic import BaseModel
import uuid
from fastapi.responses import JSONResponse
from typing import Optional
import asyncio

Session = sessionmaker(bind=engine)
session = Session()


class CategorieModel(BaseModel):
    categoryName: str
    photo: Optional[str]
    backgroundPhoto: Optional[str]
    categorieDescription: Optional[str]


def get_categories():
    categories = session.query(Categorie).options(
        joinedload(Categorie.produits)).all()

    return {"success": True, "data": categories}


async def get_categorie_by_id(id: str):
    await asyncio.sleep(1.5)
    categorie = session.query(Categorie).options(joinedload(
        Categorie.produits)).filter(Categorie.id == id).first()
    return {"success": True, "data": categorie}


async def create_categorie(body: CategorieModel):

    try:
        session.rollback()
        categorie = Categorie(id=str(uuid.uuid4()), categoryName=body.categoryName, photo=body.photo,
                              backgroundPhoto=body.backgroundPhoto, categorieDescription=body.categorieDescription)
        session.add(categorie)
        session.commit()
        await asyncio.sleep(1.5)
        return {"success": True}
    except Exception as exc:
        return JSONResponse(content={"success": False, "error": "Cet catégorie éxiste déjà"}, status_code=400)


async def delete_categorie(id: str):
    try:
        categorie = session.query(Categorie).filter(Categorie.id == id).first()
        if not categorie:
            return JSONResponse(content={"success": False, "error": "Catégorie introuvable"}, status_code=400)
        session.delete(categorie)
        session.commit()
        await asyncio.sleep(1.5)
        return {"success": True}
    except Exception as exc:
        return JSONResponse(content={"success": False, "error": "Vous ne pouvez pas supprimer cet catégorie"}, status_code=400)


async def update_categorie(body: CategorieModel, id: str):
    try:
        categorie = session.query(Categorie).filter(Categorie.id == id).first()
        if not categorie:
            return JSONResponse(content={"success": False, "error": "Catégorie introuvable"}, status_code=400)
        categorie.categoryName = body.categoryName
        categorie.photo = body.photo
        categorie.backgroundPhoto = body.backgroundPhoto
        categorie.categorieDescription = body.categorieDescription
        session.commit()
        await asyncio.sleep(1.5)
        return {"success": True}
    except Exception as exc:
        return JSONResponse(content={"success": False, "error": "Un erreur s'est produite"}, status_code=400)
