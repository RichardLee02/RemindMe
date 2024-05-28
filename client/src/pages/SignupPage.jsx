import { Form, Button, Container, Row, Col, Card, FloatingLabel } from 'react-bootstrap';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SERVER_URL from '../constants/constants';

const SignupPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const navigate = useNavigate();

    const handleSignUp = async (e) =>{
        try {
            e.preventDefault();
            const url = SERVER_URL + "/auth/signup";
            const signup = { 
                username, 
                password, 
                email, 
                phone
            };
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(signup)
            });

            if (response.ok) {
                setUsernameError("");
                setPasswordError("");
                setEmailError("");
                setPhoneError("");
                navigate("/login");
            } else {
                const data = await response.json();
                if (data.usernameLength === 0) {
                    setUsernameError("Username must be between 4 and 12 characters long.");
                } else if (data.isUsername) {
                    setUsernameError("A user with this username already exists.")
                } else {
                    setUsernameError("");
                }

                if (data.passwordLength === 0) {
                    setPasswordError("Password must be at least 8 characters long.");
                } else {
                    setPasswordError("");
                } 
                
                if (data.emailLength === 0) {
                    setEmailError("Email must be in the format XXX@XXX.com.");
                } else if (data.isEmail) {
                    setEmailError("A user with this email already exists.")
                } else {
                    setEmailError("");
                }
               
                if (data.phoneLength === 0) {
                    setPhoneError("Phone must be in the format XXX-XXX-XXXX.");
                } else if (data.isPhone) {
                    setPhoneError("A user with this phone already exists.");
                } else {
                    setPhoneError("");
                }
            }
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <Container className="d-flex justify-content-center align-items-center min-vh-100">
            <Row>
                <Col>
                    <Card style={{ width: "25rem" }}>
                        <Card.Body>
                            <Card.Title className="mt-2 mb-4 text-center fs-2 text-dark">RemindMe</Card.Title>
                            <Form className="text-dark" onSubmit={handleSignUp}>
                                <Form.Group className="mb-3">
                                    <FloatingLabel controlId="floatingUsername" label="Username">
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
                                <Form.Group className="mb-3">
                                    <FloatingLabel controlId="floatingEmail" label="Email">
                                        <Form.Control
                                            className="text-dark"  
                                            type="email"
                                            name="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Email"/>
                                    </FloatingLabel>
                                </Form.Group>
                                <Form.Group className="mb-3" >
                                    <FloatingLabel controlId="floatingPhone" label="Phone">
                                        <Form.Control
                                            className="text-dark"  
                                            type="tel"
                                            name="phone"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="Phone"/>
                                    </FloatingLabel>
                                </Form.Group>
                                <Button className="w-100 mb-4" variant="outline-primary" type="submit">Sign Up</Button>
                                { usernameError && <div className="text-center"><Form.Text className="text-danger">{usernameError}</Form.Text></div> }
                                { passwordError && <div className="text-center"><Form.Text className="text-danger">{passwordError}</Form.Text></div> }
                                { emailError && <div className="text-center"><Form.Text className="text-danger">{emailError}</Form.Text></div> }
                                { phoneError && <div className="text-center"><Form.Text className="text-danger">{phoneError}</Form.Text></div> }
                            </Form>
                        </Card.Body>
                    </Card>
                    <Card className="mt-3 text-dark">
                        <Card.Body>
                            <Card.Text className="text-center">Have an account? <Card.Link className="text-decoration-none" href="/login">Log In</Card.Link></Card.Text>
                        </Card.Body>
                    </Card>
                    <p className="mt-3 text-center small text-dark">&copy; 2023 &mdash; RemindMe</p>
                </Col>
            </Row>
        </Container>
    );
}

export default SignupPage;