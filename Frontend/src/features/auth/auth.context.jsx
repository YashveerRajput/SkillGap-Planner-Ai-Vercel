//this is created to manage state
import { createContext,useEffect,useState} from 'react'
import { getMe } from './services/auth.api'


export const AuthContext = createContext()

export const AuthProvider = ({children}) => {
    const [user,setUser] = useState(null)
    const [loading,setLoading] = useState(true)

    useEffect(() => {
        let mounted = true

        const hydrateUser = async () => {
            try {
                const data = await getMe()
                if (mounted) {
                    setUser(data?.user ?? null)
                }
            } catch {
                if (mounted) {
                    setUser(null)
                }
            } finally {
                if (mounted) {
                    setLoading(false)
                }
            }
        }

        hydrateUser()

        return () => {
            mounted = false
        }
    }, [])

    return (
        <AuthContext.Provider value={{user,setUser,loading,setLoading}} >{children}</AuthContext.Provider>
    )
}