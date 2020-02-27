import React from 'react';
import axios from 'axios';
import "../styles/marks.css"
// var role = JSON.parse(localStorage.getItem('user').role);
class Marks extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataarray: [],
            role: false,
            mark: [],
            basemark: [],
            editArray: [],
            ischange: false

        }
    }
    markcall = (data) => {
        let { mark } = this.state;
        let { basemark } = this.state;

        data.forEach(element => {
            mark.push(element.marks);
            basemark.push(element.marks)
        });
        this.setState({
            mark,
            basemark
        })
        // },console.log("prevState===>", prevState)));
        // console.log(this.state.basemark);
    }
    componentDidMount() {
        let user = JSON.parse(localStorage.getItem('user'));
        if (user != null) {

            axios.get(`http://localhost:5233/marks?isrole=${user.role}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            })
                .then(res => {
                    var data = res.data.result;
                    console.log(data);
                    if (res.data.success === true && user.role == '1') {
                        this.setState({
                            dataarray: data,
                            role: true,
                        })
                        this.markcall(data);


                    }
                    else {
                        this.setState({
                            dataarray: data,
                            role: this.state.role

                        })
                        // this.markcall(data);
                    }

                })
        }
    }

    undo = (index) => {
        let { editArray } = this.state;
        let { dataarray } = this.state
        let { mark } = this.state
        mark[index] = dataarray[index].marks
        editArray.splice(editArray.indexOf(index), 1)
        this.setState({
            editArray, mark
        })
    }
    undoset = (index) => {
        let { editArray } = this.state;
        let { dataarray } = this.state;
        let { mark } = this.state;
        let { basemark } = this.state;
        console.log(basemark);
        axios.post(`http://localhost:5233/revokechange`, { basemark: basemark[index], id: dataarray[index].studentid, subject: dataarray[index].subject }).then(res => {
            console.log("previous updates are revoked");
            mark[index] = basemark[index];
            dataarray[index].marks = basemark[index];
            editArray.splice(editArray.indexOf(index), 1)
            this.setState({
                editArray, mark, dataarray
            })

        })


    }
    change = (index) => {
        let { editArray } = this.state;
        let { dataarray } = this.state
        let { mark } = this.state

        editArray.splice(editArray.indexOf(index), 1);

        axios.post(`http://localhost:5233/changemark`, { mark: mark[index], id: dataarray[index].studentid, subject: dataarray[index].subject }).then(res => {
            console.log("Marks updated");
            dataarray[index].marks = mark[index]
            this.setState({
                editArray,
                dataarray
            })
        })
        // window.location.reload(false);
    }
    edit = (index, e) => {
        console.log(index)
        let { editArray } = this.state;
        editArray.push(index)
        this.setState({
            editArray
        })


    }

    bindData = event => {
        let { mark } = this.state
        mark[event.target.name] = event.target.value
        this.setState({
            mark
        })

    }

    render() {

        return (
            <div>


                {this.state.role ? (
                    <table id='customers'>
                        <thead></thead>
                        <tbody>
                            <tr>
                                <th>Student ID</th>
                                <th>Name</th>
                                <th>Subject </th>
                                <th>Marks</th>
                                <th>Edit</th>
                            </tr>
                            {this.state.dataarray.map(
                                (data, index) =>
                                    <tr key={index}>
                                        <td>{data.studentid}</td>
                                        <td>{data.name}</td>
                                        <td>{data.subject}</td>
                                        <td>
                                            {this.state.editArray.includes(index) ? (
                                                <input name={index} min="0" max="100" onChange={e => this.bindData(e)} value={this.state.mark[index]} type="number" />) : this.state.mark[index]}
                                        </td>
                                        <td>
                                            {this.state.editArray.includes(index) ?
                                                <div className="fless"><button className="buttonstyle" onClick={e => this.change(index)}>Change</button>
                                                    <button className="buttonstyle" onClick={e => this.undo(index)}>revoke</button></div>
                                                : <div className="fless">
                                                    <button className="buttonstyle" onClick={(e) => this.edit(index, e)}>Edit</button>
                                                    <button className="buttonstyle" onClick={(e) => this.undoset(index)}>undo</button>
                                                </div>

                                            }
                                        </td></tr>)}
                        </tbody>
                    </table>)

                    :
                    <table id='customers'>
                        <thead></thead>
                        <tbody>
                            <tr>
                                <th>Subject ID</th>
                                <th>Teacher ID</th>
                                <th>Marks</th>
                            </tr>
                            {this.state.dataarray.map((data, index) =>
                                <tr key={index}>
                                    <td>{data.subject}</td>
                                    <td>{data.teacherid}</td>
                                    <td>{data.marks}</td>
                                </tr>
                            )}
                            <tr>

                            </tr>
                        </tbody>

                    </table >
                }

            </div>
        )
    }
}
export default Marks;