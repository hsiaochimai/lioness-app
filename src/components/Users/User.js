import React, { Component } from 'react';
import LionessContext from '../../LionessContext/LionessContext';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import classnames from 'classnames'
import EditUser from '../EditUser/EditUser'
import '../Projects/Project.css'
const newUserTemplate = {
    id: -1,
    email: '',
    full_name: '',
    phone: '',
    password: '',
    inactive: false,
    //associated objects
    role: null, //TODO add a role object
    // isAdmin: true,
    projects: []
};


export default class User extends Component {
    static contextType = LionessContext
    constructor() {
        super()
        this.state = {
            newUser: null,
            expandedIndex: false,
            editModeIndex: false,
        }
        this.userRefs = []
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

    addUser = () => {
        this.setState({
            editModeIndex: 0,
            expandedIndex: 0,
            newUser: { ...newUserTemplate }
        })
    }
    cancelAddUser = () => {
        this.setState({
            editModeIndex: false,
            expandedIndex: false,
            newUser: null
        })
    }


    render() {
        // debugger
        const UsersList = [...this.context.users.data]
        if (this.state.newUser) {
            UsersList.unshift(this.state.newUser)
        }
        const Users = UsersList.map((user, index) => {
            const isExpanded = this.state.expandedIndex === index
            const isEditing = this.state.editModeIndex === index
            const editingModeClassName = isEditing ? 'show' : ''
            const UserDetails =
                <section key={user.id}>
                    <div className={classnames('collapsible', isExpanded ? '' : null)}
                        onClick={() => { this.toggle(index) }}>
                        <div className='collapsibleInner'>
                            <Icon className='r-spaced' icon={isExpanded ? 'chevron-down' : 'chevron-right'} />
                            {!this.state.newUser ? <span>{user.full_name}
                                {!this.state.newUser ? <>
                                    {true || this.props.role !== 2 ?

                                        <em>Active Projects:{user.projects ? user.projects.filter(project => project.status_id === 2).length : "0"}</em> : ''}
                                </> : ''}
                            </span> : ''}
                        </div>
                    </div>

                    <div className={classnames('button-content', isExpanded ? 'expanded' : null)}>
                        <div className='padded'>
                            <div className='actionButtonsWrapper'>
                                {!this.state.newProject ? <button className='actionButton'><Icon icon="trash" /> Delete</button> : ''}
                                {!this.state.newProject ?
                                    <button className='actionButton' onClick={() => this.toggleeditModeIndex(index)}><Icon icon="edit" /> Edit</button> : ''}
                                {/* <a
                                    onClick={() => { this.toggle(index) }}
                                    href="#" className='closeButton'>
                                    <Icon icon='times' />
                                </a> */}
                            </div>

                            <EditUser ref={(r) => this.userRefs[index] = r} user={user} editMode={isEditing} role={this.props.role} />
                            {!isEditing ? null : (<div className='buttonsRow'>
                                <button onClick={() => {

                                    if (!this.userRefs[index]) {
                                        return
                                    }
                                    this.userRefs[index].save()
                                        .then(() => { })
                                        .catch(() => { })
                                        .finally(() => { })
                                }}
                                    className={`saveButton flexed ${editingModeClassName}`} >Save</button>
                                <button onClick={() => this.cancelAddUser()} className={`cancelButton flexed ${editingModeClassName}`}>Cancel</button>
                            </div>)}
                        </div>
                    </div>

                </section>
            return UserDetails
        })
        return (
            <div className='tab-content'>
                {Users}
            </div>
        )
    }
}