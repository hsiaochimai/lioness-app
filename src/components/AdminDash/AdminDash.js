import React, { Component } from 'react'
import { NavTab } from "react-router-tabs";
import EstimatesPage from '../Projects/EstimatesPage'
import ClientPage from '../Users/ClientPage'
import ActiveProjectsPage from '../Projects/ActiveProjectsPage'
import BilledProjectsPage from '../Projects/BilledProjectsPage'
import ProjectManagerPage from '../Users/ProjectManagerPage'
import ContractorsPage from '../Users/ContractorsPage'
import HomePage from '../Home/HomePage'
import { Route, Switch, Redirect } from 'react-router-dom'
import ds from '../../STORE/dataservice';
import './AdminDash.css'
import LionessContext from '../../LionessContext/LionessContext'

import "react-tabs/style/react-tabs.css";
import { faInfo } from '@fortawesome/free-solid-svg-icons';
const { deleteStoredLoginInfo, getStoredLoginInfo, getUsers } = ds
export default class AdminDash extends Component {
    static contextType = LionessContext
    handleLogout = () => {
        deleteStoredLoginInfo()
        this.props.history.push('/login')
    }

    componentDidMount() {
        ds.loadCurrentUser()
            .then(res => {
                this.context.setCurrentUser(res.data[0])
            }).catch((e) => {
                console.error(e)
                this.handleLogout()
            })
    }

    render() {
        console.log('ctx', this.context)
        const { path } = this.props.match
        let welcome = 'Loading...'
        if (this.context.currentUser) {
            welcome = `Welcome, ${this.context.currentUser.full_name}!`
        }
        return (
            <div>
                <div  className="navBar">
                    <header className='heading padded'>
                        <div className='logo flexed'>
                            <h3>Lioness</h3>
                        </div>
                        <div className='userInfo flexed'>
                            <h4 className='r-spaced'>{
                                welcome
                            }</h4>
                            <button onClick={() => this.handleLogout()}>Log Out</button>
                        </div>
                    </header>
                    <nav className='links'>

                        <NavTab to={`${path}/home`} className='link'>Home</NavTab>
                        <NavTab to={`${path}/estimates`} className='link'>Estimates</NavTab>
                        <NavTab to={`${path}/active-projects`} className='link'>Active Projects</NavTab>
                        <NavTab to={`${path}/billed-projects`} className='link'>Billed Projects</NavTab>
                        <NavTab to={`${path}/clients`} className='link'>Clients</NavTab>
                        <NavTab to={`${path}/project-managers`} className='link'>Project Managers</NavTab>
                        <NavTab to={`${path}/contractors`} className='link'>Contractors</NavTab>
                    </nav>
                    <div className='tabs'>
                        <Switch>
                            <Route
                                exact
                                path={`${path}`}
                                render={() => <Redirect replace to={`${path}/home`} />}
                            />
                            <Route path={`${path}/home`} exact component={HomePage}></Route>
                            <Route path={`${path}/clients`} exact component={ClientPage}></Route>
                            <Route path={`${path}/estimates`} exact component={EstimatesPage}></Route>
                            <Route path={`${path}/active-projects`} exact component={ActiveProjectsPage}></Route>
                            <Route path={`${path}/billed-projects`} exact component={BilledProjectsPage}></Route>
                            <Route path={`${path}/project-managers`} exact component={ProjectManagerPage}></Route>
                            <Route path={`${path}/contractors`} exact component={ContractorsPage}></Route>
                        </Switch>

                    </div>
                </div>
            </div>
        )
    }
}