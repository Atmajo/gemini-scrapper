const express = require('express');
const { scrapeWithAI } = require('./scrape');

const app = express();
const port = 3030;

app.get('/scrap', (req, res) => {
    const url = req.query.url; // Assuming the query parameter is named 'url'
    const prompt = req.query.prompt;

    try {
        res.send(scrapeWithAI(url, prompt));
    } catch (err) {
        console.log(err)
    }
});

app.listen(port, () => {
    console.log('http://localhost:3030/scrap');
});