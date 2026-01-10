import React, {createContext, useContext, useEffect} from 'react';
import {authService} from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
    const [user, setUser] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    const fetchAndSetUser = async () => {
        try{
            const userData = await authService.getCurrentUser();
            if (userData){
                const mappedUser = {
                    id: userData.user_id,
                    firstName: userData.first_name,
                    lastName: userData.last_name,
                    login: userData.email,
                    role: userData.role
                };
                setUser(mappedUser);
                return mappedUser;
            }
        } catch (error){
            console.log(error);
        }
        return null;
    };

    // przy starcie aplikacji sprawdzam, czy w localStorage jest token i user
    useEffect(() => {
        const initUser = async () => {
            const token = localStorage.getItem("token");
            console.log("Token z localStorage:", token);
            if (token) {
                await fetchAndSetUser();
            }
            setLoading(false);
        }

        initUser();
    }, []);

    const login = async (email, password) => {
        try{
            const response = await authService.login(email, password);
            if (response.access_token){
                const loggedInUser = await fetchAndSetUser();

                if (loggedInUser){
                    return {success: true, role: loggedInUser.role, msg: "Logowanie pomyślne."};
                } 
            }
        } catch (error){
            console.log(error);
            return {success: false, msg: "Błąd podczas logowania."};
        }
        return {success: false, msg: "Nie udało się pobrać danych użytkownika."};
    };

    const logout = async () => {
        authService.logout();
        setUser(null);
    };

    const register = async (firstName, lastName, email, password) => {
        try{
            const response = await authService.register({
                first_name: firstName,
                last_name: lastName,
                email: email,
                password: password,
                role: "business_owner"
            });
            return { success: true, msg: "Rejestracja pomyślna. Zaloguj się." };
                
        } catch (error) {
            console.error("Błąd rejestracji:", error);
            return { 
                success: false, 
                msg: error.response?.data?.detail || "Błąd podczas rejestracji." 
            };
    }
};

    return (
        <AuthContext.Provider value={{user, loading, login, logout, register}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);