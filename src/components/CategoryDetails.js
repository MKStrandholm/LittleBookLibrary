const CategoryDetails = (props) => {

    return (
        <div className="row">
            {props.clickedCategory.name &&
                <div className="col">
                    <h5>Books associated with "{props.clickedCategory.name}"</h5>
                    <div className="border">
                        <div className="table-responsive border">
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th scope="col">Book Name</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {props.books && props.books.length > 0 ?
                                        props.books.map(p => (
                                            <tr key={p.id}>
                                                <td><p className="lead"><strong>{p.title}</strong></p></td>
                                            </tr>
                                        )) :
                                        <tr>
                                            <td className="lead">No books exist within this category at the moment!</td>
                                        </tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            }
            {/* Show an informative message if a category has not yet been clicked */}
            {
                !props.clickedCategory.name &&
                <>
                    <h5>Click a category name in the list to view its associated books...</h5>
                </>
            }

        </div>
    )
}

export default CategoryDetails