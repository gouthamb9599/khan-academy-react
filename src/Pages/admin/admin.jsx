import React from 'react';
import { Switch } from 'react-router-dom';
import { Route } from "react-router-dom";
import Navbar from '../../components/navbar';
import Details from '../../components/getdetails';
import Stalter from '../../components/alterstudents';
import Alterteacher from '../../components/alterteachers';
import Altercourse from '../../components/altercourse';
import '../admin/admin.css';
import AddDetails from '../../components/adddetails';
class Admin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sidebar: false,
            student: false,
            teacher: false,
            course: false,
        }
    }
    toggleFunc = (choice) => {
        let student, teacher, course
        student = teacher = course = false
        switch (choice) {
            case 1:
                student = true;
                this.props.history.push('/admin/adminstudents');
                break;
            case 2:
                teacher = true;
                this.props.history.push('/admin/adminteacher');
                break;
            case 3:
                course = true;
                this.props.history.push('/admin/admincourse');
                break;
            default:
                {
                    course = false;
                    teacher = false;
                    student = false;
                }
        }
        this.setState({
            student, teacher, course
        })
    }
    side = () => {
        this.setState({
            sidebar: !this.state.sidebar
        })
    }
    render() {
        return (
            <div className="page">
                <Navbar name="admin" sidebar={this.side} />
                <div className="mainadmin">
                    <Details toggleFunc={this.toggleFunc} sideBar={this.state.sidebar} />
                    <Switch>
                        <Route path="/admin/adminteacher" component={Alterteacher} />
                        <Route path="/admin/adminstudents" component={Stalter} />
                        <Route path="/admin/admincourse" component={Altercourse} />
                        <Route path="/admin/add/:type" component={AddDetails} />
                    </Switch>
                </div>
            </div>
        )
    }
}
export default Admin;