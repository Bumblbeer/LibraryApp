import {database} from "../API/API"
import Enum from "../utils/Enum";
import moment from 'moment'

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

    edit = (title, authors, year, description, imageURL) => {
        this.title = title
        this.authors = authors
        this.year = year
        this.description = description
        this.imageURL = imageURL
    }

    utilize = () => {
        this.status = UTILIZED
        return this
    }

    publish = () => {
        this.status = ACCESSIBLE
        return this
    }

    suspend = () => {
        this.status = ACCESSIBLE_SOON
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
        this.startDate = startDate || moment().format("DD-MM-YYYY HH:mm")
        this.endDate = endDate
        this.id = id
    }

    close = () => {
        this.endDate = moment().format("DD-MM-YYYY HH:mm")
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
                            transactionList,
                              id
                          }, index) => new Book(
                title || "",
                authors || [],
                year || "",
                description || "",
                imageURL || placeholder,
                transactionList || [],
                status,
                id || index
            ))] : []

        this.users = users ?
            [...users.map(({
                               username,
                               transactionList,
                               id
                           }, index) => new User(username, transactionList || [], id || index))] : []

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
        if (id === undefined) return null
        return this.books.filter(book => book.id == id)[0]
    }

    getTransaction = (id) => {
        if (id === undefined) return null
        return this.transactions.filter(tran => tran.id == id)[0]
    }

    getUser = (id) => {
        if (id === undefined) return null
        return this.users.filter(user => user.id == id)[0]
    }

    addBook = async (title, authors, year, description, imageURL) => {
        const pBooks = this.books
        this.books = [...pBooks, new Book(title, authors, year, description, imageURL, [], ACCESSIBLE_SOON, pBooks.length)]
        await database.push(this)
        await this.fetchAll()
    }

    utilizeBook = async (id) => {
        const book = this.getBook(id)
        if (book.status == 2)
            this.getTransaction(book.transactionList[book.transactionList.length - 1])?.close()
        book.utilize()
        await database.push(this)
    }

    publishBook = async (id) => {
        const book = this.getBook(id)
        if (book.status == 2)
            this.getTransaction(book.transactionList[book.transactionList.length - 1])?.close()
        book.publish()
        await database.push(this)
    }

    createTransaction = async (bookId, userId, startDate, endDate) => {
        const newTran = new Transaction(bookId, userId, false, endDate, this.transactions.length)
        this.transactions = [...this.transactions, newTran]
        await database.push(this)
        return newTran
    }

    rentBook = async (bookId, userId, startDate, endDate) => {
        const {id} = await this.createTransaction(bookId, userId, startDate, endDate)
        const book = this.getBook(bookId)
        if (book.status == 2)
            this.getTransaction(book.transactionList[book.transactionList.length - 1])?.close()
        book.rent(id)
        this.getUser(userId).addTransaction(id)
        await database.push(this)
    }

    unrentBook = async (bookId) => {
        this.getBook(bookId).unrent()
        await database.push(this)
    }


    addUser = async (name) => {
        let possibleId = this.users.length
        while (this.transactions.some(t=>t.userId == possibleId) || this.users.some(u=>u.id == possibleId)) possibleId++
        this.users = [...this.users, new User(name, [], possibleId)]
        await database.push(this)
    }

    searchBooks = (substring) => {
        return this.books.filter(
            book => {
                return book.title.toLowerCase().includes(substring.toLowerCase()) || book.authors.some(v => v.toLowerCase().includes(substring.toLowerCase()))
            }
        )
    }
    searchUser = (string) => {
        return this.users.filter(u=>u.username == string)[0]
    }
    searchUsers = (string = '') => {
        if (string === '') return this.users
        return this.users.filter(u=>u.username.toLowerCase().includes(string.toLowerCase()))
    }

    editBook = async (id, {title, authors, year, description, imageURL}) => {
        this.getBook(id).edit(title, authors, year, description, imageURL)
        await database.push(this)
    }

    suspendBook = async (id) => {
        this.getBook(id).suspend()
        await database.push(this)
    }

    deleteUser = async (userId) => {
        this.users = this.users.filter((user)=>user.id !== userId)
        await database.push(this)
    }
}

