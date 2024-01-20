import { useState, useEffect } from 'react';
import { Container, Row, Col, Table } from 'react-bootstrap'
import SERVER_URL from '../constants/constants';
import { format } from 'date-fns'
import NewEvent from "../components/NewEvent";

const DashboardPage = () => {
    const date = new Date()
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const year = date.getFullYear();
    const week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayOfWeek = date.getDay();
    const daysOfWeek = week[dayOfWeek];

    const [eventsOverview, setEventsOverview] = useState({
        numBacklogEvents: 0,
        numActiveEvents: 0,
        numDoneEvents: 0,
    });
    const [eventsToday, setEventsToday] = useState([]);
    const [eventsUpcoming, setEventsUpcoming] = useState([]);
    const [eventsOverdue, setEventsOverdue] = useState([]);

    useEffect(() => {
        const fetchOverview = async () => {
            try {
                const response = await fetch(SERVER_URL + "/api/events/overview", {
                    method: "GET",
                    credentials: "include"
                });
                const data = await response.json();
                setEventsOverview(data);
            } catch (err) {
                console.error(err);
            }
        }
        fetchOverview();
    }, [eventsOverview]);

    useEffect(() => {
        const fetchToday = async () => {
            try {
                const response = await fetch(SERVER_URL + "/api/events/today", {
                    method: "GET",
                    credentials: "include"
                });
                const data = await response.json();
                setEventsToday(data);
            } catch (err) {
                console.error(err);
            }
        }
        fetchToday();
    }, [eventsToday]);

    useEffect(() => {
        const fetchUpcoming = async () => {
            try {
                const response = await fetch(SERVER_URL + "/api/events/upcoming", {
                    method: "GET",
                    credentials: "include"
                });
                const data = await response.json();
                setEventsUpcoming(data);
            } catch (err) {
                console.error(err);
            }
        }
        fetchUpcoming();
    }, [eventsUpcoming])

    useEffect(() => {
        const fetchOverdue = async () => {
            try {
                const response = await fetch(SERVER_URL + "/api/events/overdue", {
                    method: "GET",
                    credentials: "include"
                });
                const data = await response.json();
                setEventsOverdue(data);
            } catch (err) {
                console.error(err);
            }
        }
        fetchOverdue();
    }, [eventsOverdue])

    return (
        <Container className="text-dark d-flex flex-column bg-body p-4">
            <Row>
                <Col>
                    <h2 className="border-bottom pb-2 mb-3">Dashboard</h2>
                </Col>
            </Row>
            <Row className='m-0 justify-content-between'>
                <Col className="border p-4 me-4 rounded d-flex flex-column align-items-center justify-content-center">
                    <h5>Add Event</h5>
                    <div className="text-primary">
                        <NewEvent />
                    </div>
                </Col>
                <Col className="border p-4 me-4 rounded d-flex flex-column align-items-start justify-content-center">
                    <h5>Backlog</h5>
                    <div className="fs-5">{eventsOverview.numBacklogEvents}</div>
                    <a className="text-decoration-none" href="/events"><small>View Full List</small></a>
                </Col>
                <Col className="border p-4 me-4 rounded d-flex flex-column align-items-start justify-content-center">
                    <h5>Active</h5>
                    <div className="fs-5">{eventsOverview.numActiveEvents}</div>
                    <a className="text-decoration-none" href="/events"><small>View Full List</small></a>
                </Col>
                <Col className="border p-4 rounded d-flex flex-column align-items-start justify-content-center">
                    <h5>Done</h5>
                    <div className="fs-5">{eventsOverview.numDoneEvents}</div>
                    <a className="text-decoration-none" href="/events"><small>View Full List</small></a>
                </Col>
            </Row>
            <Row className='border rounded mx-0 mt-4'>
                <Col sm={4} className="d-flex flex-column align-items-center justify-content-center border-end p-4">
                    <h5>Today</h5>
                    <div>{daysOfWeek}</div>
                    <div>{year}-{month}-{day}</div>
                </Col>
                <Col sm={8} className="p-2" style={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}>
                    {eventsToday && eventsToday.map((event, index) => (
                        <div key={index} className='rounded px-3 my-2 border bg-white'>
                            <p className="m-0">{format(new Date(event.recurrence.endsOn), "HH:mm")}</p>
                            <p className="m-0">{event.title}: {event.description}</p>
                        </div>
                    ))}
                </Col>
            </Row>
            <Row>
                <Col>
                    <h5 className='border-bottom my-3 py-2'>Present</h5>
                    <Table striped bordered>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {eventsUpcoming && eventsUpcoming.map((event, index) => (
                                <tr key={index}>
                                    <td>{event.title}</td>
                                    <td>{event.description}</td>
                                    <td>{format(new Date(event.recurrence.endsOn), "yyyy-MM-dd")}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
                <Col>
                    <h5 className='border-bottom my-3 py-2'>Past</h5>
                    <Table striped bordered>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {eventsOverdue && eventsOverdue.map((event, index) => (
                                <tr key={index}>
                                    <td>{event.title}</td>
                                    <td>{event.description}</td>
                                    <td>{format(new Date(event.recurrence.endsOn), "yyyy-MM-dd")}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
    );
}

export default DashboardPage;