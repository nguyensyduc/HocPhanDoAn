import {configureStore} from '@reduxjs/toolkit'
import thunk from 'redux-thunk';
import userSlice from './userSlice'
export const store = configureStore({
    reducer:{
        user: userSlice
    }
})
export default store;