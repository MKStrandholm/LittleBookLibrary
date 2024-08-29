import AppHeader from './components/AppHeader';
import Home from './pages/Home';
import "./App.css";
import { Routes, Route } from 'react-router-dom';
import { BookDetails } from './pages/BookDetails';
import { NewBook } from './pages/NewBook';
import { ErrorPage } from './pages/ErrorPage';
import { EditBook } from './pages/EditBook';
import { EditCategory } from './pages/EditCategory';
import { Categories } from './pages/Categories';
import { NewCategory } from './pages/NewCategory';

function App() {
  return (
    <>
      <AppHeader />
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='details/:bookId' element={<BookDetails />}></Route>
        <Route path="new" element={<NewBook />}></Route>
        <Route path="edit/:bookId" element={<EditBook />}></Route>
        <Route path="/category/new" element={<NewCategory />}></Route>
        <Route path="/category/edit/:categoryId" element={<EditCategory />}></Route>
        <Route path="categories" element={<Categories />}></Route>
        <Route path='*' element={<ErrorPage />}></Route>
      </Routes>
    </>
  );
}

export default App;