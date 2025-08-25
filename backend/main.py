from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from contextlib import asynccontextmanager
import os
import logging
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
#changes
from main1 import ProductOptimizer
from pydantic import BaseModel
# Create instance (no parameters needed)
optimizer = ProductOptimizer()

# Your existing imports (unchanged)
from auth import router as auth_router

# New multi-agent imports
from multi_agent.routes import agent_router, workflow_router
from multi_agent.websocket import manager
from multi_agent.models import Agent, Task, Workflow

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Database connection for multi-agent features
async def init_multi_agent_db():
    try:
        client = AsyncIOMotorClient(os.getenv("MONGO_URI", "mongodb://localhost:27017"))
        database = client[os.getenv("DB_NAME", "multi_agent_system")]
        await init_beanie(database=database, document_models=[Agent, Task, Workflow])
        logger.info("✅ Multi-agent database initialized")
    except Exception as e:
        logger.warning(f"Multi-agent DB init failed: {e}")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("🚀 Starting Enhanced FastAPI Auth Backend...")
    await init_multi_agent_db()
    yield
    # Shutdown
    logger.info("👋 Shutting down...")

# Your existing FastAPI app setup
app = FastAPI(
    title="Multi-Agent Collaboration System",
    description="FastAPI Auth Backend with Multi-Agent Support",
    version="1.0.0",
    lifespan=lifespan
)

# Your existing CORS setup
origins = [os.getenv("FRONTEND_URL", "http://localhost:8080")]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins + ["*"],  # Add * for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Your existing session middleware
app.add_middleware(SessionMiddleware, secret_key=os.getenv("SESSION_SECRET", "SESSION_SECRET"))

# Your existing auth routes (unchanged)
app.include_router(auth_router)

# NEW: Multi-agent routes
app.include_router(agent_router)
app.include_router(workflow_router)

# NEW: WebSocket for real-time updates
@app.websocket("/ws/{workflow_id}")
async def websocket_endpoint(websocket: WebSocket, workflow_id: str):
    await manager.connect(websocket, workflow_id)
    try:
        while True:
            data = await websocket.receive_text()
            logger.info(f"WebSocket received: {data}")
    except WebSocketDisconnect:
        manager.disconnect(websocket, workflow_id)

# Your existing root endpoint (unchanged)
@app.get("/")
def root():
    return {
        "msg": "FastAPI Auth Backend Running",
        "features": ["Authentication", "Multi-Agent Workflows", "WebSocket Support"],
        "version": "1.0.0"
    }
class ProductRequest(BaseModel):
    product_id: int
# NEW: Health check
@app.get("/health")
def health():
    return {"status": "healthy", "timestamp": "2025-08-25"}
@app.post("/analyze")
def analyze_product(request: ProductRequest):
    try:
        result = optimizer.run(request.product_id)

        # unpack final summary cleanly
        return {
            "status": "success",
            "product_id": result["final_summary"]["product_id"],
            "demand_forecast": result["final_summary"]["demand_forecast"],
            "optimized_price": result["final_summary"]["optimized_price"],
            "inventory": result["final_summary"]["inventory"],
            "message": result["message"]
        }

    except Exception as e:
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
