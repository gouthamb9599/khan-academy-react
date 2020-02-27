import React from 'react';
import './signup.css';
import axios from 'axios';
// const { pool, Client } = require('pg');


class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            users: []
        }
    }
    // hello = () => {

    //     console.log(pool);
    //     const connectionString = 'postgressql://postgres:rahul1095@localhost:5432/postgres';
    //     const client = new Client({
    //         connectionString: connectionString
    //     })
    //     client.connect()
    //     client.query('SELECT * FROM details', (err, res) => {
    //         console.log(err, res);

    //         client.end();
    //     });
    // }
    check = (e) => {
        if (this.state.email !== "admin") {
            var roles = document.getElementById('role').value;
            var id = 0;
            if (roles === "Teacher") {
                id = 1;
            }
            else if (roles === "Student") {
                id = 2;
            }
            axios.post('http://localhost:5233/login', { email: this.state.email, password: this.state.password, role: id })
                .then(res => {
                    console.log(res);
                    const users = res.data;
                    if (res.data.success === true) {
                        localStorage.setItem('user', JSON.stringify({ token: users.token, role: users.role }));
                        this.props.history.push({ pathname: '/' });
                    }
                    else {
                        alert("invalid credentials");
                    }
                })
        }
        else {
            if (this.state.email === "admin" && this.state.password === "khan") {
                id = 3;
                localStorage.setItem('admin', id);
                this.props.history.push({ pathname: '/admin', state: { admin: true } });

            }
            else {
                alert('unauthorised access');
            }

        }

    }
    handleChange = e => {

        this.setState({ [e.target.name]: e.target.value });
    };

    render() {
        return (
            <div className="signpage">
                <div className="container">
                    <h2 className="heading">LOGIN</h2>
                    <div id="login">
                        <div className="col-25">
                            <label htmlFor="fname">Email</label>
                        </div>
                        <div className="col-75">
                            <input type="email" name="email" placeholder="Email" onChange={(e) => this.handleChange(e)} /><br /></div>
                        <div className="col-25">
                            <label htmlFor="fname">Password</label>
                        </div>
                        <div className="col-75">
                            <input type="password" name="password" placeholder="Password" onChange={(e) => this.handleChange(e)} /><br />
                        </div>
                        <div className="col-25">
                            <label htmlFor="fname">Are you a Student/Teacher?</label>
                        </div>
                        <div className="col-75">
                            <select id="role" className="selectstyle" name="role">
                                <option value="Teacher">Teacher</option>
                                <option value="Student">Student</option>

                            </select>
                        </div>
                        <button id="send" className="buttonstyle" onClick={e => { this.check(e) }}>Login</button>
                        <p className="para">New user?</p>
                        <button className="buttonstyle"><a className="line" href="/signup">signup</a></button>
                    </div>

                </div>
            </div>
        );
    }
}
export default Login;