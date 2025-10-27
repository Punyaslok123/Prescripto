import multer from "multer";

const storage=multer.diskStorage({
      filename: function(req,file,callback){
        callback(null,file.originalname);
      }
})

const upload=multer({storage})

export default upload

// now need to create the routes for the upload middleware 