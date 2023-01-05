import jwt  from "jsonwebtoken";

export const auth = async (req,res,next) =>{

    try{
        const token = req.headers.authorization;

        if(token){
            let decoded = jwt.verify(token,process.env.SECRET_KEY);
            req.userId = decoded?.id; 
        }
        next();
    }
    catch(error){
        console.log(error);
    }

}
