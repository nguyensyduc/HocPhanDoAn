import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import LoginScreen from "./Login";
import HomeScreen from "./Home";
import OptionHome from './OptionHome'
import InforUserScreen from "../Screens/InforUser";
import { View, Text, TouchableOpacity } from "react-native";
import RegisterScreen from "../Screens/Register/Register";
import DetailJobs from "../Screens/DetailJobs";
import { useSelector } from "react-redux";
import LinearGradient from "react-native-linear-gradient";
import DetailJobsUserScreen from "../Screens/DetailJobsUser";
const Stack = createNativeStackNavigator();
const NavigatorScreen = () => {
    const selector = useSelector((state) => state.user)
    return (
        <Stack.Navigator>
            <Stack.Screen name="OptionHome" component={OptionHome} options={{ headerShown: false }}></Stack.Screen>
            <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }}></Stack.Screen>
            <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{ headerShown: false }}></Stack.Screen>
            <Stack.Screen name="HomeScreen" component={HomeScreen} options={{
                // headerBackVisible: false,
                // title: 'Workflow management',
                // headerTitleStyle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
                // // headerStyle: { backgroundColor: '#A4A243' },
                // headerTitleAlign:'center',
                // gestureEnabled: false,
                header: () =>
                    <LinearGradient style={{ height: 100 }} colors={['#395144', '#4E6C50', '#4E6C50', '#395144']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} >
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff', marginTop: 20 }}>Workflow management</Text>
                        </View>
                    </LinearGradient>
                // headerBackground:()=>{
                //     return(
                //         <LinearGradient colors={['red', 'blue']}></LinearGradient>
                //     )
                // }
            }}></Stack.Screen>
            <Stack.Screen name="DetailJobs" component={DetailJobs} options={{
                headerBackVisible: true,
                headerBackTitle: '',
                headerTintColor: '#fff',
                title: selector.currentJobs,
                headerTitleStyle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
                headerStyle: { backgroundColor: '#605bff' },
                headerTitleAlign: 'center'
            }}></Stack.Screen>
            <Stack.Screen name="InforUserScreen" component={InforUserScreen} options={{ headerShown: false }}></Stack.Screen>
            <Stack.Screen name="DetailJobsUserScreen" component={DetailJobsUserScreen} options={{
                headerBackVisible: true,
                headerBackTitle: '',
                headerTintColor: '#fff',
                title: selector.currentUser.username,
                headerTitleStyle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
                headerStyle: { backgroundColor: '#605bff' },
                headerTitleAlign: 'center'
            }}></Stack.Screen>
        </Stack.Navigator >
    )
}
export default NavigatorScreen;