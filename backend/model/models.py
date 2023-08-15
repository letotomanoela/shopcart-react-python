from sqlalchemy import  Column, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy import create_engine

username = 'letoto'
password = 'manoela'
host = 'localhost'
port = '1521'
service_name = 'xepdb1'

dsn = f"""
    (DESCRIPTION=
        (ADDRESS=(PROTOCOL=TCP)(HOST={host})(PORT={port}))
        (CONNECT_DATA=
            (SERVER=DEDICATED)
            (SERVICE_NAME={service_name})
        )
    )
"""

engine = create_engine(f'oracle+cx_oracle://{username}:{password}@{dsn}')



Base = declarative_base()


class Utilisateur(Base):
    __tablename__ = 'utilisateur'
    
    id = Column(String(255), primary_key=True)
    fullname = Column(String(255))
    address = Column(String(255))
    pseudo = Column(String(255), unique=True)
    email = Column(String(255), unique=True)
    password = Column(String(255))
    is_admin = Column(Integer)
    created_at = Column(DateTime)
    updated_at = Column(DateTime)
    avatar = Column(String(255))
    
    reviews = relationship('Review', back_populates='user', overlaps='user')
    commandes = relationship('Commande', back_populates='user', overlaps='user')

class Produit(Base):
    __tablename__ = 'produits'
    
    id = Column(String(255), primary_key=True)
    productName = Column(String(255))
    image = Column(String(255))
    description = Column(String(2555))
    qteStock = Column(Integer)
    prix = Column(Float)
    color = Column(String(255))
    colorCode = Column(String(255))
    categoryId = Column(String(255), ForeignKey('categories.id'))
    
    categorie = relationship('Categorie', back_populates='produits', overlaps='produits')
    reviews = relationship('Review', back_populates='produit', overlaps='produit')
    commandesItems = relationship('CommandeProduit', back_populates='produit', overlaps='commandesItems')

class Categorie(Base):
    __tablename__ = 'categories'
    
    id = Column(String(255), primary_key=True)
    categoryName = Column(String(255),unique=True)
    photo = Column(String(255))
    backgroundPhoto = Column(String(255))
    categorieDescription = Column(String(255))
    produits = relationship('Produit', back_populates='categorie', overlaps='produits')

class Review(Base):
    __tablename__ = 'reviews'
    
    id = Column(String(255), primary_key=True)
    reviewName = Column(String(255))
    rating = Column(Float)
    comment = Column(String(255))
    produitId = Column(String(255), ForeignKey('produits.id'))
    userId = Column(String(255), ForeignKey('utilisateur.id'))
    
    produit = relationship('Produit', back_populates='reviews', overlaps='reviews')
    user = relationship('Utilisateur', back_populates='reviews', overlaps='reviews')

class Commande(Base):
    __tablename__ = 'commandes'
    
    id = Column(String(255), primary_key=True)
    commandeName = Column(String(255))
    payementMethod = Column(String(255))
    payementResult = Column(String(255))
    totalPrix = Column(Float)
    isPaid = Column(String(255))
    isDelivered = Column(String(255))
    paidAt = Column(DateTime)
    deliveredAt = Column(DateTime)
    orderAt = Column(DateTime)
    userId = Column(String(255), ForeignKey('utilisateur.id'))
    
    user = relationship('Utilisateur', back_populates='commandes', overlaps='commandes')
    commandesItems = relationship('CommandeProduit', back_populates='commande', overlaps='commandesItems')

class CommandeProduit(Base):
    __tablename__ = 'commande_produits'
    
    id = Column(String(255), primary_key=True)
    qteStock = Column(Integer)
    produitId = Column(String(255), ForeignKey('produits.id'))
    commandeId = Column(String(255), ForeignKey('commandes.id')) 
    produit = relationship('Produit', back_populates='commandesItems', overlaps='commandesItems')
    commande = relationship('Commande', back_populates='commandesItems', overlaps='commandesItems')

if __name__ == '__main__':
    #Base.metadata.drop_all(engine)
    Base.metadata.create_all(engine)
    



