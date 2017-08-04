var express = require('express');
var app = express.Router();
var mongodb = require('mongodb');
var bcrypt = require('bcrypt');
const saltRounds = bcrypt.genSaltSync(10);

/* GET home page. */
app.get('/', function(req, res, next) 
{
  res.clearCookie('email');
  res.render('index');
});


app.post('/signup_process', function(req, res)
{
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://localhost:27017/pocketcollege';
  MongoClient.connect(url, function(err, db)
  {       // Connect to the server
    if (err) 
    {
      console.log('Unable to connect to the Server:', err);
    } 
    else 
    {
      console.log('Connected to Server');
      var collection = db.collection('users'); // Get the documents collection
      if(req.body.email!=req.body.email2 || req.body.password!=req.body.password2)
      {
        console.log("Please check your email address or password!");
        res.render('alertpage',{"alert_message": "Please check your Email address or password!"});
          //res.redirect("/signup");
      }
      else if(req.body.email=="" || req.body.password=="" ||req.body.username=="" || req.body.fn=="" || req.body.ln=="" || req.body.country=="" || req.body.state=="")
      {
        console.log("Please fill all the information!");
        res.render('alertpage',{"alert_message": "Please fill in all the information!"});
      }
      else
      {
        var user1 = {email: req.body.email, password: bcrypt.hashSync(req.body.password,saltRounds), // Get the student data      city: req.body.city, state: req.body.state, sex: req.body.sex,
                username: req.body.username, firstname: req.body.fn, lastname: req.body.ln, 
                grade: req.body.grade, gender: req.body.gender, country: req.body.country, state: req.body.state, 
                public: req.body.public, timeline:[]};
        collection.insert([user1], function (err, result)
        {      // Insert the student data
          if (err) 
          {
            console.log(err);
          } 
          else 
          {
            res.redirect("/");     // Redirect to the updated student list
          }
        });           
      }
    }        //db.close();    
  });
});
   
app.post('/addcollege_process', function(req, res)
{
    if(req.cookies.email!=="admin")
      res.redirect('/contentpage');
    var MongoClient = mongodb.MongoClient;
    var url = 'mongodb://localhost:27017/pocketcollege';
    MongoClient.connect(url, function(err, db)
    {       // Connect to the server
      if (err) 
      {
        console.log('Unable to connect to the Server:', err);
      } 
      else 
      {
        console.log('Connected to Server');
        var collection = db.collection('college_list'); // Get the documents collection
        var college1 = {name: req.body.add_name, title: req.body.add_title, // Get the student data     city: req.body.city, state: req.body.state, sex: req.body.sex,
                    description: req.body.add_des, img_src: req.body.add_img+".jpg", viewcount: 0, link: req.body.add_link};
        collection.insert([college1], function (err, result)
        {     // Insert the student data
          if (err) 
          {
            console.log(err);
            //res.send('Error!');
          } 
          else 
          {
            res.redirect("managecollege");     // Redirect to the updated student list
          }
        });           
      }    
    });
}); 

app.post('/deletecollege_process', function(req, res)
{
  if(req.cookies.email!=="admin")
    res.redirect('/contentpage');
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://localhost:27017/pocketcollege';
  MongoClient.connect(url, function(err, db)
  {       // Connect to the server
    if (err) 
    {
      console.log('Unable to connect to the Server:', err);
    } 
    else 
    {
      console.log('Connected to Server');
      var collection = db.collection('college_list'); // Get the documents collection
      var college1 = {name: req.body.del_name};
      collection.deleteOne(college1, function (err, result)
      {      // Insert the student data
        if (err) 
        {
          console.log(err);
          //res.send('Error!');
        } 
        else 
        {
          res.redirect("managecollege");     // Redirect to the updated student list
        }
      });           
    }    
  });
}); 

app.post('/deleteuser_process', function(req, res)
{
  if(req.cookies.email!=="admin")
    res.redirect('/contentpage');
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://localhost:27017/pocketcollege';
  MongoClient.connect(url, function(err, db)
  {       // Connect to the server
    if (err) 
    {
      console.log('Unable to connect to the Server:', err);
    } 
    else 
    {
      console.log('Connected to Server');
      var collection = db.collection('users'); // Get the documents collection
      var user1 = {email: req.body.email};
      collection.deleteOne(user1, function (err, result)
      {     // Insert the student data
        if (err) 
        {
          console.log(err);
          //res.send('Error!');
        } 
        else 
        {
          res.redirect("userlist");      // Redirect to the updated student list
        }
      });           
    }
  });
});

app.get('/userlist', function(req, res)
{
  if(req.cookies.email!=="admin")
    res.redirect('/contentpage');
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://localhost:27017/pocketcollege' ;    // Define where the MongoDB server is
  MongoClient.connect(url, function (err, db)
  {// Connect to the server
    if (err) 
    {
      console.log('Unable to connect to the Server', err);
    } 
    else 
    {    // We are connected
      console.log('Connection established to', url);
    // Get the documents collection
      var collection = db.collection('users');
      collection.find({}).toArray(function (err, result) 
      {// Find all students
        if (err) 
        {
          res.send(err);
        } 
        else if (result.length) 
        {
          res.render('userlist',{"users" : result});
        } 
        else 
        {
          //res.send('No Users Found');
          res.render('alertpage',{"alert_message": "No Users Found!"});
        }
        db.close(); //Close connection
      });
    }  
  }); 
});

app.get('/managecollege', function(req, res)
{
  if(req.cookies.email!=="admin")
    res.redirect('/contentpage');
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://localhost:27017/pocketcollege' ;    // Define where the MongoDB server is
  MongoClient.connect(url, function (err, db)
  {// Connect to the server
    if (err) 
    {
      console.log('Unable to connect to the Server', err);
    } 
    else 
    {    // We are connected
      console.log('Connection established to', url);
      // Get the documents collection
      var collection = db.collection('college_list');
      collection.find({}).toArray(function (err, result) 
      {// Find all students
        if (err) 
        {
          res.send(err);
        } 
        else if (result.length) 
        {
          res.render('managecollege',{"colleges" : result});
        } 
        else 
        {
          //res.send('No Colleges Found');
          res.render('alertpage',{"alert_message": "No Colleges Found!"});
        }
        db.close(); //Close connection
      });
    }  
  }); 
});


app.get('/collegeinfo', function(req, res)
{
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://localhost:27017/pocketcollege' ;    // Define where the MongoDB server is
  MongoClient.connect(url, function (err, db)
  {// Connect to the server
    if (err) 
    {
      console.log('Unable to connect to the Server', err);
    } 
    else 
    {    // We are connected
      console.log('Connection established to', url);
    // Get the documents collection
      var collection = db.collection('college_list');
      collection.find({}).sort({"viewcount":-1}).toArray(function (err, result) 
      {// Find all students
        if (err) 
        {
          res.send(err);
        } 
        else if (result.length) 
        {
          res.render('collegeinfo',{"colleges" : result});
        } 
        else 
        {
          //res.send('No colleges found');
          res.render('alertpage',{"alert_message": "No Colleges Found!"});
        }
        db.close(); //Close connection
      });
    }  
  }); 
});

app.post('/searchcollege_process',function(req,res)
{
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://localhost:27017/pocketcollege' ;    // Define where the MongoDB server is
  MongoClient.connect(url, function (err, db)
  {// Connect to the server
    if (err) 
    {
      console.log('Unable to connect to the Server', err);
    } 
    else 
    {    // We are connected
      console.log('Connection established to', url);
    // Get the documents collection
      var collection = db.collection('college_list');
      console.log(req.body.searchname);
      var patt=new RegExp(req.body.searchname.toLowerCase(), "i")
      collection.find({"description": patt }).sort({"viewcount":-1}).toArray(function (err, result) 
      {// Find all students
        if (err) 
        {
          res.send(err);
        } 
        else if (result.length) 
        {
          res.render('collegeinfo',{"colleges" : result});
        } 
        else 
        {
          res.render('alertpage',{"alert_message": "No Colleges Found!"});
        }
        db.close(); //Close connection
      });
    }  
  });
});

app.post('/searchuser_process',function(req,res)
{
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://localhost:27017/pocketcollege' ;    // Define where the MongoDB server is
  MongoClient.connect(url, function (err, db)
  {// Connect to the server
    if (err) 
    {
      console.log('Unable to connect to the Server', err);
    } 
    else 
    {    // We are connected
      console.log('Connection established to', url);
    // Get the documents collection
      var collection = db.collection('users');
      //console.log(req.body.searchname);
      collection.find({"email":req.body.searchuser}).toArray(function (err, result) 
      {// Find all students
        if (err) 
        {
          res.send(err);
        } 
        else if (result.length) 
        {
          if(result[0].public==="N")
          {
            //res.send('This account is private.')
            res.render('alertpage',{"alert_message": "This Account is Private!"});
          }
          else
          {
            res.render('sharinginfo',{"user":result[0]});
          }
        } 
        else 
        {
          //res.send('No user found');
          res.render('alertpage',{"alert_message": "No User Found!"});
        }
        db.close(); //Close connection
      });
    }  
  });
});

app.get('/timeline', function(req, res)
{
  if(!req.cookies.email)
    res.render('timelinesample');
  else
  {
    var MongoClient = mongodb.MongoClient;
    var url = 'mongodb://localhost:27017/pocketcollege' ;    // Define where the MongoDB server is
    MongoClient.connect(url, function (err, db)
    {// Connect to the server
      if (err) 
      {
        console.log('Unable to connect to the Server', err);
      } 
      else 
      {    // We are connected
        console.log('Connection established to', url);
      // Get the documents collection
        var collection = db.collection('users');
        collection.find({"email": req.cookies.email}).toArray(function (err, result) 
        {// Find all students
          if (err) 
          {
            res.send(err);
          } 
          else if (result.length) 
          {
            res.render('timeline',{"mytimeline" : result[0].timeline});
          } 
          else 
          {
            res.send('No users found');
            res.render('alertpage',{"alert_message": "No Events Found!"});
          }
          db.close(); //Close connection
        });
      }  
    });
  }  
});


app.get('/edittimeline', function(req, res)
{
  if(!req.cookies.email)
    res.redirect('/');
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://localhost:27017/pocketcollege' ;    // Define where the MongoDB server is
  MongoClient.connect(url, function (err, db)
  {// Connect to the server
    if (err) 
    {
      console.log('Unable to connect to the Server', err);
    } 
    else 
    {    // We are connected
      console.log('Connection established to', url);
      // Get the documents collection
      var collection = db.collection('users');
      collection.find({"email":req.cookies.email}).toArray(function (err, result) 
      {// Find all students
        if (err) 
        {
          res.send(err);
        } 
        else if (result.length) 
        {
          res.render('edittimeline',{"mytimeline" : result[0].timeline});
        } 
        else 
        {
          res.render('alertpage',{"alert_message": "No Events Found!"});
        }
        db.close(); //Close connection
      });
    }  
  }); 
});


app.post('/addevent_process', function(req, res)
{
  if(!req.cookies.email)
      res.redirect('/');
    var MongoClient = mongodb.MongoClient;
    var url = 'mongodb://localhost:27017/pocketcollege';
    MongoClient.connect(url, function(err, db)
    {       // Connect to the server
      if (err) 
      {
        console.log('Unable to connect to the Server:', err);
      } 
      else 
      {
        console.log('Connected to Server');
        var collection = db.collection('users'); // Get the documents collection
        var convert=["","Jan.","Feb.","Mar.","April","May","June","July","Aug.","Sep.","Oct.","Nov.","Dec."];
        var time=0;
        for(var i=1;i<=12;i++)
        {
          if(convert[i]===req.body.month)
          {
            time=i;
            break;
          }
        }
        time=(parseInt(req.body.year)*100+time)*100;
        var event1 = {event: req.body.event, time: time, timestr: req.body.month+", "+req.body.year,
                      detail: req.body.detail };
        collection.update({"email":req.cookies.email}, {$push: {"timeline":{$each: [event1], $sort: {"time":1}}}},function(err,result){
          if (err) 
          {
            console.log(err);
            //res.send('Error!');
          } 
          else 
          {
            res.redirect("edittimeline");     // Redirect to the updated student list
          }
        });      
      }    
    });
});


app.post('/deleteevent_process', function(req, res)
{
  if(!req.cookies.email)
    res.redirect('/');
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://localhost:27017/pocketcollege';
  MongoClient.connect(url, function(err, db)
  {       // Connect to the server
    if (err) 
    {
      console.log('Unable to connect to the Server:', err);
    } 
    else 
    {
      console.log('Connected to Server');
      var collection = db.collection('users'); // Get the documents collection
      var event1 = {event: req.body.delete_event};
      collection.update({"email":req.cookies.email},{$pull: { "timeline": event1 }},function(err,result){
        if (err) 
        {
          console.log(err);
          //res.send('Error!');
        } 
        else 
        {
          res.redirect("edittimeline");     // Redirect to the updated student list
        }
      });       
    }    
  });
}); 


app.post('/checkuser', function(req, res)
{
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://localhost:27017/pocketcollege';
  MongoClient.connect(url, function(err, db)
  {
    if (err) 
    {
      console.log('Unable to connect to the Server:', err);
    } 
    else 
    {
      console.log('Connected to Server');
      var user = db.collection('users');
      var a = req.body.email;     
      var b = req.body.password;
      user.findOne({"email": a},function (err, user) 
      {
        
        if (!user) 
        {
          //res.send("Could not find Email!");
          res.render('alertpage',{"alert_message": "No User Found!"});
        } 

        else
        {
          bcrypt.compare(b,user.password,function(err,work)
          {
            if(work)
            {
              res.cookie('email', a, {expire : new Date() + 60*5});
              if(a==="admin")
              {
                
                res.redirect("adminpage");
              }
              else
              {
                
                res.redirect("contentpage");
              }
            }
            else
            {
              //res.send("Invalid Login!");
              res.render('alertpage',{"alert_message": "Wrong Email or Password!"});
            }
          });
        }  
        db.close();   
      });    
    } 
  }); 
});

app.get('/listcookies', function(req, res)
{
  if(req.cookies.email!=="admin")
    res.render('alertpage',{"alert_message": "Invalid Request!"});
  else 
    console.log("Cookies : ", req.cookies);
  //res.send('Look in console for cookies');
});

// Delete a cookie
app.get('/deletecookie', function(req, res)
{
  res.clearCookie('email');
  res.redirect('/');
});

app.get('/contentpage', function(req, res)
{
    if(!req.cookies.email)
      res.redirect('/');
    res.render('userpage',{"user_email" : req.cookies.email});
    //res.render('userpage');
});

app.get('/userprofile', function(req, res)
{
  if(!req.cookies.email)
    res.redirect('/');
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://localhost:27017/pocketcollege' ;    // Define where the MongoDB server is
  MongoClient.connect(url, function (err, db)
  {// Connect to the server
    if (err) 
    {
      console.log('Unable to connect to the Server', err);
    } 
    else 
    {    // We are connected
      console.log('Connection established to', url);
    // Get the documents collection
      var collection = db.collection('users');
      collection.find({"email":req.cookies.email}).toArray(function (err, result) 
      {// Find all students
        if (err) 
        {
          res.send(err);
        } 
        else if (result.length) 
        {
          console.log(result);
          res.render('userprofile',{"users" : result});
        } 
        else 
        {
          res.render('alertpage',{"alert_message": "No User Found!"});
        }
        db.close(); //Close connection
      });
    }  
  }); 
});

app.post('/userprofile_process', function(req, res)
{
    if(!req.cookies.email)
      res.redirect('/');
    var MongoClient = mongodb.MongoClient;
    var url = 'mongodb://localhost:27017/pocketcollege';
    MongoClient.connect(url, function(err, db)
    {       // Connect to the server
      if (err) 
      {
        console.log('Unable to connect to the Server:', err);
      } 
      else 
      {
        console.log('Connected to Server');
        var collection = db.collection('users'); // Get the documents collection
        if(req.body.password!=="")
        {
          var user1={password: bcrypt.hashSync(req.body.password,saltRounds), 
            username: req.body.username, firstname: req.body.fn, lastname: req.body.ln, 
            grade: req.body.grade, gender: req.body.gender, 
            country: req.body.country, state: req.body.state, public: req.body.pubilc};
        }
        else
        {
          var user1={username: req.body.username, firstname: req.body.fn, lastname: req.body.ln, 
            grade: req.body.grade, gender: req.body.gender, 
            country: req.body.country, state: req.body.state, public: req.body.public};
        }
        collection.update({"email":req.cookies.email}, {$set: user1}, function (err, result)
        {     // Insert the student data
          if (err) 
          {
            console.log(err);
            //res.send('Error!');
          } 
          else 
          {
            res.redirect("contentpage");     // Redirect to the updated student list
          }
        }); 
      }            
    });
}); 

app.get('/adminpage', function(req, res)
{
  if(req.cookies.email!=="admin")
    res.redirect('/contentpage');
    res.render('adminpage');
});

app.get('/deleteuser', function(req, res)
{
  if(req.cookies.email!=="admin")
    res.redirect('/');
    res.render('deleteuser');
});

app.get('/bbs', function(req, res)
{
    res.render('bbs');
});

app.get('/signup', function(req, res)
{
    res.render('signup');
});

app.get('/alert', function(req, res)
{
    res.render('alertpage');
});







module.exports = app;