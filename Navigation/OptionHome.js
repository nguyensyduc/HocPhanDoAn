import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, SafeAreaView, Dimensions, Image, ImageBackground, StyleSheet, Alert } from 'react-native'
const OptionHome = ({ route, navigation }) => {
    return (
        <SafeAreaView style={styles.container}>
            <View>
                <Image source={require('../assets/icons8-new-job-48.png')} style={{width:110, height:110, alignSelf:'center', margin:15}}></Image>
                <Text style={styles.titleView}>Workflow management</Text>
                <TouchableOpacity 
                onPress={()=> navigation.navigate('LoginScreen')}
                style={styles.buttonView}>
                    <Text style={styles.textStyle}>Đăng nhập</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                onPress={()=> navigation.navigate('RegisterScreen')}
                style={styles.buttonView}>
                    <Text style={styles.textStyle}>Đăng ký</Text>
                </TouchableOpacity>

            </View>
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
        margin:10,
        marginHorizontal:20,
        alignItems: 'center'
    },
    titleView: {
        fontSize: 25, 
        textAlign:'center',
        margin:10,
        fontWeight:'bold', 
        marginBottom:20,
    },
    textStyle:{
        fontSize:18,
        color:'#fff',
        fontWeight: 'bold'
    }
})