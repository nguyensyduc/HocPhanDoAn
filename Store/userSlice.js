import {createSlice} from '@reduxjs/toolkit'
const userSlice = createSlice({
    name: 'userInfor',
    initialState:{
        account: '',
        pass: '',
        title: '',
        currentJobs:'',
        idJobs: '',
        userInfor: {},
        listJob: [],
        listText: [],
        listUser: [],
        currentUser: {}
    },
    reducers:{
        setCurrentUser:(state, action)=>{
            state.userInfor = action.payload.userInfor
            // state.title = action.payload.title
        },
        setCurrentListJob:(state, action)=>{
            state.listJob = action.payload.listJob
        },
        setCurrentJobs:(state, action)=>{
            state.currentJobs = action.payload.currentJobs
            state.idJobs = action.payload.idJobs
        },
        setCurrentComment:(state, action)=>{
            state.listText = action.payload.listText
        },
        setListUser:(state, action) =>{
            state.listUser = action.payload.listUser
        },
        setCurrentUserDetail: (state, action)=>{
            state.currentUser = action.payload.currentUser
        }
    }
})
export default userSlice.reducer;
export const {setCurrentUser, setCurrentListJob, setCurrentJobs, setCurrentComment, setListUser, setCurrentUserDetail} = userSlice.actions;