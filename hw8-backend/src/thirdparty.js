const local=false
const callbackURL = local?'http://localhost:3000/auth/callback':'https://lidai-ricebook-final.herokuapp.com/auth/callback'
const config = {
	clientSecret:'e080de3f85d19f51c70781e24fd38d86', 
	clientID:'403256360055936', 
	callbackURL:callbackURL
}
var redis = require('redis').createClient('redis://h:p76fc1a93d79bd19af53fd4c32e8a1e5d123ab1a40bec0d51eb53114455e27217@ec2-34-206-162-178.compute-1.amazonaws.com:31549')

var users = [];
var request = require('request')
var session = require('express-session')
var cookieParser = require('cookie-parser')
var passport = require('passport')
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../model.js').User
var Profile = require('../model.js').Profile

passport.serializeUser(function(user, done){
	users[user.id] = user
	done(null, user.id)
})

passport.deserializeUser(function(id,done){
	var user = users[id]
	done(null,user)
})

passport.use(new FacebookStrategy(config,
	function(token, refreshToken, profile, done){
		process.nextTick(function(){
			let username = profile.displayName+'@facebook'
			User.find({ username }).exec(function(err, items) {
				if(items.length===0){
					//user not found
					new User({username:username, salt:null, hash: null, auth:'facebook'}).save(()=>{
						new Profile({username:username, email: null, zipcode: null, dob: null, 
							headline:"Loggedn in through Facebook",
							avatar:'https://cdn.theatlantic.com/assets/media/img/posts/ku-xlarge.jpg',
							following: []}).save();
					});
				}
			})
			//console.log(profile)
			return done(null,profile);
			
		})
	}
))

const facebooklogin = (app) => {
    return (req, res) => {
        const sid = req.cookies['sid']
        const frontend_url = app.locals.referer
        redis.hgetall(sid, function (err, userObj) {
            // Have already logged in as normal user, need to link account
            if (userObj && userObj.username) {
                console.log(sid + ' mapped to ', userObj.username)
                console.log('Have already logged in as normal user, need to link account ')
                res.redirect(frontend_url)
            } else {
				redis.hmset('fblogin',{username:req.user.displayName+'@facebook'})
				//console.log(username)
				console.log(req.user.displayName)
				res.cookie('logintype', 'fblogin', {maxAge:3600*1000, httpOnly:true})
                res.redirect(frontend_url)
            }
        })
    }
}

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		next()
		console.log('facebook already logged in')
		console.log(req.cookies)
	}
	else{
		res.redirect('/login')
	}
}

const fbredir = (app)=>{
	console.log('facebook auth success！')
	//console.log(req.headers)
	//res.redirect('http://localhost:8080');
	return (req,res)=>{
	res.redirect(app.locals.referer);}
}

const fail = (req, res) => {
    res.send('Could not log in! ', req.user)
}

const loginstatus=(req,res)=>{

}

module.exports = app => {
    app.use(session({secret:'what a secret'}))
	app.use(passport.initialize())
	app.use(passport.session())
    app.use(cookieParser())
	app.use('/login/facebook',
	 (req, res, next) => {
             app.locals.referer = req.headers.referer
            next()
         },
	 passport.authenticate('facebook', {scope:'email'}))
	app.use('/auth/callback', passport.authenticate('facebook', { failureRedirect:'/fail'}),facebooklogin(app))
    app.use('/fail', fail)
	app.use('/fbredir',isLoggedIn,fbredir)
	app.use('/loginstatus',loginstatus)
}