import { useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { isLoggedIn } from "../utils/islogged-in";
import FacultyDashboard from "../components/FacultyDashboard";
import StudentDashBoard from "../components/StudentDashboard";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../App";
import { url } from "../utils/url";
export default function Home() {
  const navigate = useNavigate();
  const { islogged, setIslogged } = useContext(AuthContext);
  const [user, setUser] = useState({});
  const signOut = async () => {
    try {
      const res = await fetch(`${url}/api/auth/signout`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      console.log(await res.json());
      localStorage.clear();
      setIslogged(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        await isLoggedIn();
        const payload = jwtDecode(localStorage.getItem("access_token"));
        const res = await fetch(`${url}/api/user/getone`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            collegeid: payload.collegeid,
          }),
        });
        const data = await res.json();
        setUser(data.user);
      } catch (error) {
        console.log(error);
        // toast.error("Error while fetching user");
      }
    };
    getUser();
  }, []);

  useEffect(() => {
    if (!islogged) {
      navigate("/signin");
      return;
    }
  }, [islogged, navigate]);

  return (
    <div className="bg-gray-200">
      <nav className="w-full flex flex-wrap  justify-between mx-auto px-4 py-2 bg-white items-baseline lg:px-5  sticky top-0 shadow-md">
        <div
          type="button"
          onClick={() => signOut()}
          className="cursor-pointer text-white bg-blue-700 hover:bg-blue-800  font-medium rounded-lg text-smtext-center p-2"
        >
          Sign Out
        </div>
        <div className="items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse flex flex-col bg-gray-200 p-1 rounded-md">
          <p>Name: {user.name}</p>
          <p className="capitalize text-xs">{`${user.role} ID: ${user.collegeid}`}</p>
        </div>
      </nav>
      {user && (
        <>
          {user?.role === "faculty" && (
            <FacultyDashboard collegeid={user.collegeid} />
          )}
          {user.role === "student" && (
            <StudentDashBoard collegeid={user.collegeid} />
          )}
        </>
      )}
    </div>
  );
}
