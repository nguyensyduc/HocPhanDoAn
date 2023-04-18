import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useRef, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, SafeAreaView, Dimensions, Image, ImageBackground, StyleSheet, Alert, LogBox, ActivityIndicator, Animated } from 'react-native'
import nfcManager from "react-native-nfc-manager";
import { useDispatch } from "react-redux";
import address from "../IPAddress/AddressConfig";
import { setCurrentUser, setListUser } from "../Store/userSlice";
const TestAminated = ({ route, navigation }) => {
    const width_anim = Dimensions.get('screen').width / 2 - 50;
    const height_anim = Dimensions.get('screen').height / 2 - 50;
    const pan = useRef(new Animated.ValueXY()).current;
    const borderRa = useRef(new Animated.Value(15)).current
    const loading = useState(false)

    // useEffect(() => {
    //     Animated.loop(
    //         Animated.parallel([
    //             Animated.sequence([
    //                 Animated.spring(borderRa, {
    //                     toValue: 15,
    //                     useNativeDriver: false
    //                 }),
    //                 Animated.spring(borderRa, {
    //                     toValue: 150/2,
    //                     useNativeDriver: false
    //                 }),
    //                 Animated.spring(borderRa, {
    //                     toValue: 15,
    //                     useNativeDriver: false
    //                 }),
    //                 Animated.spring(borderRa, {
    //                     toValue: 150/2,
    //                     useNativeDriver: false
    //                 }),
    //                 Animated.spring(borderRa, {
    //                     toValue: 15,
    //                     useNativeDriver: false
    //                 }),
    //                 Animated.spring(borderRa, {
    //                     toValue: 150/2,
    //                     useNativeDriver: false
    //                 }),
    //                 Animated.spring(borderRa, {
    //                     toValue: 15,
    //                     useNativeDriver: false
    //                 }),
    //                 Animated.spring(borderRa, {
    //                     toValue: 150/2,
    //                     useNativeDriver: false
    //                 }),
    //                 Animated.spring(borderRa, {
    //                     toValue: 15,
    //                     useNativeDriver: false
    //                 }),
    //             ]),
    //             Animated.sequence([
    //                 Animated.spring(pan, {
    //                     toValue: { x: 0, y: 0 },
    //                     useNativeDriver: false
    //                 }),
    //                 Animated.spring(pan, {
    //                     toValue: { x: -width_anim, y: -height_anim },
    //                     useNativeDriver: false
    //                 }),
    //                 Animated.spring(pan, {
    //                     toValue: { x: 0, y: 0 },
    //                     useNativeDriver: false
    //                 }),
    //                 Animated.spring(pan, {
    //                     toValue: { x: -width_anim, y: height_anim },
    //                     useNativeDriver: false
    //                 }),
    //                 Animated.spring(pan, {
    //                     toValue: { x: 0, y: 0 },
    //                     useNativeDriver: false
    //                 }),
    //                 Animated.spring(pan, {
    //                     toValue: { x: width_anim, y: -height_anim },
    //                     useNativeDriver: false
    //                 }),
    //                 Animated.spring(pan, {
    //                     toValue: { x: 0, y: 0 },
    //                     useNativeDriver: false
    //                 }),
    //                 Animated.spring(pan, {
    //                     toValue: { x: width_anim, y: height_anim },
    //                     useNativeDriver: false
    //                 }),
    //                 Animated.spring(pan, {
    //                     toValue: { x: 0, y: 0 },
    //                     useNativeDriver: false
    //                 }),
    //             ])
    //         ])
    //     ).start()
    // }, [])

    // return (
    //     <SafeAreaView style={styles.container}>
    //         <Animated.View style={[pan.getLayout(), styles.ContentView, {borderRadius: borderRa}]}>
    //             <Text style={{fontSize:30, color:'#fff'}}>Siten</Text>
    //         </Animated.View>
    //     </SafeAreaView>
    // )

    const [level, setLevel] = useState({})
    const data = [
        { id: 0 },
        { id: 1 },
        { id: 2 },
        { id: 3 },
    ]
    useEffect(() => {
        const _level = []
        Object.keys(data).map((e) => {
            _level.push(false)
        })
        setLevel(_level)

        // check NCF 
        nfcManager.isSupported() 
            .then(supported => {
                if (supported) {
                    console.log('is support NFC');
                }
                else {
                    console.log('not support NFC');
                }
            })

    }, [])

    const changeButton = (key) => {
        setLevel({
            ...level,
            [key]: !level[key]
        })

        console.log(level[key]);
    }

    return (
        <SafeAreaView style={{alignItems:'center', justifyContent:'center', flex:1}}>
            {/* <TouchableOpacity
                onPress={() => {

                }}
                style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: 'red' }}>
                <View></View>
            </TouchableOpacity> */}
            {/* <FlatList
                data={data}
                renderItem={({ item }) => {
                    // console.log(data, 'hahahah');
                    return (
                        <TouchableOpacity
                            onPress={() => {
                                changeButton(item.id)
                            }}
                            style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: level[item.id] ? 'green' : 'red', marginVertical: 10 }}>
                            <View></View>
                        </TouchableOpacity>
                    )
                }} /> */}
                <Text style={{fontSize:30}}>Check NFC manager</Text>
        </SafeAreaView>
    )
}


export default TestAminated;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    ContentView: {
        width: 150,
        height: 150,
        backgroundColor: '#D463F7',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center'
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