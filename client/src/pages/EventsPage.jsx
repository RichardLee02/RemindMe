import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import SERVER_URL from '../constants/constants';
import { format } from 'date-fns'
import EventDetails from '../components/EventDetails';

const EventsPage = () => {
    const [eventsBacklog, setEventsBacklog] = useState([]);
    const [eventsActive, setEventsActive] = useState([]);
    const [eventsDone, setEventsDone] = useState([]);
    const [eventsCross, setEventsCross] = useState([]);

    const moveEvent = (sourceState, destinationState, sourceIndex, destinationIndex) => {
        const sourceEvents = [...sourceState];
        const destinationEvents = [...destinationState];
        const [movedEvent] = sourceEvents.splice(sourceIndex, 1);            
        destinationEvents.splice(destinationIndex, 0, movedEvent);
        return { movedEventId: movedEvent._id, sourceEvents, destinationEvents };
    }
    const updateEvent = async (eventId, newStatus) => {
        const url = SERVER_URL + "/api/events/" + eventId;
        const updateStatus = {
            status: newStatus
        }
        await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(updateStatus)
        })
    }
    const onDragEnd = (result) => {
        if (!result.destination) {
            return;
        }
        
        switch (result.source.droppableId) {
            case "backlog":
                if (result.destination.droppableId === "backlog") {
                    const newEventsBacklog = [...eventsBacklog];
                    const [movedEvent] = newEventsBacklog.splice(result.source.index, 1);
                    newEventsBacklog.splice(result.destination.index, 0, movedEvent);
                    setEventsBacklog(newEventsBacklog);
                } else if (result.destination.droppableId === "active") {
                    const { movedEventId, sourceEvents, destinationEvents } = moveEvent(
                        eventsBacklog, 
                        eventsActive, 
                        result.source.index, 
                        result.destination.index);
                    updateEvent(movedEventId, "active");
                    setEventsBacklog(sourceEvents);
                    setEventsActive(destinationEvents);
                } else if (result.destination.droppableId === "done") {
                    const { movedEventId, sourceEvents, destinationEvents } = moveEvent(
                        eventsBacklog, 
                        eventsDone, 
                        result.source.index, 
                        result.destination.index);
                    updateEvent(movedEventId, "done");
                    setEventsBacklog(sourceEvents);
                    setEventsDone(destinationEvents);
                }
                break;
            case "active":
                if (result.destination.droppableId === "active") {
                    const newEventsActive = [...eventsActive];
                    const [movedEvent] = newEventsActive.splice(result.source.index, 1);
                    newEventsActive.splice(result.destination.index, 0, movedEvent);
                    setEventsActive(newEventsActive);
                } else if (result.destination.droppableId === "backlog") {
                    const { movedEventId, sourceEvents, destinationEvents } = moveEvent(
                        eventsActive, 
                        eventsBacklog, 
                        result.source.index, 
                        result.destination.index);
                    updateEvent(movedEventId, "backlog");
                    setEventsActive(sourceEvents);
                    setEventsBacklog(destinationEvents);
                } else if (result.destination.droppableId === "done") {
                    const { movedEventId, sourceEvents, destinationEvents } = moveEvent(
                        eventsActive, 
                        eventsDone, 
                        result.source.index, 
                        result.destination.index);
                    updateEvent(movedEventId, "done");
                    setEventsActive(sourceEvents);
                    setEventsDone(destinationEvents);
                }
                break;
            case "done":
                if (result.destination.droppableId === "done") {
                    const newEventsDone = [...eventsDone];
                    const [movedEvent] = newEventsDone.splice(result.source.index, 1);
                    newEventsDone.splice(result.destination.index, 0, movedEvent);
                    setEventsDone(newEventsDone);
                } else if (result.destination.droppableId === "backlog") {
                    const { movedEventId, sourceEvents, destinationEvents } = moveEvent(
                        eventsDone, 
                        eventsBacklog, 
                        result.source.index, 
                        result.destination.index);
                    updateEvent(movedEventId, "backlog");
                    setEventsDone(sourceEvents);
                    setEventsBacklog(destinationEvents);
                } else if (result.destination.droppableId === "active") {
                    const { movedEventId, sourceEvents, destinationEvents } = moveEvent(
                        eventsDone, 
                        eventsActive, 
                        result.source.index, 
                        result.destination.index);
                    updateEvent(movedEventId, "active");
                    setEventsDone(sourceEvents);
                    setEventsActive(destinationEvents);
                }
                break;
            default:
                break;
        }
    }

    useEffect(() => {
        const fetchBacklog = async () => {
            try {
                const response = await fetch(SERVER_URL + "/api/events/backlog", {
                    method: "GET",
                    credentials: "include"
                });
                const data = await response.json();
                setEventsBacklog(data);
            } catch (err) {
                console.error(err);
            }
        }
        fetchBacklog();
    }, [eventsBacklog]);

    useEffect(() => {
        const fetchActive = async () => {
            try {
                const response = await fetch(SERVER_URL + "/api/events/active", {
                    method: "GET",
                    credentials: "include"
                });
                const data = await response.json();
                setEventsActive(data);
            } catch (err) {
                console.error(err);
            }
        }
        fetchActive();
    }, [eventsActive]);

    useEffect(() => {
        const fetchDone = async () => {
            try {
                const response = await fetch(SERVER_URL + "/api/events/done", {
                    method: "GET",
                    credentials: "include"
                });
                const data = await response.json();
                setEventsDone(data);
            } catch (err) {
                console.error(err);
            }
        }
        fetchDone();
    }, [eventsDone]);

    useEffect(() => {
        const storedCrossEvents = JSON.parse(localStorage.getItem("eventsCross")) || [];
        setEventsCross(storedCrossEvents);
    }, []);

    const handleCrossEvent = (eventId) => {
        if (!eventsCross.includes(eventId)) {
            const updatedCross = [...eventsCross, eventId];
            setEventsCross(updatedCross);
            localStorage.setItem("eventsCross", JSON.stringify(updatedCross));
        }
    }

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

    return (
        <Container className="text-dark p-4">
            <Row>
                <Col>
                    <h2 className="border-bottom pb-2 mb-3">Events</h2>
                </Col>
            </Row>
            <Row className="m-0 p-0">
                <DragDropContext onDragEnd={onDragEnd}>
                    <Col className="m-0 p-0 pe-2">
                        <Card>
                            <Card.Header className="text-center">Backlog</Card.Header>
                            <Droppable droppableId="backlog" >
                                {(provided, snapshot) => (
                                    <Card.Body ref={provided.innerRef} {...provided.droppableProps}>
                                        {eventsBacklog && eventsBacklog.map((event, index) => (
                                            <Draggable key={event._id} draggableId={event._id} index={index}>
                                                {(provided, snapshot) => (
                                                    <Card ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} key={event._id} className="m-2">
                                                        <Card.Body className={`d-flex flex-row align-items-center justify-content-between ${eventsCross.includes(event._id) ? "text-decoration-line-through" : ""}`}>
                                                            <div>
                                                                <Card.Text>Due: {format(new Date(event.recurrence.endsOn), "yyyy-MM-dd HH:mm")}</Card.Text>
                                                                <Card.Title>{event.title}</Card.Title>
                                                                <Card.Text>{event.description}</Card.Text>
                                                            </div>
                                                            <div className="d-flex flex-column">
                                                                {/*
                                                                    <span className="p-2" onClick={() => handleCrossEvent(event._id)} style={{ cursor: "pointer" }}>
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-check-circle-fill" viewBox="0 0 16 16">
                                                                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                                                                        </svg>
                                                                    </span>
                                                                */}
                                                                <span className="p-2" onClick={() => handleDeleteEvent(event._id, eventsBacklog, setEventsBacklog)} style={{ cursor: "pointer" }}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
                                                                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
                                                                    </svg>
                                                                </span>
                                                                <span className="p-2">
                                                                    <EventDetails eventId={event._id} />
                                                                </span>
                                                            </div>
                                                        </Card.Body>
                                                    </Card>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </Card.Body>
                                )}
                            </Droppable>
                        </Card>
                    </Col>
                    <Col className="m-0 px-2">
                        <Card>
                            <Card.Header className="text-center">Active</Card.Header>
                            <Droppable droppableId="active">
                                {(provided, snapshot) => (
                                    <Card.Body ref={provided.innerRef} {...provided.droppableProps}>
                                        {eventsActive && eventsActive.map((event, index) => (
                                            <Draggable key={event._id} draggableId={event._id} index={index}>
                                                {(provided, snapshot) => (
                                                    <Card ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} key={event._id} className="m-2">
                                                        <Card.Body className={`d-flex flex-row align-items-center justify-content-between ${eventsCross.includes(event._id) ? "text-decoration-line-through" : ""}`}>
                                                            <div>
                                                                <Card.Text>Due: {format(new Date(event.recurrence.endsOn), "yyyy-MM-dd HH:mm")}</Card.Text>
                                                                <Card.Title>{event.title}</Card.Title>
                                                                <Card.Text>{event.description}</Card.Text>
                                                            </div>
                                                            <div className="d-flex flex-column">
                                                                {/*
                                                                    <span className="p-2" onClick={() => handleCrossEvent(event._id)} style={{ cursor: "pointer" }}>
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-check-circle-fill" viewBox="0 0 16 16">
                                                                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                                                                        </svg>
                                                                    </span>
                                                                */}
                                                                <span className="p-2" onClick={() => handleDeleteEvent(event._id, eventsActive, setEventsActive)} style={{ cursor: "pointer" }}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
                                                                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
                                                                    </svg>
                                                                </span>
                                                                <span className="p-2">
                                                                    <EventDetails eventId={event._id} />
                                                                </span>
                                                            </div>
                                                        </Card.Body>
                                                    </Card>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </Card.Body>
                                )}
                            </Droppable>
                        </Card>
                    </Col>
                    <Col className="m-0 p-0 ps-2">
                        <Card>
                            <Card.Header className="text-center">Done</Card.Header>
                            <Droppable droppableId="done">
                                {(provided, snapshot) => (
                                    <Card.Body ref={provided.innerRef} {...provided.droppableProps}>
                                        {eventsDone && eventsDone.map((event, index) => (
                                            <Draggable key={event._id} draggableId={event._id} index={index}>
                                                {(provided, snapshot) => (
                                                    <Card ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} key={event._id} className="m-2">
                                                        <Card.Body className={`d-flex flex-row align-items-center justify-content-between ${eventsCross.includes(event._id) ? "text-decoration-line-through" : ""}`}>
                                                            <div>
                                                                <Card.Text>Due: {format(new Date(event.recurrence.endsOn), "yyyy-MM-dd HH:mm")}</Card.Text>
                                                                <Card.Title>{event.title}</Card.Title>
                                                                <Card.Text>{event.description}</Card.Text>
                                                            </div>
                                                            <div className="d-flex flex-column">
                                                                {/*
                                                                    <span className="p-2" onClick={() => handleCrossEvent(event._id)} style={{ cursor: "pointer" }}>
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-check-circle-fill" viewBox="0 0 16 16">
                                                                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                                                                        </svg>
                                                                    </span>
                                                                 */}
                                                                <span className="p-2" onClick={() => handleDeleteEvent(event._id, eventsDone, setEventsDone)} style={{ cursor: "pointer" }}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
                                                                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
                                                                    </svg>
                                                                </span>
                                                                <span className="p-2">
                                                                    <EventDetails eventId={event._id} />
                                                                </span>
                                                            </div>
                                                        </Card.Body>
                                                    </Card>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </Card.Body>
                                )}
                            </Droppable>
                        </Card>
                    </Col>
                </DragDropContext>
            </Row>
        </Container>
    )
}

export default EventsPage;