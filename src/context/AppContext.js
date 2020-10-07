import React, { useState } from "react"
import AsyncStorage from '@react-native-community/async-storage';

const initialValue = {
    authToken: null,
    user: {},
}

export const AppContext = React.createContext({})

export const AppProvider = ({ children }) => {
    const [state, setState] = useState(initialValue)

    const login = (user, authToken) => {
        AsyncStorage.setItem("authToken", authToken).then(res => {
            setState({user, authToken})
        })
    }

    const logout = () => {
        AsyncStorage.clear().then(() => {
            setState(initialValue)
        })
    }

    const updateProfile = (data) =>{
        AsyncStorage.setItem("user", JSON.stringify(data)).then(res => {
            setState({...state, user: data})
        })

        console.log(data)
    }

    return (
        <AppContext.Provider value={{ state, updateProfile, login, logout }}>
            {children}
        </AppContext.Provider>
    )
}
