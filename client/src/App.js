import Navbar from './components/Navbar'
import {BrowserRouter as Router, Switch, Route } from "react-router-dom"
import { ProtectedRoute } from './components/ProtectedRoute'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Logout from './pages/Logout'
import Home from './pages/Home'
import JoinOrganization from './pages/JoinOrganization'
import CreateOrganization from './pages/CreateOrganization'
import Notifications from './pages/Notifications'
import Organization from './pages/Organization'
import OrganizationWaitlist from './pages/OrganizationWaitlist'
import Members from './pages/Members'
import UserSettings from './pages/UserSettings'
import ResetPassword from './pages/ResetPassword'
import RequestPassword from './pages/RequestPassword'
import { useEffect, useState } from 'react'
import { getMethod } from './helpers/request'

function App() {
  const [ userId, setUserId ] = useState(localStorage.getItem('userId'))

  useEffect(async () => {
    const user = await getMethod('/api/users/current-user')
    const userId = user.data._id

    if(userId) {
      localStorage.setItem('userId', userId)
      setUserId(userId)
    }
  })
  return (
    <Router>
      <Navbar userId={userId} />

      <Switch>
        <Route path="/signup">
          <Signup />
        </Route>

        <Route path="/login">
          <Login />
        </Route>

        <Route path="/request-new-password">
          <RequestPassword />
        </Route>

        <Route path="/forgot-password">
          <ResetPassword userId={userId} />
        </Route>

        <Route path="/logout">
          <Logout />
        </Route>

        <ProtectedRoute exact path="/">
          <Home userId={userId} />
        </ProtectedRoute>

        <ProtectedRoute path="/join-organization">
          <JoinOrganization />
        </ProtectedRoute>

        <ProtectedRoute path="/create-organization">
          <CreateOrganization />
        </ProtectedRoute>

        <ProtectedRoute userId={userId} path="/notifications">
          <Notifications />
        </ProtectedRoute>

        <ProtectedRoute path="/organization">
          <Organization userId={userId} />
        </ProtectedRoute>

        <ProtectedRoute path="/waitlist">
          <OrganizationWaitlist />
        </ProtectedRoute>

        <ProtectedRoute path="/members">
          <Members userId={userId} />
        </ProtectedRoute>
        
        <ProtectedRoute path="/user-settings">
          <UserSettings userId={userId} />
        </ProtectedRoute>

      </Switch>
    </Router>
  );
}

export default App