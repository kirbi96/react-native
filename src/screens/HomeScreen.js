import React,{useState, useEffect, useContext} from "react"
import {View, Text, StyleSheet, ScrollView, Image, TouchableOpacity} from 'react-native';
import Api from "../axios";
import {AppContext} from "../context/AppContext";

const HomeScreen = (props) =>{

    const divStyle = StyleSheet.create({
        homeScreen: {
            backgroundColor: "#f5f1f1"
        },
        container: {
            flex: 1,
            padding: 10,
            borderColor: "#f7f8fb",
            borderWidth: StyleSheet.hairlineWidth,
            backgroundColor: "#ffffff",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 10,
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 26
        },
        info: {
            flex: 1,
            padding: 20,
        },
        step: {
            flex: 1,
            padding: 20
        },
        title: {
            fontSize: 22,
            padding: 4,
            borderColor: "#f7f8fb",
            borderWidth: StyleSheet.hairlineWidth,
        },
        row1: {
            fontSize: 16,
            padding: 4,
            borderColor: "#f7f8fb",
            borderWidth: StyleSheet.hairlineWidth,
            marginTop: 8,
            backgroundColor: "#ffffff",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 10,
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 20
        },
        homeData: {
            fontSize: 18,
            fontWeight: "bold",
            padding: 4,
            color: "#131b36",

        },
        stepText: {
            fontSize: 16,
            padding: 4,
            color: "#361331",
            borderBottomColor: "#f7f8fb",
            width: 250,
            borderBottomWidth: StyleSheet.hairlineWidth,
            marginTop: 8,
            marginBottom: 8,
            backgroundColor: "#ffffff",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 10,
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 20
        },
        stepNum: {
            paddingLeft: 9,
            paddingTop: 3,
            width: 32,
            height: 32,
            fontSize: 20,
            backgroundColor: "#2e85f7",
            color: "#fff",
            borderTopLeftRadius: 12,
            borderTopRightRadius: 6,
            borderBottomLeftRadius: 5,
            borderBottomRightRadius: 22
        },
        icon: {
            marginTop: 12,

        },
    })

    const {state} = useContext(AppContext)

    const [dashboardData, setDashboardData] = useState({})

    const getDashboardData = () => {
        Api.get("/main", {
            headers: { Authorization: `Bearer ${state.authToken}` },
        }).then(res => {
            setDashboardData(res.data)
        })
    }

    useEffect(() => {
        getDashboardData()
    }, [])

    return(
        <ScrollView>
            <View style={divStyle.homeScreen}>
                <View style={divStyle.container}>
                    <Text style={divStyle.title}>
                        Личный кабинет
                    </Text>
                    <Text style={divStyle.row1}>
                        В личном кабинете собарана общая информацию о кол-ве Ваших заемщиков и сумме их долга и кол-ве дел в процессе взыскания.
                    </Text>
                </View>
                <View style={divStyle.info}>
                    <View style={{flex: 1, flexDirection: 'row', alignContent: 'center'}}>
                        {/*<FontAwesome style={divStyle.icon} name="calendar" size={42} color="#f18489" />*/}
                        <View style={{marginLeft: 20, width: 290}}>
                            <Text style={divStyle.row1}>Дата ближайшего возврата</Text>
                            <Text style={divStyle.homeData}>{dashboardData.dateReturnAsCreditor}</Text>
                        </View>
                    </View>
                    <View style={{flex: 1, flexDirection: 'row'}}>
                        {/*<FontAwesome style={divStyle.icon} name="vcard-o" size={34} color="#c380fb" />*/}
                        <View style={{marginLeft: 20, width: 290}}>
                            <Text style={divStyle.row1}>Кол-во выданных займов</Text>
                            <Text style={divStyle.homeData}>{dashboardData.countAsCreditor}</Text>
                        </View>
                    </View>
                    <View style={{flex: 1, flexDirection: 'row'}}>
                        {/*<FontAwesome style={divStyle.icon} name="money" size={38} color="#52e497" />*/}
                        <View style={{marginLeft: 20, width: 290}}>
                            <Text style={divStyle.row1}>Вам должны вернуть</Text>
                            <Text style={divStyle.homeData}>{dashboardData.sumAsCreditor} Р</Text>
                        </View>
                    </View>
                    <View style={{flex: 1, flexDirection: 'row'}}>
                        {/*<FontAwesome style={divStyle.icon} name="calendar" size={42} color="#f18489" />*/}
                        <View style={{marginLeft: 20, width: 290}}>
                            <Text style={divStyle.row1}>Дата ближайшего погашения</Text>
                            <Text style={divStyle.homeData}>{dashboardData.dateReturnAsBorrower}</Text>
                        </View>
                    </View>
                    <View style={{flex: 1, flexDirection: 'row'}}>
                        {/*<FontAwesome style={divStyle.icon} name="vcard-o" size={34} color="#c380fb" />*/}
                        <View style={{marginLeft: 20, width: 290}}>
                            <Text style={divStyle.row1}>Кол-во полученных займов</Text>
                            <Text style={divStyle.homeData}>{dashboardData.countAsBorrower}</Text>
                        </View>
                    </View>
                    <View style={{flex: 1, flexDirection: 'row'}}>
                        {/*<FontAwesome style={divStyle.icon} name="money" size={38} color="#52e497" />*/}
                        <View style={{marginLeft: 20, width: 290}}>
                            <Text style={divStyle.row1}>Вы должны вернуть</Text>
                            <Text style={divStyle.homeData}>{dashboardData.sumAsBorrower} Р</Text>
                        </View>
                    </View>
                </View>
                <View style={divStyle.step}>
                    <View style={{flex: 1, flexDirection: 'row'}}>
                        <Image
                            source={require('../../assets/img/step-1.png')}
                            style={{ width: 90, height: 90,borderRadius: 20 }}
                        />
                        <View  style={{marginLeft: 20}}>
                            <Text style={divStyle.stepNum}>1</Text>
                            <Text style={divStyle.stepText}>Создайте займ</Text>
                        </View>
                    </View>
                    <View style={{flex: 1, flexDirection: 'row'}}>
                        <Image
                            source={require('../../assets/img/step-2.png')}
                            style={{ width: 90, height: 90, marginTop: 30,borderRadius: 20 }}
                        />
                        <View style={{marginLeft: 20, marginTop: 20 }}>
                            <Text style={divStyle.stepNum}>2</Text>
                            <Text style={divStyle.stepText}>Подпишите договор {"\n"}электронной подписью</Text>
                        </View>
                    </View>
                    <View style={{flex: 1, flexDirection: 'row'}}>
                        <Image
                            source={require('../../assets/img/step-3.png')}
                            style={{ width: 90, height: 90, marginTop: 30,borderRadius: 20  }}
                        />
                        <View  style={{marginLeft: 20, marginTop: 20 }}>
                            <Text style={divStyle.stepNum}>3</Text>
                            <Text style={divStyle.stepText}>Отправьте займ заемщику</Text>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}


export default HomeScreen
