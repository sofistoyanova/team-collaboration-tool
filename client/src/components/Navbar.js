const { NavLink } = require("react-router-dom")

const Navbar = (props) => {
    // if local storage user exists render profile : signup
    console.log(props.userId)
    return (
        <div>
            {props.userId ?
                        <ul className="navbar">
                            <NavLink className="navbar_link" to="/logout">LOGOUT</NavLink>
                            <NavLink className="navbar_link" exact to="/">HOME</NavLink>
                            <NavLink className="navbar_link" to="/notifications">Notifications</NavLink>
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