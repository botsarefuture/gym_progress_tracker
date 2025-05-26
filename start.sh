#!/bin/bash

# Start the frontend in its own tmux session
tmux new-session -d -s frontend "cd frontend/frontend && npm start"

# Start the backend in its own tmux session
tmux new-session -d -s backend "cd backend/backend && python3 app.py"

echo "Frontend and backend started in separate tmux sessions!"
echo "Attach to frontend: tmux attach -t frontend"
echo "Attach to backend:  tmux attach -t backend"
