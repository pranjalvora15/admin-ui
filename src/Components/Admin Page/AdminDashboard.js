import React, { useState, useEffect } from "react";
import UserList from "../UserList/UserList";
import { config } from "../../App";
import "./adminDashboard.css";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [displayUsers, setDisplayUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [dummyUserArray, setDummyUserArray] = useState([]);

  useEffect(() => {
    (async () => {
      const userData = await fetchUsers();
      // adding selected property in each user object
      userData.forEach((item) => {
        // converting first letter of role string to uppercase
        const roleArr = item.role.split("");
        roleArr[0] = roleArr[0].toUpperCase();
        const role = roleArr.join("");
        item.role = role;
        // adding two new property
        item.selected = false;
        item.edit = false;
      });
      setUsers(userData);
      setDummyUserArray(userData);
      const startIndex = (currentPage - 1) * 10;
      const endIndex = startIndex + 10;
      setDisplayUsers(userData.slice(startIndex, endIndex));
    })();
  }, []);

  useEffect(() => {
    const startIndex = (currentPage - 1) * 10;
    const endIndex = startIndex + 10;
    setDisplayUsers(dummyUserArray.slice(startIndex, endIndex));
  }, [currentPage, dummyUserArray]);

  // Fetch list of user
  const fetchUsers = async () => {
    const response = await fetch(config.endpoint);
    const data = response.json();
    return data;
  };

  // handles the click when user click on any page and changes page accordingly
  const handlePageClick = (e) => {
    const pageNumber = +e.target.textContent;
    setCurrentPage(pageNumber);
  };

  // Function that display next page when user click on next icon button
  const nextPage = () => {
    const startIndex = currentPage * 10;
    if (startIndex > dummyUserArray.length) {
      alert("You have reached to last page");
      return;
    } else {
      setCurrentPage(currentPage + 1);
    }
  };

  // Function that display previous page when user click on next icon button
  const lastPage = () => {
    const startIndex = (currentPage - 1) * 10;
    if (startIndex === 0) {
      alert("You have reached to first page");
      return;
    } else {
      setCurrentPage(currentPage - 1);
    }
  };

  // Function that handles searching
  const handleSearch = (e) => {
    const keyword = e.target.value;
    const filteredUsers = users.filter((user) => {
      if (user.name.includes(keyword)) return true;
      if (user.email.includes(keyword)) return true;
      if (user.role.includes(keyword)) return true;
    });
    setDummyUserArray(filteredUsers);
  };

  // Function to go to last page
  const goToLastPage = () => {
    const length = dummyUserArray.length;
    if (length % 10 === 0) {
      setCurrentPage(length / 10);
    } else {
      setCurrentPage(parseInt(length / 10) + 1);
    }
  };

  // Function that generates page number for pagination
  const generatePagination = () => {
    let pagesArray = [];
    let count = 1;
    for (let i = 0; i < dummyUserArray.length; i = i + 10) {
      const pageCount = (
        <span
          className={count === currentPage ? "selected-page" : null}
          key={count}
          onClick={(e) => handlePageClick(e)}
        >
          {count}
        </span>
      );
      pagesArray.push(pageCount);
      count++;
    }
    return pagesArray;
  };

  // handles checking and unchecking of user
  const handleSelect = (e) => {
    const id = e.target.id;
    for (let i = 0; i < dummyUserArray.length; i++) {
      if (dummyUserArray[i].id === id) {
        // console.log("got");
        dummyUserArray[i].selected = !dummyUserArray[i].selected;
        break;
      }
    }
    setDummyUserArray((prev) => [...prev]);
  };

  // Function that deletes user whose selected property is true
  const deleteUsers = () => {
    const newUserList = dummyUserArray.filter((user) => !user.selected);
    setDummyUserArray(newUserList);
  };

  // Function that handles unchecking and checking of all users that are displayed on current screen
  const selectAll = (e) => {
    const checked = e.target.checked;
    const start = (currentPage - 1) * 10;
    let end = start + 10;
    if (end > dummyUserArray.length) {
      end = dummyUserArray.length;
    }
    setDummyUserArray((prev) => {
      for (let i = start; i < end; i++) {
        prev[i].selected = checked;
      }
      return [...prev];
    });
  };

  /**
   * Function that changes the edit property when edit icon is clicked
   * @param {String} id
   */
  const handleEdit = (id) => {
    for (let i = 0; i < dummyUserArray.length; i++) {
      if (dummyUserArray[i].id === id) {
        // console.log("got");
        dummyUserArray[i].edit = !dummyUserArray[i].edit;
        break;
      }
    }
    setDummyUserArray((prev) => [...prev]);
  };

  /**
   * Function that saves the changes after editing
   * @param {String} id
   * @param {{name:String,email:String,role:String}} updatedValues
   */
  const handleSave = (id, updatedValues) => {
    handleEdit(id);
    for (const user of dummyUserArray) {
      if (user.id === id) {
        if (updatedValues.name !== "") {
          user.name = updatedValues.name;
        }
        if (updatedValues.email !== "") {
          user.email = updatedValues.email;
        }
        if (updatedValues.role !== "") {
          user.role = updatedValues.role;
        }
        break;
      }
    }
    setDummyUserArray((prev) => [...prev]);
  };

  /**
   * Function that deletes user then deleted icon is clicked
   * @param {String} id
   */
  const handleDelete = (id) => {
    const newUserList = dummyUserArray.filter((user) => user.id !== id);
    setDummyUserArray(newUserList);
  };

  return (
    <div className="container">
      <input
        className="search"
        type="text"
        placeholder="Search by name email or role"
        name="search-box"
        onChange={(e) => handleSearch(e)}
      />
      <div name="table">
        <div className="table-header">
          <div>
            <input
              type="checkbox"
              name="select-all"
              onChange={(e) => selectAll(e)}
            />
          </div>
          <div className="name-column">Name</div>
          <div className="email-column">Email</div>
          <div className="role-column">Role</div>
          <div className="actions-column">Actions</div>
        </div>

        {displayUsers && (
          <UserList
            users={displayUsers}
            handleSelect={handleSelect}
            handleEdit={handleEdit}
            handleSave={handleSave}
            handleDelete={handleDelete}
          />
        )}
      </div>
      <footer className="footer">
        <button className="delete-button" onClick={deleteUsers}>
          Delete Selected
        </button>
        <div className="pagination">
          <i
            className="fa fa-angle-double-left first-page"
            aria-hidden="true"
            onClick={() => setCurrentPage(1)}
          ></i>
          <i
            className="fa fa-chevron-left"
            aria-hidden="true"
            onClick={lastPage}
          ></i>
          <div className="pages">{generatePagination()}</div>
          <i
            className="fa fa-chevron-right"
            aria-hidden="true"
            onClick={nextPage}
          ></i>
          <i
            className="fa fa-angle-double-right last-page"
            aria-hidden="true"
            onClick={() => goToLastPage()}
          ></i>
        </div>
      </footer>
    </div>
  );
};

export default AdminDashboard;
