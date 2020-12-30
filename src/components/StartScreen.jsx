import React from 'react'
import Header from "./common/Header";
import s from "./StartScreen.module.css"
import {NavLink, Redirect} from "react-router-dom";
import {Input} from "./Admin/BookForm";
import Button from "./common/Button";
import {useState, useContext} from "react";
import LibraryContext from "../contexts/LibraryContext";

const StartScreen = () => {
    const lib = useContext(LibraryContext)

    const [userName, setUsername] = useState('')
    const [user, setUser] = useState(null)
    const [notFound, setNotFound] = useState(false)

    if (user?.id !== undefined) return <Redirect to={'/user/'+user.id}/>

    return <div>
        <Header/>
        <div className={s.grid}>
            <NavLink to={'/admin'} className={s.link}>
                <div className={s.item}><span>I am an <b> admin</b></span></div>
            </NavLink>
            <span>- or -</span>
            <div className={s.item}>
                <div>
                    <Input placeholder={'Username'}
                           style={notFound ? {borderColor: 'red'} : {}}
                           value={userName} onChange={e => {
                        setUsername(e.target.value)
                        setNotFound(false)
                    }}/>
                </div>
                    <div>
                        <Button onClick={()=> {
                            setUser(lib.searchUser(userName))
                            setNotFound(true)
                        }} title={'Sigh In'} color={'#46acd4'} disabled={userName.trim(' ') === ''}/>
                    </div>
            </div>
        </div>
    </div>
}
export default StartScreen
