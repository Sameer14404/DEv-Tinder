const validator=require("validator");

const validateSignUpData=(req)=>{
    const {firstName,lastName,emailId,password}=req.body;
    if(!firstName||!lastName){
        throw new Error("Name is  not Valid")
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("Email is not Vaild")
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Please Enter a strong Password")
    }
}

const validateEditProfileData=(req)=>{
    const allowedEditFields=["firstName","lastName","emailId","photUrl","gender","age","about","skills"];
   const isEditAllowed= Object.keys(req.body).every(field=>allowedEditFields.includes(field));
   return isEditAllowed

}

const validateUpdatePassword=(req)=>{
    const {currentPassword,newPassword}=req.body
     console.log(currentPassword,newPassword)
    if (!currentPassword || !newPassword) {
        throw new Error("Current password and new password are required.");
      }
 
     else if(!validator.isStrongPassword(newPassword)){
        throw new Error("Please Enter a strong Password")
    }
}
module.exports={
    validateSignUpData,
    validateEditProfileData,
    validateUpdatePassword
}