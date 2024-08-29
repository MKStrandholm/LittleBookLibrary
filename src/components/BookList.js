import React, { Component } from 'react';
import { BookResult } from './BookResult';
import "../css/custom.css"

export class BookList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: {},
            categories: []
        };
    }

    // Tracking prop changes to update data from sibling component (search)
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.query !== this.props.query) {
            // Run filtering on books
            this.filterBooks(this.props.query);
        }
    }

    // Filter the books by length, simply grabbing the ones that fall under certain page count
    filterBooksByLength(books, length) {
        switch (length) {
            case "short":
                return books.filter(book => book.jointBook.pageCount <= 200);
            case "average":
                return books.filter(book => book.jointBook.pageCount > 200 && book.jointBook.pageCount <= 500);
            case "long":
                return books.filter(book => book.jointBook.pageCount > 500);
            default:
                return books;
        }
    }

    // Filter the books by type, grabbing the values of fiction/non-fiction checkboxes and finding books accordingly
    filterBooksByType(books, fictionChecked, nonFictionChecked, fictionValue) {
        if (fictionChecked && !nonFictionChecked) {
            return books.filter(book => book.jointBook.fiction === fictionValue);
        }
        if (nonFictionChecked && !fictionChecked) {
            return books.filter(book => book.jointBook.fiction !== fictionValue);
        }
        return books;
    }

    // Filter books in the state - create a copy of the array first for data integrity
    filterBooks(query) {
        let filteredBooks = query.books.slice();

        // Filter first by length
        filteredBooks = this.filterBooksByLength(filteredBooks, query.length);
        // Followed by fiction check
        filteredBooks = this.filterBooksByType(filteredBooks, query.fictionChecked, query.nonFictionChecked, true);
        // ...and non-fiction check
        filteredBooks = this.filterBooksByType(filteredBooks, query.nonFictionChecked, query.fictionChecked, false);

        // Update state with filtered books
        this.setState({ data: { books: filteredBooks } });
    }


    // Populates book and category data on component load
    async componentDidMount() {
        await this.populateBookData();
        await this.populateCategoryData();
    }

    // Opens add book page when button is clicked
    addBook() {
        window.location.href = `/new`;
    }

    // Opens category management page
    manageCategories() {
        window.location.href = `/categories`;
    }

    render() {
        return (
            <div>
                <button className="btn btn-success mb-3 me-3" onClick={this.addBook}>Add New Book
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-circle-fill ms-2 mb-1" viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z" />
                    </svg>
                </button>
                <button className="btn btn-dark mb-3" onClick={this.manageCategories}>Manage Categories
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-gear-fill ms-2 mb-1" viewBox="0 0 16 16">
                        <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z" />
                    </svg>
                </button>
                <div className="container m-0 mb-5">
                    <div className="accordion" id="accordionExample">
                        <div className="accordion-item">
                            <h2 className="accordion-header" id="headingOne">
                                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                    Uncategorized
                                </button>
                            </h2>
                            <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne">
                                <div className="accordion-body">
                                    <div className="row mb-4">
                                        {this.state.data.books && this.state.data.books.filter(e => (e.categories.length === 0)).length > 0 ?
                                            this.state.data.books.filter(e => (e.categories.length === 0))
                                                .map(d =>
                                                    <div className="col-md-2" key={d.jointBook.id}>
                                                        <BookResult
                                                            id={d.jointBook.id}
                                                            title={d.jointBook.title}
                                                            synopsis={d.jointBook.synopsis}
                                                            author={d.jointBook.author}
                                                            year={d.jointBook.year}
                                                            genre={d.jointBook.genre}
                                                            isbn={d.jointBook.isbn}
                                                            cover={d.jointBook.cover}
                                                        />
                                                        <br />
                                                    </div>
                                                )
                                            : <div className="lead">No results were found!</div>}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {this.state.categories.length > 0 ?
                            this.state.categories.map(c => (
                                <div className="accordion-item" key={c.id}>
                                    <h2 className="accordion-header" id={`heading${c.id}`}>
                                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${c.id}`} aria-expanded="false" aria-controls={`collapse${c.id}`}>
                                            {c.name}
                                        </button>
                                    </h2>
                                    <div id={`collapse${c.id}`} className="accordion-collapse collapse" aria-labelledby={`heading${c.id}`}>
                                        <div className="accordion-body">
                                            <div className="row mb-4">
                                                {this.state.data.books && this.state.data.books.filter(d => d.categories.some(e => e.name === c.name)).length > 0 ?
                                                    this.state.data.books.filter(d => d.categories.some(e => e.name === c.name))
                                                        .map((d, innerIndex) =>
                                                            (d.categories.map(e => (
                                                                e.name === c.name ?
                                                                    (<div className="col-md-2" key={`${d.jointBook.id}-${innerIndex}`}>
                                                                        <BookResult
                                                                            id={d.jointBook.id}
                                                                            title={d.jointBook.title}
                                                                            synopsis={d.jointBook.synopsis}
                                                                            author={d.jointBook.author}
                                                                            year={d.jointBook.year}
                                                                            genre={d.jointBook.genre}
                                                                            isbn={d.jointBook.isbn}
                                                                            cover={d.jointBook.cover}
                                                                        />
                                                                        <br />
                                                                    </div>) : null
                                                            ))
                                                        ))
                                                    : <div className="lead">No results were found!</div>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )) : ""}
                    </div>
                </div>
            </div>
        );
    }

    // Grabs all book data from backend
    async populateBookData() {
        const response = await fetch('https://localhost:7095/category');
        const data = await response.json();
        let batchData = {
            books: data,
            fictionChecked: false,
            nonFictionChecked: false,
            length: ""
        }
        this.setState({ data: batchData });
    }

    // Grabs all category data from backend
    async populateCategoryData() {
        const response = await fetch('https://localhost:7095/categories');
        const data = await response.json();
        this.setState({ categories: data });
    }
}