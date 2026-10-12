
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../components/supabaseClient";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check whether a Supabase session already exists
        async function checkSession() {
            const { data } = await supabase.auth.getSession();

            if (data.session) {
                setUser(data.session.user);
                localStorage.setItem("mindoff_token", data.session.access_token);
            } else {
                localStorage.removeItem("mindoff_token");
                setUser(null);
            }

            setLoading(false);
        }

        checkSession();

        // Listen for login, logout, and Google OAuth session changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
            if (session) {
                setUser(session.user);
                localStorage.setItem("mindoff_token", session.access_token);
            } else {
                setUser(null);
                localStorage.removeItem("mindoff_token");
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    async function loginWithGoogle() {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: window.location.origin,
            },
        });

        if (error) throw error;
    }

    async function logout() {
        await supabase.auth.signOut();
        localStorage.removeItem("mindoff_token");
        setUser(null);
    }

    return (
        <AuthContext.Provider
            value={{ user, loading, loginWithGoogle, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}