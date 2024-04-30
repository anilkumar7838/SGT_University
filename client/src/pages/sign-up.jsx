import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { url } from "../utils/url";

export default function SignUp() {
  const navigate = useNavigate();
  const [role, setRole] = useState("student");
  const [collegeid, setCollegeId] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (password !== confirmPassword) {
        toast.warn("Password and confirm password should be same!");
        return;
      }

      const res = await fetch(`${url}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collegeid, password, name, role }),
      });
      const { message, user } = await res.json();

      if (!user) {
        return toast.error(message);
      }
      toast.success(message);
      navigate("/signin");
      // console.log(user);
    } catch (error) {
      toast.error("Something went wrong!");
      // console.log({ error }, "kbk");
    }
  };

  return (
    <div className="background-image">
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 ">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm flex">
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
              (role === "student" ? "bg-yellow-300" : "")
            }
            onClick={() => setRole("student")}
          >
            Student Portal
          </button>
          <button
            className={
              "p-2 rounded-3xl px-5 " +
              (role === "faculty" ? "bg-yellow-300" : "")
            }
            onClick={() => setRole("faculty")}
          >
            Faculty Portal
          </button>
        </div>
        <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm bg-white p-5 rounded-md">
          <p className=" font-medium">Sign Up</p>
          <hr className="mb-5 mt-2" />
          <form className="space-y-6" action="#" method="POST">
            <div>
              <label htmlFor="email" className="block text-sm capitalize">
                {role + " Name"}
              </label>
              <div className="mt-2">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 py-1.5 ring-gray-300 ring-1 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm capitalize">
                {role + " ID"}
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
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm  leading-6">
                  Confirm Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                Sign Up
              </button>
            </div>
          </form>
          <p className="mt-10 text-center text-sm text-gray-500">
            Already have an account?
            <a
              href="/signin"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
