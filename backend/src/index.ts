import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import session from 'express-session'
import passport, { serializeUser } from 'passport'
import passportLocal from 'passport-local'
import dbuser from './models/dbuser'
import { IUser } from './interfaces/iuser'
import cookieParser from 'cookie-parser'
import * as argon2 from 'argon2'

const GoogleStrategy = require('passport-google-oauth20').Strategy
const TwitterStrategy = require('passport-twitter').Strategy
const GitHubStrategy = require('passport-github').Strategy
const LocalStrategy = passportLocal.Strategy

dotenv.config()

const app = express()
const PORT = 4000

//config
mongoose.connect(`${process.env.start}${process.env.usrname}:${process.env.pwd}${process.env.cluster}${process.env.final}`, {}, (err: Error) => 
{
    if (err) throw err;
    console.log("Connected to MongoDB successfully")
})

app.use(express.json())
app.use(cors({origin: `${process.env.reacthost}`, credentials: true}))
app.use(session({secret: `${process.env.secret}`, resave: true, saveUninitialized: true}))
app.use(cookieParser())
app.use(passport.initialize())
app.use(passport.session())



passport.serializeUser((user: IUser, done) => 
{
    return done(null, user._id)
})

passport.deserializeUser((id: string, done) => 
{
    dbuser.findOne({_id: id}, (err: Error, user: any) =>
    {
        const userinfo = {
            username: user?.username,
            email: user?.email,
            isadmin: user.isadmin
        }
        done(err, userinfo)
    })
})



//setup local passport oauth
passport.use(new LocalStrategy((email, password, done) =>
{
    dbuser.findOne({email: email}, (err: Error, user: any) =>
    {
        if (err) 
            throw err

        if (!user)
            return done(null, false)

        try
        {
            if (argon2.verify(password, user.password))
                return done(null, user)

            else
                return done(null, false)

        } catch(err)
        {
            return done(err, null)
        }
    })
}))

//setup google passport oauth
passport.use(new GoogleStrategy({
    clientID: `${process.env.clientidgoogle}`,
    clientSecret: `${process.env.clientscgoogle}`,
    callbackURL: `${process.env.hostname}/auth/google/callback`
},
    function(accessToken: any, refreshToken: any, profile: any, cb: any) 
    {
        dbuser.findOne({googleid: profile.id}, async (err: Error, doc: IUser) => 
        {
            try
            {
                if (!doc)
                {
                    const newuser = new dbuser({
                        googleid: profile.id,
                        username: profile.name.givenName
                    })
                    await newuser.save();
                    cb(null, newuser)
                }
                cb(null, doc)
            } catch(err)
            {
                return cb(err, null)
            }
        })
    }
))

//setup twitter passport oauth
passport.use(new TwitterStrategy({
    consumerKey: `${process.env.twitterkey}`,
    consumerSecret: `${process.env.twittersecret}`,
    callbackURL: `${process.env.hostname}/auth/twitter/callback`
},
    function(accessToken: any, refreshToken: any, profile: any, cb: any) 
    {
        dbuser.findOne({twitterid: profile.id}, async (err: Error, doc: IUser) => 
        {
            try
            {
                if (!doc)
                {
                    const newuser = new dbuser({
                        twitterid: profile.id,
                        username: profile.username
                    })
                    await newuser.save();
                    cb(null, newuser)
                }
                cb(null, doc)
            } catch(err)
            {
                return cb(err, null)
            }
        })
    }
))

//setup github passport oauth
passport.use(new GitHubStrategy({
    clientID: `${process.env.githubkey}`,
    clientSecret: `${process.env.githubsecret}`,
    callbackURL: `${process.env.hostname}/auth/github/callback`
},
    function(accessToken: any, refreshToken: any, profile: any, cb: any) 
    {
        dbuser.findOne({githubid: profile.id}, async (err: Error, doc: IUser) => 
        {
            try
            {
                if (!doc)
                {
                    const newuser = new dbuser({
                        githubid: profile.id,
                        username: profile.username
                    })
                    await newuser.save();
                    cb(null, newuser)
                }
                cb(null, doc)
            } catch(err)
            {
                return cb(err, null)
            }
        })
    }
))



//api start
app.listen(PORT, () =>
{
    console.log("Server started, listening on port: ", PORT)
}).on("error", (e) => {console.log("Error has occured: ", e.message)})


//google request handlers
app.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }))
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), function(req, res) { res.redirect(`${process.env.reacthost}/`) })

//twitter request handlers
app.get('/auth/twitter', passport.authenticate('twitter'))
app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/login' }), function(req, res) { res.redirect(`${process.env.reacthost}/`) })

//github request handlers
app.get('/auth/github', passport.authenticate('github'))
app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), function(req, res) { res.redirect(`${process.env.reacthost}/`) })
  
//home page
app.get("/", (req, res) => 
{
    res.send("hello world")
})

//log the current user out
app.get("/logout", (req, res) =>
{
    if (req.user)
    {
        req.logout()
        res.send("Success")
    }
})

//registers a new LOCAL user
app.post("/register", async (req, res) => 
{
    const {email, password} = req?.body;
    if (!email || !password || typeof email !== "string" || typeof password !== "string")
    {
        res.send("Improper values")
        return
    }

    dbuser.findOne({email}, async (err: Error, doc: IUser) =>
    {
        if (err)
            throw err

        if (doc)
            res.send("User already exists")

        if (!doc)
        {
            const pwhash = await argon2.hash(password, {
                type: argon2.argon2id,      //2id resistant to GPU and tradeoff attacks
                parallelism: 8,             //8 threads
                timeCost: 3,                //3 hashing iterations
                memoryCost: 1048576         //1 GB
            })
            
            const newuser = new dbuser({
                email: email,
                password: pwhash
            })

            await newuser.save()
            res.send("Success")
        }
    })
})

//logs in a local user which uses the passport local strategy
app.post("/login", passport.authenticate("local"), (req, res) =>
{
    res.send("Login successful")
})

//get currently logged in user
app.get("/getuser", (req, res) =>
{
    res.send(req.user)
})
