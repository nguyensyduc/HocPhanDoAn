import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, SafeAreaView, Dimensions, Image, ImageBackground, StyleSheet, Alert, LogBox, ActivityIndicator } from 'react-native'
import { useDispatch } from "react-redux";
import address from "../IPAddress/AddressConfig";
import { setCurrentUser, setListUser } from "../Store/userSlice";
const OptionHome = ({ route, navigation }) => {
    const [loading, setLoading] = useState(true)
    // const [listData, setListData] = useState([])
    const dispatch = useDispatch()
    useEffect(() => {
        LogBox.ignoreAllLogs()
        fetchData()
    }, [])

    const fetchData = async () => {
        setLoading(true)
        const request = await fetch(`${address}account`, {
            method: 'GET',
        })
        const response = await request.json();
        const payload = { listUser: response.data };
        dispatch(setListUser(payload))
        autoLogin(response.data)
    }

    const autoLogin = async (listData) => {
        console.log('okeeeeeeeee logiinnnn');
        let account = await AsyncStorage.getItem('account');
        let password = await AsyncStorage.getItem('password');
        let haveItem = 0;
        let title = '';
        let userInfor = {};
        setLoading(true)

        listData.map(item => {
            if (account?.toLowerCase().trim() == item.name && password?.toLowerCase().trim() == item.pass) {
                haveItem++;
                title = item.username;
                userInfor = item;
            }
        })
        if (haveItem > 0) {
            navigation.navigate('HomeScreen', { title: title, userInfor: userInfor });
            const payload = { userInfor: userInfor }
            dispatch(setCurrentUser(payload))
            setLoading(false)
        }
        else {
            setLoading(false)
            console.log('nottt auto');

        }
    }
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.container}>
                <Image source={require('../assets/icons8-new-job-48.png')} style={{ width: 110, height: 110, alignSelf: 'center', margin: 15 }}></Image>
                <Text style={styles.titleView}>Workflow management</Text>
                <TouchableOpacity
                    onPress={() => navigation.navigate('LoginScreen')}
                    // onPress={() => _pressHandler()}
                    style={styles.buttonView}>
                    <Text style={styles.textStyle}>Đăng nhập</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => navigation.navigate('RegisterScreen')}
                    style={styles.buttonView}>
                    <Text style={styles.textStyle}>Đăng ký</Text>
                </TouchableOpacity>
            </View>
            {loading &&
                <View style={{ width: "100%", height: "100%", position: 'absolute', backgroundColor: 'gray', opacity: 0.6, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={'blue'} />
                </View>
            }
        </SafeAreaView>
    )
}

export default OptionHome;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    ContentView: {
        backgroundColor: '#FED88E',
        marginHorizontal: 10,
        borderWidth: 2,
        borderTopWidth: 0,
        borderBottomWidth: 0,
        padding: 20
    },
    textInputView: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 20,
        marginBottom: 30,
        borderWidth: 2
    },
    buttonView: {
        padding: 20,
        backgroundColor: '#209DBC',
        borderRadius: 30,
        borderWidth: 2,
        // width: '90%',
        margin: 10,
        marginHorizontal: 20,
        alignItems: 'center'
    },
    titleView: {
        fontSize: 25,
        textAlign: 'center',
        margin: 10,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    textStyle: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold'
    }
})