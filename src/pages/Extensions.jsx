
import React from 'react'
import * as constants from './constants';

export default () => (
    <div style={{ width: 600, margin: 'auto', marginTop: 75 }}>
        <h1>Supported domain extensions</h1>
        <p>{constants.extensions.join(' ')}</p>
    </div>
);
