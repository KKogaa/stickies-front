import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import LogIn from "./pages/Login";
import SignUp from "./pages/SignUp";
import { AuthProvider, useAuth } from "./providers/AuthProvider";

const ProtectedRoute: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { isLoggedIn } = useAuth();

  return isLoggedIn ? (
    <>{children}</>
  ) : (
    <Navigate to="/login" replace />
  );
};

const RerouteHome: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { isLoggedIn } = useAuth();

  return isLoggedIn ? (
    <Navigate to="/home" replace />
  ) : (
    <>{children}</>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RerouteHome><Landing /></RerouteHome>} />
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/login" element={<RerouteHome><LogIn /></RerouteHome>} />
          <Route path="/signup" element={<RerouteHome><SignUp /></RerouteHome>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};


export default App;
