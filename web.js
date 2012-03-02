var express = require('express');
var ejs = require('ejs');
var app = express.createServer(express.logger());

var mongoose = require('mongoose'); // include Mongoose MongoDB library
var schema = mongoose.Schema; 

/************ DATABASE CONFIGURATION **********/
app.db = mongoose.connect(process.env.MONGOLAB_URI); //connect to the mongolabs database - local server uses .env file

// include the database model / schema
require('./models').configureSchema(schema, mongoose);

// Define your DB Model variables
var Meme = mongoose.model('Meme');

/************* END DATABASE CONFIGURATION *********/



/*********** SERVER CONFIGURATION *****************/
app.configure(function() {
    
    /*********************************************************************************
        Configure the template engine
        We will use EJS (Embedded JavaScript) https://github.com/visionmedia/ejs
        
        Using templates keeps your logic and code separate from your HTML.
        We will render the html templates as needed by passing in the necessary data.
    *********************************************************************************/

    app.set('view engine','ejs');  // use the EJS node module
    app.set('views',__dirname+ '/views'); // use /views as template directory
    app.set('view options',{layout:true}); // use /views/layout.html to manage your main header/footer wrapping template
    app.register('html',require('ejs')); //use .html files in /views

    /******************************************************************
        The /static folder will hold all css, js and image assets.
        These files are static meaning they will not be used by
        NodeJS directly. 
        
        In your html template you will reference these assets
        as yourdomain.heroku.com/img/cats.gif or yourdomain.heroku.com/js/script.js
    ******************************************************************/
    app.use(express.static(__dirname + '/static'));
    
    //parse any http form post
    app.use(express.bodyParser());
    
    /**** Turn on some debugging tools ****/
    app.use(express.logger());
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

});
/*********** END SERVER CONFIGURATION *****************/

 function convertToSlug(Text)
        {
            return Text
                .toLowerCase()
                .replace(/[^\w ]+/g,'')
                .replace(/ +/g,'-')
                ;
        }

memeImages = ['fry.png','cat.jpg','andy.jpg'];


app.get('/', function(request, response) {
    var templateData = { 
        pageTitle : 'MEMEMAKER',
        message: 'MAKE YR MEME',
        images: memeImages
    };
    
    response.render("meme_form.html",templateData);
});



app.post('/', function(request, response){
    console.log("Inside app.post('/')");
    console.log("form received and includes")
    console.log(request.body);
    
newSlug = convertToSlug(request.body.line1+request.body.line2);    
    
    
    // Simple data object to hold the form data
    var memeData = {
        line1 : request.body.line1,
        line2 : request.body.line2,
        image : request.body.image,
        urlslug: newSlug,
    };
    
    
    var meme = new Meme(memeData);
    
    meme.save();
    
    
    
    response.redirect('/meme/' + urlslug);
    
});


app.get('/meme/:urlslug', function(request, response){
    
	Meme.findOne({urlslug:request.params.urlslug},function(err,post){
	
		if (err) {
		   console.log('error');
		   console.log(err);
		   response.send("Sorry, yr meme was not found!");
		}
			
		if (urlslug != undefined) {
			
			// Render the card_display template - pass in the cardData
			response.render("meme_display.html", memeData); } 
		
		else {
			// card not found. show the 'Card not found' template
			response.render("meme_not_found.html");}
		
	});
	
});


// Make server turn on and listen at defined PORT (or port 3000 if is not defined)
var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});