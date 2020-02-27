import React from 'react';
import Axios from 'axios';
import "../Pages/auth/signup.css"
class Course extends React.Component{
    constructor(props){
        super(props);
        this.state ={
            duration:"",
            Teacher:[],
            id:0,
            coursename:"",
            department:""

        }
    }
    componentDidMount(){
       
        let {Teacher}=this.state;
        Axios.get(`http://localhost:5233/getteacher`).then(res=>{
        var name=res.data.result
        if(res.data.success===true){
        name.forEach(element => {
            Teacher.push(element);
            
        });  
                this.setState({
                    Teacher
                })
        }
        })
     
    }
    register =()=>{
        let user = JSON.parse(localStorage.getItem('user'));
        console.log(this.props.id)
        if (this.state.isteacher !== true) {
            Axios.post(`http://localhost:5233/select`,
                { course: this.props.id, token: user.token },
                {
                    headers: {
                        contentType: 'application/json',
                        authorization: `Bearer ${user.token}`
                    }
                }).then(response => {
                    console.log(response);
                    if (response.data.success === true) {
                        // console.log(response.data.result)
                        alert("course has been added")
                    }
                }).catch(error => {
                    console.log(error.response)
                });
        }

    }
setup = ()=>{
    const { id } = this.props.match.params
    const bearer = id.split(":");
    this.setState({id : Number(bearer[1]) })
  
    
    Axios.post(`http://localhost:5233/selected`,{course:this.state.id}).then(res=>{
        var course=res.data.result[0];
        this.setState({
            coursename:course.coursename,
            department:course.courseheader
        })
    })

}
setchange =() =>{


}
    render(){
        this.setup();
        return(
            <div>
                <h3>Course Registeration</h3>
                <form>
                    <div className='col-25'>
                   <label>Course Name:</label> </div>
                   <div className='col-75'>
                    <input type="text" value={this.state.coursename}/>
                    </div>
                    <div className='col-25'>
                   <label> Course ID:</label></div>
                   <div className='col-75'>
                    <input type="text" value={this.state.id}/></div>
                    <div className='col-25'><label>Department:</label>
                     </div> 
                    <div className='col-75'><input type="text" value={this.state.department}/></div>
                   <div className='col-25'><label>Duration:</label></div> 
                    
                    <div className='col-75'><select id="duration" name="duration">
                                <option value="4">4 Weeks</option>
                                <option value="8">8 Weeks</option>
                            </select></div>
                   <div className='col-25'><label> Teacher:</label></div>
                    <div className='col-75'><select id="Teacher" onChange={e=>this.setchange()}>
                        {this.state.Teacher.map((data,index)=>
                            <option key ={index} value={data.teacherid}>{data.name}</option>
                        )}
                    </select> </div>
                    <div className='col-75'> <button className="buttonstyle" id="send" onClick={e => { this.register(e) }} >Register</button>
</div>
                </form>
            </div>
        )
    }
}
export default Course;