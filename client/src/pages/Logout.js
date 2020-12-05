import React, { useEffect } from 'react'

const Logout = () => {
    window.location.replace("/api/users/logout")    
    localStorage.removeItem('userId')
}

export default Logout