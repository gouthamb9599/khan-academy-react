import React from 'react';
import './signup.css';

// import { Redirect } from 'react0-router-dom';
// import history from './history';
import axios from 'axios'

// const { pool, Client } = require('pg');

class Signup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            email: "",
            role: "",
            stname: "",
            password: "",
            cpassword: "",
            isteacher: true,
            namearray: [],
            image: null,
            imge: false,
            file: null


        }
    }

    componentDidMount() {
        axios.get(`http://localhost:5233/getdetails?isTeacher=false`)
            .then(
                (res) => {
                    console.log(res);
                    if (res.data.success === true)
                        this.setState({
                            namearray: res.data.result
                        })
                    console.log(res.data);
                })

    }


    handleChange = e => {

        this.setState({ [e.target.name]: e.target.value });
    };

    // hello = (ele) => {

    //     console.log(pool);
    //     const connectionString = 'postgressql://postgres:rahul1095@localhost:5432/postgres';
    //     const client = new Client({
    //         connectionString: connectionString
    //     })
    //     client.connect()
    //     client.query('INSERT INTO details', (err, res) => {
    //         console.log(err, res);

    //         client.end();
    //     });
    // }
    signup = (e) => {
        e.preventDefault()
        var roles = document.getElementById("role").value;
        if (this.state.name === "") {
            alert("Enter your name");
        }
        else if (this.state.email === "") {
            alert("Enter your Email ID");
        }
        else if (this.state.password !== this.state.cpassword) {
            alert("passwords does not match");
        }
        else {
            var work = ""
            console.log(this.state.image);
            let formData = new FormData();
            if (roles === "1") {
                work = document.getElementById('state').value;
                console.log(work);
                formData.set('name', this.state.name)
                formData.set('email', this.state.email)
                formData.set('role', roles)
                formData.set('password', this.state.password)
                formData.set('course', work)
                formData.append('image', this.state.file)
                axios.post("http://localhost:5233/signup",formData,).then((res) => {
                    if(res.data.success===true){
                        const users = res.data.token;
                    this.setState({ ...this.state, name: "bk" });
                    localStorage.setItem('user', users);
                    console.log("user registered");
                     this.props.history.push({ pathname: '/', state: { isteacher: true } });
                }
                    else{
                        console.log(res);
                    }
                   
                })
            }
            else if (roles === "2") {
                let formData = new FormData();
                formData.set('name', this.state.name)
                formData.set('email', this.state.email)
                formData.set('role', roles)
                formData.set('password', this.state.password)
                formData.append('image', this.state.file)
                console.log(formData)
                axios.post("http://localhost:5233/signup", formData).then((res) => {
                    if(res.data.success===true){
                    const users = res.data.token;
                    this.setState({ ...this.state, name: "bk" });
                    localStorage.setItem('user', users);
                    console.log("user registered");
                    this.props.history.push({ pathname: '/', state: { isteacher: false } });
                    }
                    else{
                        console.log(res);
                    }

                })
            }
        }
        console.log(this.state.name);

    }
    setchange = () => {
        this.setState({
            imge: false
        })
    }
    call = () => {
        this.setState({
            isteacher: !this.state.isteacher
        })

        axios.get(`http://localhost:5233/getdetails?isTeacher=${this.state.isteacher}`)
            .then(
                (res) => {
                    // console.log(res);
                    if (res.data.success === true)
                        this.setState({
                            namearray: res.data.result
                        })

                })

    }
    fileselected = (e) => {
        this.setState({
            image: e.target.files[0]
        })
        const file = this.refs.uploadImg.files[0]
        const reader = new FileReader();

        console.log(file);
        reader.onloadend = () => {
            this.setState({
                image: reader.result,
                file,
            })
        }

        if (file) {
            reader.readAsDataURL(file);
            this.setState({
                image:reader.result,
                imge:true,
            })

        }
        else {
            console.log("no image");
        }

    }
    removeIt = () => {
        this.setState({
            imge: !this.state.imge
        })
    }
    render() {
        // if (this.state.redirectToLogin) {
        //     return <Redirect path={'/login'} />;
        // }

        return (
            <div className="signpage">
                <div className="container">
                    <img alt="logo" className="slogo" src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcStVPZiBKWQ3XgSGZ7Xgp3G_3qAE2kXAaFgk9kDcMMbvxGA9mxO" />
                    <h2 className="heading">Sign up</h2>
                    <form className="signup">
                        {this.state.imge ? <img className="iconclass" name='image' alt="state" src={this.state.image} /> :
                            <img alt="user" className="profiles" src="user.png"></img>}
                        {this.state.imge ? <div><button onClick={e => this.setchange()}>change</button><button onClick={e => this.removeIt()}>Remove</button> </div> : <input type="file" id="profile" ref="uploadImg" onChange={e => this.fileselected(e)} />}<br />
                        Name<br />
                        <input type="text" id="name" name="name" placeholder="Name" onChange={(e) => this.handleChange(e)} /><br />
                        Email<br />
                        <input type="email" id="email" name="email" placeholder="Email" onChange={(e) => this.handleChange(e)} /><br />
                        Role<br />
                        <select id="role" className="selectstyle" name="role" onChange={e => this.call()}>
                            <option value="1">Teacher</option>
                            <option value="2" >Student</option>
                        </select><br />
                        {this.state.isteacher ? <label>Course</label> : <></>}         <br />
                        {this.state.isteacher ?
                            <select id="state" className="selectstyle" >
                                {this.state.namearray.map((name, index) =>
                                    <option value={name.courseid} key={index}>{name.coursename}</option>
                                )}
                            </select>
                            : <></>
                        }<br />
                        Password<br />
                        <input type="password" id="password" name="password" placeholder="Password" onChange={(e) => this.handleChange(e)} /><br />
                        Confirm Password<br />
                        <input type="password" id="confirm" name="cpassword" placeholder="Confirm Password" onChange={(e) => this.handleChange(e)} /><br />
                        <button className="buttonstyle" id="send" onClick={e => { this.signup(e) }} >Signup</button><br />
                        <div className="buttins">
                            <p className="para">Have an account?</p>
                            <button className="buttonstyle" ><a className="lnine" href="/login">Login</a></button></div>
                    </form>
                </div>
            </div>

        );
    }
}
export default Signup;
