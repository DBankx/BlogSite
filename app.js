const express = require('express')
const _ = require('lodash')
const bodyParser = require('body-parser')
const app = express()
const ejs = require('ejs')
const mongoose = require('mongoose') 


app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))

// create a mongoDB database 
mongoose.connect('mongodb://localhost:27017/BlogDB', {useNewUrlParser: true, useUnifiedTopology: true})
// create a new schema for the blogs
const blogSchema = new mongoose.Schema({
    name: String,
    post: String
})
// create a new collection model for the DB
const Blog = mongoose.model('Blog', blogSchema)
// put some dummy data into the blog
const blog1 = new Blog({
    name: 'Blog 1',
    post: 'This is the first dummy data for blog one in blog collections in the blog database'
})

const blog2 = new Blog({
    name: 'Blog 2',
    post: 'This is the second dummy data for blog one in blog collections in the blog database'
})

// put the blogs into an array to save
const blogList = [blog1, blog2]

// save the blog for the first time
// Blog.insertMany(blogList, (err)=>{
//     if (err){
//         console.log(err)
//     } else {
//         console.log('items have been saved')
//     }
// })


app.get('/', function(req, res){
    // getting the date
        let today = new Date()
        let options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'      
        }
        let date = today.toLocaleDateString('en-US', options)

        // locating the blog name and posts in the DB
        Blog.find((err, blogs)=>{
         if (blogList.length == 0){
             Blog.insertMany(blogList, (err)=>{
                 if (err){
                     console.log(err)
                 } else {
                     console.log('dummy blogs have been saved to the database')
                 }
             })
             res.redirect('/')
            //  rendering the home page
         } else {
            res.render('index', {date:date, posts:blogs})
         }   
        })
})

app.post('/', function(req, res){
    // getting the data from the input boxes 
    var blogTitle = req.body.title
    var blogPost = req.body.text
    
    // parsing the data into the database
    const newBlog = new Blog({
        name: blogTitle,
        post: blogPost
    })
    newBlog.save()
    res.redirect('/')

})

// creating a delete route 
app.post('/delete', (req, res)=>{
    var checkedId = req.body.check
    // use the method below to remove the data from the id above from the database
    Blog.findByIdAndRemove(checkedId, (err)=>{
        if(err){
            console.log(err)
        } else {
            console.log('Blog has been removed from the DB')
        }
        res.redirect('/')
    })
})

// create a dynamic page for each blog
app.get('/posts/:title', function(req, res){
    let nameofTitle = _.lowerCase(req.params.title)
    Blog.find((err, blogs)=>{
        blogs.forEach((blog)=>{
            if(_.lowerCase(blog.name) == nameofTitle){
                res.render('posts', {title:blog.name, body:blog.post})
            }
        })
    })   
})


app.get('/about', function(req, res){
    res.render('about')
})

app.listen(3000, function(){
    console.log('your app has started at port 3000')
})