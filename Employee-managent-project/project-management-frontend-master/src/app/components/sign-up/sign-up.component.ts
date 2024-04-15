import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  public Name;
  public email;
  public password;
  public role;
  constructor(private router:Router,private appSerice:AppService) { }

  ngOnInit(): void {
  }
 

  public signUpFunction=()=>{
    if(!this.Name){
      alert("Name Missing")
    }else if(!this.email){
      alert("email Missing")

    } else if(!this.password){
      alert("password Missing")
    }else{
      let data={
        Name:this.Name,
        email:this.email,
        password:this.password,
        role: this.role
      }

      this.appSerice.signUpFunction(data).subscribe((apiResponse)=>{
        if(apiResponse.status===200){
          alert("signUp Successfull...!!!")
          setTimeout(()=>{
             this.router.navigate(['']);
          })
        }else{
          alert("Some Error Occured")
        }
      },(error)=>{
        alert("Some error occured"+error)
      })

    }
  }

}
