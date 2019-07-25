"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const uuid_1 = require("uuid");
const app = express.application = express();
app.use('/assets', express.static('assets'));
app.use(express.urlencoded());
app.use(express.json());
app.set('view engine', 'ejs');
var database = [{
        "id": "40276069-b860-4142-8263-30ddea1824c9",
        "name": "Marcus",
        "job": "Biz",
        "age": 42
    }];
app.route('/')
    .get(function (req, res) {
    res.render('index');
});
app.route('/register')
    .get(function (req, res) {
    res.render('register');
})
    .post(function (req, res) {
    if (isNameCorrect(req.body.name) && isJobCorrect(req.body.job) && isAgeCorrect(req.body.age)) {
        var profile = {
            "id": uuid_1.v1(),
            "name": req.body.name,
            "job": req.body.job,
            "age": req.body.age
        };
        database.push(profile);
        //res.render('register-success', { data: req.body });
        res.status(201);
        res.end(JSON.stringify(profile));
    }
    else {
        res.status(400);
        res.send("400: Error in Registered Profile");
    }
});
app.route('/members')
    .get(function (req, res) {
    //res.render('members', { data: database});
    res.end(JSON.stringify(database));
});
app.route('/members/:memberNameOrID')
    .get(function (req, res) {
    let nameOrID = req.params.memberNameOrID;
    let searchResult = (isGUID(nameOrID)) ? [database[searchByID(database, nameOrID)]] : searchByName(database, nameOrID);
    //res.render('members', { data: searchResult});
    res.end(JSON.stringify(searchResult));
})
    .put(function (req, res) {
    let nameOrID = req.params.memberNameOrID;
    if (!isGUID(nameOrID))
        res.sendStatus(400);
    if (isNameCorrect(req.body.name) && isJobCorrect(req.body.job) && isAgeCorrect(req.body.age)) {
        var profile = {
            "id": nameOrID,
            "name": req.body.name,
            "job": req.body.job,
            "age": req.body.age
        };
        let index = searchByID(database, nameOrID);
        database.splice(index, 1);
        database.push(profile);
        //res.render('update-success', { data: req.body });
        res.end(JSON.stringify(profile));
    }
    else {
        res.status(400);
        res.send("400: Error in Updated Profile");
    }
})
    .delete(function (req, res) {
    let nameOrID = req.params.memberNameOrID;
    if (!isGUID(nameOrID))
        res.sendStatus(400);
    let index = searchByID(database, nameOrID);
    database.splice(index, 1);
    //res.render('delete-success', { data: nameOrID });
    res.sendStatus(204);
});
app.listen(8080, function () {
    console.log('Capitalize app listening on port 8080!');
});
function isNameCorrect(name) {
    return /^[a-zA-Z ]*$/.test(name);
}
function isGUID(input) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(input);
}
function isJobCorrect(job) {
    return /^[a-zA-Z]+$/.test(job);
}
function isAgeCorrect(age) {
    return (age < 150 && age > 0);
}
function searchByName(database, name) {
    return database.filter(x => matchStringFragment(name, x.name));
}
function searchByID(database, id) {
    return database.findIndex(x => x.id == id);
}
function matchStringFragment(input, fullName) {
    let copyName = fullName;
    while (copyName.length > 0) {
        if (checkString(input, copyName) == input.length) {
            return true;
        }
        else {
            copyName = copyName.substr(checkString(input, copyName) + 1, copyName.length - checkString(input, copyName));
        }
    }
    return false;
}
function checkString(input, ref) {
    let charCount = 0;
    let inputString = input.toLowerCase();
    let refString = ref.toLowerCase();
    for (var i = 0; i < inputString.length && inputString[i] == refString[i]; i++) {
        charCount += 1;
    }
    return Math.max(1, charCount);
}
