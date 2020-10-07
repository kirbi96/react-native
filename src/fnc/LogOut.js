import React, {useContext, useEffect} from 'react';
import {AppContext} from '../context/AppContext';

const LogOut = () =>{
    const { logout } = useContext(AppContext)

    const onLogout = () => {
        logout()
    }

    useEffect(() => {
        onLogout()
    }, [])

    return(
        <>
        </>
    )
}

export default LogOut
