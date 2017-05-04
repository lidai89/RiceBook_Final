import React from 'react'
import thunkMiddleware from 'redux-thunk'
import fetch from 'isomorphic-fetch'

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


// export const userlogin = (name,password) => {
// if(name=='guest'&&password=='visitor')
// return{type:LOGIN,account:name,pw:password}
// else return{type:ERROR,message:'Invalid Account or Password! Hint:guest, visitor'}
// }

export const userlogout = () => {
return (dispatch)=>{
        resource('PUT','logout')
        .then(dispatch({type:LOGOUT,regmessage:'',message:''}))
        .catch(e=>{console.log(e)});
        
        
    }
}
export const Nav2Prof = () => {
return{type:NAV2PROF}
}
export const Nav2Main = () => {
return{type:NAV2MAIN}
}

export const addarticle = (input)=>{
    let method='POST';
    const payload=new FormData();
    payload.append('text',input.article);
    payload.append('image',input.image)
    return (dispatch)=>{
    //resource('POST', 'article', { author:input.author,text:input.article,date:input.time,comments:[] })
    fetch(`${url}/article`,{
    method,
    credentials: 'include',
    body:payload})
    .then(r=>resource('GET','articles'))
    .then(function(r){
        const articles=r.articles;
        dispatch({type:GETARTICLE,articlelist:articles})
    })
    .catch(e=>{console.log(e);
    })
    }
}
export const register=(account)=>{
    return (dispatch)=>{
        resource('POST','register',account)
        .then(dispatch({type:REGISTER,regmessage:'Register Success! But you cannot log in!'}))
        .catch(e=>{console.log(e)});
        
        
    }
}
export const reporterror=(message)=>{
    return{type:ERROR,message:message}
}
export const unfollow=(id,account)=>{
    {
    return (dispatch)=>{
    resource('DELETE', 'following/'+account, { username:account, following:[id] })
    .then(
    dispatch({
        type:UNFOLLOW,
        id:id
    }))
    .catch(e=>{console.log(e);
    })
}
}
}
export const addfollower=(id,account)=>{
    //console.log(account)
    return (dispatch)=>{ resource('PUT', 'following/'+id, { username:'', following:[id] })
    .then(r=>resource('GET', 'avatars/'+id)
        .then(r=>{
            const user = r.avatars[0]
            resource('GET', 'headlines/'+id)
            .then(r=>{
            const headline=r.headlines[0]
            dispatch({type:GETFOLLOWER,userid:id,avatar:user.avatar,headline:headline.headline})})
        .catch(e=>{console.log(e);
        dispatch({type:ERROR,message:'invalid follower'})})}
    ))
    .then(r=>resource('GET', 'articles').then(r=>{
        const articles=r.articles;
        dispatch({type:GETARTICLE,articlelist:articles})
    }))
    .catch(e=>{console.log(e);
        dispatch({type:ERROR,message:'invalid follower'})})
    }
}
export const updateHeadline=(hl)=>{
   
    return (dispatch)=>{
    resource('PUT', 'headline', { username:'', headline:hl })
    .then(
    dispatch({
        type:UPDATE_TEXT,
        text:hl }))
    .catch(e=>{console.log(e);
    })
    }
    }
    

export const updateprofile=(input,pw)=>{
    let avatar=input.avatar;
    let method='PUT'
    const payload=new FormData();
    payload.append('image',avatar)
    console.log(input.dob)
    if(pw=='')
    {return (dispatch)=>{
        resource('PUT','email',{email:input.email})
        .then(r=>{resource('PUT','zipcode',{zipcode:input.zipcode})})
        .then(r=>{
            fetch(`${url}/avatar`,{
            method,
            credentials: 'include',
            body:payload})
            .then(r=>{resource('GET','avatars')
                .then((response)=>{
                    dispatch(getProfile())})})
        })
        .catch(e=>{dispatch({
            type:ERROR,message:'Update Failed'
        })})
        }
    }
    else{
        return(dispatch)=>{
        resource('PUT','password',{password:pw})
        .then(dispatch({
            type:ERROR,message:'The Server Do Not Support This Action!'
        }))
    }
    }
}



//export const url = 'http://localhost:3000'
export const url = 'https://lidai-ricebook-final.herokuapp.com'

export const resource=(method, endpoint, payload, isJson = true)=>{
    const options =  {
        method,
        credentials: 'include',
    }
    //console.log(method)
    //console.log(endpoint)
    if(isJson) options.headers = {'Content-Type': 'application/json'}

    if (payload) options.body = isJson ? JSON.stringify(payload) : payload

    return fetch(`${url}/${endpoint}`, options)
    .then(response => {
        if (response.status === 200) {
            if (response.headers.get('Content-Type').indexOf('json') > 0) {
                return response.json()
            }else {
                return response.text()
            }
        } else {
            // useful for debugging, but remove in production
            //console.error(`${method} ${endpoint} ${response.statusText}`)
            throw new Error(response.statusText)
        }
    }).catch(error=>{
    })
}

export const updatearticle=(id,input)=>{
    return (dispatch)=>{
        
        resource('PUT','articles/'+id,{text:input})
        .then(r=>resource('GET','articles'))
        .then(function(r){
        const articles=r.articles;
        dispatch({type:GETARTICLE,articlelist:articles})})
        
    }

}

export const updateComment=(text,id,article_id)=>{
    return (dispatch)=>{
        resource('PUT','articles/'+article_id,{text:text,commentId:id})
        .then(r=>resource('GET','articles'))
        .then(function(r){
        const articles=r.articles;
        dispatch({type:GETARTICLE,articlelist:articles})
    })
    }
}

export const userlogin = (username,password) => {
  let status;
  const box = document.querySelector("#message")
  return (dispatch)=>{ resource('POST', 'login', { username:username, password:password })
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
                    username:username,password:password,avatar:avatar},message:''})})
            })
        })})
    .catch(r => {
    status=false;
    dispatch({type:ERROR,message:'Login Denied!   Please use username "dl37" and password "needs-poetry-cake"'})})
  }    
}

const updatefolloweravatar= (following)=>{
    return following.forEach(item=>{
       return (dispatch)=>{ resource('GET', 'avatars/'+item)
        .then(r=>{
            const user = r.avatars[0]
            dispatch({type:GETFOLLOWER,userid:item,avatar:user.avatar})})
    }})
}

export const filterarticle= (keyword)=>{
    return {type:FILTERARTICLE,keyword:keyword}
}

export function getProfile(){
	return (dispatch) => {
		return Promise.all([
			getProfileAvatars()(dispatch),
			getProfileEmail()(dispatch),
			getProfileZipcode()(dispatch)
		])
	}
}
function getProfileAvatars(){
	return (dispatch) => {
		return resource('GET','avatars')
		.then((response)=>{
			dispatch({type:UPDATE_PROFILE, avatar: response.avatars[0].avatar});
		})
	}
}

function getProfileEmail(){
	return (dispatch) => {
		return resource('GET','email')
		.then((response)=>{
			dispatch({type:UPDATE_PROFILE, email: response.email});
		})
	}
}

function getProfileZipcode(){
	return (dispatch) => {
		return resource('GET','zipcode')
		.then((response)=>{
        console.log(response.zipcode)
			dispatch({type:UPDATE_PROFILE, zipcode: response.zipcode});
		})
	}
}

function getProfileDob(){
	return (dispatch) => {
		return resource('GET','dob')
		.then((response)=>{
			dispatch({type:UPDATE_PROFILE, dob: new Date(response.dob).toDateString()});
		})
	}
}

export function getProfileHeadline(user){
	return (dispatch) => {
		resource('GET',`headlines/${user}`)
		.then((response)=>{
			dispatch({type:UPDATE_PROFILE, headline: response.headlines[0].headline});
		})
	}
}