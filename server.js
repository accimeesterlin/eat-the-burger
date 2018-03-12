const express = require("express");
const app = express();
const port = process.env.PORT || 9000;
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root1',
    password: '',
    database: 'burgers_db'
});

const handlebars = require("express-handlebars");

app.use(express.static("public"));
app.use(morgan());
app.use(bodyParser());

app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


app.get("/", (req, res) => {
    const data = { msg: "Ok" };
    res.json(data);
});

app.get("/home", (req, res) => {

    connection.query("SELECT * FROM burgers", function (err, results) {
        if (err) throw err;
        console.log("Results: ", results);

        res.render("index", { burgers: results });

    });

})


app.get("/dashboard", (req, res) => {
    res.render("dashboard");
});


app.post("/add", (req, res) => {

    const burger_name = req.body.burger_name;

    connection.query("INSERT INTO burgers (burger_name) VALUES ('" + burger_name + "')", function (err, result) {
        if (err) {
            res.status(401).json({ error: " Burger were not able to be saved" });;
        }
        res.redirect("/home");

    });
});

app.listen(port, () => {
    console.log("Server is starting at port ", port);
});