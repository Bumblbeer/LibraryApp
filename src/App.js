import logo from './logo.svg';
import './App.css';
import React, {useContext, useEffect, useRef, useState} from "react"
import {Book, Library} from "./data/libraryManagement";
import LibraryContext from "./contexts/LibraryContext";
import Button from "./components/common/Button";
import BookForm from "./components/Admin/BookForm";

const BookComponent = ({title, authors, coverURL, status, utilize=()=>{}}, toggleAccess =()=>{}) => {
  console.log(title)
  console.log(authors)
  return <div style={{border: "1px black solid", margin: "1rem", padding: "1rem"}}>
    <img src={coverURL} style={{height: '50px'}}/>
    <div>{title}</div>
    <div>{authors ? authors[0] : ""}</div>
    <div>{status}</div>
    <Button onClick={utilize} filled={false} title={<span><i className={'fas fa-plus'}/>utilize</span>}/>
    <Button onClick={toggleAccess} title={<span><i className={'fas fa-times'}/>toggle</span>}/>
  </div>
}

function App() {
  const lib = useContext(LibraryContext)
  const [isLoading, setLoading] = useState(true)

  useEffect(()=>{
    lib.fetchBooks().then(()=>setLoading(false))
  }, [])

  const addBook = async ({title, authors, year, description, imageURL}) => {
    const newBook = new Book(title, authors, year, description, imageURL)
    await lib.addBook(newBook)
  }

  console.log(lib)
  const books = lib.books
  const booksC = books.length > 0 ? books.map(
    (book, id)=><BookComponent title={book.title}
                      authors={book.authors}
                      coverURL={book.imageURL}
                      status={book.status}
                      utilize={()=>lib.utilizeBook(id)}
                      toggleAccess={()=>{}}
    />) : <div>'no books'</div>

  return (
    isLoading ? <div>loading</div> :
      <div className="App">
        <BookForm onSubmit={addBook}/>
        <div>
          {booksC}
        </div>
      </div>
  );
}

export default App;
