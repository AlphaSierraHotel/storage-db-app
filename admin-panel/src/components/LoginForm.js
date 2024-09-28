// File: src/components/LoginForm.js
import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css';  // Import the CSS file

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:6288';

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Post login data to the backend
            const response = await axios.post(`${API_URL}/login`, {
                username,
                password,
                rememberMe,
            });

            // Extract JWT from response
            const { token } = response.data;

            // Store token based on "remember me" choice
            if (rememberMe) {
                localStorage.setItem('jwtToken', token); // Store JWT in local storage
            } else {
                sessionStorage.setItem('jwtToken', token); // Store JWT in session storage
            }

            // Redirect or perform further actions on successful login
            console.log('Login successful!');

            // Redirect to dashboard on successful login
            navigate('/dashboard');

        } catch (error) {
            // Display error if login fails
            setError('Login failed. Please check your credentials and try again.');
        }
    };

    return (
        <Container fluid className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <Row>
                <Col xs={12} md={6} lg={4}>
                    <div className="login-container">
                        <h2 className="text-center mb-4">Login</h2>

                        {error && <Alert variant="danger">{error}</Alert>}

                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="formUsername">
                                <Form.Label>Username</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="formPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="formRememberMe">
                                <Form.Check
                                    type="checkbox"
                                    label="Remember Me"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                            </Form.Group>

                            <Button variant="primary" type="submit" className="w-100">
                                Login
                            </Button>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default LoginForm;
