import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    login: () => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setAuthenticated] = useState(() => {
        return localStorage.getItem('spotify-auth') === 'true';
    });

    const login = () => {
        setAuthenticated(true);
        localStorage.setItem('spotify-auth', 'true');
    };

    const logout = () => {
        setAuthenticated(false);
        localStorage.setItem('spotify-auth', 'false');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};
