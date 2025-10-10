from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import os
from dotenv import load_dotenv
import stripe
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime

load_dotenv()

app = FastAPI(title="Payment Service")

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:
    raise RuntimeError("MONGO_URI not set in .env")

client = AsyncIOMotorClient(MONGO_URI)
db = client["amazon_clone"]
payments_collection = db["payments"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PaymentIntent(BaseModel):
    amount: int
    currency: str = "usd"
    orderId: str
    userId: str

class PaymentConfirm(BaseModel):
    paymentIntentId: str
    orderId: str

@app.get("/")
async def root():
    return {"message": "Payment service is running!"}

@app.post("/api/payment/create-intent")
async def create_payment_intent(payment: PaymentIntent):
    try:
        intent = stripe.PaymentIntent.create(
            amount=payment.amount,
            currency=payment.currency,
            metadata={
                "order_id": payment.orderId,
                "user_id": payment.userId
            }
        )

        await payments_collection.insert_one({
            "paymentIntentId": intent.id,
            "orderId": payment.orderId,
            "userId": payment.userId,
            "amount": payment.amount,
            "currency": payment.currency,
            "status": "pending",
            "createdAt": datetime.utcnow()
        })

        return {
            "clientSecret": intent.client_secret,
            "paymentIntentId": intent.id
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/payment/confirm")
async def confirm_payment(confirmation: PaymentConfirm):
    try:
        await payments_collection.update_one(
            {"paymentIntentId": confirmation.paymentIntentId},
            {"$set": {"status": "completed", "updatedAt": datetime.utcnow()}}
        )

        return {"message": "Payment confirmed successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/payment/{payment_id}")
async def get_payment(payment_id: str):
    payment = await payments_collection.find_one({"paymentIntentId": payment_id})
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")

    payment["_id"] = str(payment["_id"])
    return payment

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 5004))
    uvicorn.run(app, host="0.0.0.0", port=port)
