import React, {useContext, useState} from 'react'
import TabView from "../common/TabView";
import LibraryContext from "../../contexts/LibraryContext";
import ListView from "../common/ListView";
import BookComponent from "../common/Book";
import UserComponent from "../common/User";
import s from "../Library/Library.module.css";
import Header from "../common/Header";
import PopUp from "../common/PopUp";
import BookForm from "./BookForm";
import UserForm from "./UserForm";

const BookDetails = ({
                       imageURL, title, authors, year, desc, close = () => {
  }
                     }) => {

  return <PopUp onClose={close}>
    <div className={s.detailsWrapper}>
      <div className={s.detailsCover}>
        <img src={imageURL}/>
      </div>
      <div className={s.detailsInfo}>
          <div className={s.detailsTitle}>{title}</div>
        <div className={s.detailsAuthor}>{authors}</div>
        <div className={s.detailsYear}>{year}</div>
        <div className={s.detailsDesc}>{desc}</div>
      </div>
    </div>
  </PopUp>
}

const BookList = () => {
  const [detailsOf, showDetailsOf] = useState(-1)
  const {books} = useContext(LibraryContext)
  return <ListView>
    {detailsOf !== -1 && <BookDetails
      title={books[detailsOf].title}
      year={books[detailsOf].year}
      authors={books[detailsOf].authors}
      desc={books[detailsOf].description}
      imageURL={books[detailsOf].imageURL}
      close={() => showDetailsOf(-1)}
    />}
    {books.map((book, id) => {
      return <BookComponent key={id} coverURL={book.imageURL} authors={book.authors} year={book.year} title={book.title}
                   isLast={id === books.length - 1} expand={() => showDetailsOf(id)}/>
    })}
  </ListView>
}
const UsersList = () => {
  const {users} = useContext(LibraryContext)
  return <ListView>
    {users.map((user, id) => {
      return <UserComponent key={id} name={user.username} isLast={id === users.length - 1}/>
    })}
  </ListView>
}



const Admin = () => {
  const lib = useContext(LibraryContext)
  const [formShown, setFormShown] = useState(-1)
  const screens = [
    {
      title: 'Books',
      content: <BookList/>
    },
    {
      title: 'Users',
      content: <UsersList/>
    }
  ]
  const submitBook = async ({title, authors, year, desc: description, coverURL: imageURL}) => {
    await lib.addBook(title, authors, year, description, imageURL)
    setFormShown(-1)
  }
  const submitUser = async ({name}) => {
    await lib.addUser(name)
    setFormShown(-1)
  }


return <div>
  {formShown === 0 && <PopUp onClose={() => setFormShown(-1)}><BookForm onSubmit={submitBook}/></PopUp> }
  {formShown === 1 && <PopUp onClose={() => setFormShown(-1)}><UserForm onSubmit={submitUser}/></PopUp> }
  <Header/>
  <TabView screens={screens} onAdd={setFormShown}/>
</div>
}

export default Admin
