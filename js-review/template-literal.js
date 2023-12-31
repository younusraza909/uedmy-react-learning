import { getBook } from "./data";

let book = getBook(1);

const { title, author, pages, publicationDate } = book;

const summary = `${title}, a ${pages}-page long book, was written by ${author} and published in ${publicationDate}. The book has ${
  hasMovieAdaptation ? "" : "not"
} been adapted as a movie`;
