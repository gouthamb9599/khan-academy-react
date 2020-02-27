import React from 'react';
import * as XLSX from 'xlsx';
import '../styles/alterstudents.css'

import Axios from 'axios';
class Stalter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stname: "",
            stemail: "",
            stpass: "",
            students: [],
            active: false,
            editname: "",
            editemail: "",
            editteacher: "",
            editpass: "",
            editarray: [],
            limit: 3,
            offset: 0,
            rowCount: 0,
            button: 0,
            setb: false

        }
    }
    edit = (id, name, email, teacher, pass, index) => {
        let { editarray } = this.state;
        editarray.push(index);
        this.setState({
            editarray,
            editname: name,
            editemail: email,
            editteacher: teacher,
            editpass: pass
        })
    }
    buttonset = (rowCount, no) => {


        this.setState({
            button: ((parseInt(rowCount / no)) + (rowCount % no === 0 ? 0 : 1))
        })
    }
    studentSearch = () => {

        Axios.post("http://localhost:5233/getforadminsstudents",
            { name: this.state.stname, email: this.state.stemail, pass: this.state.stpass, offset: this.state.offset, limit: this.state.limit })
            .then(res => {
                var students = res.data.result;
                console.log(res.data);
                var rowCount = res.data.rowCount

                this.setState({
                    students,
                    rowCount,
                    active: true
                })
                this.buttonset(rowCount, this.state.limit);
                console.log(this.state.button);

            })

    }

    deletes = (userid) => {
        Axios.post('http://localhost:5233/deletestudent', { userid: userid })
            .then(res => {
                if (res.data.success === true) {
                    console.log('teacher removed from the list');
                }
            })
        this.studentSearch();
    }
    setstudent = (e, id, index) => {

        let { editarray } = this.state;
        let { students } = this.state;
        students[index].name = this.state.editname;
        students[index].email = this.state.editemail;
        students[index].teacherid = this.state.editteacher;
        students[index].password = this.state.editpass;
        this.setState({ students })
        Axios.post('http://localhost:5233/modifystudents',
            { name: this.state.editname, userid: students[index].userid, email: this.state.editemail, teacherid: this.state.editteacher, pass: this.state.editpass })
            .then(res => {
                if (res.data.success === true) {
                    console.log("changes made successfully");
                }
            })
        editarray.splice(editarray.indexOf(index), 1);
    }
    addStudent = () => {
        this.props.history.push('/admin/add/student')
    }

    // addStudent = () => {
    //     Axios.post("http://localhost:5233/addstudentforadmin",
    //     {name:this.state.stname,email:this.state.stemail,pass:this.state.stpass})
    //     .then(res=>{
    //             if(res.data.success===true)
    //             {
    //                 alert("student entered successfully");
    //             }

    //     })
    // }
    revoke = (e, index) => {
        let { editarray } = this.state;
        editarray.splice(editarray.indexOf(index), 1);
        this.setState({
            editarray
        })
    }
    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    }
    onChange = (e) => {
        this.setState({ [e.target.name]: parseInt(e.target.value) });
    }
    set = () => {
        console.log("value is set");

    }
    //    set =  () => {
    //         if(this.state.limit===0){
    //             console.log('initial page size is set')
    //         }
    //         else{
    //             this.studentSearch();
    //         }

    //     }

    xlscall = (e) => {
        var date = new Date()
        var day = ((date.getDate().toString()) + (date.getMonth().toString()) + (date.getFullYear().toString()))
        var time = (date.getHours().toString()) + (date.getMinutes().toString()) + (date.getSeconds().toString());
        var filename = "students_date:" + day + "time:" + time + "eof";
        console.log(filename, time, day);
        var location = "/home/system2/Gowtham-B1/backend/"
        this.exportToCSV(this.state.students, filename);

    }
    setcall = (event, offset) => {
        Axios.post("http://localhost:5233/getforadminsstudents",
            { name: this.state.stname, email: this.state.stemail, pass: this.state.stpass, offset: offset, limit: this.state.limit })
            .then(res => {
                var students = res.data.result;
                console.log(res.data);
                this.setState({
                    students,
                    active: true,
                    setb: false
                })


            })

        event.target.style = "color: #A00"

    }
    setbuttonz = () => {
        var buttonclass = {
            color: "black"
        }
        let button = [];
        for (let i = 0; i < this.state.button; i++) {
            button.push(<button id={i} style={buttonclass} onClick={e => this.setcall(e, i)}>{i + 1}</button>);
        }
        return button;

    }
    exportToCSV = (csvData, fileName) => {
        const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const fileExtension = fileName + '.xlsx';
        console.log(fileExtension);
        const ws = XLSX.utils.json_to_sheet(csvData);
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "students");
        XLSX.writeFile(wb, fileExtension);

    }
    async prev() {
        if (this.state.offset >= 1) {
            document.getElementById("mybtn").disabled = false;
            document.getElementById("mmybtn").disabled = false;
            await this.setState({
                offset: this.state.offset - 1
            })
            this.studentSearch();
        }
        else {
            document.getElementById("mybtn").disabled = true;
        }
    }
    async next() {
        if (this.state.offset + 1 < this.state.button) {
            await this.setState({
                offset: this.state.offset + 1

            })
            document.getElementById("mmybtn").disabled = false;
            document.getElementById("mybtn").disabled = false;
            this.studentSearch();
        }
        else {
            document.getElementById("mmybtn").disabled = true;
        }
    }
    render() {
        return (
            <div className="controlpage">
                <div className="adminsearch">
                    <button className="buttonset" onClick={e => this.addStudent()}>
                        <span>Add Student</span>
                    </button>
                    <div className="controlcontent">
                        <div className="searching">
                            <input type="text" placeholder="Enter Student Name" name="stname" value={this.state.stname} onChange={(e) => this.handleChange(e)} />
                            <input type="email" placeholder="Enter Student Email" name="stemail" value={this.state.stmail} onChange={(e) => this.handleChange(e)} />
                            <input type="password" placeholder="Enter Password" name="stpass" value={this.state.stpass} onChange={(e) => this.handleChange(e)} />
                            <button className="buttonfind" onClick={(e) => this.studentSearch()}>Search</button>
                        </div>
                    </div>
                    <input type="number" className="texts" name="limit" onChange={e => this.onChange(e)} placeholder="enter page size" />
                    <button className="bset" onClick={() => this.set()}>set</button>
                    {this.state.active ?
                        <div>
                            <button className="buttonset" onClick={e => this.xlscall(e)}>Export as excel file</button><table id="Student">

                                <thead>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th>Student ID</th>
                                        <th>Student Name</th>
                                        <th>Email ID</th>
                                        <th>Account Password</th>
                                        <th>Teacher (ID)</th>
                                        <th>Edit</th>
                                        <th>Delete</th>
                                    </tr>

                                    {this.state.students.map((data, index) =>
                                        this.state.editarray.includes(index) ?
                                            <tr key={index}>
                                                <td>{data.teacherid}</td>
                                                <td><input type="text" name="editname" value={this.state.editname} onChange={e => this.handleChange(e)} /> </td>
                                                <td><input type="email" name="editemail" value={this.state.editemail} onChange={e => this.handleChange(e)} /></td>
                                                <td><input type="text" name="editpass" value={this.state.editpass} onChange={e => this.handleChange(e)} /> </td>
                                                <td><input type="text" name="editteacher" value={this.state.editteacher} onChange={e => this.handleChange(e)} /></td>
                                                <td><button onClick={e => this.setstudent(e, data.userid, index)}>change</button></td>
                                                <td><button onClick={e => this.revoke(e, index)}>Revoke</button></td></tr>
                                            : <tr key={index}>
                                                <td>{data.userid}</td>
                                                <td>{data.name}</td>
                                                <td>{data.email}</td>
                                                <td>{data.password}</td>
                                                <td>{data.teacherid}</td>
                                                <td><button onClick={e => this.edit(data.userid, data.name, data.email, data.teacherid, data.password, index)}>Edit</button></td>
                                                <td><button onClick={e => this.deletes(data.userid)}>Delete</button></td>
                                            </tr>
                                    )}
                                </tbody>
                            </table>
                            <button id="mybtn" onClick={e => this.prev()}>Prev</button>
                            {this.setbuttonz()}
                            <button id="mmybtn" onClick={e => this.next()}>Next</button></div> : <div></div>}


                </div>
            </div>



        )

    }
}
export default Stalter;