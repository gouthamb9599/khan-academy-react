import React from 'react';
import "../styles/navbar.css";
import axios from 'axios';
import Search from './search';
import { withRouter } from 'react-router-dom';

import NotificationBadge from 'react-notification-badge';
import {Effect} from 'react-notification-badge';
// import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';


class Navbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dropis: false,
            search: "",
            isAdmin: localStorage.getItem('admin') ? true : false,
            isLogged: localStorage.getItem('user') ? true : false,
            isteacher: false,
            name: "",
            work: "",
            email: "",
            dept: "",
            profileview: false,
            image: null,
            profileview: false,
            Subject: [],
            Courses: [],
            notification:false,
            getclick:true,
            notifymark:[],
            nonotify:0
        }
    }

    getRefined = (table) => {

        let Courses = [], Subject = [], obb = {}
        table.forEach(element => {
            if (!Courses.includes(element.courseheader))
                Courses.push(element.courseheader)
            obb = Subject[Courses.indexOf(element.courseheader)]
            if (obb)
                obb.list.push({ name: element.coursename, id: element.courseid })
            else
                obb = { list: [{ name: element.coursename, id: element.courseid }] }
            Subject[Courses.indexOf(element.courseheader)] = obb
        });
        this.setState({
            Subject, Courses
        })
    }
    getnotification=()=>{
        let user = JSON.parse(localStorage.getItem('user'));
    this.setState({
        notification:!this.state.notification,
        getclick:false
    }) ;
    axios.post('http://localhost:5233/removenotify',{token:user.token}).then(res=>{
        console.log(res.data);
    })
    }
    courseassign = (e, id) => {
        this.props.history.push(`/courseassign:${id}`)
    }
    componentDidMount() {
        let {notifymark} = this.state;
      
        const getData = async () => {
            try {
                const d = await axios.get('http://localhost:5233/coursed')
                this.getRefined(d.data.result)
                
            } catch (error) {
                console.info(error)
            }
        }
      
        getData()
        let user = JSON.parse(localStorage.getItem('user'));
        if(user===null){
            this.props.history.push('/');
        }
       else if (user && user.role === 1) {
            this.setState({ isteacher: true })

        }
        else if(user.role === 2){
                axios.post('http://localhost:5233/getnotified',{token:user.token}).then(res=>{
                    if(res.data.success===true){
                       console.log(res.data);
                       var i=0;
                       while(res.data.notification > i){
                       notifymark.push(res.data.marks[i]);
                    
                       i++;
                       }
                       this.setState({
                           nonotify:res.data.notification,
                           notifymark,
                    
                       })
                       console.log(this.state.nonotify,this.state.notifymark);
                    }

                })
            }
        // console.log(this.props);
    }
    componentDidUpdate(prevProps) {
        if (this.props.name !== prevProps.name)
            this.setState({
                name: this.props.name,
                image: this.props.image,
                email: this.props.email,
                dept: this.props.dept
            })

    }
    drop = () => {
        this.setState({
            dropis: !this.state.dropis
        })

    }
    handleChange = e => {

        this.setState({ [e.target.name]: e.target.value },
            () => {
                if (this.state.search === ``) {
                    this.setState({ displaysearch: false })
                }
            });
    };
    logout = () => {
        if (this.state.isAdmin === false) {
            this.setState({
                isLogged: false,
                name: ""
            });
            localStorage.removeItem('user');

        }
        else {
            this.setState({
                isAdmin: false,

            })
            localStorage.removeItem('admin');
        }

    }
    profile = () => {
        this.setState({
            profileview: !this.state.profileview
        })
    }
    render() {
        var displaystyle = {
            display: this.state.dropis ? "block" : "none"
        }
        var buttonclass = this.state.dropis ? "active" : " "

        return (
            <div>
                <div className="navbar">
                    <div className="alignnav">
                        <button className={`button_bar`} onClick={this.props.sidebar}><i className="fa fa-bars" aria-hidden="true"></i></button>
                    </div>
                    <div className="remain">
                        <button className={`button_bar ${buttonclass}`} onClick={e => this.drop()} ><span>Courses</span> <span ><i className={`${buttonclass}s fa fa-caret-down`}></i></span></button>

                        <Search />
                        <img alt="logo" className="logo" src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcStVPZiBKWQ3XgSGZ7Xgp3G_3qAE2kXAaFgk9kDcMMbvxGA9mxO" />
                        <div className="switch">
                            {this.state.isAdmin ? <div>Welcome Admin<button className="button_bar" onClick={e => this.logout()} >Logout</button></div> :
                                <div>{
                                    this.state.isLogged ?
                                        <div className="user" >

                                            <div className="notify"> {this.state.isteacher ? <div></div>:<div><button onClick={e=>this.getnotification()}>{this.state.getclick ?<NotificationBadge count={this.state.nonotify} effect={Effect.SCALE}/>:<></>}<img className="notisize" alt="notification" src="Notification-512.png"></img> </button></div>}
                                                {this.state.isteacher ?
                                                <img className="imagesize" alt="teacher" src={this.state.image} /> : <img className="imagesize" alt="student" src={this.state.image}/> }
                                                <button className={`button_barrr ${buttonclass}`} onClick={e => this.profile()}> <span>{this.state.name}</span><span ><i className={`${buttonclass}s fa fa-caret-down`}></i></span></button>
                                            </div>
                                            <button className="button_bar" onClick={e => this.logout()} >logout</button>
                                        </div>
                                        : (<div>
                                            <button className="button_bar"><a href="/login" className="lines">Login</a></button>
                                            <button className="button_bar"><a href="/signup" className="lines">Signup</a></button><br />
                                        </div>)
                                }</div>}
                        </div>
                    </div>
                    <div className="model" style={displaystyle}>
                        <div className="displaylist">
                            {this.state.Courses.map((data, index) =>
                                <div key={index} className="displayc">
                                    <h2 className="courseh">{data}</h2>
                                    <ul className="list">
                                        {this.state.Subject[index].list.map((data, index) =>
                                            <li key={index} onClick={e => this.courseassign(e, data.id)}>{data.name}</li>
                                        )}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {this.state.profileview ?
                    <div className="detailedview">
                        {this.state.isteacher ?
                            <img className="imagesize" alt="teacher" src={this.state.image} /> : <img className="imagesize" alt="student" src={this.state.image} />}
                        <br /><span>{this.state.name}</span><br />
                        <span>{this.state.email}</span><br />
                        {this.state.isteacher ? <span>{this.state.dept}</span> : <></>}

                    </div> : <></>}
                {this.state.notification ? <div className="notiview">
                    {this.state.notifymark.map((data,index)=>
                    
                        <p key={index}>your marks for Subject(id){data.subject} has been changed {data.changedmarks}</p>
                    )}
             
                </div>:<></>}
            </div>
        )
    }


}
export default withRouter(Navbar);