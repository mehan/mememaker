// export Schemas to web.js
module.exports.configureSchema = function(Schema, mongoose) {
    
    
    Meme = new Schema({
      line1 : String,
        line2 : String,
        image : String
    });
    
    // add schemas to Mongoose
    mongoose.model('Meme', Meme);
   
};