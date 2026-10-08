# Predictive Maintenance — Turbofan Engine RUL Prediction

> Predict how many cycles remain before an engine fails — before it actually does.

---

## Problem

Unplanned machine failures cost industries billions every year. This project builds an ML pipeline that predicts the **Remaining Useful Life (RUL)** of turbofan engines from sensor readings, enabling maintenance to be scheduled before a breakdown occurs.

---

## Dataset

**NASA C-MAPSS Turbofan Engine Degradation Dataset — FD001 subset**
- 100 simulated engines, each running until failure
- 26 columns: engine ID, cycle, 3 operational settings, 21 sensor readings
- 20,000+ rows of time-series sensor data
- Download: [NASA Prognostics Data Repository](https://www.nasa.gov/intelligent-systems-division/discovery-and-systems-health/pcoe/pcoe-data-set-repository/)

---

## Approach

### 1. Data Understanding & Cleaning
- Loaded raw whitespace-separated `.txt` file and assigned column names manually
- Dropped constant sensors (`op3, s18, s19`) using standard deviation check (`std == 0`)
- Sorted data by `engine_id` and `cycle` to preserve time-series order

### 2. Target Variable — RUL
Self-engineered the RUL target variable from raw data:
```
RUL = max_cycle(engine) - current_cycle
```
No pre-labeled failure column was provided — this was derived entirely from the dataset structure.

### 3. Feature Engineering
Created **60+ features** from 14 useful sensors:

| Feature | What It Captures |
|---|---|
| Rolling Mean (window=5) | Smoothed trend — filters out noise |
| Rolling Std (window=5) | Instability — sensor becoming erratic |
| Diff (rate of change) | Acceleration of degradation |

All rolling features computed **per engine** using `groupby('engine_id')` to avoid mixing engine sequences.

### 4. Modeling Pipeline

| Model | RMSE | MAE |
|---|---|---|
| Linear Regression (Baseline) | 43.87 | 33.60 |
| Random Forest (22 raw features) | 40.76 | 28.99 |
| Random Forest (60+ engineered features) | **35.32** | **24.68** |

Feature engineering alone reduced RMSE by **~13%** without changing the model.

---

## Results

- Best model: **Random Forest with engineered features**
- RMSE: **35.32 cycles** — meaning on average predictions are off by ~35 cycles
- Feature engineering improved RMSE from 40.76 → 35.32 (~13% gain)
- Top predictive features: `s12`, `s7`, `s11`, `s4` rolling statistics

---

## Tech Stack

| Category | Tools |
|---|---|
| Language | Python 3 |
| Data | Pandas, NumPy |
| ML | Scikit-learn (LinearRegression, RandomForestRegressor) |
| Preprocessing | StandardScaler, train_test_split |
| Visualization | Matplotlib, Seaborn |
| Environment | Google Colab |

---

## Project Structure

```
ML-Project/
├── mlproject.ipynb       # Complete project notebook
├── train_FD001.txt       # Dataset (download separately from NASA)
└── README.md
```

---

## How to Run

```bash
# 1. Clone the repo
git clone https://github.com/Arisha2902/Predictive-Maintenance--RUL-Prediction

# 2. Download the dataset
# Place train_FD001.txt in the root folder
# Dataset: https://www.nasa.gov/pcoe-data-set-repository

# 3. Open the notebook
jupyter notebook mlproject.ipynb

# 4. Run all cells top to bottom
```

---

## What I Would Improve Next

- Split by engine ID instead of random train/test split (time-series aware)
- Add XGBoost and LightGBM for comparison
- Hyperparameter tuning with GridSearchCV
- Add Isolation Forest for unsupervised anomaly detection
- Deploy as a REST API with FastAPI

---

## Author

**Arisha Firoz** — [LinkedIn](https://www.linkedin.com/in/arisha-firoz-668638331/) | [GitHub](https://github.com/arisha2902)
