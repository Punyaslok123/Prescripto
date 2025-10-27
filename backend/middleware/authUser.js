import jwt from 'jsonwebtoken'

// user authentication middleware 

const authUser = async (req,res,next) => {
      
    try{
        // logic to verify the token 
        
        // get the token 
        const {token} = req.headers

        console.log("atoken is ",token)

        if(!token) {
              return res.json({success:false,message:'Not Authirized Login Again'})
        }
        // decode this token 
        const token_decode = jwt.verify(token,process.env.JWT_SECRET)

        // get the userId from the token  (during creating the token when use create his account , we added id property to each user) and it will be added to the request body 

        req.userId=token_decode.id

        next()

        


    }catch(error){
        
        console.log(error);
        res.json({success:false,message:error.message})
    }
}


export default authUser