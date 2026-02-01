import { useNavigate } from "react-router-dom"
// import axios from "../utils/axios";

export const columns = [
    {
        name: "S No",
        selector: (row) => row.sno,
        width: "70px"
    },
    {
       name: "Name",
       selector: (row) => row.name,
       sortable: true,
        width: "150px"
    },
    {
        name: "Image",
        selector: (row) => row.profilePicture,
         width: "100px"
    },
    {
        name: "Department",
        selector: (row) => row.deptName,
         width: "150px"
    },
     {
        name: "DOB",
        selector: (row) => row.dob,
        sortable: true,
         width: "120px"
    },
    {
        name: "Action",
        selector: (row) => row.action,
        center: true
    }
]

export const EmployeeButtons = ({ _id }) => {
    const navigate = useNavigate();

    return (
        <div className="flex space-x-3">
            <button 
                className="px-3 py-1 bg-teal-600 text-white rounded hover:bg-teal-700" 
                onClick={() => navigate(`/admin-dashboard/employees/${_id}`)}
            >
                View
            </button>
             <button 
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                 onClick={() => navigate(`/admin-dashboard/employees/edit/${_id}`)}
            >
                Edit
            </button>
             <button 
                className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700"
            >
                Salary
            </button>
              <button 
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
            >
                Leave
            </button>
        </div>
    )
}
