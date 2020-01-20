/* Main file */

const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const ejs = require("ejs");

const app = express();
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function(req, res) {
  res.render("home");
});

app.get("/alcoholAllDist", function(req, res) {
  //res.sendFile(__dirname+"/public/index.html");
  res.render("barchartAllDistricts", {
    title: "Total Alcohol Cases",
    data: "getAlcoholDataAllDist",
    parameter: "AlcoholCases",
    threshold: 5000,
    imgSrc : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRruzSFhkQXWevwdH3iQljGteX9oCHROhyhmZu0Hb07MCh45OUP&s"
  });
});

app.get("/suicideAllDist", function(req, res) {
    //res.sendFile(__dirname+"/public/index.html");
    res.render("barchartAllDistricts", {
      title: "Total Suicide Cases",
      data: "getSuicideDataAllDist",
      parameter: "SuicideCases",
      threshold: 700,
      imgSrc : "https://www.apa.org/images/2019-07-cover-suicide_tcm7-258230_w1024_n.jpg"
    });
  });

app.post("/perDist",function(req,res){
  console.log("received")  
  console.log(req.body.districtId);
  console.log(req.body.parameter);
  sendParameters = resolveParameter(req.body.districtId,req.body.parameter);
  res.render("scatterPlotPerDist",sendParameters)
})

/* Resolve parameters */

function resolveParameter(districtId,parameter){
  if(parameter=="alcoholCases"){
    return {
      yLabel : "Alcohol Cases",
      data : "getAlcoholDataPerDist",
      threshold : 30,
      columnName : "AlcoholCases",
      districtId: districtId
    }
  }
  if(parameter=="suicideCases"){
    return {
      yLabel : "Suicide Cases",
      data : "getSuicideDataPerDist",
      threshold : 6,
      columnName : "SuicideCases",
      districtId: districtId
    }
  }
}


/* API to query the data from MySQL DB */

/* Connect to the database */

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password"
});

con.connect(function(err) {
  if (err) console.log(err);
  console.log("connected");
});

sql = "use Clinical_data";
con.query(sql, function(err, res) {
  if (err) console.log(err);
  console.log(res);
});

/*
app.get("/alcoholDataAllDist", function(req, res) {
  sql =
    "select DistrictId,(count(old_alcohal_female)+count(old_alcohal_male)+count(new_alcohal_female)+count(new_alcohal_male)) as AlcoholCases from mytable group by DistrictId;";

  con.query(sql, function(err, response) {
    if (err) console.log(err);
    res.json(response);
  });
});

app.get("/suicideDataAllDist", function(req, res) {
    sql =
    "select DistrictId,(count(old_male_suicidecases)+count(old_female_suicidecases)+count(new_female_suicidecases)+count(new_male_suicidecases)) as SuicideCases from mytable group by DistrictId;"
  
    con.query(sql, function(err, response) {
      if (err) console.log(err);
      res.json(response);
    });
  });
*/

app.post("/getAlcoholDataAllDist",function(req,res){
  console.log(req.body);
  fromDate = req.body.fromDate;
  toDate = req.body.toDate;

  sql = "select DistrictId,(sum(old_alcohal_male)+sum(old_alcohal_female)+sum(new_alcohal_female)+sum(new_alcohal_male)) as AlcoholCases from mytable where ReportingDate >='" + fromDate + "' and ReportingDate <='" + toDate + "' group by DistrictId Order By AlcoholCases" 
     
  console.log(sql)

    con.query(sql, function(err, response) {
      if (err) console.log(err);
      console.log(response);
      res.json(response);
    });
})

app.post("/getSuicideDataAllDist",function(req,res){
  console.log(req.body);
  fromDate = req.body.fromDate;
  toDate = req.body.toDate;

  sql = "select DistrictId,(sum(old_male_suicidecases)+sum(old_female_suicidecases)+sum(new_female_suicidecases)+sum(new_male_suicidecases)) as SuicideCases from mytable where ReportingDate >='" + fromDate + "' and ReportingDate <='" + toDate + "' group by DistrictId Order By SuicideCases" 
     
  console.log(sql)

    con.query(sql, function(err, response) {
      if (err) console.log(err);
      res.json(response);
    });
})

app.post("/getAlcoholDataPerDist",function(req,res){
  districtId = req.body.districtId;

  sql = "select ReportingDate,(sum(old_alcohal_male)+sum(old_alcohal_female)+sum(new_alcohal_female)+sum(new_alcohal_male)) as AlcoholCases from mytable where DistrictId=? group by ReportingDate"

  con.query(sql,[districtId],function(err, response) {
    if (err) console.log(err);
    console.log(response);
    res.json(response);
  });
})

app.post("/getSuicideDataPerDist",function(req,res){
  districtId = req.body.districtId;

  sql = "select ReportingDate,(sum(old_male_suicidecases)+sum(old_female_suicidecases)+sum(new_male_suicidecases)+sum(new_male_suicidecases)) as SuicideCases from mytable where DistrictId=? group by ReportingDate"

  con.query(sql,[districtId],function(err, response) {
    if (err) console.log(err);
    console.log(response);
    res.json(response);
  });
})

/* Server init */

app.listen(3000, function() {
  console.log("server started on port 3000");
});
