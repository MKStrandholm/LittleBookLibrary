import { Navbar, NavbarBrand } from 'reactstrap';
import '../css/NavMenu.css';

export default function AppHeader() {
    return (
        <header>
        <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow" light>
         <NavbarBrand href="/">&#128218; <span className="boldCapital">L</span>ittle <span className="boldCapital">L</span>ibrary</NavbarBrand>
        </Navbar>
      </header>
    )
  }
  