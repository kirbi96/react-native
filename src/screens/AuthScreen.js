import React, {useState, useEffect, useContext} from "react"
import {Text, TextInput, View, TouchableOpacity, StyleSheet, ScrollView} from "react-native"
import Api from "../axios";
import {AppContext} from "../context/AppContext";

import {useForm} from "react-hook-form";

const AuthScreen = ({props, navigation}) => {

    const {state, login} = useContext(AppContext)

    const authStyle = StyleSheet.create({
        authContainer: {
            marginTop: "20%",
            padding: 15,
        },
        authTitle: {
            fontSize: 26,
            color: "#131b36",
            fontWeight: "bold",
            marginLeft: "auto",
            marginRight: "auto",
        },
        authLabel:{
            marginLeft: "auto",
            marginRight: "auto",
            color: "#2e85f7",
            marginTop: 15,
            fontSize: 16,
        },
        authInput:{
            marginTop: 10,
            width: 350,
            backgroundColor: "#fff",
            paddingLeft: 20,
            height: 40,
            borderRadius: 10,
        },
        button: {
            marginTop: 15,
            height: 40,
            width: 300,
            backgroundColor: "#2e85f7",
            borderRadius: 25,
        },
        buttonText: {
            marginTop: 8,
            textAlign: "center",
            fontSize: 16,
            color: "#fff",
        },
    })

    const { handleSubmit, register, setValue} = useForm();

    useEffect(() =>{
        register('phone')
        register('password')
    },[register])

    const AuthSubmit = (data) => {
        const {phone, password} = data
        Api.post("/auth/login",
            {
                username: phone,
                password: password
            }
        ).then(res => {
            const {error, data} = res.data
            if (!error) {
                const {profile, access_token} = data.data
                login(
                    profile,
                    access_token,
                )
            } else {
                alert("Ошибка")
            }
        })
    }

    return(
        <ScrollView style={{backgroundColor: "#f5f1f1"}}>
            <View style={authStyle.authContainer}>
                <Text style={authStyle.authTitle}>Вход</Text>
                <Text style={authStyle.authLabel}>Введите телефон</Text>
                <TextInput
                    style={authStyle.authInput}
                    keyboardType='numeric'
                    onChangeText={ text =>{
                        setValue('phone', text)
                    }}
                />
                <Text style={authStyle.authLabel}>Введите пароль</Text>
                <TextInput
                    style={authStyle.authInput}
                    secureTextEntry={true}
                    onChangeText={ text =>{
                        setValue('password', text)
                    }}
                />

                <TouchableOpacity style={{marginLeft: "auto", marginRight: "auto"}} onPress={handleSubmit(AuthSubmit)}>
                    <View style={authStyle.button}>
                        <Text style={authStyle.buttonText}>
                            Войти
                        </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={{marginLeft: "auto", marginRight: "auto", marginTop: 10}} onPress={() => navigation.navigate('Registration')}>
                    <View>
                        <Text>Нет аккаунта</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={{marginLeft: "auto", marginRight: "auto", marginTop: 10}} onPress={() => navigation.navigate('Recovery')}>
                    <View>
                        <Text>Восстановить пароль</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

export default AuthScreen
