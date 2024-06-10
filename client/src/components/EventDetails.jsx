import {useEffect, useState} from "react";
import {Button, Container, Modal} from "react-bootstrap"
import SERVER_URL from "../constants/constants";
import {format} from "date-fns";
import CalendarLogo from "./images/CalendarLogo";
import EventDetailsLogo from "./images/EventDetailsLogo";

const EventDetails = ({eventId}) => {
    const [show, setShow] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("");
    const [type, setType] = useState("");
    const [period, setPeriod] = useState([]);
    const [created, setCreated] = useState(null);
    const [endsOn, setEndsOn] = useState(null);
    const [reminders, setReminders] = useState([]);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const capitalizeFirstLetter = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    const numToDaysOfWeek = (daysOfWeek) => {
        const daysOfWeekCollection = [];
        for (const period of daysOfWeek) {
            switch (period) {
                case 1:
                    daysOfWeekCollection.push("Sunday");
                    break;
                case 2:
                    daysOfWeekCollection.push("Monday");
                    break;
                case 3:
                    daysOfWeekCollection.push("Tuesday");
                    break;
                case 4:
                    daysOfWeekCollection.push("Wednesday");
                    break;
                case 5:
                    daysOfWeekCollection.push("Thursday");
                    break;
                case 6:
                    daysOfWeekCollection.push("Friday");
                    break;
                case 7:
                    daysOfWeekCollection.push("Saturday");
                    break;
                default:
                    continue;
            }
        }
        setPeriod(daysOfWeekCollection);
    }
    const findReminders = (reminders) => {
        const remindersCollection = [];
        for (const [key, value] of Object.entries(reminders)) {
            if (value) {
                switch (key) {
                    case "email":
                        remindersCollection.push("Email");
                        break;
                    case "sms":
                        remindersCollection.push("SMS");
                        break;
                    case "inApp":
                        remindersCollection.push("In-App");
                        break;
                    default:
                        break;
                }
            }
        }
        setReminders(remindersCollection);
    }

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const url = SERVER_URL + "/api/events/" + eventId;
                const response = await fetch(url, {
                    method: "GET",
                    credentials: "include"
                });
                const data = await response.json();
                const {title, description, created, status, recurrence, reminders} = data;
                setTitle(title);
                setDescription(description);
                setStatus(capitalizeFirstLetter(status));
                setType(capitalizeFirstLetter(recurrence.type));
                setCreated(created);
                setEndsOn(recurrence.endsOn);
                findReminders(reminders);
                numToDaysOfWeek(recurrence.daysOfWeek);
            } catch (err) {
                console.error(err);
            }
        }
        fetchEvent();
    }, []);

    return (
        <Container className="m-0 p-0">
            <span onClick={handleShow} style={{cursor: "pointer"}}>
                <EventDetailsLogo/>
            </span>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <div className="d-flex flex-row align-items-center">
                            <CalendarLogo/>
                            <h4 className="m-0 p-0 ps-2">Event</h4>
                        </div>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        <span className="text-black-50">Title: </span>
                        {title}
                    </p>
                    <p>
                        <span className="text-black-50">Description: </span>
                        {description}
                    </p>
                    <p>
                        <span className="text-black-50">Status: </span>
                        {status}
                    </p>
                    <p>
                        <span className="text-black-50">Type: </span>
                        {type}
                    </p>
                    <p>
                        <span className="text-black-50">Period: </span>
                        {period && period.join(", ")}
                    </p>
                    <p>
                        <span className="text-black-50">Created On: </span>
                        {format(new Date(created), "yyyy-MM-dd HH:mm")}
                    </p>
                    <p>
                        <span className="text-black-50">Due On: </span>
                        {format(new Date(endsOn), "yyyy-MM-dd HH:mm")}
                    </p>
                    <p className="m-0 p-0">
                        <span className="text-black-50">Reminders: </span>
                        {reminders && reminders.join(", ")}
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-primary" onClick={handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default EventDetails;