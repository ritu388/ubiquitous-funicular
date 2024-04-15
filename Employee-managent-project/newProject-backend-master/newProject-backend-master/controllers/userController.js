const express = require('express');
const router = express.Router();
const shortid = require("shortid");
const EmployeeModel = require('./../models/Employee')
const ProjectModel=require('./../models/Project')
const EmployeeDetailsModel = require('./../models/EmployeeData');

// Api Methods
router.post('/signup', (req, res) => {
  EmployeeModel.findOne({ email: req.body.email }, function (err, existingUser) {
    if (err) {
      console.log(err);
      return next(err);
    } else if (existingUser) {
      console.log("Existing")
      return res.status(422).json({ error: "Email is already in use" });
    } else {
      // console.log(req.body.cart)
      const employee = new EmployeeModel({
        employeeId: shortid.generate(),
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role
      });

      employee.save(function (err, newEmployee) {
        if (err) {
          res.send(err);
        } else {
          console.log("Successfull")
          let apiResponse = {
            status: 200,
            message: "SignUp successfull",
            data: newEmployee,
          }
          res.send(apiResponse)
        }
      });
    }
  });
})

router.post('/login', (req, res) => {
  if (req.body.email) {
    EmployeeModel.findOne({ email: req.body.email }, (err, user) => {
      if (err) {
        res.send(err);
      } else if (!user) {
        let apiResponse = {
          status: 404,
          message: "No user Found",
        }
        res.send(apiResponse);
      } else {
        user.comparePassword(req.body.password, function (err, isMatch) {
          if (err) {
            res.send(err);
          } else if (!isMatch) {
            let apiResponse = {
              status: 400,
              message: "Wrong Password",
            }
            res.send(apiResponse);
          } else {
            if (user.role == "Manager") {
              let apiResponse = {
                status: 999,
                message: "login successfull",
                data: user,
              }
              res.send(apiResponse)
            } else {
              let apiResponse = {
                status: 200,
                message: "login successfull",
                data: user,
              }
              res.send(apiResponse)
            }
          }
        });
      }
    });
  } else {
    let apiResponse = {
      status: 400,
      message: "Email missingl",
    }
    res.send(apiResponse);
  }
})

router.get('/employee/all', (req, res) => {
  EmployeeModel.find({ role: { $ne: "Manager" } })
    .select('-__v  -_id')
    .lean()
    .exec((err, result) => {
      if (err) {
        let apiResponse = {
          message: "Failed to load All employee",
          status: 500
        }
        res.send(apiResponse);
      } else if (!result) {
        let apiResponse = {
          message: "No employee Details Found",
          status: 404
        }
        res.send(apiResponse);
      } else {
        let apiResponse = {
          message: "All employee details found",
          status: 200,
          data: result
        }
        res.send(apiResponse);
      }
    })
})


router.post("/assign/task", (req, res) => {

  let projectId = Math.floor(100000 + Math.random() * 900000);

  let newTask = new ProjectModel({
    projectId: projectId,
    employeeId:req.body.employeeId,
    task: req.body.task,
    deadline: req.body.deadline,
  });

  newTask.save((err, result) => {
    if (err) {
      console.log(err)
      let apiResponse = {
        message:"Failed to assign task",
        status: 500,
      }
      res.send(apiResponse);
    } else {
      let apiResponse = {
        message: "task assigned successfully",
        status:200,
      }
      res.send(apiResponse);
    }
  });
})

router.post('/employee/details', (req, res) => {
  // console.log('check the details', req, res);
  let projectId = Math.floor(100000 + Math.random() * 900000);
  
  let details = new EmployeeDetailsModel({
    projectId: projectId,
    employeeId: req.body.employeeId,
    Name: req.body.Name,
    EmailID: req.body.EmailID,
    Location: req.body.Location,
    Vendor: req.body.Vendor,
    JobType: req.body.JobType,
    IDCard: req.body.IDCard,
    PhoneNo: req.body.PhoneNo,
    status: req.body.status
  });
  details.save((err, result) => {
    if (err) {
      console.log(err)
      let apiResponse = {
        message:"Failed to submit form",
        status: 500,
      }
      res.send(apiResponse);
    } else {
      let apiResponse = {
        message: "employee details add successfully",
        status:200,
        data: result
      }
      res.send(apiResponse);
    }
  });
});



router.post('/allTask', (req, res) => {
  ProjectModel.find({employeeId:req.body.employeeId})
    .select('-__v  -_id')
    .lean()
    .exec((err, result) => {
      if (err) {
        let apiResponse = {
          message: "Failed to load All task",
          status: 500
        }
        res.send(apiResponse);
      } else if (!result) {
        let apiResponse = {
          message: "No task Details Found",
          status: 404
        }
        res.send(apiResponse);
      } else {
        let apiResponse = {
          message: "All task details found",
          status: 200,
          data: result
        }
        res.send(apiResponse);
      }
    })
})

router.post('/update/status',(req,res)=>{
  ProjectModel.findOneAndUpdate({projectId:req.body.projectId},{status:req.body.status})
  .then(
    data=>{
      res.send(data);
    },err=>{
      console.log(err);
    }
  )
});

router.get('/employee/details', (req, res) => {
  EmployeeDetailsModel.find()
    .then((data) => {
      if (!data || data.length === 0) {
        return res.status(404).json({ message: "No Employee Details Found", status: 404 });
      }
      res.status(200).json({ message: "Employee details found", status: 200, data: data });
    })
    .catch((err) => {
      console.error('Error retrieving data:', err);
      res.status(500).json({ message: "Failed to load Employee Details", status: 500 });
    });
});

// get data by ID
router.get('/employee/details/:_id', (req, res) => {
  const projectId = req.params._id;
  console.log('projectId', projectId); // Log projectId to ensure it's correct

  EmployeeDetailsModel.findOne({ _id: projectId })
    .then(data => {
      console.log(data, 'employeeData'); // Log the retrieved data
      if (!data) {
        return res.status(404).send('Data not found for the given projectId.');
      }
      console.log('data', data);
      res.send(data);
    })
    .catch(err => {
      console.log(err);
      res.status(500).send('Internal Server Error');
    });
});



router.put('/employee/details/:_id', (req, res) => {
  const employeeId = req.params._id;
  const newStatus = req.body.status;
  console.log(employeeId, newStatus);
  EmployeeDetailsModel.updateOne({ _id: employeeId }, { status: newStatus })
    .then(result => {
      console.log(result, 'result updated');
      res.status(200).json({ message: 'Employee data is updated successfully!' });
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});



router.put('/employee/details/:_id', async (req, res) => {
  try {
    const employeeId = req.params._id;
    const updatedEmployee = await EmployeeDetailsModel.findByIdAndUpdate(
      employeeId, req.body
    );

    if (!updatedEmployee) {
      return res.status(404).send('Employee details not found for the given projectId.');
    }

    res.send(updatedEmployee);
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
