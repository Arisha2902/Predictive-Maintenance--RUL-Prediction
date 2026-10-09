# ⚙️ Predictive Maintenance — Full Stack ML App

> Real-time turbofan engine health monitoring powered by Machine Learning.  
> Predicts Remaining Useful Life (RUL) from sensor readings and flags engines as SAFE, WARNING or CRITICAL.

![Python](https://img.shields.io/badge/Python-3.10+-sage?style=flat-square)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-sage?style=flat-square)
![React](https://img.shields.io/badge/React-18+-sage?style=flat-square)
![Scikit-learn](https://img.shields.io/badge/Scikit--learn-1.3+-sage?style=flat-square)
![Dataset](https://img.shields.io/badge/Dataset-NASA%20C--MAPSS-amber?style=flat-square)

---

## 🖥️ Live Demo

| Layer | URL |
|---|---|
| Frontend (React) | `http://localhost:3000` |
| Backend (FastAPI) | `http://localhost:8000` |
| API Docs | `http://localhost:8000/docs` |

---

## 📸 What It Does

- Enter engine sensor readings manually or load a **Healthy / Degraded** preset
- Click **Predict RUL** — the ML model returns:
  - 🟢 **SAFE** — RUL > 30 cycles
  - 🟡 **WARNING** — RUL between 10 and 30 cycles
  - 🔴 **CRITICAL** — RUL < 10 cycles — with cost saving estimate
- Every prediction is saved to **Prediction History** in the session
- Visual gauge shows RUL as a percentage of max engine life (125 cycles)

---

## 🧠 The ML Model

### Dataset
**NASA C-MAPSS Turbofan Engine Degradation Dataset**
- 4 subsets: FD001, FD002, FD003, FD004
- 100–260 engines per subset, 20K–61K sensor readings
- 21 sensors + 3 operational settings per cycle
- Download: [NASA Prognostics Data Repository](https://www.nasa.gov/intelligent-systems-division/discovery-and-systems-health/pcoe/pcoe-data-set-repository/)

### What We Built
| Step | What Was Done |
|---|---|
| EDA | Dropped constant sensors (std = 0): op3, s1, s5, s10, s16, s18, s19 |
| RUL | Self-engineered: `RUL = max_cycle - current_cycle` per engine |
| Capping | RUL capped at 125 cycles (standard in literature) |
| Features | 60+ features: rolling mean, rolling std, diff for 14 sensors |
| Models | Linear Regression → Random Forest → XGBoost → LSTM |
| Unique | Cost-aware threshold optimisation — finds alert threshold that minimises Rs. cost |

### Model Results Across All 4 Subsets
| Dataset | LR RMSE | RF RMSE | XGB RMSE | LSTM RMSE |
|---|---|---|---|---|
| FD001 | 43.41 | **16.01** | 16.48 | 19.10 |
| FD002 | 43.50 | 20.04 | **19.75** | 22.80 |
| FD003 | 60.94 | **12.90** | 13.51 | 16.70 |
| FD004 | 57.83 | 17.62 | **17.60** | 26.10 |

> Random Forest with engineered features matches 2016 LSTM paper (RMSE 16.14) on FD001.

### Key Finding — Cost Optimisation
| Threshold | Missed Failures | False Alarms | Total Cost |
|---|---|---|---|
| 2 cycles ✅ optimal | 14 | 16 | Rs. 29,28,000 |
| 10 cycles | 27 | 17 | Rs. 55,36,000 |
| 30 cycles (industry default) | 85 | 44 | Rs. 1,73,52,000 |

> **83% cost reduction** by using threshold = 2 cycles vs industry default of 30 cycles.

---

## 🗂️ Project Structure

```
predictive-maintenance-app/
│
├── backend/
│   ├── main.py              ← FastAPI app with /predict endpoint
│   ├── model.pkl            ← Trained Random Forest model
│   ├── scaler.pkl           ← Fitted StandardScaler
│   ├── feature_names.json   ← Feature column names in correct order
│   └── requirements.txt     ← Python dependencies
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js           ← Main React component
│   │   ├── App.css          ← Earthy sage/amber theme
│   │   └── index.css        ← Global styles
│   └── package.json
│
├── mlproject.ipynb          ← Full ML notebook (Colab)
├── AllDataset.ipynb         ← Extended notebook — all 4 subsets
└── README.md
```

---

## 🚀 How to Run Locally

### Prerequisites
Make sure you have these installed:
```
Python 3.10+
Node.js 18+
npm 9+
```

### Step 1 — Clone the Repository
```bash
git clone https://github.com/Arisha2902/Predictive-Maintenance--RUL-Prediction.git
cd Predictive-Maintenance--RUL-Prediction
```

### Step 2 — Set Up Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend will start at: `http://localhost:8000`  
Test it: open `http://localhost:8000` — you should see:
```json
{"message": "Predictive Maintenance API Running"}
```

### Step 3 — Set Up Frontend
Open a **new terminal** (keep backend running):
```bash
cd frontend
npm install
npm start
```

Frontend will open automatically at: `http://localhost:3000`

---

## 📡 API Reference

### `GET /`
Health check.
```json
{"message": "Predictive Maintenance API Running"}
```

### `GET /features`
Returns list of feature names the model expects.
```json
{"features": ["s2", "s3", "s4", ..., "s21_diff"]}
```

### `POST /predict`
Accepts sensor values, returns RUL prediction.

**Request:**
```json
{
  "sensor_values": {
    "engine_id": "ENG-001",
    "s2": 641.82,
    "s3": 1589.7,
    "s4": 1400.6,
    "s6": 21.61,
    "s7": 554.36,
    "s8": 2388.06,
    "s9": 9065.8,
    "s11": 47.47,
    "s12": 521.66,
    "s13": 2388.0,
    "s14": 8138.6,
    "s15": 8.4195,
    "s17": 392,
    "s20": 39.06,
    "s21": 23.419
  }
}
```

**Response:**
```json
{
  "rul": 99.55,
  "status": "SAFE",
  "recommendation": "Engine operating normally",
  "cost_saving": 0,
  "readings_used": 3
}
```

**Status values:**
| Status | RUL Range | Meaning |
|---|---|---|
| SAFE | > 30 cycles | Engine healthy |
| WARNING | 10–30 cycles | Schedule maintenance |
| CRITICAL | < 10 cycles | Immediate action required |

---

## 🧪 Test Cases

### Healthy Engine (expect SAFE)
```json
{"s2":641.82,"s3":1589.7,"s4":1400.6,"s6":21.61,
 "s7":554.36,"s8":2388.06,"s9":9065.8,"s11":47.47,
 "s12":521.66,"s13":2388.0,"s14":8138.6,"s15":8.4195,
 "s17":392,"s20":39.06,"s21":23.419}
```

### Degrading Engine (expect WARNING after 3+ calls)
```json
{"s2":644.12,"s3":1598.2,"s4":1418.5,"s6":21.61,
 "s7":550.33,"s8":2388.06,"s9":8920.6,"s11":46.01,
 "s12":498.34,"s13":2388.0,"s14":7910.4,"s15":8.1823,
 "s17":374,"s20":36.88,"s21":22.61}
```

### Failing Engine (expect CRITICAL after 5 calls)
```json
{"s2":645.16,"s3":1601.3,"s4":1422.8,"s6":21.61,
 "s7":549.14,"s8":2388.06,"s9":8855.4,"s11":45.61,
 "s12":490.72,"s13":2388.0,"s14":7839.2,"s15":8.0541,
 "s17":368,"s20":36.52,"s21":22.34}
```

> **Note:** Click Predict 4–5 times with the same Engine ID to build up rolling window history.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| ML Model | Scikit-learn Random Forest |
| Feature Engineering | Pandas rolling window functions |
| Backend API | Python FastAPI + Uvicorn |
| Frontend | React 18 |
| HTTP Client | Axios |
| Styling | Custom CSS — sage/amber earthy theme |
| Dataset | NASA C-MAPSS (FD001–FD004) |

---

## 📊 Charts Included in Notebook

| Chart | What It Shows |
|---|---|
| Sensor Analysis | Raw vs smoothed vs std vs diff for engine 1 |
| Actual vs Predicted RUL | Scatter plot — model accuracy across test set |
| Alert Distribution | Count of SAFE / WARNING / CRITICAL predictions |
| Cost vs Threshold | Total cost curve across thresholds 1–125 |
| Model Comparison | RF vs XGBoost vs LSTM bar chart across all subsets |

---

## ⚠️ Known Limitations

- Rolling features require multiple sequential readings per engine for full accuracy — single-row predictions default to using 0 for rolling stats
- Train/test split was random rather than engine-aware (future improvement)
- Model trained on FD001 only for the API (best performing subset)
- Cost values are assumed — adjust `BREAKDOWN_COST` and `MAINTENANCE_COST` in `main.py` for your industry

---

## 🔮 Future Improvements

- [ ] Split by engine ID for proper time-series evaluation
- [ ] Add MongoDB to persist prediction history across sessions
- [ ] Deploy backend on Render, frontend on Vercel
- [ ] Add XGBoost model toggle in the UI
- [ ] Extend cost framework to variable cost ratios

---

## 👩‍💻 Author

**Arisha Firoz**  
B.Tech Computer Science — United College of Engineering and Research, Prayagraj  

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-sage?style=flat-square)](https://www.linkedin.com/in/arisha-firoz-668638331/)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-sage?style=flat-square)](https://github.com/arisha2902)
[![LeetCode](https://img.shields.io/badge/LeetCode-235%2B%20Problems-amber?style=flat-square)](https://leetcode.com/u/arisha2902/)

---

## 📄 License

MIT License — free to use, modify and distribute with attribution.
