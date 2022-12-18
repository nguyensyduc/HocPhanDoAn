import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, SafeAreaView, Dimensions, Image, ImageBackground, StyleSheet, Alert, ActivityIndicator } from 'react-native'
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUser } from "../Store/userSlice";
import address from "../../IPAddress/AddressConfig";
import { useTheme } from "@react-navigation/native";
import axios from "axios";
import { showMessage } from "react-native-flash-message";

const RegisterScreen = ({ route, navigation }) => {
    const [account, setAccount] = useState('');
    const [userName, setUserName] = useState('');
    const [pass, setPass] = useState('');
    const [passAgain, setPassAgain] = useState('');
    const [listData, setListData] = useState([]);
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        fetchData();
    }, [])
    const fetchData = async () => {
        const request = await fetch(`${address}account`, {
            method: 'GET',
        })
        const response = await request.json();
        await setListData(response.data)
    }
    const RegisterClick = async () => {
        let haveItem = 0;
        let lastID = 0;
        if (userName.trim() != '' && account.trim() != '' && pass.trim() != '' && passAgain.trim() != '') {
            if (pass.trim() == passAgain.trim()) {
                listData.map(item => {
                    if (account == item.name) {
                        haveItem++;
                    }
                })
                if (haveItem > 0) {
                    Alert.alert('Tài khoản đã được sử dụng')
                }
                else {
                    const body = JSON.stringify({
                        "name": account.trim(),
                        "pass": pass.trim(),
                        "username": userName.trim()
                    })
                    const request = await fetch(`${address}account/add`, {
                        method: 'POST',
                        body: body,
                        headers: {
                            "Content-Type": "application/json"
                        }
                    })
                    const res = await request.json();
                    if (res.success) {
                        navigation.navigate('LoginScreen', { changeStatus: account.trim() })
                        showMessage({
                            message: 'Đã đăng ký tài khoản thành công',
                            type: 'success'
                        })
                    }
                }
            }
            else {
                Alert.alert('Mật khẩu không trùng khớp')
            }
        }
        else {
            Alert.alert('Vui lòng điền đầy đủ thông tin')
        }

    }
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.ContentView}>
                <TextInput value={userName} onChangeText={setUserName} style={[styles.textInputView, styles.textView]} placeholderTextColor={'gray'} placeholder="Tên người dùng"></TextInput>
                <TextInput value={account} onChangeText={setAccount} style={[styles.textInputView, styles.textView]} placeholderTextColor={'gray'} placeholder="Tên đăng nhập"></TextInput>
                <TextInput secureTextEntry={true} value={pass} onChangeText={setPass} style={[styles.textInputView, styles.textView]} placeholderTextColor={'gray'} placeholder="Mật khẩu"></TextInput>
                <TextInput secureTextEntry={true} value={passAgain} onChangeText={setPassAgain} style={[styles.textInputView, styles.textView]} placeholderTextColor={'gray'} placeholder="Xác nhận mật khẩu"></TextInput>
                <TouchableOpacity
                    onPress={() => RegisterClick()}
                    style={styles.buttonView}>
                    <Text style={[styles.textView, { color: '#fff', fontWeight: 'bold' }]}>Đăng ký</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity
                onPress={() => navigation.navigate('LoginScreen')}
                style={{ alignSelf: 'center', margin: 10 }}>
                <Text style={{ fontStyle: 'italic' }}>Đã có tài khoản!</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

export default RegisterScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    ContentView: {
        backgroundColor: '#FED88E',
        marginHorizontal: 10,
        borderWidth: 2,
        padding: 20,
        borderRadius: 20,
        paddingVertical: 50
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
        alignItems: 'center',
        marginHorizontal: 50
    },
    textView: {
        fontSize: 16
    }
})