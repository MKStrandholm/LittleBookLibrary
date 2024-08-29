import React, { useState } from 'react';
import '../css/SearchField.css'

function SearchField({ onQuery }) {
    const [searchBy, setSearchBy] = useState("title");
    const [searchValue, setSearchValue] = useState("");
    const [fictionCheck, setFictionCheck] = useState(false);
    const [nonFictionCheck, setNonFictionCheck] = useState(false);
    const [length, setLength] = useState("");

    // Clear everything by resetting page
    function reset() {
        window.location.href = `/`;
    }

    async function search() {

        // Only perform a search if there was a value provided, appending flags to object
        if (searchValue !== "") {
            const response = await fetch(`https://localhost:7095/${searchBy}/${searchValue}`);
            const data = await response.json();

            let dataBatch = {
                books: data,
                fictionChecked: fictionCheck,
                nonFictionChecked: nonFictionCheck,
                length: length
            }
            onQuery(dataBatch);
        }
        // Empty search value, retrieve all results with flags appended to object
        else {
            const response = await fetch('https://localhost:7095/category');
            const data = await response.json();
            let dataBatch = {
                books: data,
                fictionChecked: fictionCheck,
                nonFictionChecked: nonFictionCheck,
                length: length
            }
            onQuery(dataBatch);
        }
    }

    return (
        <div id="searchFieldBox" className="mt-3">
            <p>You can use the options below to filter and search through books:</p>
            <div className="row">
                <div className="col-sm-3 mb-4">
                    <strong>Search By:</strong>
                    <select className="form-select mb-2" value={searchBy} onChange={(e) => setSearchBy(e.target.value)} aria-label="Book filter">
                        <option value="title">Title</option>
                        <option value="author">Author</option>
                        <option value="year">Year</option>
                        <option value="genre">Genre</option>
                        <option value="isbn">ISBN</option>
                    </select>
                    <strong>Value:</strong>
                    <input type="text" className="form-control" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} id="searchValue" aria-describedby="searchHelp" />
                    <button className="btn btn-primary mt-3" onClick={search}>Search</button>
                    <button className="btn btn-secondary mt-3 ms-1" onClick={reset}>Reset</button>
                </div>
                <div className="col-sm-1"></div>
                <div className="col-sm-3">
                    <div className="row">
                        <div className="col">
                            <strong>Type</strong>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" value={fictionCheck} onChange={(e) => { setFictionCheck(e.target.checked) }} id="fictionCheck" />
                                <label className="form-check-label" htmlFor="fictionChecked">
                                    Fiction
                                </label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" value={nonFictionCheck} onChange={(e) => { setNonFictionCheck(e.target.checked) }} id="nonFictionCheck" />
                                <label className="form-check-label" htmlFor="nonFictionChecked">
                                    Non-fiction
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-2">
                        <div className="col">
                            <strong>Length</strong>
                            <select className="form-select" aria-label="Length select" value={length} onChange={(e) => { setLength(e.target.value) }}>
                                <option defaultValue={""}>-- Choose Length --</option>
                                <option value="short">Short (200 pages & under)</option>
                                <option value="average">Average (201-500 pages) </option>
                                <option value="long">Long (500+ pages) </option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SearchField;