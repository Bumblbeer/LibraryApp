import s from "./Header.module.css";
import React from "react";
import {NavLink} from "react-router-dom";

const Header = ({username}) => {
  return <div className={s.header}>
    <div className={s.title}><b>Library</b>App</div>
    {username && <div className={s.logout}><NavLink style={{color: 'black', textDecoration: 'none'}} to={'/'}><span>{username} <i className={'fas fa-sign-out-alt'}/></span></NavLink></div>}
  </div>
}

export default Header
