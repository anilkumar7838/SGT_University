import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { url } from "../utils/url";
import { P } from "./p";

export default function FacultyDashboard() {
  const [projects, setProjects] = useState(null);
  const [budgetstatus, setBudgetStatus] = useState("pending");

  const [pageno, setPageno] = useState(0);
  const [rowPerPage, setRowPerPage] = useState(5);
  const [projectPerPage, setProjectPerPage] = useState(null);

  const changeRowPerPage = (x) => {
    setRowPerPage(x);
  };

  const changePageNumber = (x) => {
    const index = (pageno + 1) * rowPerPage - 1;
    if (x === -1 && pageno === 0) return;
    if (x === 1 && pageno === projects.length / rowPerPage + 1) return;
    setPageno(pageno + x);
    console.log(index, projectPerPage);
    if (x === 1)
      setProjectPerPage(projects.slice(index + 1, index + 1 + rowPerPage));
    else setProjectPerPage(projects.slice(index - rowPerPage, index));
  };
  const [details, setDetails] = useState({
    email: "",
    project_id: "",
    mentor: "",
    faculty_name: "",
    title: "",
    budget_requested: "",
    budget_status: "",
    stall_number: "",
  });

  const inputs = {
    email: "Email ID",
    project_id: "Project ID",
    mentor: "Mentor",
    faculty_name: "Faculty",
    title: "Title",
    budget_requested: "Budget Request",
    budget_status: "Budget Status",
    stall_number: "Stall Number",
  };

  useEffect(() => {
    const getProjects = async () => {
      try {
        const res = await fetch(`${url}/api/project/getall`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const data = await res.json();
        setProjects(data.allProjects);
        // setProjects(P);
        setProjectPerPage(data.allProjects.slice(0, 5));
      } catch (error) {
        console.log(error);
        toast.error("error fetching projects");
      }
    };
    getProjects();
  }, []);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const res = await fetch(`${url}/api/project/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...details,
          budget_status: budgetstatus,
        }),
      });
      if (res.status === 201) toast.success("Project Created");
      else toast.error("Something went rong");
      setDetails({
        email: "",
        project_id: "",
        mentor: "",
        faculty_name: "",
        title: "",
        budget_requested: "",
        budget_status: "",
        stall_number: "",
      });
      console.log(await res.json());
    } catch (error) {
      console.log(error);
      toast.error("Something went rong");
    }
  };
  const updateProject = () => {};
  return (
    <div className="px-1 py-5 lg:px-0">
      <div className="lg:w-[80%] md:w-full sm:w-full p-4 text-center bg-white borde rounded-lg shadow sm:p-8 mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-wrap justify-normal mb-2 gap-6">
            {Object.keys(inputs)
              .filter((key) => key !== "budget_status")
              .map((key, i) => (
                <div key={i} className="p-1 w-60">
                  <label className="block mb-2 text-sm font-medium text-left">
                    {inputs[key]}
                  </label>
                  <input
                    type={
                      key === "email"
                        ? "email"
                        : key === "budget_requested"
                        ? "number"
                        : "text"
                    }
                    value={details[key]}
                    onChange={(e) =>
                      setDetails({ ...details, [key]: e.target.value })
                    }
                    className="bg-gray-50 border border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    required
                  />
                </div>
              ))}
            <div className="p-1 w-60">
              <label className="block mb-2 text-sm font-medium text-left">
                Budget Status
              </label>
              <select
                id="countries"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                defaultValue={budgetstatus}
                onChange={(e) => setBudgetStatus(e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          <hr />
          <div className="flex items-start py-3 px-2">
            <button
              type="submit"
              className="text-white  bg-blue-600 rounded-md text-sm px-9 py-2.5 me-2 mb-2 font-medium"
            >
              Save Record
            </button>
            <button
              onClick={() =>
                setDetails({
                  email: "",
                  project_id: "",
                  mentor: "",
                  faculty_name: "",
                  title: "",
                  budget_requested: "",
                  budget_status: "",
                  stall_number: "",
                })
              }
              className="text-red-600 border-red-600 border-2  rounded-md text-sm px-9 py-2.5 me-2 mb-2 font-medium"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
      <div className="lg:w-[80%] md:w-full sm:w-full p-4 text-center bg-white borde rounded-lg shadow sm:p-8 mx-auto my-10">
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-2">
          <table className="w-full text-sm text-left rtl:text-right">
            <thead className="text-gray-700">
              <tr>
                {projects &&
                  Object.keys(projects[0])
                    .filter((d) => {
                      if (
                        d !== "_id" &&
                        d !== "createdAt" &&
                        d !== "updatedAt" &&
                        d !== "__v" &&
                        d !== "student_collegeid"
                      )
                        return d;
                      return null;
                    })
                    .map((key, i) => (
                      <th
                        key={i}
                        scope="col"
                        className="px-2 py-4 text-center font-sem"
                      >
                        {inputs[key]}
                      </th>
                    ))}
              </tr>
            </thead>
            <tbody>
              {projects &&
                projectPerPage &&
                projectPerPage.map((project, i) => (
                  <tr className="bg-white border-b  hover:bg-gray-50 " key={i}>
                    {Object.keys(project)
                      .filter((d) => {
                        if (
                          d !== "_id" &&
                          d !== "createdAt" &&
                          d !== "updatedAt" &&
                          d !== "__v" &&
                          d !== "student_collegeid"
                          // d !== ""
                        )
                          return d;
                        return null;
                      })
                      .map((key, j) => (
                        <td
                          className="px-2 py-4 text-center"
                          scope="row"
                          key={j}
                        >
                          {project[key]}
                        </td>
                      ))}
                  </tr>
                ))}
            </tbody>
          </table>
          <nav
            className="flex items-center flex-column flex-wrap md:flex-row justify-between pt-4"
            aria-label="Table navigation"
          >
            <span className="text-sm font-normal text-gray-500  mb-4 md:mb-0 block w-full md:inline md:w-auto">
              Showing
              <span className="font-semibold text-gray-900 ">
                {`${pageno * rowPerPage + 1} -
                  ${pageno * rowPerPage + rowPerPage}`}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900 ">
                {projects?.length}
              </span>
            </span>
            <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
              <li
                onClick={() => changePageNumber(-1)}
                className=" cursor-pointer flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700"
              >
                Previous
              </li>
              <li className="cursor-pointer flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700">
                {pageno + 1}
              </li>
              <li
                onClick={() => changePageNumber(1)}
                className="cursor-pointer flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
              >
                {pageno + 2}
              </li>

              <li
                onClick={() => changePageNumber(1)}
                className="cursor-pointer flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700"
              >
                Next
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}
