from fastapi import FastAPI
from fastapi.routing import APIRouter
from routes.user_routes import user_router
from routes.auth_route import auth_router
from routes.categorie_routes import categorie_router
from routes.produit_routes import produit_router
from routes.review_routes import review_router
from routes.commande_route import commande_router
from fastapi.middleware.cors import CORSMiddleware
from routes.upload_route import upload_router
from fastapi.staticfiles import StaticFiles
app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:5173",
    # Add your frontend URLs or "*" to allow all origins
]


# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router, prefix="/user")
app.include_router(auth_router, prefix="/auth")
app.include_router(categorie_router, prefix="/categorie")
app.include_router(produit_router, prefix="/produit")
app.include_router(review_router, prefix="/review")
app.include_router(commande_router, prefix="/commande")
app.include_router(upload_router, prefix="/upload")

app.mount('/uploads', StaticFiles(directory='uploads'), name="uploads")


@app.get("/")
def home():
    return {"message": "Bienvenue sur la page d'accueil de FastAPI"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)
