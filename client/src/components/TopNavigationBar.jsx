import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Container, FormControl, Nav, OverlayTrigger, Popover } from "react-bootstrap"
import NewEvent from "./NewEvent";

const TopNavigationBar = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const handleInputChange = (e) => setSearchValue(e.target.value);
  const handleKeyPress = (e) => {
    if (searchValue && e.key === "Enter") {
      setSearchValue("");
      navigate(`/results/${searchValue}`);
    }
  }

  const popoverBottom = (
    <Popover id="popover-bottom">
      <Popover.Body>
        <Nav>
          <Nav.Item>
            <Nav.Link href="/logout" className="d-flex align-items-center text-decoration-none px-1 pe-5 py-2 custom rounded">
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="#212529" class="bi bi-box-arrow-right" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z" />
                <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z" />
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
        <span className="me-3"> 
          <NewEvent/>
        </span>
        <span className="me-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="#212529" class="bi bi-bell" viewBox="0 0 16 16">
            <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z" />
          </svg>
        </span>
        <span style={{ cursor: "pointer" }}>
          <OverlayTrigger
            trigger="click"
            placement="bottom"
            overlay={popoverBottom}
            rootClose>
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="#212529" class="bi bi-person-circle" viewBox="0 0 16 16">
              <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
              <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" />
            </svg>
          </OverlayTrigger>
        </span>
      </div>
    </Container>
  )
}

export default TopNavigationBar;