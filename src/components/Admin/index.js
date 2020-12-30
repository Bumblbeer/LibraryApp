import React, {useContext, useState} from 'react'
import TabView from "../common/TabView";
import LibraryContext from "../../contexts/LibraryContext";
import ListView from "../common/ListView";
import BookComponent from "./Books/AdminBook";
import UserComponent from "../common/User";
import s from "../Library/Library.module.css";
import Header from "../common/Header";
import PopUp from "../common/PopUp";
import BookForm from "./BookForm";
import UserForm from "./UserForm";
import TransactionList from "./Transactions";
import ManageBookForm from "./Books/ManageBookForm";

const BookDetails = ({
                         imageURL, title, authors=[], year, desc, close = () => {
    }
                     }) => {

    return <PopUp onClose={close}>
        <div className={s.detailsWrapper}>
            <div className={s.detailsCover}>
                <img src={imageURL}/>
            </div>
            <div className={s.detailsInfo}>
                <div className={s.detailsTitle}>{title}</div>
                <div className={s.detailsAuthor}>{authors.join(', ')}</div>
                <div className={s.detailsYear}>{year}</div>
                <div className={s.detailsDesc}>{desc}</div>
            </div>
        </div>
    </PopUp>
}

const BookList = ({
                      editBook = () => {},
                      manageBook = () => {},
                      query = ''
                  }) => {
    const lib = useContext(LibraryContext)
    const [detailsOf, showDetailsOf] = useState(-1)
    const {books} = useContext(LibraryContext)

    let displayedBooks = query !== '' ? lib.searchBooks(query) : lib.books

    return <ListView>
        {detailsOf !== -1 && <BookDetails
            title={lib.getBook(detailsOf).title}
            year={lib.getBook(detailsOf).year}
            authors={lib.getBook(detailsOf).authors}
            desc={lib.getBook(detailsOf).description}
            imageURL={lib.getBook(detailsOf).imageURL}
            close={() => showDetailsOf(-1)}
        />}
        {displayedBooks.map((book, id) => {
            return <BookComponent key={id} coverURL={book.imageURL} authors={book.authors} year={book.year}
                                  title={book.title}
                                  isLast={id === books.length - 1} expand={() => showDetailsOf(book.id)} editBook={editBook}
                                  manageBook={manageBook}
                                  id={book.id}/>
        })}
    </ListView>
}

const UsersList = ({query}) => {
    const lib = useContext(LibraryContext)
    const {users} = useContext(LibraryContext)

    let displayedUsers = query !== '' ? lib.searchUsers(query) : lib.users

    return <ListView>
        {displayedUsers.map((user, id) => {
            return <UserComponent key={id} name={user.username} isLast={id === users.length - 1} userId={user.id}/>
        })}
    </ListView>
}


const Admin = () => {
    const lib = useContext(LibraryContext)
    const [formShown, setFormShown] = useState(-1)
    const [editingBook, setEditingBook] = useState(undefined)
    const [managingBook, setManagingBook] = useState(-1)
    const [query, setQuery] = useState('')


    const editBook = (id) => {
        const book = lib.getBook(id)
        setEditingBook(book)
        setFormShown(0)
    }

    const manageBook = (id) => {
        setManagingBook(id)
    }

    const screens = [
        {
            title: 'Books',
            content: <BookList editBook={editBook} manageBook={manageBook} query={query}/>
        },
        {
            title: 'Users',
            content: <UsersList query={query}/>
        },
        {
            title: 'Transactions',
            content: <TransactionList query={query}/>
        }
    ]
    const submitBook = async ({title, authors, year, description, imageURL}) => {
        if (editingBook)
            await lib.editBook(editingBook.id, {title, authors, year, description, imageURL})
        else
            await lib.addBook(title, authors, year, description, imageURL)
        setFormShown(-1)
    }
    const submitUser = async ({name}) => {
        await lib.addUser(name)
        setFormShown(-1)
    }


    return <div>
        {managingBook !== -1 && <ManageBookForm id={managingBook} onClose={()=>setManagingBook(-1)}/>}
        {formShown === 0 &&
        <PopUp onClose={() => {
            setFormShown(-1)
            setEditingBook(undefined)
        }}><BookForm onSubmit={submitBook} initialState={editingBook}/></PopUp>}
        {formShown === 1 && <PopUp onClose={() => {
            setFormShown(-1)
        }}><UserForm onSubmit={submitUser}/></PopUp>}
        <Header username={'Admin'}/>
        <TabView screens={screens} onAdd={setFormShown} setQuery={setQuery}/>
    </div>
}

export default Admin
