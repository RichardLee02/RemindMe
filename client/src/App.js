import './App.css';
import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap'
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import SignupPage from './pages/SignupPage';
import TopNavigationBar from './components/TopNavigationBar';
import SideNavigationBar from './components/SideNavigationBar';
import LogoutPage from './pages/LogoutPage';
import Error404Page from './pages/Error404Page';
import CalendarPage from './pages/CalendarPage';
import EventsPage from './pages/EventsPage'
import NotificationsPage from './pages/NotificationsPage';
import SearchEventPage from './pages/SearchEventPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/logout" element={<LogoutPage />} />
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/results/:title" element={<SearchEventPage />} />
        </Route>
        <Route path="*" element={<Error404Page />} />
      </Routes>
    </Router>
  );
}

function DashboardLayout() {
  return (
    <Container fluid className="m-0 p-0">
      <Row className="m-0 p-0">
        <Col sm={2} className="p-0 m-0 min-vh-100">
          <SideNavigationBar />
        </Col>
        <Col sm={10} className="p-0 m-0 min-vh-100">
          <div className='upper-section'>
            <TopNavigationBar/>
          </div>
          <div className="lower-section">
            <Outlet/>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default App;