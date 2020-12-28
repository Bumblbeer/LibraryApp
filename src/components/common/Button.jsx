import React from 'react'
import s from './buttom.module.css'

const Button = ({title='Button', onClick=()=>{}, color='#7fb078', filled=true, fillParent = false, ...props}) => {
  return <button className={s.button}
                 style={filled ? {backgroundColor: color, color: 'white', borderColor: color}
                 : {borderColor: color, color: color, backgroundColor: 'transparent'}}
                  onClick={onClick}
                 {...props}
  >{title}</button>
}

export default Button
