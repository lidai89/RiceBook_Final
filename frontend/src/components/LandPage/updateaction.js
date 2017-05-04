import React from 'react'
import thunkMiddleware from 'redux-thunk'
import fetch from 'isomorphic-fetch'
import {resource} from '../../actions'
export const UPDATE_TEXT = 'UPDATE_TEXT'
export const UPDATE_PROFILE = 'UPDATE_PROFILE'
export const ERROR = 'ERROR'
export const LOGIN = 'LOGIN'
export const LOGOUT = 'LOGOUT'
export const NAV2PROF = 'NAV2PROF'
export const NAV2MAIN = 'NAV2MAIN'
export const ADD_ARTICLE= 'ADDARTICLE'
export const REGISTER='REGISTER'
export const UNFOLLOW='UNFOLLOW'
export const GETARTICLE='GETARTICLE'
export const GETFOLLOWER='GETFOLLOWER'
export const FILTERARTICLE='FILTERARTICLE'
export const ADDFOLLOW='ADDFOLLOW'
export const NAV_REF='NAV_REF'
export const updateprof = (location,username,password) => {
  let status;
  const box = document.querySelector("#message")
  return (dispatch)=>{ 
      
      resource('GET', 'auth')
      .then(r=>{username=r.username; console.log(r)})
    .then(r => resource('GET', 'avatars'))
     .then(function(r){
       const user = r.avatars[0]
       status=true;
      dispatch({type:LOGIN,account:username,pw:password,avatar:user.avatar})
     })
    .then(r => resource('GET', 'headlines'))
    .then(function(r){
      const user = r.headlines[0]
      status=true;
     dispatch({type:UPDATE_TEXT,text:user.headline})
     
    })
    .then(r=>resource('GET','articles'))
    .then(function(r){
        const articles=r.articles;
        dispatch({type:GETARTICLE,articlelist:articles})
    })
    .then(r=>resource('GET','following'))
    .then(r =>{
       r.following.forEach(item=>{
         resource('GET', 'avatars/'+item)
        .then(r=>{
            const user = r.avatars[0]
            resource('GET', 'headlines/'+item)
            .then(r=>{
            const headline=r.headlines[0]
            dispatch({type:GETFOLLOWER,userid:item,avatar:user.avatar,headline:headline.headline})})}
        )
    })
    })
    .then(r=>resource('GET','email'))
    .then(r=>{const email=r.email
        resource('GET','zipcode')
        .then(r=>{
            const zipcode=r.zipcode;
            resource('GET','dob')
            .then(r=>{
                const dob=r.dob;
                resource('GET', 'avatars').then(
                r=>{
                    const avatar=r.avatars[0].avatar;
                 dispatch({type:UPDATE_PROFILE,newprofile:{email:email,dob:dob,zipcode:zipcode,
                     username:r.avatars[0].username,password:password,avatar:avatar},message:'',account:r.avatars[0].username,avatar:r.avatars[0].avatar})})
                
            })
            .then(dispatch({type:NAV_REF,location:'Main'}))            
        })})
    .catch(r => {
    status=false;
    console.log(r)})
  }    
}