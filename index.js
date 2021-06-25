const express = require('express');
const sql = require('mysql');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const env = require("dotenv").config();
//mysql configuration
const db = sql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE_NAME,
    port: process.env.DB_PORT
})

const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


//connecting to mysql database
// db.connect((err) => {
//     if (err)
//         throw err;
//     console.log("Database Connected ...")
// })
app.get("/", (req, res) => {
        res.send('Hello world');
    })
    //create table
app.get('/create-table', (req, res) => {
    const query = "Create Table Teachers(id int AUTO_INCREMENT,Name VARCHAR(250),Classes JSON,PRIMARY KEY (id))";
    db.query(query, (err, res) => {
        if (err)
            throw err;
        res.send({
            status: "Success",
        });

    })
})

//insert values into table
app.get('/insert-data', (req, res) => {
    const sql = `INSERT INTO Teachers(NAME,Classes) VALUES ('C',null)`;
    db.query(sql, (err, result) => {
        if (err)
            throw err;
        res.send({
            status: "Success",
        });
    })
})

//get all teachers from DB
app.get('/get', (req, res) => {
    const sql = "SELECT * FROM Teachers";
    db.query(sql, (err, results) => {
        if (err)
            throw err;
        res.send({
            status: "Success",
            data: results
        });
    })
})

//get specific teacher from DB
app.get('/get/:id', (req, res) => {
    const sql = `SELECT * FROM Teachers WHERE id = ${req.params.id}`;
    db.query(sql, (err, result) => {
        if (err)
            throw err;
        const data = {
            ...result[0],
            Classes: JSON.parse(result[0].Classes)
        }

        res.send({
            status: "Success",
            data
        });;
    })
});

//update teacher classes
app.put("/update/:id", (req, res) => {
    let classes = req.body;
    classes = JSON.stringify(classes);
    console.log(classes);
    const sql = `UPDATE Teachers SET Classes = '${classes}' WHERE id = ${req.params.id}`;
    db.query(sql, (err, result) => {
        if (err)
            throw err;
        res.send({
            status: res.status
        });
    })
})

//delete records from table
app.delete("/delete-records", (req, res) => {
    const sql = "TRUNCATE TABLE Teachers";
    db.query(sql, (err, result) => {
        if (err)
            throw err;

        res.send({
            status: "Success",
        });
    })
})


app.listen(PORT, () => {
    console.log(`Server is running on ${PORT} ...`);
})