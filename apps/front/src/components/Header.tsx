import { useContext } from "react";
import { Link } from "react-router-dom";
import { authContext } from "../contexts/auth.context";

export default function Header() {
    const { token } = useContext(authContext)


    return (
        <div className="h-16 flex justify-between items-center px-4">
            <Link to="/">Sirius</Link>
            <nav>
                <ul>
                    {!token && <li><Link to="/login">Sign In</Link></li>}
                    {token && <li><Link to="/locations">Locations</Link></li>}
                </ul>
            </nav>
        </div>
    )
}