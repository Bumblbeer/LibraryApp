import {useEffect, createContext, useState} from "react";
import {Library} from "../data/libraryManagement";

const contextShape = {
    books: [],
    users: [],
    transactions: [],
    addUser: async () => {
    },
    fetchBooks: async () => {
    },
    addBook: async () => {
    },
    utilizeBook: async () => {
    },
    searchBooks: () => {
    },
    getBook: () => {
    },
    getUser: () => {
    },
    getTransaction: () => {
    },
    rentBook: async () => {
    },
    searchUser: async () => {
    },
    deleteUser: async () => {
    },
    searchUsers: async () => {
    },
    editBook: async () => {},
    unrentBook: async () => {
    },
    fetchTransactions: async () => {
    },
    publishBook: async () => {},
    suspendBook: async () => {},
}

const LibraryContext = createContext(contextShape)

export const useLibrary = () => {
    const lib = new Library()
    const [data, setData] = useState(contextShape)

    const init = async () => {
        await lib.fetchAll()
        setData(prevState => ({...prevState, books: lib.books, users: lib.users, transactions: lib.transactions}))
    }

    useEffect(() => {
        setData(p => ({
            ...p,
            fetchAll,
            addBook,
            utilizeBook,
            addUser,
            searchBooks,
            rentBook,
            getUser,
            getTransaction,
            getBook,
            searchUser,
            searchUsers,
            editBook,
            publishBook,
            suspendBook,
            deleteUser
        }))
        init()
    }, [])

    const fetchAll = async () => {
        await lib.fetchAll()
        setData(p => ({...p, books: lib.books, users: lib.users, transactions: lib.transactions}))
    }

    const addBook = async (title, authors, year, description, imageURL) => {
        await lib.addBook(title, authors, year, description, imageURL)
        await fetchAll()
    }

    const addUser = async (name) => {
        await lib.addUser(name)
        await fetchAll()
    }

    const utilizeBook = async (id) => {
        await lib.utilizeBook(id)
        await fetchAll()
    }

    const rentBook = async (bookId, userId, startDate, endDate,) => {
        await lib.rentBook(bookId, userId, startDate, endDate)
        await fetchAll()
    }

    const publishBook = async (id) => {
        await lib.publishBook(id)
        await fetchAll()
    }
    const suspendBook = async (id) => {
        await lib.suspendBook(id)
        await fetchAll()
    }

    const deleteUser = async (id) => {
        await lib.deleteUser(id)
        await fetchAll()
    }

    const searchBooks = lib.searchBooks
    const searchUser = lib.searchUser
    const searchUsers = lib.searchUsers
    const getUser = lib.getUser
    const getBook = lib.getBook
    const getTransaction = lib.getTransaction
    const editBook = lib.editBook

    return data
}

export default LibraryContext
