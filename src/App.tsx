import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ListOfCharacters from './components/ListOfCharacters/ListOfCharacters';
import CharacterDetailPage from './components/CharacterDetailPage/CharacterDetailPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ListOfCharacters />} />
        <Route path="/characters/:id" element={< CharacterDetailPage/>} />
      </Routes>
    </Router>
  );
}

export default App;