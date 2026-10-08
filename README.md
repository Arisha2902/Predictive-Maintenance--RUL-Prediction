Predictive Maintenance --- Full-Stack RUL Prediction
Predict how many operating cycles remain before a turbofan engine
fails --- and turn that prediction into an actionable maintenance
decision.

A full-stack predictive-maintenance application that combines a
machine-learning pipeline with a web interface and REST API. The project
uses NASA's C-MAPSS turbofan engine degradation dataset to predict
Remaining Useful Life (RUL) from sensor readings.
The original ML work was developed as a notebook-based regression
project and was later extended into a full-stack application with a
React frontend and FastAPI backend.
🚀 Live Application
Frontend
https://predictive-maintenance-rul-predicti.vercel.app/
Backend API
https://predictive-maintenance-rul-prediction.onrender.com/
🎯 Problem Statement
Unexpected equipment failures can lead to expensive downtime and
emergency maintenance.
This project addresses predictive maintenance by estimating the
Remaining Useful Life (RUL) of a turbofan engine from its sensor
history.
Instead of asking only:
"Will the engine fail?"

the system answers:
"Approximately how many operating cycles remain before failure?"

RUL is treated as a continuous regression target, rather than a
classification label.
🧠 What Is RUL?
For each engine:
RUL = Maximum cycle of the engine − Current cycle
For example, if an engine's final recorded cycle is 192:
Current cycle = 100
RUL = 192 − 100 = 92 cycles
The last recorded cycle is treated as the failure point because the
C-MAPSS training data records each engine until failure.
📊 Dataset
The project uses the NASA C-MAPSS Turbofan Engine Degradation
Dataset, with the primary ML pipeline developed on the FD001
subset.
FD001
- 100 simulated turbofan engines
- 20,000+ sensor readings
- 26 columns:
  - Engine ID
  - Cycle
  - 3 operational settings
  - 21 sensor readings
- One operating condition
- One fault mode
Dataset source:
NASA Prognostics Data Repository
https://www.nasa.gov/intelligent-systems-division/discovery-and-systems-health/pcoe/pcoe-data-set-repository/
The dataset is not committed to the repository and must be obtained
separately.

🏗️ Full-Stack Architecture
                    ┌──────────────────────────┐
                    │        User / Browser     │
                    └────────────┬─────────────┘
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │     React Frontend        │
                    │      Vercel Hosting       │
                    │                          │
                    │  • User input             │
                    │  • Prediction UI          │
                    │  • RUL result             │
                    │  • Health interpretation  │
                    └────────────┬─────────────┘
                                 │
                              HTTP/JSON
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │      FastAPI Backend      │
                    │       Render Hosting      │
                    │                          │
                    │  • Request validation     │
                    │  • Feature preparation    │
                    │  • Model inference        │
                    │  • Prediction response    │
                    └────────────┬─────────────┘
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │      ML Prediction        │
                    │                          │
                    │  Random Forest Regressor  │
                    │  + engineered features   │
                    └──────────────────────────┘
Application flow
User enters sensor data
        ↓
React frontend
        ↓
HTTP request to FastAPI
        ↓
Input validation
        ↓
Feature preparation
        ↓
Trained ML model
        ↓
Predicted RUL
        ↓
Backend JSON response
        ↓
React displays result
🧩 Project Components
1. Frontend
The frontend provides the user-facing interface for interacting with the
prediction system.
Technology:
- React
- JavaScript
- HTML/CSS
- Vercel deployment
Responsibilities:
- Collect prediction inputs
- Send requests to the backend API
- Receive prediction results
- Present the predicted RUL in a user-friendly interface
- Provide the application layer between the user and ML backend
2. Backend
The backend exposes the ML functionality through a REST API.
Technology:
- Python
- FastAPI
- REST API
- Render deployment
Responsibilities:
- Receive frontend requests
- Validate input data
- Prepare the model input
- Run ML inference
- Return prediction results as JSON
The backend separates the ML logic from the frontend, making the model
usable independently of the React interface.
3. Machine Learning Pipeline
The ML pipeline was developed using the NASA C-MAPSS dataset.
Step 1 --- Data Loading
The original notebook loads the whitespace-separated dataset and assigns
meaningful column names.
The dataset contains:
engine_id
cycle
op1 op2 op3
s1 ... s21
Step 2 --- Data Cleaning
Constant features are removed because they contain no useful variation.
The original pipeline removes:
op3
s18
s19
using a zero-standard-deviation check.
The data is then sorted by:
engine_id + cycle
to preserve engine sequence.
Step 3 --- RUL Target Creation
The RUL target is created from the failure cycle:
RUL = max_cycle - current_cycle
This target is calculated independently for each engine.
🔧 Feature Engineering
Feature engineering is the core part of the ML work.
Instead of relying only on raw sensor readings, the project creates
temporal features from useful sensors.
For each engine, the pipeline creates:
  Feature                      Purpose
  Rolling Mean                 Smooths sensor noise and captures trend
  Rolling Standard Deviation   Captures instability/variation
  Difference                   Captures rate of change
The main rolling-window experiment used:
window = 5
Features are calculated separately for each engine using:
groupby('engine_id')
This prevents the rolling window from mixing the end of one engine with
the beginning of another.
The engineered pipeline produces 60+ features from 14 useful
sensors.
🤖 Machine Learning Models
The project uses a simple baseline and an ensemble model.
  Model                                              RMSE         MAE
  Linear Regression                                 43.87       33.60
  Random Forest --- raw features                    40.76       28.99
  Random Forest --- engineered features     35.32   24.68
Best model
Random Forest Regressor with engineered features
The feature-engineering stage reduced Random Forest RMSE:
40.76 → 35.32
which is approximately a 13% improvement without changing the
underlying model family.
The strongest predictive features in the documented experiment include
rolling statistics associated with sensors such as:
s12
s7
s11
s4
📈 Research Extension
The project also explores a broader research question:
How does feature engineering compare with more complex deep-learning
approaches, and what RUL threshold should actually trigger a
maintenance decision?

The research analysis compares results across the four C-MAPSS subsets
and reports:
  Model                     FD001       FD002       FD003       FD004
  LSTM 2016                 16.14       24.49       16.18       28.17
  CNN 2018                  18.45       30.29       19.82       29.16
  Random Forest     16.01   20.04   12.90   17.62
  XGBoost                   16.48       19.75       13.51       17.60
The research notes that the Random Forest results are competitive with
the cited literature on several subsets.
Cost-aware maintenance analysis
A separate research analysis evaluates RUL alert thresholds from 1 to
125 cycles using maintenance cost versus breakdown cost.
The documented analysis reports an optimal threshold of 2 cycles
under its chosen cost assumptions, reducing the calculated maintenance
cost by 83% compared with the 30-cycle reference threshold.
Important: The cost result is dependent on the assumptions and
cost model used in the research analysis. It should not be interpreted
as a universal industrial maintenance threshold.

🛠️ Tech Stack
Frontend
- React
- JavaScript
- HTML
- CSS
- Vercel
Backend
- Python
- FastAPI
- REST API
- Render
Machine Learning
- Python 3
- Pandas
- NumPy
- Scikit-learn
- Linear Regression
- Random Forest Regressor
- StandardScaler
- Matplotlib
- Seaborn
Dataset
- NASA C-MAPSS
- FD001
📁 Project Structure
The exact structure may vary slightly depending on the current
repository, but the full-stack organization is conceptually:
Predictive-Maintenance--RUL-Prediction/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── API / application files
│   ├── model / preprocessing files
│   ├── requirements.txt
│   └── ...
│
├── mlproject.ipynb
├── README.md
└── ...
The original ML implementation was contained in mlproject.ipynb; the
current project extends that work into separate frontend and backend
layers.
▶️ Run Locally
1. Clone the repository
git clone https://github.com/Arisha2902/Predictive-Maintenance--RUL-Prediction
cd Predictive-Maintenance--RUL-Prediction
2. Run the backend
Create and activate a virtual environment:
python -m venv venv
Windows
venv\Scripts\activate
Install dependencies:
pip install -r requirements.txt
Start the FastAPI server using the project's backend entry point.
The API can then be accessed locally through the FastAPI server.
3. Run the frontend
Install dependencies:
npm install
Start the React development server:
npm run dev
The frontend communicates with the FastAPI backend through HTTP
requests.
Keep the backend running while testing predictions from the frontend.

🔌 Backend API
The frontend and ML model are separated through a REST API.
Conceptually:
POST /prediction
Request:
{
  "sensor_data": "..."
}
Response:
{
  "rul": "predicted value"
}
The exact request/response schema should be kept synchronized with the
current FastAPI implementation.

🔬 Why Random Forest?
Random Forest was selected because it:
- Handles non-linear relationships
- Captures interactions between features
- Works well with tabular data
- Does not require feature scaling for tree splits
- Provides feature importance
- Is relatively interpretable compared with more complex deep-learning
  models
Linear Regression was retained as a baseline to establish a simpler
performance reference.
📐 Why Feature Engineering?
Raw sensor values do not fully describe how an engine is degrading over
time.
The engineered features add three important signals:
Rolling Mean
Shows the underlying sensor trend while reducing short-term noise.
Rolling Standard Deviation
Captures increasing instability in sensor readings.
Difference
Captures the rate at which a sensor is changing.
Together, these features allow a tabular model to capture useful
degradation patterns without directly using a recurrent neural network.
⚠️ Limitations
The project is a strong engineering and ML demonstration, but several
limitations should be acknowledged.
1. Time-series validation
The original experiment uses a random train/test split.
For a realistic deployment scenario, data should instead be split by
engine or evaluated with time-aware validation.
2. Hyperparameter tuning
The documented Random Forest experiment does not include extensive
hyperparameter optimization.
3. Model comparison
The primary implementation compares Linear Regression and Random Forest.
XGBoost, LightGBM and sequence models such as LSTM/GRU are natural next
steps.
4. Feature-window selection
Window size 5 was used as a starting heuristic. A stronger approach
would compare windows such as:
3, 5, 10, 15, 20
using validation data.
5. Production ML
A production system would require:
- Model versioning
- Monitoring
- Input validation
- Authentication
- HTTPS
- Rate limiting
- Model/data drift detection
- Scheduled or performance-triggered retraining
🚀 Future Improvements
- [ ] Time-series-aware train/test split
- [ ] Walk-forward validation
- [ ] Hyperparameter tuning
- [ ] XGBoost / LightGBM comparison
- [ ] LSTM / GRU sequence modeling
- [ ] Automated window-size selection
- [ ] Save and version the complete model pipeline
- [ ] Add stronger API validation
- [ ] Add authentication and rate limiting
- [ ] Add model monitoring
- [ ] Add prediction history
- [ ] Add database support for production sensor data
- [ ] Improve maintenance-alert logic
- [ ] Add automated model retraining
For a large-scale production version, sensor data could be stored in a
time-series database such as TimescaleDB or InfluxDB, while model
artifacts and application metadata could be stored separately.
🔐 Security Considerations
The full-stack architecture introduces additional security
considerations compared with the original notebook.
For production deployment:
- Validate every API request
- Restrict accepted input ranges
- Use HTTPS/TLS
- Add authentication where required
- Add request-size limits
- Apply rate limiting
- Do not expose secrets in frontend code
- Keep model artifacts trusted and protected
- Avoid unsafe deserialization of untrusted model files
📚 Project Interview Summary
One-line explanation
I built a full-stack predictive-maintenance application that uses a
Random Forest regression model with time-series feature engineering to
predict the Remaining Useful Life of turbofan engines, exposing the ML
model through a FastAPI backend and a React frontend.

If asked "What was your main contribution?"
My main contribution was feature engineering: I transformed raw
sensor readings into rolling mean, rolling standard deviation, and
rate-of-change features, which improved Random Forest RMSE from 40.76
to 35.32 on the documented FD001 experiment.

If asked "Why did you make it full-stack?"
The original work was a notebook-based ML experiment. I extended it
into a full-stack application so that the trained model could be
consumed through an API and used from a web interface rather than only
inside a notebook.

If asked "What is the biggest limitation?"
The original evaluation uses a random train/test split even though
the data is sequential. A production-quality version should use
engine-based or time-aware validation to avoid unrealistic
evaluation.

📊 Key Results
                    ML PERFORMANCE

Linear Regression
RMSE: 43.87
MAE : 33.60

Random Forest — Raw Features
RMSE: 40.76
MAE : 28.99

Random Forest — Engineered Features
RMSE: 35.32
MAE : 24.68
Improvement
RMSE: 40.76 → 35.32
Improvement: ~13%
🎓 Research Question
The project goes beyond simply minimizing prediction error.
Traditional question
How accurately can we predict RUL?

Project's broader question
Given an RUL prediction, how can feature engineering and cost-aware
alert thresholds help convert the prediction into an actionable
maintenance decision?

This connects machine-learning performance with practical maintenance
decision-making.
👩‍💻 Author
Arisha Firoz
- GitHub: https://github.com/Arisha2902
- LinkedIn: https://www.linkedin.com/in/arisha-firoz-668638331/
⭐ If you found this project useful
Consider giving the repository a star and exploring the live
application.
