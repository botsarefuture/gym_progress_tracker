import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'; // Added Navigate import
import App from './App';
import Login from './Login'; // Login page component
import Register from './Register'; // Register page component
import reportWebVitals from './reportWebVitals';

// Optional: ErrorBoundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught in ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong. Please try again later.</h1>;
    }
    return this.props.children;
  }
}

function ProtectedRoute({ element, ...rest }) {
  const token = localStorage.getItem('jwt');
  return token ? element : <Navigate to="/login" />;
}

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <ErrorBoundary>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} /> {/* Added route for Register */}
            <Route path="/" element={<ProtectedRoute element={<App />} />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
