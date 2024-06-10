import {Calendar, dateFnsLocalizer} from 'react-big-calendar'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import enUS from 'date-fns/locale/en-US'
import {useEffect, useState} from 'react'
import SERVER_URL from '../constants/constants'
import parseISO from 'date-fns/parseISO';
import {Container, Row, Col} from 'react-bootstrap'

const CalendarPage = (props) => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch(SERVER_URL + "/api/events/todo", {
                    method: "GET",
                    credentials: "include"
                });
                const data = await response.json();
                setEvents(data);
            } catch (err) {
                console.error(err);
            }
        }
        fetchEvents();
    }, []);

    const locales = {
        'en-US': enUS,
    }

    const localizer = dateFnsLocalizer({
        format,
        parse,
        startOfWeek,
        getDay,
        locales,
    });

    const eventData = (events) => {
        return events.map((event) => {
            const id = event._id;
            const title = event.title;
            const description = event.description;
            const start = event.created;
            const end = event.recurrence.endsOn;
            return {
                id,
                title,
                description,
                start: parseISO(start),
                end: parseISO(end)
            };
        });
    }

    return (
        <Container className="px-4">
            <Row>
                <Col>
                    <h2 className="border-bottom my-3 pb-2">Calendar</h2>
                    <Calendar
                        localizer={localizer}
                        events={eventData(events)}
                        startAccessor="start"
                        endAccessor="end"
                        style={{height: 500}}
                    />
                </Col>
            </Row>
        </Container>
    )
}

export default CalendarPage;