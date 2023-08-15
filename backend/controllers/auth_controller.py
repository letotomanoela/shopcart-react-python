from auth.oauth2 import create_access_token, set_cookie
from sqlalchemy.orm import sessionmaker
from model.models import engine, Utilisateur

from pydantic import BaseModel
from utils.hashing import Hash
import uuid
from fastapi.responses import JSONResponse
from fastapi import Response
from sqlalchemy import or_
Session = sessionmaker(bind=engine)
session = Session()


class LoginModel(BaseModel):
    pseudo: str
    password: str


def login(body: LoginModel, response: Response):
    pseudo = body.pseudo
    password = body.password
    user = session.query(Utilisateur).filter(Utilisateur.pseudo == pseudo).with_entities(
        Utilisateur.pseudo, Utilisateur.password, Utilisateur.is_admin, Utilisateur.id).first()
    if not user:
        return JSONResponse(content={"success": False, "error": "Pseudo introuvable", "field": "pseudo"}, status_code=400)
    else:
        if Hash.verify(user.password, password):
            if user.is_admin == 0:
                admin = False
            else:
                admin = True
            user_data = {
                'id': user.id
            }
            token = create_access_token(data=user_data)

            response.set_cookie(
                key="jwt",
                value=token,

            )
            return {"success": True, "token": token, "admin": admin, "user_id": user.id, "token_type": 'bearer'}
        return JSONResponse(content={"success": False, "error": "Mot de passe incorrect", "field": "password"}, status_code=400)
