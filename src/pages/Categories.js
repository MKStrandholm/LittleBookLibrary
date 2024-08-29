import React from 'react';
import '../css/custom.css'
import { useState, useEffect } from 'react';
import CategoryDetails from '../components/CategoryDetails'
import ActiveCategories from '../components/ActiveCategories'

export const Categories = () => {

    const [categories, setCategories] = useState([]);
    const [clickedCategory, setClickedCategory] = useState("");
    const [books, setBooks] = useState([]);

    // On render, grab category details using URL hash to populate form
    useEffect(() => {
        async function populateCategoryData() {
            const response = await fetch(`https://localhost:7095/categories`);
            const data = await response.json();
            if (data.status === 400) {
                window.location.href = `/error`;
            }
            // Successfully grabbed category, set values
            else {
                setCategories(data);
            }
        } populateCategoryData();
    }, []);

    return (
        <div>
            <div className="pageTitle">
                <div className="ms-4 display-4">Category Management</div>
            </div>
            <div className="ps-3 pe-3">
                <div className="row mt-5">
                    <div className="col-md-4">
                      <ActiveCategories categories={categories} onClickCategory={setClickedCategory} onSetBooks={setBooks} onSetCategories={setCategories}/>
                    </div>
                    <div className="col-md">
                        <CategoryDetails books={books} clickedCategory={clickedCategory} />
                    </div>
                </div>
            </div>
        </div>
    )
}