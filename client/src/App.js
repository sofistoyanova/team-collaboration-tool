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

function App() {
  const userId = localStorage.getItem('userId')
  console.log(userId)
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
          <Organization />
        </ProtectedRoute>

        <ProtectedRoute path="/waitlist">
          <OrganizationWaitlist />
        </ProtectedRoute>

      </Switch>
    </Router>
  );
}

export default App