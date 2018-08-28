const express = require('express');
const app = express();
const fs = require('fs');
const qs = require('querystring');
let words = {buzzwords: []}
function newWord(buzzword) {
    this.buzzword = buzzword;
}

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send(`./public/index.html`);
});

app.get('/buzzwords', (req, res) => {
    res.send(words);
})

app.post('/buzzwords', (req, res) => {
    let body = [];
    req.on('data', data => {
        body.push(data);
    }).on('end', () => {
        body = Buffer.concat(body).toString();
        let parsedBody = qs.parse(body);
        let addWord = new newWord(parsedBody.buzzword);
        addWord.points = 0;
        words.buzzwords.push(addWord);
        let responseBodyContents = `<!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="X-UA-Compatible" content="ie=edge">
                <title>Document</title>
            </head>
            <body>
                <h1>Testing more</h1>
            </body>
        </html>`

        fs.writeFile(`public/index.html`, responseBodyContents, err => {
            if (err) {
                console.log(err);
                res.send('{"success": false}');
            } else {
                console.log(words);
                res.send('{"success": true}')
            }
        })
    });
})

const server = app.listen(3000, () => {
    const host = server.address().address;
    const port = server.address().port;

    console.log(`PLEASE SHOW http://${host}:${port}`);
})