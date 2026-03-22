import axios from "axios"

//to reduce redundancy we create
const configuredBaseURL = import.meta.env.VITE_API_BASE_URL

const api = axios.create({
    baseURL : configuredBaseURL || (import.meta.env.DEV ? "http://localhost:3000" : ""),
    //this line is used because cookie by default nahi aata hai axios k through so hame alag se credential dena padhta hai
    withCredentials:true
})

if (!configuredBaseURL && !import.meta.env.DEV) {
    console.warn("VITE_API_BASE_URL is not set. API calls will use current origin.")
}


export async function register({username,email,password}) {
    const response = await api.post('/api/auth/register',{
        username,email,password
    })

    return response.data
}

//now making for login
export async function login({email,password}) {
    const response = await api.post("/api/auth/login",{
        email,password
    })

    return response.data
}

export async function logout(){
    const response = await api.get("/api/auth/logout")

    return response.data
}

export async function getMe(){
    const response = await api.get("/api/auth/get-me")

    return response.data
}