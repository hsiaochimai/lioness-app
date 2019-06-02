import React, {Component} from 'react';
import NavBar from '../Nav/Nav';
import Project from './Project'
import ProjectSearchBar from './ProjectSearchBar'
import ds from '../../STORE/dataservice';
import DataLoader from '../DataLoader/DataLoader'
import LionessContext from '../../LionessContext/LionessContext'
import BackButton from '../BackButton/BackButton'
const {getUsers, getProjects, handleFetchError }  =ds
export default class BilledProjectsPage extends Component{
    static contextType= LionessContext;
    render(){
        const opts= {statusFilter: 'billed'}
        return(
            <div>
                <DataLoader 
                onReject = {handleFetchError}
                promise={getProjects(opts)} 
                onDataLoaded={this.context.setProjects}/>
                <DataLoader 
                promise={getUsers()} 
                onReject = {handleFetchError}
                onDataLoaded={this.context.setUsers}/>
                <NavBar />
                <h2>Billed Projects</h2>
                <BackButton history={this.props.history}/>
                <ProjectSearchBar status={opts.statusFilter}/>
                <Project />
            </div>
        )
    }
}