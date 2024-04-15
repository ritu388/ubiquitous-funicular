import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies';
import { AppService } from './app.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'new-project';
  CurrentRole = Cookie.get('role');
  CurrenUSer: any;

  constructor(public appService: AppService,
    public route: Router){
    // console.log(this.CurrentRole);
  }

  ngOnInit(): void {
    this.appService.getAllEmployees().subscribe(
      data => {
        this.CurrenUSer = data["data"][0].name;
        console.log('data', this.CurrenUSer)
      },
      error => {
        console.log("Some error occured");
        console.log(error.errorMessage);
      }

    )
  }

  logOut(){
    this.route.navigate(['/']);
  }
  
}
