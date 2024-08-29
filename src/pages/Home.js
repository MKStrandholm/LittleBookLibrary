import React, {useState} from 'react';
import SearchField from '../components/SearchField';
import { BookList } from '../components/BookList';
function Home() {
    const [query, setQuery] = useState("");


    return (
        <div className="Home">
            <div>
                <div id="container">
                    <SearchField onQuery={setQuery} />
                    <hr />
                    <BookList query={query} />
                </div>
            </div>
        </div>
    )
}

export default Home;