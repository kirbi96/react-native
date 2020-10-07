import React, {useState, useEffect, useContext} from "react"
import {View, Text, TouchableOpacity, StyleSheet, ScrollView} from "react-native"
import Api from '../axios';
import {AppContext} from '../context/AppContext';

import DebtorsCard from "../components/DebtorsCard";

const DebtorsScreen = ({navigation}) =>{

    const debtorsStyle = StyleSheet.create({
        container: {
            padding: 15,
        },
        title: {
            fontSize: 22,
            color: "#131b36",
        },
        button: {
            height: 40,
            width: 150,
            backgroundColor: "#2e85f7",
            borderRadius: 25,
        },
        buttonText: {
            marginTop: 5,
            textAlign: "center",
            fontSize: 18,
            color: "#fff",
        },

    })

    const { state } = useContext(AppContext)
    const Authorization = `Bearer ${state.authToken}`

    const [errorFlag, setErrorFlag] = useState({ isSuccess: false, text: "" })

    const [debtors, setDebtors] = useState([])
    const [debtorsType, setDebtorsType] = useState(null)
    const [sort, setSort] = useState("date_issued")
    // const [loansTypeTwo, setLoansTypeTwo] = useState(0)


    useEffect(() => {
        getDebtors()
    }, [])


    /**
     * Список долгов
     */
    const getDebtors = () => {
        let url = `/loan/creditor-list?sort=${sort}`

        if (debtorsType !== null) {
            url += `&status=${debtorsType}`
        }

        Api.get(url, {
            headers: { Authorization },
        }).then(res => {
            setDebtors(res.data)

            // if (debtorsType === null) {
            //     setLoansTypeTwo(res.data.filter(item => item.status === 2).length)
            // }
        })
    }

    /**
     * Удаление долга
     */
    const deleteDebt = id => {
            Api.get(`/loan/delete?id=<id>`, {
                headers: { Authorization },
                params: { id: id },
            }).then(res => {
                const { error, data } = res.data
                if (!error) {
                    getDebtors()
                } else {
                    setErrorFlag({ isSuccess: false, text: data })
                }
            })
    }



    return(
        <ScrollView>
            <View style={debtorsStyle.container}>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={debtorsStyle.title}>Выданные займы</Text>
                    <TouchableOpacity onPress={() => navigation.navigate("GiveDebt")}>
                        <View style={debtorsStyle.button}>
                            <Text style={debtorsStyle.buttonText}>
                                Выдать займ
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                {debtors.length > 0 ? (
                    debtors.map(i => (
                        <View key={i.id} className="col-12 col-md-6">
                            <DebtorsCard data={i} onRemoveClick={deleteDebt} nav={navigation} />
                        </View>
                    ))
                ) : (
                    <View>
                        <Text>
                            У Вас нет займов в данном статусе.
                        </Text>
                    </View>
                )}
            </View>
        </ScrollView>

    )
}


export default DebtorsScreen
