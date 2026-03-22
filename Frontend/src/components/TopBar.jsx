import React from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../features/auth/hooks/use.auth'
import './TopBar.scss'

const TopBar = ({ showBack = false }) => {
    const { handleLogout } = useAuth()
    const navigate = useNavigate()

    const onLogout = async () => {
        await handleLogout()
        navigate('/login')
    }

    return (
        <div className='topbar'>
            {showBack && (
                <button className='topbar__back' onClick={() => navigate(-1)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
                    Back
                </button>
            )}
            <div className='topbar__spacer' />
            <button className='topbar__logout' onClick={onLogout}>
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                Logout
            </button>
        </div>
    )
}

export default TopBar
