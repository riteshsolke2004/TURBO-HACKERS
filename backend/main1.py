import pickle
import joblib
import pandas as pd
import numpy as np
import xgboost
import sys
from langgraph.graph import StateGraph, END


class ProductOptimizer:
    def __init__(self):
        # ---------- Load Super Dataset ----------
        self.super_dataset = pd.read_csv("cleaned_sample_with_price_v3.csv")
        self.super_dataset.columns = [c.strip().replace(" ", "_") for c in self.super_dataset.columns]

        # ---------- Safe Demand Model Loader ----------
        self.demand_model = None
        self.encoder = None
        try:
            sys.modules['XGBClassifier'] = xgboost.XGBClassifier  # alias fix

            with open("demand_trend_classifier.pkl", "rb") as f:
                obj = pickle.load(f)

            if isinstance(obj, dict):
                self.demand_model = obj.get("model", None)
                self.encoder = obj.get("encoder", None)
            else:
                self.demand_model = obj

        except Exception as e1:
            try:
                obj = joblib.load("demand_trend_classifier.pkl")
                if isinstance(obj, dict):
                    self.demand_model = obj.get("model", None)
                    self.encoder = obj.get("encoder", None)
                else:
                    self.demand_model = obj
            except Exception as e2:
                print("⚠️ Could not load demand model:", e1, e2)
                self.demand_model = None

        # ---------- Load Price Optimization Model (.joblib) ----------
        self.price_model = None
        try:
            self.price_model = joblib.load("price_optimization.joblib")
        except Exception as e:
            print("⚠️ Could not load price optimization model:", e)
            self.price_model = None

        # ---------- LangGraph Setup ----------
        self._setup_graph()

    def _setup_graph(self):
        graph = StateGraph(dict)

        graph.add_node("agent1_fetcher", self.fetch_product_features)
        graph.add_node("agent2_demand", self.demand_forecasting_agent)
        graph.add_node("agent3_price", self.price_optimization_agent)
        graph.add_node("agent4_inventory", self.inventory_management_agent)
        graph.add_node("agent5_summary", self.final_summary_agent)

        graph.set_entry_point("agent1_fetcher")
        graph.add_edge("agent1_fetcher", "agent2_demand")
        graph.add_edge("agent2_demand", "agent3_price")
        graph.add_edge("agent3_price", "agent4_inventory")
        graph.add_edge("agent4_inventory", "agent5_summary")
        graph.add_edge("agent5_summary", END)

        self.app = graph.compile()

    # ---------- Agent 1: Data Fetcher ----------
    def fetch_product_features(self, state: dict) -> dict:
        try:
            product_id = int(state.get("product_id"))
        except:
            return {"error": f"Invalid product_id: {state.get('product_id')}"}
        
        product_data = self.super_dataset[self.super_dataset["Product_ID"] == product_id]
        if product_data.empty:
            return {"error": f"Product ID {product_id} not found. Available IDs: {self.super_dataset['Product_ID'].unique()[:10]}"}
        
        features = product_data.iloc[-1].to_dict()
        return {"features": features, "product_id": product_id}

    # ---------- Agent 2: Demand Forecasting ----------
    def demand_forecasting_agent(self, state: dict) -> dict:
        if "features" not in state:
            return {"error": "No features found from Agent 1"}
        
        if self.demand_model is None:
            return {"error": "Demand model not loaded. Please check model file."}
        
        features = state["features"]

        input_features = [
            features.get("Price"),
            features.get("Promotions"),
            features.get("Seasonality_Factors") or features.get("Seasonality Factors"),
            features.get("External_Factors") or features.get("External Factors"),
            features.get("Customer_Segments") or features.get("Customer Segments"),
        ]
        
        df = pd.DataFrame([input_features], columns=[
            "Price", "Promotions", "Seasonality Factors", "External Factors", "Customer Segments"
        ])
        
        for col in df.columns:
            if df[col].dtype == object:
                df[col] = df[col].astype("category").cat.codes
        
        df = df.astype(float)
        
        try:
            pred = self.demand_model.predict(df)[0]
            demand_status = "increasing" if pred == 1 else "decreasing"
        except Exception as e:
            return {"error": f"Prediction failed: {e}"}
        
        return {"features": features, "product_id": state.get("product_id"), "demand_forecast": demand_status}

    # ---------- Agent 3: Price Optimization ----------
    def price_optimization_agent(self, state: dict) -> dict:
        if "features" not in state or "demand_forecast" not in state:
            return {"error": "Missing features or demand forecast from previous agents"}
        
        if self.price_model is None:
            return {"error": "Price optimization model not loaded"}
        
        features = state["features"]
        demand_status = state["demand_forecast"]

        input_features = [
            features.get("Price"),
            features.get("Competitor_Prices") or features.get("Competitor Prices"),
            features.get("Sales_Volume") or features.get("Sales Volume"),
            features.get("Reviews"),
            features.get("Storage_Cost") or features.get("Storage Cost"),
        ]
        
        df = pd.DataFrame([input_features], columns=[
            "Price", "Competitor Prices", "Sales Volume", "Reviews", "Storage Cost"
        ])
        
        for col in df.columns:
            if df[col].dtype == object:
                df[col] = df[col].astype("category").cat.codes
        
        df = df.astype(float)

        try:
            base_price = float(self.price_model.predict(df)[0])
        except Exception as e:
            return {"error": f"Price prediction failed: {e}"}
        
        final_price = base_price * (1.10 if demand_status == "increasing" else 0.90)

        return {
            "features": features,
            "product_id": state.get("product_id"),
            "demand_forecast": demand_status,
            "optimized_price": round(final_price, 2)
        }

    # ---------- Agent 4: Inventory Management ----------
    def inventory_management_agent(self, state: dict) -> dict:
        if "features" not in state or "demand_forecast" not in state or "optimized_price" not in state:
            return {"error": "Missing inputs for inventory agent (features / demand_forecast / optimized_price)"}

        f = state["features"]
        demand_forecast = state["demand_forecast"]
        optimized_price = float(state["optimized_price"])

        stock_levels = pd.to_numeric(
            f.get("Stock_Levels") or f.get("Stock Levels") or 0, errors="coerce"
        )
        lead_time_days = pd.to_numeric(
            f.get("Supplier_Lead_Time_(days)") or f.get("Supplier Lead Time (days)") or 0, errors="coerce"
        )
        stockout_freq = pd.to_numeric(
            f.get("Stockout_Frequency") or f.get("Stockout Frequency") or 0, errors="coerce"
        )
        warehouse_capacity = pd.to_numeric(
            f.get("Warehouse_Capacity") or f.get("Warehouse Capacity") or np.inf, errors="coerce"
        )
        fulfillment_time_days = pd.to_numeric(
            f.get("Order_Fulfillment_Time_(days)") or f.get("Order Fulfillment Time (days)") or 0, errors="coerce"
        )
        sales_volume = pd.to_numeric(
            f.get("Sales_Volume") or f.get("Sales Volume") or 0, errors="coerce"
        )

        stock_levels = 0 if pd.isna(stock_levels) else stock_levels
        lead_time_days = 0 if pd.isna(lead_time_days) else lead_time_days
        stockout_freq = 0 if pd.isna(stockout_freq) else stockout_freq
        warehouse_capacity = np.inf if pd.isna(warehouse_capacity) else warehouse_capacity
        fulfillment_time_days = 0 if pd.isna(fulfillment_time_days) else fulfillment_time_days
        sales_volume = 0 if pd.isna(sales_volume) else sales_volume

        avg_daily_demand = sales_volume / 30.0

        sf = float(np.clip(stockout_freq, 0, 30))
        base_multiplier = 0.20 + 0.02 * sf
        trend_bump = 0.20 if demand_forecast == "increasing" else 0.0
        ss_multiplier = base_multiplier + trend_bump
        risk_window = max(0.0, float(lead_time_days) + float(fulfillment_time_days))

        safety_stock = avg_daily_demand * ss_multiplier * max(1.0, risk_window)
        reorder_point = (avg_daily_demand * max(1.0, lead_time_days)) + safety_stock

        if stock_levels < reorder_point:
            action = "Reorder"
            reorder_qty = reorder_point - stock_levels
        elif stock_levels < reorder_point * 1.1:
            action = "Monitor Closely"
            reorder_qty = max(0.0, reorder_point - stock_levels)
        else:
            action = "Hold"
            reorder_qty = 0.0

        max_additional_capacity = max(0.0, warehouse_capacity - stock_levels) if np.isfinite(warehouse_capacity) else np.inf
        reorder_qty = float(np.clip(reorder_qty, 0.0, max_additional_capacity))

        result = {
            "product_id": state.get("product_id"),
            "demand_forecast": demand_forecast,
            "optimized_price": round(optimized_price, 2),
            "avg_daily_demand": round(float(avg_daily_demand), 2),
            "safety_stock": round(float(safety_stock), 2),
            "reorder_point": round(float(reorder_point), 2),
            "current_stock": float(stock_levels),
            "inventory_action": action,
            "suggested_reorder_qty": round(float(reorder_qty), 0)
        }
        return result

    # ---------- Agent 5: Final Summary ----------
    def final_summary_agent(self, state: dict) -> dict:
        if not all(k in state for k in ["product_id", "demand_forecast", "optimized_price", "avg_daily_demand", "reorder_point"]):
            return {"error": "Missing inputs for final summary agent"}

        product_id = state["product_id"]
        demand_forecast = state["demand_forecast"]
        optimized_price = state["optimized_price"]

        inventory_info = {
            "avg_daily_demand": state.get("avg_daily_demand"),
            "safety_stock": state.get("safety_stock"),
            "reorder_point": state.get("reorder_point"),
            "current_stock": state.get("current_stock"),
            "action": state.get("inventory_action"),
            "suggested_reorder_qty": state.get("suggested_reorder_qty"),
        }

        summary = {
            "final_summary": {
                "product_id": product_id,
                "demand_forecast": demand_forecast,
                "optimized_price": optimized_price,
                "inventory": inventory_info
            },
            "message": (
                f"Product {product_id} → Demand is {demand_forecast}. "
                f"Recommended price: {optimized_price}. "
                f"Inventory action: {inventory_info['action']} "
                f"({'Reorder ' + str(inventory_info['suggested_reorder_qty']) + ' units' if inventory_info['action']=='Reorder' else 'Monitor stock'})"
            )
        }

        return summary

    # ---------- Run Method ----------
    def run(self, product_id=1985):
        result = self.app.invoke({"product_id": product_id})
        return result


# ---------- Run Example ----------
if __name__ == "__main__":
    optimizer = ProductOptimizer()
    result = optimizer.run(1985)
    print(result)
