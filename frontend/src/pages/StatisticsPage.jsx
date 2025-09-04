import React, { useState, useEffect } from 'react';
import { Typography, Paper } from '@mui/material';
import URLCard from '../components/URLCard';
import loggingMiddleware from '../middleware/loggingMiddleware';

const StatisticsPage = () => {
    const [stats, setStats] = useState([]);

    useEffect(() => {
        const fetchStats = () => {
            try {
                // First, try to get from localStorage
                const localData = localStorage.getItem('shortenedUrls');
                if (localData) {
                    setStats(JSON.parse(localData));
                    return;
                }

                // Otherwise, fetch from API (mocked here)
                loggingMiddleware.logApiCall('/api/stats', 'GET');
                const mockStats = [
                    {
                        shortUrl: 'http://short.url/abc',
                        originalUrl: 'http://example.com/very/long/url/1',
                        createdAt: new Date().toISOString(),
                        expiresAt: new Date(new Date().getTime() + 3600000).toISOString(),
                        clicks: 123,
                        clickLogs: [
                            { timestamp: new Date().toISOString(), referrer: 'direct' },
                            { timestamp: new Date(new Date().getTime() - 60000).toISOString(), referrer: 'google.com' }
                        ]
                    },
                    {
                        shortUrl: 'http://short.url/def',
                        originalUrl: 'http://example.com/very/long/url/2',
                        createdAt: new Date().toISOString(),
                        expiresAt: new Date(new Date().getTime() + 7200000).toISOString(),
                        clicks: 45,
                        clickLogs: [
                            { timestamp: new Date().toISOString(), referrer: 'twitter.com' }
                        ]
                    }
                ];
                setStats(mockStats);
                localStorage.setItem('shortenedUrls', JSON.stringify(mockStats));

            } catch (error) {
                loggingMiddleware.logError(error);
            }
        };

        fetchStats();
    }, []);

    return (
        <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h4" gutterBottom>
                URL Statistics
            </Typography>
            {stats.length > 0 ? (
                stats.map((stat, index) => <URLCard key={index} urlData={stat} />)
            ) : (
                <Typography>No statistics available.</Typography>
            )}
        </Paper>
    );
};

export default StatisticsPage;
