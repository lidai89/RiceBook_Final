var redis = require('redis').createClient('redis://h:p76fc1a93d79bd19af53fd4c32e8a1e5d123ab1a40bec0d51eb53114455e27217@ec2-34-206-162-178.compute-1.amazonaws.com:31549')
const bodyParser = require('body-parser')
var Article = require('./model.js').Article
var Profile = require('./model.js').Profile
var cookieParser = require('cookie-parser')
const uploadImage = require('./src/uploadCloudinary')
    
const addArticle = (req, res) => {
    let sid = req.cookies['sid']
    console.log(req.cookies) 
    console.log(sid) 
    console.log(req.fileurl)
        redis.hgetall(sid, function(err,userObject){
            if(userObject && userObject.username){
            req.username = userObject.username;}})
     
     new Article({author: req.username,img:req.fileurl,date:new Date(), text:req.body.text, comments:[]})
     .save((error,doc)=>{
         if(error){
             res.status(400).send({error:error})
         }
         else{
             res.status(200).send({"articles":[doc]})
         }
     })
     
}


const getArticle = (req, res) =>{
    if(req.params.id){
    console.log('wrong destination:'+req.params.id)
	const users = req.params.id;
	Article.find({author:{$in:users}}).exec((error, doc)=>{
       // console.log(doc)
		if(error){
			res.status(400).send({error:err})
		}
		else{
			
				res.status(200).send({ articles: doc})
			
		}
	})
        }
        else{
            //add current user and his followers as user group
            Profile.findOne({username: req.username}, function(err, item){
                //console.log(item)
			const users=[req.username, ...item.following]
            Article.find({author:{$in:users}}).sort({date:-1}).limit(10).exec((err, doc)=>
            res.send({articles:doc}));
            })
            
            
        }
}
const putArticle = (req,res)=>{
    let p_id=req.params.id;
    let commentId=req.body.commentId;
    //let newarticles=articles.filter((item)=>{return item.id!=p_id})
   // let selectedarticles=articles.filter((item)=>{return item.id==p_id})[0]
    let sid = req.cookies['sid']

        redis.hgetall(sid, function(err,userObject){
            if(userObject && userObject.username){
            req.username = userObject.username;}})
    //console.log(req.headers)
    //console.log(req.cookies)
    //console.log('username:'+req.username)
    if(req.method=="OPTIONS")return
    if(req.body.commentId&&req.body.commentId>-1){
        
        Article.findByIdAndUpdate({_id:p_id, "comments._id":commentId},
				{$set:{"comments.$.text": req.body.text, "comments.$.date": new Date().getTime()}},
				{new:true},
				(error,doc)=>{
				if(error){
					res.status(400).send({error:error})
				}
				else{
						res.status(200).send({articles:doc})
                }
			})
    }
    if(req.body.commentId&&req.body.commentId==-1){
        
        let sid = req.headers.cookie['sid']

        redis.hgetall(sid, function(err,userObject){
            if(userObject && userObject.username){
            req.username = userObject.username;}})
            console.log(req.username)
         Article.findByIdAndUpdate({_id:p_id, "comments._id":commentId},
				{$push:{comments:{author: req.username, date: new Date().getTime(), text:req.body.text}}},
				{new:true},
				(error,doc)=>{
				if(error){
					res.status(400).send({error:error})
				}
				else{
						res.status(200).send({articles:doc})
                }
			})
    }
    else{
         Article.findByIdAndUpdate({_id:p_id},
                {text:req.body.text},
				{new:true},
				(error,doc)=>{
				if(error){
					res.status(400).send({error:error})
				}
				else{
						res.status(200).send({articles:doc})
                }
			})
    }
}
const defaultmsg=(req,res)=>{
    res.send("Hello dl37!")
}
module.exports= app =>{
app.use(bodyParser.json())
app.use(cookieParser())	
app.get('/',defaultmsg)
app.post('/article',uploadImage('articles'), addArticle)
app.get('/articles/:id?', getArticle)
app.put('/articles/:id',putArticle)}


// Get the port from the environment, i.e., Heroku sets it



