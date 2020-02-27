import React from 'react';
// import logo from './logo.svg';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
// import { Switch } from 'react-router-dom';
import './App.css';
// import history from './history';
import Homepage from './Pages/homepage/homepage';
import Signup from './Pages/auth/signup';
import Login from './Pages/auth/login';
import Course from './components/course';
// import Stalter from './components/alterstudents';
// import Alterteacher from './components/alterteachers';
// import Altercourse from './components/altercourse';
import Admin from './Pages/admin/admin';

// import Model from './model';

function App() {

  return (

    <Router >
        <Switch>
          <Route path="/" exact component={Homepage} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          <Route path="/courseassign:id" component={Course} />
          <Route path="/admin" component={Admin} />
        </Switch>
    </Router>
  );
}

export default App;
