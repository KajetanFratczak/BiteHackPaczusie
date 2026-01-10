import { BrowserRouter, Route, Routes } from 'react-router';
import './App.css';
import HomePage from './pages/HomePage';
import AdPage from './pages/AdPage';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />  
        <Route path="/:id" element={<AdPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;