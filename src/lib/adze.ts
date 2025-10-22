import adze, { setup } from 'adze';

setup({
    meta: {
        appVersion: '1.0.0',
    },
});

const logger = adze.timestamp.seal();

export { logger }