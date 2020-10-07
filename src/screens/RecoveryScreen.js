import React, {useState, useEffect, useContext} from "react"
import {Text, TextInput, View, TouchableOpacity, StyleSheet, ScrollView} from "react-native"
import Api from "../axios";
import {AppContext} from "../context/AppContext";

import {useForm} from "react-hook-form";

const RecoveryScreen = ({props, navigation}) => {

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

    const RecSubmit = () =>{
        alert("Данный раздел на этапе разработки")
    }

    // const { handleSubmit, register, setValue} = useForm();
    //
    //
    // const [errorObj, setErrorObj] = useState({})
    // const [isPhoneSend, setIsPhoneSend] = useState(false)
    //
    // useEffect(() =>{
    //     register('phone')
    //     register('password')
    //     register('password2')
    // },[register])
    //
    //
    // const RegSubmit = data => {
    //     const { phone, password, password2, code } = data
    //
    //     let errObj = {}
    //
    //     if (phone.length < 7)
    //         errObj = { username: "Неверный номер телефона" }
    //     if (password.length <= 6)
    //         errObj = { ...errObj, password: "Не менее 6 символов" }
    //     if (password !== password2)
    //         errObj = { ...errObj, password2: "Пароли не совпадают" }
    //     if (code && code.length !== 6)
    //         errObj = { ...errObj, password2: "Неверный код из СМС" }
    //
    //     setErrorObj(errObj)
    //
    //     if (Object.keys(errObj).length === 0) {
    //
    //         const sendData = {
    //             username: phone,
    //             password,
    //         }
    //         if (code) sendData.code = code
    //
    //         Api.post("/auth/signup", sendData).then(res => {
    //             const { error, data } = res.data
    //
    //             if (!error) {
    //                 if (!isPhoneSend) {
    //                     setErrorObj({})
    //                     setIsPhoneSend(true)
    //                 } else {
    //                     const { profile, access_token } = data
    //
    //                     localStorage.setItem("authToken", access_token)
    //                     localStorage.setItem("user", JSON.stringify(profile))
    //
    //                     setState({
    //                         user: profile,
    //                         authToken: access_token,
    //                     })
    //                 }
    //             } else {
    //                 setErrorObj(data)
    //             }
    //         })
    //     }
    // }

    return(
        <ScrollView style={{backgroundColor: "#f5f1f1"}}>
            <View style={authStyle.authContainer}>
                <Text style={authStyle.authTitle}>Восстановление</Text>
                <Text style={authStyle.authLabel}>Введите телефон</Text>
                <TextInput
                    style={authStyle.authInput}
                    // keyboardType='numeric'
                    onChangeText={ text =>{
                        setValue('phone', text)
                    }}
                />
                {/*<Text style={authStyle.authLabel}>Введите пароль</Text>*/}
                {/*<TextInput*/}
                {/*    style={authStyle.authInput}*/}
                {/*    keyboarType="password"*/}
                {/*    onChangeText={ text =>{*/}
                {/*        setValue('password', text)*/}
                {/*    }}*/}
                {/*/>*/}
                {/*<Text style={authStyle.authLabel}>Повторите пароль</Text>*/}
                {/*<TextInput*/}
                {/*    style={authStyle.authInput}*/}
                {/*    keyboarType="password"*/}
                {/*    onChangeText={ text =>{*/}
                {/*        setValue('password2', text)*/}
                {/*    }}*/}
                {/*/>*/}
                <TouchableOpacity style={{marginLeft: "auto", marginRight: "auto"}} onPress={() => RecSubmit()}>
                    <View style={authStyle.button}>
                        <Text style={authStyle.buttonText}>
                            Отправить смс
                        </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={{marginLeft: "auto", marginRight: "auto", marginTop: 10}} onPress={() => navigation.navigate('Authorization')}>
                    <View>
                        <Text>Вспомнил пароль</Text>
                    </View>
                </TouchableOpacity>

            </View>
        </ScrollView>
    )
}

export default RecoveryScreen
