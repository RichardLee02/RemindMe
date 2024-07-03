import {useState, useEffect} from 'react';
import {Container, Row, Col, Card} from 'react-bootstrap'
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import SERVER_URL from '../constants/constants';
import {format} from 'date-fns'
import EventDetails from '../components/EventDetails';
import DeleteLogo from "../components/images/DeleteLogo";

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
        return {movedEventId: movedEvent._id, sourceEvents, destinationEvents};
    }
    const updateEvent = async (eventId, index, newStatus = null) => {
        const url = SERVER_URL + "/api/events/" + eventId;
        const update = {
            index: index,
        }

        if (newStatus !== null) {
            update.status = newStatus;
        }

        await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(update)
        })
    }

    const updateDestinationEvents = async (eventId, sourceIndex, destinationIndex, collection) => {
        let i = destinationIndex + 1;
        const events = collection.slice(destinationIndex);
        for (let e of events) {
            if (e._id !== eventId) {
                await updateEvent(e._id, i++);
            }
        }
    }

    const updateSourceEvents = async (sourceIndex, collection) => {
        let i = sourceIndex;
        const events = collection.slice(sourceIndex + 1)
        for (let e of events) {
            await updateEvent(e._id, i++);
        }
    }

    const onDragEnd = async (result) => {
        if (!result.destination) {
            return;
        }

        switch (result.source.droppableId) {
            case "backlog":
                if (result.destination.droppableId === "backlog") {
                    const newEventsBacklog = [...eventsBacklog];
                    const [movedEvent] = newEventsBacklog.splice(result.source.index, 1);
                    await updateDestinationEvents(movedEvent._id, result.source.index, result.destination.index, eventsBacklog);
                    await updateEvent(movedEvent._id, result.destination.index);
                } else if (result.destination.droppableId === "active") {
                    const {movedEventId} = moveEvent(
                        eventsBacklog,
                        eventsActive,
                        result.source.index,
                        result.destination.index);
                    await updateDestinationEvents(movedEventId, result.source.index, result.destination.index, eventsActive);
                    await updateEvent(movedEventId, result.destination.index, "active");
                } else if (result.destination.droppableId === "done") {
                    const {movedEventId} = moveEvent(
                        eventsBacklog,
                        eventsDone,
                        result.source.index,
                        result.destination.index);
                    await updateDestinationEvents(movedEventId, result.source.index, result.destination.index, eventsDone);
                    await updateEvent(movedEventId, result.destination.index, "done");
                }
                await updateSourceEvents(result.source.index, eventsBacklog);
                break;
            case "active":
                if (result.destination.droppableId === "active") {
                    const newEventsActive = [...eventsActive];
                    const [movedEvent] = newEventsActive.splice(result.source.index, 1);
                    await updateDestinationEvents(movedEvent._id, result.source.index, result.destination.index, eventsActive);
                    await updateEvent(movedEvent._id, result.destination.index);
                } else if (result.destination.droppableId === "backlog") {
                    const {movedEventId} = moveEvent(
                        eventsActive,
                        eventsBacklog,
                        result.source.index,
                        result.destination.index);
                    await updateDestinationEvents(movedEventId, result.source.index, result.destination.index, eventsBacklog);
                    await updateEvent(movedEventId, result.destination.index, "backlog");
                } else if (result.destination.droppableId === "done") {
                    const {movedEventId} = moveEvent(
                        eventsActive,
                        eventsDone,
                        result.source.index,
                        result.destination.index);
                    await updateDestinationEvents(movedEventId, result.source.index, result.destination.index, eventsDone);
                    await updateEvent(movedEventId, result.destination.index, "done");
                }
                await updateSourceEvents(result.source.index, eventsActive);
                break;
            case "done":
                if (result.destination.droppableId === "done") {
                    const newEventsDone = [...eventsDone];
                    const [movedEvent] = newEventsDone.splice(result.source.index, 1);
                    await updateDestinationEvents(movedEvent._id, result.source.index, result.destination.index, eventsDone);
                    await updateEvent(movedEvent._id, result.destination.index);
                } else if (result.destination.droppableId === "backlog") {
                    const {movedEventId} = moveEvent(
                        eventsDone,
                        eventsBacklog,
                        result.source.index,
                        result.destination.index);
                    await updateDestinationEvents(movedEventId, result.source.index, result.destination.index, eventsBacklog);
                    await updateEvent(movedEventId, result.destination.index, "backlog");
                } else if (result.destination.droppableId === "active") {
                    const {movedEventId} = moveEvent(
                        eventsDone,
                        eventsActive,
                        result.source.index,
                        result.destination.index);
                    await updateDestinationEvents(movedEventId, result.source.index, result.destination.index, eventsActive);
                    await updateEvent(movedEventId, result.destination.index, "active");
                }
                await updateSourceEvents(result.source.index, eventsDone);
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
        <Container className="p-4">
            <Row>
                <Col>
                    <h2 className="border-bottom pb-2 mb-3">Events</h2>
                </Col>
            </Row>
            <Row className="m-0 p-0">
                <DragDropContext onDragEnd={onDragEnd}>
                    <Col xs={12} lg={4} className="m-0 p-0">
                        <Card>
                            <Card.Header className="text-center">Backlog</Card.Header>
                            <Droppable droppableId="backlog">
                                {(provided, snapshot) => (
                                    <Card.Body ref={provided.innerRef} {...provided.droppableProps}>
                                        {eventsBacklog && eventsBacklog.map((event, index) => (
                                            <Draggable key={event._id} draggableId={event._id} index={index}>
                                                {(provided, snapshot) => (
                                                    <Card
                                                        ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                                                        key={event._id} className="m-2">
                                                        <Card.Body
                                                            className={`d-flex flex-row align-items-center justify-content-between ${eventsCross.includes(event._id) ? "text-decoration-line-through" : ""}`}>
                                                            <div>
                                                                <Card.Text>Due: {format(new Date(event.recurrence.endsOn), "yyyy-MM-dd HH:mm")}</Card.Text>
                                                                <Card.Title>{event.title}</Card.Title>
                                                                <Card.Text>{event.description}</Card.Text>
                                                            </div>
                                                            <div className="d-flex flex-column">
                                                                <span className="p-2"
                                                                      onClick={() => handleDeleteEvent(event._id, eventsBacklog, setEventsBacklog)}
                                                                      style={{cursor: "pointer"}}>
                                                                    <DeleteLogo/>
                                                                </span>
                                                                <span className="p-2">
                                                                    <EventDetails eventId={event._id}/>
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
                    <Col xs={12} lg={4} className="m-0 p-0">
                        <Card>
                            <Card.Header className="text-center">Active</Card.Header>
                            <Droppable droppableId="active">
                                {(provided, snapshot) => (
                                    <Card.Body ref={provided.innerRef} {...provided.droppableProps}>
                                        {eventsActive && eventsActive.map((event, index) => (
                                            <Draggable key={event._id} draggableId={event._id} index={index}>
                                                {(provided, snapshot) => (
                                                    <Card
                                                        ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                                                        key={event._id} className="m-2">
                                                        <Card.Body
                                                            className={`d-flex flex-row align-items-center justify-content-between ${eventsCross.includes(event._id) ? "text-decoration-line-through" : ""}`}>
                                                            <div>
                                                                <Card.Text>Due: {format(new Date(event.recurrence.endsOn), "yyyy-MM-dd HH:mm")}</Card.Text>
                                                                <Card.Title>{event.title}</Card.Title>
                                                                <Card.Text>{event.description}</Card.Text>
                                                            </div>
                                                            <div className="d-flex flex-column">
                                                                <span className="p-2"
                                                                      onClick={() => handleDeleteEvent(event._id, eventsActive, setEventsActive)}
                                                                      style={{cursor: "pointer"}}>
                                                                    <DeleteLogo/>
                                                                </span>
                                                                <span className="p-2">
                                                                    <EventDetails eventId={event._id}/>
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
                    <Col xs={12} lg={4} className="m-0 p-0">
                        <Card>
                            <Card.Header className="text-center">Done</Card.Header>
                            <Droppable droppableId="done">
                                {(provided, snapshot) => (
                                    <Card.Body ref={provided.innerRef} {...provided.droppableProps}>
                                        {eventsDone && eventsDone.map((event, index) => (
                                            <Draggable key={event._id} draggableId={event._id} index={index}>
                                                {(provided, snapshot) => (
                                                    <Card
                                                        ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                                                        key={event._id} className="m-2">
                                                        <Card.Body
                                                            className={`d-flex flex-row align-items-center justify-content-between ${eventsCross.includes(event._id) ? "text-decoration-line-through" : ""}`}>
                                                            <div>
                                                                <Card.Text>Due: {format(new Date(event.recurrence.endsOn), "yyyy-MM-dd HH:mm")}</Card.Text>
                                                                <Card.Title>{event.title}</Card.Title>
                                                                <Card.Text>{event.description}</Card.Text>
                                                            </div>
                                                            <div className="d-flex flex-column">
                                                                <span className="p-2"
                                                                      onClick={() => handleDeleteEvent(event._id, eventsDone, setEventsDone)}
                                                                      style={{cursor: "pointer"}}>
                                                                    <DeleteLogo/>
                                                                </span>
                                                                <span className="p-2">
                                                                    <EventDetails eventId={event._id}/>
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