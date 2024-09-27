import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', email: '' });
  const [updateUser, setUpdateUser] = useState({ id: '', name: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  // Fetch all users from the API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Create a new user
  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });
      if (response.ok) {
        fetchUsers();
        setNewUser({ name: '', email: '' });
        setToastMessage('User created successfully!');
        setShowToast(true);
      } else {
        setToastMessage('Failed to create user');
        setShowToast(true);
      }
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  // Update an existing user
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/users/${updateUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateUser),
      });
      if (response.ok) {
        fetchUsers();
        setUpdateUser({ id: '', name: '', email: '' });
        setToastMessage('User updated successfully!');
        setShowToast(true);
      } else {
        setToastMessage('Failed to update user');
        setShowToast(true);
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  // Delete a user
  const handleDeleteUser = async (id) => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchUsers();
        setToastMessage('User deleted successfully!');
        setShowToast(true);
      } else {
        setToastMessage('Failed to delete user');
        setShowToast(true);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  // Fetch users when the component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="container">
      <h1 className="my-4">Manage Users</h1>
      <p>Here you can create, read, update, and delete users.</p>

      {/* Button to trigger modal for creating a new user */}
      <button className="btn btn-primary mb-4" data-bs-toggle="modal" data-bs-target="#createUserModal">
        Create New User
      </button>

      {/* Spinner for loading */}
      {loading && <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>}

      {/* User list */}
      <h2>User List</h2>
      {users.length > 0 ? (
        <ul className="list-group">
          {users.map((user) => (
            <li key={user.id} className="list-group-item d-flex justify-content-between align-items-center">
              <span>{user.name} ({user.email})</span>
              <div>
                <button
                  className="btn btn-warning me-2"
                  onClick={() => setUpdateUser(user)}
                  data-bs-toggle="modal"
                  data-bs-target="#updateUserModal"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  className="btn btn-danger"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No users found.</p>
      )}

      {/* Toast for notifications */}
      {showToast && (
        <div className="toast show position-fixed top-0 end-0 m-3" role="alert" aria-live="assertive" aria-atomic="true">
          <div className="toast-header">
            <strong className="me-auto">Notification</strong>
            <button type="button" className="btn-close" onClick={() => setShowToast(false)}></button>
          </div>
          <div className="toast-body">
            {toastMessage}
          </div>
        </div>
      )}

      {/* Modal for creating a new user */}
      <div className="modal fade" id="createUserModal" tabIndex="-1" aria-labelledby="createUserModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="createUserModalLabel">Create New User</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form onSubmit={handleCreateUser}>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="submit" className="btn btn-primary">Create User</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Modal for updating an existing user */}
      <div className="modal fade" id="updateUserModal" tabIndex="-1" aria-labelledby="updateUserModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="updateUserModalLabel">Update User</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form onSubmit={handleUpdateUser}>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">User ID</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="User ID"
                    value={updateUser.id}
                    onChange={(e) => setUpdateUser({ ...updateUser, id: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Name"
                    value={updateUser.name}
                    onChange={(e) => setUpdateUser({ ...updateUser, name: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    value={updateUser.email}
                    onChange={(e) => setUpdateUser({ ...updateUser, email: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="submit" className="btn btn-warning">Update User</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
