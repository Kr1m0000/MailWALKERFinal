import React, { useState, useEffect, useContext } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { UidContext } from "../AppContext";
import { Modal, Button, Form } from "react-bootstrap";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./styles/bootstrap-5.0.2-dist/css/bootstrap.min.css";
import axios from "axios";
import EventItem from "./EventItem";
import EventDetailsModal from "./EventDetailsModal";

const localizer = momentLocalizer(moment);

const MyCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [eventForm, setEventForm] = useState({ title: "", description: "" });
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const uid = useContext(UidContext);
  const [showEventDetailsModal, setShowEventDetailsModal] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL;

  const handleDateClick = ({ start }) => {
    setSelectedDate(start);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEventForm({ title: "", description: "" });
  };

  const handleEventItemClick = (event) => {
    setSelectedEvent(event);
    setShowEventDetailsModal(true);
  };

  const handleInputChange = (e) => {
    setEventForm({ ...eventForm, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Submission Data:", {
      title: eventForm.title,
      description: eventForm.description,
      date: selectedDate,
      uid: uid,
      apiUrl: apiUrl,
    });

    try {
      const response = await axios.post(`${apiUrl}api/user/events/${uid}`, {
        title: eventForm.title,
        description: eventForm.description,
        date: selectedDate,
      });

      console.log("Response:", response);

      if (response.data) {
        handleModalClose();
        handleGetEvents();
      } else {
        console.error("Error saving event:", response.statusText);
      }
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

  const handleGetEvents = async () => {
    try {
      const response = await axios.get(`${apiUrl}api/user/getEvents/${uid}`);
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      // Perform axios delete request
      const response = await axios.delete(
        `${apiUrl}api/user/events/${uid}/${eventId}`
      );

      // Handle the response (e.g., update events list, show success message)
      console.log(response.data);
      handleGetEvents(); // Update events list after deletion
      setShowEventDetailsModal(false); // Close the modal after deleting
    } catch (error) {
      // Handle error (e.g., show error message)
      console.error(error);
    }
  };

  useEffect(() => {
    handleGetEvents();
  }, []);

  const getDayProps = (date, events) => {
    const eventForDate = events.find((event) =>
      moment(date).isSame(moment(event.date), "day")
    );

    return eventForDate
      ? {
          style: {
            backgroundColor: "#ffd86c",
            color: "white",
            textAlign: "center",
            paddingTop: "5px",
          },
          title: eventForDate.title,
        }
      : {};
  };

  return (
    <div>
      <div className="calendar-container">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          views={["month", "week", "day"]}
          selectable
          onSelectSlot={handleDateClick}
          defaultView="month"
          dayPropGetter={(date) => getDayProps(date, events)}
          style={{
            marginLeft: 250,
            marginRight: 40,
            marginTop: 20,
            height: 500,
            color: "#333",
            backgroundColor: "#f5f5f5",
            borderRadius: "8px",
          }}
          eventStyle={(event, start, end, isSelected) => {
            const backgroundColor = isSelected ? "cyan" : event.color;
            const style = {
              backgroundColor,
              borderRadius: "5px",
              opacity: 0.8,
              color: "#fff",
              border: "none",
              display: "block",
            };
            return {
              style,
            };
          }}
        />
      </div>

      <Modal show={showModal} onHide={handleModalClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleFormSubmit}>
            <Form.Group controlId="eventTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter event title"
                name="title"
                value={eventForm.title}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="eventDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Enter event description"
                name="description"
                value={eventForm.description}
                onChange={handleInputChange}
                rows={3}
              />
            </Form.Group>

            <Form.Group controlId="eventDate">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="text"
                value={moment(selectedDate).format("YYYY-MM-DD")}
                disabled
              />
            </Form.Group>
            <br/>

            <Button variant="primary" type="submit">
              Save Event
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 20,
          zIndex: 999,
          marginLeft: 100,
          maxWidth: 200,
        }}
      >
        <h2 style={{ textAlign: "center", textDecoration: "underline" }}>
          Reminder:
        </h2>

        <ul style={{ listStyleType: "none", padding: 0, marginTop: 20 }}>
          {events
            .slice() // Create a shallow copy of the array to avoid mutating the original array
            .sort((a, b) => {
              const dateA = new Date(a.date);
              const dateB = new Date(b.date);
              const today = new Date();

              if (dateA >= today && dateB >= today) {
                return dateA - dateB; // Sort events after today by date
              } else if (dateA < today && dateB >= today) {
                return 1; // Move events before today to the end of the list
              } else if (dateA >= today && dateB < today) {
                return -1; // Move events before today to the beginning of the list
              }

              return dateA - dateB; // Sort remaining events by date
            })
            .map((event) => (
              <EventItem
                key={event._id}
                event={event}
                onClick={handleEventItemClick}
              />
            ))}
        </ul>
      </div>
      <EventDetailsModal
        show={showEventDetailsModal}
        handleClose={() => setShowEventDetailsModal(false)}
        event={selectedEvent}
        onDelete={handleDeleteEvent}
        
      />
    </div>
  );
};

export default MyCalendar;
