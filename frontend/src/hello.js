import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { updateText,userlogin } from './actions'
import * as ReactBootstrap from 'react-bootstrap'
import Landpage from './landpage'
import ToDoItem from './todoItem'
import ArticleView from './components/Main/articleview'
import Profile from './components/Profile/profile'
import {updateprof} from './components/LandPage/updateaction'

class Hello extends React.Component {
    constructor(props){
        super(props);
        this.input=''
    }
    componentWillMount() {
        console.log('componentWillMount')
        this.props.login(this.props.location,this.props.username,this.props.password)
    }
render(){
    let Page;
    if(this.props.location=='Landing Page'){
    Page=(
    <div><Landpage text={this.props.text} message={this.props.message}/>
    </div>)}
    else if(this.props.location=='Main'){
    Page=(
        <div><ArticleView/>
        </div>
        )}
    else
    Page=(
        <Profile/>
    )
    return (
            Page)
    }
    }

Hello.propTypes = {
    text: PropTypes.string.isRequired,
   // message: PropTypes.string.isRequired,
  //  update: PropTypes.func.isRequired,
}

export default connect(
    (state) => ({ text: state.text, location:state.location, message: state.message,username:state.profile.username,password:state.profile.passowrd }),
    (dispatch) => {
        return {
            login:  (loc,usr,pw)     => dispatch(updateprof(loc,usr,pw))  
        }
    }
)(Hello)

