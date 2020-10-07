import React, {useState, useEffect, useContext} from 'react';

import {AppContext, AppProvider} from './src/context/AppContext';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';
import { navigationRef} from './src/fnc/RootNavigation';
import { enableScreens } from 'react-native-screens';

import Api from './src/axios';
import AsyncStorage from '@react-native-community/async-storage';

import HomeScreen from './src/screens/HomeScreen';
import DebtorsScreen from './src/screens/DebtorsScreen';
import LoansScreen from './src/screens/LoansScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import GiveDebtScreen from './src/screens/GiveDebtScreen';
import AuthScreen from './src/screens/AuthScreen';
import RegScreen from './src/screens/RegScreen';

import HeaderIcon from './src/components/HeaderIcon';
import LogOut from './src/fnc/LogOut';
import RecoveryScreen from './src/screens/RecoveryScreen';
import LoanInfoScreen from './src/screens/LoanInfoScreen';


const FirstScreen = () =>{

    const [isLoading, setIsLoading] = useState(true)

    const {state, login, logout} = useContext(AppContext)



    useEffect(()=> {
        AsyncStorage.getItem("authToken").then(token => {
            if (token) {
                Api.get("/profile",
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                ).then(res => {
                    login(res.data, token)
                }).catch(() => {
                    logout()
                })
            } else {
                logout()
            }
        }).finally(() => {
            setIsLoading(false)
        })
    },[])


    enableScreens();
    const Stack = createNativeStackNavigator()
    const Drawer = createDrawerNavigator()


    const MainScreen = () => {
        return(
            <Drawer.Navigator>
                <Drawer.Screen name = "Home" component={HomeScreen} options={{title: 'Главная'}}/>
                <Drawer.Screen name = "Debtors" component={DebtorsScreen} options={{title: 'Должники'}}/>
                <Drawer.Screen name = "Loans" component={LoansScreen} options={{title: 'Долги'}}/>
                <Drawer.Screen name = "Profile" component={ProfileScreen} options={{title: 'Профиль'}}/>
                <Drawer.Screen name = "GiveDebt" component={GiveDebtScreen} options={{title: 'Выдать займ'}}/>
                <Drawer.Screen name = "LogOut" component={LogOut} options={{title: 'Выйти'}}/>
            </Drawer.Navigator>
        )
    }

    return (
        <NavigationContainer ref={navigationRef}>
            <Stack.Navigator>
                { state.authToken ? (
                    <>
                    <Stack.Screen name="Main" component={MainScreen} options={{
                        headerStyle: {
                            backgroundColor: '#38364f',
                        },
                        headerLeft: () => (
                           <HeaderIcon navProps={navigationRef}/>
                        ),
                    }} />
                    <Stack.Screen name="Loan" component={LoanInfoScreen} options={{
                        headerStyle: {
                            backgroundColor: '#38364f',
                        }
                    }}
                    />
                    </>
                ):(
                    <>
                        <Stack.Screen name = "Authorization" component={AuthScreen} options={{headerShown: false}}/>
                        <Stack.Screen name = "Registration" component={RegScreen} options={{headerShown: false}} />
                        <Stack.Screen name = "Recovery" component={RecoveryScreen} options={{headerShown: false}}/>
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    )
}



const App = () => {
    return (
        <AppProvider>
            <FirstScreen/>
        </AppProvider>
    )
}

export default App;
