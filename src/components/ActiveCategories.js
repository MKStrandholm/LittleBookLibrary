import React from "react";
import '../css/custom.css'

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import toast, { Toaster } from 'react-hot-toast';

const ActiveCategories = (props) => {

    // Opens add category page when button is clicked
    async function addCategory() {
        window.location.href = `/category/new`;
    }

    // Sets up the categories for use in the table
    async function setupCategory(category) {
        const response = await fetch(`https://localhost:7095/categoryBooks/${category.id}`);
        const data = await response.json();
        if (data.status === 400) {
            window.location.href = `/error`;
        }
        // Successfully grabbed category books, set value
        else {
            props.onSetBooks(data);
        }
        props.onClickCategory(category)
    }


        // Performs the actual delete for the category
        async function performDelete(id) {
            const requestOptions = {
                method: 'DELETE',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8'
                },
            }

            try {
                await fetch(`https://localhost:7095/category/${id}`, requestOptions)
                // Grab book details to refresh category list
                const response = await fetch(`https://localhost:7095/categories`);
                const data = await response.json();
                if (!response.ok) {
                    console.error('Failed to fetch categories');
                    toast.error(`Failed to retrieve categories, please try again later.`);
                }
                else {
                    props.onSetCategories(data);
                }        
            }
            catch (err) {
                console.error('Error deleting category');
                toast.error(`Failed to delete category, please try again later.`);
            }
        }
    
        // Prompt the deletion of a category using an alert
        function deleteCategoryPrompt(categoryObj) {
            confirmAlert({
                title: `You are about to remove the "${categoryObj.name}" category from your library!`,
                message: 'This action cannot be undone, and will remove all associated books from the category.',
                buttons: [
                    {
                        label: 'Remove',
                        onClick: async () => {
                            await performDelete(categoryObj.id);
                        }
                    },
                    {
                        label: 'Cancel',
                    }
                ]
            });
        }


    return (
        <>
            <h5>Active Categories</h5>
            <div className="table-responsive border mb-4">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th scope="col">Category Name</th>
                            <th scope="col"></th>
                            <th scope="col"></th>
                            <th scope="col">
                                <button className="btn float-end" onClick={addCategory}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#198754" className="bi bi-plus-circle-fill" viewBox="0 0 16 16">
                                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z" />
                                    </svg>
                                </button>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.categories && props.categories.length > 0 ?
                            props.categories.map(c => (
                                <tr key={c.id}>
                                    <td><p className="lead text-primary catName" onClick={() => { setupCategory(c) }}><strong>{c.name}</strong></p></td>
                                    <td></td>
                                    <td>
                                        <button className="btn float-end" onClick={() => { window.location.href = `/category/edit/${c.id}`; }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                                <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                                            </svg>
                                        </button>
                                    </td>
                                    <td>
                                        <button className="btn float-end" onClick={() => { deleteCategoryPrompt(c) }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
                                                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            )) :
                            <tr>
                                <td className="lead">No categories exist at the moment!</td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>}

                    </tbody>
                </table>
            </div>
        </>
    )
}

export default ActiveCategories