const express = require('express');
const app = express();
const fs = require('fs');
const qs = require('querystring');
let totalScore = 0;
let words = {buzzwords: [], totalScore: totalScore}
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
        let checkRepeat = words.buzzwords.filter(x => x.buzzword===parsedBody.buzzword);
        if (words.buzzwords.length < 5 && checkRepeat.length < 1) {
            let addWord = new newWord(parsedBody.buzzword);
            addWord.points = 0;
            words.buzzwords.push(addWord);
            console.log(words);
            console.log("*****************");
            res.send('{"success": true}')
        } 
        else if (checkRepeat.length < 1) {
            console.log(`${parsedBody.buzzword} was not added, too many buzzwords`)
            console.log("*****************");
            res.send('{"success": false}');
        }
        else {
            console.log(`${parsedBody.buzzword} has already been added`)
            console.log("*****************");
            res.send('{"success": false}');
        }
    });
})

app.post('/reset', (req, res) => {
    req.on('data', data => {
    }).on('end', () => {
        words.buzzwords = [];
        words.totalScore = 0;
        console.log(words);
        console.log("*****************");
        res.send('{"reset": true,success": true}')
    });
})

app.post('/heard', (req, res) => {
    let body = [];
    req.on('data', data => {
        body.push(data);
    }).on('end', () => {
        body = Buffer.concat(body).toString();
        let parsedBody = qs.parse(body);
        let checkMatch = words.buzzwords.filter(x => x.buzzword===parsedBody.buzzword);
        if (checkMatch.length > 0) {
            words.totalScore++;
            console.log(words);
            console.log("Total Score Updated")
            console.log("*****************");
            res.send('{"total update success": true}')
        } else {
            console.log(words);
            console.log("Total Score Not Updated")
            console.log("*****************");
            res.send('{"total update success": false}')
        }
    });
})

app.put('/buzzwords', (req, res) => {
    let body = [];
    req.on('data', data => {
        body.push(data);
    }).on('end', () => {
        body = Buffer.concat(body).toString();
        let parsedBody = qs.parse(body);
        let found = false;
        for (let i=0; i<words.buzzwords.length; i++) {
            if (words.buzzwords[i].buzzword === parsedBody.buzzword) {
                words.buzzwords[i].points++;
                words.totalScore++;
                found = true;
                console.log(words);
                console.log('Word Points Updated');
                res.send('{"word points success": true}')
            }
        }
        if (!found) {
            console.log(words);
            console.log('Word Points Not Updated');
            res.send('{"word points success": false}')
        }
    });
});

app.delete('/buzzwords', (req, res) => {
    let body = [];
    req.on('data', data => {
        body.push(data);
    }).on('end', () => {
        body = Buffer.concat(body).toString();
        let parsedBody = qs.parse(body);
        let found = false;
        for (let i=0; i<words.buzzwords.length; i++) {
            if (words.buzzwords[i].buzzword === parsedBody.buzzword) {
                words.totalScore -= words.buzzwords[i].points;
                words.buzzwords.splice(i, 1);
                found = true;
                console.log(words);
                console.log('Word Deleted');
                res.send('{"deletion success": true}')
            }
        }
        if (!found) {
            console.log(words);
            console.log('Word Not Found');
            res.send('{"deletion success": false}')
        }
    });
});

const server = app.listen(3000, () => {
    const host = server.address().address;
    const port = server.address().port;

    console.log(`PLEASE SHOW http://${host}:${port}`);
})