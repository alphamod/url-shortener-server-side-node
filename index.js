const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://alphasyed:syedalphamod@cluster0.r1yds.mongodb.net/urlshortener?retryWrites=true&w=majority")

const { UrlModel } = require('./models/urlshort');
// Middleware
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    UrlModel.find((err, result) => {
        res.render('home', {
            // sending data to ejs file
            urlResult: result
        });
    })
})

app.post('/create', (req, res) => {
    // console.log(req.body.longUrl);
    // saving short Url
    let urlShort = new UrlModel({
        longUrl: req.body.longUrl,
        shortUrl: generateUrl()
    })
    urlShort.save((err, data) => {
        if (err) throw err;
        // if (err) {
        //     console.log(err);
        //     if (err.code == 11000) {
        //         urlShort.shortUrl = generateUrl()
        //         urlShort.save((err1, data1) => {
        //             if (err1) throw err1;
        //             console.log(data1);
        //         });
        //     }
        //     // throw err;
        // }
        // console.log(data);
        res.redirect("/");
    });
})

app.get('/:shortId', (req, res) => {
    UrlModel.findOne({ shortUrl: req.params.shortId }, (err, result) => {
        if (err) throw err;
        UrlModel.findByIdAndUpdate({ _id: result.id }, { $inc: { clickCount: 1 } }, (err, updatedResult) => {
            // console.log(err);
            if (err) throw err;
            res.redirect(result.longUrl);
        })
    })
})

app.get('/delete/:id', (req, res) => {
    UrlModel.findByIdAndDelete({ _id: req.params.id }, (err, result) => {
        if (err) throw err;
        res.redirect('/');
    });
});

let generateUrl = () => {
    // let existing
    // UrlModel.find((err, result) => {
    //     if (err) throw err;
    // })
    randResult = "";
    let characs = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`;
    let charLength = characs.length;

    for (let i = 0; i < 5; i++) {
        randResult += characs.charAt(Math.floor(Math.random() * charLength));
    };

    return randResult;
}


app.listen(3000, () => {
    console.log('Node listening on port 3000');
});