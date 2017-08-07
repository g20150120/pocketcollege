var express = require('express');
var app = express.Router();
var mongodb = require('mongodb');
var bcrypt = require('bcrypt');
const saltRounds = bcrypt.genSaltSync(10);

//get homepage
app.get('/', function(req, res, next) 
{
  res.clearCookie('email');
  res.render('index');//render homepage
});

//process signup form
app.post('/signup_process', function(req, res)
{
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://localhost:27017/pocketcollege';
  // Connect to the server
  MongoClient.connect(url, function(err, db)
  {       
    if (err) 
    {
      console.log('/signup_process: Unable to connect to the Server:', err);
    } 
    else 
    {
      console.log('/signup_process: Connected to Server');
      var collection = db.collection('users');//get the collection
      //check if the password and email are entered correctly
      if(req.body.email!=req.body.email2 || req.body.password!=req.body.password2)
      {
        console.log("/signup_process: Please check your email address or password!");
        res.render('alertpage',{"alert_message": "Please check your Email address or password!"});
      }
      //check if all the boxes are filled
      else if(req.body.email=="" || req.body.password=="" ||req.body.username=="" || req.body.fn=="" || req.body.ln=="" || req.body.country=="" || req.body.state=="")
      {
        console.log("/signup_process: Please fill all the information!");
        res.render('alertpage',{"alert_message": "Please fill in all the information!"});
      }
      else
      {
        //get all the information from the signup form
        var user1 = {email: req.body.email, password: bcrypt.hashSync(req.body.password,saltRounds), // bcrypt password to protect users' password in the backend
                username: req.body.username, firstname: req.body.fn, lastname: req.body.ln, 
                grade: req.body.grade, gender: req.body.gender, country: req.body.country, state: req.body.state, 
                public: req.body.public, timeline:[]};
        //insert it as an obj to the data collection
        collection.insert([user1], function (err, result)
        {
          if (err) 
          {
            console.log(err);
          } 
          else 
          {
            console.log('email: ' + req.body.email + ' is registered in the database.');
            //redirect to the homepage; users still need to log in
            res.redirect("/");
          }
        });           
      }
    }
  });
});

//precess add_college form
app.post('/addcollege_process', function(req, res)
{
    //protect URL
    if(req.cookies.email!=="admin")
      res.redirect('/contentpage');
    var MongoClient = mongodb.MongoClient;
    var url = 'mongodb://localhost:27017/pocketcollege';
    MongoClient.connect(url, function(err, db)
    {
      if (err) 
      {
        console.log('/addcollege_process: Unable to connect to the Server:', err);
      } 
      else 
      {
        console.log('/addcollege_process: Connected to Server');
        var collection = db.collection('college_list');
        //process the data from the form; set viewcount=0, add '.jpg' to img_src
        var college1 = {name: req.body.add_name, title: req.body.add_title,
                    description: req.body.add_des, img_src: req.body.add_img, viewcount: 0, link: req.body.add_link};
        collection.insert([college1], function (err, result)
        {
          if (err) 
          {
            console.log(err);
          } 
          else 
          {
            console.log(req.body.add_name + ' has been added to the college_list');
            //refresh managecollege page
            res.redirect("managecollege");
          }
        });           
      }    
    });
}); 

//delete a college from college_list collection
app.post('/deletecollege_process', function(req, res)
{
  if(req.cookies.email!=="admin")
    res.redirect('/contentpage');
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://localhost:27017/pocketcollege';
  MongoClient.connect(url, function(err, db)
  {
    if (err) 
    {
      console.log('/deletecollege_process: Unable to connect to the Server:', err);
    } 
    else 
    {
      console.log('/deletecollege_process: Connected to Server');
      var collection = db.collection('college_list');
      var college1 = {name: req.body.del_name};// get the name of the college
      //delete this document from the collection
      collection.deleteOne(college1, function (err, result)
      {
        if (err) 
        {
          console.log(err);
        } 
        else 
        {
          console.log(req.body.del_name + ' has been deleted');
          res.redirect("managecollege");//refresh managecollege page
        }
      });           
    }    
  });
}); 

//process delete user form(a formal webpage is needed!!!)
app.post('/deleteuser_process', function(req, res)
{
  if(req.cookies.email!=="admin")
    res.redirect('/contentpage');
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://localhost:27017/pocketcollege';
  MongoClient.connect(url, function(err, db)
  {
    if (err) 
    {
      console.log('/deleteuser_process: Unable to connect to the Server:', err);
    } 
    else 
    {
      console.log('/deleteuser_process: Connected to Server');
      var collection = db.collection('users');
      var user1 = {email: req.body.email};//get user's email
      //delete one document that matches the email
      collection.deleteOne(user1, function (err, result)
      {
        if (err) 
        {
          console.log(err);
        } 
        else 
        {
          console.log(req.body.email + ' has been deleted');
          res.redirect("userlist");//referesh userslist
        }
      });           
    }
  });
});

//show all the users to admin
app.get('/userlist', function(req, res)
{
  if(req.cookies.email!=="admin")
    res.redirect('/contentpage');
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://localhost:27017/pocketcollege' ;
  MongoClient.connect(url, function (err, db)
  {
    if (err) 
    {
      console.log('/userlist: Unable to connect to the Server', err);
    } 
    else 
    {
      console.log('/userlist: Connection established to', url);
      var collection = db.collection('users');
      //find all the users
      collection.find({}).toArray(function (err, result) 
      {
        if (err) 
        {
          res.send(err);
        }
        else if (result.length)
        {
          //pass all the users as an array of obj to userlist page
          res.render('userlist',{"users" : result});
        } 
        else//if no error but no user found
        {
          res.render('alertpage',{"alert_message": "No Users Found!"});
        }
        db.close();
      });
    }  
  }); 
});

//get all the colleges in the database
app.get('/managecollege', function(req, res)
{
  if(req.cookies.email!=="admin")
    res.redirect('/contentpage');
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://localhost:27017/pocketcollege' ;
  MongoClient.connect(url, function (err, db)
  {
    if (err) 
    {
      console.log('/managecollege: Unable to connect to the Server', err);
    } 
    else 
    {
      console.log('/managecollege: Connection established to', url);
      // Get the documents collection
      var collection = db.collection('college_list');
      //find all the colleges (not  sorted)
      collection.find({}).toArray(function (err, result) 
      {
        if (err) 
        {
          res.send(err);
        } 
        else if (result.length) 
        {
          //pass all the colleges found to managecollege page
          res.render('managecollege',{"colleges" : result});
        } 
        else 
        {
          res.render('alertpage',{"alert_message": "No Colleges Found!"});
        }
        db.close();
      });
    }  
  }); 
});

//get all the colleges(sorted by viewcount) from the database
app.get('/collegeinfo', function(req, res)
{
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://localhost:27017/pocketcollege' ;
  MongoClient.connect(url, function (err, db)
  {
    if (err) 
    {
      console.log('/collegeinfo: Unable to connect to the Server', err);
    } 
    else 
    {
      console.log('/collegeinfo: Connection established to', url);
      var collection = db.collection('college_list');
      //find all the colleges and sort by viewcount
      collection.find({}).sort({"viewcount":-1}).toArray(function (err, result) 
      {
        if (err) 
        {
          res.send(err);
        } 
        else if (result.length) 
        {
          //pass sorted colleges to collegeinfo webpage
          res.render('collegeinfo',{"colleges" : result});
        } 
        else 
        {
          res.render('alertpage',{"alert_message": "No Colleges Found!"});
        }
        db.close();
      });
    }  
  }); 
});

//process the search request, find and sort colleges, and render collegeinfo with a new array of colleges
app.post('/searchcollege_process',function(req,res)
{
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://localhost:27017/pocketcollege' ;
  MongoClient.connect(url, function (err, db)
  {
    if (err) 
    {
      console.log('/searchcollege_process: Unable to connect to the Server', err);
    } 
    else 
    {
      console.log('/searchcollege_process: Connection established to', url);
      var collection = db.collection('college_list');
      console.log(req.body.searchname);//send search request to the server
      //case-insensitive "like" match
      var patt=new RegExp(req.body.searchname.toLowerCase(), "i");
      collection.find({"description": patt }).sort({"viewcount":-1}).toArray(function (err, result) 
      {
        for(i in result)
        {
          //increase viewcount by 1
          collection.update({"name":result[i].name},
                            {$set: { "viewcount": result[i].viewcount+1 } });
        }
        if (err) 
        {
          res.send(err);
        } 
        else if (result.length) 
        {
          //render collegeinfo page again with new array of colleges
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

//admin could reset all viewocunt to 0
app.post('/resetviewcount_process',function(req,res)
{
  if(req.cookies.email!=="admin")
    res.redirect('/contentpage');
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://localhost:27017/pocketcollege';
  MongoClient.connect(url, function (err, db)
  {
    if (err) 
    {
      console.log('/resetviewcount_process: Unable to connect to the Server', err);
    } 
    else 
    {
      console.log('/resetviewcount_process: Connection established to', url);
      var collection = db.collection('college_list');
      //set all viewcount of all the documents in the college_list to 0
      collection.update({}, {$set: {"viewcount": 0}}, {multi: true});
      console.log('viewcounts have been set to 0!');
      db.close();
    }  
  });
  //refresh managecollege page
  res.redirect('managecollege');
});

//users can search each other by email address(if it is public)
app.post('/searchuser_process',function(req,res)
{
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://localhost:27017/pocketcollege' ;
  MongoClient.connect(url, function (err, db)
  {
    if (err) 
    {
      console.log('/searchuser_process: Unable to connect to the Server', err);
    } 
    else 
    {
      console.log('/searchuser_process: Connection established to', url);
      var collection = db.collection('users');
      console.log(req.body.searchuser);
      collection.find({"email":req.body.searchuser}).toArray(function (err, result) 
      {
        if (err) 
        {
          res.send(err);
        } 
        else if (result.length) 
        {
          if(result[0].public==="N")// if private
          {
            console.log(req.body.searchuser + ' is private.');
            res.render('alertpage',{"alert_message": "This Account is Private!"});
          }
          else//if public
          {
            console.log(req.body.searchuser + ' is public.');
            //pass this user as an obj to sharinginfo page
            res.render('sharinginfo',{"user":result[0]});
          }
        } 
        else 
        {
          console.log('No user found');
          res.render('alertpage',{"alert_message": "No User Found!"});
        }
        db.close();
      });
    }  
  });
});

//display timeline
app.get('/timeline', function(req, res)
{
  //if not logged in, render sample timeline and a signup href
  if(!req.cookies.email)
    res.render('timelinesample');
  //else, render user's own timeline
  else
  {
    var MongoClient = mongodb.MongoClient;
    var url = 'mongodb://localhost:27017/pocketcollege' ;
    MongoClient.connect(url, function (err, db)
    {
      if (err) 
      {
        console.log('/timeline: Unable to connect to the Server', err);
      } 
      else 
      {
        console.log('/timeline: Connection established to', url);
        var collection = db.collection('users');
        //find current user's info by email address in cookies
        collection.find({"email": req.cookies.email}).toArray(function (err, result) 
        {
          if (err) 
          {
            res.send(err);
          } 
          else if (result.length) 
          {
            console.log(req.cookies.email + '\'s timeline is sent.');
            res.render('timeline',{"mytimeline" : result[0].timeline});
          } 
          else 
          {
            console.log('No users found');
            res.render('alertpage',{"alert_message": "No Events Found!"});
          }
          db.close();
        });
      }  
    });
  }  
});

//display current user's events
app.get('/edittimeline', function(req, res)
{
  if(!req.cookies.email)
    res.redirect('/');
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://localhost:27017/pocketcollege' ; 
  MongoClient.connect(url, function (err, db)
  {
    if (err) 
    {
      console.log('/edittimeline: Unable to connect to the Server', err);
    } 
    else 
    {
      console.log('/edittimeline: Connection established to', url);
      var collection = db.collection('users');
      collection.find({"email":req.cookies.email}).toArray(function (err, result) 
      {
        if (err) 
        {
          res.send(err);
        } 
        else if (result.length) 
        {
          console.log(req.cookies.email + '\'s timeline is sent.');
          res.render('edittimeline',{"mytimeline" : result[0].timeline});
        } 
        else 
        {
          res.render('alertpage',{"alert_message": "No Events Found!"});
        }
        db.close();
      });
    }  
  }); 
});

//find event info when "Modify/Delete Event" is clicked
app.get('/editevent_process', function(req, res)
{
  if(!req.cookies.email)
    res.redirect('/');
  var thisurl=req.url;//get whole url of the page
  thisurl=decodeURI(thisurl);//decode the URL
  //thisurl: xxxx:3000/editevent_process?event=eventname
  //first split by '?', then split the second part by '=' to get event name as a string
  var eventname=thisurl.split('?')[1].split('=')[1];
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://localhost:27017/pocketcollege' ; 
  MongoClient.connect(url, function (err, db)
  {
    if (err) 
    {
      console.log('/editevent_process: Unable to connect to the Server', err);
    } 
    else 
    {
      console.log('/editevent_process: Connection established to', url);
      var collection = db.collection('users');
      collection.find({"email":req.cookies.email}).toArray(function (err, result) 
      {
        if (err) 
        {
          res.send(err);
        } 
        else if (result.length) 
        {
          var thistimeline=result[0].timeline;//get this user's whole timeline as an array of obj
          for(i in thistimeline)
          {
            //iterate through this array of obj to find an timeline obj that has event===eventname(sent through URL)
            if(thistimeline[i].event===eventname)
            {             
              console.log(eventname + ' has been sent');
              //pass this timeline obj to modifytimeline page
              res.render('modifytimeline',{"myevent":thistimeline[i]});
              break;
            }
          }
        } 
        else 
        {
          res.render('alertpage',{"alert_message": "No Events Found!"});
        }
      });
    }  
  }); 
});

//render user's profile & timeline when Y./N. is clicked
app.get('/adminviewtimeline_process', function(req, res)
{
  if(!req.cookies.email)
    res.redirect('/contentpage');
  var thisurl=req.url;//get whole url of the page
  thisurl=decodeURI(thisurl);//decode the URL
  //thisurl: xxxx:3000/editevent_process?event=eventname
  //first split by '?', then split the second part by '=' to get event name as a string
  var useremail=thisurl.split('?')[1].split('=')[1];
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://localhost:27017/pocketcollege' ; 
  MongoClient.connect(url, function (err, db)
  {
    if (err) 
    {
      console.log('/adminviewtimeline_process: Unable to connect to the Server', err);
    } 
    else 
    {
      console.log('/adminviewtimeline_process: Connection established to', url);
      var collection = db.collection('users');
      collection.find({"email":useremail}).toArray(function (err, result) 
      {
        if (err) 
        {
          res.send(err);
        } 
        else if (result.length) 
        {
          if(result[0].public==="N")// if private
          {
            console.log(req.body.searchuser + ' is private.');
            res.render('alertpage',{"alert_message": "This Account is Private!"});
          }
          else//if public
          {
            console.log(req.body.searchuser + ' is public.');
            //pass this user as an obj to sharinginfo page
            res.render('sharinginfo',{"user":result[0]});
          }
        } 
        else 
        {
          res.render('alertpage',{"alert_message": "No Events Found!"});
        }
      });
    }  
  }); 
});

//find college info when "Mofidy/Delete College" is clicked
app.get('/editcollege_process', function(req, res)
{
  if(req.cookies.email!=="admin")
    res.redirect('/contentpage');
  var thisurl=req.url;// get whole url of the page
  thisurl=decodeURI(thisurl);
  var collegename=thisurl.split('?')[1].split('=')[1];// get college name
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://localhost:27017/pocketcollege' ; 
  MongoClient.connect(url, function (err, db)
  {
    if (err) 
    {
      console.log('/editcollege_process: Unable to connect to the Server', err);
    } 
    else 
    {
      console.log('/editcollege_process: Connection established to', url);
      var collection = db.collection('college_list');
      collection.find({"name":collegename}).toArray(function (err, result) 
      {
        if (err) 
        {
          res.send(err);
        } 
        else if (result.length) 
        {
          console.log(collegename + ' has been sent');          
          res.render('modifycollege',{"mycollege":result[0]});
        } 
        else 
        {
          res.render('alertpage',{"alert_message": "No Events Found!"});
        }
      });
    }  
  }); 
});

//process addevent form
app.post('/addevent_process', function(req, res)
{
  if(!req.cookies.email)
      res.redirect('/');
    var MongoClient = mongodb.MongoClient;
    var url = 'mongodb://localhost:27017/pocketcollege';
    MongoClient.connect(url, function(err, db)
    {
      if (err) 
      {
        console.log('/addevent_process: Unable to connect to the Server:', err);
      } 
      else 
      {
        console.log('/addevent_process: Connected to Server');
        var collection = db.collection('users');
        var convert=["","Jan.","Feb.","Mar.","April","May","June","July","Aug.","Sep.","Oct.","Nov.","Dec."];
        var time=0;
        //get month as an int
        for(var i=1;i<=12;i++)
        {
          if(convert[i]===req.body.month)
          {
            time=i;//time(int)===month(int)
            break;
          }
        }
        time=(parseInt(req.body.year)*100+time)*100;//time(int)===yyyymm00
        var event1 = {event: req.body.event, time: time, timestr: req.body.month+" "+req.body.year,
                      detail: req.body.detail };
        //push event1 into the array of events and sort by time order
        collection.update({"email":req.cookies.email}, {$push: {"timeline":{$each: [event1], $sort: {"time":1}}}},function(err,result)
        {
          if (err) 
          {
            console.log(err);
          } 
          else 
          {
            console.log(req.body.event + ' has been added into timeline');
            res.redirect("edittimeline");//refresh edittimeline page
          }
        });      
      }    
    });
});

//make changes to event in the database
app.post('/modifytimeline_process',function(req,res)
{
  if(!req.cookies.email)
      res.redirect('/');
  var thisurl=req.url;
  thisurl=decodeURI(thisurl);
  //action='/modifytimeline_process?originalevent='+myevent.event
  var originalevent=thisurl.split('?')[1].split('=')[1];
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://localhost:27017/pocketcollege';
  MongoClient.connect(url, function(err, db)
  {
    if (err) 
    {
      console.log('/modifytimeline_process: Unable to connect to the Server:', err);
    } 
    else 
    {
      console.log('/modifytimeline_process: Connected to Server');
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
      var event1 = {event: req.body.event, time: time, timestr: req.body.month+" "+req.body.year,
                    detail: req.body.detail };
      var collection = db.collection('users');
      //firstly delete the original event
      collection.update({"email":req.cookies.email},{$pull: { "timeline": {"event": originalevent} }}, function(err1,result1)
      {
        if(err1)
        {
          console.log(err);
        }
        else
        {
          //secondly push modified event into the collection
          collection.update({"email":req.cookies.email}, {$push: {"timeline":{$each: [event1], $sort: {"time":1}}}},function(err,result)
          {
            if (err) 
            {
              console.log(err);
            } 
            else 
            {
              console.log(originalevent + ' has been modified');
              res.redirect("edittimeline");// refresh edittimeline page
            }
          });
        }
      });     
    }            
  });
});

//make changes to college in the database
app.post('/modifycollege_process',function(req,res)
{
  if(req.cookies.email!=="admin")
      res.redirect('/contentpage');
  var thisurl=req.url;//get whole url of the page
  thisurl=decodeURI(thisurl);//decode the URL
  //action='/modifycollege_process?originalname='+mycollege.name+'&viewcount='+mycollege.viewcount
  var originalname=thisurl.split('?')[1].split('&')[0].split('=')[1];
  var originalviewcount=parseInt(thisurl.split('?')[1].split('&')[1].split('=')[1]);
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://localhost:27017/pocketcollege';
  MongoClient.connect(url, function(err, db)
  { 
    if (err) 
    {
      console.log('/modifycollege_process: Unable to connect to the Server:', err);
    } 
    else 
    {
      console.log('/modifycollege_process: Connected to Server');
      var collection = db.collection('college_list');
      var college1 = {name: req.body.name, title: req.body.title, 
                  description: req.body.des, img_src: req.body.img_src, viewcount: originalviewcount, link: req.body.link};
      //update college_list
      collection.update({"name":originalname}, {$set: college1}, function (err, result)
      { 
        if (err) 
        {
          console.log(err);
        } 
        else 
        {
          console.log(originalname + ' has been modified');
          res.redirect("managecollege"); 
        }
      }); 
    }            
  });
});

//process delete event form
app.post('/deleteevent_process', function(req, res)
{
  if(!req.cookies.email)
    res.redirect('/');
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://localhost:27017/pocketcollege';
  MongoClient.connect(url, function(err, db)
  { 
    if (err) 
    {
      console.log('/deleteevent_process: Unable to connect to the Server:', err);
    } 
    else 
    {
      console.log('/deleteevent_process: Connected to Server');
      var collection = db.collection('users'); 
      var event1 = {event: req.body.delete_event};
      //delete event from the database
      collection.update({"email":req.cookies.email},{$pull: { "timeline": event1 }},function(err,result)
      {
        if (err) 
        {
          console.log(err);
        } 
        else 
        {
          console.log(req.body.delete_event + ' has been deleted');
          res.redirect("edittimeline"); 
        }
      });       
    }    
  });
}); 

//check if email and password are submitted correctly when users log in
app.post('/checkuser', function(req, res)
{
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://localhost:27017/pocketcollege';
  MongoClient.connect(url, function(err, db)
  {
    if (err) 
    {
      console.log('/checkuser: Unable to connect to the Server:', err);
    } 
    else 
    {
      console.log('/checkuser: Connected to Server');
      var user = db.collection('users');
      var a = req.body.email;     
      var b = req.body.password;
      //firstly check if this email is in the users list
      user.findOne({"email": a},function (err, user) 
      {
        if (!user) //if not in
        {
          console.log("Could not find Email!");
          res.render('alertpage',{"alert_message": "No User Found!"});
        } 
        else//if email is found
        {
          //use bcrypt to check if the password is correct
          bcrypt.compare(b,user.password,function(err,work)
          {
            if(work)//if email match with password
            {
              //write cookie
              res.cookie('email', a, {expire : new Date() + 60*5});
              if(a==="admin")
              {
                console.log('admin logged in!');         
                res.redirect("adminpage");
              }
              else
              {
                console.log(a + ' tried to log in!');
                res.redirect("contentpage");
              }
            }
            else
            {
              console.log("Invalid Login!");
              res.render('alertpage',{"alert_message": "Wrong Email or Password!"});
            }
          });
        }  
        db.close();   
      });    
    } 
  }); 
});

//list cookie(no webpage, just type URL when logged in as admin)
app.get('/listcookies', function(req, res)
{
  if(req.cookies.email!=="admin")
    res.render('alertpage',{"alert_message": "Invalid Request!"});
  else
  {
    console.log("Cookies : ", req.cookies);
    res.render('alertpage',{"alert_message": "Look in console for cookies"});
  }
});

// Delete cookie
app.get('/deletecookie', function(req, res)
{
  console.log(req.cookies.email + ' logs out');
  res.clearCookie('email');
  res.redirect('/');
});

//render homepage for logged in users
app.get('/contentpage', function(req, res)
{
  if(!req.cookies.email)
    res.redirect('/');
  console.log(req.cookies.email + ' has logged in');
  res.render('userpage',{"user_email" : req.cookies.email});
});

//find user's info and send to userprofile page for further modifications
app.get('/userprofile', function(req, res)
{
  if(!req.cookies.email)
    res.redirect('/');
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://localhost:27017/pocketcollege' ;  
  MongoClient.connect(url, function (err, db)
  {
    if (err) 
    {
      console.log('/userprofile: Unable to connect to the Server', err);
    } 
    else 
    {  
      console.log('/userprofile: Connection established to', url);
      var collection = db.collection('users');
      collection.find({"email":req.cookies.email}).toArray(function (err, result) 
      {
        if (err) 
        {
          res.send(err);
        } 
        else if (result.length) 
        {
          console.log(req.cookies.email + '\'s profile has been sent');
          res.render('userprofile',{"users" : result});
        } 
        else 
        {
          res.render('alertpage',{"alert_message": "No User Found!"});
        }
        db.close(); 
      });
    }  
  }); 
});

//update user profile
app.post('/userprofile_process', function(req, res)
{
  if(!req.cookies.email)
    res.redirect('/');
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://localhost:27017/pocketcollege';
  MongoClient.connect(url, function(err, db)
  {  
    if (err) 
    {
      console.log('/userprofile_process: Unable to connect to the Server:', err);
    } 
    else 
    {
      console.log('/userprofile_process: Connected to Server');
      var collection = db.collection('users'); 
      if(req.body.password!=="")//if password box is filled: change password
      {
        var user1={password: bcrypt.hashSync(req.body.password,saltRounds), 
          username: req.body.username, firstname: req.body.fn, lastname: req.body.ln, 
          grade: req.body.grade, gender: req.body.gender, 
          country: req.body.country, state: req.body.state, public: req.body.pubilc};
      }
      else//if password box is left empty: don't change password
      {
        var user1={username: req.body.username, firstname: req.body.fn, lastname: req.body.ln, 
          grade: req.body.grade, gender: req.body.gender, 
          country: req.body.country, state: req.body.state, public: req.body.public};
      }
      //update user info
      collection.update({"email":req.cookies.email}, {$set: user1}, function (err, result)
      { 
        if (err) 
        {
          console.log(err);
        } 
        else 
        {
          console.log(req.cookies.email + '\'s profile has been updated');
          res.redirect("contentpage");   
        }
      }); 
    }            
  });
}); 

//protect the URL of adminpage
app.get('/adminpage', function(req, res)
{
  if(req.cookies.email!=="admin")
    res.redirect('/contentpage');
    res.render('adminpage');
});

//protect the URL of deleteuser
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








module.exports = app;
