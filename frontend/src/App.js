import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const SENSORS = [
  's2','s3','s4','s6','s7','s8','s9',
  's11','s12','s13','s14','s15','s17',
  's20','s21'
];

const HEALTHY_ENGINE = {
  s2:641.82, s3:1589.7, s4:1400.6, s6:21.61,
  s7:554.36, s8:2388.06, s9:9065.8, s11:47.47,
  s12:521.66, s13:2388.0, s14:8138.6, s15:8.4195,
  s17:392, s20:39.06, s21:23.419
};

// const DEGRADED_ENGINE = {
//   s2:642.50, s3:1591.8, s4:1408.2, s6:21.61,
//   s7:553.21, s8:2388.06, s9:9045.2, s11:47.20,
//   s12:516.72, s13:2388.0, s14:8048.1, s15:8.3201,
//   s17:388, s20:38.41, s21:23.010
// };

const DEGRADED_ENGINE = {
  s2:643.50,  s3:1596.0,  s4:1418.0,  s6:21.61,
  s7:551.80,  s8:2388.06, s9:8990.0,  s11:46.20,
  s12:500.00, s13:2388.0, s14:7900.0, s15:8.18,
  s17:375,    s20:37.20,  s21:22.80
};

// function RULGauge({ rul }) {
//   const max    = 125;
//   const pct    = Math.min(rul / max, 1);
//   const angle  = pct * 180;
//   const color  = rul < 10 ? '#dc2626' 
//                : rul < 30 ? '#f59e0b' 
//                : '#16a34a';

//   const r  = 80;
//   const cx = 100;
//   const cy = 100;

//   const toRad = (deg) => (deg - 180) * Math.PI / 180;
//   const x = cx + r * Math.cos(toRad(angle));
//   const y = cy + r * Math.sin(toRad(angle));

//   return (
//     <svg viewBox="0 0 200 120" className="gauge">
//       {/* Background arc */}
//       <path
//         d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
//         fill="none" stroke="#1e293b" strokeWidth="16"
//       />
//       {/* Colored arc */}
//       <path
//         d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${x} ${y}`}
//         fill="none" stroke={color} strokeWidth="16"
//         strokeLinecap="round"
//       />
//       {/* RUL text */}
//       <text x={cx} y={cy - 10}
//         textAnchor="middle" fill={color}
//         fontSize="28" fontWeight="bold">
//         {rul}
//       </text>
//       <text x={cx} y={cy + 12}
//         textAnchor="middle" fill="#94a3b8"
//         fontSize="10">
//         cycles remaining
//       </text>
//     </svg>
//   );
// }

function RULGauge({ rul }) {
  const max   = 125;
  const pct   = Math.min(Math.max(rul / max, 0), 1);
  const color = rul < 10 ? '#CC5500'
              : rul < 30 ? '#d4a843'
              : '#9CAF88';

  // Arc from 180deg to 0deg (left to right)
  const startAngle = Math.PI;
  const endAngle   = startAngle - pct * Math.PI;

  const cx = 110, cy = 100, r = 80;

  const x1 = cx + r * Math.cos(startAngle);
  const y1 = cy + r * Math.sin(startAngle);
  const x2 = cx + r * Math.cos(endAngle);
  const y2 = cy + r * Math.sin(endAngle);

  const largeArc = pct > 0.5 ? 1 : 0;

  const trackX2 = cx + r * Math.cos(0);
  const trackY2 = cy + r * Math.sin(0);

  return (
    <svg viewBox="0 0 220 120" className="gauge">
      {/* Track */}
      <path
        d={`M ${x1} ${y1} A ${r} ${r} 0 0 1 ${trackX2} ${trackY2}`}
        fill="none" stroke={color} strokeWidth="14"
        strokeLinecap="round"
      />
      {/* Filled arc */}
      {pct > 0 && (
        <path
          d={`M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`}
          fill="none" stroke="#CC5500" strokeWidth="14"
          strokeLinecap="round"
        />
      )}
      {/* RUL number */}
      <text x={cx} y={cy - 8}
        textAnchor="middle"
        fill="#CC5500"
        fontSize="30"
        fontWeight="800">
        {rul}
      </text>
      <text x={cx} y={cy + 14}
        textAnchor="middle"
        fill="#A7A7A7"
        fontSize="9">
        cycles remaining
      </text>
      {/* Min / Max labels */}
      <text x="22" y="108"
        fill="#64746b" fontSize="9">0</text>
      <text x="192" y="108"
        fill="#64746b" fontSize="9">125</text>
    </svg>
  );
}


function App() {
  const [sensors,  setSensors]  = useState(HEALTHY_ENGINE);
  const [result,   setResult]   = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);
  const [history,  setHistory]  = useState([]);
  const [engineId, setEngineId] = useState('ENG-001');

  const handleChange = (sensor, value) => {
    setSensors(prev => ({
      ...prev,
      [sensor]: parseFloat(value) || 0
    }));
  };

  const handlePredict = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        'https://predictive-maintenance-rul-prediction.onrender.com/',
        { sensor_values: sensors }
      );
      const data = response.data;
      setResult(data);

      // Add to history
      setHistory(prev => [{
        id        : engineId,
        rul       : data.rul,
        status    : data.status,
        time      : new Date().toLocaleTimeString()
      }, ...prev].slice(0, 10));

    } catch (err) {
      setError('Could not connect to backend.');
    }
    setLoading(false);
  };

  const getStatusColor = (status) => {
    if (status === 'CRITICAL') return '#dc2626';
    if (status === 'WARNING')  return '#f59e0b';
    return '#9CAF88 ';
  };

  return (
    <div className="app">
      <div className="header">
        <h1>⚙️ Predictive Maintenance</h1>
        <p>NASA C-MAPSS Turbofan Engine RUL Predictor</p>
        <div className="badges">
          <span className="badge">Random Forest</span>
          <span className="badge">4 Datasets</span>
          <span className="badge">Best RMSE 12.90</span>
          <span className="badge">83% Cost Reduction</span>
        </div>
      </div>

      <div className="main-grid">
        {/* LEFT — Input */}
        <div className="left-panel">
          <div className="card">
            <div className="card-header">
              <h2>Engine Sensor Input</h2>
              <div className="preset-btns">
                <button
                  className="preset healthy"
                  onClick={() => setSensors(HEALTHY_ENGINE)}>
                  Load Healthy
                </button>
                <button
                  className="preset critical"
                  onClick={() => setSensors(DEGRADED_ENGINE)}>
                  Load Degraded
                </button>
              </div>
            </div>

            <div className="engine-id-row">
              <label>Engine ID</label>
              <input
                type="text"
                value={engineId}
                onChange={e => setEngineId(e.target.value)}
                className="engine-id-input"
              />
            </div>

            <div className="sensor-grid">
              {SENSORS.map(sensor => (
                <div key={sensor} className="sensor-input">
                  <label>{sensor.toUpperCase()}</label>
                  <input
                    type="number"
                    value={sensors[sensor]}
                    onChange={e =>
                      handleChange(sensor, e.target.value)}
                    step="0.01"
                  />
                </div>
              ))}
            </div>

            <button
              className="predict-btn"
              onClick={handlePredict}
              disabled={loading}>
              {loading ? '⏳ Predicting...' : '🔍 Predict RUL'}
            </button>
          </div>
        </div>

        {/* RIGHT — Result */}
        <div className="right-panel">
          {error && (
            <div className="card error-card">
              <p>⚠️ {error}</p>
            </div>
          )}

          {!result && !error && (
            <div className="card placeholder">
              <p>Enter sensor values and click Predict RUL</p>
              <p className="hint">
                Try "Load Degraded" to see a CRITICAL alert
              </p>
            </div>
          )}

          {result && !result.error && (
            <>
              <div className="card result-card">
                <p className="engine-label">{engineId}</p>

                <RULGauge rul={result.rul} />

                <div
                  className="status-badge"
                  style={{
                    backgroundColor: getStatusColor(result.status)
                  }}>
                  {result.status}
                </div>

                <p className="recommendation">
                  {result.recommendation}
                </p>

                {result.cost_saving > 0 && (
                  <div className="cost-box">
                    <p className="cost-label">
                      Potential Cost Saving
                    </p>
                    <p className="cost-value">
                      Rs. {result.cost_saving.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>

              <div className="stats-grid">
                <div className="stat-card">
                  <p className="stat-label">Optimal Threshold</p>
                  <p className="stat-value">2 cycles</p>
                </div>
                <div className="stat-card">
                  <p className="stat-label">Model</p>
                  <p className="stat-value">Random Forest</p>
                </div>
                <div className="stat-card">
                  <p className="stat-label">Best RMSE</p>
                  <p className="stat-value">12.90</p>
                </div>
                <div className="stat-card">
                  <p className="stat-label">Cost Reduction</p>
                  <p className="stat-value">83%</p>
                </div>
              </div>
            </>
          )}

          {/* History Table */}
          {history.length > 0 && (
            <div className="card">
              <h3>Prediction History</h3>
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Engine</th>
                    <th>RUL</th>
                    <th>Status</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((h, i) => (
                    <tr key={i}>
                      <td>{h.id}</td>
                      <td>{h.rul}</td>
                      <td>
                        <span
                          className="status-pill"
                          style={{
                            backgroundColor:
                              getStatusColor(h.status)
                          }}>
                          {h.status}
                        </span>
                      </td>
                      <td>{h.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;