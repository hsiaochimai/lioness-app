/* eslint-disable import/first */
import dataString from './flattenedData.json';
import Cookie from "js.cookie"
import fjs from 'flatted/cjs';
import { reject } from 'q';
import { createEmitAndSemanticDiagnosticsBuilderProgram, reduceEachLeadingCommentRange } from 'typescript';
import { history } from '../index';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween'
import moment from 'moment'
dayjs.extend(isBetween)
const { parse, stringify } = fjs
// debugger;
// console.log('data', dataString)
let data = parse(JSON.stringify(dataString));
const defaultOptions = {
    statusFilter: null,
    searchQuery: null,
    budgetFilterAsending: null,
    dateTypeFilter: null,
    timePeriodFilter: null,
    dateSortAsc: null,
    dateOne: null,
    dateTwo: null,
    roleFilter: null,

    // startDateFilter:null,
    pageNumber: 1,
}
const NOT_LOGGED_IN = 'NOT_LOGGED_IN'

console.log('parsed data', data)
const ds = {

    statuses: ["estimate", "in progress", "billed", "other"],

    handleFetchError: (err) => {
        // debugger
        if (err.message === NOT_LOGGED_IN) {
            console.log('redirecting to login')
            history.push('/login')
        }
    },
    getCookieLoginInfo: () => {
        return Cookie.get("credentials");
    },
    setCookieLoginInfo: (loginData) => {
        Cookie.set("credentials", loginData);
    },

    getUsers: (opts = {}) => {
        if (!ds.getCookieLoginInfo()) {
            // throw new Error(NOT_LOGGED_IN)
            return Promise.reject(new Error(NOT_LOGGED_IN))
        }
        const mergedOpts = { ...defaultOptions, ...opts }
        let res = [...data.users]
        if(mergedOpts.roleFilter){
            res= res.filter(user=> user.role.id=== mergedOpts.roleFilter)
        }
        // return res
        // const result= parse(stringify(res))
        return Promise.resolve(res)
    },
    getProjects: (opts = {}) => {
        if (!ds.getCookieLoginInfo()) {
            // throw new Error(NOT_LOGGED_IN)
            return Promise.reject(new Error(NOT_LOGGED_IN))
        }
        const mergedOpts = { ...defaultOptions, ...opts }
        let res = [...data.projects]
        console.log(`getProjects`, mergedOpts)
        if (mergedOpts.statusFilter) {
            res = res.filter(project => project.status === opts.statusFilter)
        }
        if (opts.searchQuery) {
            res = res.filter(project => {
                let res = false
            })
        }
        if (mergedOpts.timePeriodFilter) {
            if (mergedOpts.dateTypeFilter === 'startDate') {
                if (mergedOpts.timePeriodFilter === 'before') {
                    res = res.filter(project => {
                        return dayjs(project.startDate).isBefore(dayjs(mergedOpts.dateOne))
                    })
                }
                if (mergedOpts.timePeriodFilter === 'after') {
                    res = res.filter(project => {
                        return dayjs(project.startDate).isAfter(dayjs(mergedOpts.dateOne))
            })
        }
        if (mergedOpts.timePeriodFilter === 'betweenDates') {
          
            res = res.filter(project => {
                return dayjs(project.startDate).isBetween( dayjs(mergedOpts.dateOne),dayjs(mergedOpts.dateTwo) )
               
            })
}
    }

    if(mergedOpts.dateTypeFilter === 'estimatedDueDate'){
        if (mergedOpts.timePeriodFilter === 'before') {
            res = res.filter(project => {
                return dayjs(project.estimatedDueDate).isBefore(dayjs(mergedOpts.dateOne))
            })
        }
        if (mergedOpts.timePeriodFilter === 'after') {
            res = res.filter(project => {
                return dayjs(project.estimatedDueDate).isAfter(dayjs(mergedOpts.dateOne))
    })
} 

if (mergedOpts.timePeriodFilter === 'betweenDates') {
          
    res = res.filter(project => {
        return dayjs(project.estimatedDueDate).isBetween( dayjs(mergedOpts.dateOne),dayjs(mergedOpts.dateTwo) )
       
    })
}
    }
    if(mergedOpts.dateTypeFilter === 'completionDate'){
        if (mergedOpts.timePeriodFilter === 'before') {
            res = res.filter(project => {
                return dayjs(project.completionDate).isBefore(dayjs(mergedOpts.dateOne))
            })
        }
        if (mergedOpts.timePeriodFilter === 'after') {
            res = res.filter(project => {
                return dayjs(project.completionDate).isAfter(dayjs(mergedOpts.dateOne))
    })
} 
if (mergedOpts.timePeriodFilter === 'betweenDates') {
          
    res = res.filter(project => {
        return dayjs(project.completionDate).isBetween( dayjs(mergedOpts.dateOne),dayjs(mergedOpts.dateTwo) )
       
    })
}
    }

}

        if (mergedOpts.dateSortAsc) {
            if (mergedOpts.dateTypeFilter === 'startDate') {
                res = res.sort((a, b) => (new Date(b.startDate) - new Date(a.startDate)))
                console.log(res)
            }
            if (mergedOpts.dateTypeFilter === 'estimatedDueDate') {
                res = res.sort((a, b) => (new Date(b.estimatedDueDate) - new Date(a.estimatedDueDate)))
                console.log(res)
            }
            if (mergedOpts.dateTypeFilter === 'completionDate') {
                res = res.sort((a, b) => (new Date(b.completionDate) - new Date(a.completionDate)))
                console.log(res)
            }
        }
        if (!mergedOpts.dateSortAsc) {
            if (mergedOpts.dateTypeFilter === 'startDate') {
                res = res.sort((a, b) => (new Date(a.startDate) - new Date(b.startDate)))
            }
            if (mergedOpts.dateTypeFilter === 'estimatedDueDate') {
                res = res.sort((a, b) => (new Date(a.estimatedDueDate) - new Date(b.estimatedDueDate)))
            }
            if (mergedOpts.dateTypeFilter === 'completionDate') {
                res = res.sort((a, b) => (new Date(a.completionDate) - new Date(b.completionDate)))
            }
        }


        // if(!opts.dateSortAsc, opts.dateTypeFilter){
        //     res= res.sort((a,b)=>(a.opts.dateTypeFilter - b.opts.dateTypeFilter))
        // }
        if (mergedOpts.budgetFilterAsending) {
            res = res.sort((a, b) => (b.budget - a.budget))
            console.log(res)
        }
        // if(!opts.budgetFilterAsending){
        //     res= res.sort((a,b)=>(a.budget - b.budget))
        // }
        //         if(opts.dateTypeFilter,opts.timePeriodFilter, opts.dateOne){
        //             if(opts.timePeriodFilter==='before'){
        // res= res.filter(project=>project.opts.dateTypeFilter=== dayjs().isBefore(opts.dateOne))
        // }
        //         }
        return Promise.resolve(res)
    },
    getUserLogin: (email, password) => {
        let users = [...data.users]
        let findUser = users.find(user => user.email === email)
        if (!findUser) {
            window.alert('Email does not match any user, please reenter your email and password')
            return Promise.reject(('No such user'))

        } else if (password !== findUser.password) {
            window.alert('Password does not match email, please reenter your email and password')

            return Promise.reject(('Wrong password'))
        } else {
            return Promise.resolve(findUser)
        }
    },
    // statusFilter: (status)=>{
    //     let projects= [...data.projects]
    //     if(status==='allProjects'){
    //         return Promise.resolve(projects)
    //     }else {
    //         const projectByStatus= projects.filter(project=>project.status===status)
    // return Promise.resolve(projectByStatus)
    //     }
    // },

    // getProjects: () => {}
}
export default ds

