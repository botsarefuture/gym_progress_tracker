import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

function App() {
  // State variables
  const [workouts, setWorkouts] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('jwt'));
  const [exercise, setExercise] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');

  // Fetch workouts when the token is available
  useEffect(() => {
    if (token) {
      axios.get('http://localhost:5000/workouts', { headers: { Authorization: `Bearer ${token}` } })
        .then(response => {
          setWorkouts(response.data);
        });
    }
  }, [token]);

  // Workout logging handler
  const handleWorkoutSubmit = async (e) => {
    e.preventDefault();

    // Basic form validation
    if (!exercise || !sets || !reps || !weight || !date) {
      setError('All fields are required.');
      return;
    }

    // Prepare workout data to send
    const workoutData = {
      exercise,
      sets,
      reps,
      weight,
      date,
      username: 'test_user' // This will be dynamic when user authentication is set up
    };

    try {
      const response = await axios.post('http://localhost:5000/workouts', workoutData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWorkouts([...workouts, workoutData]); // Update the workouts list
      setExercise('');
      setSets('');
      setReps('');
      setWeight('');
      setDate('');
      setError('');
    } catch (err) {
      setError('Failed to log workout. Please try again.');
    }
  };

  // Group workouts by exercise
  const groupedWorkouts = workouts.reduce((acc, workout) => {
    const { exercise, date, weight } = workout;
    if (!acc[exercise]) {
      acc[exercise] = [];
    }
    acc[exercise].push({ date, weight });
    return acc;
  }, {});

  // Prepare data for the chart per exercise
  const generateChartData = (exerciseData) => {
    return {
      labels: exerciseData.map(workout => workout.date),
      datasets: [
        {
          label: 'Weight Lifted (kg)',
          data: exerciseData.map(workout => workout.weight),
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }
      ]
    };
  };

  return (
    <div className="App">
      <h1>Gym Progress Tracker</h1>

      {/* Error message */}
      {error && <div className="error">{error}</div>}

      {/* Workout Logging Form */}
      <form onSubmit={handleWorkoutSubmit}>
        <div>
          <label>Exercise Name:</label>
          <input
            type="text"
            value={exercise}
            onChange={(e) => setExercise(e.target.value)}
            placeholder="e.g., Deadlift"
          />
        </div>
        <div>
          <label>Sets:</label>
          <input
            type="number"
            value={sets}
            onChange={(e) => setSets(e.target.value)}
            placeholder="Number of Sets"
          />
        </div>
        <div>
          <label>Reps per Set:</label>
          <input
            type="number"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            placeholder="Reps per Set"
          />
        </div>
        <div>
          <label>Weight (kg):</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Weight Lifted"
          />
        </div>
        <div>
          <label>Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <button type="submit">Log Workout</button>
      </form>

      {/* Workout History Table */}
      <h2>Workout History</h2>
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
          {workouts.map((workout, index) => (
            <tr key={index}>
              <td>{workout.exercise}</td>
              <td>{workout.sets}</td>
              <td>{workout.reps}</td>
              <td>{workout.weight}</td>
              <td>{workout.date}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Progress Charts per Exercise */}
      <h2>Progress Charts</h2>
      {Object.keys(groupedWorkouts).map((exercise, index) => (
        <div key={index}>
          <h3>{exercise}</h3>
          <Line data={generateChartData(groupedWorkouts[exercise])} />
        </div>
      ))}
    </div>
  );
}

export default App;
