import React, { Component } from 'react';
import '../css/BookDetails.css'
import '../css/custom.css'

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import toast, { Toaster } from 'react-hot-toast';

export class BookDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            book: {}
        };
    }

    // Grabs hash from URL and uses it as ID for grabbing book entity from backend
    componentDidMount() {
        let hash = window.location.pathname.split('/details/')[1];
        this.grabBook(hash);
    }

    // Grabs book from backend using the URL id param
    async grabBook(id) {
        const response = await fetch(`https://localhost:7095/details/${id}`);
        const data = await response.json();
        if (data.status === 400) {
            window.location.href = `/error`;
        }
        else {
            this.setState({ book: data });
        }
    }

    // Performs the actual delete for the book
    async performDelete(id) {
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            },
        }

        try {
            await fetch(`https://localhost:7095/book/${id}`, requestOptions);
            window.location.href = `/`;
        }
        catch (err) {
            console.error('Error deleting book');
            toast.error(`Failed to delete book, please try again later.`);
        }
    }

    // Prompts for the deletion of a book using an alert
    deleteBookPrompt() {
        confirmAlert({
            title: `You are about to remove "${this.state.book.title}" from your library!`,
            message: 'This action cannot be undone.',
            buttons: [
                {
                    label: 'Remove',
                    onClick: async () => {
                        await this.performDelete(this.state.book.id);
                    }
                },
                {
                    label: 'Cancel',
                }
            ]
        });
    }

    render() {
        return (
            <div>
                <Toaster
                    position="top-center"
                    reverseOrder={false}
                />
                <div className="pageTitle">
                    <div className="ms-4 display-4">Book Details</div>
                </div>
                <div className="m-5">
                    <div className="row">
                        <div className="col-md-3">
                            <div className="card">
                                <img className="img-fluid coverImage" src={this.state.book.cover === null || this.state.book.cover === "" ? "https://admin.squaredlabs.uconn.edu/thumbnail/500/400/contain/best/00000000031.webm" : this.state.book.cover} alt="cover" />
                                <div className="card-body border-dark managePanel">
                                    <div className="row text-center">
                                        <div className="col-4">
                                            <button className="btn" onClick={() => { window.location.href = `/edit/${this.state.book.id}`; }}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#FFF" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                                    <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                                                </svg>
                                            </button>
                                        </div>
                                        <div className="col-4"></div>
                                        <div className="col-4">
                                            <button className="btn" onClick={() => { this.deleteBookPrompt() }}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#FFF" className="bi bi-trash3" viewBox="0 0 16 16">
                                                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-5">
                            <div className="field mb-4"><strong><span className="text-title">{this.state.book.title}</span></strong></div>
                            <div className="field mb-3"><strong>Author:</strong> {this.state.book.author === null || this.state.book.author === "" ? "N/A" : this.state.book.author}</div>
                            <div className="field mb-3"><strong>Year:</strong> {this.state.book.year === null || this.state.book.year === "" ? "N/A" : this.state.book.year}</div>
                            <div className="field mb-3"><strong>Type:</strong> {this.state.book.fiction === null ? "N/A" : this.state.book.fiction === true ? "Fiction" : "Non-fiction"}</div>
                            <div className="field mb-3"><strong>Genre:</strong> {this.state.book.genre === null || this.state.book.genre === "" ? "N/A" : this.state.book.genre}</div>
                            <div className="field mb-3"><strong>Pages:</strong> {this.state.book.pageCount === null ? "N/A" : this.state.book.pageCount}</div>
                            <div className="field mb-3"><strong>ISBN:</strong> {this.state.book.isbn === null || this.state.book.isbn === "" ? "N/A" : this.state.book.isbn}</div>
                            {this.state.book.synopsis === null || this.state.book.synopsis === "" ? <div className="mb-3 mt-4 synopsis">No synopsis found for this title.</div> : <div className="display-6 mb-3 mt-4 synopsis">{this.state.book.synopsis}</div>}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}