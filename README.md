# Gym Progress Tracker

Gym Progress Tracker is a full-stack application to track your workouts. The project includes a Flask-based backend and a React-based frontend to log gym exercises, view workout history, and visualize progress with charts.

## Features
- User registration and login with JWT-based authentication.
- Workout logging with fields: exercise, sets, reps, weight, and date.
- Visual display of workout history and progress via charts.
- MongoDB as the storage backend.

## Folder Structure
```
gym_progress_tracker/
├── backend/
│   └── backend/
│       ├── app.py
│       ├── requirements.txt
│       └── .env
└── frontend/
    └── frontend/
        ├── public/
        │   └── index.html
        ├── src/
        │   ├── App.js
        │   ├── Login.js
        │   ├── Register.js
        │   ├── index.js
        │   ├── reportWebVitals.js
        │   └── index.css
        └── package.json
```

## Installation

### Prerequisites
- Python 3.7+
- Node.js and npm
- MongoDB

### Backend Setup
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd gym_progress_tracker/backend/backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install the required Python packages:
   ```bash
   pip install -r requirements.txt
   ```
4. Ensure the environment variables are set in the `.env` file.
5. Start the backend server:
   ```bash
   python app.py
   ```

### Frontend Setup
1. Open another terminal and navigate to the frontend directory:
   ```bash
   cd gym_progress_tracker/frontend/frontend
   ```
2. Install the Node.js dependencies:
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm start
   ```
4. Open your browser and visit [http://localhost:3000](http://localhost:3000).

## Usage
1. Register a new user using the registration page.
2. Log in with your credentials.
3. Use the workout form to log your exercises.
4. View your workout history and track progress via charts.

## License
This project is licensed under the MIT License.

## Contact
For questions or contributions, please open an issue or submit a pull request on GitHub.
