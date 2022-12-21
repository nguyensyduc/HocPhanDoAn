import React, { useEffect, useRef, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, SafeAreaView, Dimensions, Image, ImageBackground, StyleSheet, Alert, ActivityIndicator, Button } from 'react-native'
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUser, setListUser } from "../Store/userSlice";
import address from "../IPAddress/AddressConfig";
import Carousel from "react-native-snap-carousel";
import TouchID from "react-native-touch-id";
import AsyncStorage from "@react-native-async-storage/async-storage";
const LoginScreen = ({ route, navigation }) => {
    const [account, setAccount] = useState('');
    const [pass, setPass] = useState('');
    const dispatch = useDispatch()
    const [state, setState] = useState(0);
    const [listData, setListData] = useState([]);
    const [loading, setLoading] = useState(false)
    const selector = useSelector((state) => state.user);
    const reff = useRef()
    const changeStatus = route && route.params && route.params.changeStatus ? route.params.changeStatus : null;
    useEffect(() => {
        fetchData();
    }, [
        state, changeStatus
    ])
    const fetchData = async () => {
        setLoading(true)
        const request = await fetch(`${address}account`, {
            method: 'GET',
        })
        const response = await request.json();
        const payload = {listUser: response.data};
        dispatch(setListUser(payload))
        setTimeout(() => {
            setLoading(false)
            setListData(response.data);
            console.log(response.data);
        }, 500);
    }

    const LoginClick = async() => {
        let haveItem = 0;
        let title = '';
        let userInfor = {};
        setState(prev => prev + 1)
        setLoading(true)

        listData.map(item => {
            if (account.toLowerCase().trim() == item.name && pass.toLowerCase().trim() == item.pass) {
                haveItem++;
                title = item.username;
                userInfor = item;
            }
        })
        if (haveItem > 0) {
            navigation.navigate('HomeScreen', { title: title, userInfor: userInfor });
            await AsyncStorage.setItem('account', account)
            await AsyncStorage.setItem('password', pass)
            const payload = {userInfor: userInfor}
            await dispatch(setCurrentUser(payload))
            setAccount('')
            setPass('')
            
        }
        else {
            Alert.alert('Vui lòng kiểm tra lại tại khoản hoặc mật khẩu!')
        }

    }
    const _pressHandler = () => {
        TouchID.authenticate('Touch ID', {
            passcodeFallback: true,
            unifiedErrors: true
        })
            .then(success => {
                alert('Authenticated Successfully');
            })
            .catch(error => {
                console.log('oooooooo ', error.code);
                if (error.code == 'USER_FALLBACK') {
                    alert('Nhap mat khau')
                }
            });
    }
    return (
        <SafeAreaView style={styles.container}>
            {/* <Carousel
            layout="default"
            data={data}
            ref={(c)=> reff.current = c}
            renderItem={({item})=>{
                console.log('item', item);
                return(
                    <View>
                        <Text>{item}</Text>
                    </View>
                )
            }}
            sliderWidth={200}
            // sliderHeight={200}
            itemWidth={50}
            /> */}
            {/* <View>
                <Button
                onPress={()=>{ reff.current.startAutoplay() }}
                title='okeeeee'>

                </Button>
            </View> */}
            <View style={{ padding: 10, borderWidth: 2, width: 120, height: 120, borderRadius: 60, alignSelf: 'center', margin: 20, backgroundColor: '#fff' }}>
                <Image source={require('../assets/icons8-user-90.png')} style={{ width: 100, height: 100, tintColor: '#000' }}></Image>
            </View>
            <View style={styles.ContentView}>
                <TextInput value={account} onChangeText={setAccount} style={[styles.textInputView, styles.textView]} placeholderTextColor={'gray'} placeholder="Tên đăng nhập"></TextInput>
                <TextInput secureTextEntry={true} value={pass} onChangeText={setPass} style={[styles.textInputView, styles.textView]} placeholderTextColor={'gray'} placeholder="Mật khẩu"></TextInput>
                <View style={{flexDirection:'row', alignItems:'center', paddingHorizontal:10, justifyContent:'center'}}>
                    <TouchableOpacity
                        disabled={loading ? true : false}
                        onPress={() => LoginClick()}
                        style={styles.buttonView}>
                        {loading ?
                            <ActivityIndicator color='#fff' size={'small'}></ActivityIndicator>
                            :
                            <Text style={[styles.textView, { color: '#fff', fontWeight: 'bold' }]}>Đăng nhập</Text>
                        }
                    </TouchableOpacity>
                    {/* <TouchableOpacity onPress={() => _pressHandler()}>
                        <Image source={require('../assets/icons8-touch-id-90.png')} style={{ width: 70, height: 70 }}></Image>
                    </TouchableOpacity> */}
                </View>

            </View>
            <TouchableOpacity
                onPress={() => { navigation.navigate('RegisterScreen'); setAccount(''); setPass('') }}
                style={{ alignSelf: 'center', margin: 10, padding: 10 }}>
                <Text style={{ fontStyle: 'italic' }}>Chưa có tài khoản!</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#CDF4FE'
    },
    ContentView: {
        backgroundColor: '#fff',
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
        borderWidth: 1
    },
    buttonView: {
        flex:1,
        padding: 20,
        backgroundColor: '#9F9D08',
        borderRadius: 30,
        borderWidth: 1,
        alignItems: 'center',
        marginHorizontal: 50,
        justifyContent:'center'
    },
    textView: {
        fontSize: 16
    }
})