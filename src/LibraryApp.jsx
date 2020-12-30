import React, {useContext} from 'react'
import s from './LibraryApp.module.css'
import Library from "./components/Library/Library";
import Header from "./components/common/Header";
import {useParams} from "react-router";
import LibraryContext from "./contexts/LibraryContext";

const LibraryApp = () => {
    const {id} = useParams()
    const lib = useContext(LibraryContext)

    console.log(lib)

  return (
    <div className={s.mainWrapper}>
      <Header username={lib.getUser(id)?.username || 'User'}/>
      <Library id={id}/>
    </div>
  )
}


export default LibraryApp
