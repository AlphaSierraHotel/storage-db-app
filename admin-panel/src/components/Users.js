import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Table } from 'react-bootstrap';
import axios from 'axios';
import './Users.css';


const Users = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: '', password: '', role: '' });
  const [updateUser, setUpdateUser] = useState(null);
  const [updatePasswordUser, setUpdatePasswordUser] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');

  const [deleteUserId, setDeleteUserId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validated, setValidated] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:6288';

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('');
        setError('');
      }, 6000); // Toast fades after 6 seconds
      return () => clearTimeout(timer); // Clean up timeout on unmount
    }
  }, [success, error]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/users`);
      setUsers(response.data);
    } catch (err) {
      setError('Error fetching users.');
      console.error(err);
    }
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleShowUpdateModal = (user) => {
    setUpdateUser(user);
    setShowUpdateModal(true);
  };
  const handleCloseUpdateModal = () => setShowUpdateModal(false);

  const handleShowPasswordModal = (user) => {
    setUpdatePasswordUser(user);
    setShowPasswordModal(true);
  };
  const handleClosePasswordModal = () => setShowPasswordModal(false);

  const handleShowDeleteModal = (userId) => {
    setDeleteUserId(userId);
    setShowDeleteModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdateUser((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    const error = validatePasswordStrength(newPassword);
    setPasswordError(error);
  };

  const handleNewPasswordChange = (e) => {
    const password = e.target.value;
    setNewPassword(password);
    const error = validatePasswordStrength(password);
    setNewPasswordError(error);
  };

  const handleConfirmNewPasswordChange = (e) => {
    setConfirmNewPassword(e.target.value);
  };

  const validatePasswordStrength = (password) => {
    const minLength = 8;
    const hasNumber = /\d/;
    const hasSpecialChar = /[!@#$%^&*]/;
    const hasUpperCase = /[A-Z]/;

    if (password.length < minLength) return "Password must be at least 8 characters.";
    if (!hasNumber.test(password)) return "Password must contain at least one number.";
    if (!hasSpecialChar.test(password)) return "Password must contain at least one special character.";
    if (!hasUpperCase.test(password)) return "Password must contain at least one uppercase letter.";

    return ""; // Empty string means the password is strong
  };

  // const handleFormSubmit = async (event) => {
  //   event.preventDefault();
  //   const form = event.currentTarget;
  //   if (form.checkValidity() === false) {
  //     event.stopPropagation();
  //     setValidated(true);
  //     return;
  //   }
  //   try {
  //     console.log("Sending data to backend:", newUser); // Log request data
  //     const response = await axios.post(`${API_URL}/users/create`, newUser);
  //     console.log("Response from backend:", response.data); // Log backend response
  //     setSuccess('User created successfully!');
  //     fetchUsers();
  //     handleCloseModal();
  //   } catch (err) {
  //     setError('Error creating user.');
  //     console.error("Axios error occurred:", error.response ? error.response.data : error.message);
  //     console.error(err);
  //   }
  // };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (newPasswordError) {
      setError(newPasswordError);
      return;
    }

    try {
      console.log("Sending data to backend:", newUser); // Log request data
      const response = await axios.post(`${API_URL}/users/create`, { ...newUser, password: newPassword });
      console.log("Response from backend:", response.data); // Log backend response
      setSuccess('User created successfully!');
      handleCloseModal();
      fetchUsers();
    } catch (err) {
      setError('Error creating user.');
      console.error("Axios error occurred:", error.response ? error.response.data : error.message);
      console.error(err);
    }
  };

  const handleUpdateSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }
    try {
      console.log("Sending data to backend:", updateUser); // Log request data
      const response = await axios.put(`${API_URL}/users/${updateUser.id}`, updateUser);
      console.log("Response from backend:", response.data); // Log backend response
      setSuccess('User updated successfully!');
      fetchUsers();
      handleCloseUpdateModal();
    } catch (err) {
      setError('Error updating user.');
      console.error("Axios error occurred:", error.response ? error.response.data : error.message);
      console.error(err);
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      await axios.put(`${API_URL}/users/${updatePasswordUser.id}/password`, { password });
      setSuccess('Password updated successfully!');
      setPassword('');
      setConfirmPassword('');
      handleClosePasswordModal();
    } catch (err) {
      setError('Error updating password.');
      console.error(err);
    }
  };

  const handleConfirmDelete = async () => {
    if (deleteUserId) {
      try {
        await axios.delete(`${API_URL}/users/${deleteUserId}`);
        setSuccess('User deleted successfully!');
        setUsers(users.filter((user) => user.id !== deleteUserId));
      } catch (err) {
        setError('Error deleting user.');
        console.error(err);
      }
      setShowDeleteModal(false);
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteUserId(null);
  };

  // const handleDeleteUser = async (userId) => {
  //   try {
  //     await axios.delete(`${API_URL}/users/${userId}`);
  //     setSuccess('User deleted successfully!');
  //     setUsers(users.filter((user) => user.id !== userId)); // Remove the user from the state
  //   } catch (err) {
  //     setError('Error deleting user.');
  //     console.error(err);
  //   }
  // };

  return (
    <div>
      <h1>User Management</h1>

      {error && <Alert className="toast-notification" variant="danger">{error}</Alert>}
      {success && <Alert className="toast-notification" variant="success">{success}</Alert>}

      <Button variant="primary" onClick={handleShowModal}>Add User</Button>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
            <Form.Group>
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                onChange={handleInputChange}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid username.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={newPassword}
                onChange={handleNewPasswordChange}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a password.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group>
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                value={confirmNewPassword}
                onChange={handleConfirmNewPasswordChange}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please confirm your password.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group>
              <Form.Label>Role</Form.Label>
              <Form.Control
                as="select"
                name="role"
                onChange={handleInputChange}
                required
              >
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                Please select a role.
              </Form.Control.Feedback>
            </Form.Group>

            {newPasswordError && <Alert variant="danger">{newPasswordError}</Alert>}

            {newPassword && confirmNewPassword && newPassword === confirmNewPassword && (
              <Alert variant="success">Passwords match!</Alert>
            )}

            {newPassword && confirmNewPassword && newPassword !== confirmNewPassword && (
              <Alert variant="danger">Passwords do not match!</Alert>
            )}

            <Button
              type="submit"
              variant="success"
              disabled={
                !newPassword ||
                !confirmNewPassword ||
                newPassword !== confirmNewPassword ||
                newPasswordError !== "" ||
                !newUser.role
              }
            >
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this user?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {updateUser && (
        <Modal show={showUpdateModal} onHide={handleCloseUpdateModal}>
          <Modal.Header closeButton>
            <Modal.Title>Update User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form noValidate validated={validated} onSubmit={handleUpdateSubmit}>
              <Form.Group>
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  value={updateUser.username}
                  onChange={handleUpdateChange}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid username.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group>
                <Form.Label>Role</Form.Label>
                <Form.Control
                  as="select"
                  name="role"
                  value={updateUser.role}
                  onChange={handleUpdateChange}
                  required
                >
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                  Please select a role.
                </Form.Control.Feedback>
              </Form.Group>

              <Button type="submit" variant="primary">Update</Button>
            </Form>
          </Modal.Body>
        </Modal>
      )}

      {updatePasswordUser && (
        <Modal show={showPasswordModal} onHide={handleClosePasswordModal}>
          <Modal.Header closeButton>
            <Modal.Title>Update Password</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handlePasswordSubmit}>
              <Form.Group>
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a password.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group>
                <Form.Label>Confirm New Password</Form.Label>
                <Form.Control
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please confirm your password.
                </Form.Control.Feedback>
              </Form.Group>

              {password && confirmPassword && password === confirmPassword && (
                <Alert variant="success">Passwords match!</Alert>
              )}

              {password && confirmPassword && password !== confirmPassword && (
                <Alert variant="danger">Passwords do not match!</Alert>
              )}

              {passwordError && <Alert variant="danger">{passwordError}</Alert>}

              <Button
                type="submit"
                variant="primary"
                disabled={
                  !password ||
                  !confirmPassword ||
                  password !== confirmPassword ||
                  passwordError !== ""
                }
              >
                Update Password
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      )}

      <Table striped bordered hover responsive className="mt-4">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.role}</td>
              <td>
                <Button
                  variant="info"
                  onClick={() => handleShowUpdateModal(user)}
                  className="mr-2"
                >
                  Edit
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handleShowPasswordModal(user)}
                  className="mr-2"
                >
                  Change Password
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleShowDeleteModal(user.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Users;
