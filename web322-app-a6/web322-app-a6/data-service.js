const Sequelize = require('sequelize');
var sequelize = new Sequelize('dbd66nbd1jv786', 'yxhzszzholofdg', '7d4904b1141187584172a726cc677e6f4499d0abce0089ec4c0eebd6f54b55e7', {
  host: 'ec2-54-204-13-130.compute-1.amazonaws.com',
  dialect: 'postgres',
  port: 5432,
  dialectOptions: {
      ssl: true
  }
});
 var Employee = sequelize.define('Employee', {
  employeeNum: {
      type: Sequelize.INTEGER,
      primaryKey: true, // uses "employeeNum" as a primary key
      autoIncrement: true // automatically increment the value
  },
  firstName: Sequelize.STRING,
  last_name: Sequelize.STRING,
  email: Sequelize.STRING,
  SSN: Sequelize.STRING,
  addressStreet: Sequelize.STRING,
  addresCity: Sequelize.STRING,
  addressState: Sequelize.STRING,
  addressPostal: Sequelize.STRING,
  maritalStatus: Sequelize.STRING,
  isManager: Sequelize.BOOLEAN,
  employeeManagerNum: Sequelize.INTEGER,
  status: Sequelize.STRING,
  department: Sequelize.INTEGER,
  hireDate: Sequelize.STRING
});

// Define a "Department" model

var Department = sequelize.define('Department', {
  departmentId: {
      type: Sequelize.INTEGER,
      primaryKey: true, // use "departmentId" as a primary key
      autoIncrement: true // automatically increment the value
  },
  departmentName: Sequelize.STRING
});

//initialize()  fuction 
module.exports.initialize = function () {
  return new Promise(function (resolve, reject) {
      sequelize.sync().then( () => {
          resolve();
      }).catch(()=>{
          reject("unable to sync the database");
      });
  });
};
   
 
     //getAllEmployees() function
     module.exports.getAllEmployees = function () {
      return new Promise(function (resolve, reject) {
          Employee.findAll().then(function (data) {
              resolve(data);
          }).catch((err) => {
              reject("query returned 0 results");
          });
      });
  };
     //getEmployeesByStatus(status)
     module.exports.getEmployeesByStatus = function (status) {
      return new Promise(function (resolve, reject) {
          Employee.findAll({
              where: {
                  status: status
              }
          }).then(function (data) {
              resolve(data);
          }).catch(() => {
              reject("query returned 0 results");
          });
      });
  };

     //getEmployeesByDepartment(department)
     
     module.exports.getEmployeesByDepartment = function (department) {
      return new Promise(function (resolve, reject) {
          Employee.findAll({
              where: {
                  department: department
              }
          }).then(function (data) {
              resolve(data);
          }).catch(() => {
              reject("query returned 0 results");
          });
      });
  };
  
  //getEmployeesByManager()
  
  module.exports.getEmployeesByManager = function (manager) {
    return new Promise(function (resolve, reject) {
        Employee.findAll({
            where: {
                employeeManagerNum: manager
            }
        }).then(function (data) {
            resolve(data);
        }).catch(() => {
            reject("query returned 0 results");
        });
    });
};


  //getEmployeesByNum
  module.exports.getEmployeeByNum = function (num) {
    return new Promise(function (resolve, reject) {
        Employee.findAll({
            where: {
                employeeNum: num
            }
        }).then(function (data) {
            resolve(data[0]);
        }).catch(() => {
            reject("query returned 0 results");
        });
    });
};

  //getManagers()
  module.exports.getManagers = function () {
    return new Promise(function (resolve, reject) {
        Employee.findAll({
            where: {
                isManager: true
            }
        }).then(function (data) {
            resolve(data);
        }).catch(() => {
            reject("query returned 0 results");
        });
    });
};
 

  //add employee
  module.exports.addEmployee = function (employeeData) {
    return new Promise(function (resolve, reject) {

        employeeData.isManager = (employeeData.isManager) ? true : false;

        for (var prop in employeeData) {
            if(employeeData[prop] == '')
                employeeData[prop] = null;
        }

        Employee.create(employeeData).then(() => {
            resolve();
        }).catch((e)=>{
            reject();
        });

    });
};

  //update employee
  module.exports.updateEmployee = function (employeeData) {
    
        return new Promise(function (resolve, reject) {
    
            employeeData.isManager = (employeeData.isManager) ? true : false;
    
            for (var prop in employeeData) {
                if (employeeData[prop] == '')
                    employeeData[prop] = null;
            }
    
            Employee.update(employeeData, {
                where: { employeeNum: employeeData.employeeNum } 
            }).then(() => {
                resolve();
            }).catch((e) => {
                reject();
            });
        });
    };

    //Add Department(department data)
    module.exports.addDepartment=function(departmentData){
    return new Promise(function(resolve,reject){
      for(var prop in departmentData){
        if(departmentData[prop]==''){
          departmentData=null;
        }
      }
      Department.create(departmentData).then(()=>{
        resolve();
      }).catch((e)=>{
        reject("unable to create employee");
      })
    });
    };
    //update department(departmentData)
    module.exports.updateDepartment = function (departmentData) {
      return new Promise(function (resolve, reject) {
  
          for (var prop in departmentData) {
              if (departmentData[prop] == '')
                  departmentData[prop] = null;
          }
  
          Department.update(departmentData, {
              where: { departmentId: departmentData.departmentId } 
          }).then(() => {
              resolve();
          }).catch((e) => {
              reject();
          });
      });
  
  };
  // get department by id
  module.exports.getDepartmentById = function (id) {
    return new Promise(function (resolve, reject) {
        Department.findAll({
            where: {
                departmentId: id
            }
        }).then(function (data) {
            resolve(data[0]);
        }).catch(() => {
            reject("query returned 0 results");
        });
    });
};
//delete employee by num
module.exports.deleteEmployeeByNum = function(empNum){
  return new Promise(function (resolve, reject) {
      Employee.destroy({
          where: {
              employeeNum: empNum
          }
      }).then(function () {
          resolve();
      }).catch((err) => {
          reject("unable to delete employee");
      });
  });
};

  //getDepartments()
  module.exports.getDepartments = function () {
    return new Promise(function (resolve, reject) {
        Department.findAll().then(function (data) {
            resolve(data);
        }).catch((err) => {
            reject("query returned 0 results");
        });
    });

};
  