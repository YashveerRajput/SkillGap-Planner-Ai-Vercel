import React from 'react'
import { Outlet, useNavigation } from 'react-router'
import PageLoader from '../components/PageLoader'

const RootLayout = () => {
    const navigation = useNavigation()

    return (
        <>
            {navigation.state !== 'idle' && <PageLoader />}
            <Outlet />
        </>
    )
}

export default RootLayout
