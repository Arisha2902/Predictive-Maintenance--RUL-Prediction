from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import json
import numpy as np

# Load model and scaler
model        = joblib.load('model.pkl')
scaler       = joblib.load('scaler.pkl')
feature_names = json.load(open('feature_names.json'))

app = FastAPI()

# Allow React to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

class SensorInput(BaseModel):
    sensor_values: dict

@app.get("/")
def root():
    return {"message": "Predictive Maintenance API Running"}

@app.get("/features")
def get_features():
    return {"features": feature_names}

@app.post("/predict")
def predict(data: SensorInput):
    try:
        # Build feature vector in correct order
        values = [data.sensor_values.get(f, 0) 
                  for f in feature_names]
        X = np.array(values).reshape(1, -1)
        
        # Scale and predict
        X_scaled = scaler.transform(X)
        rul_pred  = float(model.predict(X_scaled)[0])
        rul_pred  = max(0, round(rul_pred, 2))
        
        # Alert status
        if rul_pred < 10:
            status = "CRITICAL"
            color  = "red"
            recommendation = "Immediate maintenance required"
        elif rul_pred < 30:
            status = "WARNING"
            color  = "orange"
            recommendation = "Schedule maintenance soon"
        else:
            status = "SAFE"
            color  = "green"
            recommendation = "Engine operating normally"
        
        # Cost calculation
        BREAKDOWN_COST   = 2000000
        MAINTENANCE_COST =   80000
        
        if status == "CRITICAL":
            cost_saving = BREAKDOWN_COST - MAINTENANCE_COST
        else:
            cost_saving = 0

        return {
            "rul"           : rul_pred,
            "status"        : status,
            "color"         : color,
            "recommendation": recommendation,
            "cost_saving"   : cost_saving
        }

    except Exception as e:
        return {"error": str(e)}