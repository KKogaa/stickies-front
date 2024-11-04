import { Link } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";

export interface NavbarProps {
  fromLogin?: boolean;
  fromRegister?: boolean;
}

function Navbar({ fromLogin, fromRegister }: NavbarProps) {

  const { isLoggedIn } = useAuth();

  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <Link to="/" className="btn btn-ghost text-xl">Stickies</Link>
      </div>
      {!isLoggedIn ?
        <div className="navbar-end">
          { !fromLogin ? <Link to="/login" className="btn btn-secondary mr-2 ml-2">Log In</Link> : <></> }
          { !fromRegister ? <Link to="/signup" className="btn btn-primary mr-2 ml-2">Registrar</Link> : <></> }
        </div>
        : <></>
      }
    </div>
  );
}

export default Navbar;
