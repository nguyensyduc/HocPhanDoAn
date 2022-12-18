import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Dimensions, Alert, Image, LogBox, ScrollView, Modal } from "react-native";
import ReactNativeModal from "react-native-modal";
import Swiper from "react-native-swiper";
import address from "../IPAddress/AddressConfig";
import DatePicker from "react-native-date-picker";
import moment from "moment";
import { showMessage } from "react-native-flash-message";
import Carousel from "react-native-snap-carousel";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentComment } from "../Store/userSlice";
const DetailJobsUserScreen = ({ navigation, route }) => {
    const selector = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const [sliceCurrent, setSliceCurrent] = useState(0);
    const [listDataJobsPlan, setListDataJobsPlan] = useState([]);
    const [listDataJobsDoing, setListDataJobsDoing] = useState([]);
    const [listDataJobsDone, setListDataJobsDone] = useState([]);
    const inforJob = route.params.inforJob;
    const [showModalAdd, setShowModalAdd] = useState(false)
    const [currentStatus, setCurrentStatus] = useState('')
    const [CurrentId, setCurrentId] = useState({});
    const [seeMoreJob, setSeeMoreJob] = useState(false);
    const [showOptionSeeMore, setShowOptionSeeMore] = useState(false)
    const [showModalChange, setShowModalChange] = useState(false)
    const [loadingAdd, setLoadingAdd] = useState(false);
    const [loading, setLoading] = useState(true);
    const userItem = route.params.itemUser;
    const [nameJob, setNameJob] = useState('')
    const [dateStart, setDateStart] = useState(new Date())
    const [dateEnd, setDateEnd] = useState(new Date())
    const [showModalStart, setShowModalStart] = useState(false)
    const [showModalEnd, setShowModalEnd] = useState(false)
    const [countStart, setCountStart] = useState(0)
    const [countEnd, setCountEnd] = useState(0)
    const [successAdd, setSuccessAdd] = useState(0)
    const [seeTime, setSeeTime] = useState({})
    const [showInvite, setShowInvite] = useState(false)
    const [textComment, setTextComment] = useState('');
    const [loadingText, setLoadingText] = useState(false)
    useEffect(() => {
        getDataPlan()
        getComment()
        console.log('idJobssssssss ', selector.userInfor);
    }, [successAdd])

    const getDataPlan = async () => {
        const request = await fetch(`${address}detailjobs`, {
            method: 'GET'
        })
        const res = await request.json();
        let listJobsPlan = []
        res.data.forEach((job) => {
            if (job.idJob == inforJob.idJobs && job.status == 'plan') {
                listJobsPlan.push(job);
            }
        })
        setListDataJobsPlan(listJobsPlan)
        setLoading(true)
        setTimeout(() => {
            setListDataJobsPlan(listJobsPlan)
            setLoading(false)
        }, 1);

        let listJobsDoing = []
        res.data.forEach((job) => {
            if (job.idJob == inforJob.idJobs && job.status == 'doing') {
                listJobsDoing.push(job);
            }
        })
        setLoading(true)
        setTimeout(() => {
            setListDataJobsDoing(listJobsDoing)
            setLoading(false)
        }, 1);
        let listJobsDone = []
        res.data.forEach((job) => {
            if (job.idJob == inforJob.idJobs && job.status == 'done') {
                listJobsDone.push(job);
            }
        })
        setLoading(true)
        setTimeout(() => {
            setListDataJobsDone(listJobsDone)
            setLoading(false)
        }, 1);

    }

    const addPlanJob = async () => {
        if (countEnd == 0 || countStart == 0 || nameJob == '') {
            Alert.alert('Thông báo', 'Không được bỏ trống thông tin')
            return;
        }
        setLoadingAdd(true)
        const body = {
            "nameDetailJob": nameJob.trim(),
            "idJob": inforJob.idJobs,
            "status": currentStatus,
            "startTime": dateStart,
            "endTime": dateEnd,
            "members": selector.userInfor.name == userItem.name ? '' : userItem.name,
            "creater": selector.userInfor.name
        }
        const request = await fetch(`${address}detailjobs/add`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-type': 'application/json'
            }
        })
        const res = await request.json();
        if (res.success) {
            setSuccessAdd(e => e + 1);
            setShowModalAdd(false);
            setCountEnd(0);
            setCountStart(0);
            setNameJob('')
            showMessage({
                message: 'Thêm thành công 1 thẻ công việc',
                type: 'success'
            })
            setLoadingAdd(false)
        }
        console.log('bodyyyyy ', body);

    }

    const PickStartDate = () => {
        if (countEnd > 0 || countStart > 0) {
            if (dateEnd < dateStart) {
                Alert.alert('Thông báo', 'Ngày kết thúc phải lớn hơn ngày bắt đầu')
            }
            else {
                setShowModalStart(false);
                setCountStart(e => e + 1);
            }
        }
        else {
            setShowModalStart(false);
            setCountStart(e => e + 1);
        }

    }
    const PickEndDate = () => {
        loadingText(true)
        if (countEnd > 0 || countStart > 0) {
            if (dateEnd < dateStart) {
                Alert.alert('Thông báo', 'Ngày kết thúc phải lớn hơn ngày bắt đầu')
            }
            else {
                setShowModalEnd(false);
                setCountEnd(e => e + 1);
            }
        } else {
            setShowModalEnd(false);
            setCountEnd(e => e + 1);
        }
    }

    const doneJobs = async (key) => {
        LogBox.ignoreAllLogs()
        const body = {
            "status": key
        };
        const request = await fetch(`${address}detailjobs/edit/${CurrentId.idDetailJob}`, {
            method: 'PUT',
            body: JSON.stringify(body),
            headers: {
                'Content-type': 'application/json'
            }
        })
        const res = await request.json();
        console.log('resssss ', res);
        if (res.success) {
            setSuccessAdd(e => e + 1);
            setShowOptionSeeMore(false)
            setShowModalChange(false)
            setSeeMoreJob(false)
        }
    }

    const getComment = async () => {
        // setLoadingText(true)
        const request = await fetch(`${address}comment`, {
            method: 'GET'
        })
        const res = await request.json();
        let _listComment = [];
        for (let item = res.data.length - 1; item > 0; item--) {
            _listComment?.push(res.data[item])
        }
        setTimeout(() => {
            const payload = { listText: _listComment }
            // setListComment(_listComment)
            dispatch(setCurrentComment(payload));
            // setLoadingText(false)
        }, 10);
    }

    const addComment = async () => {
        setLoadingText(true)
        const body = {
            "message": textComment,
            "idDetailJob": CurrentId.idDetailJob,
            "username": selector.userInfor.name,
            "createTime": new Date()
        }
        const request = await fetch(`${address}comment/add`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-type': 'application/json'
            }
        })
        const res = await request.json();
        if (res.data) {
            setTextComment('')
            getComment()
            setLoadingText(false)
        }
    }

    const showOption = () => {
        return (
            <ReactNativeModal
                isVisible={showModalChange}>
                {/* {console.log(CurrentId)} */}
                <View style={{ backgroundColor: '#fff', padding: 15, borderRadius: 10 }}>
                    <TouchableOpacity
                        onPress={() => setShowModalChange(false)}
                        style={{ position: 'absolute', right: 10, top: 5, backgroundColor: 'red', padding: 3, borderRadius: 5, borderWidth: 1 }}>
                        <Image source={require('../assets/icons8-close-100.png')} style={{ width: 20, height: 20 }}></Image>
                    </TouchableOpacity>
                    <View style={{ borderBottomWidth: 2, paddingBottom: 10, marginHorizontal: 50 }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: '#000' }}>Chuyển đổi công việc</Text>
                    </View>
                    {
                        CurrentId.status != 'done' ?
                            <TouchableOpacity
                                onPress={() => doneJobs('done')}
                                style={{ margin: 20, marginBottom: 5, padding: 15, alignItems: 'center', borderRadius: 10, borderWidth: 2, flexDirection: 'row' }}>
                                <Image source={require('../assets/icons8-ok-100.png')} style={{ width: 30, height: 30, tintColor: '#000', marginRight: 10 }}></Image>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#000' }}>Đã hoàn thành</Text>
                            </TouchableOpacity>
                            :
                            <></>
                    }
                    {
                        CurrentId.status != 'doing'
                            ?
                            <TouchableOpacity
                                onPress={() => doneJobs('doing')}
                                style={{ margin: 20, marginBottom: 5, padding: 15, alignItems: 'center', borderRadius: 10, borderWidth: 2, flexDirection: 'row' }}>
                                <Image source={require('../assets/icons8-tools-100.png')} style={{ width: 30, height: 30, tintColor: '#000', marginRight: 10 }}></Image>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#000' }}>Thêm vào mục đang làm</Text>
                            </TouchableOpacity>
                            :
                            <></>
                    }
                    {
                        CurrentId.status != 'plan'
                            ?
                            <TouchableOpacity
                                onPress={() => doneJobs('plan')}
                                style={{ margin: 20, marginBottom: 5, padding: 15, alignItems: 'center', borderRadius: 10, borderWidth: 2, flexDirection: 'row' }}>
                                <Image source={require('../assets/icons8-work-64.png')} style={{ width: 30, height: 30, tintColor: '#000', marginRight: 10 }}></Image>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#000' }}>Thêm vào mục cần làm</Text>
                            </TouchableOpacity>
                            :
                            <></>
                    }
                    {/* <TouchableOpacity
                        style={{ margin: 20, marginBottom: 5, padding: 15, alignItems: 'center', borderRadius: 10, borderWidth: 2, flexDirection: 'row' }}>
                        <Image source={require('../assets/icons8-remove-100.png')} style={{ width: 30, height: 30, tintColor: '#000', marginRight: 10 }}></Image>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#000' }}>Xoá thẻ công việc</Text>
                    </TouchableOpacity> */}
                </View>
            </ReactNativeModal>
        )
    }

    const showAddJob = () => {
        return (
            <ReactNativeModal
                onBackdropPress={() => setShowModalAdd(false)}
                isVisible={showModalAdd} style={{ width: Dimensions.get('window').width, alignSelf: 'center', justifyContent: 'flex-end' }}>
                <View style={{ backgroundColor: 'lightgray', width: Dimensions.get('window').width, bottom: -20 }}>
                    <View style={{ marginBottom: 70, padding: 20, justifyContent: 'center' }}>
                        <Text style={{ textAlign: 'center', fontSize: 20, margin: 10, fontWeight: 'bold', color: 'green' }}>Thêm mới thẻ công việc</Text>
                        <TextInput value={nameJob} onChangeText={(nameJob) => setNameJob(nameJob)} placeholderTextColor='gray' placeholder="Tên thẻ công việc" style={[styles.inputStyle, { borderWidth: 2 }]}></TextInput>
                        <TouchableOpacity
                            onPress={() => { setShowModalStart(true) }}
                            style={[styles.inputStyle, { alignItems: 'center', borderWidth: 2, flexDirection: 'row', justifyContent: 'space-between' }]}>
                            <Text style={{ color: 'gray' }}>  {countStart == 0 ? 'Ngày bắt đầu' : moment(dateStart).format('DD/MM/yyyy')}</Text>
                            <Image source={require('../assets/icons8-calendar-50.png')} style={{ width: 30, height: 30 }}></Image>
                        </TouchableOpacity>
                        <ReactNativeModal
                            isVisible={showModalStart}>
                            <View style={{ marginHorizontal: 5, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', borderRadius: 10, paddingVertical: 10 }}>
                                <DatePicker
                                    locale={'vi'}
                                    date={dateStart}
                                    mode="date"
                                    androidMode="spinner"
                                    confirmBtnText="Chọn"
                                    cancelBtnText="Hủy"
                                    onDateChange={(dateStart) => { setDateStart(dateStart) }}></DatePicker>
                                <View style={{ flexDirection: 'row' }}>
                                    <TouchableOpacity
                                        onPress={() => { setShowModalStart(false) }}
                                        style={[styles.buttonStyle, { borderColor: 'red', marginRight: 20 }]}>
                                        <Text style={{ color: 'red', fontWeight: 'bold', color: '#000' }}>Huỷ</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => PickStartDate()}
                                        style={[styles.buttonStyle, { borderColor: 'green' }]}>
                                        <Text style={{ color: 'green', fontWeight: 'bold', color: '#000' }}>Đồng ý</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </ReactNativeModal>
                        <TouchableOpacity
                            onPress={() => { setShowModalEnd(true) }}
                            style={[styles.inputStyle, { alignItems: 'center', borderWidth: 2, flexDirection: 'row', justifyContent: 'space-between' }]}>
                            <Text style={{ color: 'gray' }}>  {countEnd == 0 ? 'Ngày kết thúc' : moment(dateEnd).format('DD/MM/yyyy')}</Text>
                            <Image source={require('../assets/icons8-calendar-50.png')} style={{ width: 30, height: 30 }}></Image>
                        </TouchableOpacity>
                        <ReactNativeModal
                            isVisible={showModalEnd}>
                            <View style={{ marginHorizontal: 5, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', borderRadius: 10, paddingVertical: 10 }}>
                                <DatePicker
                                    locale={'vi'}
                                    date={dateEnd}
                                    mode="date"
                                    androidMode="spinner"
                                    confirmBtnText="Chọn"
                                    cancelBtnText="Hủy"
                                    onDateChange={(dateEnd) => { setDateEnd(dateEnd) }}></DatePicker>
                                <View style={{ flexDirection: 'row' }}>
                                    <TouchableOpacity
                                        onPress={() => { setShowModalEnd(false) }}
                                        style={[styles.buttonStyle, { borderColor: 'red', marginRight: 20 }]}>
                                        <Text style={{ color: 'red', fontWeight: 'bold' }}>Huỷ</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => PickEndDate()}
                                        style={[styles.buttonStyle, { borderColor: 'green' }]}>
                                        <Text style={{ color: 'green', fontWeight: 'bold' }}>Đồng ý</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </ReactNativeModal>
                        <TouchableOpacity
                            disabled={loadingAdd ? true : false}
                            onPress={() => addPlanJob()}
                            style={[styles.buttonStyle, { alignSelf: 'center', marginTop: 15, borderColor: 'green' }]}>
                            {loadingAdd ?
                                <View>
                                    <ActivityIndicator size='small' color='#405A11'></ActivityIndicator>
                                </View>
                                :
                                <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'green' }}>Thêm mới</Text>
                            }
                        </TouchableOpacity>
                    </View>
                </View>
            </ReactNativeModal>
        )
    }

    const showModalSeeMoreJob = () => {
        return (
            <ReactNativeModal
                style={{ alignItems: 'center', justifyContent: 'flex-end' }}
                isVisible={seeMoreJob}>
                <View style={{ backgroundColor: '#fff', width: Dimensions.get('window').width, bottom: -20, paddingBottom: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity
                                onPress={() => { setSeeMoreJob(false) }}
                                style={{ flexDirection: 'row', alignItems: 'center', marginRight: 20, width: '10%' }}>
                                <Image source={require('../assets/icons8-close-100.png')} style={{ width: 20, height: 20 }}></Image>
                            </TouchableOpacity>
                            <Text style={{ fontSize: 20, fontWeight: '600', width: '75%', color: '#000' }}>{CurrentId.nameDetailJob}</Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => setShowOptionSeeMore(true)}
                            style={{ width: '10%', alignItems: 'center', padding: 5 }}>
                            <Image source={require('../assets/icons8-ellipsis-30.png')} style={{ width: 15, height: 15 }}></Image>
                        </TouchableOpacity>
                    </View>
                    <ReactNativeModal
                        animationIn='fadeInDown'
                        backdropOpacity={0.5}
                        onBackdropPress={() => setShowOptionSeeMore(false)}
                        style={{ width: Dimensions.get('window').width, alignSelf: 'center' }}
                        isVisible={showOptionSeeMore}>
                        <View style={{ backgroundColor: '#fff', padding: 15, borderRadius: 10, marginHorizontal: 10 }}>
                            {
                                CurrentId.status != 'done'
                                    ?
                                    <TouchableOpacity
                                        // onPress={() => doneJobs('done')}
                                        style={{ margin: 20, marginBottom: 5, padding: 15, alignItems: 'center', borderRadius: 10, borderWidth: 2, flexDirection: 'row' }}>
                                        <Image source={require('../assets/icons8-ok-100.png')} style={{ width: 30, height: 30, tintColor: '#000', marginRight: 10 }}></Image>
                                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#000' }}>Đã hoàn thành</Text>
                                    </TouchableOpacity>
                                    :
                                    <></>
                            }
                            {
                                CurrentId.status != 'plan'
                                    ?
                                    <TouchableOpacity
                                        style={{ margin: 20, marginBottom: 5, padding: 15, alignItems: 'center', borderRadius: 10, borderWidth: 2, flexDirection: 'row' }}>
                                        <Image source={require('../assets/icons8-work-64.png')} style={{ width: 30, height: 30, tintColor: '#000', marginRight: 10 }}></Image>
                                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#000' }}>Thêm vào mục cần làm</Text>
                                    </TouchableOpacity>
                                    :
                                    <></>
                            }
                            {
                                CurrentId.status != 'doing'
                                    ?
                                    <TouchableOpacity
                                        // onPress={() => doneJobs('doing')}
                                        style={{ margin: 20, marginBottom: 5, padding: 15, alignItems: 'center', borderRadius: 10, borderWidth: 2, flexDirection: 'row' }}>
                                        <Image source={require('../assets/icons8-tools-100.png')} style={{ width: 30, height: 30, tintColor: '#000', marginRight: 10 }}></Image>
                                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#000' }}>Thêm vào mục đang làm</Text>
                                    </TouchableOpacity>
                                    :
                                    <></>
                            }
                            <TouchableOpacity
                                // onPress={() => deleteJobs()}
                                style={{ margin: 20, marginBottom: 5, padding: 15, alignItems: 'center', borderRadius: 10, borderWidth: 2, flexDirection: 'row' }}>
                                <Image source={require('../assets/icons8-remove-100.png')} style={{ width: 30, height: 30, tintColor: '#000', marginRight: 10 }}></Image>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#000' }}>Xoá thẻ công việc</Text>
                            </TouchableOpacity>
                        </View>
                    </ReactNativeModal>
                    <View style={[styles.seeMoreStyle, { borderBottomWidth: 1, paddingTop: 0, flexDirection: 'row', alignItems: 'center' }]}>
                        {/* <Text style={{fontSize:20, fontWeight:'600'}}>Name detail job</Text> */}
                        <Text style={{ fontSize: 17, width: '50%', color: '#000' }}>{inforJob.name}:</Text>
                        <Text style={{ fontSize: 17, width: '50%', color: 'gray' }}>{CurrentId.status == 'plan'
                            ? 'Những việc cần làm'
                            : (CurrentId.status == 'doing'
                                ? 'Những việc đang làm'
                                : (CurrentId.status == 'done'
                                    ? 'Những việc đã làm xong'
                                    : 'Yêu cầu'
                                ))}
                        </Text>
                    </View>
                    <View style={styles.seeMoreStyle}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                            <Image source={require('../assets/clock.png')} style={{ width: 30, height: 30, marginRight: 10 }}></Image>
                            <Text style={{ fontSize: 16, color: '#000' }}>Bắt đầu: {moment(CurrentId.startTime).format('DD/MM/yyyy')}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image source={require('../assets/clock.png')} style={{ width: 30, height: 30, marginRight: 10 }}></Image>
                            <Text style={{ fontSize: 16, color: '#000' }}>Hết hạn: {moment(CurrentId.endTime).format('DD/MM/yyyy')}</Text>
                        </View>
                    </View>
                    <View style={{ height: 10, backgroundColor: 'lightgray' }}></View>
                    {/* <View style={styles.seeMoreStyle}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={{ fontSize: 16, color: '#000' }}>Tiến độ:</Text>
                            <TouchableOpacity
                                // onPress={() => setShowInvite(true)}
                                style={{ alignItems: 'center', padding: 5 }}>
                                <Text style={{ color: '#2198EC' }}>+ Mời</Text>
                            </TouchableOpacity>
                            <ReactNativeModal
                                animationIn='fadeInDown'
                                backdropOpacity={0.5}
                                // onBackdropPress={() => setShowInvite(false)}
                                style={{ width: Dimensions.get('window').width, alignSelf: 'center' }}
                                isVisible={showInvite}>
                                <View style={{ backgroundColor: '#fff', padding: 15, borderRadius: 10, marginHorizontal: 10 }}>
                                    <View style={{ borderBottomWidth: 2, marginBottom: 20, marginHorizontal: 40 }}>
                                        <Text style={{ fontSize: 20, fontWeight: '600', textAlign: 'center', color: '#000' }}>Mời thành viên</Text>
                                    </View>
                                    <View style={[styles.inputView, styles.horizontalView]}>
                                        <Image
                                            source={require('../assets/search.png')}
                                            style={{ width: 30, height: 30, marginRight: 20 }}></Image>
                                        <TextInput
                                            placeholderTextColor="#696767"
                                            placeholder="Nhập tên..."
                                            style={{ flex: 1, height: 50, fontSize: 20 }}></TextInput>
                                    </View>
                                    <TouchableOpacity style={[styles.buttonStyle, { alignSelf: 'center', marginTop: 10, paddingVertical: 15, backgroundColor: '#209DBC' }]}>
                                        <Text style={{ fontSize: 17, color: '#000' }}>Mời</Text>
                                    </TouchableOpacity>
                                </View>
                            </ReactNativeModal>
                        </View>
                        <Text style={{ fontSize: 16, paddingHorizontal: 10, color: '#000' }}>{inforJob.creater}</Text>
                    </View> */}
                    <View style={{ height: 10, backgroundColor: 'lightgray' }}></View>
                    <View style={[styles.seeMoreStyle, { height: Dimensions.get('window').height * 0.4 }]}>
                        <Text style={{ fontSize: 16, color: '#000' }}>Bình luận:</Text>
                        {/* {loadingText ?
                            <View>
                                <ActivityIndicator size='large' color='#000'></ActivityIndicator>
                            </View>
                            : */}
                        <View>
                            <FlatList
                                data={selector.listText}
                                style={{ paddingBottom: 20 }}
                                // ref={(c) => reff.current = c}
                                inverted={true}
                                renderItem={({ item }) => {
                                    return (
                                        <View>
                                            {item.idDetailJob == CurrentId.idDetailJob
                                                ?
                                                <View>
                                                    <Text style={{ alignSelf: item.username == selector.userInfor.name ? 'flex-end' : 'flex-start', color: '#000' }}>{item.username}</Text>
                                                    <TouchableOpacity
                                                        // onPress={() => seeTimeClick(item.idText)}
                                                        activeOpacity={0.8}
                                                        style={{ backgroundColor: item.username == selector.userInfor.name ? '#209DBC' : 'lightgray', alignSelf: item.username == selector.userInfor.name ? 'flex-end' : 'flex-start', padding: 10, borderRadius: 10, marginTop: 5 }}>
                                                        <Text style={{ color: '#000' }}>{item.message}</Text>
                                                    </TouchableOpacity>
                                                    {
                                                        seeTime[item.idText]
                                                            ?
                                                            <Text style={{ alignSelf: item.username == selector.userInfor.name ? 'flex-end' : 'flex-start', marginTop: 3, fontSize: 12, color: 'gray' }}>
                                                                {console.log('dadsadasda ', moment(item.createTime).format('DD/MM/yyyy') == moment(new Date).format('DD/MM/yyyy'))}
                                                                {
                                                                    moment(item.createTime).format('DD/MM/yyyy') == moment(new Date).format('DD/MM/yyyy')
                                                                        ?
                                                                        moment(item.createTime).format('HH:mm') + ' Hôm nay'
                                                                        :
                                                                        //   item.createTime == new Date  
                                                                        moment(item.createTime).format('HH:mm DD/MM/yyyy')
                                                                }
                                                                {/* {moment(item.createTime.toLocaleString("vi", { timeZone: "Asia/Ho_Chi_Minh" })).format('HH:MM:ss')} */}
                                                            </Text>
                                                            :
                                                            <></>
                                                    }
                                                </View>
                                                :
                                                <></>
                                            }
                                        </View>
                                    )
                                }} />
                        </View>
                        {/* } */}
                    </View>
                    <View style={[styles.seeMoreStyle, { flexDirection: 'row', alignItems: 'center' }]}>
                        <TextInput value={textComment} onChangeText={(textComment) => setTextComment(textComment)} placeholderTextColor='gray' placeholder="Bình luận..." style={[styles.inputStyle, { backgroundColor: 'lightgray', marginHorizontal: 10, flex: 1 }]}></TextInput>
                        {textComment
                            ?
                            (loadingText ?
                                <View>
                                    <ActivityIndicator size='small' color='#000'></ActivityIndicator>
                                </View>
                                :
                                <TouchableOpacity
                                    onPress={() => addComment()}>
                                    <Image source={require('../assets/icons8-send-64.png')} style={{ width: 35, height: 35 }}></Image>
                                </TouchableOpacity>
                            )

                            :
                            <></>
                        }
                    </View>
                </View>
            </ReactNativeModal>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            {showModalSeeMoreJob()}
            <Swiper
                index={sliceCurrent}
                activeDotColor='#209DBC'
                loop={false}
                onIndexChanged={(item) => {
                    setSliceCurrent(item)
                }}>
                <View style={styles.stateJobs}>
                    <View style={{ borderBottomWidth: 2, paddingBottom: 10, marginBottom: 10 }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#000' }}>Những việc cần làm</Text>
                    </View>
                    {loading ?
                        <View>
                            <ActivityIndicator size='large' color='#405A11'></ActivityIndicator>
                        </View>
                        :
                        <FlatList
                            data={listDataJobsPlan}
                            renderItem={({ item }) => {
                                if (item.members) {
                                    if (item.members == selector.currentUser.name) {
                                        return (
                                            <TouchableOpacity
                                                onPress={() => {
                                                    setSeeMoreJob(true); setCurrentId(item);
                                                }}
                                                style={[styles.taskStyle]}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                                                    <Text style={{ fontSize: 16, width: '85%', color: '#000' }}>{item.nameDetailJob}</Text>
                                                    <TouchableOpacity
                                                        onPress={() => { setShowModalChange(true); setCurrentId(item) }}
                                                        // onPress={() => console.log(item.idDetailJob)}
                                                        style={{ width: '10%', alignItems: 'center', padding: 5 }}>
                                                        <Image source={require('../assets/icons8-ellipsis-30.png')} style={{ width: 15, height: 15 }}></Image>
                                                    </TouchableOpacity>
                                                    {showOption()}
                                                </View>
                                                <View style={[styles.timeLineStyle, { backgroundColor: new Date().getTime() > new Date(item.endTime) ? '#FE897C' : '#fff' }]}>
                                                    <Image source={require('../assets/icons8-calendar-50.png')} style={{ width: 20, height: 20, marginRight: 10 }}></Image>
                                                    <Text style={{ fontSize: 12, color: '#000' }}>{moment(item.startTime).format('DD/MM/yyyy')} - {moment(item.endTime).format('DD/MM/yyyy')}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        )
                                    }
                                } else {
                                    if (item.creater == selector.currentUser.name) {
                                        return (
                                            <TouchableOpacity
                                                onPress={() => {
                                                    setSeeMoreJob(true); setCurrentId(item);
                                                }}
                                                style={[styles.taskStyle]}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                                                    <Text style={{ fontSize: 16, width: '85%', color: '#000' }}>{item.nameDetailJob}</Text>
                                                    <TouchableOpacity
                                                        onPress={() => { setShowModalChange(true); setCurrentId(item) }}
                                                        // onPress={() => console.log(item.idDetailJob)}
                                                        style={{ width: '10%', alignItems: 'center', padding: 5 }}>
                                                        <Image source={require('../assets/icons8-ellipsis-30.png')} style={{ width: 15, height: 15 }}></Image>
                                                    </TouchableOpacity>
                                                    {showOption()}
                                                </View>
                                                <View style={[styles.timeLineStyle, { backgroundColor: new Date().getTime() > new Date(item.endTime) ? '#FE897C' : '#fff' }]}>
                                                    <Image source={require('../assets/icons8-calendar-50.png')} style={{ width: 20, height: 20, marginRight: 10 }}></Image>
                                                    <Text style={{ fontSize: 12, color: '#000' }}>{moment(item.startTime).format('DD/MM/yyyy')} - {moment(item.endTime).format('DD/MM/yyyy')}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        )
                                    }
                                }
                            }
                            } />
                    }
                    <TouchableOpacity
                        onPress={() => { setCurrentStatus('plan'); setShowModalAdd(true) }}
                    >
                        {selector.userInfor.name == userItem.name ?
                            <Text style={{ color: '#000' }}>+ Thêm thẻ</Text>
                            :
                            <Text style={{ color: '#000' }}>+ Giao việc</Text>
                        }
                    </TouchableOpacity>
                    {showAddJob()}
                </View>
                <View style={styles.stateJobs}>
                    <View style={{ borderBottomWidth: 2, paddingBottom: 10, marginBottom: 10 }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#000' }}>Những việc đang làm</Text>
                    </View>
                    {loading ?
                        <View>
                            <ActivityIndicator size='large' color='#405A11'></ActivityIndicator>
                        </View>
                        :
                        <FlatList
                            data={listDataJobsDoing}
                            renderItem={({ item }) => {
                                if (item.members) {
                                    if (item.members == selector.currentUser.name) {
                                        return (
                                            <TouchableOpacity
                                                onPress={() => {
                                                    setSeeMoreJob(true); setCurrentId(item);
                                                }}
                                                style={[styles.taskStyle]}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                                                    <Text style={{ fontSize: 16, width: '85%', color: '#000' }}>{item.nameDetailJob}</Text>
                                                    <TouchableOpacity
                                                        onPress={() => { setShowModalChange(true); setCurrentId(item) }}
                                                        // onPress={() => console.log(item.idDetailJob)}
                                                        style={{ width: '10%', alignItems: 'center', padding: 5 }}>
                                                        <Image source={require('../assets/icons8-ellipsis-30.png')} style={{ width: 15, height: 15 }}></Image>
                                                    </TouchableOpacity>
                                                    {showOption()}
                                                </View>
                                                <View style={[styles.timeLineStyle, { backgroundColor: new Date().getTime() > new Date(item.endTime) ? '#FE897C' : '#fff' }]}>
                                                    <Image source={require('../assets/icons8-calendar-50.png')} style={{ width: 20, height: 20, marginRight: 10 }}></Image>
                                                    <Text style={{ fontSize: 12, color: '#000' }}>{moment(item.startTime).format('DD/MM/yyyy')} - {moment(item.endTime).format('DD/MM/yyyy')}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        )
                                    }
                                } else {
                                    if (item.creater == selector.currentUser.name) {
                                        return (
                                            <TouchableOpacity
                                                onPress={() => {
                                                    setSeeMoreJob(true); setCurrentId(item);
                                                }}
                                                style={[styles.taskStyle]}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                                                    <Text style={{ fontSize: 16, width: '85%', color: '#000' }}>{item.nameDetailJob}</Text>
                                                    <TouchableOpacity
                                                        onPress={() => { setShowModalChange(true); setCurrentId(item) }}
                                                        // onPress={() => console.log(item.idDetailJob)}
                                                        style={{ width: '10%', alignItems: 'center', padding: 5 }}>
                                                        <Image source={require('../assets/icons8-ellipsis-30.png')} style={{ width: 15, height: 15 }}></Image>
                                                    </TouchableOpacity>
                                                    {showOption()}
                                                </View>
                                                <View style={[styles.timeLineStyle, { backgroundColor: new Date().getTime() > new Date(item.endTime) ? '#FE897C' : '#fff' }]}>
                                                    <Image source={require('../assets/icons8-calendar-50.png')} style={{ width: 20, height: 20, marginRight: 10 }}></Image>
                                                    <Text style={{ fontSize: 12, color: '#000' }}>{moment(item.startTime).format('DD/MM/yyyy')} - {moment(item.endTime).format('DD/MM/yyyy')}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        )
                                    }
                                }
                            }
                            } />
                    }
                    <TouchableOpacity
                        onPress={() => { setCurrentStatus('doing'); setShowModalAdd(true) }}
                    >
                        {selector.userInfor.name == userItem.name ?
                            <Text style={{ color: '#000' }}>+ Thêm thẻ</Text>
                            :
                            <Text style={{ color: '#000' }}>+ Giao việc</Text>
                        }
                    </TouchableOpacity>
                    {showAddJob()}
                </View>
                <View style={styles.stateJobs}>
                    <View style={{ borderBottomWidth: 2, paddingBottom: 10, marginBottom: 10 }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#000' }}>Xong</Text>
                    </View>
                    {loading ?
                        <View>
                            <ActivityIndicator size='large' color='#405A11'></ActivityIndicator>
                        </View>
                        :
                        <FlatList
                            data={listDataJobsDone}
                            renderItem={({ item }) => {
                                if (item.members) {
                                    if (item.members == selector.currentUser.name) {
                                        return (
                                            <TouchableOpacity
                                                onPress={() => {
                                                    setSeeMoreJob(true); setCurrentId(item);
                                                }}
                                                style={[styles.taskStyle]}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                                                    <Text style={{ fontSize: 16, width: '85%', color: '#000' }}>{item.nameDetailJob}</Text>
                                                    <TouchableOpacity
                                                        onPress={() => { setShowModalChange(true); setCurrentId(item) }}
                                                        // onPress={() => console.log(item.idDetailJob)}
                                                        style={{ width: '10%', alignItems: 'center', padding: 5 }}>
                                                        <Image source={require('../assets/icons8-ellipsis-30.png')} style={{ width: 15, height: 15 }}></Image>
                                                    </TouchableOpacity>
                                                    {showOption()}
                                                </View>
                                                <View style={[styles.timeLineStyle]}>
                                                    <Image source={require('../assets/icons8-calendar-50.png')} style={{ width: 20, height: 20, marginRight: 10 }}></Image>
                                                    <Text style={{ fontSize: 12, color: '#000' }}>{moment(item.startTime).format('DD/MM/yyyy')} - {moment(item.endTime).format('DD/MM/yyyy')}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        )
                                    }
                                } else {
                                    if (item.creater == selector.currentUser.name) {
                                        return (
                                            <TouchableOpacity
                                                onPress={() => {
                                                    setSeeMoreJob(true); setCurrentId(item);
                                                }}
                                                style={[styles.taskStyle]}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                                                    <Text style={{ fontSize: 16, width: '85%', color: '#000' }}>{item.nameDetailJob}</Text>
                                                    <TouchableOpacity
                                                        onPress={() => { setShowModalChange(true); setCurrentId(item) }}
                                                        // onPress={() => console.log(item.idDetailJob)}
                                                        style={{ width: '10%', alignItems: 'center', padding: 5 }}>
                                                        <Image source={require('../assets/icons8-ellipsis-30.png')} style={{ width: 15, height: 15 }}></Image>
                                                    </TouchableOpacity>
                                                    {showOption()}
                                                </View>
                                                <View style={[styles.timeLineStyle]}>
                                                    <Image source={require('../assets/icons8-calendar-50.png')} style={{ width: 20, height: 20, marginRight: 10 }}></Image>
                                                    <Text style={{ fontSize: 12, color: '#000' }}>{moment(item.startTime).format('DD/MM/yyyy')} - {moment(item.endTime).format('DD/MM/yyyy')}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        )
                                    }
                                }
                            }
                            } />
                    }
                </View>
            </Swiper>
            <View style={{ paddingHorizontal: 30, marginBottom: 20 }}>
                <Text style={{ color: 'red', fontStyle: 'italic', marginBottom: 10, fontSize: 15 }}>* Lưu ý:</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 }}>
                    <View style={{ width: 30, height: 30, borderRadius: 30 / 2, backgroundColor: '#FE897C', marginRight: 10 }}></View>
                    <Text style={{ color: '#000' }}>Thẻ quá hạn</Text>
                </View>
            </View>
        </SafeAreaView>
    )
}
export default DetailJobsUserScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e0e5f5'
    },
    stateJobs: {
        marginTop: 50,
        marginHorizontal: 30,
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 5,
        minHeight: 100,
        maxHeight: Dimensions.get('window').height * 0.6,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 10,
        // borderWidth: 0.2,
        shadowOffset: { width: 0, height: 0 },
        // shadowColor: '#000',
        // shadowOpacity: 0.3,
        // shadowRadius: 2,
        // borderWidth: 0.2,
        // shadowOffset: { width: 7, height: 7 },
        elevation: 5
    },
    JobName: {
        backgroundColor: '#eee',
        borderRadius: 5,
        marginTop: 15,
        marginBottom: 10,
        padding: 10,
        borderWidth: 2
    },
    taskStyle: {
        backgroundColor: '#fff',
        borderRadius: 5,
        marginVertical: 5,
        padding: 10,
        borderWidth: 1
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
    timeLineStyle: {
        flexDirection: 'row',
        padding: 5,
        alignItems: 'center',
        borderRadius: 5
    },
    seeMoreStyle: {
        padding: 10
    },
    inputView: {
        backgroundColor: 'lightgray',
        paddingHorizontal: 20,
        margin: 5,
        borderRadius: 10,
        fontSize: 17,
    },
    horizontalView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userStyle: {
        flex: 2,
        backgroundColor: '#fff',
        margin: 5,
        padding: 10,
        borderRadius: 10,

    },
    userJobs: {
        backgroundColor: '#eee',
        borderBottomWidth: 2,
        marginVertical: 10,
        marginHorizontal: 20,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    statusJob: {
        flex: 2,
        paddingVertical: 10,
        alignItems: 'flex-end'
    }
})