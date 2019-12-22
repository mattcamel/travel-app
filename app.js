var bodyParser 		= require('body-parser'),
	expressSanitizer= require('express-sanitizer'),
	mongoose 		= require('mongoose'),
	express 		= require('express'),
	methodOverride	= require('method-override'),
	app	 			= express();
	  
mongoose.connect('mongodb://localhost:27017/travel_app', {
	useNewUrlParser: true,
	useUnifiedTopology: true
});
mongoose.set('useFindAndModify', false);
app.set('view engine', 'ejs');
app.use(expressSanitizer());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method'));

//SCHEMA =====================
var Schema = mongoose.Schema;
var PostSchema = new Schema({
	site:String,
	region:String,
	country:String,
	tag:String,
	image:String,
	content:String,
	link:String,
	dateAdded:{type:Date, default:Date.now}
});
var Post = mongoose.model('Post', PostSchema);

//ROUTES =====================
//INDEX
app.get('/index', function(req,res){
	Post.find({}, function(err,allPosts){
		if(!err){
			res.render("index", {foundPosts:allPosts});
		}else{
			console.log(err);
		}
	});
});

app.get('/', function(req,res){
	res.redirect("/index");
});

//NEW
app.get('/new', function(req,res){
	res.render("new");
});

//CREATE
app.post('/index', function(req,res){
	Post.create(req.body.post, function(err,newPost){
		if(!err){
			console.log(newPost);
			res.redirect("/index");
		}else{
			console.log(err);
			res.redirect("/index/new");
		}
	})
});

//SHOW TAG
app.get('/tag/:tag', function(req,res){
	Post.find({tag: req.params.tag}, function(err,foundPosts){
		if(!err){
			res.render("index", {foundPosts:foundPosts, foundTag:req.params.tag});
		}else{
			console.log(err);
		}
	});
});

//SHOW POST
app.get('/id/:id', function(req,res){
	Post.findById(req.params.id, function(err,foundPost){
		if(!err){
			res.render("post", {foundPost:foundPost});
		}else{
			console.log(err);
		}
	})
});

//EDIT POST
app.get('/id/:id/edit', function(req,res){
	Post.findById(req.params.id, function(err,foundPost){
		if(!err){
			res.render("edit", {foundPost:foundPost});
		}else{
			console.log(err);
		}
	})
});

//UPDATE POST
app.put('/id/:id', function(req,res){
	Post.findByIdAndUpdate(req.params.id, req.body.post, function(err,updatedPost){
		if(!err){
			console.log(updatedPost);
			res.redirect("/id/" + req.params.id);
		}else{
			console.log(err);
		}
	})
});

//DELETE POST
app.delete('/id/:id', function(req,res){
	Post.findByIdAndRemove(req.params.id, function(err,removedPost){
		if(!err){
			res.redirect("/index");
		}else{
			console.log(err);
		}
	})
});

var port = process.env.PORT || 3000
app.listen(port, () => console.log("Travel app listening"))