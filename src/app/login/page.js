'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link  from "next/link";
import { Form, FloatingLabel, Button, Container, Row, Col, Alert } from 'react-bootstrap';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      console.log(res.error);
      setError('Invalid email or password');
    } else {
      router.push('/');
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ height: '100vh' }}
    >
      <Row className="w-100">
        <Col
          lg={5}
          md={8}
          sm={12}
          className="mx-auto" // Centers the form horizontally
        >
          <h2 className="text-center mb-4">Login</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <FloatingLabel controlId="floatingEmail" label="Email" className="mb-3">
              <Form.Control
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </FloatingLabel>

            <FloatingLabel controlId="floatingPassword" label="Password" className="mb-3">
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </FloatingLabel>

            <Button variant="primary" type="submit" className="w-100">
              Login
            </Button>
          </Form>
          <p className="mt-3 text-center">Don&apos;t have an account?
            <Link href="/register" className="ml-2">Register</Link>
          </p>
        </Col>
      </Row>
    </Container>
  );
}
