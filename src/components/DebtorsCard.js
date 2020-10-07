import React from "react"
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

const DebtorsCard = ({ data, onRemoveClick, nav }) =>{

    const debtCardStyle = StyleSheet.create({
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
        cardDebtName: {
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
        button2: {
            height: 30,
            width: 150,
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
        <View style={debtCardStyle.cardAll}>
            <Text style={debtCardStyle.cardId}>ID: {data.id}</Text>
            <Text style={debtCardStyle.cardDebtName}>{data.borrower}</Text>
            <View style={debtCardStyle.cardContainer}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                    <View style={{flex: 1, flexDirection: 'row'}}>
                        {/*<FontAwesome style={debtCardStyle.cardIcon} name="credit-card" size={32} color="#2e85f7" />*/}
                        <View style={debtCardStyle.cardItem}>
                            <Text style={debtCardStyle.cardDescriptionTitle}>Сумма займа {"\n"} </Text>
                            <Text style={debtCardStyle.cardValue}>{data.body} ₽</Text>
                        </View>
                    </View>
                    <View style={{flex: 1, flexDirection: 'row'}}>
                        {/*<FontAwesome style={debtCardStyle.cardIcon} name="credit-card" size={32} color="#2e85f7" />*/}
                        <View style={debtCardStyle.cardItem}>
                            <Text style={debtCardStyle.cardDescriptionTitle}>Сумма к возврату на данный момент</Text>
                            <Text style={debtCardStyle.cardValue}>{data.balanceTotal} ₽</Text>
                        </View>
                    </View>
                </View>
                <View style={{flex: 1, flexDirection: 'row'}}>
                    <View style={{flex: 1, flexDirection: 'row'}}>
                        {/*<FontAwesome style={debtCardStyle.cardIcon} name="calendar" size={36} color="#2e85f7" />*/}
                        <View style={debtCardStyle.cardItem}>
                            <Text style={debtCardStyle.cardDescriptionTitle}>До возврата</Text>
                            <Text style={debtCardStyle.cardValue}>{data.dayBeforeReturn} дн.</Text>
                        </View>
                    </View>
                    <View style={{flex: 1, flexDirection: 'row'}}>
                        {/*<FontAwesome style={debtCardStyle.cardIcon} name="calendar" size={36} color="#2e85f7" />*/}
                        <View style={debtCardStyle.cardItem}>
                            <Text style={debtCardStyle.cardDescriptionTitle}>Процент</Text>
                            <Text style={debtCardStyle.cardValue}>
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
                    <View style={debtCardStyle.button}>
                        <Text style={debtCardStyle.buttonText}>
                            Просмотреть
                        </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onRemoveClick(data.id)}>
                    <View style={debtCardStyle.button2}>
                        <Text style={debtCardStyle.buttonText2}>
                            Удалить
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={{
                marginTop: 20,
                height: 30,
                width: 345,
                backgroundColor: STATUS_COLORS[data.status - 1],
                borderRadius: 25,
            }}>
                <Text style={debtCardStyle.buttonText}>
                    Статус: {data.statusText}
                </Text>
            </View>
        </View>
    )
}

export default DebtorsCard
