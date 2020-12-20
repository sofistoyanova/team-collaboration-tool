import React from 'react'

const Button = (props) => {
    const { link, text, nodeClass } = props
    return(
        <a className={nodeClass + "  button"} href={ link }> { text } </a>
    )
}

export default Button