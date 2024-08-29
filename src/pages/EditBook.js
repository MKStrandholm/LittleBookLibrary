import React, { useEffect } from 'react';
import '../css/custom.css'
import { useState } from 'react';

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import toast, { Toaster } from 'react-hot-toast';

export const EditBook = () => {
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
    const [hash, setHash] = useState("");
    // Little confusing, but this is categories tied to the book (can be empty)
    const [categories, setCategories] = useState([]);
    // These are all the categories in the application, for adding purposes
    const [allCategories, setAllCategories] = useState([]);

    const [addCategoryValue, setAddCategoryValue] = useState("");
    const [addBtnDisabled, setAddBtnDisabled] = useState(true);

    // On render, grab book details using URL hash to populate form
    useEffect(() => {
        setHash(window.location.pathname.split('/edit/')[1]);
    }, []);

    useEffect(() => {
        if (hash) {
            async function grabBook() {
                const response = await fetch(`https://localhost:7095/details/${hash}`);
                const data = await response.json();
                if (data.status === 400) {
                    window.location.href = `/error`;
                }
                // Successfully grabbed book, set values
                else {
                    setCover(data.cover);
                    setTitle(data.title);
                    setAuthor(data.author);
                    setYear(data.year);
                    setGenre(data.genre);
                    setIsbn(data.isbn);
                    setSynopsis(data.synopsis);
                    setFiction(data.fiction);
                    setPages(data.pageCount);
                }
            } grabBook();

            async function findAllCategories() {
                const response = await fetch(`https://localhost:7095/categories`);
                const data = await response.json();
                if (data.status === 400) {
                    window.location.href = `/error`;
                }
                // Successfully grabbed categories, set values
                else {
                    setAllCategories(data);
                }
            } findAllCategories();

            // Sets up the book categories for use in the table
            async function setupBookCategories(hash) {
                const response = await fetch(`https://localhost:7095/bookCategories/${hash}`);
                const data = await response.json();
                if (data.status === 400) {
                    window.location.href = `/error`;
                }
                // Successfully grabbed book categories, set value
                else {
                    setCategories(data);
                }
            }
            setupBookCategories(hash);
        }
    }, [hash]);

    // Submits form to backend PUT method
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Create payload with updated values to send
        const payload = {
            cover: cover,
            title: title,
            author: author,
            year: year,
            genre: genre,
            isbn: isbn,
            synopsis: synopsis,
            pageCount: pages,
            fiction: fiction === 'true' ? true : false,
            id: hash
        };

        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        };

        // Redirect back to book details afterwards   
        const response = await fetch(`https://localhost:7095/book/${hash}`, requestOptions);
        const data = response.json();
        if (data.status === 400) {
            console.error('Error updating book');
            toast.error(`Failed to update book, please try again later.`);
        }
        else {
            window.location.href = `/details/${hash}`;
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

    // Performs the actual delete for the category-book junction record
    async function performDelete(categoryId, bookId) {
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            },
        }

        try {
            await fetch(`https://localhost:7095/categoryBookJunction/${categoryId}/${bookId}`, requestOptions);
            // Grab book details to refresh category list
            const response = await fetch(`https://localhost:7095/bookCategories/${hash}`);
            const data = await response.json();
            if (!response.ok) {
                console.error('Failed to fetch book categories');
                toast.error(`Failed to retrieve book categories, please try again later.`);
            }
            else {
                console.log(data);
                setCategories(data);
            }        
        }
        catch (err) {
            console.error('Error deleting category-book junction');
            toast.error(`Failed to delete category-book junction, please try again later.`);
        }
    }

    // Prompt the deletion of a category-book junction using an alert
    function removeFromCategoryPrompt(categoryObj) {
        confirmAlert({
            title: `You are about to remove this book from the "${categoryObj.name}" category!`,
            message: 'This action cannot be undone.',
            buttons: [
                {
                    label: 'Remove',
                    onClick: async () => {
                        await performDelete(categoryObj.id, hash);
                    }
                },
                {
                    label: 'Cancel',
                }
            ]
        });
    }

    // When add category select value changes, check value to toggle Add button as needed
    function checkAddBtn(value) {
        // Add value to state to track for on button click
        setAddCategoryValue(value);
        // Enable button for non-default
        if (value !== "-- Choose a category --") {
            setAddBtnDisabled(false);
        }
        else {
            setAddBtnDisabled(true);
        }
    }

    // Perform the adding of book to category
    async function addBookToCategory() {

        let payload = {
            categoryId: addCategoryValue,
            bookId: hash
        }

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify(payload)
        }
        try {
            await fetch(`https://localhost:7095/categoryBookJunction`, requestOptions);
            // Grab book details to refresh category list
            const response = await fetch(`https://localhost:7095/bookCategories/${hash}`);
            const data = await response.json();
            if (!response.ok) {
                console.error('Failed to fetch book categories');
                toast.error(`Failed to retrieve book categories, please try again later.`);
            }
            else {
                setCategories(data);
            }     
        }
        catch (err) {
            console.error('Error adding book to category');
            toast.error(`Failed to add book to category, please try again later.`);
        }
    }

    return (
        <div id="newBookForm">
            <Toaster
                position="top-center"
                reverseOrder={false}
            />
            <div className="pageTitle">
                <div className="ms-4 display-4">Editing Book Details</div>
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
                            <select className="form-select" value={fiction} onChange={(e) => setFiction((e.target.value))} aria-label="Type of book">
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

                        <button type="submit" className="btn btn-success mt-3 mb-5">Update Book</button>
                    </form>
                </div>
                <div className="col-md-3">
                    <h5 className="text-center">Current Cover</h5>
                    <img className="img-fluid coverImage ms-2 mb-2" src={cover === null || cover === "" ? "https://admin.squaredlabs.uconn.edu/thumbnail/500/400/contain/best/00000000031.webm" : cover} alt="cover" />
                </div>
                <div className="col-md">
                    <h5 className="text-center">Categories</h5>
                    <div className="table-responsive border m-2">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th scope="col">Category Name</th>
                                    <th scope="col"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories && categories.length > 0 ?
                                    categories.map(c => (
                                        <tr key={c.id}>
                                            <td><p className="lead"><strong>{c.name}</strong></p></td>
                                            <td>
                                                <button className="btn float-end" onClick={() => { removeFromCategoryPrompt(c) }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
                                                        <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    )) :
                                    <tr>
                                        <td className="lead">This book does not belong to any categories!</td>
                                        <td></td>
                                    </tr>}
                            </tbody>
                        </table>
                    </div>
                    <div className="row mt-3 ms-1">
                        <div className="col-md-auto">
                            <h6>Add to Category:</h6>
                        </div>
                    </div>
                    <div className="row mt-1 ms-1 mb-3">
                        {
                            allCategories.length === 0 ?
                                (<div className="alert alert-warning">
                                    No categories found, please visit the category management page to create one.
                                </div>) :
                                allCategories && categories && allCategories.length === categories.length ? (
                                    <div className="alert alert-danger">
                                        This book already belongs to all categories!
                                    </div>
                                ) :
                                    allCategories && allCategories.length > 0 ?
                                        <>
                                            <div className="col-md-auto mb-2">
                                                <select className="form-select" onChange={(e) => { checkAddBtn(e.target.value) }} aria-label="Category select">
                                                    <option defaultValue="">-- Choose a category --</option>
                                                    {
                                                        allCategories
                                                            .filter(
                                                                (category) => !categories.some((bookCategory) => bookCategory.id === category.id)
                                                            )
                                                            .map((c) => (
                                                                <option value={c.id} key={c.id}>
                                                                    {c.name}
                                                                </option>
                                                            ))
                                                    }
                                                </select>
                                            </div>
                                            <div className="col-md-auto">
                                                <button className="btn btn-success" disabled={addBtnDisabled} onClick={() => { addBookToCategory() }}>
                                                    Add
                                                </button>
                                            </div>
                                        </>
                                        : <div className="alert alert-danger">No categories were found - please create one in the category management page to add a book to it.</div>
                        }
                    </div>
                </div>
            </div>
        </div >
    )
}