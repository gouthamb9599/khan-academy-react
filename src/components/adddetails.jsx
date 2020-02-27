import React from 'react';
import Axios from 'axios';
class AddDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            teacher: false,
            student: false,
            course: false,
            tname: "",
            temail: "",
            dept: "",
            tpass: "",
            sname: "",
            semail: "",
            spass: "",
            coursename: "",
            courseheader: ""
        }
    }

    componentDidMount() {
        var type=this.props.match.params.type;
        if(type==="teacher"){
            this.setState({teacher:!this.state.teacher})
        }
        else if(type==="student"){
            this.setState({student:!this.state.student})
        }
        else{
            this.setState({course:!this.state.course})
        }
    }

    addTeacher = () => {
        Axios.post("http://localhost:5233/addteacherforadmin",
            { name: this.state.stname, email: this.state.stemail, dept: this.state.dept, pass: this.state.stpass })
            .then(res => {
                if (res.data.success === true) {
                    alert("teacher entered successfully");
                }
            })
    }
    addStudent = () => {
        Axios.post("http://localhost:5233/addstudentforadmin",
            { name: this.state.stname, email: this.state.stemail, pass: this.state.stpass })
            .then(res => {
                if (res.data.success === true) {
                    alert("student entered successfully");
                }

            })
    }
    addcourse = () => {
        Axios.post(`http://localhost:5233/addcourse`,
            { coursename: this.state.coursename, courseheader: this.state.courseheader })
            .then(res => {
                if (res.data.success === true) {
                    console.log("entered successfully");
                }
            })
    }
    handleChange = e => {

        this.setState({ [e.target.name]: e.target.value });
    }
    render() {
        return (<div>
            {this.state.teacher ?
                <div>
                    <input type="text" placeholder="Enter Teacher Name" name="tname" value={this.state.tname} onChange={(e) => this.handleChange(e)} />
                    <input type="email" placeholder="Enter Teacher Email" name="temail" value={this.state.tmail} onChange={(e) => this.handleChange(e)} />
                    <input type="text" placeholder="Enter Department" name="dept" value={this.state.dept} onChange={(e) => this.handleChange(e)} />
                    <input type="password" placeholder="Enter Password" name="tpass" value={this.state.tpass} onChange={(e) => this.handleChange(e)} />
                    <button className="buttonfind" onClick={(e) => this.addTeacher()}>ADD Teacher</button>
                </div> :
                <div></div>}
            {this.state.student ?
                <div>
                    <input type="text" placeholder="Enter Student Name" name="sname" value={this.state.sname} onChange={(e) => this.handleChange(e)} />
                    <input type="email" placeholder="Enter Student Email" name="semail" value={this.state.smail} onChange={(e) => this.handleChange(e)} />
                    <input type="password" placeholder="Enter Password" name="spass" value={this.state.spass} onChange={(e) => this.handleChange(e)} />
                    <button className="buttonfind" onClick={(e) => this.addStudent()}>ADD Student</button>
                </div> :
                <div></div>}
            {this.state.course ?
                <div>
                    <input type="text" placeholder="Enter Course Name" name="coursename" value={this.state.coursename} onChange={e => this.handleChange(e)} />
                    <input type="text" placeholder="Enter Department" name="courseheader" value={this.state.courseheader} onChange={e => this.handleChange(e)} />
                    <button className="buttonfind" onClick={e => this.addcourse()}>ADD Course</button>
                </div> :
                <div></div>}
        </div>)
    }
}
export default AddDetails;