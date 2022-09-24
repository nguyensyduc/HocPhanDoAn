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
const Stack = createNativeStackNavigator();
const NavigatorScreen = () => {
    const selector = useSelector((state)=>state.user)
    return (
        <Stack.Navigator>
            <Stack.Screen name="OptionHome" component={OptionHome} options={{ headerShown: false }}></Stack.Screen>
            <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }}></Stack.Screen>
            <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{ headerShown: false }}></Stack.Screen>
            <Stack.Screen name="HomeScreen" component={HomeScreen} options={{
                headerBackVisible: false,
                title: 'Workflow management',
                headerTitleStyle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
                headerStyle: { backgroundColor: '#A4A243' },
                headerTitleAlign:'center',
                gestureEnabled: false
            }}></Stack.Screen>
            <Stack.Screen name="DetailJobs" component={DetailJobs} options={{
                headerBackVisible: true,
                headerBackTitle:'',
                headerTintColor:'#fff',
                title: selector.currentJobs,
                headerTitleStyle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
                headerStyle: { backgroundColor: '#605bff' },
                headerTitleAlign:'center'
            }}></Stack.Screen>
            <Stack.Screen name="InforUserScreen" component={InforUserScreen} options={{ headerShown: false }}></Stack.Screen>
        </Stack.Navigator>
    )
}
export default NavigatorScreen;