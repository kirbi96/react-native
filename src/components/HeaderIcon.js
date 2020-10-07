import React from 'react'
import {View, Text, TouchableOpacity} from 'react-native';
import { DrawerActions } from '@react-navigation/native';

const HeaderIcon = ({navProps}) =>{

    return(
        <TouchableOpacity onPress={() => navProps.current?.dispatch(DrawerActions.toggleDrawer())}>
            <View >
                <Text style={{fontSize: 32, color: "white"}}>≡</Text>
            </View>
        </TouchableOpacity>
    )
}

export default HeaderIcon
