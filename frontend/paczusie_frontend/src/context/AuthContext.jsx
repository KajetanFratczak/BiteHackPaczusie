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
                setUser({
                    id: userData.id,
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    login: userData.login,
                    role: userData.role
                });
                return true;
            }
        } catch (error){
            console.log(error);
        }
        return false;
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

    const login = async (login, password) => {
        try{
            const response = await authService.login(login, password);
            if (response.token){
                const success = await fetchAndSetUser();

                if (success){
                    return {success: true, msg: "Logowanie pomyślne."};
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
            if (response.token){
                const success = await fetchAndSetUser();
                if (success){
                    return {success: true, msg: "Rejestracja pomyślna."};
                }
            }
        } catch (error){
            console.log(error);
            return {success: false, msg: "Błąd podczas rejestracji."};
        }
        return {success: false, msg: "Nie udało się zarejestrować użytkownika."};
    };

    return (
        <AuthContext.Provider value={{user, loading, login, logout, register}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);