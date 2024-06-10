import {Form, Button, Container, Row, Col, Card, FloatingLabel} from 'react-bootstrap';
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import SERVER_URL from '../constants/constants';

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        try {
            e.preventDefault();
            const url = SERVER_URL + "/auth/login";
            const login = {
                username,
                password
            };
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(login)
            });

            if (response.ok) {
                setError("");
                navigate("/");
            } else {
                setError("Invalid Login Credentials. Please Try Again!");
            }
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <Container className="d-flex justify-content-center align-items-center min-vh-100">
            <Row>
                <Col>
                    <Card style={{width: "25rem"}}>
                        <Card.Body className="text-dark">
                            <Card.Title className="mt-2 mb-4 text-center fs-2">RemindMe</Card.Title>
                            <Form onSubmit={handleLogin}>
                                <Form.Group className="mb-3 text-dark">
                                    <FloatingLabel controlId="floatingInput" label="Username">
                                        <Form.Control
                                            className="text-dark"
                                            type="text"
                                            name="username"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            placeholder="Username"/>
                                    </FloatingLabel>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <FloatingLabel controlId="floatingPassword" label="Password">
                                        <Form.Control
                                            className="text-dark"
                                            type="password"
                                            name="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Password"/>
                                    </FloatingLabel>
                                </Form.Group>
                                <Button className="w-100 mb-4" variant="outline-primary" type="submit">Log In</Button>
                                {
                                    error &&
                                    <div className='text-center'>
                                        <Form.Text className="text-danger">{error}</Form.Text>
                                    </div>
                                }
                            </Form>
                        </Card.Body>
                    </Card>
                    <Card className='mt-3'>
                        <Card.Body className="text-dark">
                            <Card.Text className="text-center">Don't have an account? <Card.Link
                                className="text-decoration-none" href="/signup">Sign Up</Card.Link></Card.Text>
                        </Card.Body>
                    </Card>
                    <p className="mt-3 text-center small text-dark">&copy; 2023 &mdash; RemindMe</p>
                </Col>
            </Row>
        </Container>
    );
}

export default LoginPage;