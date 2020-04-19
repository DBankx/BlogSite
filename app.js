const express = require('express')
const _ = require('lodash')
const bodyParser = require('body-parser')
const app = express()
const ejs = require('ejs')

var posts = []

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))


app.get('/', function(req, res){
        let today = new Date()
        let options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'      
        }
        let date = today.toLocaleDateString('en-US', options)
    res.render('index', {date:date, posts:posts})
})

app.post('/', function(req, res){
    var post = {
        postTitle: req.body.title,
        postText: req.body.text
    }
    posts.push(post)
    res.redirect('/')

})

app.get('/posts/:title', function(req, res){
    let nameofTitle = _.lowerCase(req.params.title)
    posts.forEach(function(post){
        if (_.lowerCase(post.postTitle) == nameofTitle) {
            res.render('posts', {title:post.postTitle, body:post.postText})
        } 
    })
})


app.get('/about', function(req, res){
    res.render('about')
})

app.listen(3000, function(){
    console.log('your app has started at port 3000')
})