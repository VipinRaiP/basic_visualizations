/* Main file */

const express = require("express");
const bodyParser  = require("body-parser");
const mysql = require('mysql');

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

var con = mysql.createConnection({
    host:"localhost",
    user: "root",
    password:"password"
});


con.connect(function(err){
    if(err) console.log(err);
    console.log("connected");
});

sql =  "use Clinical_data"

con.query(sql,function(err,res){
    if(err) console.log(err);
    console.log(res);
})

//sql = "select DistrictId,(count(old_alcohal_female)+count(old_alcohal_male)+count(new_alcohal_female)+count(new_alcohal_male)) as Count from mytable group by DistrictId;"

/*con.query(sql,function(err,res){
    if(err)
        console.log(err);
    console.log(res);
    data  = res;    
})
*/
app.get("/",function(req,res){
    console.log("got");
    //res.sendFile(__dirname+"public/home.html");
    console.log("Hello")
})

app.get("/alcoholAllDist",function(req,res){
    res.sendFile(__dirname+"/public/index.html");
})

app.get("/alcoholData",function(req,res){
    sql = "select DistrictId,(count(old_alcohal_female)+count(old_alcohal_male)+count(new_alcohal_female)+count(new_alcohal_male)) as Count from mytable group by DistrictId;"

    con.query(sql,function(err,response){
        if(err)
            console.log(err);
        res.json(response);    
    })
})

app.listen(3000,function(){
    console.log("server stareted on port 3000");
})


