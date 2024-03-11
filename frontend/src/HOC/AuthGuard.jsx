import { useNavigate,Navigate  } from "react-router-dom";
import getCookies from "../utils/getCookies";

const AuthGuard = ({children}) => {
    const navigate = useNavigate();
  const token = getCookies();
    if (!token) {
        return <Navigate to="/signin" replace />;
    }
    return children;
}

export default AuthGuard