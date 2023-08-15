# shopcart-react-python

Vous devez avoir un base données ORACLE 21g Express Edition sur votre machine.
Puis créer un utilisateur avec votre username et password 
Par exemple :
    username = 'user'
    password = 'password'
    host = 'localhost'
    port = '1521'
    service_name = 'xepdb1'
Après avoir configuer la base de donnéé, vous devez créer un environnement virtuel avec Python puis installer les packages python suivants:
sqlalchemy, passlib, uuid, fastapi, cx_oracle, uvicorn, jose, dotenv, python-jose

Puis lancer le serveur FastAPI par : "uvicorn main:app --reload"

Pour le dossier frontend, il faut executer la commande : "npm install".
Puis pour lancer React : "npm run dev"

Et voilà , l'application est lancé
