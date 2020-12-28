import {database} from "../API/API"
import Enum from "../utils/Enum";

export const placeholder = 'https://minalsampat.com/wp-content/uploads/2019/12/book-placeholder.jpg'

const [
    ACCESSIBLE_SOON,
    ACCESSIBLE,
    RENT,
    UTILIZED,
] = Enum(4)

export const bookStatus = ["Incoming", "Available", "In use", "Utilized"]

class Book {
    constructor(
        title,
        authors = [],
        year,
        description = '',
        imageURL = placeholder,
        transactionList = [],
        status = ACCESSIBLE_SOON,
        id = -1,
    ) {
        this.title = title
        this.authors = authors
        this.year = year
        this.description = description
        this.status = status
        this.imageURL = imageURL === "" ? placeholder : imageURL
        this.transactionList = transactionList
        this.id = id
    }

    utilize = () => {
        this.status = UTILIZED
        return this
    }

    publish = () => {
        this.status = ACCESSIBLE
        return this
    }

    rent = (transactionId) => {
        this.status = RENT
        this.transactionList = [...this.transactionList, transactionId]
        return this
    }

    unrent = () => {
        this.status = ACCESSIBLE
        return this
    }

}

class User {
    constructor(username, transactionList = [], id = -1) {
        this.username = username
        this.transactionList = transactionList
        this.id = id
    }

    addTransaction = (transactionId) => {
        this.transactionList = [...this.transactionList, transactionId]
        return this
    }
}

export class Transaction {
    constructor(bookId, userId, startDate, endDate, id = -1) {
        this.bookId = bookId
        this.userId = userId
        this.startDate = startDate
        this.endDate = endDate
        this.id = id
    }
}


export class Library {
    constructor() {
        this.books = []
        this.transactions = []
        this.users = []
        this.fetchAll()
    }

    fetchAll = async () => {
        const db = await database.pull()
        const books = db?.books
        const users = db?.users
        const transactions = db?.transactions

        this.books = books ? [
            ...books.map(({
                              authors,
                              description,
                              imageURL,
                              status,
                              title,
                              year,
                              id
                          }, index) => new Book(
                title || "",
                authors || [],
                year || "",
                description || "",
                imageURL || placeholder,
                undefined,
                status,
                id || index
            ))] : []

        this.users = users ?
            [...users.map(({
                               username,
                               transactionList,
                               id
                           }, index) => new User(username, transactionList, id || index))] : []

        this.transactions = transactions ?
            [...transactions.map(({
                                      bookId,
                                      userId,
                                      startDate,
                                      endDate,
                                      id
                                  }, index) => new Transaction(bookId, userId, startDate, endDate, id || index))] : []
    }

    transactionStatus = (transactionId) => {
        return this.getTransaction(transactionId).bookId.status
    }

    getBook = (id) => {
        return this.books.filter(book => book.id === id)[0]
    }

    getTransaction = (id) => {
        return this.transactions.filter(tran => tran.id === id)[0]
    }

    getUser = (id) => {
        return this.users.filter(user => user.id === id)[0]
    }

    addBook = async (title, authors, year, description, imageURL) => {
        const pBooks = this.books
        this.books = [...pBooks, new Book(title, authors, year, description, imageURL, [], ACCESSIBLE_SOON, pBooks.length)]
        await database.push(this)
        await this.fetchAll()
    }

    utilizeBook = async (id) => {
        const newThis = {...this, books: this.books.map(b => b.id !== id ? b.utilize() : b)}
        this.books = newThis.books
        await database.push(this)
    }

    publishBook = async (id) => {
        this.getBook(id).publish()
        /* const newThis = {...this, books: this.books.map(book=>{return book.id === id ? book.publish() : book})}
         this.books = newThis.books*/
        await database.push(this)
    }

    createTransaction = async (bookId, userId, startDate, endDate) => {
        const newTran = new Transaction(bookId, userId, startDate, endDate, this.transactions.length)
        this.transactions = [...this.transactions, newTran]
        await database.push(this)
        return newTran
    }

    rentBook = async (bookId, userId, startDate, endDate) => {
        const {id} = await this.createTransaction(bookId, userId, startDate, endDate)
        /*const newBooks = this.books.map(book=>book.id === bookId ? book.rent(id) : book)
        const newUsers = this.users.map(user=>user.id === userId ? user.addTransaction(id) : user)
        this.books = newBooks
        this.users = newUsers*/
        this.getBook(bookId).rent(id)
        this.getUser(id).addTransaction(id)
        await database.push(this)
    }

    unrentBook = async (bookId) => {
        this.getBook(bookId).unrent()
        await database.push(this)
    }


    addUser = async (name) => {
        this.users = [...this.users, new User(name, [], this.users.length)]
        await database.push(this)
    }

    searchBooks = (substring) => {
        return this.books.filter(
            book => {
                return book.title.toLowerCase().includes(substring.toLowerCase()) || book.authors.some(v => v.toLowerCase().includes(substring.toLowerCase()))
            }
        )
    }

}

