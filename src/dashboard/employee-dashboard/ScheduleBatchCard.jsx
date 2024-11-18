import React from 'react';
import { Button } from '@mui/material';

const ScheduleBatchCard = ({ batch, onPublish, onDelete, onView }) => {
  const { startDate, endDate, status } = batch;

  return (
    <div>
      <h3>Schedule for {formatDateRange(startDate, endDate)}</h3>
      <p>Status: {status}</p>
      <Button onClick={() => onView(batch)}>View</Button>
      <Button onClick={() => onPublish(batch)} disabled={status === 'Published'}>
        Publish
      </Button>
      <Button onClick={() => onDelete(batch)}>Delete</Button>
    </div>
  );
};

export default ScheduleBatchCard;
