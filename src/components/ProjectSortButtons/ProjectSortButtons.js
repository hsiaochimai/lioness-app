import React, { Component } from "react";
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import "../Projects/ProjectSearchBar.css";
import ds from "../../STORE/dataservice";
import LionessContext from "../../LionessContext/LionessContext";
const { getProjects } = ds;
export default class ProjectSortButtons extends Component{
    constructor(){
        super();
        this.state={
            noSort:null,
            budgetSortAsc: null,
            dateSort: null,
            currentPageNumber: 1, 
        }
    }
    changePage = pageNum => {
        if (pageNum === "prev" && this.state.currentPageNumber > 1) {
          this.setState(
            {
              currentPageNumber: this.state.currentPageNumber - 1
            },
            () => {
              this.fetchData();
            }
          );
        }
        if (pageNum === "next") {
          this.setState(
            {
              currentPageNumber: this.state.currentPageNumber + 1
            },
            () => {
              this.fetchData();
            }
          );
        }
      };
      budgetChange = sortType => {
        if (sortType === "asc") {
          this.setState(
            {
              budgetSortAsc: true,
              currentPageNumber: 1
            },
            () => {
              this.fetchData();
            }
          );
        } else {
          this.setState(
            {
              budgetSortAsc: false,
              currentPageNumber: 1
            },
            () => {
              this.fetchData();
            }
          );
        }
      };
      dateSortChange(dateSort) {
        if (dateSort === "asc") {
          this.setState(
            {
              dateSort: true,
              currentPageNumber: 1
            },
            () => {
            }
          );
        } else {
          this.setState(
            {
              dateSort: false,
              currentPageNumber: 1
            },
            () => {
            }
          );
        }
      }
    render(){
        return(
<div className='sort-bar'>
            <div className="sortButtons">
                Sort by:
              <button
                type="button"
                name="date-new"
                value="asc"
                onClick={e => this.dateSortChange(e.target.value)}
              >
                Date (Newest)
              </button>
              <button
                type="button"
                name="date-old"
                value="des"
                onClick={e => this.dateSortChange(e.target.value)}
              >
                Date (Oldest)
              </button>
              <button
                type="button"
                name="budget-high"
                value="asc"
                onClick={e => this.budgetChange(e.target.value)}
              >
                Budget (Highest)
              </button>
              <button
                type="button"
                name="budget-low"
                value="des"
                onClick={e => this.budgetChange(e.target.value)}
              >
                Budget (Lowest)
              </button>
            </div>
          <div className='pagination-buttons'>
          <button value="prev" onClick={e => this.changePage(e.target.value)}>
          <Icon icon="arrow-left" /> Previous
          </button>
          <button value="next" onClick={e => this.changePage(e.target.value)}>
            Next <Icon icon="arrow-right" />
          </button>
          </div>
          </div>
        )
    }
}