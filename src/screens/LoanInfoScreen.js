import React, {useState, useEffect, useContext} from 'react'
import {View, Text, ScrollView, TouchableOpacity, StyleSheet} from 'react-native';
import { useRoute } from '@react-navigation/native';
import {AppContext} from '../context/AppContext';
import Api from '../axios';
import {useForm} from 'react-hook-form';



const LoanInfoScreen = () =>{
    const loanInfoStyle = StyleSheet.create({
        container: {
            padding: 15,
        },
        button: {
            height: 30,
            width: 170,
            backgroundColor: "#2e85f7",
            borderRadius: 25,
        },
        buttonText: {
            marginTop: 5,
            textAlign: "center",
            fontSize: 13,
            color: "#fff",
        },
        button2: {
            height: 30,
            width: 170,
            backgroundColor: "#fff",
            borderRadius: 25,
            borderColor: "#2e85f7",
            borderWidth: 1,
        },
        buttonText2: {
            marginTop: 5,
            textAlign: "center",
            fontSize: 13,
            color: "#2e85f7",
        },
        infoItem: {
            flex: 0.5,
            marginTop: 20,
        },
        infoItemText: {
            fontSize: 12,
            color: "#999"
        },
        infoItemValue: {
            fontSize: 14,
            fontWeight: "bold",
        },
        listTitle: {
            fontSize: 16,
            fontWeight: "bold",
            color: "#3b3151",
        }
    })


    const route = useRoute()
    const { state } = useContext(AppContext)
    const Authorization = `Bearer ${state.authToken}`

    const { register, handleSubmit, reset } = useForm()

    const [loanInfo, setLoanInfo] = useState({})
    const [loanDownload, setLoanDownload] = useState(false)

    const [pdfData, setPdfData] = useState(null)
    const [isContractModalVisible, setIsContractModalVisible] = useState(false)
    const [loanSigning, setLoanSigning] = useState(null)
    const [codeConfirm, setCodeConfirm] = useState(false)
    const [transfer, setTransfer] = useState(null)


    // ID кредитора и заёмщика
    const [ids, setIds] = useState({
        creditor: 0,
        borrower: 0,
    })


    /**
     * Получение данных сделки
     */
    const getLoan = () => {
        Api.get(`/loan/view?id=${route.params.id}`, { headers: { Authorization } }).then(res => {
            const { creditor_id, borrower_id } = res.data

            setLoanInfo(res.data)
            setIds({
                creditor: creditor_id,
                borrower: borrower_id,
            })
            setLoanDownload(true)
        })
    }

    /**
     * Отправление платежа в статусе новый на одобрение
     * @param {int} id
     */
    const onSendLoan = () => {
            Api.get(`/loan/send-to-borrower?id=${id}`, {
                headers: {
                    Authorization,
                },
                params: {
                    id,
                },
            }).then(res => {
                const { error, data } = res.data
                if (error) {
                    alert(data)
                } else {
                    alert("Заявка отправлена")
                }
            })
    }

    /**
     * Запрос на платеж (Погашение части долга)
     * @param {object} data
     */
    const moneyReturn = data => {

        const amount = +data.amount

        if (amount.length > 0 || amount !== 0) {
            Api.post(
                `/loan/money-was-returned?id=${id}`,
                { amount },
                { headers: { Authorization } }
            ).then(res => {
                const { error, data } = res.data

                if (!error) {
                    alert("Выплата зафиксирована")
                    getLoan()
                    reset({ amount: "" })
                } else {
                    alert(data)
                }

            })
        }
    }


    /**
     * Удаление займа (отклонение)
     * @param {int} id
     */
    const deleteDebt = id => {
        Api.get(`/loan/delete?id=${id}`, {
            headers: { Authorization },
            params: { id: loanInfo.id },
        }).then(res => {
            alert("Долг отклонен")
        })
    }

    /**
     * Запрос на подписание займа
     */
    const loanSign = () => {
        Api.get(`/loan/request-sign?id=${id}`, {
            headers: { Authorization },
        }).then(() => {
            setLoanSigning(true)
        })
    }

    /**
     * Смс подписание сделки
     */
    const loanConfirm = data => {

        const { loanConfirmCode } = data

        if (loanConfirmCode.length === 6) {
            Api.post(
                `/loan/sign?id=${id}`,
                { code: loanConfirmCode },
                { headers: { Authorization } }
            ).then(res => {
                const { error, data } = res.data

                if (!error) {

                    alert("Электронное подписание выполнено")

                    setCodeConfirm(true)

                    if (
                        loanInfo.signs[0].signedAt !== null &&
                        loanInfo.signs[1].signedAt !== null
                    ) {
                        getLoan()
                    }
                } else {
                    alert(data)
                }
            })
        } else {
            alert("Неверный код из СМС")
        }
    }

    /**
     * Подтверждение факта передачи денег
     */
    const moneyTransfer = () => {
            if (state.user.user_id === ids.borrower) {
                Api.get(`/loan/money-was-received?id=${id}`, {
                    headers: { Authorization },
                }).then(res => {
                    const { error, data } = res.data

                    if (!error) {
                        setLoanInfo({ ...loanInfo, status: 4 })
                        alert("Деньги получены")
                    } else {
                        alert(data)
                    }
                })
            } else if (IS_CREDITOR_ME) {
                Api.get(`/loan/money-was-sent?id=${id}`, {
                    headers: { Authorization },
                }).then(res => {
                    const { error, data } = res.data

                    if (!error) {
                        alert("Деньги выданы займодавцем")
                    } else {
                        alert(data)
                    }
                })
            } else {
                alert("Произошла ошибка")
            }
            setTransfer(true)
    }

    /**
     * Подтверждение заемодавцем, платежа сформированного кредитором
     * @param {int} id
     */
    const onMoneyHasReturned = id => {
            Api.get(`/loan-payment/confirm?id=${id}`, {
                headers: { Authorization },
                params: { id },
            }).then(() => {
                alert("Вы подтвердили выплату")
                getLoan()
            })
    }



    useEffect(() => {
        getLoan()
    }, [])



    return(
        <ScrollView style={loanInfoStyle.container}>
            {loanDownload ?(
                <>
                    <View>
                        <TouchableOpacity onPress={() => {}}>
                            <View style={loanInfoStyle.button}>
                                <Text style={loanInfoStyle.buttonText}>
                                    Просмотреть договор
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={{marginTop: 10}}>
                        <Text style={loanInfoStyle.listTitle}>Заимодавец: {loanInfo.creditorProfile.name}{" "}{loanInfo.creditorProfile.last_name}</Text>
                        <Text style={loanInfoStyle.listTitle}>Заемщик: {loanInfo.borrowerProfile.name}{" "}{loanInfo.borrowerProfile.last_name}</Text>
                        <Text style={{marginTop: 10}}>Статус займа: {loanInfo.statusText}</Text>
                    </View>

                    <View>
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                            <View style={loanInfoStyle.infoItem}>
                                <Text style={loanInfoStyle.infoItemText}>Сумма займа {"\n"}</Text>
                                <Text style={loanInfoStyle.infoItemValue}>{loanInfo.body} ₽</Text>
                            </View>
                            <View style={loanInfoStyle.infoItem}>
                                <Text style={loanInfoStyle.infoItemText}>Сумма к возврату на данный момент</Text>
                                <Text style={loanInfoStyle.infoItemValue}>{loanInfo.balanceTotal} ₽</Text>
                            </View>
                        </View>
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                            <View style={loanInfoStyle.infoItem}>
                                <Text style={loanInfoStyle.infoItemText}>До возврата</Text>
                                <Text style={loanInfoStyle.infoItemValue}>{loanInfo.dayBeforeReturn} дн.</Text>
                            </View>
                            <View style={loanInfoStyle.infoItem}>
                                <Text style={loanInfoStyle.infoItemText}>Процент</Text>
                                <Text style={loanInfoStyle.infoItemValue}>{loanInfo.percent ? `${loanInfo.percent} 
							в ${loanInfo.percent_period.toLowerCase()}`
                                    : "Беспроцентный"}
                                </Text>
                            </View>
                        </View>
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                            <View style={loanInfoStyle.infoItem}>
                                <Text style={loanInfoStyle.infoItemText}>Дата займа</Text>
                                <Text style={loanInfoStyle.infoItemValue}>{loanInfo.date_issued}</Text>
                            </View>
                            <View style={loanInfoStyle.infoItem}>
                                <Text style={loanInfoStyle.infoItemText}>Дата возврата</Text>
                                <Text style={loanInfoStyle.infoItemValue}>{loanInfo.date_return}</Text>
                            </View>
                        </View>
                    </View>


                    {loanInfo.status === 1 ? (
                        <View onClick={onSendLoan}>
                            <Text>
                                Отправить на подтверждение
                            </Text>
                        </View>
                    ) : loanInfo.status === 2 ? (
                        <>
                            {loanInfo.signs.length > 0 &&
                            loanInfo.signs[0].user_id === state.user.user_id ? (
                                <>
                                    {loanInfo.signs[0].signedAt !== null && (
                                        <View>
                                            <Text>
                                                Ждем подтверждения обратной строны
                                            </Text>
                                        </View>
                                    )}
                                </>
                            ) : (
                                <>
                                    {loanSigning ? (
                                        <>
                                            {codeConfirm ? (
                                                <View>
                                                    <Text>
                                                        Ждем подтверждения обратной строны
                                                    </Text>
                                                </View>
                                            ) : (
                                                <View onSubmit={handleSubmit(loanConfirm)}>
                                                    {/*<Input*/}
                                                    {/*    type="tel"*/}
                                                    {/*    name="loanConfirmCode"*/}
                                                    {/*    label="Подписание сделки"*/}
                                                    {/*    placeholder="Введите код из СМС"*/}
                                                    {/*    register={register}*/}
                                                    {/*    error={errorObj.loanConfirmCode}*/}
                                                    {/*/>*/}
                                                    <View>
                                                        <Text>
                                                            Подписать займ
                                                        </Text>
                                                    </View>
                                                </View>
                                            )}
                                        </>
                                    ) : (
                                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: 25}}>
                                            <TouchableOpacity onPress={loanSign}>
                                                <View style={loanInfoStyle.button}>
                                                    <Text style={loanInfoStyle.buttonText}>
                                                        Подтвердить займ
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={deleteDebt}>
                                                <View style={loanInfoStyle.button2}>
                                                    <Text style={loanInfoStyle.buttonText2}>
                                                        Удалить займ
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </>
                            )}
                        </>
                    ) : (
                        loanInfo.status === 3 && (
                            <View style={{ marginTop: 0 }}>
                                {transfer ? (
                                    <Text>
                                        Ждем подтверждения обратной стороны
                                    </Text>
                                ) : (
                                    <>
                                        <Text>
                                            Ваш займ подписан, если необходиммая сумма была передана
                                            подтвердите это
                                        </Text>
                                        <TouchableOpacity onPress={() => {}}>
                                            <View style={loanInfoStyle.button2}>
                                                <Text style={loanInfoStyle.buttonText2}>
                                                    Подтвердить факт передачи денег
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                        {/*<button*/}
                                        {/*    onClick={() => moneyTransfer()}*/}
                                        {/*    style={{ marginTop: 15 }}*/}
                                        {/*    className={`btn btn--fill-acent ${isSpinnerShow || ""}`}*/}
                                        {/*>*/}
                                        {/*    {isProcessSpinner}*/}
                                        {/*    */}
                                        {/*</button>*/}
                                    </>
                                )}
                            </View>
                        )
                    )}

                    {[4, 5].includes(loanInfo.status) && (
                        <View onSubmit={handleSubmit(moneyReturn)}>
                            {/*<Input*/}
                            {/*    type="num"*/}
                            {/*    name="amount"*/}
                            {/*    label="Произвести оплату"*/}
                            {/*    placeholder="Введите сумму"*/}
                            {/*    register={register}*/}
                            {/*    error={errorObj.amount}*/}
                            {/*/>*/}

                            <TouchableOpacity onPress={() => {}}>
                                <View style={loanInfoStyle.button2}>
                                    <Text style={loanInfoStyle.buttonText2}>
                                        Сформировать платеж
                                    </Text>
                                </View>
                            </TouchableOpacity>

                            {/*<button*/}
                            {/*    style={{ marginTop: 15 }}*/}
                            {/*    className={`btn btn--fill-acent ${isSpinnerShow || ""}`}*/}
                            {/*>*/}
                            {/*    {isProcessSpinner}*/}
                            {/*    Сформировать платеж*/}
                            {/*</button>*/}
                        </View>
                    )}


                    <View style={{marginTop: 20}}>
                        <Text style={loanInfoStyle.listTitle}>Список проведенных операций</Text>
                        <Text style={{marginTop: 15}}>Операций нет</Text>
                    </View>
                </>
            ) : (
                <View>
                    <Text>
                        Загрузка ...
                    </Text>
                </View>
            )}

        </ScrollView>
    )

}

export default LoanInfoScreen
