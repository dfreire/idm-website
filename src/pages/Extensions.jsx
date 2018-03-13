
import React from 'react'

const extensions = require('./_extensions.json');

export default () => (
    <div>
        <h1>Supported domain extensions</h1>
        <p>{extensions.join(' ')}</p>
    </div>
);
