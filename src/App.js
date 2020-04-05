import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import 'semantic-ui-css/semantic.min.css'
import { Switch, Route } from 'react-router-dom'
import Header from './components/header'
import Register from './pages/register'
import Settings from './pages/settings'
import Home from './pages/home'
import Session from './pages/sessions'
import Requests from './pages/requests'
import Schedules from './pages/schedules'
import ManageSessions from './pages/manageSessions'
import ManageAllSessions from './pages/manageAllSessions'
import History from './pages/history'
import Profile from './pages/profile'
import Footer from './components/footer'
import Axios from 'axios';
import { API_URL } from './supports/ApiUrl';
import { KeepLogin, ReloadSchedules, ReloadRequests, LoadSessionsToVerify } from './redux/actions'
import { connect } from 'react-redux';


function App(props) {

  const [loading,setloading]=useState(true)

  useEffect(()=>{
    const id=localStorage.getItem('iduser')
    const role=localStorage.getItem('roleuser')
    
    console.log(id)
    if(id&&role){
        Axios.get(`${API_URL}/${role}s/${id}`)
        .then((res)=>{
            if(res){
              props.KeepLogin(id,res.data.username,res.data.role)
              console.log(role)
              
              if(role==='user'||role==='trainer'){
                props.ReloadSchedules(res.data.role,id)
                if(role==='trainer'){
                  props.ReloadRequests(id)
                }
              }else if(role==='admin'){
                console.log('test')
                props.LoadSessionsToVerify()
              }

            }else{
              console.log('jangan kesini')
            }
        }).catch((err)=>{
          console.log(err)
        }).finally(()=>{
          setloading(false)
        })
    }else{
      setloading(false)
    }

    // redux schedule here

  },[])


  return (
    <div>
      <Header/>
      {
        loading?
        <div 
          style={{minHeight:'45vh', transition: 'all .5s ease'}}
        >
          Loading...
        </div>
        :
        <div style={{minHeight:'45vh', transition: 'all .5s ease'}}>
          <Switch>
            <Route path='/' exact component={Home}/>
            <Route path='/register' exact component={Register}/>
            <Route path='/settings' exact component={Settings}/>
            <Route path='/sessions' exact component={Session}/>
            <Route path='/schedules' exact component={Schedules}/>
            <Route path='/requests' exact component={Requests}/>
            <Route path='/manage' exact component={ManageSessions}/>
            <Route path='/manageall' exact component={ManageAllSessions}/>
            <Route path='/history' exact component={History}/>
            <Route path='/profile/:trainerid' exact component={Profile}/>
          </Switch>
        </div>
      }
      <Footer/>
    </div>
  )

  // if(loading){
  //   return <div>Loading...</div>
  // }else{
  //   return (
  //     <div>
  //       <Header/>
  //       <Switch>
  //         <Route path='/' exact component={Home}/>
  //         <Route path='/register' exact component={Register}/>
  //         <Route path='/sessions' exact component={Session}/>
  //         <Route path='/requests' exact component={Request}/>
  //         <Route path='/schedules' exact component={Schedules}/>
  //       </Switch>
  //       <Footer/>
        
  //     </div>
  //   );

  // }

}

export default connect(null,{KeepLogin,ReloadSchedules,ReloadRequests,LoadSessionsToVerify})(App);




// MAIN PROBLEM IS 
// ON PAGE SCHEDULE, AFTER LOGIN, THE PAGE IS SUPPOSED TO LOAD THE SCHEDULES LIST
// BUT IS UNABLE TO DO THAT, BECAUSE AFTER LOGIN IS FINISHED, 
// THERE IS NO TRIGGER TO RELOAD THE SCHEDULES LIST
// SOLUTION
// CHANGE THE REDUX USER TO NOT USING THUNK
// BETTER SOLUTION
// FOUND A WAY TO TRIGGER ACTION AFTER LOGIN
// INSIDE DISPATCH, PUT CALLBACK ACTION TO RELOAD SCHEDULES

