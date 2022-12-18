import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
  FlatList,
  ActivityIndicator,
  Dimensions,
  Alert,
  ScrollView
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import ReactNativeModal from 'react-native-modal';
import address from '../IPAddress/AddressConfig';
import moment from 'moment';
import { LogBox } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import Carousel from 'react-native-snap-carousel';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentComment } from "../Store/userSlice";
import LinearGradient from 'react-native-linear-gradient';
const JobScreen = ({ navigation, route }) => {
  const [listJobs, setListJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [showModalTableJob, setShowModalTableJob] = useState(false);
  const [showModalStatusJob, setShowModalStatusJob] = useState(false);
  const [dateStart, setDateStart] = useState(new Date());
  const [dateEnd, setDateEnd] = useState(new Date());
  const [showModalStart, setShowModalStart] = useState(false);
  const [showModalEnd, setShowModalEnd] = useState(false);
  const [countStart, setCountStart] = useState(0);
  const [countEnd, setCountEnd] = useState(0);
  const [nameJob, setNameJob] = useState('');
  const [successAdd, setSuccessAdd] = useState(0);
  const [memberStatus, setMemberStatus] = useState([])
  const [selectTable, setSelectTable] = useState(0)
  const [selectStatus, setSelectStatus] = useState(0)
  const [currentJobs, setCurrentJobs] = useState({})
  const [currentStatus, setCurrentStatus] = useState()
  const [CurrentId, setCurrentId] = useState({});
  const [seeMoreJob, setSeeMoreJob] = useState(false);
  const [showOptionSeeMore, setShowOptionSeeMore] = useState(false)
  const [showInvite, setShowInvite] = useState(false)
  const [itemJob, setItemJob] = useState({})
  const [seeTime, setSeeTime] = useState({})
  const [listComment, setListComment] = useState([]);
  const [loadingText, setLoadingText] = useState(false)
  const userInfor = route.params.getParams;
  const reff = useRef()
  const [textComment, setTextComment] = useState('')
  const dispatch = useDispatch();
  const selector = useSelector((state) => state.user)
  useEffect(() => {
    getData();
    getDataJob();
    getComment();
    console.log('userrrr123 ', selector.userInfor);
    LogBox.ignoreAllLogs()
  }, [successAdd]);
  useEffect(() => {
    const RealoadData = navigation.addListener('focus', () => {
      getData();
      getDataJob();
      getComment();
    });
    return RealoadData;
  }, [navigation])

  const dataStatus = ['plan', 'doing', 'done']

  const getData = async () => {
    const request = await fetch(`${address}detailjobs`, {
      method: 'GET',
    });
    const res = await request.json();
    setLoading(true);
    setTimeout(() => {
      setListJobs(res.data);
      setLoading(false);
    }, 1000);
    console.log('ressssssssss', res);
  };
  const getDataJob = async () => {
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
    console.log('hahahah12313 ', listData);
  }
  const getComment = async () => {
    const request = await fetch(`${address}comment`, {
      method: 'GET'
    })
    const res = await request.json();
    let _listComment = [];
    for (let item = res.data.length - 1; item > 0; item--) {
      _listComment.push(res.data[item])
    }
    setTimeout(() => {
      const payload = { listText: _listComment }
      // setListComment(_listComment)
      dispatch(setCurrentComment(payload));
      // setLoadingText(false)
    }, 10);
  }
  const seeTimeClick = (key) => {
    setSeeTime({
      [key]: !seeTime[key]
    })
  }

  const addPlanJob = async () => {
    if (countEnd == 0 || countStart == 0 || nameJob == '') {
      Alert.alert('Thông báo', 'Không được bỏ trống thông tin');
      return;
    }
    setLoadingAdd(true)
    const body = {
      nameDetailJob: nameJob.trim(),
      idJob: currentJobs.idJobs,
      status: currentStatus,
      startTime: dateStart,
      endTime: dateEnd,
      creater: selector.userInfor.name,
      members: ''
    };
    const request = await fetch(`${address}detailjobs/add`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-type': 'application/json',
      },
    });
    const res = await request.json();
    if (res.success) {
      setSuccessAdd(e => e + 1);
      setShowModalAdd(false);
      setCountEnd(0);
      setCountStart(0);
      setNameJob('');
      setCurrentJobs({});
      setCurrentStatus('');
      showMessage({
        message: 'Thêm thành công 1 thẻ công việc',
        type: 'success'
      })
      setLoadingAdd(false)
    }
  };

  const PickStartDate = () => {
    if (countStart > 0 || countEnd > 0) {
      if (dateEnd < dateStart) {
        Alert.alert('Thông báo', 'Ngày kết thúc phải lớn hơn ngày bắt đầu');
      } else {
        setShowModalStart(false);
        setCountStart(e => e + 1);
      }
    } else {
      setShowModalStart(false);
      setCountStart(e => e + 1);
    }
  };
  const PickEndDate = () => {
    if (countEnd > 0 || countStart > 0) {
      if (dateEnd < dateStart) {
        Alert.alert('Thông báo', 'Ngày kết thúc phải lớn hơn ngày bắt đầu');
      } else {
        setShowModalEnd(false);
        setCountEnd(e => e + 1);
      }
    } else {
      setShowModalEnd(false);
      setCountEnd(e => e + 1);
    }
  };

  const showChooseTableJob = () => {
    return (
      <ReactNativeModal
        onBackdropPress={() => { setShowModalTableJob(false); setSelectTable(0) }}
        isVisible={showModalTableJob}
      >
        <View
          style={{ backgroundColor: '#fff', marginBottom: 70, padding: 20, justifyContent: 'center', borderRadius: 10 }}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 20,
              margin: 10,
              fontWeight: 'bold',
              color: 'green',
            }}>
            Chọn bảng công việc
          </Text>
          <TouchableOpacity
            style={[styles.inputView, { padding: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}
            onPress={() => {
              if (selectTable == 0) {
                setSelectTable(e => e + 1)
              }
              else {
                setSelectTable(0)
              }
            }}>
            <Text style={{ width: '80%', color: '#000' }}>{currentJobs.name ? currentJobs.name : 'Yêu cầu'}</Text>
            {
              selectTable
                ?
                <Image source={require('../assets/icons8-up-squared-50.png')} style={{ width: '10%', height: 30 }}></Image>
                :
                <Image source={require('../assets/icons8-drop-down-50.png')} style={{ width: '10%', height: 30 }}></Image>
            }
          </TouchableOpacity>
          {
            selectTable ?
              <FlatList
                style={{ marginHorizontal: 6, backgroundColor: 'green', borderRadius: 10 }}
                data={memberStatus}
                renderItem={({ item }) => {
                  return (
                    <>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => { setCurrentJobs(item); setSelectTable(0) }}
                        style={{ backgroundColor: '#eee', padding: 10, borderWidth: 2, borderRadius: 10, margin: 5 }}>
                        <Text style={{ color: '#000' }}>+ {item.name}</Text>
                      </TouchableOpacity>
                    </>
                  )
                }} />
              :
              <></>
          }
          <TouchableOpacity
            onPress={() => {
              if (!currentJobs.name) {
                Alert.alert('Hãy chọn bảng công việc')
                return
              }
              setShowModalTableJob(false)
              setTimeout(() => {
                setShowModalStatusJob(true)
              }, 500)
            }}
            style={[
              styles.buttonStyle,
              { alignSelf: 'center', marginTop: 15, borderColor: 'green' },
            ]}>
            <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'green' }}>
              Tiếp theo
            </Text>
          </TouchableOpacity>
          {showChooseStatusJob()}
        </View>
      </ReactNativeModal>
    );
  }

  const showChooseStatusJob = () => {
    return (
      <ReactNativeModal
        onBackdropPress={() => { setShowModalStatusJob(false); setSelectStatus(0) }}
        isVisible={showModalStatusJob}
      >
        <View
          style={{ backgroundColor: '#fff', marginBottom: 70, padding: 20, justifyContent: 'center', borderRadius: 10 }}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 20,
              margin: 10,
              fontWeight: 'bold',
              color: 'green',
            }}>
            Chọn trạng thái
          </Text>
          <TouchableOpacity
            style={[styles.inputView, { padding: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}
            onPress={() => {
              if (selectTable == 0) {
                setSelectStatus(e => e + 1)
              }
              else {
                setSelectStatus(0)
              }
            }}>
            <Text style={{ width: '80%', color: '#000' }}>
              {
                (
                  currentStatus == 'plan'
                    ? 'Những việc cần làm'
                    : (currentStatus == 'doing'
                      ? 'Những việc đang làm'
                      : (currentStatus == 'done'
                        ? 'Những việc đã làm xong'
                        : 'Yêu cầu'
                      )))
              }
            </Text>
            {
              selectStatus
                ?
                <Image source={require('../assets/icons8-up-squared-50.png')} style={{ width: '10%', height: 30 }}></Image>
                :
                <Image source={require('../assets/icons8-drop-down-50.png')} style={{ width: '10%', height: 30 }}></Image>
            }
          </TouchableOpacity>
          {
            selectStatus ?
              <FlatList
                style={{ marginHorizontal: 6, backgroundColor: 'green', borderRadius: 10 }}
                data={dataStatus}
                renderItem={({ item }) => {
                  return (
                    <>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => { setCurrentStatus(item); setSelectStatus(0) }}
                        style={{ backgroundColor: '#eee', padding: 10, borderWidth: 2, borderRadius: 10, margin: 5 }}>
                        <Text style={{ color: '#000' }}>+ {item == 'plan' ? 'Những việc cần làm' : (item == 'doing' ? 'Những việc đang làm' : 'Những việc đã làm xong')}</Text>
                      </TouchableOpacity>
                    </>
                  )
                }} />
              :
              <></>
          }
          <TouchableOpacity
            onPress={() => {
              if (!currentStatus) {
                Alert.alert('Hãy chọn trạng thái công việc')
                return
              }
              setShowModalStatusJob(false)
              setTimeout(() => {
                setShowModalAdd(true)
              }, 500)
            }
            }
            style={[
              styles.buttonStyle,
              { alignSelf: 'center', marginTop: 15, borderColor: 'green' },
            ]}>
            <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'green' }}>
              Tiếp theo
            </Text>
          </TouchableOpacity>
        </View>
      </ReactNativeModal>
    );
  }

  const showAddJob = () => {
    return (
      <ReactNativeModal
        onBackdropPress={() => setShowModalAdd(false)}
        isVisible={showModalAdd}
        style={{
          width: Dimensions.get('window').width,
          alignSelf: 'center',
          justifyContent: 'flex-end',
        }}>
        <View
          style={{
            backgroundColor: 'lightgray',
            width: Dimensions.get('window').width,
            bottom: -20,
          }}>
          <View
            style={{ marginBottom: 70, padding: 20, justifyContent: 'center' }}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 20,
                margin: 10,
                fontWeight: 'bold',
                color: 'green',
              }}>
              Thêm mới thẻ công việc
            </Text>
            <TextInput
              value={currentJobs.name}
              placeholderTextColor="gray"
              editable={false}
              style={[styles.inputStyle, { borderWidth: 2 }]}></TextInput>
            <TextInput
              value={currentStatus == 'plan' ? 'Những việc cần làm' : (currentStatus == 'doing' ? 'Những việc đang làm' : 'Những việc đã làm xong')}
              placeholderTextColor="gray"
              editable={false}
              style={[styles.inputStyle, { borderWidth: 2 }]}></TextInput>
            <TextInput
              value={nameJob}
              onChangeText={nameJob => setNameJob(nameJob)}
              placeholderTextColor="gray"
              placeholder="Tên thẻ công việc"
              style={[styles.inputStyle, { borderWidth: 2 }]}></TextInput>
            <TouchableOpacity
              onPress={() => {
                setShowModalStart(true);
              }}
              style={[
                styles.inputStyle,
                {
                  alignItems: 'center',
                  borderWidth: 2,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                },
              ]}>
              <Text style={{ color: 'gray' }}>
                {countStart == 0
                  ? 'Ngày bắt đầu'
                  : moment(dateStart).format('DD/MM/yyyy')}
              </Text>
              <Image
                source={require('../assets/icons8-calendar-50.png')}
                style={{ width: 30, height: 30 }}></Image>
            </TouchableOpacity>
            <ReactNativeModal isVisible={showModalStart}>
              <View
                style={{
                  marginHorizontal: 5,
                  backgroundColor: '#fff',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 10,
                  paddingVertical: 10,

                }}>
                <DatePicker
                  locale={'vi'}
                  date={dateStart}
                  mode="date"
                  androidMode="spinner"
                  confirmBtnText="Chọn"
                  cancelBtnText="Hủy"
                  onDateChange={dateStart => {
                    setDateStart(dateStart);
                  }}></DatePicker>
                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity
                    onPress={() => {
                      setShowModalStart(false);
                    }}
                    style={[
                      styles.buttonStyle,
                      { borderColor: 'red', marginRight: 20 },
                    ]}>
                    <Text style={{ color: 'red', fontWeight: 'bold' }}>Huỷ</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => PickStartDate()}
                    style={[styles.buttonStyle, { borderColor: 'green' }]}>
                    <Text style={{ color: 'green', fontWeight: 'bold' }}>
                      Đồng ý
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ReactNativeModal>
            <TouchableOpacity
              onPress={() => {
                setShowModalEnd(true);
              }}
              style={[
                styles.inputStyle,
                {
                  alignItems: 'center',
                  borderWidth: 2,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                },
              ]}>
              <Text style={{ color: 'gray' }}>
                {' '}
                {countEnd == 0
                  ? 'Ngày kết thúc'
                  : moment(dateEnd).format('DD/MM/yyyy')}
              </Text>
              <Image
                source={require('../assets/icons8-calendar-50.png')}
                style={{ width: 30, height: 30 }}></Image>
            </TouchableOpacity>
            <ReactNativeModal isVisible={showModalEnd}>
              <View
                style={{
                  marginHorizontal: 5,
                  backgroundColor: '#fff',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 10,
                  paddingVertical: 10,
                }}>
                <DatePicker
                  locale={'vi'}
                  date={dateEnd}
                  mode="date"
                  androidMode="spinner"
                  confirmBtnText="Chọn"
                  cancelBtnText="Hủy"
                  onDateChange={dateEnd => {
                    setDateEnd(dateEnd);
                  }}></DatePicker>
                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity
                    onPress={() => {
                      setShowModalEnd(false);
                    }}
                    style={[
                      styles.buttonStyle,
                      { borderColor: 'red', marginRight: 20 },
                    ]}>
                    <Text style={{ color: 'red', fontWeight: 'bold' }}>Huỷ</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => PickEndDate()}
                    style={[styles.buttonStyle, { borderColor: 'green' }]}>
                    <Text style={{ color: 'green', fontWeight: 'bold' }}>
                      Đồng ý
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ReactNativeModal>
            <TouchableOpacity
              disabled={loadingAdd ? true : false}
              onPress={() => addPlanJob()}
              style={[
                styles.buttonStyle,
                { alignSelf: 'center', marginTop: 15, borderColor: 'green' },
              ]}>
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
    );
  };
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
      setShowOptionSeeMore(false)
      setSuccessAdd(e => e + 1);
      setSeeMoreJob(false)
    }
  }

  const deleteJobs = () => {
    LogBox.ignoreAllLogs()
    Alert.alert('Thông báo', 'Bạn có muốn xoá thẻ công việc này không?', [
      {
        text: 'Đồng ý',
        onPress: () => {
          const doDelete = async () => {
            const request = await fetch(`${address}detailjobs/delete/${CurrentId.idDetailJob}`, {
              method: 'DELETE'
            })
            const res = await request.json();
            if (res.success) {
              setSuccessAdd(e => e + 1);
              setShowOptionSeeMore(false)
              setTimeout(() => {
                setSeeMoreJob(false)
              }, 500);
              showMessage({
                message: 'Xoá thành công',
                type: 'success'
              })
            }
          }
          doDelete();
        }
      },
      {
        text: 'Huỷ',
        onPress: () => {

        }
      }
    ])
  }

  const addComment = async () => {
    setLoadingText(true);
    const body = {
      "message": textComment,
      "idDetailJob": CurrentId.idDetailJob,
      "username": userInfor.name,
      "createTime": new Date()
    }
    console.log('ngay ', body);
    const request = await fetch(`${address}comment/add`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-type': 'application/json'
      }
    })
    const res = await request.json();
    if (res.data) {
      setTextComment('');
      getComment();
      setLoadingText(false)
    }
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
                    onPress={() => doneJobs('done')}
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
                    onPress={() => doneJobs('doing')}
                    style={{ margin: 20, marginBottom: 5, padding: 15, alignItems: 'center', borderRadius: 10, borderWidth: 2, flexDirection: 'row' }}>
                    <Image source={require('../assets/icons8-tools-100.png')} style={{ width: 30, height: 30, tintColor: '#000', marginRight: 10 }}></Image>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#000' }}>Thêm vào mục đang làm</Text>
                  </TouchableOpacity>
                  :
                  <></>
              }
              <TouchableOpacity
                onPress={() => deleteJobs()}
                style={{ margin: 20, marginBottom: 5, padding: 15, alignItems: 'center', borderRadius: 10, borderWidth: 2, flexDirection: 'row' }}>
                <Image source={require('../assets/icons8-remove-100.png')} style={{ width: 30, height: 30, tintColor: '#000', marginRight: 10 }}></Image>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#000' }}>Xoá thẻ công việc</Text>
              </TouchableOpacity>
            </View>
          </ReactNativeModal>
          <View style={[styles.seeMoreStyle, { borderBottomWidth: 1, paddingTop: 0, flexDirection: 'row', alignItems: 'center' }]}>
            {/* <Text style={{fontSize:20, fontWeight:'600'}}>Name detail job</Text> */}
            <Text style={{ fontSize: 17, width: '50%', color: '#000' }}>{itemJob.name}:</Text>
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
          <View style={styles.seeMoreStyle}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 16, color: '#000' }}>Thành viên:</Text>
              <TouchableOpacity
                onPress={() => setShowInvite(true)}
                style={{ alignItems: 'center', padding: 5 }}>
                <Text style={{ color: '#2198EC' }}>+ Mời</Text>
              </TouchableOpacity>
              <ReactNativeModal
                animationIn='fadeInDown'
                backdropOpacity={0.5}
                onBackdropPress={() => setShowInvite(false)}
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
            <Text style={{ fontSize: 16, paddingHorizontal: 10, color: '#000' }}>{itemJob.creater}</Text>
          </View>
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
                inverted={true}
                ref={(c) => reff.current = c}
                renderItem={({ item }) => {
                  return (
                    <View>
                      {item.idDetailJob == CurrentId.idDetailJob
                        ?
                        <View>
                          <Text style={{ alignSelf: item.username == userInfor.name ? 'flex-end' : 'flex-start', color: '#000' }}>{item.username}</Text>
                          <TouchableOpacity
                            onPress={() => seeTimeClick(item.idText)}
                            activeOpacity={0.8}
                            style={{ backgroundColor: item.username == userInfor.name ? '#209DBC' : 'lightgray', alignSelf: item.username == userInfor.name ? 'flex-end' : 'flex-start', padding: 10, borderRadius: 10, marginTop: 5 }}>
                            <Text style={{ color: '#000' }}>{item.message}</Text>
                          </TouchableOpacity>
                          {
                            seeTime[item.idText]
                              ?
                              <Text style={{ alignSelf: item.username == userInfor.name ? 'flex-end' : 'flex-start', marginTop: 3, fontSize: 12, color: 'gray' }}>
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
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ backgroundColor: '#fff', borderBottomWidth: 2, paddingBottom: 5 }}>
        <View style={[styles.horizontalView, { paddingHorizontal: 10, marginTop: 10, justifyContent: 'space-between' }]}>
          <Text style={{ fontSize: 20, marginVertical: 10, fontWeight: 'bold', width: '80%', color: '#000' }}>
            Thẻ được sắp xếp theo Bảng
          </Text>
          <TouchableOpacity
            onPress={() => setShowModalTableJob(true)}
            style={styles.buttonAddStyle}>
            <Image source={require('../assets/icons8-insert-table-90.png')} style={{ width: 30, height: 30 }}></Image>
          </TouchableOpacity>
          {showChooseTableJob()}
          {showChooseStatusJob()}
          {showAddJob()}
        </View>
        <View style={[styles.inputView, styles.horizontalView]}>
          <Image
            source={require('../assets/search.png')}
            style={{ width: 30, height: 30, marginRight: 20 }}></Image>
          <TextInput
            placeholderTextColor="#696767"
            placeholder="Thẻ công việc"
            style={{ flex: 1, height: 50, fontSize: 20 }}></TextInput>
        </View>
      </View>
      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color="#209DBC" size="large"></ActivityIndicator>
        </View>
      ) : listJobs.length ? (
        <View style={{ flex: 1 }}>
          {console.log('testlistttttttt ', memberStatus)}
          {memberStatus.length ?
            <Carousel
              data={memberStatus}
              layout='tinder'
              layoutCardOffset={20}
              renderItem={({ item }) => {
                return (
                  <View style={[styles.jobMainStyle, { flex: 1, paddingBottom: (memberStatus.indexOf(item) + 1) == memberStatus.length ? 110 : 20, marginTop: 10 }]}>
                    <View style={{ padding: 10, backgroundColor: 'lightgray', borderRadius: 10 }}>
                      <View style={{ backgroundColor: '#fff', padding: 10, paddingVertical: 5, flexDirection: 'row', alignItems: 'center', borderRadius: 10, borderWidth: 2 }}>
                        <Image source={require('../assets/icons8-business-90.png')} style={{ width: 30, height: 30, marginRight: 10 }}></Image>
                        <Text style={{ flex: 1, fontSize: 20, fontWeight: 'bold', color: '#000' }}>{item.name}</Text>
                      </View>
                    </View>
                    <ScrollView style={{ flex: 1 }}>
                      {showModalSeeMoreJob()}
                      <View style={{ paddingBottom: 150, flex: 1 }}>
                        {
                          listJobs.map(e => {
                            if (e.idJob == item.idJobs && (e.members ? (e.members == selector.userInfor.name) : (e.creater == selector.userInfor.name))) {
                              return (
                                <TouchableOpacity
                                  onPress={() => {
                                    setSeeMoreJob(true); setCurrentId(e); setItemJob(item);
                                    // setTimeout(() => {
                                    //   reff.current._listRef._scrollRef.scrollToEnd(listComment.length)
                                    // }, 100);
                                  }}
                                  style={styles.taskStyle}>
                                  <View style={{ width: '70%' }}>
                                    <Text style={{ marginBottom: 10, color: '#000' }}>{e.nameDetailJob}</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                      <Image source={require('../assets/icons8-calendar-50.png')} style={{ width: 15, height: 15, marginRight: 10 }}></Image>
                                      <Text style={{ fontSize: 12, color: '#000' }}>{moment(e.startTime).format('DD/MM/yyyy')} - {moment(e.endTime).format('DD/MM/yyyy')}</Text>
                                    </View>
                                  </View>
                                  {e.status != 'done' ?
                                    new Date().setHours(0, 0, 0, 0) > new Date(e.endTime).setHours(0, 0, 0, 0) ?
                                      <View style={{ backgroundColor: '#FE897C', width: '25%', padding: 5, paddingVertical: 10, borderRadius: 5, alignItems: 'center' }}>
                                        <Text style={{ fontWeight: '600', color: '#000' }}>Quá hạn</Text>
                                      </View>
                                      :
                                      <></>
                                    :
                                    <View style={{ borderWidth: 1, width: '25%', padding: 5, paddingVertical: 10, borderRadius: 5, alignItems: 'center' }}>
                                      <Text style={{ fontWeight: '600', color: '#000' }}>Xong</Text>
                                    </View>}
                                </TouchableOpacity>
                              );
                            }
                          })
                        }
                      </View>
                    </ScrollView>
                  </View>
                );
              }}
              sliderWidth={Dimensions.get('window').width}
              itemWidth={Dimensions.get('window').width * 0.9} />
            :
            <View style={{ flex: 1, alignItems: 'center', marginTop: 100 }}>
              <Image
                source={require('../assets/icons8-sad-80.png')}
                style={{ width: 80, height: 80, marginBottom: 20 }}></Image>
              <Text style={{ fontSize: 18, color: '#000' }}>
                Hiện tại chưa có bất kì thẻ công việc nào
              </Text>
            </View>
          }
        </View>
      ) : (
        <View style={{ flex: 1, alignItems: 'center', marginTop: 100 }}>
          <Image
            source={require('../assets/icons8-sad-80.png')}
            style={{ width: 80, height: 80, marginBottom: 20 }}></Image>
          <Text style={{ fontSize: 18, color: '#000' }}>
            Hiện tại chưa có bất kì thẻ công việc nào
          </Text>
        </View>
      )}
    </View>
  );
};
export default JobScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FAE5AF',
    padding: 10,
    marginHorizontal: 20,
    borderRadius: 20,
    borderWidth: 2,
    marginTop: 50,
    marginBottom: 90,
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
  circleView: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#BE4C00',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  inputStyle: {
    backgroundColor: '#fff',
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  buttonStyle: {
    padding: 20,
    width: '40%',
    borderWidth: 2,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  jobMainStyle: {
    backgroundColor: '#fff',
    paddingBottom: 20
  },
  taskStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    marginHorizontal: 10,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    minHeight: 70,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10
  },
  buttonAddStyle: {
    padding: 5,
    borderRadius: 15,
    borderWidth: 2,
    backgroundColor: 'lightgray',
    alignItems: 'center',
    justifyContent: 'center',
  },
  seeMoreStyle: {
    padding: 10
  }
});
