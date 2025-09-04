import React, { useState } from 'react';
import { Card, CardContent, Typography, Button, Collapse } from '@mui/material';
import ClickDetails from './ClickDetails';

const ShortenedURLCard = ({ urlData }) => {
    const [isDetailsVisible, setIsDetailsVisible] = useState(false);

    const toggleDetails = () => {
        setIsDetailsVisible(!isDetailsVisible);
    };

    const { shortUrl, originalUrl, createdAt, expiresAt, clicks, clickLogs } = urlData;

    return (
        <Card sx={{ mb: 2 }}>
            <CardContent>
                <Typography variant="h6">
                    <a href={shortUrl} target="_blank" rel="noopener noreferrer">
                        {shortUrl}
                    </a>
                </Typography>
                <Typography color="text.secondary" gutterBottom>
                    Original: {originalUrl}
                </Typography>
                <Typography variant="body2">
                    Created: {new Date(createdAt).toLocaleString()}
                </Typography>
                <Typography variant="body2">
                    Expires: {new Date(expiresAt).toLocaleString()}
                </Typography>
                <Typography variant="body2">
                    Clicks: {clicks}
                </Typography>
                <Button size="small" onClick={toggleDetails} sx={{ mt: 1 }}>
                    {isDetailsVisible ? 'Hide Details' : 'Show Details'}
                </Button>
                <Collapse in={isDetailsVisible} timeout="auto" unmountOnExit>
                    <ClickDetails clickLogs={clickLogs} />
                </Collapse>
            </CardContent>
        </Card>
    );
};

export default ShortenedURLCard;