import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiCallsService } from '../api-calls.service';
import { ConstantsVarible } from '../constants';
import { NgxSpinnerService } from "ngx-spinner";  
declare var $: any;

@Component({
  selector: 'app-edit-user-details',
  templateUrl: './edit-user-details.component.html',
  styleUrls: ['./edit-user-details.component.css']
})
export class EditUserDetailsComponent implements OnInit {
userId:number;
initalUserValues:any;
editForm :FormGroup;
formErrors ={
  firstName:'',
  job:''
 }
  constructor(private fb:FormBuilder,private api: ApiCallsService,private toastr: ToastrService,private activatedRoute:ActivatedRoute,private route:Router,private SpinnerService: NgxSpinnerService) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((params:any)=>{
      this.userId= +params.params.id;
      this.singleUserDeatils(this.userId);
    });
   
    const modal=document.getElementById('myModal');
    $('#myModal').modal('show');
  }

  singleUserDeatils(userId:number){
    this.SpinnerService.show(); 
    this.api.singleUserDeatils(userId).subscribe(
      (respose:any)=>{
        this.initalUserValues =  {...respose.data};
       this.buildEditForm();
      },
      (err:any)=>{
       this.showError(err);
      }
    );
  }

  buildEditForm(){
    this.editForm = this.fb.group({
      firstName:['',[Validators.required]],
      job:['',[Validators.required]]
    });
    this.setIntialValues();
    this.editForm.valueChanges.subscribe((value:any)=>{
      this.logValidationErrors(this.editForm);
    });

  }

  setIntialValues(){
    this.editForm.patchValue({    
      firstName:this.initalUserValues.first_name,
      job:'Angular Developer'
      }); 
      this.SpinnerService.hide();  
  }
  // Checking validation
logValidationErrors(group:FormGroup= this.editForm):void{
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
this.api.update(this.userId,this.editForm.value).subscribe(
    (respose:any)=>{
      this.SpinnerService.hide();  
      this.showSuccess('The User Deatils are updated successfully');
      $('#myModal').dismiss();
      this.route.navigate(['/dashboard']);
    },
    (err:any)=>{
     this.showError(err);
    }
  );
}

  redirectToUserList(){
    this.route.navigate(['/dashboard']);
  }

  showSuccess(msg:string) {
    this.toastr.success(msg);
   }
   
  showError(msg:any){
    this.toastr.error(msg);
   }

}
