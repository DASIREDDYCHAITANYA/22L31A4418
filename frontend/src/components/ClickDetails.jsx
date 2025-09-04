import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
} from '@mui/material';

const ClickDetails = ({ clickLogs = [] }) => {
    return (
        <>
            {clickLogs.length === 0 ? (
                <Typography sx={{ mt: 2 }} color="text.secondary">
                    No click details available.
                </Typography>
            ) : (
                <TableContainer component={Paper} sx={{ mt: 2, boxShadow: 3 }}>
                    <Table size="small" aria-label="Click Details Table">
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Timestamp</strong></TableCell>
                                <TableCell><strong>Referrer</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {clickLogs.map((log, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        {new Date(log.timestamp).toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                        {log.referrer || 'Direct / Unknown'}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </>
    );
};

export default ClickDetails;
