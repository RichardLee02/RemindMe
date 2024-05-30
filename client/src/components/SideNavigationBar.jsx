import {Nav, Navbar} from 'react-bootstrap';
import {NavLink, useLocation} from 'react-router-dom';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {useContext} from "react";
import {ThemeContext} from "./ThemeContext";

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
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor"
                         className="bi bi-r-square-fill"
                         viewBox="0 0 16 16">
                        <path d="M6.835 5.092v2.777h1.549c.995 0 1.573-.463 1.573-1.36 0-.913-.596-1.417-1.537-1.417z"/>
                        <path
                            d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm3.5 4.002h3.11c1.71 0 2.741.973 2.741 2.46 0 1.138-.667 1.94-1.495 2.24L11.5 12H9.98L8.52 8.924H6.836V12H5.5z"/>
                    </svg>
                </span>
                <span className="fs-5 ms-1 fw-bold">RemindMe</span>
            </NavLink>
            <Nav className="d-flex flex-column w-100">
                <Nav.Item className="my-2">
                    <NavLink to="/"
                             className={`d-flex align-items-center text-decoration-none px-1 py-2 custom rounded side-navbar ${darkMode ? 'darkMode' : 'lightMode'}`}>
                        {isActive("/") ?
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor"
                                 class="bi bi-house-door-fill" viewBox="0 0 16 16">
                                <path
                                    d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5Z"/>
                            </svg> : <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor"
                                          className="bi bi-house-door mr-3" viewBox="0 0 16 16">
                                <path
                                    d="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146ZM2.5 14V7.707l5.5-5.5 5.5 5.5V14H10v-4a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v4H2.5Z"/>
                            </svg>
                        }
                        <span className="px-2 fs-6">Dashboard</span>
                    </NavLink>
                </Nav.Item>
                <Nav.Item className="my-2">
                    <NavLink to="/events"
                             className={`d-flex align-items-center text-decoration-none px-1 py-2 custom rounded side-navbar ${darkMode ? 'darkMode' : 'lightMode'}`}>
                        {isActive("/events") ?
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor"
                                 class="bi bi-calendar3-week-fill" viewBox="0 0 16 16">
                                <path fill-rule="evenodd"
                                      d="M2 0a2 2 0 0 0-2 2h16a2 2 0 0 0-2-2H2zM0 14V3h16v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm12-8a1 1 0 1 0 2 0 1 1 0 0 0-2 0zM5 9a1 1 0 1 0 2 0 1 1 0 0 0-2 0zm5-2a1 1 0 1 1 0-2 1 1 0 0 1 0 2zM2 9a1 1 0 1 0 2 0 1 1 0 0 0-2 0z"/>
                            </svg> : <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor"
                                          class="bi bi-calendar3-week" viewBox="0 0 16 16">
                                <path
                                    d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857V3.857z"/>
                                <path
                                    d="M12 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-5 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm2-3a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-5 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
                            </svg>
                        }
                        <span className="px-2 fs-6">Events</span>
                    </NavLink>
                </Nav.Item>
                <Nav.Item className="my-2">
                    <NavLink to="/calendar"
                             className={`d-flex align-items-center text-decoration-none px-1 py-2 custom rounded side-navbar ${darkMode ? 'darkMode' : 'lightMode'}`}>
                        {isActive("/calendar") ?
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor"
                                 class="bi bi-calendar3-range-fill" viewBox="0 0 16 16">
                                <path fill-rule="evenodd"
                                      d="M2 0a2 2 0 0 0-2 2h16a2 2 0 0 0-2-2H2zM0 8V3h16v2h-6a1 1 0 1 0 0 2h6v7a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-4h6a1 1 0 1 0 0-2H0z"/>
                            </svg> : <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor"
                                          class="bi bi-calendar3-range" viewBox="0 0 16 16">
                                <path
                                    d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857V3.857z"/>
                                <path d="M7 10a1 1 0 0 0 0-2H1v2h6zm2-3h6V5H9a1 1 0 0 0 0 2z"/>
                            </svg>
                        }
                        <span className="px-2 fs-6">Calendar</span>
                    </NavLink>
                </Nav.Item>
                <Nav.Item className="my-2">
                    <NavLink to="/notifications"
                             className={`d-flex align-items-center text-decoration-none px-1 py-2 custom rounded side-navbar ${darkMode ? 'darkMode' : 'lightMode'}`}>
                        {isActive("/notifications") ?
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor"
                                 class="bi bi-bar-chart-fill" viewBox="0 0 16 16">
                                <path
                                    d="M1 11a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-3zm5-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7zm5-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V2z"/>
                            </svg> : <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor"
                                          class="bi bi-bar-chart" viewBox="0 0 16 16">
                                <path
                                    d="M4 11H2v3h2v-3zm5-4H7v7h2V7zm5-5v12h-2V2h2zm-2-1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1h-2zM6 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7zm-5 4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-3z"/>
                            </svg>
                        }
                        <span className="px-2 fs-6">Notifications</span>
                    </NavLink>
                </Nav.Item>
            </Nav>
        </Navbar>
    );
}

export default SideNavigationBar;