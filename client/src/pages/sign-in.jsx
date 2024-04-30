import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../App";
import { url } from "../utils/url";

export default function SignIn() {
  const { islogged, setIslogged } = useContext(AuthContext);
  const navigate = useNavigate();
  const [toggle, setToggle] = useState("student");
  const [collegeid, setCollegeId] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const res = await fetch(`${url}/api/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ collegeid, password }),
      });
      const { message, access_token } = await res.json();
      if (!access_token) {
        toast.error(message);
        return;
      }
      setIslogged(true);
      toast.success(message);
      localStorage.setItem("access_token", access_token);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (islogged) {
      navigate("/");
      return;
    }
  }, [islogged, navigate]);

  return (
    <div className="background-image">
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 ">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm flex">
          {/* <img
            className="mx-auto h-10 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          /> */}
          <h2 className="mt-10 text-center font-serif text-white ">
            <span className="text-4xl ">
              <span className="">SGT</span> UNIVERSITY
            </span>
            <hr />
            Shree Guru Gobind Singh Tricenternary University
          </h2>
        </div>
        <div className="mt-5 p-1 bg-white sm:mx-auto sm:w-full sm:max-w-sm rounded-3xl justify-between flex font-normal">
          <button
            className={
              "p-2 rounded-3xl px-5 " +
              (toggle === "student" ? "bg-yellow-300" : "")
            }
            onClick={() => setToggle("student")}
          >
            Student Portal
          </button>
          <button
            className={
              "p-2 rounded-3xl px-5 " +
              (toggle === "faculty" ? "bg-yellow-300" : "")
            }
            onClick={() => setToggle("faculty")}
          >
            Faculty Portal
          </button>
        </div>
        <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm bg-white p-5 rounded-md">
          <p className=" font-medium">Sign In</p>
          <hr className="mb-5 mt-2" />
          <form className="space-y-6" action="#" method="POST">
            <div>
              <label htmlFor="email" className="block text-sm capitalize">
                {toggle + " ID"}
              </label>
              <div className="mt-2">
                <input
                  value={collegeid}
                  onChange={(e) => setCollegeId(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 py-1.5 ring-gray-300 ring-1 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm  leading-6">
                  Password
                </label>
                <div className="text-sm">
                  <a
                    href="/forgotpassword"
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 ring-gray-300 ring-1 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                onClick={handleSubmit}
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </button>
            </div>
          </form>
          <p className="mt-10 text-center text-sm text-gray-500">
            Don't have an account?
            <a
              href="/signup"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
