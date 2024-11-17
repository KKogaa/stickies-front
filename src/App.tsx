import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import LogIn from "./pages/Login";
import SignUp from "./pages/SignUp";
import { useAuth } from "./providers/AuthProvider";

const ProtectedRoute: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { isLoggedIn } = useAuth();

  return isLoggedIn ? (
    <>{children}</>
  ) : (
    <Navigate to="/login" replace />
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
};


export default App;
