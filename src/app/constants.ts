
export class ConstantsVarible {
    static validationMessages:any ={
        email:{
          'required':'Email is required',
          'email':'Enter valid email address.eg. abc@gmail.com'
        },
        password:{
         'required':'Password is required',
         'minlength':'Password should consist of min 3 letters',
         'maxlength':`Password should consist of max 10 letters`
        },
        firstName:{
            'required':'Firstname is required'
        },
        job:{
            'required':'Job is required'
        },
        searchValue:{
            'required':'Enter  User Id',
        }
      } ;


 }