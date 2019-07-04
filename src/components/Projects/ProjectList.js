import React, { Component } from 'react'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import classnames from 'classnames'
import LionessContext from '../../LionessContext/LionessContext';
import EditProject from '../EditProject/EditProject'
import dayjs from "dayjs";
import './Project.css'
const newProjectTemplate = {
    id: -1,
    title: '',
    status: {},
    status_id: null,
    description: '',
    start_date: null,
    estimated_due_date: null,
    completion_date: null,
    budget: '',
    client: {},
    client_id: null,
    manager: {},
    manager_id: null,
    contractors: []
};

// const p ={...newProjectTemplate, start_date: new Date()}

export default class ProjectList extends Component {
    static contextType = LionessContext
    constructor() {
        super()
        this.state = {
            expandedIndex: false,
            editModeIndex: false,
            newProject: null,
        }
        this.projectRefs = []
    }
    dateForInput = (dateString) => {
        // return dayjs(dateString).format("YYYY-MM-DD");
        return dayjs(dateString).format('dddd D MMM YYYY');
    }
    toggle = (index) => {
        const { expandedIndex } = this.state
        this.setState({
            expandedIndex: expandedIndex === index ? -1 : index
        })
    }

    toggleeditModeIndex = (index) => {
        const { editModeIndex } = this.state
        this.setState({
            editModeIndex: editModeIndex === index ? -1 : index
        })
    }
    addProject = () => {
        this.setState({
            editModeIndex: 0,
            expandedIndex: 0,
            newProject: { ...newProjectTemplate }
        })
    }
    cancelAddProject = () => {
        this.setState({
            editModeIndex: false,
            expandedIndex: false,
            newProject: null
        })
    }
    render() {
        // debugger
        const projectsList = [...this.context.projects.data]
        if (this.state.newProject) {
            projectsList.unshift(this.state.newProject)
            
        }

        const projects = projectsList.map((project, index) => {
            const isEditing = this.state.editModeIndex === index

            const isExpanded = this.state.expandedIndex === index
            const editingModeClassName = isEditing ? 'show' : ''
            const projectDetails =
                <section key={project.id}>
                    <div className={classnames('collapsible', isExpanded ? '' : null)}
                        onClick={() => { this.toggle(index) }}>
                        <div className='collapsibleInner'>

                            <Icon className='r-spaced' icon={isExpanded ? 'chevron-down' : 'chevron-right'} />
                            {project.title}
                            {!this.state.newProject ? <span>${project.budget}</span> : ''}
                            {project.status.id === 1 ? <span>Start Date: {this.dateForInput(project.start_date)} </span> : ""}
                            {project.status.id === 2 ? <span>Estimated Due Date: {this.dateForInput(project.estimated_due_date)} </span> : ""}
                            {project.status.id === 3 ? <span>Completion Date: {this.dateForInput(project.completion_date)} </span> : ""}
                        </div>

                    </div>

                    <div className={classnames('button-content', isExpanded ? 'expanded' : null)}>
                        <div className='padded'>
                            <div className='actionButtonsWrapper'>
                                {!this.state.newProject ? <button className='actionButton'onClick={() => {
                                        //TODO reload after save, give some visual feedback
                                        // this.context.reloadProjects()
                                        if (!this.projectRefs[index]) {
                                            return
                                        }
                                        this.projectRefs[index].delete()
                                            .then(() => { })
                                            .catch(() => { })
                                            .finally(() => { })
                                    }}><Icon icon="trash" /> Delete</button> : ''}
                                {!this.state.newProject ?
                                    <button className='actionButton' onClick={() => this.toggleeditModeIndex(index)}><Icon icon="edit" /> Edit</button> : ''}
                                {/* <a
                                    onClick={() => { this.toggle(index) }}
                                    href="#" className='closeButton'>
                                    <Icon icon='times' />
                                </a> */}
                            </div>
                            <EditProject
                                ref={(r) => this.projectRefs[index] = r}
                                project={project} editMode={isEditing} />
                            {isEditing ? (<div className='buttonsRow'>
                                <button
                                    type="submit"
                                    onClick={() => {
                                        //TODO reload after save, give some visual feedback
                                        // this.context.reloadProjects()
                                        if (!this.projectRefs[index]) {
                                            return
                                        }
                                        this.projectRefs[index].save()
                                            .then(() => { })
                                            .catch(() => { })
                                            .finally(() => { })
                                    }}
                                    className={`saveButton flexed ${editingModeClassName}`}>Save</button>
                                <button onClick={() => this.cancelAddProject()} className={`cancelButton flexed ${editingModeClassName}`}>Cancel</button>
                            </div>) : null}
                        </div>
                    </div>

                </section>
            return projectDetails
        })
        
        return (
            <div className='tab-content'>
                {projects}
            </div>
        )
    }
}