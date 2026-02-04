import { useNavigate } from "react-router-dom"
import axios from "../utils/axios";

export const columns = [
    {
        name: "S No",
        selector: (row) => row.sno
    },
    {
        name: "Department Name",
        selector: (row) => row.deptName,
        sortable: true
    },
    {
        name: "Action",
        selector: (row) => row.action
    }
]

export const DepartmentButtons = ({ _id, onDepartmentDelete }) => {
    const navigate = useNavigate();

    const handleDelete = async (id) => {
        const confirm = window.confirm("Do you want to delete?");
        if(confirm) {
            try {
                const response = await axios.delete(`/api/departments/${id}`);
                if(response.data.success) {
                    onDepartmentDelete(id)
                }
            } catch(error) {
                 if(error.response && !error.response.data.success) {
                    alert(error.response.data.error)
                }
            }
        }
    }

    return (
        <div className="flex space-x-3">
            <button 
                className="px-3 py-1 bg-teal-600 text-white rounded hover:bg-teal-700" 
                onClick={() => navigate(`/admin-dashboard/department/${_id}`)}
            >
                Edit
            </button>
             <button 
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={() => handleDelete(_id)}
            >
                Delete
            </button>
        </div>
    )
}
