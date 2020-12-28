import {database} from "../API/API"
import Enum from "../utils/Enum";

export const placeholder = 'https://minalsampat.com/wp-content/uploads/2019/12/book-placeholder.jpg'

const [
  ACCESSIBLE_SOON,
  ACCESSIBLE,
  RENT,
  UTILIZED,
] = Enum(4)

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
  }

  publish = () => {
    this.status = ACCESSIBLE
  }

  rent = (transactionId) => {
    this.status = RENT
    this.transactionList = [...this.transactionList, transactionId]
  }

  unrent = () => {
    this.status = ACCESSIBLE
  }

}

