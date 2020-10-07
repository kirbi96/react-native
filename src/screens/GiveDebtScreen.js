import React, {useState, useEffect, useContext} from "react"
import {View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity} from "react-native"


import {AppContext} from '../context/AppContext';
import {Controller, useForm} from 'react-hook-form';
import Api from '../axios';
import DatePicker from 'react-native-datepicker';

const GiveDebtScreen = ({props, navigation}) =>{

    const giveDebtStyle = StyleSheet.create({
        stepActive:{
            width: "33.3%",
            height: 60,
            borderRightWidth: 1,
            borderRightColor: "rgba(8,9,10,0.2)",
            backgroundColor: "#2e85f7",
            color: "#fff",
            fontSize: 20,
            textAlign: "center",
            paddingTop: 15,
        },
        step:{
            width: "33.3%",
            height: 60,
            borderRightWidth: 1,
            borderRightColor: "rgba(8,9,10,0.2)",
            backgroundColor: "rgba(132,225,252,0.15)",
            color: "#000000",
            fontSize: 20,
            textAlign: "center",
            paddingTop: 15,
        },
        giveDebtInfo:{
            marginTop: 20,
            fontSize: 20,
            marginLeft: 15,
        },
        giveDebtLabel:{
            marginLeft: "auto",
            marginRight: "auto",
            color: "#2e85f7",
            marginTop: 15,
            fontSize: 16,
        },
        giveDebtInput:{
            marginTop: 10,
            width: 350,
            backgroundColor: "#fff",
            paddingLeft: 20,
            height: 40,
            borderRadius: 10,
        },
        button: {
            marginRight: "auto",
            marginLeft: "auto",
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
        button2: {
            height: 30,
            width: 170,
            backgroundColor: "#2e85f7",
            borderRadius: 25,
        },
        buttonText2: {
            marginTop: 5,
            textAlign: "center",
            fontSize: 13,
            color: "#fff",
        },
    })


    const { state } = useContext(AppContext)
    const Authorization = `Bearer ${state.authToken}`

    const [step,setStep] = useState(0)

    //первый шаг
    const [dateReturn, setDateReturn] = useState({date: ""})

    //второй шаг
    const [debtId, setDebtId] = useState(null)
    const [debtorIsNew, setDebtorIsNew] = useState(null)
    const [debtBorrower, setDebtBorrower] = useState("")

    const { control, handleSubmit} = useForm()

    const createLoan = data => {
        const data1 = {...data , date_return : dateReturn.date }

        Api.post("/loan/create", data1, { headers: { Authorization } }).then(res => {
            const { error, data } = res.data
            if (!error) {
                const { isNew, borrower, id } = data
                console.log(borrower);
                isNew ? setDebtorIsNew(true) : (setDebtorIsNew(false), setDebtId(id), setDebtBorrower(borrower))
                setStep(1)
            } else {
                alert(data)
            }

        })
    }

    const onSendLoan = () => {

        Api.get(`/loan/send-to-borrower?id=${debtId}`, {
            headers: {
                Authorization,
            },
        }).then(res => {
            const { error, data } = res.data

            if (error) {
                alert(data)
            } else {
                alert("Заявка успешно отправлена")
                navigation.navigate('Debtors')
            }
        })
    }

    return(
        <ScrollView>

            <View>
                <View style={{flex: 1, flexDirection: 'row'}}>
                    <Text style={step !== 0 ? giveDebtStyle.step : giveDebtStyle.stepActive}>Шаг 1</Text>
                    <Text style={step !== 1 ? giveDebtStyle.step : giveDebtStyle.stepActive}>Шаг 2</Text>
                    <Text style={step !== 2 ? giveDebtStyle.step : giveDebtStyle.stepActive}>Шаг 3</Text>
                </View>

                {step === 0 &&(
                    <>
                        <Text style={giveDebtStyle.giveDebtInfo}>Укажите информацию о займе</Text>

                        <View style={{padding: 15}}>
                            <Text style={giveDebtStyle.giveDebtLabel}>Размер займа</Text>
                            <Controller
                                control={control}
                                render={({ onChange, onBlur, value }) => (
                                    <TextInput
                                        style={giveDebtStyle.giveDebtInput}
                                        onBlur={onBlur}
                                        onChangeText={value => onChange(value)}
                                        value={value}
                                        keyboardType='numeric'
                                    />
                                )}
                                name="body"
                                rules={{ required: true }}
                            />

                            <Text style={giveDebtStyle.giveDebtLabel}>Дата возврата</Text>
                            <DatePicker
                                style={giveDebtStyle.giveDebtInput}
                                date={dateReturn.date}
                                mode="date"
                                format="DD.MM.YYYY"
                                customStyles={{
                                    dateInput: {
                                        borderColor: "#fff"
                                    }
                                }}
                                onDateChange={(date) => {setDateReturn({date: date})}}
                            />
                            <Text style={giveDebtStyle.giveDebtLabel}>Процент</Text>
                            <Controller
                                control={control}
                                render={({ onChange, onBlur, value }) => (
                                    <TextInput
                                        style={giveDebtStyle.giveDebtInput}
                                        onBlur={onBlur}
                                        onChangeText={value => onChange(value)}
                                        value={value}
                                        keyboardType='numeric'
                                    />
                                )}
                                name="percent"
                                rules={{ required: false }}
                            />
                            <Text style={giveDebtStyle.giveDebtLabel}>Номер заемщика</Text>
                            <Controller
                                control={control}
                                render={({ onChange, onBlur, value }) => (
                                    <TextInput
                                        style={giveDebtStyle.giveDebtInput}
                                        onBlur={onBlur}
                                        onChangeText={value => onChange( value)}
                                        value={value}
                                        keyboardType='numeric'
                                    />
                                )}
                                name="borrowerPhone"
                                rules={{ required: true }}
                                defaultValue="+"
                            />
                        </View>

                        <TouchableOpacity onPress={handleSubmit(createLoan)}>
                            <View style={giveDebtStyle.button}>
                                <Text style={giveDebtStyle.buttonText}>
                                    Далее
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </>
                )}

                {step === 1 && debtorIsNew &&(
                    <>
                        <View>
                            <Text>
                               Данный пользователь не зарегистрирован в системе
                            </Text>
                        </View>

                        {/*<View>*/}
                        {/*    <Text style={giveDebtStyle.giveDebtLabel}>Фамилия</Text>*/}
                        {/*    <TextInput*/}
                        {/*        style={giveDebtStyle.giveDebtInput}*/}
                        {/*        placeholder="Фамилия"*/}
                        {/*        name="last_name"*/}
                        {/*        // onChange={(e) => setDateReturn(e)}*/}
                        {/*    />*/}
                        {/*    <Text style={giveDebtStyle.giveDebtLabel}>Имя</Text>*/}
                        {/*    <TextInput*/}
                        {/*        style={giveDebtStyle.giveDebtInput}*/}
                        {/*        placeholder="Имя"*/}
                        {/*        name="name"*/}
                        {/*        // onChange={(e) => setDateReturn(e)}*/}
                        {/*    />*/}
                        {/*    <Text style={giveDebtStyle.giveDebtLabel}>Отчество</Text>*/}
                        {/*    <TextInput*/}
                        {/*        style={giveDebtStyle.giveDebtInput}*/}
                        {/*        placeholder="Отчество"*/}
                        {/*        name="patronymic"*/}
                        {/*        // onChange={(e) => setDateReturn(e)}*/}
                        {/*    />*/}
                        {/*    <Text style={giveDebtStyle.giveDebtLabel}>Дата рождения</Text>*/}
                        {/*    <TextInput*/}
                        {/*        style={giveDebtStyle.giveDebtInput}*/}
                        {/*        label="Дата рождения"*/}
                        {/*        name="birth_date"*/}
                        {/*        // onChange={(e) => setDateReturn(e)}*/}
                        {/*    />*/}
                        {/*    <Text style={giveDebtStyle.giveDebtLabel}>Серия паспорта</Text>*/}
                        {/*    <TextInput*/}
                        {/*        style={giveDebtStyle.giveDebtInput}*/}
                        {/*        placeholder="Серия паспорта"*/}
                        {/*        name="passport_ser"*/}
                        {/*        // onChange={(e) => setDateReturn(e)}*/}
                        {/*    />*/}
                        {/*    <Text style={giveDebtStyle.giveDebtLabel}>Номер паспорта</Text>*/}
                        {/*    <TextInput*/}
                        {/*        style={giveDebtStyle.giveDebtInput}*/}
                        {/*        placeholder="Номер паспорта"*/}
                        {/*        name="passport_num"*/}
                        {/*        // onChange={(e) => setDateReturn(e)}*/}
                        {/*    />*/}
                        {/*    <Text style={giveDebtStyle.giveDebtLabel}>Дата выдачи паспорта</Text>*/}
                        {/*    <TextInput*/}
                        {/*        style={giveDebtStyle.giveDebtInput}*/}
                        {/*        label="Дата выдачи паспорта"*/}
                        {/*        name="passport_date_issued"*/}
                        {/*        // onChange={(e) => setDateReturn(e)}*/}
                        {/*    />*/}
                        {/*    <Text style={giveDebtStyle.giveDebtLabel}>Фактический адрес</Text>*/}
                        {/*    <TextInput*/}
                        {/*        style={giveDebtStyle.giveDebtInput}*/}
                        {/*        placeholder="Фактический адрес"*/}
                        {/*        name="address_fact"*/}
                        {/*        // onChange={(e) => setDateReturn(e)}*/}
                        {/*    />*/}
                        {/*    <Text style={giveDebtStyle.giveDebtLabel}>Адрес регистрации</Text>*/}
                        {/*    <TextInput*/}
                        {/*        style={giveDebtStyle.giveDebtInput}*/}
                        {/*        placeholder="Адрес регистрации"*/}
                        {/*        name="address_reg"*/}
                        {/*        // onChange={(e) => setDateReturn(e)}*/}
                        {/*    />*/}
                        {/*</View>*/}

                        {/*<TouchableOpacity onPress={() => {alert("данные будут сохраняться")}}>*/}
                        {/*    <View style={giveDebtStyle.button2}>*/}
                        {/*        <Text style={giveDebtStyle.buttonText2}>*/}
                        {/*            Сохранить*/}
                        {/*        </Text>*/}
                        {/*    </View>*/}
                        {/*</TouchableOpacity>*/}

                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: 25}}>
                            <TouchableOpacity onPress={() => setStep(0)}>
                                <View style={giveDebtStyle.button2}>
                                    <Text style={giveDebtStyle.buttonText2}>
                                        Назад
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setStep(2)}>
                                <View style={giveDebtStyle.button2}>
                                    <Text style={giveDebtStyle.buttonText2}>
                                        Продолжить
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                    </>
                )}
                {step === 1 && !debtorIsNew &&(
                    <>
                        <View>
                            <Text>
                                Проверьте информацию о заемщике, по указанному вами номеру
                                телефона
                            </Text>
                        </View>
                        <View>
                            <Text>Заемщик:</Text>
                            <Text>{debtBorrower}</Text>
                        </View>

                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: 25}}>
                            <TouchableOpacity onPress={() => setStep(0)}>
                                <View style={giveDebtStyle.button2}>
                                    <Text style={giveDebtStyle.buttonText2}>
                                        Не верно
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setStep(2)}>
                                <View style={giveDebtStyle.button2}>
                                    <Text style={giveDebtStyle.buttonText2}>
                                        Верно
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </>
                )}

            {step === 2 &&(
                <>
                    <View>
                        <Text>
                            Уведомление сформировано! Отправить его вашему заемщику?
                        </Text>
                    </View>

                    <View>
                        <Text>Заемщик:</Text>
                        <Text>{debtBorrower}</Text>
                    </View>

                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-around', marginTop: 25}}>
                        <TouchableOpacity onPress={() => setStep(1)}>
                            <View style={giveDebtStyle.button2}>
                                <Text style={giveDebtStyle.buttonText2}>
                                    Назад
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onSendLoan}>
                            <View style={giveDebtStyle.button2}>
                                <Text style={giveDebtStyle.buttonText2}>
                                    Верно
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </>

            )}
            </View>
        </ScrollView>
    )
}


export default GiveDebtScreen
