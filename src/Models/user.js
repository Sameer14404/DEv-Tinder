const validator=require("validator")
const mongoose=require("mongoose");
const { Schema } = mongoose;
const userSchema=Schema({
    firstName:{
        type:String,
        require:true,
        maxLength:8,
        minLength:3
    },
    lastName:{
        type:String
    },
    emailId:{
        type:String,
        require:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    password:{
        type:String,
        require:true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter a Strong Password :"+value)
            }
        }
    },
    age:{
      type:Number,
      require:true,
      min:18
    },
    gender:{
        type:String,
        require:true,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("Gender Data is not Vaild")
            }
        }

    },
    photoUrl:{
        type:String,
        default: function() {
            // Return different default URLs based on the gender
            return this.gender === 'male'
              ? "https://avatars.githubusercontent.com/u/7790161?v=4"
              : 'https://avatars.githubusercontent.com/u/77191007?v=4';
          },
      
    },
    about:{
        type:String,

    },
    skills:{
        type:[String]
    }
},{
   timestamps:true 
})

const User=  mongoose.model("user",userSchema);
module.exports=User;