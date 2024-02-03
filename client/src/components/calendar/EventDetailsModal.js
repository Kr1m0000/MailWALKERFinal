import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import moment from 'moment';

const modalStyle = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '10px',
};

const titleStyle = {
  fontSize: '2.5rem',
  fontWeight: 'bold',
  marginBottom: '10px',
};

const EventDetailsModal = ({ show, handleClose, event, onDelete }) => {
  const handleDelete = () => {
    // Call the onDelete function passed as a prop to delete the event
    onDelete(event._id);
    handleClose(); // Close the modal after deleting
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title style={titleStyle}>Event Details</Modal.Title>
      </Modal.Header>
      <Modal.Body style={modalStyle}>
        {event && (
          <div>
            <p style={{ fontWeight: 'bold', fontSize: '2rem' }}>Title:</p>
            <p style={{fontWeight: 'bold', fontSize: '1.2rem', color: '#997c2c' }}>{event.title}</p>
            <p style={{ fontWeight: 'bold', fontSize: '2rem' }}>Description:</p>
            <p>{event.description}</p>
            <p style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>Date:</p>
            <p>{moment(event.date).format('MMMM Do YYYY, h:mm:ss a')}</p>
            {/* Adjust the format string as per your requirement */}
            <br/>
            <Button variant="danger" style={{}} onClick={handleDelete}>
              Delete Event
            </Button>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default EventDetailsModal;
