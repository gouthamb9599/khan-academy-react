import React from 'react';
// import Axios from 'axios';
import '../styles/getdetails.css';
import { withRouter } from 'react-router-dom';
class Details extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

            drop: false,
            show: false,
            issest: false,


        }
    }
    toggle = (ch) => {
        this.props.toggleFunc(ch)
    }
    render() {

        var buttonclass = this.state.issest ? "actisve" : " "
        var mainStyle = {
            left: this.props.sideBar ? "0" : "-16%"
        }
        return (
            <div className="sets" style={mainStyle}>
                <div className="classe">
                    <div className="setbutton">
                        <button className={`button_b ${buttonclass}`} onClick={e => this.toggle(2)}><span><img className="images" alt="Teacher" src="/teacher.svg" /></span> <span className="textc">Teachers</span></button>
                    </div>
                    <div className="setbutton">
                        <button className={`button_b ${buttonclass}`} onClick={e => this.toggle(1)}><span> <img className="images" alt="student" src="/student.svg" /></span> <span className="textc">Students</span></button>
                    </div>
                    <div className="setbutton">
                        <button className={`button_b ${buttonclass}`} onClick={e => this.toggle(3)}><span><img className="images" alt="course" src="/award-solid.svg" /></span> <span className="textc">Courses</span></button></div>
                </div>
            </div>

        )
    }
}
export default withRouter(Details);