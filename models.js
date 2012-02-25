// export Schemas to web.js
module.exports.configureSchema = function(Schema, mongoose) {
    
    
    Memes = new Schema({
      line1 : request.body.line1,
        line2 : request.body.line2,
        image : request.body.image
    });
    
    // add schemas to Mongoose
    mongoose.model('Meme', Meme);
   
};