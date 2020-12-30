import React, {useContext, useState} from 'react'
import LibraryContext from "../../../contexts/LibraryContext";
import s from "../../common/Book.module.css";
import Button from "../../common/Button";
import {Input} from "../BookForm";

const AdminBook = ({   coverURL,
                       title,
                       authors = [],
                       year,
                       isLast,
                       expand = () => {},
                       editBook =()=>{},
                       manageBook = () => {},
                       id = -1}) => {
    const lib = useContext(LibraryContext)
    const [uid, setUid] = useState('')


    return <div className={s.bookWrapper} style={isLast ? {border: 'none'} : {}}>
        <div className={s.bookCover} onClick={expand}>
            <img src={coverURL}/>
        </div>
        <div className={s.bookInfo} onClick={expand}>
            <div className={s.bookTitle}>{title}</div>
            <div className={s.bookAuthor}>{authors.join(', ')}</div>
            <div className={s.bookYear}>{year}</div>
        </div>
        <div className={s.buttons}>
            <div style={{width: '100px'}}><Button color={'#46acd4'} filled={false} title={<span><i className={'fas fa-pen'}/> Edit</span>} onClick={()=>editBook(id)}/></div>
            <div style={{width: '100px'}}><Button filled={false} title={<span><i className={'fas fa-cog'}/> Manage</span>} onClick={()=>manageBook(id)}/></div>
        </div>
    </div>
}

export default AdminBook