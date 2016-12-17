var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var app = express();
app.use(express.static(__dirname));
app.use(bodyParser.json());

function getStudents(callback) {
    fs.readFile('./json/custom.json', 'utf8', function (err, data) {
        var students = [];
        if (err) {
            callback(students)
        } else {
            try {
                students = JSON.parse(data);
            } catch (e) {
                students = [];
            }
            callback(students);
        }
    })
}
function setStudents(students, callback) {
    fs.writeFile('./json/custom.json', JSON.stringify(students), 'utf8', function (err) {
        if (err) {
            students = [];
            callback(err);
        } else {
            callback();
        }
    })
}
app.get('/', function (req, res) {
    res.sendFile('./front.html', {root: __dirname})
});
app.get('/students', function (req, res) {
    getStudents(function (data) {
        res.send(data);
    })
});
app.post('/students', function (req, res) {
    var student = req.body;
    getStudents(function (data) {
        student.id = data.length ? data[data.length-1].id + 1 : 1;
        data.push(student);
        setStudents(data, function () {
            res.send(student);
        });
    })
});
app.get('/students/:id', function (req, res) {
    var id = req.params.id;
    getStudents(function (data) {
        var student = data.find(function (item) {
            return item.id == id;
        });
        res.send(student);
    });
});
app.put('/students/:id', function (req, res) {
    var id = req.params.id;
    var student = req.body;
    getStudents(function (data) {
        var students = data;
        students = students.map(function (item) {
            if (item.id == id) {
                return student;
            } else {
                return item
            }
        });
        setStudents(students, function () {
            res.send({})
        })
    })
});
app.delete('/students/:id',function (req,res) {
    var id = req.params.id;
    getStudents(function (data) {
         var students = data.filter(function (item) {
            return item.id !=id;
        });
        setStudents(students,function () {
            res.send({});
        })
    })
});
app.listen(3000);
