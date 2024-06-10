import {useState} from "react"
import {Button, Container, Form, Modal} from "react-bootstrap"
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css';
import SERVER_URL from "../constants/constants";
import NewEventLogo from "./images/NewEventLogo";
import CalendarLogo from "./images/CalendarLogo";

const NewEvent = () => {
    const [show, setShow] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("");
    const [type, setType] = useState("");
    const [daysOfWeek, setDaysOfWeek] = useState([]);
    const [endsOn, setEndsOn] = useState(null);
    const [email, setEmail] = useState(false);
    const [sms, setSMS] = useState(false);
    const [inApp, setInApp] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleClose = () => {
        setTitle("");
        setDescription("");
        setStatus("");
        setType("");
        setDaysOfWeek([]);
        setEndsOn(null);
        setEmail(false);
        setSMS(false);
        setInApp(false);
        setErrorMessage("");
        setShow(false);
    };
    const handleShow = () => setShow(true);
    const handleStatus = (e) => setStatus(e.target.value);
    const handleType = (e) => setType(e.target.value);
    const handlePeriod = (e) => {
        const selectedPeriod = Array.from(e.target.selectedOptions, (option) => option.value);
        setDaysOfWeek(selectedPeriod);
    };
    const handleEndsOn = (date) => setEndsOn(date);
    const handleReminders = (e) => {
        const {name, checked} = e.target;
        switch (name) {
            case "email":
                setEmail(checked);
                break;
            case "sms":
                setSMS(checked);
                break;
            case "inApp":
                setInApp(checked);
                break;
            default:
                break;
        }
    }
    const handleAddEvent = async (e) => {
        try {
            e.preventDefault();
            setErrorMessage("");
            if (!title || !description || !status || !type || !daysOfWeek.length || !endsOn || (email === false && sms === false && inApp === false)) {
                setErrorMessage("Please Fill In All Required Fields.");
                return;
            }

            const url = SERVER_URL + "/api/events";
            const newEvent = {
                title,
                description,
                status,
                recurrence: {
                    type,
                    daysOfWeek,
                    endsOn
                },
                reminders: {
                    email,
                    sms,
                    inApp
                }
            };
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(newEvent)
            });

            if (response.ok) {
                handleClose();
            }
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <Container className="m-0 p-0">
            <span onClick={handleShow} style={{cursor: "pointer"}}>
                <NewEventLogo/>
            </span>

            <Modal className="text-black" show={show} onHide={handleClose}>
                <Modal.Header className="form-modal" closeButton>
                    <Modal.Title>
                        <div className="d-flex flex-row align-items-center">
                            <CalendarLogo/>
                            <h4 className="m-0 p-0 ps-2">New Event</h4>
                        </div>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="form-modal">
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                name="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                type="text"
                                name="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="d-block">Status</Form.Label>
                            <Form.Check
                                inline
                                label="Backlog"
                                type="radio"
                                name="status"
                                value="backlog"
                                checked={status === "backlog"}
                                onChange={handleStatus}
                            />
                            <Form.Check
                                inline
                                label="Active"
                                type="radio"
                                name="status"
                                value="active"
                                checked={status === "active"}
                                onChange={handleStatus}
                            />
                            <Form.Check
                                inline
                                label="Done"
                                type="radio"
                                name="status"
                                value="done"
                                checked={status === "done"}
                                onChange={handleStatus}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="d-block">Type</Form.Label>
                            <Form.Check
                                inline
                                label="None"
                                type="radio"
                                name="type"
                                value="none"
                                checked={type === "none"}
                                onChange={handleType}
                            />
                            <Form.Check
                                inline
                                label="Daily"
                                type="radio"
                                name="type"
                                value="daily"
                                checked={type === "daily"}
                                onChange={handleType}
                            />
                            <Form.Check
                                inline
                                label="Weekly"
                                type="radio"
                                name="type"
                                value="weekly"
                                checked={type === "weekly"}
                                onChange={handleType}
                            />
                            <Form.Check
                                inline
                                label="Bi-weekly"
                                type="radio"
                                name="type"
                                value="bi-weekly"
                                checked={type === "bi-weekly"}
                                onChange={handleType}
                            />
                            <Form.Check
                                inline
                                label="Monthly"
                                type="radio"
                                name="type"
                                value="monthly"
                                checked={type === "monthly"}
                                onChange={handleType}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="d-block">Period</Form.Label>
                            <Form.Select multiple onChange={handlePeriod}>
                                <option value="0">Sunday</option>
                                <option value="1">Monday</option>
                                <option value="2">Tuesday</option>
                                <option value="3">Wednesday</option>
                                <option value="4">Thursday</option>
                                <option value="5">Friday</option>
                                <option value="6">Saturday</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="d-block">Deadline</Form.Label>
                            <DatePicker
                                id="endsOn"
                                selected={endsOn}
                                onChange={(date) => handleEndsOn(date)}
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={15}
                                dateFormat="MMMM d, yyyy h:mm aa"
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label className="d-block">Reminder</Form.Label>
                            <Form.Check
                                inline
                                label="Email"
                                type="checkbox"
                                value="email"
                                name="email"
                                checked={email}
                                onChange={handleReminders}/>
                            <Form.Check
                                inline
                                label="SMS"
                                type="checkbox"
                                name="sms"
                                checked={sms}
                                onChange={handleReminders}/>
                            <Form.Check
                                inline
                                label="In-App"
                                type="checkbox"
                                name="inApp"
                                checked={inApp}
                                onChange={handleReminders}/>
                        </Form.Group>
                        {errorMessage &&
                            <div className="mt-3">
                                <Form.Text className="text-danger">{errorMessage}</Form.Text>
                            </div>
                        }
                    </Form>
                </Modal.Body>
                <Modal.Footer className="form-modal">
                    <Button variant="primary" onClick={handleAddEvent}>Add Event</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    )
}

export default NewEvent;