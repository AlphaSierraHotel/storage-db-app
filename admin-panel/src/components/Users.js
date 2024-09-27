import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal } from 'bootstrap';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'user' });
  const [updateUser, setUpdateUser] = useState({ id: '', username: '', password: '', role: 'user' });
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  // Utility to remove lingering backdrops
  const removeBackdrops = () => {
    document.querySelectorAll('.modal-backdrop').forEach((backdrop) => backdrop.remove());
  };

  // Fetch all users from the API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:6288/api/users');
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
      const response = await fetch('http://localhost:6288/api/users/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });
      if (response.ok) {
        fetchUsers(); // Refresh the user list
        setNewUser({ username: '', password: '', role: 'user' });
        setToastMessage('User created successfully!');
        setShowToast(true);
        closeModal('createUserModal');
      } else {
        const errorText = await response.text();
        setToastMessage(`Failed to create user: ${errorText}`);
        setShowToast(true);
      }
    } catch (error) {
      console.error('Error creating user:', error);
      setToastMessage('Failed to create user');
      setShowToast(true);
    }
  };

  // Update an existing user
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:6288/api/users/${updateUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateUser),
      });
      if (response.ok) {
        fetchUsers();
        setUpdateUser({ id: '', username: '', password: '', role: 'user' });
        setToastMessage('User updated successfully!');
        setShowToast(true);
        closeModal('updateUserModal');
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
      const response = await fetch(`http://localhost:6288/api/users/${id}`, {
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

  // Close modal and dispose its instance
  const closeModal = (modalId) => {
    const modalElement = document.getElementById(modalId);
    if (!modalElement) {
      console.error(`Modal with id ${modalId} does not exist.`);
      return;
    }

    let modalInstance = Modal.getInstance(modalElement);
    if (!modalInstance) {
      modalInstance = new Modal(modalElement);
    }

    modalInstance.hide();
    modalInstance.dispose(); // Dispose to clean up modal
    removeBackdrops(); // Manually remove any lingering backdrops
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
              <span>{user.username} ({user.role})</span>
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
                  <label className="form-label">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Username"
                    value={newUser.username || ''}
                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    value={newUser.password || ''}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Role</label>
                  <select
                    className="form-select"
                    value={newUser.role || 'user'}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    required
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
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
                    value={updateUser.id || ''}
                    onChange={(e) => setUpdateUser({ ...updateUser, id: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Username"
                    value={updateUser.username || ''}
                    onChange={(e) => setUpdateUser({ ...updateUser, username: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    value={updateUser.password || ''}
                    onChange={(e) => setUpdateUser({ ...updateUser, password: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Role</label>
                  <select
                    className="form-select"
                    value={updateUser.role || 'user'}
                    onChange={(e) => setUpdateUser({ ...updateUser, role: e.target.value })}
                    required
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
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