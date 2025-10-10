# services/user/app.py
from fastapi import FastAPI, Header
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import jwt
from datetime import datetime, timedelta

# ===== Load the correct .env from auth service
load_dotenv(dotenv_path="../auth/.env")  # يشير على ملف .env الصحيح

# ===== JWT setup
JWT_SECRET = os.getenv("JWT_SECRET", "fallback_secret")
# إزالة أي مسافات أو علامات اقتباس حول الـ secret
JWT_SECRET = JWT_SECRET.strip().strip('"')
print("===== DEBUG JWT_SECRET =====", repr(JWT_SECRET), "length:", len(JWT_SECRET))

def create_token(data: dict, expires_hours: int = 2) -> str:
    payload = data.copy()
    payload["exp"] = datetime.utcnow() + timedelta(hours=expires_hours)
    token = jwt.encode(payload, JWT_SECRET, algorithm="HS256")
    print("Generated JWT token:", token)
    return token

def decode_token(token: str) -> dict | None:
    print("===== DEBUG decode_token =====")
    print("Token received:", token)
    try:
        decoded = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        print("Decoded token:", decoded)
        return decoded
    except jwt.ExpiredSignatureError:
        print("JWT expired")
        return None
    except jwt.InvalidTokenError as e:
        print("JWT invalid:", e)
        return None

# ===== FastAPI app
from routes import profile, password, delete_account

app = FastAPI(title="User Service")

origins = [
    os.getenv("FRONTEND_URL", "http://localhost:3000"),
    os.getenv("AUTH_URL", "http://localhost:4000")
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(profile.router, prefix="/user")
app.include_router(password.router, prefix="/user")
app.include_router(delete_account.router, prefix="/user")

@app.get("/")
async def root():
    return {"message": "User service API is running!"}

@app.get("/test-token")
async def test_token(authorization: str = Header(None)):
    if not authorization:
        return {"detail": "No Authorization header found"}
    token = authorization.replace("Bearer ", "")
    decoded = decode_token(token)
    return {"authorization_received": authorization, "decoded": decoded}


