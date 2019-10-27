import React, { Component } from "react";
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import "../Projects/ProjectSearchBar.css";
import ds from "../../STORE/dataservice";
import LionessContext from "../../LionessContext/LionessContext";
import 'react-dates/initialize';
import toast from '../Toast/toast'
const { getUsers, getRoles } = ds;

export default class UserSearchBar extends Component {
  static contextType = LionessContext;
  constructor() {
    super();
    this.state = {
      ...ds.usersDefaultOptions,

      // activeProjSort: null,
      currentPageNumber: 1,
      searchQuery: null,
      // totalPages: null,
      // noSorting: null,
    };
  }

  changePage = (pageNum) => {
    if (pageNum === "prev" && this.state.currentPageNumber > 1) {
      this.setState({
        currentPageNumber: this.state.currentPageNumber - 1
      }, () => { this.fetchData() });
    }
    if (pageNum === "next") {
      this.setState({
        currentPageNumber: this.state.currentPageNumber + 1
      }, () => { this.fetchData() });
    }


  };
  userNameSortChange = (nameSort) => {
    this.setState({
      userNameSort: nameSort === "asc" ? ds.SORT_ASC : ds.SORT_DESC,
      activeProjSort: null,
      noSorting: null,
      currentPageNumber: 1
    }, () => { this.fetchData() });

  }
  activeProjSortChange = (actProjSort) => {

    this.setState({
      userNameSort: null,
      activeProjSort: actProjSort === "asc" ? ds.SORT_ASC : ds.SORT_DESC,
      noSorting: null,
      currentPageNumber: 1
    }, () => { this.fetchData() });

  }

  fetchData = () => {
   

    const promises = []

    const opts = {
      pageNumber: this.state.currentPageNumber,
      userNameSort: this.state.userNameSort,
      noSorting: this.state.noSorting,
      activeProjSort: this.state.activeProjSort,
      roleFilter: this.props.role,
      searchQuery: this.state.searchQuery,
    };
    const p1 = getUsers(opts).then(res => {
      this.context.setUsers(res, this.fetchData);
    });
    promises.push(p1)
    const p2 = getRoles().then(res => {
      this.context.setRoles(res);
    });
    promises.push(p2)
    Promise.all(promises).catch(e => {
      toast.error('There was an error, please retry later ' + new Date().toLocaleTimeString())
    })

  };
  handleSubmit = e => {
    e.preventDefault();
    this.fetchData();
  }
  handleReset = e => {
    // e.preventDefault();
    this.setState(
      {
        currentPageNumber: 1,
        searchQuery: null,
      }, this.fetchData
    )
  }

  componentDidMount() {
    this.fetchData()
  }


  render() {
    return (
      <div className="searchBar">
        <form

          onReset={this.handleReset}
          onSubmit={this.handleSubmit}>
          <div className='search-word-bar'>
            <label htmlFor="search"></label>
            <input className='search-keyword'
              onChange={e => this.setState({ searchQuery: e.target.value })}
              type="text" id="search" name="search" placeholder='Search by keyword' />
           <div className="searchSubmitReset flexed">
            <input className="formInput" type="submit" value="Search!" />
            <input className="formInput" type="reset" value="Clear" />
            </div>
          </div>
          <div>
          <span className="buttonsRowLabel">Sort by:</span>
          <div className="sortButtons buttonsRow">
            <button
              type="button"
              name="name-asc"
              value="asc"
              onClick={e => this.userNameSortChange(e.target.value)}
            >
              Name
              <br />
              (A-Z)


            </button>
            <button
              type="button"
              name="name-dez"
              value="des"
              onClick={e => this.userNameSortChange(e.target.value)}
            >
              Name<br /> (Z-A)
            </button>
            {true || (this.props.role === 3 || this.props.role === 4) ? <button
              type="button"
              name="active-project-high"
              value="desc"
              onClick={e => this.activeProjSortChange(e.target.value)}
            >
              Active Projects <br />(Highest)
        </button> : ''}
            {true || (this.props.role === 3 || this.props.role === 4) ? <button
              type="button"
              name="active-project-low"
              value="asc"
              onClick={e => this.activeProjSortChange(e.target.value)}
            >
              Active Projects<br /> (Lowest)
            </button> : ''}
            </div>
            {/* <button value="prev" onClick={e => this.changePage(e.target.value)}>Previous</button>
            <button value="next" onClick={e => this.changePage(e.target.value)}>Next</button> */}
            <div className='pageButtons buttonsRow'>
              <button className="btnPrev" onClick={e => this.changePage('prev')}>
                <Icon icon="arrow-left" /> Previous
          </button>
              <span className="paginationInfo">
                {this.context.users && `Page ${this.state.currentPageNumber} of ${this.context.users.numPages}`}
              </span>
              <button className="btnNext" onClick={e => this.changePage('next')}>
                Next <Icon icon="arrow-right" />
              </button>
            </div>
          </div>
        </form>

      </div>
    );
  }
}
