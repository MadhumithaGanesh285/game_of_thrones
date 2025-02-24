import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ListOfCharacters from './components/ListOfCharacters/ListOfCharacters';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ListOfCharacters />} />
      </Routes>
    </Router>
  );
}

export default App;