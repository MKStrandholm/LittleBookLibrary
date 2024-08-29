import React, { Component } from 'react';
import '../css/BookList.css'

export class BookResult extends Component {

    constructor(props) {
        super(props);
        this.state = {
            
        };
        this.openDetails = this.openDetails.bind(this);
    }

    // Opens details page with specified book ID
    openDetails() {
        window.location.href = `/details/${this.props.id}`;
    }

    render() {
        return (
            <div className="bookItem" onClick={this.openDetails}>                   
                <div className="card">   
                    <div className="imgContainer">
                        <img src={this.props.cover === null || this.props.cover === "" ? "https://admin.squaredlabs.uconn.edu/thumbnail/500/400/contain/best/00000000031.webm" : this.props.cover} className="card-img-top" alt="bookcover" />                  
                        <div className="overlay">
                            <div className="bookTitle">{this.props.title}</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}