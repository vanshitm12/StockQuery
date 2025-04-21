import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Stock from './components/Stock';
import SavedQueries from './components/saved'; // Make sure this path is correct

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <nav style={{ padding: '1rem', background: '#eee' }}>
          <Link to="/" style={{ marginRight: '1rem' }}>🏠 Home</Link>
          <Link to="/saved">💾 Saved Queries</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Stock />} />
          <Route path="/saved" element={<SavedQueries />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
