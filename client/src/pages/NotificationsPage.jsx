import {useEffect, useState} from 'react';
import io from 'socket.io-client';
import {Card, Col, Container, ProgressBar, Row} from 'react-bootstrap';
import SERVER_URL from '../constants/constants';
import {format} from "date-fns";

const socket = io(SERVER_URL, {
    withCredentials: true,
    autoConnect: false
});

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        socket.connect();
        socket.on('In-App', data => {
            setNotifications(data.message);
        });

        return () => {
            socket.disconnect();
        };
    }, [notifications]);

    const progress = (timestamp) => {
        const specificDate = new Date(timestamp);
        const currentDate = new Date();
        const differenceInMilliseconds = specificDate - currentDate;
        const differenceInSeconds = Math.abs(differenceInMilliseconds / 1000);
        return Math.abs(differenceInSeconds / (24 * 60 * 60)) * 100;
    }

    const remainingHours = (timestamp) => {
        const specificDate = new Date(timestamp);
        const currentDate = new Date();
        const differenceInMilliseconds = specificDate - currentDate;
        const differenceInHours = Math.abs(differenceInMilliseconds / (1000 * 60 * 60));
        return Math.round(differenceInHours);
    }

    return (
        <Container className="p-4">
            <Row>
                <Col>
                    <h2 className="border-bottom pb-2 mb-3">Notifications</h2>
                </Col>
            </Row>
            <Row>
                <Col>
                    {
                        notifications.map((notification) => (
                            <Card className="mb-2">
                                <Card.Header>Due: {format(new Date(notification.recurrence.endsOn), "yyyy-MM-dd HH:mm")}</Card.Header>
                                <Card.Body>
                                    <Card.Title>{notification.title}</Card.Title>
                                    <Card.Subtitle
                                        className="mb-2 text-muted">{notification.description}</Card.Subtitle>
                                    <Card.Text className="mb-1">Hours
                                        Remaining: {remainingHours(notification.recurrence.endsOn)}</Card.Text>
                                    <ProgressBar now={progress(notification.recurrence.endsOn)}/>
                                </Card.Body>
                            </Card>
                        ))
                    }
                </Col>
            </Row>
        </Container>
    );
}

export default NotificationsPage;