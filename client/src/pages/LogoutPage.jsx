import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import SERVER_URL from '../constants/constants';

const LogoutPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const logout = async () => {
      try {
        const url = SERVER_URL + "/auth/logout"
        const response = await fetch(url, {
          method: "POST",
          credentials: "include",
        });

        if (response.ok) {
          navigate("/login");
        }
      } catch (err) {
        console.error(err);
      }
    };
    logout();
  }, [navigate]);

  return (
    <Container className="d-flex flex-column align-items-center justify-content-center min-vh-100">
      <h1>Logout</h1>
      <p>You have been logged out. Re-directing back to <a href="/login" className="text-decoration-none">Login</a>.</p>
    </Container>
  );
};

export default LogoutPage;