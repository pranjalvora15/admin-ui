import React, { useState } from "react";
import "./userList.css";

const UserList = ({
  users,
  handleSelect,
  handleEdit,
  handleSave,
  handleDelete,
}) => {
  const [edit, setEdit] = useState({
    name: "",
    email: "",
    role: "",
  });

  /**
   * Function that handles onChange event of input element
   */
  const handleValueUpdate = (e) => {
    const key = e.target.name;
    const value = e.target.value;
    setEdit({ ...edit, [key]: value });
  };

  /**
   * Function that reset state values to empty string and save changes
   * @param {String} id
   * @param {{name:String,email:String,role:String}} newValues
   */
  const saveChanges = (id, newValues) => {
    setEdit({
      name: "",
      email: "",
      role: "",
    });
    handleSave(id, newValues);
  };

  return (
    <div className="table-content">
      {users.map((user) => (
        <div className="table-body" key={user.id}>
          <div>
            <input
              type="checkbox"
              checked={user.selected}
              onChange={(e) => handleSelect(e)}
              id={user.id}
            />
          </div>
          <div className="name-column">
            {user.edit ? (
              <input
                value={edit.name}
                placeholder={user.name}
                onChange={(e) => handleValueUpdate(e)}
                name="name"
              />
            ) : (
              user.name
            )}
          </div>
          <div className="email-column">
            {user.edit ? (
              <input
                value={edit.email}
                placeholder={user.email}
                onChange={(e) => handleValueUpdate(e)}
                name="email"
              />
            ) : (
              user.email
            )}
          </div>
          <div className="role-column">
            {user.edit ? (
              <input
                value={edit.role}
                placeholder={user.role}
                onChange={(e) => handleValueUpdate(e)}
                name="role"
              />
            ) : (
              user.role
            )}
          </div>
          <div className="actions-column">
            {user.edit ? (
              <button
                className="save-button"
                onClick={() => saveChanges(user.id, edit)}
              >
                SAVE
              </button>
            ) : (
              <i
                className="fa-regular fa-pen-to-square edit-icon"
                onClick={() => handleEdit(user.id)}
              ></i>
            )}

            <i
              className="fa-solid fa-trash delete-icon"
              onClick={() => handleDelete(user.id)}
            ></i>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserList;
