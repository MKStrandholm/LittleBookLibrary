import React from 'react';
import '../css/custom.css'
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

export const NewBook = () => {
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [year, setYear] = useState("");
    const [fiction, setFiction] = useState(false);
    const [pages, setPages] = useState(0);
    const [genre, setGenre] = useState("");
    const [isbn, setIsbn] = useState("");
    const [synopsis, setSynopsis] = useState("");
    const [cover, setCover] = useState("");
    const [fileSuccess, setFileSuccess] = useState(false);

    // Submits form to backend POST method
    const handleSubmit = async (event) => {
        event.preventDefault();

        const payload = {
            cover: cover,
            title: title,
            author: author,
            year: year,
            fiction: fiction,
            genre: genre,
            pageCount: pages,
            isbn: isbn,
            synopsis: synopsis
        }

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        };

        try {
            await fetch('https://localhost:7095/book', requestOptions);
            window.location.href = `/`;
        }
        catch (err) {
            console.error('Error creating book');
            toast.error(`Failed to create book, please try again later.`);
        }
    }

    // Converts file object to base64 string for DB
    async function getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => {
                resolve(reader.result)
            }
            reader.onerror = reject
        })
    }

    // Updates cover image with base64 string
    const updateFile = async (e) => {
        const response = await getBase64(e);
        if (response === "" || response === null) {
            console.log("Failed to get base64");
            toast.error("Failed to get base64 image");
        }
        else {
            setCover(response);
            setFileSuccess(true);
        }
    }
    
    return (
        <div id="newBookForm">
            <Toaster
                position="top-center"
                reverseOrder={false}
            />
            <div className="pageTitle">
                <div className="ms-4 display-4">Add New Book</div>
            </div>
            <div className="row mt-3">
                <div className="col-md-4">
                    <form className="ps-3" onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="formFile" className="form-label"><strong>Cover Image</strong></label>
                            {fileSuccess === true ? <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#14A44D" className="bi bi-check-circle ms-2" viewBox="0 0 16 16">
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                <path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05" />
                            </svg> : ""}
                            <input className="form-control" onChange={(e) => updateFile(e.target.files[0])} type="file" id="formFile" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="title" className="form-label"><strong>Title <span className="text-danger">*</span></strong></label>
                            <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} id="titleInput" aria-describedby="titleHelp" required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="author" className="form-label"><strong>Author</strong></label>
                            <input type="text" className="form-control" value={author} onChange={(e) => setAuthor(e.target.value)} id="authorInput" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="year" className="form-label"><strong>Year</strong></label>
                            <input type="text" className="form-control" value={year} onChange={(e) => setYear(e.target.value)} id="yearInput" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="type" className="form-label"><strong>Type</strong></label>
                            <select className="form-select" defaultValue="false" onChange={(e) => setFiction(Boolean(e.target.value))} aria-label="Type of book">
                                <option value="false">Non-fiction</option>
                                <option value="true">Fiction</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="genre" className="form-label"><strong>Genre</strong></label>
                            <input type="text" className="form-control" value={genre} onChange={(e) => setGenre(e.target.value)} id="genreInput" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="isbn" className="form-label"><strong>ISBN</strong></label>
                            <input type="text" className="form-control" value={isbn} onChange={(e) => setIsbn(e.target.value)} id="isbnInput" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="pageCount" className="form-label"><strong>Pages</strong></label>
                            <input type="number" min="0" className="form-control" value={Number(pages)} onChange={(e) => setPages(Number(e.target.value))} id="pagesInput" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="synopsis" className="form-label"><strong>Synopsis</strong></label>
                            <textarea className="form-control" id="synopsisInput" value={synopsis} onChange={(e) => setSynopsis(e.target.value)} rows="3"></textarea>
                        </div>

                        <button type="submit" className="btn btn-success mt-3 mb-5">Add Book</button>
                    </form>
                </div>
            </div>
        </div>
    )
}