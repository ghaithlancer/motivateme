/* eslint-disable no-unused-vars */
import React from 'react'
import { Container, Navbar, Nav, NavDropdown } from 'react-bootstrap'
import { AuthProvider } from '../contexts/AuthContext';
import Signup from './Signup'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Dashboard from './Dashboard'
import Login from './Login'
import PrivateRoute from './PrivateRoute'
import ForgotPassword from './ForgotPassword'
import UpdateProfile from './UpdateProfile'
import Home from './Home'
import NavBar from './NavBar'


export default function App() {
  return (
    <div style={{width: '100%', backgroundColor:"#e09e02"}}>
      <NavBar />
      <Container className="d-flex align-items-center justify-content-center" style={{minHeight: "100vh", }}>
        <div className="w-100" >
          <Router >
          <AuthProvider >
            <Switch>
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
              <PrivateRoute exact path="/" component={Home} />
              <PrivateRoute path="/update-profile" component={UpdateProfile} />
              <Route path="/signup" component={Signup} />
              <Route path="/login" component={Login} />
              <Route path="/forgot-password" component={ForgotPassword} />
            </Switch>
          </AuthProvider>
          </Router>
        </div>
      </Container>
      </div>
  )
}

// export default App;
