import React, {useState, useEffect, useContext} from "react"
import {View, Text, StyleSheet, ScrollView} from "react-native"
import {AppContext} from '../context/AppContext';
import Api from '../axios';


import LoansCard from "../components/LoansCard";

const LoansScreen = ({navigation}) =>{

    const loansStyle = StyleSheet.create({
        container: {
            padding: 15,
        },
        title: {
            fontSize: 22,
            color: "#131b36",
        }
    })


    const { state } = useContext(AppContext)

    const [myLoans, setMyLoans] = useState([])
    const [loansType, setLoansType] = useState(null)
    const [sort, setSort] = useState("date_issued")
    // const [loansTypeTwo, setLoansTypeTwo] = useState(0)

    const getUserLoans = () => {
        let url = `/loan/borrower-list?sort=${sort}`

        if (loansType !== null) {
            url += `&status=${loansType}`
        }

        Api.get(url, {
            headers: { Authorization: `Bearer ${state.authToken}` },
        }).then(res => setMyLoans(res.data))
    }

    useEffect(() => {
        getUserLoans()
    }, [loansType, sort])

    return(
        <ScrollView>
            <View style={loansStyle.container}>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={loansStyle.title}>Полученные займы</Text>
                </View>
                {myLoans.length > 0 ? (
                    myLoans.map(i => (
                        <View key={i.id}>
                            <LoansCard data={i} nav={navigation} />
                        </View>
                    ))
                ) : (
                    <View className="col-12">
                        <Text>У Вас нет ни одного полученного займа.</Text>
                    </View>
                )}
            </View>
        </ScrollView>
    )
}


export default LoansScreen
