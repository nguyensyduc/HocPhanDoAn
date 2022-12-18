import React, { useState, useEffect } from "react"
import { View, Text, TextInput, TouchableOpacity, FlatList, SafeAreaView, Dimensions, Image, StyleSheet, StatusBar, ScrollView, ActivityIndicator } from 'react-native'
import { useDispatch, useSelector } from "react-redux";
import address from "../IPAddress/AddressConfig";
import ReactNativeModal from "react-native-modal";
import { setCurrentJobs, setListUser } from "../Store/userSlice";
import LinearGradient from "react-native-linear-gradient";
const NewHomeScreen = ({ navigation, route }) => {
    const dispatch = useDispatch();
    const [memberStatus, setMemberStatus] = useState([])
    const [listSearch, setListSearch] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModalAdd, setShowModalAdd] = useState(false)
    const [nameJob, setNameJob] = useState('')
    const [nameSearch, setNameSearch] = useState('')
    const userInfor = route.params.getParams;
    const [successAdd, setSuccessAdd] = useState(0);
    useEffect(() => {
        getData();
        console.log('memeeeeeeee ', memberStatus);
    }, [successAdd])
    useEffect(() => {
        const reload = navigation.addListener('focus', () => {
            getData()
        })
        return reload
    }, [navigation])
    const getData = async () => {
        setLoading(true)
        const request = await fetch(`${address}jobs`, {
            method: 'GET',
        })
        const response = await request.json();
        let listData = [];
        response.data.map(item => {
            if (userInfor.name == item.creater || userInfor.name == item.members) {
                listData.push(item)
            }
        })
        setTimeout(() => {
            setMemberStatus(listData)
            setLoading(false)
        }, 1000)
    }

    const addJob = async () => {
        const body = {
            "name": nameJob.trim(),
            "creater": userInfor.name,
            "members": []
        }
        const request = await fetch(`${address}jobs/add`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-type': 'application/json'
            }
        })
        const res = await request.json();
        if (nameJob == '') {
            Alert.alert('Thông báo', 'Không được bỏ trống thông tin')
        }
        else {
            setSuccessAdd(e => e + 1);
            if (res.success) {
                setShowModalAdd(false);
                setNameJob('')
            }
        }
    }

    const showAddJob = () => {
        return (
            <ReactNativeModal
                onBackdropPress={() => setShowModalAdd(false)}
                isVisible={showModalAdd} style={{ width: Dimensions.get('window').width, alignSelf: 'center', justifyContent: 'flex-end' }}>
                <View style={{ backgroundColor: '#fff', width: Dimensions.get('window').width, bottom: -20 }}>
                    <View style={{ marginBottom: 20, padding: 20, justifyContent: 'center' }}>
                        <Text style={{ textAlign: 'center', fontSize: 20, margin: 10, fontWeight: 'bold', color: 'green' }}>Thêm mới công việc</Text>
                        <TextInput value={nameJob} onChangeText={(nameJob) => setNameJob(nameJob)} placeholderTextColor='gray' placeholder="Tên công việc" style={[styles.inputStyle, { borderWidth: 2 }]}></TextInput>
                        <TouchableOpacity
                            onPress={() => addJob()}
                            style={[styles.buttonStyle, { alignSelf: 'center', marginTop: 15, borderColor: 'green' }]}>
                            <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'green' }}>Thêm mới</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ReactNativeModal>
        )

    }

    const searchData = () => {
        let list = []
        memberStatus.forEach(item => {
            if (item.name.toLowerCase().includes(nameSearch.toLowerCase())) {
                list.push(item)
            }
        })
        setTimeout(() => {
            setListSearch(list)
        }, 10);
    }

    return (
        // <LinearGradient></LinearGradient>
        <View style={{ flex: 1, backgroundColor: '#fff' }} >
            <View style={[styles.inputView, styles.horizontalView]}>
                <Image source={require('../assets/search.png')} style={{ width: 30, height: 30, marginRight: 20 }}></Image>
                <TextInput onKeyPress={() => {
                    searchData();
                    setTimeout(() => {
                        console.log(listSearch)
                    }, 10);
                }} value={nameSearch} onChangeText={(nameSearch) => setNameSearch(nameSearch)} placeholderTextColor="#696767" placeholder="Bảng công việc" style={{ flex: 1, height: 50, fontSize: 20 }}></TextInput>
            </View>
            <Text style={{ fontSize: 22, marginVertical: 20, paddingHorizontal: 5, color: '#000' }}>Các không gian làm việc của bạn</Text>
            <View style={[styles.horizontalView, { justifyContent: 'space-between', borderBottomWidth: 2, padding: 10 }]}>
                <View style={styles.horizontalView}>
                    <Image source={require('../assets/icons8-user-90.png')} style={{ width: 35, height: 35, marginRight: 10 }}></Image>
                    <Text style={{ fontSize: 20, fontWeight: '600', color: '#000' }}>Công việc của {userInfor.username}</Text>
                </View>
                <TouchableOpacity>
                    <Text style={{ fontSize: 17, color: '#000' }}>{"Tất cả"}</Text>
                </TouchableOpacity>
            </View>
            {loading
                ?
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator color='#209DBC' size='large'></ActivityIndicator>
                </View>
                : (
                    memberStatus.toString() ?
                        <FlatList
                            data={nameSearch ? listSearch : memberStatus}
                            style={{ flex: 1 }}
                            renderItem={({ item }) => {
                                return (
                                    <View style={[styles.horizontalView, { justifyContent: 'space-between', borderBottomWidth: 1, borderColor: 'gray', padding: 10, marginHorizontal: 15, marginBottom: (memberStatus.indexOf(item) + 1) == memberStatus.length ? 200 : 0 }]}>
                                        <View style={[styles.horizontalView, { width: '90%' }]}>
                                            <View style={{ width: '20%' }}>
                                                <Image source={require('../assets/icons8-business-90.png')} style={{ width: 30, height: 30, marginRight: 10 }}></Image>
                                            </View>
                                            <Text style={{ fontSize: 15, width: '70%', textAlign: 'justify', color: '#000' }}>{item.name}</Text>
                                        </View>
                                        <TouchableOpacity
                                            style={{ width: '10%' }}
                                            onPress={() => {
                                                const payload = { currentJobs: item?.name, idJobs: item?.idJobs };
                                                dispatch(setCurrentJobs(payload))
                                                navigation.navigate('DetailJobs', { inforJobs: item, userInfor: userInfor })
                                            }}>
                                            <Image source={require('../assets/icons8-more-than-90.png')} style={{ width: 20, height: 20, alignSelf: 'flex-end' }}></Image>
                                        </TouchableOpacity>
                                    </View>
                                )
                            }
                            }
                            keyExtractor={(item) => `${item.idJobs}`} />

                        :
                        <View style={{ flex: 1, alignItems: 'center', marginTop: 50 }}>
                            <Image source={require('../assets/icons8-sad-80.png')} style={{ width: 80, height: 80, marginBottom: 20 }}></Image>
                            <Text style={{ fontSize: 18 }}>Hiện tại chưa có bất kì bảng công việc nào</Text>
                        </View>

                )
            }
            <TouchableOpacity
                onPress={() => setShowModalAdd(true)}
                style={styles.buttonAddStyle}>
                <Text style={{ fontSize: 30, color: '#fff' }}>+</Text>
                {showAddJob()}
            </TouchableOpacity>
        </View>
    )
}
export default NewHomeScreen;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FAE5AF',
        padding: 10,
        marginHorizontal: 20,
        borderRadius: 20,
        borderWidth: 2,
        marginTop: 50,
        marginBottom: 90
    },
    inputView: {
        backgroundColor: 'lightgray',
        paddingHorizontal: 20,
        margin: 5,
        borderRadius: 10,
        fontSize: 17
    },
    horizontalView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    circleView: {
        width: 30,
        height: 30,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: '#BE4C00',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10
    },
    inputStyle: {
        backgroundColor: '#fff',
        height: 50,
        borderRadius: 10,
        paddingHorizontal: 10,
        marginVertical: 10
    },
    buttonStyle: {
        padding: 20,
        width: '35%',
        borderWidth: 2,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonAddStyle: {
        width: 50,
        height: 50,
        borderRadius: 50 / 2,
        backgroundColor: '#4E6C50',
        position: 'absolute',
        alignSelf: 'flex-end',
        bottom: 100,
        right: 20,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#4E6C50',
        shadowOpacity: 0.8,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 0 },
        elevation: 10
    }
})