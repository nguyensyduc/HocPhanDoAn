import { Platform } from "react-native";
const host = Platform.OS == 'ios' ? 'localhost' : '192.168.0.104';
const address = `http://${host}:3000/api/v1/`
export default address;