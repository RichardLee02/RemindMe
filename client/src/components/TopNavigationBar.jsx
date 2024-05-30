import {useState, useContext, useEffect} from "react";
import {useNavigate} from 'react-router-dom';
import {Container, FormControl, Nav, OverlayTrigger, Popover} from "react-bootstrap"
import NewEvent from "./NewEvent";
import {ThemeContext} from "./ThemeContext";

const TopNavigationBar = () => {
    const navigate = useNavigate();
    const [searchValue, setSearchValue] = useState("");
    const {darkMode, setDarkMode} = useContext(ThemeContext);
    const handleInputChange = (e) => setSearchValue(e.target.value);
    const handleKeyPress = (e) => {
        if (searchValue && e.key === "Enter") {
            setSearchValue("");
            navigate(`/results/${searchValue}`);
        }
    }

    const handleMode = () => {
        setDarkMode(!darkMode);
    }

    const popoverBottom = (
        <Popover id="popover-bottom">
            <Popover.Body>
                <Nav>
                    <Nav.Item>
                        <Nav.Link href="/logout"
                                  className="d-flex align-items-center text-decoration-none px-1 pe-5 py-2 custom rounded">
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="#212529"
                                 className="bi bi-box-arrow-right" viewBox="0 0 16 16">
                                <path fill-rule="evenodd"
                                      d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
                                <path fill-rule="evenodd"
                                      d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
                            </svg>
                            <span className="px-2 fs-6 text-dark">Log Out</span>
                        </Nav.Link>
                    </Nav.Item>
                </Nav>
            </Popover.Body>
        </Popover>
    )

    return (
        <Container className="d-flex align-items-center justify-content-between p-4">
            <div className="w-50">
                <FormControl
                    type="text"
                    placeholder="Search"
                    value={searchValue}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                />
            </div>
            <div className="d-flex flex-row align-items-center justify-content-center">
                <span className="me-3" style={{cursor: "pointer"}} onClick={handleMode}>
                {
                    darkMode ?
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor"
                             className="bi bi-sun-fill" viewBox="0 0 16 16">
                            <path
                                d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5M3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8m10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0m-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0m9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707M4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708"/>
                        </svg> :
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor"
                             className="bi bi-moon-fill" id="dark-mode" viewBox="0 0 16 16">
                            <path
                                d="M6 .278a.77.77 0 0 1 .08.858 7.2 7.2 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277q.792-.001 1.533-.16a.79.79 0 0 1 .81.316.73.73 0 0 1-.031.893A8.35 8.35 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.75.75 0 0 1 6 .278"/>
                        </svg>
                }
                </span>
                <span className="me-3">
                <NewEvent/>
            </span>
                <span style={{cursor: "pointer"}}>
          <OverlayTrigger
              trigger="click"
              placement="bottom"
              overlay={popoverBottom}
              rootClose>
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor"
                   class="bi bi-person-circle"
                   viewBox="0 0 16 16">
                  <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                  <path fill-rule="evenodd"
                        d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
              </svg>
          </OverlayTrigger>
        </span>
            </div>
        </Container>
    )
}

export default TopNavigationBar;