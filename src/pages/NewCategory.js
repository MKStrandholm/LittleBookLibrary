import React from 'react';
import '../css/custom.css'
import { useState } from 'react';

import toast, { Toaster } from 'react-hot-toast';

export const NewCategory = () => {
    const [name, setName] = useState("");

    // Submits form to backend POST method
    const handleSubmit = async (event) => {
        event.preventDefault();

        const payload = {
            name: name,
        }

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        };

        // Redirect back to category management afterwards
        try {
            await fetch('https://localhost:7095/category', requestOptions);
            window.location.href = `/categories`;
        }
        catch (err) {
            console.error('Error creating category');
            toast.error(`Failed to create category, please try again later.`);
        }
    }

    return (
        <div id="newCategoryForm">
            <Toaster
                position="top-center"
                reverseOrder={false}
            />
            <div className="pageTitle">
                <div className="ms-4 display-4">Add New Category</div>
            </div>
            <div className="row mt-3">
                <div className="col-md-4">
                    <form className="ps-3" onSubmit={handleSubmit}>                     
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label"><strong>Name <span className="text-danger">*</span></strong></label>
                            <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} id="nameInput" aria-describedby="nameHelp" required />
                        </div>                  

                        <button type="submit" className="btn btn-success mt-3 mb-5">Add Category</button>
                    </form>
                </div>
            </div>
        </div>
    )
}