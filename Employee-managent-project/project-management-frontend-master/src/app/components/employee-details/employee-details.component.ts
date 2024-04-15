import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { Cookie } from 'ng2-cookies';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.css']
})
export class EmployeeDetailsComponent implements OnInit {
  employeeForm: FormGroup;
  action: any;
  FormID: any;
  projectID: any = '';
  currentRole: any;
  submitForm: boolean = false;
  constructor(
    public router:ActivatedRoute,
    public appService: AppService,
    public route: Router,
    public toasterMsg: ToastrService
  ) { 
    this.router.params.subscribe((params) =>{
      if (params) {
        this.action = params.action,
        this.FormID = params.Id
        console.log('what is formID', this.FormID);
      }
    });

   const role = Cookie.get('role');
   console.log(role);
   if (role === 'Manager'){
     this.currentRole = role;
   }
    
  }

  ngOnInit(): void {
    this.createForm(undefined);
    if (this.action === 'edit' || this.action === 'view') {
      this.getEmployeeDetailsByID(this.FormID);
    }
  }

  createForm(data){
    this.employeeForm = new FormGroup({
      Name: new FormControl(data?.Name ? data?.Name: null, [Validators.required]),
      Email: new FormControl(data?.EmailID ? data?.EmailID: null, [Validators.required]),
      PhoneNumber: new FormControl(data?.PhoneNo ? data?.PhoneNo: null, [Validators.required]),
      Vendor: new FormControl(data?.Vendor ? data?.Vendor: null, [Validators.required]),
      Type: new FormControl(data?.JobType ? data?.JobType: null, [Validators.required]),
      Location: new FormControl(data?.Location ? data?.Location: null, [Validators.required]),
      IDCard: new FormControl(data?.IDCard ? data?.IDCard: null, [Validators.required])
    });
     if(this.action === 'view') {
       this.employeeForm.disable();
     }
  }

  SubmitForm(){
    try{
      this.submitForm = true;
        let body = {
          Name: this.employeeForm.value.Name,
          EmailID: this.employeeForm.value.Email,
          PhoneNo: this.employeeForm.value.PhoneNumber,
          Vendor: this.employeeForm.value.Vendor,
          JobType: this.employeeForm.value.Type,
          Location: this.employeeForm.value.Location,
          IDCard: this.employeeForm.value.IDCard
        }
        console.log(this.employeeForm);
        if (this.employeeForm.valid) {
          body['status']="Draft"
          if (this.action === 'add') {
            this.appService.employeeDetails(body).subscribe((res) =>{
              if (res) {
                console.log(res);
                this.projectID = res.projectId;
                alert('Details successfully added');
                this.route.navigate([`/emp-dashboard`]);
              }
            })
          } else if(this.action === 'edit'){
            this.appService.updateEmployeeData(this.FormID, body).subscribe((data: any) =>{
              if (data){
                alert('Details successfully updated');
                this.route.navigate([`/emp-dashboard`]);
              }
            });
          }
        } else {
          alert('please fill the required field');
        }  
    }catch(error) {
      console.error(error);
    }
  }


  getEmployeeDetailsByID(ID) {
    // console.log('ID', ID);
    try {
      this.appService.fetchSingleEmpData(ID).subscribe((res: any) => {
        if (res) {
          this.projectID = res.projectId;
          this.createForm(res);
        }
      });
    } catch(err) {
      console.error(err);
    }
  }


  getApproved(){
    let body = {
      status: 'Approved'
    }
    try{
      console.log(body);
      this.appService.getApprovedEmpData(this.FormID, body).subscribe((res: any) => {
        if (res) {
          alert('Approved');
          this.route.navigate([`/manager`]);
        }
      });
    } catch(error) {
      console.error(error);
      alert('something went wrong');
    }
  }

  getReject(){
    let body = {
      'status': 'Reject'
    }
    try{
      this.appService.getApprovedEmpData(this.FormID, body).subscribe((res) => {
        if (res){
          alert('Rejected');
          this.route.navigate([`/manager`]);
        } 
      });
    } catch(error) {
      console.error(error);
      alert('something went wrong');
    }
  }
}
