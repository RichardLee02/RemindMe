import {Nav, Navbar} from 'react-bootstrap';
import {NavLink, useLocation} from 'react-router-dom';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {useContext} from "react";
import {ThemeContext} from "./ThemeContext";
import RemindMeLogo from "./images/RemindMeLogo";
import DashboardActiveLogo from "./images/DashboardActiveLogo";
import DashboardDefaultLogo from "./images/DashboardDefaultLogo";
import EventsActiveLogo from "./images/EventsActiveLogo";
import EventsDefaultLogo from "./images/EventsDefaultLogo";
import CalendarDefaultLogo from "./images/CalendarDefaultLogo";
import CalendarActiveLogo from "./images/CalendarActiveLogo";
import NotificationsDefaultLogo from "./images/NotificationsDefaultLogo";
import NotificationsActiveLogo from "./images/NotificationsActiveLogo";

const SideNavigationBar = () => {
    const location = useLocation();
    const {darkMode, setDarkMode} = useContext(ThemeContext);

    const isActive = (path) => {
        return location.pathname === path;
    }

    return (
        <Navbar className="d-flex flex-column position-fixed p-4 min-vh-100 border-end"
                style={{width: "inherit"}}>
            <NavLink to="/"
                     className={`d-flex align-items-center text-decoration-none border-0 w-100 mb-5 rounded side-navbar ${darkMode ? 'darkMode' : 'lightMode'}`}>
                <span className="d-inline px-1 py-2 rounded text-center">
                    <RemindMeLogo/>
                </span>
                <span className="fs-5 ms-1 fw-bold">RemindMe</span>
            </NavLink>
            <Nav className="d-flex flex-column w-100">
                <Nav.Item className="my-2">
                    <NavLink to="/"
                             className={`d-flex align-items-center text-decoration-none px-1 py-2 custom rounded side-navbar ${darkMode ? 'darkMode' : 'lightMode'}`}>
                        {
                            isActive("/") ? <DashboardActiveLogo/> : <DashboardDefaultLogo/>
                        }
                        <span className="px-2 fs-6">Dashboard</span>
                    </NavLink>
                </Nav.Item>
                <Nav.Item className="my-2">
                    <NavLink to="/events"
                             className={`d-flex align-items-center text-decoration-none px-1 py-2 custom rounded side-navbar ${darkMode ? 'darkMode' : 'lightMode'}`}>
                        {
                            isActive("/events") ? <EventsActiveLogo/> : <EventsDefaultLogo/>
                        }
                        <span className="px-2 fs-6">Events</span>
                    </NavLink>
                </Nav.Item>
                <Nav.Item className="my-2">
                    <NavLink to="/calendar"
                             className={`d-flex align-items-center text-decoration-none px-1 py-2 custom rounded side-navbar ${darkMode ? 'darkMode' : 'lightMode'}`}>
                        {
                            isActive("/calendar") ? <CalendarActiveLogo/> : <CalendarDefaultLogo/>
                        }
                        <span className="px-2 fs-6">Calendar</span>
                    </NavLink>
                </Nav.Item>
                <Nav.Item className="my-2">
                    <NavLink to="/notifications"
                             className={`d-flex align-items-center text-decoration-none px-1 py-2 custom rounded side-navbar ${darkMode ? 'darkMode' : 'lightMode'}`}>
                        {
                            isActive("/notifications") ? <NotificationsActiveLogo/> : <NotificationsDefaultLogo/>
                        }
                        <span className="px-2 fs-6">Notifications</span>
                    </NavLink>
                </Nav.Item>
            </Nav>
        </Navbar>
    );
}

export default SideNavigationBar;