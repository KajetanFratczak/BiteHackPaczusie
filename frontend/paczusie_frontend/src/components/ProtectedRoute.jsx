// Komponent ProtectedRoute to mechanizm do ochrony tras w aplikacji, zapewniający, że tylko zalogowani użytkownicy mogą uzyskać dostęp do określonych zasobów.
// u nas jest to admin oraz użytkownik, który chce dodać ogłoszenie
import React from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRoles }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Ładowanie autoryzacji...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRoles) {
        if (Array.isArray(requiredRoles) && !requiredRoles.includes(user.role)) {
            return <Navigate to="/" replace />;
        }
        else if (typeof requiredRoles === 'string' && user.role !== requiredRoles) {
            return <Navigate to="/" replace />;
        }
    }

    return children;
};

export default ProtectedRoute;