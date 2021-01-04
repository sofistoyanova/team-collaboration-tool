const { NavLink } = require("react-router-dom")

const Navbar = (props) => {
    return (
        <div>
            {props.userId ?
                        <ul className="navbar">
                            <a className="logo" href="/">WEEKLY PLANNER</a>
                            <NavLink className="navbar_link" exact to="/">HOME</NavLink>
                            <NavLink className="navbar_link" to="/notifications">Notifications</NavLink>
                            <NavLink className="navbar_link" to="/user-settings">Settings</NavLink>
                            <NavLink className="navbar_link" to="/logout">LOGOUT</NavLink>
                        </ul>
                        :
                        <ul className="navbar">   
                            <NavLink className="navbar_link" id="signup_link" to="/signup">SIGNUP</NavLink>
                            <NavLink className="navbar_link" to="/login">LOGIN</NavLink>
                        </ul>
            }


        </div>

    )
}

export default Navbar