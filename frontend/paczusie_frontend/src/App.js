import { BrowserRouter, Route, Routes } from 'react-router';
import './App.css';
import HomePage from './pages/HomePage';
import AdPage from './pages/AdPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import ProfilePage from './pages/ProfilePage';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Strona Główna */}
          <Route path="/" element={<HomePage />} />  
          {/* Szczegóły ogłoszenia */}
          <Route path="/ad" element={<AdPage />} />  
          {/* Strona logowania  */}
          <Route path="/login" element={<LoginPage />} />
          {/* Strona rejestracji  */}
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes - dla admina oraz lokalnych przedsiębiorców */}

          {/* Panel Admina - do zarządzania użytkownikami i zatwierdzania ogłoszeń */}
          <Route path="/admin/users" element={<ProtectedRoute requiredRoles={['admin']}><AdminPage /></ProtectedRoute>} />

          {/* Potrzebujemy jeszcze strony profilu biznesu */}
          <Route path="/profile" element={<ProtectedRoute requiredRoles={['business_owner']}><ProfilePage /></ProtectedRoute>} />

          <Route path="/cos" element={<AdminPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;