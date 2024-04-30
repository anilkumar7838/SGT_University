import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { url } from "../utils/url";

export default function StudentDashBoard({ collegeid }) {
  const [hasporoject, setHasPorject] = useState(false);
  const [project, setProject] = useState({});
  const outputs = {
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
    const get = async () => {
      try {
        const res = await fetch(`${url}/api/project/getone`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ collegeid }),
        });

        if (res.status === 404) {
          return;
        }
        const data = await res.json();
        console.log(data);
        setHasPorject(true);
        setProject(data.project);
      } catch (error) {
        console.log(error);

        toast.warn("cant fetch the project");
      }
    };
    get();
  }, [collegeid]);

  const download = (DATA, filename) => {
    // console.log(DATA);
    const { _id, createdAt, updatedAt, __v, ...data } = DATA;
    const headers = Object.keys(data);
    const jsonToCsv = () => {
      let csv = headers.join(",") + "\n";
      [data].forEach((row) => {
        csv +=
          headers
            .map((fieldName) => {
              const escaped = ("" + row[fieldName]).replace(/"/g, '\\"');
              return `"${escaped}"`;
            })
            .join(",") + "\n";
      });

      return csv;
    };

    const downloadCsv = () => {
      const csv = jsonToCsv();
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = filename;
      link.href = url;
      link.click();
    };

    downloadCsv();
  };

  if (!hasporoject) return <div className=""></div>;
  return (
    <div className="w-full max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 mx-auto mt-10 flex flex-col">
      {project && (
        <>
          <div id="project-details">
            <div className="mb-4 text-center font-bold text-xl">
              Project Details
            </div>
            <div className="flow-root">
              <ul className="divide-y divide-gray-200 ">
                {Object.keys(outputs).map((key, i) => (
                  <li
                    key={i}
                    className="pt-3 pb-0 sm:pt-4 flex items-center  justify-between"
                  >
                    <p className="min-w-0 ms-4 text-sm   truncate ">
                      {outputs[key]}
                    </p>
                    <p className=" ">{project[key]}</p>
                  </li>
                ))}
                <li className="pt-3 pb-0 sm:pt-4 flex items-center  justify-between"></li>
              </ul>
            </div>
          </div>
          <div
            onClick={() =>
              download(project, "sudent-" + project.student_collegeid)
            }
            className=" cursor-pointer flex flex-row text-white bg-blue-700 hover:bg-blue-800  font-medium rounded-md text-sm px-5 py-2.5 text-center me-2 my-2 justify-center gap-2 align-top"
          >
            <svg
              width="20px"
              height="20px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="Interface / Download">
                <path
                  id="Vector"
                  d="M6 21H18M12 3V17M12 17L17 12M12 17L7 12"
                  stroke="#ffffff"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
            </svg>
            <p>Download Details</p>
          </div>
        </>
      )}
    </div>
  );
}
