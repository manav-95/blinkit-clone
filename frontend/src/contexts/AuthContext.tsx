import React, { createContext, useContext, useEffect, useState, type Dispatch, type SetStateAction } from "react";

interface AuthContextType {
    loginBox: boolean;
    setLoginBox: Dispatch<SetStateAction<boolean>>;
    loggedIn: boolean;
    setLoggedIn: Dispatch<SetStateAction<boolean>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

    const [loginBox, setLoginBox] = useState<boolean>(false);
    const [loggedIn, setLoggedIn] = useState<boolean>(false);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            setLoggedIn(true);
        } else {
            setLoggedIn(false);
        }
    }, []);


    return (
        <AuthContext.Provider value={{ loginBox, setLoginBox, loggedIn, setLoggedIn }}>
            {children}
        </AuthContext.Provider>
    )
}


export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within a AuthProvider");
    return context;
}