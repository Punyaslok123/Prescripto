import jwt from 'jsonwebtoken'

// doctor authentication middleware 

const authDoctor = async (req,res,next) => {
      
    try{
        // logic to verify the token 
        
        // get the token 
        const {dtoken} = req.headers

        console.log("dtoken is ",dtoken)

        if(!dtoken) {
              return res.json({success:false,message:'Not Authirized Login Again'})
        }
        // decode this token 
        const token_decode = jwt.verify(dtoken,process.env.JWT_SECRET)

        // get the docId from the token  (during creating the token when use create his account , we added id property to each user) and it will be added to the request body 

        req.docId=token_decode.id

        next()

        


    }catch(error){
        
        console.log(error);
        res.json({success:false,message:error.message})
    }
}



export default authDoctor