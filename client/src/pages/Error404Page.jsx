import {Container, Button} from 'react-bootstrap'

const Error404Page = () => {
    return (
        <Container className="d-flex flex-column justify-content-center align-items-center min-vh-100 text-secondary">
            <h1 style={{fontSize: "7rem"}}>404</h1>
            <h3>Not Found</h3>
            <p>This Page Isn't Available. Sorry About That.</p>
            <Button href="/" variant="outline-primary">Go Home</Button>
        </Container>
    );
}

export default Error404Page;