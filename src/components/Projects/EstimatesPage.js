import React, { Component } from 'react';
import Project from './Project'
import ProjectSearchBar from './ProjectSearchBar'
import ds from '../../STORE/dataservice';
import DataLoader from '../DataLoader/DataLoader'

import LionessContext from '../../LionessContext/LionessContext'
const { getUsers, getProjects, handleFetchError, getRoles, getStatuses } = ds
export default class EstimatesPage extends Component {
    static contextType = LionessContext;
    static opts = {
        statusFilter: 'estimate',
    }

    componentDidMount() {

        const dataFetchPromise = Promise.all([
            getProjects(EstimatesPage.opts),
            getUsers(),
            getRoles(),
            getStatuses(),
        ])
        const onDataLoaded = (arr) => {
            console.log('DATA loaded')
            // NOTE order is the same as in the above Promise.all
            const [projects, users, roles, statuses] = arr
            this.context.setProjects(projects)
            this.context.setUsers(users)
            this.context.setRoles(roles)
            this.context.setStatuses(statuses)
        }
        dataFetchPromise.then(onDataLoaded).catch(handleFetchError)

    }
    render() {

        return (
            <div className='tab-page'>
                {/* <DataLoader
                    onReject={handleFetchError}
                    promise={dataFetchPromise}
                    onDataLoaded={onDataLoaded} /> */}

                <h2>Estimates</h2>
                <ProjectSearchBar status={EstimatesPage.opts.statusFilter} />
                <Project />
            </div>
        )
    }
}