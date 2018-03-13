
import React from 'react'

const extensions = require('./_extensions.json');

export default () => (
    <div style={{ width: 600, margin: 'auto', marginTop: 75 }}>
        <h1>Supported domain extensions</h1>
        <p>{extensions.join(' ')}</p>
    </div>
);
