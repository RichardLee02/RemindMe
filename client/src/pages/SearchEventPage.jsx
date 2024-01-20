import { useEffect, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap"
import { useParams } from 'react-router-dom';
import SERVER_URL from '../constants/constants';
import EventDetails from "../components/EventDetails"
import { format } from "date-fns";

const SearchEventPage = () => {
    const { title } = useParams();
    const [events, setEvents] = useState([]);

    const handleDeleteEvent = async (eventId, getEvents, setEvents) => {
        try {
            await fetch(SERVER_URL + "/api/events/" + eventId, {
                method: "DELETE",
                credentials: "include"
            });
            const updatedEvents = getEvents.filter(event => event._id !== eventId);
            setEvents(updatedEvents);
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        const fetchTitle = async () => {
            try {
                const url = SERVER_URL + "/api/events/search/" + title;
                const response = await fetch(url, {
                    method: "GET",
                    credentials: "include"
                });
                const data = await response.json();
                setEvents(data);
            } catch (err) {
                console.error(err);
            }
        }
        fetchTitle();
        console.log(events);
    }, [events]);

    return (
        <Container className="px-4">
            <Row>
                <Col>
                    <h2 className="border-bottom my-3 pb-2">Results</h2>
                </Col>
            </Row>
            <Row>
                <Col className="d-flex flex-column">
                    {events.map((event, index) => (
                        <Col key={index} className="mb-3">
                            <Card className="d-flex flex-row p-3">
                                <Col md={10}>
                                    <Card style={{ marginRight: "0.5rem" }}>
                                        <Card.Body>
                                            <Card.Text>Due: {format(new Date(event.recurrence.endsOn), "yyyy-MM-dd HH:mm")}</Card.Text>
                                            <Card.Title>{event.title}</Card.Title>
                                            <Card.Text>{event.description}</Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={2} className="d-flex align-items-center justify-content-center me-2">
                                    <Card className="w-100 h-100">
                                        <Card.Body className="d-flex flex-row align-items-center justify-content-center">
                                            <div className="p-2" onClick={() => handleDeleteEvent(event._id)} style={{ cursor: "pointer" }}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
                                                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
                                                </svg>
                                            </div>
                                            <div className="p-2">
                                                <EventDetails eventId={event._id} />
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Card>
                        </Col>
                    ))}
                </Col>
            </Row>
        </Container>
    )
}

export default SearchEventPage;