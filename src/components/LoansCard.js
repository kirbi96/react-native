import React from "react"
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

const LoansCard = ({ data, nav }) =>{

    const loanCardStyle = StyleSheet.create({
        cardAll:{
            paddingBottom:30,
            paddingTop:20,
            paddingLeft:15,
            paddingRight:25,
            borderColor: "#f7f8fb",
            borderWidth: StyleSheet.hairlineWidth,
            marginTop: 20,
            backgroundColor: "#ffffff",
            borderTopLeftRadius: 36,
            borderTopRightRadius: 30,
            borderBottomLeftRadius: 22,
            borderBottomRightRadius: 60
        },
        cardId: {
            fontSize: 16,
            color: "#2e85f7",
        },
        cardLoanName: {
            marginTop: 10,
            fontSize: 16,
            color: "#131b36",
            fontWeight: "bold",
        },
        cardContainer: {
        },
        cardItem:{
            marginTop: 20,
            marginLeft: 5,
        },
        cardDescriptionTitle:{
            fontSize: 14,
            color: "#747474",
        },
        cardValue:{
            fontSize: 16,
            color: "#131b36",
            fontWeight: "bold",
        },
        cardIcon:{
            marginTop: 25,
        },
        button: {
            height: 30,
            width: 150,
            backgroundColor: "#2e85f7",
            borderRadius: 25,
        },
        buttonText: {
            marginTop: 5,
            textAlign: "center",
            fontSize: 13,
            color: "#fff",
        },
        dateReturn: {
            height: 30,
            width: 150,
        },
        dateReturnText: {
            textAlign: "center",
            fontSize: 11,
            color: "#747474",
        },
    })

    const STATUS_COLORS = [
        "#1ad5cf",
        "#07388a",
        "#2fa15a",
        "#2fa15a",
        "#d44242",
        "#c323fb",
    ]


    return(
        <View style={loanCardStyle.cardAll}>
            <Text style={loanCardStyle.cardId}>ID: {data.id}</Text>
            <Text style={loanCardStyle.cardLoanName}>{data.creditor}</Text>
            <View style={loanCardStyle.cardContainer}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                    <View style={{flex: 1, flexDirection: 'row'}}>
                        {/*<FontAwesome style={loanCardStyle.cardIcon} name="credit-card" size={32} color="#2e85f7" />*/}
                        <View style={loanCardStyle.cardItem}>
                            <Text style={loanCardStyle.cardDescriptionTitle}>Сумма займа {data.body} </Text>
                            <Text style={loanCardStyle.cardValue}>22222 ₽</Text>
                        </View>
                    </View>
                    <View style={{flex: 1, flexDirection: 'row'}}>
                        {/*<FontAwesome style={loanCardStyle.cardIcon} name="credit-card" size={32} color="#2e85f7" />*/}
                        <View style={loanCardStyle.cardItem}>
                            <Text style={loanCardStyle.cardDescriptionTitle}>Сумма к возврату на данный момент</Text>
                            <Text style={loanCardStyle.cardValue}>{data.balanceTotal} ₽</Text>
                        </View>
                    </View>
                </View>
                <View style={{flex: 1, flexDirection: 'row'}}>
                    <View style={{flex: 1, flexDirection: 'row'}}>
                        {/*<FontAwesome style={loanCardStyle.cardIcon} name="calendar" size={36} color="#2e85f7" />*/}
                        <View style={loanCardStyle.cardItem}>
                            <Text style={loanCardStyle.cardDescriptionTitle}>До возврата</Text>
                            <Text style={loanCardStyle.cardValue}>{data.dayBeforeReturn} дн.</Text>
                        </View>
                    </View>
                    <View style={{flex: 1, flexDirection: 'row'}}>
                        {/*<FontAwesome style={loanCardStyle.cardIcon} name="calendar" size={36} color="#2e85f7" />*/}
                        <View style={loanCardStyle.cardItem}>
                            <Text style={loanCardStyle.cardDescriptionTitle}>Процент</Text>
                            <Text style={loanCardStyle.cardValue}>
                                {data.percent
                                    ? `${data.percent} в ${data.percent_period.toLowerCase()}`
                                    : "Беспроцентный"}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
            <View style={{flex: 1, flexDirection: 'row',  justifyContent: 'space-between', marginTop: 30}}>
                <TouchableOpacity onPress={() => nav.navigate("Loan", {id : data.id})}>
                    <View style={loanCardStyle.button}>
                        <Text style={loanCardStyle.buttonText}>
                            Просмотреть
                        </Text>
                    </View>
                </TouchableOpacity>
                    <View style={loanCardStyle.dateReturn}>
                        <Text style={loanCardStyle.dateReturnText}>
                            Дата возврата: {"\n"}
                            {data.date_return}
                        </Text>
                    </View>
            </View>
            <View style={{
                marginTop: 20,
                height: 30,
                width: 345,
                backgroundColor: STATUS_COLORS[data.status - 1],
                borderRadius: 25,
            }}>
                <Text style={loanCardStyle.buttonText}>
                    Статус: {data.statusText}
                </Text>
            </View>
        </View>

    )
}

export default LoansCard
