import React from 'react';
import Axios from 'axios';
import * as XLSX from 'xlsx';
import '../styles/alterstudents.css';
class CourseAlter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            coursename: "",
            courseheader: "",
            courses: [],
            isedit: true,
            active: false,
            editcourse: "",
            editheader: "",
            editarray: [],
            limit: 3,
            offset: 0,
            rowCount: 0,
            button:0,
            setb:true,active:false,
        }
    }
    setbuttonz = ()=>
    {        var buttonclass = {
            color: "black"
        }
        let button = [];
        for (let i = 0; i < this.state.button; i++) {
            button.push(<button id={i} style={buttonclass} onClick={e => this.setcall(e, i)}>{i + 1}</button>);
        }
        return button;
    }
    buttonset=(rowCount,no)=>{
        this.setState({
            button:((parseInt(rowCount/no))+(rowCount%no===0 ? 0 :1))
        })
    }
    set = () => {
        console.log("value is set");

    }
    setcall = (event, offset) => {
        Axios.post("http://localhost:5233/searchcourseforadmin",
            { coursename: this.state.coursename, courseheader: this.state.courseheader, offset: offset, limit: this.state.limit })
            .then(res => {
                var courses = res.data.result;
                console.log(res.data);
                this.setState({
                    courses,
                    active: true,
                    setb: false
                })


            })

        event.target.style = "color: #A00"
        }
    searchcourse = () => {
        Axios.post(`http://localhost:5233/searchcourseforadmin`,
            { coursename: this.state.coursename, courseheader: this.state.courseheader,offset: this.state.offset, limit: this.state.limit })
            .then(res => {
                if (res.data.success === true) {
                    var courses = res.data.result;
                    var rowCount=res.data.rowCount;
                        if(rowCount>0){
                        this.setState({
                            courses,
                            active: true
                        })
                        this.buttonset(rowCount,this.state.limit); 
                        console.log(this.state.button);
                    }
                }
            })

    } 
    onChange = (e) => {
        this.setState({ [e.target.name]: parseInt(e.target.value) });
    }
    xlscall = (e) => {
        var date = new Date()
        var day = ((date.getDate().toString()) + (date.getMonth().toString()) + (date.getFullYear().toString()))
        var time = (date.getHours().toString()) + (date.getMinutes().toString()) + (date.getSeconds().toString());
        var filename = "courses_date:" + day + "time:" + time + "eof";
        console.log(filename, time, day);
        var location = "/home/system2/Gowtham-B1/backend/"
        this.exportToCSV(this.state.courses,filename);

    }
    exportToCSV = (csvData, fileName) => {
        const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const fileExtension = fileName+'.xlsx';
        console.log(fileExtension);
        const ws = XLSX.utils.json_to_sheet(csvData);
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "courses");
        XLSX.writeFile(wb, fileExtension);
    
     }
    changevalue = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }
    setcourse = (e, id, index) => {
        console.log(index)
        let { editarray } = this.state;
        let { courses } = this.state;
        console.log('hait');
        courses[index].coursename = this.state.editcourse;
        courses[index].courseheader = this.state.editheader;
        this.setState({ courses })
        Axios.post('http://localhost:5233/modifycourses',
            { coursename: this.state.editcourse, courseid: courses[index].courseid, courseheader: this.state.editheader })
            .then(res => {
                console.log(res)
                if (res.data.success === true) {
                    console.log("changes made successfully");
                }

            })
        editarray.splice(editarray.indexOf(index), 1);
    }


    addcourse = () => {
        this.props.history.push('/admin/add/course');
    }
    revoke = (e, index) => {
        let { editarray } = this.state;
        editarray.splice(editarray.indexOf(index), 1);
        this.setState({
            editarray
        })

    }
    edit = (courseid, coursename, courseheader, index) => {

        let { editarray } = this.state;
        editarray.push(index);
        this.setState({
            editarray,
            isedit: !this.state.isedit,
            editcourse: coursename,
            editheader: courseheader
        })
    }
    delete = (courseid) => {
        Axios.post('http://localhost:5233/deletecourse', { courseid: courseid })
            .then(res => {
                if (res.data.success === true) {
                    console.log('course removed from the list');
                }
            })
            this.searchcourse();
    }
    // addcourse = () => {
    //     Axios.post(`http://localhost:5233/addcourse`,
    //         { coursename: this.state.coursename, courseheader: this.state.courseheader })
    //         .then(res => {
    //             if (res.data.success === true) {
    //                 console.log("entered successfully");
    //             }
    //         })
    // }
    async prev() {
        if(this.state.offset >=1){
            document.getElementById("mybtn").disabled = false;
            document.getElementById("mmybtn").disabled = false;
        await this.setState({
            offset: this.state.offset - 1
        })
        this.searchcourse();
    }
        else{
            document.getElementById("mybtn").disabled = true;
        }
    }
    async next() {
        if(this.state.offset+1<this.state.button){
        await this.setState({
            offset: this.state.offset + 1
            
        })
        document.getElementById("mmybtn").disabled = false;
        document.getElementById("mybtn").disabled = false;
        this.searchcourse();
    }
    else{
        document.getElementById("mmybtn").disabled = true;
    }
    }
    render() {
        return (
            <div>
                <div className="adminsearch">
                    <button className="buttonset" onClick={e => this.addcourse()} >
                        <span>Add Course</span>
                    </button>
                    <div className="controlcontent">
                        <div className="searching">
                            <input type="text" placeholder="Enter Course Name" name="coursename" value={this.state.coursename} onChange={e => this.changevalue(e)} />
                            <input type="text" placeholder="Enter Department" name="courseheader" value={this.state.courseheader} onChange={e => this.changevalue(e)} />
                            <button className="buttonfind" onClick={e => this.searchcourse()}>Search</button>
                        </div>
                    </div>
                </div>
                <input type="number" className="texts"name="limit" onChange={e => this.onChange(e)} placeholder="enter page size" />
                        <button  className="bset"onClick={() => this.set()}>set</button>
                {this.state.active ? <div>
                    <button onClick={e=>this.xlscall()}>Export as Excel Sheet</button>
                    <table id="Teacher">
                        <thead>
                        </thead>
                        <tbody>
                            <tr>
                                <th>Course ID</th>
                                <th>Course Name</th>
                                <th>Department</th>
                                <th>Edit</th>
                                <th>Delete</th>

                            </tr>
                            {this.state.courses.map((data, index) =>
                                this.state.editarray.includes(index) ?
                                    <tr key={index}>
                                        <td>{data.courseid}</td>
                                        {/* <td><input type="text" name="editid" value={this.state.editid} onChange={e => this.changevalue(e)} /></td> */}
                                        <td><input type="text" name="editcourse" value={this.state.editcourse} onChange={e => this.changevalue(e)} /> </td>
                                        <td><input type="text" name="editheader" value={this.state.editheader} onChange={e => this.changevalue(e)} /></td>
                                        <td><button onClick={e => this.setcourse(e, data.courseid, index)}>change</button></td>
                                        <td><button onClick={e => this.revoke(e, index)}>Revoke</button></td></tr>
                                    : <tr key={index}>
                                        <td>{data.courseid}</td>
                                        <td>{data.coursename}</td>
                                        <td>{data.courseheader}</td>
                                        <td><button onClick={e => this.edit(data.courseid, data.coursename, data.courseheader, index)}>Edit</button></td>
                                        <td><button onClick={e => this.delete(data.courseid)}>Delete</button></td></tr>
                            )}
                        </tbody>
                    </table>
                    <button id="mybtn" onClick={e => this.prev()}>Prev</button>
                            {this.setbuttonz()}
                            <button id="mmybtn" onClick={e => this.next()}>Next</button></div> : <div></div>}
                </div > 
           
        )
    }
}
export default CourseAlter;