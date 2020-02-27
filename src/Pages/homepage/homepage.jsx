import React from 'react';
import "./homepage.css";
import Navbar from '../../components/navbar';
import axios from 'axios';
import Sidebar from "../../components/sidebar";



class Homepage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLogged: false,
            isteacher: false,
            name: "",
            email:"",
            dept:"",
            id: 0,
            table: [],
            image:null


        }
    }



    componentDidMount() {
        let user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            axios.get(`http://localhost:5233/?role=${user.role}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            }, { token: user.token }).then(res => {
                console.log(res);
                this.setState({
                    isLogged: true,
                    name: res.data.result.name,
                    image:res.data.result.image,
                    email:res.data.result.email,
                    dept:res.data.result.department
                })


            })
        }

    }




    render() {

        return (
            <div className="page">
                <Navbar name={this.state.name} image={this.state.image} email={this.state.email} dept={this.state.dept}/>
                {this.state.isLogged ? <Sidebar /> : <div></div>}
            </div>
        );
    }

}
export default Homepage;