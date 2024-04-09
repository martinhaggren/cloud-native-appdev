const express = require('express');
const routes = express.Router();
const axios     = require('axios').default;

// TODO Exercise 1: Implement healthcheck path GET /healthz
// ...
routes.get('/healthz', (_, res) => {
    res.status(200).send('Service is healthy');
});

// TODO Exercise 2 "Resiliency": Simulate service failure
// ...

routes.post('/content-request', async (req, res) => {
    const contentRequest = req.body;

    // Simple validation - check for existence of languaeg and fields
    if (!contentRequest.language || !contentRequest.fields) {
        return res.status(400).send('Invalid content request.');
    }

    try {
        const response
            = await axios({
            method: 'POST',
            url: 'http://content/request',
            data: contentRequest,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const request
            = response.data;

        console.log(`RequestId received from Content Service: '${request.id}'`);

        res.send(request);
    } catch (error) {
        console.error('Error storing contentRequest', error);
        res.status(500).send('Error storing contentRequest');
    }
    // -- replace the dummy response below
    // ...

    // TODO Exercise 4: Send messages to SNS via the AWS SDK for SNS (according to example in exercise description)
    // ...

    // Send a response back to the client
    //res.status(200).send('Successful (dummy) response with status 200');

});

routes.get('/content-request/:id', async (req, res) => {

    // TODO Exercise 3: Fetch an existing request
    // -- replace the dummy response below
    // ...
    //res.status(404).send("Call to content service needs to be implemented.")

    const requestId = req.params.id;

    try {
        const response = await axios.get(`http://content/request/${requestId}`);
        res.send(response.data);
    } catch (error) {
        console.error(`Error fetching contentRequest with id ${requestId}:`, error);
        res.status(error.response.status).send(`Error fetching contentRequest with id ${requestId}`);
    }
});

module.exports = routes;