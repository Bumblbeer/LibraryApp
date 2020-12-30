import s from "./User.module.css";
import React, {useContext, useState} from "react";
import LibraryContext from "../../contexts/LibraryContext";
import PopUp from "./PopUp";
import Book from "./Book";
import Button from "./Button";

const UserDetails = ({userId, onClose=()=>{}}) => {
  const lib = useContext(LibraryContext)

  const books = () => {
    const userTransactions = lib.getUser(userId)?.transactionList
    let bookList = userTransactions.flatMap(( tranId)=>{
      const book = lib.getBook(lib.getTransaction(tranId)?.bookId)
      return (book?.transactionList[book.transactionList.length-1] == tranId && book?.status == 2) ? book : []
    },0)
    return bookList
  }

  return <PopUp onClose={onClose}>
    <div className={s.booksWrapper}>
      <div className={s.title}>{`${lib.getUser(userId)?.username}'s books: `}</div>
      <div className={s.booksList}>
        {books().map((book, id)=><Book id={book?.id} title={book?.title} authors={book?.authors} coverURL={book?.imageURL} expand={()=>{}} isLast={books.length-1 == id} year={book?.year}/>)}
      </div>
      <div className={s.removeUser}>
        {books().length == 0 ? <div className={s.btn}><Button title={'Delete user'} color={'red'} onClick={()=>lib.deleteUser(userId)}/></div> : 'You can not remove the user until he returns all the books' }
      </div>
    </div>
  </PopUp>
}

const User = ({name, userId, isLast = false}) => {
  const [detailsShown, showDetails] = useState(false)

  const lib = useContext(LibraryContext)

  const hasBooks = () => {
    const userTransactions = lib.getUser(userId)?.transactionList
    let booksCount = userTransactions.reduce((count, tranId)=>{
      const book = lib.getBook(lib.getTransaction(tranId)?.bookId)
      return (book?.transactionList[book.transactionList.length-1] == tranId && book?.status == 2) ? count + 1 : count
    },0)
    return booksCount
  }

  return <><div className={s.userWrapper} style={isLast ? { border: 'none' } : {}} onClick={()=>showDetails(true)}>
      <div className={s.userName}>{name}</div>
    <div className={s.hasBooks}>{hasBooks() !==0 && <div className={s.indicator}>{hasBooks()}</div>}</div>
  </div>
    {detailsShown && <UserDetails userId={userId} onClose={()=>showDetails(false)}/>}
    </>
}

export default User
