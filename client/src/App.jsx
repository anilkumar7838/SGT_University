import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import SignIn from "./pages/sign-in";
import SignUp from "./pages/sign-up";
import ForgotPassowrd from "./pages/forgot-password";
import Home from "./pages/Home";
import { createContext, useEffect, useState } from "react";
import { isLoggedIn } from "./utils/islogged-in";
export const AuthContext = createContext({
  islogged: false,
  user: null,
});
export default function App() {
  const [islogged, setIslogged] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    isLoggedIn()
      .then((data) => {
        setIslogged(data);
        setLoading(false);
      })
      .catch((e) => console.log(e));
  });

  if (loading) {
    return <h1>loading....</h1>;
  }

  const RequiredAuth = ({ type, children }) => {
    if (type === "public") return children;
    if (type === "protected") {
      if (islogged) {
        return children;
      } else {
        return <Navigate to="/signin" replace />;
      }
    }
    if (islogged) return <Navigate to="/" replace />;
    return children;
  };

  return (
    <AuthContext.Provider value={{ user, setUser, islogged, setIslogged }}>
      <BrowserRouter>
        <ToastContainer
          position="top-center"
          closeOnClick
          pauseOnHover
          draggable
          autoClose={1500}
        />
        <Routes>
          <Route
            path="/"
            element={<RequiredAuth type="protected">{<Home />}</RequiredAuth>}
          />
          <Route
            path="/signup"
            element={<RequiredAuth type="auth">{<SignUp />}</RequiredAuth>}
          />
          <Route
            path="/signin"
            element={<RequiredAuth type="auth">{<SignIn />}</RequiredAuth>}
          />
          <Route
            path="/forgotpassword"
            element={
              <RequiredAuth type="auth">{<ForgotPassowrd />}</RequiredAuth>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}
