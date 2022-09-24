import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, SafeAreaView, Dimensions, Image, StatusBar } from 'react-native'
import NewHomeScreen from "../Screens/NewHome";
import ViewMoreScreen from "../Screens/ViewMore";
import JobScreen from "../Screens/JobScreen";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
const BottomTabs = createBottomTabNavigator();
const windowWidth = Dimensions.get('window').width;
const HomeScreen = ({ route }) => {
    return (
        <BottomTabs.Navigator screenOptions={{ headerShown: false, tabBarStyle: {backgroundColor:'#A4A243', paddingBottom:30, borderTopWidth:0, height:2 } }}>
            <BottomTabs.Screen name="NewHomeScreen" component={NewHomeScreen}
                options={{
                    title: '',
                    tabBarIcon: ({ focused }) => {
                        return (
                            <View style={{ backgroundColor: '#A4A243', width: windowWidth*0.4, alignItems: 'center', paddingBottom: 90 }}>
                                <View style={{width: 50, height: 50, alignItems:'center', justifyContent:'center'}}>
                                    <View style={{ width: 45, height: 45, borderRadius: 25, alignItems: 'center', justifyContent: 'center' }}>
                                        <Image source={require('../assets/icons8-home-90.png')} style={{ width: 35, height: 35, tintColor: focused ? '#383705' : '#fff' }}></Image>
                                    </View>
                                </View>
                            </View>
                        )
                    }
                }}
                initialParams={{ getParams: route.params.userInfor }}></BottomTabs.Screen>
            <BottomTabs.Screen name="JobScreen" component={JobScreen}
                options={{
                    title: '',
                    tabBarIcon: ({focused}) => {
                        return (
                            <View style={{ alignItems: 'center', justifyContent: 'center', width: windowWidth*0.3, paddingBottom:90 }}>
                                <View style={{ position: 'absolute', paddingBottom: 90 }}>
                                    <View style={{ alignSelf: 'center', width: 60, height: 60, borderRadius: 30, backgroundColor: focused ? '#5D5C20' : '#A4A243', alignItems: 'center', justifyContent: 'center', borderWidth: 2, shadowColor:'#000' }}>
                                        <Image source={require('../assets/icons8-business-90.png')} style={{ width: 35, height: 35, tintColor:focused ? '#fff' : '#fff' }}></Image>
                                    </View>
                                </View>
                                <View>
                                    <View style={{ flexDirection: 'row', height: 50, marginBottom: 50 }}>
                                        <Image source={require('../assets/left.png')} style={{ width: windowWidth*0.3/2, height: 50, alignSelf: 'flex-start', tintColor: '#A4A243' }}></Image>
                                        <Image source={require('../assets/right.png')} style={{ width: windowWidth*0.3/2, height: 50, alignSelf: 'flex-start', tintColor: '#A4A243'}}></Image>
                                    </View>
                                </View>
                            </View>
                        )
                    }
                }}
                initialParams={{ getParams: route.params.userInfor }}></BottomTabs.Screen>
            <BottomTabs.Screen name="ViewMoreScreen" component={ViewMoreScreen}
                options={{
                    title: '',
                    tabBarIcon: ({ focused }) => {
                        return (
                            <View style={{ backgroundColor: '#A4A243', width: windowWidth*0.4, alignItems: 'center', paddingBottom: 90 }}>
                                <View style={{width: 50, height: 50, alignItems:'center', justifyContent:'center'}}>
                                    <View style={{ width: 45, height: 45, borderRadius: 25, alignItems: 'center', justifyContent: 'center' }}>
                                        <Image source={require('../assets/icons8-user-90.png')} style={{ width: 40, height: 40, tintColor: focused ? '#383705' : '#fff' }}></Image>
                                    </View>
                                </View>
                            </View>
                        )
                    }
                }}
                initialParams={{ getParams: route.params.userInfor }}></BottomTabs.Screen>
        </BottomTabs.Navigator>
        // <BottomTabs.Navigator screenOptions={{ headerShown: false, tabBarStyle: { height: 70, paddingTop: 25 } }}>
        //     <BottomTabs.Screen name="NewHomeScreen" component={NewHomeScreen}
        //         options={{
        //             title: '',
        //             tabBarIcon: ({ focused }) => {
        //                 return (
        //                     <View style={{ width: windowWidth / 3, alignItems: 'center', justifyContent: 'flex-start', height: 70, borderTopWidth: 10, borderColor: '#209DBC' }}>
        //                         <View >
        //                             <Image source={require('../assets/icons8-home-64.png')} style={{ width: 35, height: 35 }}></Image>
        //                         </View>
        //                     </View>
        //                 )
        //             }
        //         }}
        //         initialParams={{ getParams: route.params.userInfor }}></BottomTabs.Screen>
        //     <BottomTabs.Screen name="JobScreen" component={JobScreen}
        //         options={{
        //             title: '',
        //             tabBarIcon: ({ focused }) => {
        //                 return (
        //                     <View style={{ width: windowWidth / 3, alignItems: 'center', justifyContent: 'flex-start', height: 70, flexDirection: 'row' }}>
        //                         <View style={{ flex: 1, borderTopWidth: 10, borderColor: '#209DBC', height: 70 }}></View>
        //                         <View style={{ alignSelf: 'center', width: 80, height: 80, borderRadius: 40, borderWidth:10, borderColor:'#209DBC', alignItems: 'center', justifyContent: 'center', marginBottom:60 }}>
        //                             <View style={{ alignSelf: 'center', width: 60, height: 60, borderRadius: 30, backgroundColor: focused ? '#D0D704' : '#95E0F3', alignItems: 'center', justifyContent: 'center' }}>
        //                                 <Image source={require('../assets/screen.png')} style={{ width: 40, height: 40 }}></Image>
        //                             </View>
        //                         </View>
        //                         <View style={{ flex: 1, borderTopWidth: 10, borderColor: '#209DBC', height: 70 }}></View>

        //                     </View>
        //                 )
        //             }
        //         }}
        //         initialParams={{ getParams: route.params.userInfor }}></BottomTabs.Screen>
        //     <BottomTabs.Screen name="ViewMoreScreen" component={ViewMoreScreen}
        //         options={{
        //             title: '',
        //             tabBarIcon: ({ focused }) => {
        //                 return (
        //                     <View style={{ width: windowWidth / 3, alignItems: 'center', justifyContent: 'flex-start', height: 70, borderTopWidth: 10, borderColor: '#209DBC' }}>
        //                         <View >
        //                             <Image source={require('../assets/icons8-view-more-100.png')} style={{ width: 35, height: 35 }}></Image>
        //                         </View>
        //                     </View>
        //                 )
        //             }
        //         }}
        //         initialParams={{ getParams: route.params.userInfor }}></BottomTabs.Screen>
        // </BottomTabs.Navigator>
    )
}

export default HomeScreen;