import User from '../models/usermodel.js';
// Importing the user model to interact with the users collection in the database.

import validator from 'validator';
// Importing the validator library to validate email addresses and other data.

import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken' ;

const jwt_secret = process.env.JWT_KEY;; // secret key 
const tokenexpire = process.env.TOKEN_EXPIRE;  // expire 

const createToken = (userID) => {
    return jwt.sign({id:userID},jwt_secret,{expiresIn:tokenexpire});
    // jwt signature 
}

// register user
export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;


    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "Please fill all the fields"
        });
    }
    // the above code check name email password are req to fil 

    // validate email 
    if (!validator.isEmail(email)) {
        return res.status(400).json({
            success: false,
            message: "Please enter a valid email"
        });
    }

    // check password length
    if (password.length < 8) {
        return res.status(400).json({
            success: false,
            message: "Password must be at least 8 characters long"
        })
    } 

    try{
        // check user if already exist or not 
      if( await User.findOne({email})){
        return res.status(400).json({
            success: false,
            message:"user already exist"
        })
      }

      const hashed = await bcrypt.hash(password,10);  // bcrypting hashing 
      const user = await User.create({name,email,password:hashed}) ; // hashed password for security 
      const token = createToken(user._id); // user_id is created by mongodb 
      // create token 
      return res.status(201).json({
        success:true,
        token,
        user:{
            id:user._id, 
            name:user.name,
            email:user.email
        },
        message:"register user succesfully"
      });


    }
    catch(err){
    return res.status(500).json({
        success:false,
        message:"server error"
    });
    }
}
// above code for register a user 

// login user 
export async function loginUser(req,res){
    const{email,password} = req.body ; 
    // taking email and passwirs from user in body 
    console.log(1);
    
    if(!email || !password){
        return res.status(400).json({
            success:false,
            message:"Both field required"
        });
    }
 console.log(2);
 
    try{
      console.log(34);
      const user = await User.findOne({email}) ;
       console.log(52);
      if(!user){
        return res.status(401).json({
            success:false,
            message:"invalid user"
        });
      }
    
    
      const match = await bcrypt.compare(password, user.password);
      if(!match){
        return res.status(401).json({
            success:false,
            message:"passsword not match"
        });
      }


      const token = createToken(user._id) 
      res.json({
        success:true,
        token,
        user:{
            id:user._id,
            name:user.name,
            email:user.email
        },
        message:"login user successfully"
      });
    }
    catch(err){
     return res.status(500).json({
        success:false,
        message:"server error"
    });
    }
}

// to write function get user detail
export async function getCurrentUser(req, res) {
  try {
    

    // safety check
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - user not found in request"
      });
    }

    const user = await User.findById(req.user.id).select("name email");

    

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

   

    res.status(200).json({
      success: true,
      user
    });

  } catch (err) {
    console.log(err); // 🔥 MUST ADD THIS
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
}
// to update user profile 
export async function updateUser (req,res){
    const {name , email} = req.body ;
    if(!name || !email ||!validator.isEmail(email)){
        return res.status(404).json({
        success:false,
        message:"vaild name and email is required"
        })
    };
    try{
        // first we check if this email is exist already 
        const exists = await User.findOne({email,_id: {$ne: req.user.id}});
        if(exists){
            return res.status(409).json({
                success:false,
                message:"user email is already in use"
            })
        };
        

        const user = await User.findByIdAndUpdate(
           req.user.id,
         { name, email },
        { new: true, runValidators: true }
        ).select("name email");

        res.json({
            success:true,
            user
        })
    }
    catch(err){
     return res.status(500).json({
        success:false,
        message:"server error"
    });
}
}

// to update password 

export async function updatePassword(req,res){
    const {oldpassword , newpassword} = req.body 
    if(!oldpassword || !newpassword || newpassword.length <8){
        return res.status(400).json({
            success:false,
            message:"password invalid or too short."
        })
    };
    try{
       
        
        
        const user = await User.findById(req.user.id).select("password");
        
        
        if(!user){
            return res.status(404).json({
                success:false,
                message:"user is not exist"

            })
        };
        
        
        const match = await bcrypt.compare(oldpassword, user.password) 
        if(!match){
            return res.status(400).json({
                success:false ,
                message:"password mismatch"
            })
        };
        user.password = await bcrypt.hash(newpassword,10);
        await user.save();
        res.json({
            success:true,
            message:"password change"
        })
    }
     catch(err){
     return res.status(500).json({
        success:false,
        message:"server error"
    });

    }

}