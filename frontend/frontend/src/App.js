import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

function App() {
  const [workouts, setWorkouts] = useState([]);
  const [token] = useState(localStorage.getItem('jwt'));
  const [exercise, setExercise] = useState('');
  const [selectedExerciseOption, setSelectedExerciseOption] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');
  const [filterExercise, setFilterExercise] = useState('');

  useEffect(() => {
    if (token) {
      axios.get('http://localhost:5000/workouts', { headers: { Authorization: `Bearer ${token}` } })
        .then(response => setWorkouts(response.data));
    }
  }, [token]);

  const groupedWorkouts = workouts.reduce((acc, workout) => {
    const { exercise } = workout;
    if (!acc[exercise]) acc[exercise] = [];
    acc[exercise].push(workout);
    return acc;
  }, {});

  const exerciseList = Object.keys(groupedWorkouts);

  useEffect(() => {
    if (!filterExercise && exerciseList.length > 0) {
      setFilterExercise(exerciseList[0]);
    }
  }, [exerciseList, filterExercise]);

  const handleExerciseDropdown = (e) => {
    const val = e.target.value;
    setSelectedExerciseOption(val);
    if (val === '__add_new__') {
      setExercise('');
    } else {
      setExercise(val);
    }
  };

  const handleWorkoutSubmit = async (e) => {
    e.preventDefault();
    const usedExercise = selectedExerciseOption === '__add_new__' ? exercise : selectedExerciseOption;

    if (!usedExercise || !sets || !reps || !weight || !date) {
      setError('All fields are required.');
      return;
    }

    const workoutData = {
      exercise: usedExercise,
      sets: Number(sets),
      reps: Number(reps),
      weight: Number(weight),
      date,
      username: 'test_user'
    };

    try {
      await axios.post('http://localhost:5000/workouts', workoutData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWorkouts([...workouts, workoutData]);
      setExercise('');
      setSelectedExerciseOption('');
      setSets('');
      setReps('');
      setWeight('');
      setDate('');
      setError('');
      if (!filterExercise) setFilterExercise(workoutData.exercise);
    } catch (err) {
      setError('Failed to log workout. Please try again.');
    }
  };

  const generateChartData = (exerciseData) => {
    const sortedData = [...exerciseData].sort((a, b) => a.date.localeCompare(b.date));
    return {
      labels: sortedData.map(w => w.date),
      datasets: [
        {
          label: 'Weight Lifted (kg)',
          data: sortedData.map(w => w.weight),
          fill: true,
          backgroundColor: "rgba(75,192,192,0.2)",
          borderColor: "rgba(75,192,192,1)",
          tension: 0.2
        }
      ]
    };
  };

  return (
    <div className="app-outer">
      <main className="app-container">
        <header>
          <h1>🏋️‍♀️ Gym Progress Tracker</h1>
        </header>

        {/* Logging Form */}
        <section className="card">
          <h2>Log a Workout</h2>
          {error && <div className="error">{error}</div>}
          <form onSubmit={handleWorkoutSubmit} className="workout-form">
            <div className="form-row">
              <label>Exercise:</label>
              <select
                value={selectedExerciseOption}
                onChange={handleExerciseDropdown}
                className="input"
              >
                <option value="">Choose…</option>
                {exerciseList.map((ex, i) => (
                  <option value={ex} key={i}>{ex}</option>
                ))}
                <option value="__add_new__">+ Add new exercise</option>
              </select>
              {selectedExerciseOption === '__add_new__' && (
                <input
                  className="input"
                  type="text"
                  value={exercise}
                  onChange={(e) => setExercise(e.target.value)}
                  placeholder="e.g., Deadlift"
                  autoFocus
                />
              )}
            </div>
            <div className="form-row">
              <label>Sets:</label>
              <input
                className="input"
                type="number"
                value={sets}
                min="1"
                onChange={(e) => setSets(e.target.value)}
                placeholder="Sets"
              />
            </div>
            <div className="form-row">
              <label>Reps:</label>
              <input
                className="input"
                type="number"
                value={reps}
                min="1"
                onChange={(e) => setReps(e.target.value)}
                placeholder="Reps per Set"
              />
            </div>
            <div className="form-row">
              <label>Weight (kg):</label>
              <input
                className="input"
                type="number"
                value={weight}
                min="1"
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Weight"
              />
            </div>
            <div className="form-row">
              <label>Date:</label>
              <input
                className="input"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <button type="submit" className="btn">Log Workout</button>
          </form>
        </section>

        {/* Workout History */}
        <section className="card">
          <h2>History</h2>
          {exerciseList.length === 0 ? (
            <div className="empty">No workouts yet. Get lifting! 🏳️‍🌈</div>
          ) : (
            <>
              <div style={{ marginBottom: 16 }}>
                <label>Show: </label>
                <select
                  className="input"
                  value={filterExercise}
                  onChange={e => setFilterExercise(e.target.value)}
                >
                  {exerciseList.map((ex, i) => (
                    <option value={ex} key={i}>{ex}</option>
                  ))}
                </select>
              </div>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Exercise</th>
                      <th>Sets</th>
                      <th>Reps</th>
                      <th>Weight (kg)</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(groupedWorkouts[filterExercise] || []).map((workout, idx) => (
                      <tr key={idx}>
                        <td>{workout.exercise}</td>
                        <td>{workout.sets}</td>
                        <td>{workout.reps}</td>
                        <td>{workout.weight}</td>
                        <td>{workout.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>

        {/* Chart */}
        {exerciseList.length > 0 && (
          <section className="card">
            <h2>Progress Chart</h2>
            <Line data={generateChartData(groupedWorkouts[filterExercise] || [])} />
          </section>
        )}
      </main>
      {/* Modern CSS below! */}
      <style>{`
        body {
          background: linear-gradient(120deg, #f7fafc 0%, #e0eafc 100%);
        }
        .app-outer {
          min-height: 100vh;
          padding: 2vw;
          background: linear-gradient(120deg, #f7fafc 0%, #e0eafc 100%);
        }
        .app-container {
          max-width: 600px;
          margin: 32px auto;
          padding: 1.5rem;
        }
        header {
          text-align: center;
          margin-bottom: 2rem;
        }
        h1 {
          font-weight: 900;
          font-size: 2.6rem;
          letter-spacing: -1.5px;
          background: linear-gradient(90deg, #7f9cf5, #2ec4b6 80%);
          color: transparent;
          background-clip: text;
          -webkit-background-clip: text;
        }
        h2 {
          font-size: 1.4rem;
          font-weight: 800;
          margin-bottom: 0.7rem;
        }
        .card {
          background: rgba(255,255,255,0.85);
          border-radius: 1.5rem;
          box-shadow: 0 6px 30px 0 rgba(100,100,160,0.12), 0 1.5px 3px 0 rgba(60,90,130,0.08);
          margin-bottom: 2.5rem;
          padding: 2rem 1.5rem 1.5rem 1.5rem;
          transition: box-shadow 0.2s;
        }
        .card:hover {
          box-shadow: 0 10px 40px 0 rgba(80,120,180,0.18);
        }
        .workout-form .form-row {
          display: flex;
          align-items: center;
          margin-bottom: 1.1rem;
          gap: 10px;
        }
        label {
          min-width: 95px;
          font-weight: 500;
          color: #464f60;
          font-size: 1rem;
        }
        .input {
          background: #f3f6fa;
          border: none;
          border-radius: 0.7rem;
          padding: 0.6rem 1rem;
          font-size: 1rem;
          transition: background 0.17s;
          outline: none;
        }
        .input:focus {
          background: #e0eafc;
        }
        .btn {
          background: linear-gradient(90deg,#7f9cf5,#2ec4b6 90%);
          color: #fff;
          font-weight: 700;
          border: none;
          border-radius: 0.8rem;
          padding: 0.7rem 1.8rem;
          margin-top: 0.7rem;
          box-shadow: 0 1.5px 7px 0 rgba(60,90,130,0.11);
          cursor: pointer;
          font-size: 1.04rem;
          letter-spacing: 0.03em;
          transition: background 0.2s, transform 0.15s;
        }
        .btn:hover {
          background: linear-gradient(90deg,#2ec4b6,#7f9cf5 90%);
          transform: scale(1.04);
        }
        .error {
          color: #d7263d;
          font-weight: 600;
          margin-bottom: 1rem;
          background: #fff5f5;
          border-radius: 0.6rem;
          padding: 0.5rem 1rem;
        }
        .empty {
          color: #888ca9;
          font-size: 1.12rem;
          text-align: center;
          margin: 1.2rem 0;
        }
        .table-wrapper {
          max-width: 100vw;
          overflow-x: auto;
        }
        table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0 0.45em;
        }
        th, td {
          padding: 0.45em 1em;
          text-align: center;
          border-radius: 0.5em;
          background: #f7fafc;
        }
        th {
          font-size: 1rem;
          color: #6c7a89;
          background: #edf3fc;
        }
        @media (max-width: 600px) {
          .app-container {
            padding: 0.3rem;
          }
          .card {
            padding: 1.2rem 0.5rem;
          }
          h1 { font-size: 1.6rem; }
          h2 { font-size: 1.1rem; }
          label { min-width: 60px; }
        }
      `}</style>
    </div>
  );
}

export default App;
