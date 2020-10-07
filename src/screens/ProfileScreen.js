import React, {useState, useEffect, useContext} from "react"
import {View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, TextInput, Button} from "react-native"
import {useForm, Controller} from 'react-hook-form';
import {AppContext} from '../context/AppContext';
import Api from '../axios';
import DatePicker from 'react-native-datepicker'
import Input from '../components/Input';
import ImagePicker from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker/index';


const ProfileScreen = (props) =>{

    const profileStyle = StyleSheet.create({
        container: {
            paddingLeft: 20,
            paddingRight: 20,
        },
        profileStatus:{
            marginTop: 10,
        },
        profileStatusTextTitle:{
            fontSize: 24,
            color: "#361331",

        },
        profileStatusText:{
            fontSize: 20,
            color: "#361331",
            fontWeight: "bold",
        },
        profileInfo: {
            padding: 15,
            marginTop: 25,
            backgroundColor: "#ffffff",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 18,
            borderBottomLeftRadius: 18,
            borderBottomRightRadius: 56
        },
        profileAvatar:{
            width: 90,
            height: 90,
            borderRadius: 45,
            marginLeft: "auto",
            marginRight: "auto",
        },
        profileId:{
            marginTop: 10,
            fontSize: 16,
            color: "#2e85f7",
        },
        profileName:{
            marginTop: 5,
            fontSize: 16,
            color: "#000000",
            fontWeight: "bold",
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
        profileForm:{
            marginTop: 20,
        },
        profileLabel:{
            marginLeft: "auto",
            marginRight: "auto",
            color: "#2e85f7",
            marginTop: 15,
            fontSize: 16,
        },
        profileInput:{
            marginTop: 10,
            width: 350,
            backgroundColor: "#fff",
            paddingLeft: 20,
            height: 40,
            borderRadius: 10,
        },
        profilePassword:{
            marginTop: 40,
        },
        profilePasswordTitle:{
            fontSize: 24,
            color: "#361331",
        },
        profileDocuments:{
            marginTop: 40,
            paddingBottom: 60,
        },
        profileDocumentsTitle:{
            fontSize: 24,
            color: "#361331",
        },
        profileDocumentsLabel:{
            color: "#361331",
            marginTop: 15,
            fontSize: 16,
        },
        profileDocItem:{
            marginTop: 10,
            height: 150,
            width: 100,
            borderRadius: 10,
        }
    })


    const { state, updateProfile} = useContext(AppContext)
    const Authorization = `Bearer ${state.authToken}`
    const [dateBirthday, setDateBirthday] = useState({date:"15:05:2000"})
    const [passportDateIssued, setPassportDateIssued] = useState({date:"15:05:2000"})
    const [disabled, setDisabled] = useState(true)

    const [setErrorObj] = useState({})

    const [password, setPassword] = useState("")
    const [password2, setPassword2] = useState("")

    const [file,setFile] = useState({
        singleFile: '',
        multipleFile: [],
    })

    const { control, handleSubmit} = useForm()


    const userStatus = () =>{
        state.user?.status !== 1 && state.user?.status !== 4 && setDisabled(false)
    }

    const onAvatarUpdate = () =>{

        const options = {
            noData: true
        }

        ImagePicker.launchImageLibrary(options, res => {

            console.log("r", res)

            Api.post(`/profile/update`, res, {
                headers: { Authorization },
            }).then(res => {
                const { error, data } = res.data

                if (!error) {
                    alert("Фото успешно загружено")
                } else {
                    alert(data)
                }
            })
    })
    }


    const onDocUpLoad = async () =>{
        try {
            const results = await DocumentPicker.pickMultiple({
                type: [DocumentPicker.types.images],
            });
            for (const res of results) {
                console.log('res : ' + JSON.stringify(res));

                Api.post(`/doc/upload?type=${res.type}`, res, {
                    headers: { Authorization },
                }).then(res => {
                    const { error, data } = res.data
                    if (!error) {
                        getDocuments()
                    }
                })
            }
            setFile({ multipleFile: results });
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                alert('Отмена загрузки');
            } else {
                //For Unknown Error
                alert('Ошибка: ' + JSON.stringify(err));
                throw err;
            }
        }
    }

    const getDocuments = () =>{
        alert("загр док")
    }

    const onProfileUpdate = data => {
        const data1 = {...data , birthDate : dateBirthday.date, passportDateIssued: passportDateIssued.date }

        Api.post("/profile/update", data1, { headers: { Authorization } }).then(res => {
            const { error, data } = res.data
            if (!error) {
                updateProfile(data)
                setDisabled(false)
                alert("Профиль успешно обновлен")
            } else {
                alert(data)
            }

        })
    }

    const onPasswordUpdate = () => {

        let errObj = {}

        if (password.length <= 6) errObj = { password: "Пароль не менее 6 символов" }
        if (password !== password2) errObj = { password: "Пароли не совпадают" }

        setErrorObj(errObj)
        if (Object.keys(errObj).length !== 0 ) alert(errObj.password)

        if (Object.keys(errObj).length === 0 ){

            Api.post("/user/update-password", {password}, { headers: { Authorization } }).then(res => {

                const { error, data } = res.data

                if (!error) {
                    alert("Пароль успешно обновлен")
                } else {
                    alert(data)
                }

            })
        }
    }


    useEffect(() => {
        userStatus()
    }, [])

    return(
        <ScrollView style={profileStyle.container}>


            <View style={profileStyle.profileStatus}>
                <Text style={profileStyle.profileStatusTextTitle}>Статус профиля</Text>
                <Text style={profileStyle.profileStatusText}>{state.user?.statusText}</Text>
            </View>


            <View style={profileStyle.profileInfo}>
                <TouchableOpacity style={profileStyle.profileAvatar} onPress={() => onAvatarUpdate()}>
                    <Image
                        source={require('../../assets/img/avatar.jpg')}
                        style={profileStyle.profileAvatar}
                    />
                </TouchableOpacity>


                <Text style={profileStyle.profileId}>ID: {state.user?.user_id}</Text>
                <Text style={profileStyle.profileName}>{state.user?.last_name} {state.user?.name}</Text>
                <TouchableOpacity onPress={() => alert("Видео загружено")}>
                    <View style={profileStyle.button}>
                        <Text style={profileStyle.buttonText}>
                            Загрузить видео подтверждение
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>

            <View style={profileStyle.profileForm}>
                <Text style={profileStyle.profileLabel}>Фамилия</Text>
                <Controller
                    control={control}
                    render={({ onChange, onBlur, value }) => (
                        <TextInput
                            editable={disabled}
                            style={profileStyle.profileInput}
                            onBlur={onBlur}
                            onChangeText={value => onChange(value)}
                            value={value}
                        />
                    )}
                    name="last_name"
                    rules={{ required: true }}
                    defaultValue={state.user?.last_name}
                />
                <Text style={profileStyle.profileLabel}>Имя</Text>
                <Controller
                    control={control}
                    render={({ onChange, onBlur, value }) => (
                        <TextInput
                            editable={disabled}
                            style={profileStyle.profileInput}
                            onBlur={onBlur}
                            onChangeText={value => onChange(value)}
                            value={value}
                        />
                    )}
                    name="name"
                    rules={{ required: true }}
                    defaultValue={state.user?.name}
                />
                <Text style={profileStyle.profileLabel}>Отчество</Text>
                <Controller
                    control={control}
                    render={({ onChange, onBlur, value }) => (
                        <TextInput
                            editable={disabled}
                            style={profileStyle.profileInput}
                            onBlur={onBlur}
                            onChangeText={value => onChange(value)}
                            value={value}
                        />
                    )}
                    name="patronymic"
                    rules={{ required: true }}
                    defaultValue={state.user?.patronymic}
                />

                <Text style={profileStyle.profileLabel}>Дата рождения</Text>
                {!disabled ? (
                    <TextInput
                        editable={disabled}
                        style={profileStyle.profileInput}
                        value={state.user?.birthDate}
                    />
                ) : (
                <DatePicker
                    editable={disabled}
                    style={profileStyle.profileInput}
                    date={dateBirthday.date}
                    mode="date"
                    format="DD.MM.YYYY"
                    customStyles={{
                        dateInput: {
                            borderColor: "#fff"
                        }
                    }}
                    onDateChange={(date) => {setDateBirthday({date: date})}}
                />
                )}

                <Text style={profileStyle.profileLabel}>ИНН</Text>
                <Controller
                    control={control}
                    render={({ onChange, onBlur, value }) => (
                        <TextInput
                            editable={disabled}
                            keyboardType='numeric'
                            style={profileStyle.profileInput}
                            onBlur={onBlur}
                            onChangeText={value => onChange(value)}
                            value={value}
                        />
                    )}
                    name="inn"
                    rules={{ required: true }}
                    defaultValue={state.user?.inn}
                />

                <Text style={profileStyle.profileLabel}>СНИЛС</Text>
                <Controller
                    control={control}
                    render={({ onChange, onBlur, value }) => (
                        <TextInput
                            editable={disabled}
                            keyboardType='numeric'
                            style={profileStyle.profileInput}
                            onBlur={onBlur}
                            onChangeText={value => onChange(value)}
                            value={value}
                        />
                    )}
                    name="snils"
                    rules={{ required: true }}
                    defaultValue={state.user?.snils}
                />

                <Text style={profileStyle.profileLabel}>Место рождения</Text>
                <Controller
                    control={control}
                    render={({ onChange, onBlur, value }) => (
                        <TextInput
                            editable={disabled}
                            style={profileStyle.profileInput}
                            onBlur={onBlur}
                            onChangeText={value => onChange(value)}
                            value={value}
                        />
                    )}
                    name="place_of_birth"
                    rules={{ required: true }}
                    defaultValue={state.user?.place_of_birth}
                />
                <Text style={profileStyle.profileLabel}>Фактический адресс</Text>
                <Controller
                    control={control}
                    render={({ onChange, onBlur, value }) => (
                        <TextInput
                            editable={disabled}
                            style={profileStyle.profileInput}
                            onBlur={onBlur}
                            onChangeText={value => onChange(value)}
                            value={value}
                        />
                    )}
                    name="address_fact"
                    rules={{ required: true }}
                    defaultValue={state.user?.address_fact}
                />
                <Text style={profileStyle.profileLabel}>Серия паспорта</Text>
                <Controller
                    control={control}
                    render={({ onChange, onBlur, value }) => (
                        <TextInput
                            editable={disabled}
                            keyboardType='numeric'
                            style={profileStyle.profileInput}
                            onBlur={onBlur}
                            onChangeText={value => onChange(value)}
                            value={value}
                        />
                    )}
                    name="passport_ser"
                    rules={{ required: true }}
                    defaultValue={state.user?.passport_ser}
                />

                <Text style={profileStyle.profileLabel}>Номер паспорта</Text>
                <Controller
                    control={control}
                    render={({ onChange, onBlur, value }) => (
                        <TextInput
                            editable={disabled}
                            keyboardType='numeric'
                            style={profileStyle.profileInput}
                            onBlur={onBlur}
                            onChangeText={value => onChange(value)}
                            value={value}
                        />
                    )}
                    name="passport_num"
                    rules={{ required: true }}
                    defaultValue={state.user?.passport_num}
                />

                <Text style={profileStyle.profileLabel}>Дата выдачи</Text>
                {!disabled ? (
                    <TextInput
                        editable={disabled}
                        style={profileStyle.profileInput}
                        value={state.user?.passportDateIssued}
                    />
                ) : (
                    <DatePicker
                        keyboardType='numeric'
                        style={profileStyle.profileInput}
                        date={passportDateIssued.date}
                        mode="date"
                        format="DD.MM.YYYY"
                        customStyles={{
                            dateInput: {
                                borderColor: "#fff"
                            }
                        }}
                        onDateChange={(date) => {setPassportDateIssued({date: date})}}
                    />
                )}

                <Text style={profileStyle.profileLabel}>Паспорт выдан</Text>
                <Controller
                    control={control}
                    render={({ onChange, onBlur, value }) => (
                        <TextInput
                            editable={disabled}
                            style={profileStyle.profileInput}
                            onBlur={onBlur}
                            onChangeText={value => onChange(value)}
                            value={value}
                        />
                    )}
                    name="passport_issued"
                    rules={{ required: true }}
                    defaultValue={state.user?.passport_issued}
                />

                <Text style={profileStyle.profileLabel}>Адресс регистрации</Text>
                <Controller
                    control={control}
                    render={({ onChange, onBlur, value }) => (
                        <TextInput
                            editable={disabled}
                            style={profileStyle.profileInput}
                            onBlur={onBlur}
                            onChangeText={value => onChange(value)}
                            value={value}
                        />
                    )}
                    name="address_reg"
                    rules={{ required: true }}
                    defaultValue={state.user?.address_reg}
                />
                {disabled &&(
                    <TouchableOpacity onPress={handleSubmit(onProfileUpdate)} style={profileStyle.button}>
                        <Text style={profileStyle.buttonText}>
                            Сохранить
                        </Text>
                    </TouchableOpacity>
                )}

            </View>


            <View style={profileStyle.profilePassword}>
                <Text style={profileStyle.profilePasswordTitle}>Смена пароля</Text>
                <Text style={profileStyle.profileLabel}>Введите новый пароль</Text>

                <Input
                style={profileStyle.profileInput}
                setData={setPassword}
                data={password}
                />

                <Text style={profileStyle.profileLabel}>Повторите новый пароль</Text>

                <Input
                    style={profileStyle.profileInput}
                    setData={setPassword2}
                    data={password2}
                />

                {password.length > 0 &&(
                    <TouchableOpacity onPress={onPasswordUpdate} style={profileStyle.button}>
                        <Text style={profileStyle.buttonText}>
                            Редактировать пароль
                        </Text>
                    </TouchableOpacity>
                )}
            </View>


            <View style={profileStyle.profileDocuments}>
                <Text style={profileStyle.profileDocumentsTitle}>Документы</Text>
                <Text style={profileStyle.profileDocumentsLabel}>Паспорт - основная страница, прописка, ИНН</Text>
                <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={onDocUpLoad}>
                    <Text style={{ marginRight: 10, fontSize: 19 }}>
                       Кликните для загрузки файлов
                    </Text>
                    <Image
                        source={{
                            uri: 'https://img.icons8.com/offices/40/000000/attach.png',
                        }}
                    />
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}


export default ProfileScreen
