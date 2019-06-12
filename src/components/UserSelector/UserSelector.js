import React, { Component } from 'react';
import AsyncSelect from "react-select/async";
import ds from '../../STORE/dataservice';
const { getUsers, getProjects, handleFetchError, getRoles, getStatuses } = ds

const mapUsersToOptions = users => users.map(u => { return { value: u.id, label: u.full_name } })

export default class UserSelector extends Component {
    // TODO propTypes defaultValue, roleFilter, onChange, multiple
    // defaultValue is an userObject or an array
    constructor(props) {
        super(props)
        const { defaultValue, multiple } = this.props
        const value = mapUsersToOptions(multiple ? defaultValue : [defaultValue])
        this.state = {
            users: [],
            selected: value,
        }
        this.cache = [] //keep all the loaded users here so we can map back to users
    }
    onChange = (value) => {
        this.setState({ selected: value }, () => {
            const { onChange, multiple } = this.props
            const { selected } = this.state
            const selArr = !multiple ? [selected] : selected
            // debugger
            const selectedUsers = this.cache.filter(u => {
                const isSelected = selArr.find(i => i.value === u.id)
                return isSelected
            })
            console.log(selectedUsers.map(u => u.full_name))
            onChange(!multiple ? selectedUsers[0] : selectedUsers)
        })
    }

    render() {
        const { users } = this.state
        const { onChange, roleFilter, defaultValue, multiple } = this.props
        // const value = mapUsersToOptions(multiple ? defaultValue : [defaultValue])
        const loadUsersPromise = inputValue => {
            const opts = {
                //TODO does not sort, though, why?
                userNameSortAsc: true,
                roleFilter,
                searchQuery: inputValue
            }

            return getUsers(opts).then(users => {
                this.cache = [...this.cache, ...users]
                function onlyUnique(item, index, self) {
                    return self.findIndex(i => i.id === item.id) === index;
                }
                this.cache = this.cache.filter(onlyUnique)
                // console.log(this.cache);
                return mapUsersToOptions(users)
            })
        }
        const props = {
            onChange: this.onChange,
            isMulti: multiple,
            // defaultOptions: true,
            value: this.state.selected,
            loadOptions: loadUsersPromise,
        }
        // debugger
        return (
            <AsyncSelect {...props} />
        )
    }

}