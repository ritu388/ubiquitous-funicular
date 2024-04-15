import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public allEmployee=[];
  public employeeId;
 
  public task: any;
 
  public taskDeadline: number;

  public allTask=[];
  router: any;
  List: any;


  constructor(
    private appService:AppService,
    public route: Router) { }

  ngOnInit(): void {
    this.appService.getAllEmployees().subscribe(
      data => {
        console.log(data)
        // this.allEmployee = data["data"];
      },
      error => {
        console.log("Some error occured");
        console.log(error.errorMessage);
      }

    );
    this.getAllEmployeeList();

    }

    public getemployeeId(receivedEmployeeId){
      this.employeeId=receivedEmployeeId;
      
    }

    public assignTask=()=>{
      let data={
        employeeId:this.employeeId,
        task:this.task,
        taskDeadline:this.taskDeadline
      }
      this.appService.assignTask(data).subscribe((apiResponse)=>{
        if(apiResponse.status==200){
          alert("Task Assigned...!!!")
        }else{
          alert("Some Error Occured")
        }
      },(err)=>{
        alert("Some Error Occured(err)");
      })
    
    }

    public viewTask=(employeeId)=>{
      this.appService.viewTask(employeeId).subscribe((apiResponse)=> {
          this.allTask= apiResponse["data"];
        },(err) => {
          console.log("Some error occured while loading all task");
          console.log(err.errorMessage);
        }
      )
    }
  // Employee onbaording code


  getAllEmployeeList(){
    try {
      this.appService.fetchAllEmpData().subscribe((res: any) => {
        if (res) {
          console.log('fetch all the data from the employee details table', res);
          this.List = res.data;
        }
      });
    } catch(error) {
    console.error('throw error');
  }
}

  redirectToEdit(action, Id){
    this.route.navigateByUrl(`/emp-form/${action}/${Id}`)
  }

}
