import React from 'react';
import Marks from "./marks";
import Axios from 'axios';
import "../styles/sidebar.css";
class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            role: false,
            dataarray: [],
            dropout: false,
            showis: false,
            issest: false
        }
    }
    componentDidMount() {
        this.setrole();
    }
    getstudent = () => {

        var local = JSON.parse(localStorage.getItem('user'));
        
        Axios.get(`http://localhost:5233/getstudent?role=${local.role}`,
            { headers: { Authorization: `Bearer ${local.token}` } })
            .then(res => {
                
                this.setState({
                    dataarray: res.data.result,
                    showis: !this.state.showis
                })

            })



    }
    setrole() {
        var type = JSON.parse(localStorage.getItem('user'));
        if (type && type.role === 1) {
            this.setState({ role: !this.state.role })
        }
        else if (type && type.role === 2) {
            console.log("   ");

        }
        else {
            console.log("no user");
        }
    }
    getmark = () => {
        this.setState({
            dropout: !this.state.dropout
        })
    }
    render() {


        var displaystyle = {
            display: this.state.dropout ? "block" : "none"
        }
        var disstyle = {
            display: this.state.showis ? "block" : "none"
        }
        var buttonclass = this.state.issest ? "active" : " "
        return (

            <div className="setss">
                {this.state.role ? <div className="classes">
                    <div>
                        <button className={`button_bars ${buttonclass}`} onClick={e => this.getstudent()}><span>Student details</span><span><i className={`${buttonclass}s fa fa-caret-down`}></i></span></button>
                        <div style={disstyle}>
                            <table id='customers'>
                                <thead></thead>
                                <tbody>
                                    <tr>
                                        <th>Student ID</th>
                                        <th>Name</th>
                                    </tr>
                                    {this.state.dataarray.map((data, index) =>

                                        <tr key={index}>
                                            <td >{data.userid}</td>
                                            <td>{data.name}</td></tr>

                                    )}

                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div>
                        <button className={`button_bars ${buttonclass}`} onClick={e => this.getmark()}><span>Marks</span><span><i className={`${buttonclass}s fa fa-caret-down`}></i></span></button>
                        <div style={displaystyle}><Marks /></div></div>
                </div> : <div>
                        <div className="classes">
                            <div>
                                <button className={`button_bars ${buttonclass}`} onClick={e => this.getstudent()}><span>Course details</span><span><i className={`${buttonclass}s fa fa-caret-down`}></i></span></button>


                                <div style={disstyle}>
                                    <table id='customers'>
                                        <thead></thead>
                                        <tbody>
                                            <tr>
                                                <th>course ID</th>
                                                <th>course</th>
                                                <th>Department</th>
                                            </tr>
                                            {this.state.dataarray.map((data, index) =>

                                                <tr key={index}>
                                                    <td >{data.courseid}</td>
                                                    <td>{data.coursename}</td>
                                                    <td>{data.courseheader}</td></tr>

                                            )}

                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div>
                                <button className={`button_bars ${buttonclass}`} onClick={e => this.getmark()}><span>Marks</span><span><i className={`${buttonclass}s fa fa-caret-down`}></i></span></button>
                                <div style={displaystyle}><Marks /></div></div>
                        </div>
                    </div>}


            </div>
        )
    }
}
export default Sidebar;