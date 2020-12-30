import s from "./Book.module.css";
import React from "react";
import Button from "./Button";
import {Input} from "../Admin/BookForm";
import {useContext, useState} from "react";
import LibraryContext from "../../contexts/LibraryContext";

const Book = ({
                  coverURL, title, authors = [], year, isLast, expand = () => {
    }, isAdmin, id = -1
              }) => {

    return <div onClick={expand} className={s.bookWrapper} style={isLast ? {border: 'none'} : {}}>
            <div className={s.bookCover}>
                <img src={coverURL}/>
            </div>
            <div className={s.bookInfo}>
                <div className={s.bookTitle}>{title}</div>
                <div className={s.bookAuthor}>{authors.join(', ')}</div>
                <div className={s.bookYear}>{year}</div>
            </div>
    </div>
}

export default Book
