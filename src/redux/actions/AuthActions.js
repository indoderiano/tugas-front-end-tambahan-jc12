import Axios from 'axios'
import {API_URL} from './../../supports/ApiUrl'
import { ReloadSchedules, LoadSessionsToVerify, ReloadRequests } from './SchedulesActions'


export const Login=(username,password)=>{
    return (dispatch)=>{
        dispatch({type:'LOADING'})
        if(username===''){
            dispatch({type: 'LOGIN_FAIL',payload:'Username belum diisi'})
        }else if(password===''){
            dispatch({type:'LOGIN_FAIL',payload:'Password belum diisi'})
        }else{
            Axios.get(`${API_URL}/users?username=${username}&&password=${password}`)
            .then((res)=>{
                if(res.data.length){
                    dispatch({
                        type:'LOGIN_SUCCESS',
                        payload:{
                            id: res.data[0].id,
                            username:username,
                            // password:password,
                            role:res.data[0].role
                        }
                    })
                    dispatch(ReloadSchedules(res.data[0].role,res.data[0].id))
                    localStorage.setItem('iduser',res.data[0].id)
                    localStorage.setItem('roleuser',res.data[0].role)
                }else{
                    // now try search for trainers
                    Axios.get(`${API_URL}/trainers?username=${username}&&password=${password}`)
                    .then((res)=>{
                        if(res.data.length){
                            dispatch({
                                type:'LOGIN_SUCCESS',
                                payload:{
                                    id: res.data[0].id,
                                    username:username,
                                    // password:password,
                                    role:res.data[0].role
                                }
                            })
                            console.log(res.data[0].role+res.data[0].id)
                            // after login, reload data pull from backend
                            dispatch(ReloadSchedules(res.data[0].role,res.data[0].id))
                            dispatch(ReloadRequests(res.data[0].id))


                            localStorage.setItem('iduser',res.data[0].id)
                            localStorage.setItem('roleuser',res.data[0].role)
                        }else{
                            // now try search for admin
                            Axios.get(`${API_URL}/admins?username=${username}&&password=${password}`)
                            .then((res)=>{
                                if(res.data.length){
                                    dispatch({
                                        type:'LOGIN_SUCCESS',
                                        payload:{
                                            id: res.data[0].id,
                                            username:username,
                                            // password:password,
                                            role:res.data[0].role
                                        }
                                    })
                                    console.log(res.data[0].role+res.data[0].id)
                                    dispatch(LoadSessionsToVerify())
                                    localStorage.setItem('iduser',res.data[0].id)
                                    localStorage.setItem('roleuser',res.data[0].role)
                                }else{
                                    // after all username not found
                                    dispatch({type:'LOGIN_FAIL',payload:'Username atau password salah'})
                                }
                            }).catch((err)=>{
                                console.log(err)
                            })
                        }
                    }).catch((err)=>{
                        console.log(err)
                    })
                }
            }).catch((err)=>{
                console.log(err)
            })
        }
    }
}

export const KeepLogin=(id, username, role)=>{
    return {
        type: 'LOGIN_SUCCESS',
        payload:{
            id: id,
            username: username,
            role: role
        }
    }
}

export const Logout=()=>{
    console.log('test logout')
    localStorage.removeItem('iduser')
    localStorage.removeItem('roleuser')
    return {
        type: 'LOGOUT'
    }
}