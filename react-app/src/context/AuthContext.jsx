import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../supabaseClient' // Ensure your Supabase client is correctly imported
import { useNavigate } from 'react-router-dom'

// Create the Auth Context
const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    // Handle user login
    const signIn = async (email, password) => {
        setLoading(true)
        const { error, data } = await supabase.auth.signInWithPassword({
            email,
            password,
        })
        if (error) {
            alert('Login failed:', error.message)
            setLoading(false)
            return
        }
        setUser(data.user)
        setLoading(false)
        navigate('/home') // Redirect to home after login
    }

    // Handle user logout
    const signOut = async () => {
        await supabase.auth.signOut()
        setUser(null)
        navigate('/login') // Redirect to login page after logout
    }

    // Track session status on app load
    useEffect(() => {
        const getSession = async () => {
            const { data } = await supabase.auth.getSession()
            if (data.session) {
                setUser(data.session.user)
            } else {
                setUser(null)
            }
            setLoading(false)
        }
        getSession()

        // Set up a listener to handle auth state changes
        const { data: authListener } = supabase.auth.onAuthStateChange(
            (event, session) => {
                if (session) {
                    setUser(session.user)
                } else {
                    setUser(null)
                }
                setLoading(false)
            }
        )

        // Unsubscribe from auth state changes when the component unmounts
        return () => {
            authListener.subscription?.unsubscribe()
        }
    }, [])

    return (
        <AuthContext.Provider value={{ user, signIn, signOut, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext)