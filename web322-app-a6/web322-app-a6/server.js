/*********************************************************************************
*  WEB322 – Assignment 6
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part of this
*  assignment has been copied manually or electronically from any other source (including web sites) or 
*  distributed to other students.
* 
*  Name: Ravindrakumar Donga Student ID:121726160
*  Online (Heroku) Link: 
*
********************************************************************************/ 

var allData = require("./data-service.js");
var express = require("express");
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const dataServiceComments = require("./data-service-comments.js");

var app = express();
var path = require("path");

var HTTP_PORT = process.env.PORT || 3030;

app.use(express.static('public'));
//ensure body parser works properly  and .hbs file to work properly
app.use(bodyParser.urlencoded({ extended: true }));

app.engine(".hbs", exphbs({
  extname: ".hbs",
  defaultLayout: 'layout',        //sets the default layots for all pages of laout.hbs file
  helpers: {
    equal: function (lvalue, rvalue, options) {
      if (arguments.length < 3)
        throw new Error("Handlebars Helper equal needs 2 parameters");
      if (lvalue != rvalue) {
        return options.inverse(this);
      } else {
        return options.fn(this);
      }
    }
  }
}));
app.set("view engine", ".hbs");


// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

// setup a 'route' to listen on the default url path (http://localhost)
app.get("/", function(req,res){
//res.sendFile(path.join(__dirname + "/views/home.html"));
res.render("home");
});

// setup another route to listen on /about
app.get("/about", function(req,res){
//res.sendFile(path.join(__dirname + "/views/about.html"));
dataServiceComments.getAllComments().then((dataFromPromise) =>{
 res.render("about", {data: dataFromPromise});

 
})

.catch(() => {
  res.render("about");
});
});

//AS3
app.get("/employees", function(request,response){
  if(request.query.status){
    allData.getEmployeesByStatus(request.query.status).then(function(thedata) {
      response.render("employeeList", { data: thedata, title: "Employees" });
    }).catch((err) => {
      response.render("employeeList", { data: {}, title: "Employees" });
    });
      }
      
          else if(request.query.department){
            allData.getEmployeesByDepartment(request.query.department).then((thedata) => {
              response.render("employeeList", { data: thedata, title: "Employees" });
          }).catch((err) => {
              response.render("employeeList", { data: {}, title: "Employees" });
          });
          }
          
          else if(request.query.manager){
            allData.getEmployeesByManager(request.query.manager).then((thedata) => {
              response.render("employeeList", { data: thedata, title: "Employees" });
          }).catch((err) => {
              response.render("employeeList", { data: {}, title: "Employees" });
          });
          }else{
            allData.getAllEmployees().then((thedata) => {
              response.render("employeeList", { data: thedata, title: "Employees" });
          }).catch((err) => {
              response.render("employeeList", { data: {}, title: "Employees" });
          });
          }
        });

  //Updating the new routes to use data-service.js
  //.then()methods
  app.get("/employee/:empNum", (req, res) => {
    
      // initialize an empty object to store the values
      let viewData = {};
    
      allData.getEmployeeByNum(req.params.empNum)
      .then((data) => {
        viewData.data = data; //store employee data in the "viewData" object as "data"
      }).catch(()=>{
        viewData.data = null; // set employee to null if there was an error 
      }).then(allData.getDepartments)
      .then((data) => {
        viewData.departments = data; // store department data in the "viewData" object as "departments"
        
          // loop through viewData.departments and once we have found the departmentId that matches
          // the employee's "department" value, add a "selected" property to the matching 
          // viewData.departments object
    
         for (let i = 0; i < viewData.departments.length; i++) {
            if (viewData.departments[i].departmentId == viewData.data.department) {
              viewData.departments[i].selected = true;
            }
          }
    
      }).catch(()=>{
        viewData.departments=[]; // set departments to empty if there was an error
      }).then(()=>{
          if(viewData.data == null){ // if no employee - return an error
              res.status(404).send("Employee Not Found");
          }else{
            res.render("employee", { viewData: viewData }); // render the "employee" view
          }
      });
    });
    
  //post the employee data 
  app.post("/employees/add", (req, res) => {
    allData.addEmployee(req.body).then((data) => {
      
      res.redirect("/employees");
  }).catch((err) => {
      console.log(err);
  });
  });
//post after update
app.post("/employee/update", (req, res) => {
  allData.updateEmployee(req.body).then((data) => {
      
      res.redirect("/employees");
  }).catch((err) => {
      console.log(err);
  })
});

  app.get("/managers", function (req, res) {
    
     allData.getManagers()
       .then((dedata)=>{
         
         
          res.render("employeeList", { data: dedata, title: "Employees (Managers)" }); 
         
       })
      .catch((err)=>{
        res.render("employeeList", { data: {}, title: "Employees (Managers)" });
        });
    
      
    });
    app.get("/departments", function (req, res) {
      allData.getDepartments()
         .then((dedata)=>{
          
             res.render("departmentList", { data: dedata, title: "Departments" });
           
         })
           .catch((err)=>{
            res.render("departmentList", { data: {}, title: "Departments" });
          });
       
      });
      app.get("/employees/add", (req, res) => {
        allData.getDepartments().then((data) => {
            res.render("addEmployee",{departments: data});
        }).catch((err) => {
            res.render("addEmployee", {departments: []});
        });
      });
        app.post("/employees/add", (req, res) => {
          console.log(req.body);
          res.redirect("/employees");
      });
      ///departments/add
      app.get("/departments/add", (req,res) => {
        res.render("addDepartment");
      });
      ///departments/add
      app.post("/departments/add", (req, res) => {
        allData.addDepartment(req.body).then(()=>{
          res.redirect("/departments");
        });
      });
      ///department/update
      app.post("/department/update", (req, res) => {
        allData.updateDepartment(req.body).then(()=>{
        res.redirect("/departments");
      });
      
    });
    ///department/:departmentId
    app.get("/department/:departmentId", (req, res) => {
      
        allData.getDepartmentById(req.params.departmentId).then((data) => {
          res.render("department", { data: data });
        }).catch((err) => {
          res.status(404).send("Department Not Found");
        });
      
      });
      // delete employee by empnum
    app.get("/employee/delete/:empNum", (req,res)=>{
      allData.deleteEmployeeByNum(req.params.empNum).then(()=>{
        res.redirect("/employees");
      }).catch((err)=>{
        res.status(500).send("Unable to Remove Employee / Employee Not Found");
      });
    });
    app.post("/about/addComment", (req, res) => { 
     
      dataServiceComments.addComment(req.body).then( () => {
        res.redirect("/about"); 
      })
      .catch((err) =>{
        console.log(err);
        res.redirect("/about");
      })
  });
  app.post("/about/addReply", (req, res) => { 
     
    dataServiceComments.addReply(req.body).then( () => {
      res.redirect("/about"); 
    })
    .catch((err) =>{
      console.log(err);
      res.redirect("/about");
    })
});

    

      /*this should be always at the end of the all reqest for the path. 
      if it is defined before any app.get method it would not run that finction and show page not found.*/
      app.use((req, res) => {
        res.status(404).send("Page Not Found");
      });
      
    
    

      


// setup http server to listen on HTTP_PORT

allData.initialize()
.then(() =>{
  dataServiceComments.initialize();
})
.then(()=>{
app.listen(HTTP_PORT, onHttpStart);
}).
catch((error)=>{
      console.log(error);
    });

   /*// testcode
    dataServiceComments.initialize()
    .then(() => {
      dataServiceComments.addComment({
        authorName: "Comment 1 Author",
        authorEmail: "comment1@mail.com",
        subject: "Comment 1",
        commentText: "Comment Text 1"
      }).then((id) => {
        dataServiceComments.addReply({
          comment_id: id,
          authorName: "Reply 1 Author",
          authorEmail: "reply1@mail.com",
          commentText: "Reply Text 1"
        }).then(dataServiceComments.getAllComments)
        .then((data) => {
          console.log("comment: " + data[data.length - 1]);
          process.exit();
        });
      });
    }).catch((err) => {
      console.log("Error: " + err);
      process.exit();
    });
  */
 
  