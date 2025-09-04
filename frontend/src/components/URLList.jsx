import React from 'react';
import { List, ListItem, ListItemText, Paper, Typography } from '@mui/material';

const URLList = ({ shortenedUrls }) => {
    if (shortenedUrls.length === 0) {
        return null;
    }

    return (
        <Paper elevation={3} sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ p: 2 }}>
                Shortened URLs
            </Typography>
            <List>
                {shortenedUrls.map((url, index) => (
                    <ListItem key={index} divider>
                        <ListItemText
                            primary={
                                <a href={url.shortUrl} target="_blank" rel="noopener noreferrer">
                                    {url.shortUrl}
                                </a>
                            }
                            secondary={`Original: ${url.originalUrl} | Expires: ${new Date(url.expiresAt).toLocaleString()}`}
                        />
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
};

export default URLList;
