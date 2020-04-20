const express = require('express');
const app = express();
const validate = require('validate.js');
const fs = require('fs');

const constraints = {
    stock_name: {
        presence: true,
        length: {
            min: 1,
            message: "stock name is empty"
        },
        format: {
            pattern: /^[A-Z]+(.[A-Z])*$/,
            message: '%{value} is not in a valid format.'
        }
    }
}

/**
 * reads file fiven in paramter
 * @param {*} filename corresponds to a stock name
 * @returns content of the file or error
 */
function read_json_from_file(filename) {
    return fs.readFileSync('/tmp/' + filename + '.json', 'utf8', (err, jsonString) => {
        if (err) {
            console.log("Error reading file from disk:", err);
            return null;
        }
        try {
            console.log("here");
            return JSON.parse(jsonString);
        } catch(err) {
            console.log('Error parsing JSON string:', err);
        }
    })
}

app.get('/api/predictions/:stock_name', function (req, res, next) {
    const errors = validate(req.params, constraints);
    console.log(req.params);
    if (errors)
        return next(errors.message);
    try {
        const content = read_json_from_file(req.params.stock_name);
        res.status(200).send(content);
    } catch {
        res.status(400).send(req.params.stock_name + " is not available.");
    }
})

const PORT = 3000;

app.listen(PORT, function () {
    console.log('[*] Listening on port', String(PORT));
})