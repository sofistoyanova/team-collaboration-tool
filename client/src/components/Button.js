import React from 'react'

const Button = (props) => {
    const { link, text } = props
    return(
        <a class="button" href={ link }> { text } </a>
    )
}

export default Button