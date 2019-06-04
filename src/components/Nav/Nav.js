import React, {Component} from 'react'
import './Nav.css';
import PropTypes from 'prop-types'
import LionessContext from '../../LionessContext/LionessContext';
import ds from '../../STORE/dataservice'
const {deleteCookieLoginInfo} = ds
export default class Navbar extends Component{
    static propTypes= {
        history: PropTypes.object.isRequired,
    }
    static contextType= LionessContext
    constructor(){
        super()
    }
    logoutClick=()=>{
        deleteCookieLoginInfo()
        this.props.history.push('/login')
    }
    render(){
        console.log(`navbar`, this.context)
    return(
        <nav role='navigation' className="navBar">
        <h3>Welcome !</h3>
        <h4>Team Name: </h4>
        <button onClick={()=>this.logoutClick()}>
            Log Out
        </button>
        </nav>
    )
}
}