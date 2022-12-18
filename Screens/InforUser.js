import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image, ScrollView } from "react-native";
import { useSelector } from "react-redux";
import { ReactNativeModal } from 'react-native-modal'
const InforUserScreen = ({ navigation, route }) => {
    const UserInfor = route.params.userInfor
    const [showPass, setShowPass] = useState(false);
    const [showMore, setShowMore] = useState(false)
    return (
        <SafeAreaView style={{ flex: 1, paddingHorizontal: 10 }}>
            <TouchableOpacity
                style={{ paddingHorizontal: 10 }}
                onPress={() => navigation.pop()}>
                <Image source={require('../assets/icons8-left-96.png')} style={{ width: 30, height: 30 }}></Image>
            </TouchableOpacity>
            {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, margin: 20, alignSelf: 'center' }}>
                <View style={{ backgroundColor: '#209DBC', alignSelf: 'center', padding: 2, borderRadius: 120 / 2, borderWidth: 2, width: 120, height: 120, alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ backgroundColor: '#fff', alignSelf: 'center', borderRadius: 100 / 2, borderWidth: 2, width: 90, height: 90, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 18, fontWeight: '600', textAlign: 'center' }}>{UserInfor.username}</Text>
                    </View>
                </View>
            </View> */}
            <View style={[styles.horizontalStyle,{paddingHorizontal:20, justifyContent:'center'}]}>
                <Text style={{fontSize:20, marginRight:20, color:'#000'}}>Tài khoản của:</Text>
                <Text style={{fontSize:25, fontWeight:'bold', color:'#000'}}>{UserInfor.username}</Text>
            </View>
            
            <View style={{ flex: 1, backgroundColor: '#5D5C20', padding: 10, paddingTop: 20 }}>
                <View style={{ flex: 1, backgroundColor: '#fff', borderRadius: 20, padding: 20 }}>
                    <ScrollView>
                        <View style={styles.horizontalStyle}>
                            <Text style={{ width: '50%', fontWeight: 'bold', fontSize: 18, color:'#000' }}>Tên tài khoản:</Text>
                            <Text style={{ width: '50%', fontSize: 16, color:'#000' }}>{UserInfor.name}</Text>
                        </View>
                        <View style={styles.horizontalStyle}>
                            <Text style={{ width: '50%', fontWeight: 'bold', fontSize: 18, color:'#000' }}>Mật khẩu: </Text>
                            <View style={[styles.horizontalStyle, { width: '50%' }]}>
                                {showPass ?
                                    <Text style={{ width: '60%', color:'#000' }}>{UserInfor.pass}</Text>
                                    :
                                    <Text style={{ width: '60%', fontWeight: 'bold', color:'#000' }}>******</Text>
                                }
                                {showPass ?
                                    <TouchableOpacity
                                        onPress={() => { setShowPass(false) }}
                                        style={{ width: '40%', alignItems: 'flex-end' }}>
                                        <Image source={require('../assets/icons8-eye-60.png')} style={{ width: 25, height: 25 }}></Image>
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity
                                        onPress={() => { setShowPass(true) }}
                                        style={{ width: '40%', alignItems: 'flex-end' }}>
                                        <Image source={require('../assets/icons8-invisible-60.png')} style={{ width: 25, height: 25 }}></Image>
                                    </TouchableOpacity>
                                }
                            </View>
                        </View>
                        <View style={styles.horizontalStyle}>
                            <Text style={{ width: '50%', fontWeight: 'bold', fontSize: 18, color:'#000' }}>Số điện thoại:</Text>
                            <View style={[styles.horizontalStyle, { width: '50%' }]}>
                                {UserInfor.numberPhone ?
                                    <Text style={{ width: '60%', color:'#000' }}>{UserInfor.numberPhone}</Text>
                                    :
                                    <Text style={{ width: '60%', color:'#000' }}>Chưa có</Text>
                                }
                                <TouchableOpacity
                                    onPress={() => { setShowPass(false) }}
                                    style={{ width: '40%', alignItems: 'flex-end' }}>
                                    <Image source={require('../assets/icons8-edit-64.png')} style={{ width: 25, height: 25 }}></Image>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.horizontalStyle}>
                            <Text style={{ width: '50%', fontWeight: 'bold', fontSize: 18, color:'#000' }}>Email:</Text>
                            <View style={[styles.horizontalStyle, { width: '50%' }]}>
                                {UserInfor.email ?
                                    <Text style={{ width: '60%', color:'#000' }}>{UserInfor.email}</Text>
                                    :
                                    <Text style={{ width: '60%', color:'#000' }}>Chưa có</Text>
                                }
                                <TouchableOpacity
                                    onPress={() => { setShowPass(false) }}
                                    style={{ width: '40%', alignItems: 'flex-end' }}>
                                    <Image source={require('../assets/icons8-edit-64.png')} style={{ width: 25, height: 25 }}></Image>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <TouchableOpacity
                            onPress={() => setShowMore(!showMore)}
                            style={[styles.horizontalStyle, { marginVertical: 0 }]}>
                            <View style={{ flex: 1, backgroundColor: '#000', height: 2 }}></View>
                            {showMore
                                ?
                                <Image source={require('../assets/icons8-up-squared-50.png')} style={{ width: '10%', height: 30 }}></Image>
                                :
                                <Image source={require('../assets/icons8-drop-down-50.png')} style={{ width: '10%', height: 30 }}></Image>
                            }
                            <View style={{ flex: 1, backgroundColor: '#000', height: 2 }}></View>
                        </TouchableOpacity>
                        {   showMore ?
                            <View>
                                <View style={styles.buttonOptions}>
                                    <Text style={{ fontSize: 15, color:'#000' }}>Đổi mật khẩu</Text>
                                </View>
                                <View style={styles.buttonOptions}>
                                    <Text style={{ fontSize: 15, color:'#000' }}>Chuyển tài khoản</Text>
                                </View>
                                <View style={styles.buttonOptions}>
                                    <Text style={{ fontSize: 15, color:'#000' }}>Đăng xuất</Text>
                                </View>
                            </View>
                            :
                            <Text style={{ textAlign: 'center', color:'#000' }}>Cài đặt</Text>
                        }
                    </ScrollView>
                </View>
            </View>
        </SafeAreaView>
    )
}
export default InforUserScreen;

const styles = StyleSheet.create({
    buttonOptions: {
        padding: 10,
        alignSelf: 'stretch',
        borderRadius: 50,
        borderWidth: 2,
        marginVertical: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    horizontalStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10
    }
})