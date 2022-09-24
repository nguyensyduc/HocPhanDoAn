import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useSelector } from "react-redux";
import { ReactNativeModal } from 'react-native-modal'
const ViewMoreScreen = ({ navigation, route }) => {
    const [showLogout, setShowLogout] = useState(false)
    const showModalLogout = () => {
        return (
            <ReactNativeModal
                isVisible={showLogout}>
                <View style={{ backgroundColor: '#fff', paddingVertical: 15, borderRadius: 20, alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ width: 55, height: 55, borderRadius: 55 / 2, backgroundColor: 'red', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: '#fff', fontSize: 30, fontWeight: 'bold' }}>!</Text>
                    </View>
                    <Text style={{ marginVertical: 15, fontSize: 18, fontStyle: 'italic' }}>Bạn có muốn đăng xuất không?</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity
                            onPress={() => setShowLogout(false)}
                            style={[styles.buttonStyle, { borderColor: 'red', marginRight: 20 }]}>
                            <Text style={{ color: 'red', fontWeight: 'bold' }}>Huỷ</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('LoginScreen')}
                            style={[styles.buttonStyle, { borderColor: 'green' }]}>
                            <Text style={{ color: 'green', fontWeight: 'bold' }}>Đồng ý</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </ReactNativeModal>
        )
    }
    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={{backgroundColor:'#fff', padding:15, borderBottomLeftRadius:30, borderBottomRightRadius:30, shadowColor:'#000', shadowRadius:10, shadowOpacity:0.3, shadowOffset:{width:0, height:10}, elevation:5, marginBottom:40}}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('InforUserScreen', { userInfor: route.params.getParams })}
                    style={{ backgroundColor: '#fff', alignSelf: 'center', borderRadius: 120 / 2, borderWidth: 2, width: 110, height: 110, alignItems: 'center', justifyContent: 'center' }}>
                    <Image source={require('../assets/icons8-user-90.png')} style={{ width: 70, height: 70, tintColor: '#000' }}></Image>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                onPress={() => navigation.navigate('InforUserScreen', { userInfor: route.params.getParams })}
                style={styles.buttonOptions}>
                <Text style={styles.textOptions}>Thông tin cá nhân</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.buttonOptions}>
                <Text style={styles.textOptions}>Xoá tài khoản của bạn</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => setShowLogout(true)}
                style={styles.buttonOptions}>
                <Text style={styles.textOptions}>Đăng xuất</Text>
            </TouchableOpacity>
            {showModalLogout()}
        </View >
    )
}
export default ViewMoreScreen;

const styles = StyleSheet.create({
    buttonStyle: {
        padding: 20,
        width: '35%',
        borderWidth: 2,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonOptions: {
        padding: 15,
        marginHorizontal: 30,
        backgroundColor: '#fff',
        alignSelf: 'stretch',
        borderRadius: 10,
        borderWidth: 1,
        marginVertical: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textOptions: {
        fontSize: 18,
        color: '#000',
        fontWeight: 'bold'
    }
})