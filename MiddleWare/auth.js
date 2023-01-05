import dotenv from "dotenv";
dotenv.config();
import jwt  from "jsonwebtoken";

export const auth = async (req,res,next) =>{

    try{
        const token = req.headers.authorization;
        if(token){
            let decoded = jwt.verify(token,process.env.SECRET_KEY);
            req.userId = decoded.id; 
        }
        else{
            throw new Error('Not Authorized');
        }
        next();
    }
    catch(error){
        console.log(error);
    }

}
