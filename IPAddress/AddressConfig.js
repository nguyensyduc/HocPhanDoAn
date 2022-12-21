import { Platform } from "react-native";
const host = Platform.OS == 'ios' ? 'localhost' : '192.168.0.101';
// const host = '127.0.0.1';
const address = `http://${host}:3001/api/v1/`
export default address;