from fastapi import FastAPI
from pydantic import BaseModel

from main1 import ProductOptimizer

# Create instance (no parameters needed)
optimizer = ProductOptimizer()
app = FastAPI(title="Product Intelligence API")

class ProductRequest(BaseModel):
    product_id: int

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

@app.get("/")
def root():
    return {"message": "✅ API running. Use POST /analyze with product_id"}