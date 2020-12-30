import React, {useContext, useState} from "react"
import s from "./Library.module.css"
import LibraryContext from "../../contexts/LibraryContext";
import ListView from "../common/ListView";
import TabView from "../common/TabView";
import Book from "../common/Book";
import PopUp from "../common/PopUp";

const BookDetails = ({
                         id, imageURL, title, authors, year, desc, close = () => {}, status
                     }) => {
    const lib = useContext(LibraryContext)
    const availableDate = lib.getTransaction(lib.getBook(id)?.transactionList[lib.getBook(id).transactionList.length - 1])?.endDate
    const statusUI = () => {
        switch (status) {
            case 0: return {text: "Will be available on", color: '#9d9d9d'}
            case 1: return {text: "Available", color: '#259f00'}
            case 2: return {text: "Will be available on " + availableDate, color: '#9d9d9d'}
            case 3: return {text: "Utilized", color: '#9d9d9d'}
            case 4: return {text: "Is yours for now", color: '#46acd4'}
        }
    }

    return <PopUp onClose={close}>
        <div className={s.detailsWrapper}>
            <div className={s.detailsCover}>
                <img src={imageURL}/>
            </div>
            <div className={s.detailsInfo}>
                <div className={s.detailsTitle}>{title}</div>
                <div className={s.detailsAuthor}>{authors}</div>
                <div className={s.detailsYear}>{year}</div>
                <div className={s.detailsStatus} style={{color: statusUI().color}}>{statusUI().text}</div>
                <div className={s.detailsDesc}>{desc}</div>
            </div>
        </div>
    </PopUp>
}


const BookList = ({query, filter, uid}) => {
    const [detailsOf, showDetailsOf] = useState(-1)
    const lib = useContext(LibraryContext)

    let displayedBooks = query !== '' ? lib.searchBooks(query) : lib.books
    if (filter) displayedBooks = filter(displayedBooks)

    return <ListView>
        {detailsOf !== -1 && <BookDetails
            id={detailsOf}
            title={lib.getBook(detailsOf).title}
            year={lib.getBook(detailsOf).year}
            authors={lib.getBook(detailsOf).authors}
            desc={lib.getBook(detailsOf).description}
            imageURL={lib.getBook(detailsOf).imageURL}
            status={lib.getBook(detailsOf).status == 2 ? lib.getTransaction(lib.getBook(detailsOf)?.transactionList[lib.getBook(detailsOf)?.transactionList.length-1])?.userId == uid ? 4 : 2 : lib.getBook(detailsOf)?.status}
            close={() => showDetailsOf(-1)}
        />}
        {displayedBooks.map((book, id) => {
            return <Book key={id} coverURL={book.imageURL} authors={book.authors} year={book.year} title={book.title}
                         isLast={id === displayedBooks.length - 1} expand={() => showDetailsOf(book.id)}/>
        })}
    </ListView>
}


const Library = ({id}) => {
    const [query, setQuery] = useState('')
    const lib = useContext(LibraryContext)

    const getStatusFilter = (status) => {
        if (status == -1) return (books) => books.filter(b => b.status !=3)
        return (books) => books.filter(b => b.status == status && b.status !=3)
    }

    const getUserFilter = (uID) => {
        return (books) => books.filter(book => book?.status == 2 && lib.getTransaction(book.transactionList[book.transactionList.length - 1])?.userId == uID)
    }


    const screens = [
        {
            title: 'All',
            content: <BookList query={query} uid={id} filter={getStatusFilter(-1)} />
        },
        {
            title: 'Available',
            content: <BookList query={query} filter={getStatusFilter(1)} uid={id}/>
        },
        {
            title: 'Incoming',
            content: <BookList query={query} filter={getStatusFilter(0)} uid={id}/>
        },
        {
            title: 'Yours',
            content: <BookList query={query} filter={getUserFilter(id)} uid={id}/>
        }
    ]

    return <TabView screens={screens} setQuery={setQuery}/>

}

export default Library
