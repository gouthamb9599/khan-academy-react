import React from 'react';
import Axios from 'axios';
import * as XLSX from 'xlsx';
import '../styles/alterstudents.css'
class Alterteacher extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stname: "",
            stemail: "",
            dept: "",
            stpass: "",
            rowCount: 0,
            teachers: [],
            active: false, editarray: [],
            editname: "",
            editemail: "",
            editdept: "",
            editpass: "",
            limit: 3,
            offset: 0,
            rowCount: 0,
            button: 0,
            setb: true, active: false,
        }
    }
    buttonset = (rowCount, no) => {
        this.setState({
            button: ((parseInt(rowCount / no)) + (rowCount % no === 0 ? 0 : 1))
        })
    }

    teacherSearch = () => {
        Axios.post("http://localhost:5233/getforadminteachers",
            { name: this.state.stname, email: this.state.stemail, dept: this.state.dept, pass: this.state.stpass, offset: this.state.offset, limit: this.state.limit })
            .then(res => {
                var teachers = res.data.result;
                console.log(teachers);
                var rowCount = res.data.rowCount;
                if (rowCount > 0) {
                    this.setState({
                        teachers,
                        active: true
                    });
                    this.buttonset(rowCount, this.state.limit);
                    console.log(this.state.button);
                }

            })

    }
    xlscall = (e) => {
        var date = new Date()
        var day = ((date.getDate().toString()) + (date.getMonth().toString()) + (date.getFullYear().toString()))
        var time = (date.getHours().toString()) + (date.getMinutes().toString()) + (date.getSeconds().toString());
        var filename = "teachers_date:" + day + "time:" + time + "eof";
        console.log(filename, time, day);
        var location = "/home/system2/Gowtham-B1/backend/"
        this.exportToCSV(this.state.teachers, filename);

    }
    exportToCSV = (csvData, fileName) => {
        const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const fileExtension = fileName + '.xlsx';
        console.log(fileExtension);
        const ws = XLSX.utils.json_to_sheet(csvData);
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "teachers");
        XLSX.writeFile(wb, fileExtension);

    }
    changevalue = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }
    onChange = (e) => {
        this.setState({ [e.target.name]: parseInt(e.target.value) });
    }
    set = () => {
        console.log("value is set");
    }
    addTeacher = () => {
        this.props.history.push('/admin/add/teacher')
    }
    // addTeacher =()=>{
    //     Axios.post("http://localhost:5233/addteacherforadmin",
    //     {name:this.state.stname,email:this.state.stemail,dept:this.state.dept,pass:this.state.stpass})
    //     .then(res=>{
    //         if(res.data.success===true){
    //             alert("teacher entered successfully");
    //         }
    //     })
    // }
    set = () => {
        console.log("value is set");

    }
    setcall = (event, offset) => {
        Axios.post("http://localhost:5233/getforadminteachers",
            { name: this.state.stname, email: this.state.stemail, pass: this.state.stpass, dept: this.state.dept, offset: offset, limit: this.state.limit })
            .then(res => {
                var teachers = res.data.result;
                console.log(res.data);
                this.setState({
                    teachers,
                    active: true,
                    setb: false
                })

            })

        event.target.style = "color: #A00"
    }
    setteacher = (e, id, index) => {
        console.log(index)
        let { editarray } = this.state;
        let { teachers } = this.state;
        console.log('hait');
        teachers[index].name = this.state.editname;
        teachers[index].email = this.state.editemail;
        teachers[index].department = this.state.editdept;
        teachers[index].password = this.state.editpass;
        this.setState({ teachers })
        Axios.post('http://localhost:5233/modifyteachers',
            { name: this.state.editname, teacherid: teachers[index].teacherid, email: this.state.editemail, dept: this.state.editdept, pass: this.state.editpass })
            .then(res => {
                console.log(res)
                if (res.data.success === true) {
                    console.log("changes made successfully");
                }

            })
        editarray.splice(editarray.indexOf(index), 1);
    }

    revoke = (e, index) => {
        let { editarray } = this.state;
        editarray.splice(editarray.indexOf(index), 1);
        this.setState({
            editarray
        })

    }
    deletes = (teacherid) => {
        Axios.post('http://localhost:5233/deleteteacher', { teacherid: teacherid })
            .then(res => {
                if (res.data.success === true) {
                    console.log('teacher removed from the list');
                }
            })
        this.teacherSearch();
    }
    edit = (id, name, email, dept, pass, index) => {
        let { editarray } = this.state;
        editarray.push(index);
        this.setState({
            editarray,
            editname: name,
            editemail: email,
            editdept: dept,
            editpass: pass
        })
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

    async prev() {
        if (this.state.offset >= 1) {
            document.getElementById("mybtn").disabled = false;
            document.getElementById("mmybtn").disabled = false;
            await this.setState({
                offset: this.state.offset - 1
            })
            this.teacherSearch();
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
            this.teacherSearch();
        }
        else {
            document.getElementById("mmybtn").disabled = true;
        }
    }
    render() {
        return (
            <div className="controlpage">
                <div className="adminsearch">
                    <button className="buttonset " onClick={e => this.addTeacher()}><span>Add Teacher</span></button>
                    <div className="controlcontent">
                        <div className="searching">
                            <input type="text" placeholder="Enter Teacher Name" name="stname" value={this.state.stname} onChange={(e) => this.changevalue(e)} />
                            <input type="email" placeholder="Enter Teacher Email" name="stemail" value={this.state.stmail} onChange={(e) => this.changevalue(e)} />
                            <input type="text" placeholder="Enter Department" name="dept" value={this.state.dept} onChange={(e) => this.changevalue(e)} />
                            <input type="password" placeholder="Enter Password" name="stpass" value={this.state.stpass} onChange={(e) => this.changevalue(e)} />
                            <button className="buttonfind" onClick={(e) => this.teacherSearch()}>Search</button></div>
                    </div>
                </div>
                <input type="number" className="texts" name="limit" onChange={e => this.onChange(e)} placeholder="enter page size" />
                <button className="bset" onClick={() => this.set()}>set</button>
                {this.state.active ? <div>
                    <button onClick={e => this.xlscall()}>Export as Excel Sheet</button>
                    <table id="Teacher">
                        <thead>
                        </thead>
                        <tbody>
                            <tr>
                                <th>Teacher ID</th>
                                <th>Teacher Name</th>
                                <th>Email ID</th>
                                <th>Account Password</th>
                                <th>Department</th>
                                <th>Edit</th>
                                <th>Delete</th>
                            </tr>
                            {this.state.teachers.map((data, index) =>
                                this.state.editarray.includes(index) ?
                                    <tr key={index}>
                                        <td>{data.teacherid}</td>
                                        <td><input type="text" name="editname" value={this.state.editname} onChange={e => this.changevalue(e)} /> </td>
                                        <td><input type="email" name="editemail" value={this.state.editemail} onChange={e => this.changevalue(e)} /></td>
                                        <td><input type="text" name="editpass" value={this.state.editpass} onChange={e => this.changevalue(e)} /> </td>
                                        <td><input type="text" name="editdept" value={this.state.editdept} onChange={e => this.changevalue(e)} /></td>
                                        <td><button onClick={e => this.setteacher(e, data.teacherid, index)}>change</button></td>
                                        <td><button onClick={e => this.revoke(e, index)}>Revoke</button></td></tr>
                                    :
                                    <tr key={index}>
                                        <td>{data.teacherid}</td>
                                        <td>{data.name}</td>
                                        <td>{data.email}</td>
                                        <td>{data.password}</td>
                                        <td>{data.department}</td>
                                        <td><button onClick={e => this.edit(data.teacherid, data.name, data.email, data.department, data.password, index)}>Edit</button></td>
                                        <td><button onClick={e => this.deletes(data.teacherid)}>Delete</button></td>
                                    </tr>
                            )}
                        </tbody>
                    </table> <button id="mybtn" onClick={e => this.prev()}>Prev</button>
                    {this.setbuttonz()}
                    <button id="mmybtn" onClick={e => this.next()}>Next</button></div> : <div></div>}
            </div>
        )

    }

}
export default Alterteacher;