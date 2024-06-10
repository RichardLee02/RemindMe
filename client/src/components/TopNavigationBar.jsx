import {useState, useContext} from "react";
import {useNavigate} from 'react-router-dom';
import {Container, FormControl, Nav, OverlayTrigger, Popover} from "react-bootstrap"
import NewEvent from "./NewEvent";
import {ThemeContext} from "./ThemeContext";
import LogOutLogo from "./images/LogOutLogo";
import LightModeLogo from "./images/LightModeLogo";
import DarkModeLogo from "./images/DarkModeLogo";
import ProfileLogo from "./images/ProfileLogo";

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
                            <LogOutLogo/>
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
                    darkMode ? <LightModeLogo/> : <DarkModeLogo/>
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
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
                                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                                <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                            </svg>
                    </OverlayTrigger>
                </span>
            </div>
        </Container>
    )
}

export default TopNavigationBar;