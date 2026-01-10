import { BrowserRouter, Route, Routes } from 'react-router';
import './App.css';
import HomePage from './pages/HomePage';
import AdPage from './pages/AdPage';
import LoginPage from './pages/LoginPage';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />  
          <Route path="/ad" element={<AdPage />} />    
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;