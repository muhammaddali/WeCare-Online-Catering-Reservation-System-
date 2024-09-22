import React, { useEffect, useReducer, useContext } from "react";
import {
  Button,
  Table,
  OverlayTrigger,
  Tooltip,
  Pagination,
} from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { Store } from "../Store";
import { getError } from "../utils";
import { useNavigate } from "react-router-dom";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        users: action.payload.users,
        page: action.payload.page,
        pages: action.payload.pages,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function UserListScreen() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [{ users, page, pages }, dispatch] = useReducer(reducer, {
    users: [],
    page: 1,
    pages: 1,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/users?page=${page}`,
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    fetchData();
  }, [userInfo.token, page]);

  const deleteHandler = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await axios.delete(
          `${import.meta.env.VITE_SERVER_URL}/api/users/${userId}`,
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );

        if (response.status === 204) {
          toast.success("User deleted successfully");
          const updatedUsers = users.filter((user) => user._id !== userId);
          dispatch({
            type: "FETCH_SUCCESS",
            payload: { users: updatedUsers, page, pages },
          });
        } else {
          toast.error("Failed to delete user");
        }
      } catch (err) {
        if (err.response && err.response.status === 403) {
          toast.error(
            "You cannot delete yourself or a user with associated orders."
          );
        } else {
          toast.error(getError(err));
        }
      }
    }
  };

  const handlePaginationClick = (pageNumber) => {
    navigate(`/admin/users?page=${pageNumber}`);
  };

  return (
    <div>
      <h1 className="text-black">Users</h1>
      <Table bordered>
        <thead>
          <tr>
            <th className="p-3">Id</th>
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Created At</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td className="align-middle">{user._id}</td>
              <td className="align-middle">{user.name}</td>
              <td className="align-middle">{user.email}</td>
              <td className="align-middle">
                {new Date(user.createdAt).toLocaleDateString()}
              </td>
              <td className="align-middle">
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip className="position-fixed">Delete</Tooltip>}
                >
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => deleteHandler(user._id)}
                  >
                    DELETE
                  </Button>
                </OverlayTrigger>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div className="mt-4 text-center">
        <Pagination>
          {[...Array(pages).keys()].map((pageNumber) => (
            <Pagination.Item
              key={pageNumber + 1}
              active={pageNumber + 1 === page}
              onClick={() => handlePaginationClick(pageNumber + 1)}
            >
              {pageNumber + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      </div>
    </div>
  );
}
