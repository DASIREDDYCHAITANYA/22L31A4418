import React, { useState } from 'react';
import URLForm from '../components/URLForm';
import URLList from '../components/URLList';

const ShortenerPage = () => {
    const [shortenedUrls, setShortenedUrls] = useState([]);

    return (
        <div>
            <URLForm setShortenedUrls={setShortenedUrls} />
            <URLList shortenedUrls={shortenedUrls} />
        </div>
    );
};

export default ShortenerPage;
