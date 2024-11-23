import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";

export interface NavbarProps {
  fromLogin?: boolean;
  fromRegister?: boolean;
  fromHome?: boolean;
}

function Navbar({ fromLogin, fromRegister, fromHome }: NavbarProps) {

  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    //TODO: refactor this and move to the auth provideer
    localStorage.removeItem('jwtToken');
    setIsLoggedIn(false);
    navigate('/login');
  }

  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <Link to="/" className="btn btn-ghost text-xl">Stickies</Link>
      </div>
      {!isLoggedIn ?
        <div className="navbar-end">
          {!fromLogin ? <Link to="/login" className="btn btn-secondary mr-2 ml-2">Log In</Link> : <></>}
          {!fromRegister ? <Link to="/signup" className="btn btn-primary mr-2 ml-2">Registrar</Link> : <></>}
        </div>
        : <div className="navbar-end">
          {!fromHome ? <button className="btn btn-primary mr-2 ml-2" onClick={handleLogout}>Cerrar sesión</button> : <></>}
        </div>
      }
    </div>
  );
}

export default Navbar;
