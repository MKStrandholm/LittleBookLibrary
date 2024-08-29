import React, { useEffect } from 'react';
import '../css/custom.css'
import { useState } from 'react';

import toast, { Toaster } from 'react-hot-toast';

export const EditCategory = () => {
    const [name, setName] = useState("");
    const [hash, setHash] = useState("");

    // On render, grab category details using URL hash to populate form
    useEffect(() => {
        setHash(window.location.pathname.split('/edit/')[1]);
    }, []);

    useEffect(() => {
        if (hash) {
            async function grabCategory() {
                const response = await fetch(`https://localhost:7095/category/details/${hash}`);
                const data = await response.json();
                if (data.status === 400) {
                    window.location.href = `/error`;
                }
                // Successfully grabbed category, set value
                else {
                    setName(data.name);
                }
            } grabCategory();
        }
    }, [hash]);

    // Submits form to backend PUT method
    const handleSubmit = (event) => {
        event.preventDefault();

        // Create payload with updated value to send
        const payload = {
            name: name,
            id: hash
        };

        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        };


        // Redirect back to category management afterwards
        fetch(`https://localhost:7095/category/${hash}`, requestOptions)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Failed to update category');
                }
                // Redirect back to category management after successful update
                window.location.href = `/categories`;
            })
            .catch(error => {
                console.error('Error updating category:', error);
                toast.error(`Failed to update category: ${error}`);
            });
    }

    return (
        <div id="newBookForm">
            <Toaster
                position="top-center"
                reverseOrder={false}
            />
            <div className="pageTitle">
                <div className="ms-4 display-4">Editing Category Details</div>
            </div>
            <div className="row mt-3">
                <div className="col-md-4">
                    <form className="ps-3" onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label"><strong>Name <span className="text-danger">*</span></strong></label>
                            <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} id="nameInput" aria-describedby="nameHelp" required />
                        </div>

                        <button type="submit" className="btn btn-success mt-3 mb-5">Update Category</button>
                    </form>
                </div>
            </div>
        </div>
    )
}