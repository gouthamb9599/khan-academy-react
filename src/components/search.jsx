import React from 'react';
import axios from 'axios';
import "../styles/search.css";
class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

            search: "",
            searcharray: [],
            displaysearch: false,
        }
    }
    handleChange = e => {

        this.setState({ [e.target.name]: e.target.value },
            () => {
                if (this.state.search === ``) {
                    this.setState({ displaysearch: false })
                }
            });
    };
    search = () => {
        axios.get(`http://localhost:5233/getcourse?search=${this.state.search}`)
            .then(
                (res) => {
                    console.log(res);
                    this.setState({
                        displaysearch: true,
                        searcharray: res.data.result.rows,

                    })

                })
    }
    render() {

        return (
            <div>
                <div className="wrap">
                    <div className="search">
                        <img  alt ="search" src="/search.svg" />
                        <input type="text" name='search' className="searchTerm" placeholder="Search..." autoComplete="off" value={this.state.search} onChange={e => this.handleChange(e)} />
                        <button type="submit" className="searchButton" onClick={e => this.search()}>
                            <img alt="div" src="/right.svg" />
                        </button>
                    </div>
                </div>
                <div className="itemdisplay">
                    {this.state.displaysearch ?
                        <div >
                            {this.state.searcharray.map(
                                (name, index) =>
                                    <p className="itemin" key={index}>{name.coursename}</p>

                            )}</div> : <div></div>}
                </div>
            </div>
        )
    }

}
export default Search;