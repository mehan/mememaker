// export Schemas to web.js
module.exports.configureSchema = function(Schema, mongoose) {
    
    
    Memes = new Schema({
      line1 : String,
        line2 : String,
        image : String,
        urlslug : String,
        
        });
    
    // add schemas to Mongoose
    mongoose.model('Meme', Memes);
   
};