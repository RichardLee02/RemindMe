import { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap'
import { io } from 'socket.io-client';
import SERVER_URL from '../constants/constants'
const socket = io('http://localhost:8080');

const ActivitiesPage = () => {

    useEffect(() => {
        socket.on('connect', () => {
            console.log('Connected to server');
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from server');
        });

        return () => {
            socket.disconnect();
        }
    }, []);

    return (
        <Container className="p-4">
            <Row>
                <Col>
                    <h2 className="border-bottom pb-2 mb-3">Activities</h2>
                </Col>
            </Row>
            <Row>
                <Col>
                    <div>
                        <h2>Notifications</h2>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}

export default ActivitiesPage;