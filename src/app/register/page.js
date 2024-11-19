'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Form, FloatingLabel, Button, Container, Row, Col, Alert } from 'react-bootstrap';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState({});
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError({});
    if (password !== confirmPassword) {
      setError({ confirmPassword: 'Passwords do not match' });
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/login');
      } else {
        setError(data || { message: 'Registration failed' });
      }
    } catch (err) {
      setError({ message: 'An error occurred. Please try again later.' });
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <Row className="w-100">
        <Col lg={5} md={8} sm={12} className="mx-auto">
          <h2 className="text-center mb-4">Register</h2>
          {error?.message && <Alert variant="danger">{error?.message}</Alert>}

          <Form noValidate onSubmit={handleSubmit}>
            <FloatingLabel controlId="floatingUsername" label="Username" className="mb-3">
              <Form.Control
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                isInvalid={error?.username !== undefined}
              />
              <Form.Control.Feedback type="invalid">{error?.username}</Form.Control.Feedback>
            </FloatingLabel>

            <FloatingLabel controlId="floatingEmail" label="Email" className="mb-3">
              <Form.Control
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                isInvalid={error?.email !== undefined}
              />
              <Form.Control.Feedback type="invalid">{error?.email}</Form.Control.Feedback>
            </FloatingLabel>

            <FloatingLabel controlId="floatingPassword" label="Password" className="mb-3">
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                isInvalid={error?.password !== undefined}
              />
              <Form.Control.Feedback type="invalid">{error?.password}</Form.Control.Feedback>
            </FloatingLabel>

            <FloatingLabel controlId="floatingConfirmPassword" label="Confirm Password" className="mb-3">
              <Form.Control
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                isInvalid={error?.confirmPassword !== undefined}
              />
              <Form.Control.Feedback type="invalid">{error?.confirmPassword}</Form.Control.Feedback>
            </FloatingLabel>

            <Button variant="primary" type="submit" className="w-100">
              Register
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
