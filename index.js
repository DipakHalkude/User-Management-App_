const { faker } = require("@faker-js/faker");
const mysql = require('mysql2');
const express=require('express');
const app=express();
const port=8080;
const path=require("path");
const methodOverride=require("method-override");
const { v4: uuidv4 } = require('uuid');

app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.set("view engine","ejs");
app.set("/views",path.join(__dirname,"/views"));
app.use(express.static(path.join(__dirname, 'public')));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'delta_app',
    password: 'Vd@164399',
});

let createRandomUser = () => {
    return[
        faker.string.uuid(),
        faker.internet.username(),
        faker.internet.email(),
        faker.internet.password(),
    ];
};

// Inserting new Data 
// let q="insert into user (id,username,email,password) values (?,?,?,?)";
// let user=['123','Dipak','dipakdh12345@gmail.com','Vd@164399'];

// let q="insert into user (id,username,email,password) values ? ";
// let users=[['1212','Ram','ram12345@gmail.com','Ram@143'],['12','Radha','radha143@gmail.com','Radha@143']];

// Inserting Data 
// let q="insert into user (id,username,email,password) values ? ";
// let data=[];
// for(let i=0;i<100;i++)
// {
//     // console.log(createRandomUser());
//     data.push(createRandomUser());  // 100 fake user data 
    
// }



// try {
//     connection.query(q,[data],(err, result) => {
//         if (err) throw err;
//         console.log(result);
//     })
// } catch (err) {
//     console.log(err);
// }

// connection.end();



// console.log(createRandomUser());


// Home Page :)
app.get("/",(req,res)=>{
    let q="select count(*) from user";
    try {
        connection.query(q,(err, result) => {
            if (err) throw err;
            let ans=result[0]["count(*)"];
            res.render("home.ejs",{ans});
        })
    } catch (err) {
        console.log(err);
        res.send("Some Error in DB ):");
    }

});


// User Data Page :)
app.get("/user",(req,res)=>{
    let q="select id,username,email from user";
    try {
        connection.query(q,(err, result) => {
            if (err) throw err;
            // console.log(result[0]);
            let data=result;
            res.render("user.ejs",{data});
        })
    } catch (err) {
        console.log(err);
        res.send("Some Error in DB ):");
    }
});



// Edit Route :)
app.get("/user/:id/edit",(req,res)=>{
    let {id}=req.params;
    let q=`select * from user where id='${id}'`;
    try {
        connection.query(q,(err, result) => {
            if (err) throw err;
        //    console.log(result);
            let data=result[0];
            res.render("edit.ejs",{data});
        })
    } catch (err) {
        console.log(err);
        res.send("Some Error in DB ):");
    }
    
});


// Update Route :)
app.patch("/user/:id",(req,res)=>{
    let {id}=req.params;
    let q=`select * from user where id='${id}'`;
    let {username,password}=req.body;
    try {
        connection.query(q,(err, result) => {
            if (err) throw err;
        //    console.log(result);
            let data=result[0];
            if(password==data.password)
            {
               let q2= `update user set username='${username}' where id='${id}'`;
               try {
                connection.query(q2,(err, result) => {
                    if (err) throw err;
                    res.redirect("/user");
                })
            } catch (err) {
                console.log(err);
                res.send("Some Error in DB ):");
            }
            //    res.redirect()
            }
            else
            {
                res.render("error.ejs",{data});
            }
        })
    } catch (err) {
        console.log(err);
        res.send("Some Error in DB ):");
    }
});


// Add New User :)
app.get("/user/add",(req,res)=>{
    res.render("add.ejs");
});



app.post("/user", (req, res) => {
    let Q = `SELECT id, username, email, password FROM user`;
    
    try {
        connection.query(Q, (err, result) => {
            if (err) throw err;

            let { username, email, password } = req.body;
            let id = uuidv4();

            let isUnique = result.every(user => 
                user.id !== id && 
                user.username !== username && 
                user.email !== email && 
                user.password !== password
            );

            if (isUnique) {
                let q = `INSERT INTO user (id, username, email, password) VALUES (?, ?, ?, ?)`;

                connection.query(q, [id, username, email, password], (err, result) => {
                    if (err) throw err;
                    res.redirect("/user");
                });
            } else {
                res.render("alreadyexits.ejs");
            }
        });
    } catch (err) {
        console.log(err);
        res.send("Some Error in DB ):");
    }
});



// Delete User :)

app.get("/user/:id/delete",(req,res)=>{
    let {id}=req.params;
    let q=`select * from user where id='${id}'`;
    try {
        connection.query(q,(err, result) => {
            if (err) throw err;
        //    console.log(result);
            let data=result[0];
            res.render("delete.ejs",{data});
        })
    } catch (err) {
        console.log(err);
        res.send("Some Error in DB ):");
    }
    
    
})

app.delete("/user/:id",(req,res)=>{
    let {id}=req.params;
    let q=`select * from user where id='${id}'`;
    let {email,password}=req.body;
    try {
        connection.query(q,(err, result) => {
            if (err) throw err;
        //    console.log(result);
            let data=result[0];
            if(password==data.password && email==data.email)
            {
               let q2= `delete from user where id='${id}'`;
               try {
                connection.query(q2,(err, result) => {
                    if (err) throw err;
                    res.redirect("/user");
                })
            } catch (err) {
                console.log(err);
                res.send("Some Error in DB ):");
            }
            //    res.redirect()
            }
            else
            {
                res.render("error_delete.ejs",{data});
            }
        })
    } catch (err) {
        console.log(err);
        res.send("Some Error in DB ):");
    }
})

app.listen(port,()=>{
    console.log("Server Running on port 8080 :)");
})



