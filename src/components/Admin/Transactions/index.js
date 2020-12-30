import PopUp from "../../common/PopUp";
import React, {useContext, useState} from "react";
import LibraryContext from "../../../contexts/LibraryContext";
import ListView from "../../common/ListView";
import BookComponent from "../../common/Book";
import s from './transactions.module.css'

const TransactionDetails = ({bookTitle, bookAuthor, userName, date, endDate, close = () => {}}) => {

    return <PopUp onClose={close}>
        <div className={s.detailsWrapper}>
            <div className={s.row}><b>User: </b> {userName}</div>
            <div className={s.row}><b>Book: </b> <div className={s.title}>{bookTitle}</div> | {bookAuthor}</div>
                <div className={s.row}><b>Date: </b> {date}</div>
                <div className={s.row}><b>Until: </b> {endDate}</div>
        </div>
    </PopUp>
}

const TransactionList = ({query = ''}) => {
    const [detailsOf, showDetailsOf] = useState(-1)
    const lib = useContext(LibraryContext)

    const displayedTransactions = query !== '' ? lib.searchTransactions(query) : lib.transactions
    return <ListView>
        {detailsOf !== -1 && <TransactionDetails
            bookTitle={lib.getBook(lib.getTransaction(detailsOf).bookId).title}
            bookAuthor={lib.getBook(lib.getTransaction(detailsOf).bookId)?.authors.join(', ')}
            userName={lib.getUser(lib.getTransaction(detailsOf).userId)?.username || 'DELETED'}
            date={lib.getTransaction(detailsOf).startDate.split("-").join(".")}
            endDate={lib.getTransaction(detailsOf).endDate.split("-").join(".")}
            close={() => showDetailsOf(-1)}
        />}
        {displayedTransactions.map((tran, id) => {
            return <BookComponent key={id} coverURL={lib.getBook(tran.bookId)?.imageURL} authors={["User: " + (lib.getUser(tran.userId)?.username || 'DELETED')]} year={tran.startDate.split("-").join(".") + " - " + tran.endDate.split("-").join(".")} title={lib.getBook(tran.bookId)?.title}
                                  isLast={id === lib.transactions.length - 1} expand={() => showDetailsOf(tran.id)} id={tran.id}/>
        })}
    </ListView>
}

export default TransactionList