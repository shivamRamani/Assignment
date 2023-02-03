import { User } from "../Model/userModel.js";
import { OtpVerifiaction } from "../Model/userOtpVerification.js";

const getUsers = async () =>{

    try {

        const userData = await User.aggregate([
            {
                $project: {
                    _id: {
                        "$toString": "$_id"
                    },
                    userName: 1,
                    email: 1,
                    verified: 1
                }
              },
              {
				  $lookup: {
                  from: "posts",
                  localField: "_id",
                  foreignField: "creatorId",
                  as: "userPosts",
                  pipeline: [
                      {
                      	  $project: {
                          _id: 1,
                          creatorName: 1,
                          postData: 1
                          }
                      }
                  ]
                  }
              }
        ]);
        return userData;
        
    } catch (error) {
        console.log(error);
        throw error;
    }

}

const getOtpVerificationData = async (userId) =>{
    try {

        const userOtpData=await OtpVerifiaction.aggregate([
            {
                $match : { userId: userId}
            }
        ]);

        return userOtpData[0];
        
    } catch (error) {
        throw error;
    }
}

const deleteOtpVerificationData = async (userId) => {
    try{
        await OtpVerifiaction.deleteMany({userId});
    } catch(error){
        throw error;
    }
}

const updateVerifiedUserData = async (userId) => {
    try{
        const verifiedUserData=await User.findByIdAndUpdate(userId,{verified: true},{new:true});
        return verifiedUserData;
    } catch(error){
        throw error;
    }
}

const findUser = async (emailId) => {
    try{
        const currentUser= await User.aggregate([
            {
                $match : {emailId: emailId}
            }
        ]);
        return currentUser[0];
    } catch(error){
        throw error;
    }
}



export default { getUsers,findUser,getOtpVerificationData,deleteOtpVerificationData,updateVerifiedUserData };