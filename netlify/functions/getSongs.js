const fs = require('fs');
const path = require('path');

exports.handler = async function () {
    const songsDir = path.join(__dirname, '../../mysongs');
    try {
        const files = fs.readdirSync(songsDir);
        return {
            statusCode: 200,
            body: JSON.stringify(files),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Could not fetch songs" }),
        };
    }
};
