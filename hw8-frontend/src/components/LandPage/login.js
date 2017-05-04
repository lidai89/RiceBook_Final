import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { updateText,userlogin, url, Nav2Main } from '../../actions'
const LogIn = ({logIn,nav2main}) => {
	let accountName,password;

	return(
	<div className="col-sm-6 well">
		<div className = "text-center">
			<h2>Login</h2>
		</div>
		<form  onSubmit= {(e) => {
			e.preventDefault();
			logIn(accountName.value,password.value);
		}}>
		<div className="form-group row">
			<label htmlFor="example-text-input" className="col-xs-4 col-form-label">User Name</label>
			<div className="col-xs-8">
				<input className="form-control" type="text" name="account name" ref={(node) => { accountName = node }} required/>
			</div>
		</div>
		<div className="form-group row">
			<label  className="col-xs-4 col-form-label">Password</label>
			<div className="col-xs-8">
				<input className="form-control" type="password" name="password" placeholder="Password" id="password" ref={(node) => { password = node }} required/>
			</div>
		</div>
		<input type="hidden" name="timestamp" id="timestamp"/>
		<div className = "col-xs-8 col-md-offset-4">
			<input type="submit" className="btn btn-primary" value="Submit"/>
			<input type="button" className="btn btn-primary" value="Clear" onClick={()=>{
				accountName.value=''
				password.value=''
			}}/>
		</div>
		</form>
		<input type="button" className='btn btn-warning' value="Facebook Login" 
		onClick={()=>{window.location=url+'/login/facebook' } }/>
		
		</div>
		)}

	export default connect(null,
    (dispatch) => {
        return {
            logIn:  (name,pw)     => dispatch(userlogin(name,pw))  ,
			nav2main:()=>dispatch(Nav2Main())
        }
    }
    )(LogIn)