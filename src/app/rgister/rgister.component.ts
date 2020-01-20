import { Component, OnInit } from '@angular/core';
import {FormGroup ,FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ApiCallsService } from '../api-calls.service';
import { ConstantsVarible } from '../constants';
import { NgxSpinnerService } from "ngx-spinner";  

@Component({
  selector: 'app-rgister',
  templateUrl: './rgister.component.html',
  styleUrls: ['./rgister.component.css']
})
export class RgisterComponent implements OnInit {
  registrationForm :FormGroup;
  formErrors ={
    email:'',
    password:''
   }

  constructor(private fb:FormBuilder,private api: ApiCallsService,private toastr: ToastrService,private route:Router, private SpinnerService: NgxSpinnerService) { }

  ngOnInit() {
    this.buildRegistrationForm();
  }

  // registration from
 buildRegistrationForm(){
  this.registrationForm = this.fb.group({
    email:['',[Validators.required,Validators.email]],
    password:['',[Validators.required,Validators.minLength(3),Validators.maxLength(10)]]
  });

 this.registrationForm.valueChanges.subscribe((value:any)=>{
   this.logValidationErrors(this.registrationForm);
 });
}

// Checking validation
logValidationErrors(group:FormGroup= this.registrationForm):void{
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
  this.api.register(this.registrationForm.value).subscribe(
    (respose:any)=>{
     this.SpinnerService.hide();  
     this.showSuccess('User is Registered Successfully.');
     this.redirectToLoginPage();
    }
    ,
    (err:any)=>{
     this.showError(err);
    }
  );
}

redirectToLoginPage(){
   this.route.navigate(['/login']);
}

showSuccess(msg:string) {
 this.toastr.success(msg);
}

showError(msg:any){
 this.toastr.error(msg);
}



}
