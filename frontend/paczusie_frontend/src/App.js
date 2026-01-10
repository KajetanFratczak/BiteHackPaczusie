import { BrowserRouter, Route, Routes } from 'react-router';
import './App.css';
import HomePage from './pages/HomePage';
import AdPage from './pages/AdPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />  
        <Route path="/ad" element={<AdPage />} />    
      </Routes>
    </BrowserRouter>
  );
}

export default App;