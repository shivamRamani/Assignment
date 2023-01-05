import dotenv from "dotenv";
dotenv.config();
import jwt  from "jsonwebtoken";

export const auth = async (req,res,next) =>{

    try{
        const token = req.headers.authorization;
        console.log('auth',token);
        if(token){
            console.log(process.env.SECRET_KEY);
            let decoded = jwt.verify(token,process.env.SECRET_KEY);
            console.log('decoded',decoded.id);
            req.userId = decoded.id; 
            console.log('req',res.userId);
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
