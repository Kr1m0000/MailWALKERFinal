import React from 'react';
import moment from 'moment';

const EventItem = ({ event, onClick }) => {
  const eventDate = moment(event.date);
  const currentDate = moment();
  const daysDifference = eventDate.diff(currentDate, 'days');

  let backgroundColor = '#f5f5f5'; // Default color

  if (daysDifference === 0) {
    backgroundColor = 'lightcoral'; // Slightly red
  };

  const styles = {
    container: {
      cursor: 'pointer',
      marginBottom: 8,
      padding: 10,
      border: '1px solid #ccc',
      borderRadius: 5,
      backgroundColor,
    },
    eventItem: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
    title: {
      fontWeight: 'bold',
      marginBottom: 5,
    },
  };

  return (
    <li key={event._id} style={styles.container} onClick={() => onClick(event)}>
      <div style={styles.eventItem}>
        <p style={styles.title}>{event.title}</p>
        {/* You can add more details here if needed */}
      </div>
    </li>
  );
};

export default EventItem;

