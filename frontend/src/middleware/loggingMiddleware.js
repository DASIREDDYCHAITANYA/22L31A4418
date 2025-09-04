const log = (type, message, data) => {
    console.log(`[${new Date().toISOString()}] [${type}] ${message}`, data);
};

const loggingMiddleware = {
    logApiCall: (url, method, data) => {
        log('API_CALL', `Requesting ${method} ${url}`, data);
    },
    logFormSubmission: (formName, data) => {
        log('FORM_SUBMISSION', `Submitting ${formName}`, data);
    },
    logNavigation: (to, from) => {
        log('NAVIGATION', `Navigating from ${from} to ${to}`);
    },
    logError: (error) => {
        log('ERROR', 'An error occurred', error);
    }
};

export default loggingMiddleware;
