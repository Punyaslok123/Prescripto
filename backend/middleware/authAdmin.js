import jwt from 'jsonwebtoken'

// admin authentication middleware 

const authAdmin = async (req,res,next) => {
  
    try{
        // logic to verify the token 
        
        // get the token 
        const {atoken} = req.headers

        console.log("atoken is ",atoken)

        if(!atoken) {
              return res.json({success:false,message:'Not Authirized Login Again'})
        }
        const token_decode = jwt.verify(atoken,process.env.JWT_SECRET)

        console.log("decode token is ",token_decode)

        if (token_decode.email !== process.env.ADMIN_EMAIL) {
          return res.json({
            success: false,
            message: "Not Authirized Login Again",
          });
        }

        next();


    }catch(error){
        
        console.log(error);
        res.json({success:false,message:error.message})
    }
}


export default authAdmin