from sqlalchemy.orm import sessionmaker, joinedload
from model.models import engine, Commande, CommandeProduit, Produit
from pydantic import BaseModel
import uuid
from fastapi.responses import JSONResponse
from sqlalchemy import or_
from typing import Optional, Dict, List
from datetime import datetime
import asyncio

Session = sessionmaker(bind=engine)
session = Session()


class CommandeModel(BaseModel):
    payementMethod: str
    payementResult: str
    totalPrix: float
    isPaid: Optional[str] = None
    isDelivered: Optional[str] = None
    paidAt: Optional[str] = None
    deliveredAt: Optional[str] = None
    orderAt: Optional[str] = None
    userId: str
    commandeItems:  List[Dict[str, str]]


class UpdateCommandeModel(BaseModel):
    isPaid: Optional[str]
    isDelivered: Optional[str]
    paidAt: Optional[str]
    deliveredAt: Optional[str]


async def get_commandes():
    await asyncio.sleep(1.8)
    session.rollback()
    commandes = session.query(Commande).options(joinedload(Commande.user), joinedload(
        Commande.commandesItems).joinedload(CommandeProduit.produit)).all()
    return {"success": True, "commandes": commandes}


def add_commande(body: CommandeModel):
    id_commande = str(uuid.uuid4())

    date = datetime.now()
    paidAt = body.paidAt
    if body.payementMethod != 'Paiement à la livraison':
        paidAt = date

    commande_items = body.commandeItems
    commande_name = 'Commande '+id_commande
    session.rollback()
    try:
        commande = Commande(
            id=id_commande,
            commandeName=commande_name,
            payementMethod=body.payementMethod,
            payementResult=body.payementResult,
            totalPrix=body.totalPrix,
            isPaid=body.isPaid,
            isDelivered=body.isDelivered,
            paidAt=paidAt,
            deliveredAt=body.deliveredAt,
            orderAt=date,
            userId=body.userId
        )

        session.add(commande)
        session.commit()

        for item in commande_items:
            sql = CommandeProduit(
                id=str(uuid.uuid4()),
                qteStock=int(item['qteStock']),
                produitId=item['produitId'],
                commandeId=id_commande
            )
            session.add(sql)
            session.commit()
            produit = session.query(Produit).filter(
                Produit.id == item['produitId']).first()
            new_qte = int(produit.qteStock) - int(item['qteStock'])
            produit.qteStock = new_qte
            session.commit()

        return {"success": True}
    except Exception as exc:
        return JSONResponse(content={"success": False, "error": str(exc)}, status_code=500)


def delete_commande(id: str):
    commande = session.query(Commande).filter(Commande.id == id).first()
    if not commande:
        return JSONResponse(content={"success": False, "error": "Commande introuvable"}, status_code=400)
    session.delete(commande)
    session.commit()
    return {"success": True}


def update_commande(body: UpdateCommandeModel, id: str):
    try:
        commande = session.query(Commande).filter(Commande.id == id).first()

        paid_at = body.paidAt
        delevered_at = body.deliveredAt

        if body.paidAt != None:
            paid_at = datetime.strptime(body.paidAt, '%Y-%m-%dT%H:%M:%S')
        if body.deliveredAt != None:
            delivered_at = datetime.strptime(
                body.deliveredAt, '%Y-%m-%dT%H:%M:%S')
        if not commande:
            return JSONResponse(content={"success": False, "error": "Commande introuvable"}, status_code=400)
        commande.isPaid = body.isPaid
        commande.isDelivered = body.isDelivered
        commande.paidAt = paid_at
        commande.deliveredAt = delevered_at
        session.commit()
        return {"success": True}
    except Exception as exc:
        return JSONResponse(content={"success": False, "error": str(exc)}, status_code=400)
    
    
def is_delivered(id:str):
    try:
        commande = session.query(Commande).filter(Commande.id == id).first()
        date = datetime.now()
        if commande:
            commande.isDelivered = "Livré"
            commande.deliveredAt = date
            session.commit()
            return {"success": True}
            
    except Exception as exc:
        return JSONResponse(content={"success": False, "error": str(exc)}, status_code=400)
    
def is_paid(id:str):
    try:
        commande = session.query(Commande).filter(Commande.id == id).first()
        date = datetime.now()
        if commande:
            commande.isPaid = "PAYE"
            commande.paidAt = date
            session.commit()
            return {"success": True}
       
    except Exception as exc:
        return JSONResponse(content={"success": False, "error": str(exc)}, status_code=400)
