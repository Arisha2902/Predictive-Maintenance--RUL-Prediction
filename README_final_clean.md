# Predictive Maintenance --- Turbofan Engine RUL Prediction

> A full-stack machine learning application that predicts the
> **Remaining Useful Life (RUL)** of turbofan engines from sensor data
> using a trained Random Forest regression model.

[![Frontend](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Backend](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![ML](https://img.shields.io/badge/ML-Scikit--learn-F7931E?logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)
[![Deployment](https://img.shields.io/badge/Deployed-Vercel%20%2B%20Render-black)](https://vercel.com/)

## 🔗 Live Project

**Frontend:**\
https://predictive-maintenance-rul-predicti.vercel.app/

**Backend API:**\
https://predictive-maintenance-rul-prediction.onrender.com/

------------------------------------------------------------------------

## 📌 Overview

Predictive maintenance aims to identify equipment degradation before
unexpected failure occurs.

This project predicts the **Remaining Useful Life (RUL)** of a turbofan
engine --- the number of operating cycles remaining before failure.

The project started as an ML pipeline using the **NASA C-MAPSS dataset**
and was extended into a full-stack application:

``` text
React Frontend
      ↓
FastAPI REST API
      ↓
ML Prediction Pipeline
      ↓
Random Forest Model
      ↓
Predicted RUL
```

The ML pipeline uses sensor time-series information and engineered
features such as rolling statistics and rate of change to improve
prediction performance.

------------------------------------------------------------------------

## ✨ Key Features

-   🔮 Predict turbofan engine Remaining Useful Life
-   📊 Sensor-based ML prediction
-   ⚙️ Rolling mean, rolling standard deviation and rate-of-change
    feature engineering
-   🌳 Random Forest regression
-   🔌 FastAPI backend for model inference
-   ⚛️ React frontend for user interaction
-   🚀 Deployed frontend and backend
-   📈 Model performance comparison
-   🔬 Research-oriented analysis across C-MAPSS subsets
-   💰 Cost-aware maintenance threshold analysis

------------------------------------------------------------------------

## 🏗️ Architecture

``` text
┌─────────────────────┐
│      React UI       │
│                     │
│  User enters data   │
└──────────┬──────────┘
           │
           │ HTTP / JSON
           ▼
┌─────────────────────┐
│    FastAPI Backend  │
│                     │
│  Input validation   │
│  Feature processing │
│  Model inference    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   ML Prediction     │
│                     │
│ Random Forest       │
│ + Engineered        │
│   sensor features  │
└──────────┬──────────┘
           │
           ▼
      Predicted RUL
```

### Deployment

``` text
React Frontend ──→ Vercel
       │
       │ API Request
       ▼
FastAPI Backend ──→ Render
       │
       ▼
ML Model
```

------------------------------------------------------------------------

## 🧠 Machine Learning

### Dataset

The project uses the **NASA C-MAPSS Turbofan Engine Degradation
Dataset**, primarily using the **FD001 subset**.

FD001 contains:

-   100 simulated engines
-   20,000+ time-series readings
-   3 operational settings
-   21 sensor measurements
-   Engine and cycle information

Dataset source:

https://www.nasa.gov/intelligent-systems-division/discovery-and-systems-health/pcoe/pcoe-data-set-repository/

------------------------------------------------------------------------

### RUL Calculation

RUL is derived from the engine's failure cycle:

``` python
RUL = max_cycle(engine) - current_cycle
```

For example:

``` text
Engine failure cycle = 192
Current cycle        = 100

RUL = 192 - 100
    = 92 cycles
```

------------------------------------------------------------------------

### Feature Engineering

Raw sensor values do not directly capture all degradation patterns.

The project creates temporal features from useful sensors:

  Feature                      Purpose
  ---------------------------- ---------------------------------
  Rolling Mean                 Captures smoothed sensor trends
  Rolling Standard Deviation   Captures sensor instability
  Difference                   Captures rate of change

A rolling window of **5 cycles** was used in the documented experiment.

Features are calculated separately for each engine:

``` python
groupby("engine_id")
```

This prevents sensor history from one engine being mixed with another.

The final documented pipeline creates **60+ engineered features from 14
useful sensors**.

------------------------------------------------------------------------

## 🤖 Model Performance

The documented FD001 experiment produced:

  Model                                              RMSE         MAE
  ------------------------------------------- ----------- -----------
  Linear Regression                                 43.87       33.60
  Random Forest --- Raw Features                    40.76       28.99
  **Random Forest --- Engineered Features**     **35.32**   **24.68**

### Result

Feature engineering improved Random Forest RMSE:

``` text
40.76 → 35.32
```

**\~13% improvement**

The best documented model is:

> **Random Forest Regressor + engineered sensor features**

------------------------------------------------------------------------

## 🔬 Research Extension

Beyond the main FD001 experiment, the project includes research-oriented
analysis comparing the approach across the four C-MAPSS subsets.

  Model                     FD001       FD002       FD003       FD004
  ------------------- ----------- ----------- ----------- -----------
  LSTM                      16.14       24.49       16.18       28.17
  CNN                       18.45       30.29       19.82       29.16
  **Random Forest**     **16.01**   **20.04**   **12.90**   **17.62**
  XGBoost                   16.48       19.75       13.51       17.60

The analysis explores whether strong feature engineering with classical
ML can remain competitive with more complex models.

### Cost-Aware Maintenance Analysis

The research extension also evaluates different RUL alert thresholds by
comparing maintenance cost against breakdown cost.

The documented cost model found an optimal threshold of **2 cycles**
under its chosen assumptions, with an **83% reduction in calculated
maintenance cost** compared with the 30-cycle reference threshold.

> This threshold is specific to the assumptions used in the analysis and
> should not be treated as a universal industrial maintenance rule.

------------------------------------------------------------------------

## 🛠️ Tech Stack

### Frontend

-   React
-   JavaScript
-   HTML
-   CSS
-   Vercel

### Backend

-   Python
-   FastAPI
-   REST API
-   Render

### Machine Learning

-   Python
-   Pandas
-   NumPy
-   Scikit-learn
-   Linear Regression
-   Random Forest Regressor
-   StandardScaler
-   Matplotlib
-   Seaborn

### Dataset

-   NASA C-MAPSS
-   FD001

------------------------------------------------------------------------

## 📁 Project Structure

``` text
Predictive-Maintenance--RUL-Prediction/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── API files
│   ├── model files
│   ├── preprocessing files
│   ├── requirements.txt
│   └── ...
│
├── mlproject.ipynb
├── README.md
└── ...
```

> The original ML implementation was notebook-based. The current version
> extends the ML work into a React + FastAPI full-stack application.

------------------------------------------------------------------------

## ⚙️ Run Locally

### 1. Clone

``` bash
git clone https://github.com/Arisha2902/Predictive-Maintenance--RUL-Prediction.git
cd Predictive-Maintenance--RUL-Prediction
```

### 2. Backend

``` bash
cd backend

python -m venv venv
```

Windows:

``` bash
venv\Scripts\activate
```

Install dependencies:

``` bash
pip install -r requirements.txt
```

Start the FastAPI application using the backend entry point configured
in the repository.

### 3. Frontend

Open another terminal:

``` bash
cd frontend
npm install
npm run dev
```

The React application communicates with the FastAPI backend through HTTP
requests.

------------------------------------------------------------------------

## 🔌 Backend

The backend acts as the bridge between the React interface and the ML
model.

``` text
Frontend Request
      ↓
FastAPI
      ↓
Validate Input
      ↓
Prepare Features
      ↓
Run Model
      ↓
Return Prediction
```

The exact request and response schema should be taken from the current
backend implementation.

------------------------------------------------------------------------

## 📈 Why Random Forest?

Random Forest was selected because it works well with tabular data and
can capture non-linear relationships and interactions between sensor
features.

It also provides feature importance, making it useful for understanding
which engineered sensor features contribute most to predictions.

Linear Regression was used as a baseline for comparison.

------------------------------------------------------------------------

## ⚠️ Limitations

The current ML experiment has several limitations:

-   The documented experiment uses a random train/test split rather than
    a fully time-aware evaluation.
-   Extensive hyperparameter tuning was not performed.
-   The main experiment compares Linear Regression and Random Forest.
-   The feature window of 5 was used as a starting heuristic.
-   The original ML notebook did not include complete model versioning
    or production monitoring.

For a production-quality ML system, engine-based splitting or
walk-forward validation would be preferable.

------------------------------------------------------------------------

## 🚀 Future Improvements

-   [ ] Time-series-aware validation
-   [ ] Engine-based train/test split
-   [ ] Hyperparameter tuning
-   [ ] XGBoost / LightGBM comparison
-   [ ] LSTM / GRU models
-   [ ] Automated feature-window selection
-   [ ] Model versioning
-   [ ] Prediction history
-   [ ] Database integration
-   [ ] Authentication and API rate limiting
-   [ ] Model monitoring and drift detection
-   [ ] Automated model retraining

------------------------------------------------------------------------

## 💡 What Makes This Project Interesting?

The project combines **machine learning + backend engineering + frontend
development + deployment**.

Instead of keeping the model inside a notebook, the ML workflow is
exposed through an API and consumed by a web application.

The research extension also moves beyond simply asking:

> **"How accurate is the model?"**

and explores:

> **"How can an RUL prediction be converted into a practical maintenance
> decision?"**

------------------------------------------------------------------------

## 👩‍💻 Author

### Arisha Firoz

B.Tech Computer Science Engineering

[GitHub](https://github.com/Arisha2902) •
[LinkedIn](https://www.linkedin.com/in/arisha-firoz-668638331/)

------------------------------------------------------------------------

⭐ **If you find this project useful, consider starring the
repository.**
