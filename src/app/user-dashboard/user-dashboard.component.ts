import { Component, OnInit } from '@angular/core';
import { ApiCallsService } from '../api-calls.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ConstantsVarible } from '../constants';
import { NgxSpinnerService } from "ngx-spinner"; 

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
 paginationNo:number = 1;
 searchForm :FormGroup;

 formErrors ={
  searchValue:'',
 }
 userList:any=[];
  constructor(private api: ApiCallsService,private fb:FormBuilder,private toastr: ToastrService,private route:Router,private SpinnerService: NgxSpinnerService) { }

  ngOnInit() {
    if(this.api.getLoggedInToken()){
        this.getListOfUsers(this.paginationNo);
    }
  }

  buildSearchForm(){
    this.searchForm = this.fb.group({
      searchValue:['',[Validators.required]],
    });
    this.SpinnerService.hide(); 
  }

  getListOfUsers(pageNumber:number){
    this.SpinnerService.show();  
    this.api.getUserList(pageNumber).subscribe(
      (respose:any)=>{
        this.userList=respose.data;
        this.buildSearchForm();
      },
      (err:any)=>{
       this.showSuccess(err);
      }
    );
  }

  editDeatils(userId:number){
    this.route.navigate(['/edit',userId]);
  }

  deleteUserDeatils(userId:number){
    this.SpinnerService.show();  
    this.api.delete(userId).subscribe(
      (response:any)=>{
        this.SpinnerService.hide(); 
        this.showSuccess('User is deleted successfully');
      }
      ,
      (err:any)=>{
       this.showError(err);
      }
    );
  }

search(){
  this.SpinnerService.show(); 
  this.api.singleUserDeatils(this.searchForm.value.searchValue).subscribe(
    (respose:any)=>{

      if(respose === 'user not found'){
        this.SpinnerService.hide(); 
        this.showError(respose);
      }else{
        this.userList =[];
        let searchedItem:any = respose.data;
        if(Object.keys(searchedItem).length === 0 && searchedItem.constructor === Object){
          this.SpinnerService.hide(); 
          this.showError('No record found');
        }else{
          this.userList.push(searchedItem);
          this.searchForm.patchValue({    
            searchValue:''
            });
            this.SpinnerService.hide(); 
        }
      }
    },
    (err:any)=>{
     this.showError(err);
    }
  );
}
// Checking validation
logValidationErrors(group:FormGroup= this.searchForm):void{
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


  nextSetOfUserList(index:number){
    this.getListOfUsers(index);
  }

  logout(){
    sessionStorage.clear();
    this.route.navigate(['/login']);

  }

  showSuccess(msg:string) {
    this.toastr.success(msg);
   }
   
   showError(msg:any){
    this.toastr.error(msg);
   }

}
