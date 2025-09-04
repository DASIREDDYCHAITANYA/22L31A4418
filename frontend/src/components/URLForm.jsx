import React, { useState } from 'react';
import { Button, TextField, Box, IconButton, Tooltip, Snackbar, Alert } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import axios from 'axios';
import loggingMiddleware from '../middleware/loggingMiddleware';

const URLForm = ({ setShortenedUrls }) => {
    const [inputs, setInputs] = useState([{ longUrl: '', shortCode: '', validity: '' }]);
    const [error, setError] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const handleAddInput = () => {
        if (inputs.length < 5) {
            setInputs([...inputs, { longUrl: '', shortCode: '', validity: '' }]);
        }
    };

    const handleRemoveInput = (index) => {
        const newInputs = inputs.filter((_, i) => i !== index);
        setInputs(newInputs);
    };

    const handleChange = (index, event) => {
        const newInputs = [...inputs];
        newInputs[index][event.target.name] = event.target.value;
        setInputs(newInputs);
    };

    const validateUrl = (url) => {
        const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
        return urlRegex.test(url);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        loggingMiddleware.logFormSubmission('URLForm', inputs);

        for (const input of inputs) {
            if (!validateUrl(input.longUrl)) {
                setError(`Invalid URL: ${input.longUrl}`);
                setOpenSnackbar(true);
                return;
            }
            if (input.validity && (!Number.isInteger(Number(input.validity)) || Number(input.validity) <= 0)) {
                setError('Validity must be a positive integer.');
                setOpenSnackbar(true);
                return;
            }
        }

        try {
            loggingMiddleware.logApiCall('/api/shorten', 'POST', inputs);
            // This is a mock response. Replace with actual API call.
            const response = {
                data: inputs.map(input => ({
                    shortUrl: `http://short.url/${input.shortCode || Math.random().toString(36).substring(7)}`,
                    originalUrl: input.longUrl,
                    expiresAt: new Date(new Date().getTime() + (input.validity || 60) * 60000).toISOString()
                }))
            };
            // const response = await axios.post('/api/shorten', { urls: inputs });
            setShortenedUrls(response.data);
            setError('');
        } catch (error) {
            loggingMiddleware.logError(error);
            setError('Failed to shorten URLs. Please try again.');
            setOpenSnackbar(true);
        }
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            {inputs.map((input, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <TextField
                        name="longUrl"
                        label="Long URL"
                        variant="outlined"
                        fullWidth
                        required
                        value={input.longUrl}
                        onChange={(e) => handleChange(index, e)}
                        sx={{ mr: 1 }}
                    />
                    <TextField
                        name="shortCode"
                        label="Preferred Shortcode"
                        variant="outlined"
                        value={input.shortCode}
                        onChange={(e) => handleChange(index, e)}
                        sx={{ mr: 1, width: '30%' }}
                    />
                    <TextField
                        name="validity"
                        label="Validity (mins)"
                        type="number"
                        variant="outlined"
                        value={input.validity}
                        onChange={(e) => handleChange(index, e)}
                        sx={{ mr: 1, width: '20%' }}
                    />
                    {inputs.length > 1 && (
                        <Tooltip title="Remove URL">
                            <IconButton onClick={() => handleRemoveInput(index)}>
                                <RemoveCircleOutlineIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                </Box>
            ))}
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Tooltip title="Add another URL (up to 5)">
                    <span>
                        <IconButton onClick={handleAddInput} disabled={inputs.length >= 5}>
                            <AddCircleOutlineIcon />
                        </IconButton>
                    </span>
                </Tooltip>
                <Button type="submit" variant="contained" color="primary">
                    Shorten URLs
                </Button>
            </Box>
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default URLForm;
