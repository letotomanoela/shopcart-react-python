from sqlalchemy.orm import sessionmaker, joinedload
from model.models import engine, Utilisateur, Review, Produit, Commande, CommandeProduit 
from datetime import datetime
from pydantic import BaseModel
from utils.hashing import Hash
import uuid
from fastapi.responses import JSONResponse
from sqlalchemy import or_ 

from fastapi import Depends
from utils.customError import extract_error_info
from typing import Optional
import asyncio

Session = sessionmaker(bind=engine)
session = Session()

class AddUserModel(BaseModel):
    fullname: str
    pseudo: str
    password: str

class UpdateUserModel(BaseModel):
    fullname: str
    avatar: Optional[str] = None
    address: Optional[str] = None
    email: Optional[str] = None  
    
class Role(BaseModel):
    is_admin: int 

async def get_user():
    await asyncio.sleep(1.5)
    users = session.query(Utilisateur).all()
    return {"success":True, "data":users}

def get_user_by_id(id: str):
    user = session.query(Utilisateur).options(joinedload(Utilisateur.reviews).joinedload(Review.produit), joinedload(Utilisateur.commandes).joinedload(Commande.commandesItems).joinedload(CommandeProduit.produit)).filter(Utilisateur.id == id).first()
    if not user:
        return JSONResponse(content={"success": False,"error":"Utilisateur introuvable"},status_code=400)
    return {"success":True,"data":user}

def search_user(val: str):
    
    users = session.query(Utilisateur).filter(or_(Utilisateur.fullname.ilike(f'%{val}%'), Utilisateur.email.ilike(f'%{val}%'))).all()
    if not users:
        return JSONResponse(content={"success": False,"error":"Utilisateur introuvable"},status_code=400)
    return {"success":True,"data":users}

def create_user(request: AddUserModel):
   
    try:
        session.rollback()
        date = datetime.now()
        isAdmin = 0
        utilisateur = Utilisateur(
        id=str(uuid.uuid4()),
        fullname=request.fullname,
        address='',
        pseudo=request.pseudo,
        email='',
        password=Hash.bcrypt(request.password),
        is_admin=isAdmin,
        created_at=date,
        updated_at=date,
        avatar=''
        )
        session.add(utilisateur)
        session.commit()
        return JSONResponse(content={"success": True})
    except Exception as exc:
        custom_error_message = "Une erreur s'est produite : Veuiller choisir autre pseudo"
        return JSONResponse(content={"success":False,"error": custom_error_message, "message":str(exc)}, status_code=500)
def update_user(data: UpdateUserModel,id: str):
    user = session.query(Utilisateur).filter(Utilisateur.id == id).first()
    if user:
        # Modifier les attributs de l'utilisateur
        user.fullname = data.fullname
        user.address = data.address
        user.avatar = data.avatar
        user.email = data.email

    # Effectuer le commit pour sauvegarder les modifications
        session.commit()
        return JSONResponse(content={"success": True})
    
    return JSONResponse(content={"success":False,"error":"Utilisateur introuvable"}, status_code=400)

def update_user_role(request: Role, id:str):
    user = session.query(Utilisateur).filter(Utilisateur.id == id).first()
    if user:
        user.is_admin = int(request.is_admin)
        session.commit()
        return JSONResponse(content={"success": True})   
    
    return JSONResponse(content={"success":False,"error":"Utilisateur introuvable"}, status_code=400)
    
    

def delete_user(id: str):
    user = session.query(Utilisateur).filter(Utilisateur.id == id).first()
    if not user:
        return JSONResponse(content={"success": False,"error":"Utilisateur introuvable"},status_code=400)
    session.delete(user)
    session.commit()
    return JSONResponse(content={"success": True})

