import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/cookie';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public UserName:any;
  public Password:any;

  constructor(private appService:AppService,private router:Router) {}

  ngOnInit(): void {
  }

  public loginFunction=()=>{
    if(!this.UserName){
      alert("Email Missing")
    }else if(!this.Password){
      alert("Password Missing")
    }else{
       let data={
         email:this.UserName,
         password:this.Password
       }
      this.appService.loginFunction(data).subscribe((apiResponse)=>{
      
        if(apiResponse.status===200){
          Cookie.deleteAll;
          Cookie.set('role',"Employee");
          Cookie.set('employeeId',apiResponse.data.employeeId)
          console.log('employeeId'+apiResponse.data.employeeId);

          alert("Login Successfull...")

          setTimeout(()=>{
            this.router.navigate(['emp-dashboard'])
          },1000)
        }else if(apiResponse.status===999){
          Cookie.deleteAll;
          Cookie.set('role',"Manager");
         
          
          alert("Login Successfull...Manager")

          setTimeout(()=>{
            this.router.navigate(['manager'])
          },1000)
        }
        else{
          alert("Some Error Occured")
        }
      },(err)=>{
        alert("Some Error occured(err)");
      });
    }
  }

}
