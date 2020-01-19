import { Component, OnInit } from '@angular/core';
import {FormGroup ,FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ApiCallsService } from '../api-calls.service';
import { ConstantsVarible } from '../constants';
import { NgxSpinnerService } from "ngx-spinner";  

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm :FormGroup;
  
  formErrors ={
    email:'',
    password:''
   }


  constructor(private fb:FormBuilder,private api: ApiCallsService,private toastr: ToastrService,private route:Router, private SpinnerService: NgxSpinnerService) { }

  ngOnInit() {
    this.buildLoginForm();
  }

    // login from
  buildLoginForm(){
  this.loginForm = this.fb.group({
    email:['',[Validators.required,Validators.email]],
    password:['',[Validators.required,Validators.minLength(3),Validators.maxLength(10)]]
  });

 this.loginForm.valueChanges.subscribe((value:any)=>{
   this.logValidationErrors(this.loginForm);
 });
}

// Checking validation
logValidationErrors(group:FormGroup= this.loginForm):void{
  Object.keys(group.controls).forEach((key:string)=>{
    const abstractControl = group.get(key);
    if(abstractControl instanceof FormGroup){
        this.logValidationErrors(abstractControl);
    }else{
      this.formErrors[key] ='';
      if(abstractControl && abstractControl.invalid && (abstractControl.value ==='' || abstractControl.dirty)){
        const messages = ConstantsVarible.validationMessages[key];
        for(const errorKey in abstractControl.errors){
          if(errorKey){
            this.formErrors[key] += messages[errorKey] + '';
          }
        }
      }
    }
  });
}

onSubmit(){
  this.SpinnerService.show();  
  this.api.login(this.loginForm.value).subscribe(
    (respose:any)=>{
     this.SpinnerService.hide();  
     this.api.storeLoggedInToken(respose.token);
     this.showSuccess('User is Logined Successfully.');
     this.route.navigate(['/dashboard']);
    }
    ,
    (err:any)=>{
     this.showSuccess(err);
    }
  );
}

redirectToRegistrationPage(){
   this.route.navigate(['/register']);
}

showSuccess(msg:string) {
 this.toastr.success(msg);
}

showError(msg:any){
 this.toastr.error(msg);
}


}
