var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var userServices = require('../services/user_services');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var utils = require('./../util/utils');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


passport.use('login', new LocalStrategy(
   function(username, password, done){
       let res_result = {
           message: '',
           servertoken: '',
           status: 401
       };
       console.log("calling service class");
       userServices.searchUserAdmin({"email":username}, function(err,result){
          if(err){
              throw err;
          }else{
              if(result.result){
                  if(bcrypt.compareSync(password,result.result.password)){
                      const server_token = jwt.sign({uid:result.result.email}, utils.server_secret_key);
                      res_result.servertoken = server_token;
                      res_result.userinfo = {firstname:result.result.first_name, username:result.result.email};
                      res_result.message = "User logged in successfully ...";
                      res_result.status = 201;
                  }else{
                      res_result.message = "Wrong Password!!!!";
                  }
                  done(null, res_result);
              }else{
                  res_result.message = "User does not exists !!!";
                  done(null, res_result);
              }
          }
       });
   }));

router.post('/login',function(req, res, next){
    req.checkBody('username','Username cannot be empty').notEmpty();
    req.checkBody('username', 'Please enter a valid email id').notEmpty();
    req.checkBody('password', 'Password cannot be empty').notEmpty();
    console.log("calling passport authentication");
   passport.authenticate('login', function(err, result){
      if(!err && result.status == 201){
          return res.status(201).json(result);
      }else{
          return res.status(401).json(result);
      }
   });
});

router.post('/signup',function(req,res,next){
    let userinfo = {};
    userinfo.email = req.body.username;
    userinfo.password = req.body.password;
    userServices.addUser(userinfo,function(err, response){
        if(response.code == 201){
            res.status(201).json(response);
        }else if(response.code == 401){
            res.status(401).json(response);
        }else if(response.code == 405){
            res.status(405).json(response);
        }
    });

});


router.post('/adduser', function(req,res,next){
   var userinfo = {};
   userinfo.email = req.body.email;
   userinfo.password = req.body.password;
   userinfo.first_name = req.body.first_name;
   userinfo.last_name = req.body.last_name;
   userinfo.address = req.body.address;
   userinfo.city = req.body.city;
   userinfo.state = req.body.state;
   userinfo.zip = req.body.zip;
   userinfo.phone = req.body.phone;
   userServices.addUserAdmin(userinfo,function(err,result){
       if(err){
           res.status(403).json(result);
       }else{
           if(result.code == 201){
               res.status(201).join(result);
           }else{
               res.status(401).join(result);
           }

       }

   });
});


router.post('/searchuser',function(req, res, next){
    userServices.searchUserAdmin({"email":req.body.username}, function(err, result){
       if(err){
           res.status(403).json(result);
       } else{
           if(result.code == 201){
               res.status(201).json(result);
           }
           else{
               res.status(401).json(result);
           }
       }
    });

});

router.post('/updateuserdetails', function(req,res,next){
   var userinfo = {};
   userinfo.email = req.body.email;
    userinfo.first_name = req.body.first_name;
    userinfo.last_name = req.body.last_name;
    userinfo.address = req.body.address;
    userinfo.city = req.body.city;
    userinfo.zip = req.body.zip;
    userinfo.state = req.body.state;
    userinfo.phone = req.body.phone;

    userServices.updateUserDetails(userinfo, function(err, result){
       if(err){
           res.status(401).json(result);
       } else{
           if(result.code == 201){
               res.status(201).json(result);
           }
       }
    });
});


router.post('/deleteuser', function(req,res,next){
    req.checkBody('email','Please provide email of the user to be deleted').notEmpty();
    req.checkBody('email','Please enter a valid email id.').isEmail();
    let errors = req.validationErrors();
    if(errors){
        res.status(401).json({errors:errors});
    }else {
        userServices.deleteUser({email: req.body.email}, function (err, result) {
            if (err) {
                res.status(401).json(result);
            } else {
                res.status(201).json(result);
            }
        });
    }
});


router.post('/getuserdetails', function(req, res, next){
    req.checkBody('email','Please provide email of the user to be deleted').notEmpty();
    req.checkBody('email','Please enter a valid email id.').isEmail();
    let errors = req.validationErrors();
    if(errors){
        res.status(401).json({errors:errors});
    }else{
        userServices.getUserDetails({email:req.body.email}, function(err, result){
           if(err){
               res.status(401).json(result);
           }else{
               console.log(result);
               res.status(201).json(result);
           }
        });
    }
});

router.post('/getcarddetails',function(req, res, next){
   userServices. getCardDetails({email:req.body.email}, function(err, req){
       if(err){
           res.status(401).json(result);
       }
       else{
           res.status(result.code).json(result);
       }
   });
});

router.post('/getusercarddetails', function(req, res, next){
    userServices.getUserCardDetails({email: req.body.email}, function(err, result){
       if(err){
           res.status(401).json(result);
       } else{
           res.status(result.code).json(result);
       }
    });
});

router.post('/getuserhistorycars', function(req, res, next){
   userServices.getuserhistoryCars({email:req.body.email}, function(err, result){
      if(err){
          res.status(401).json(result);
      } else{
          res.status(result.code).json(result);
      }
   });
});

router.post('/getuserhistoryflights',function(req, res, next){
   userServices.getuserhistoryFlights({email:req.body.email}, function(err, result){
      if(err){
          res.status(401).json(result);
      } else{
          res.status(result.code).json(result);
      }
   });
});

router.post('/getuserhistoryhotels',function(req, res, next){
    userServices.getuserhistoryHotels({email:req.body.email}, function(err, result){
       if(err){
           res.status(401).json(result);
       } else{
           res.status(result.code).json(result);
       }
    });
});

router.post('/edituserdetails',function(req, res, next) {
    let userinfo = {};
    userinfo.email = req.body.email;
    userinfo.first_name = req.body.first_name;
    userinfo.last_name = req.body.last_name;
    userinfo.address = req.body.address;
    userinfo.city = req.body.city;
    userinfo.state = req.body.state;
    userinfo.zip = req.body.zip;
    userinfo.phone = req.body.phone;
    userServices.edituserdetails(userinfo,function(err, result){
        if(err){
            res.status(401).json(result);
        }else{
            console.log(result);
            res.status(202).json(result);
        }
    });
});

router.post('/addcarddetails',function(req, res, next) {
    let cardinfo = {};
    cardinfo.email = req.body.email;
    cardinfo.name_on_card = req.body.name_on_card;
    cardinfo.card_number = req.body.card_number;
    cardinfo.card_type = req.body.card_type;
    cardinfo.address=req.body.address;
    cardinfo.city = req.body.city;
    cardinfo.state = req.body.state;
    cardinfo.zip = req.body.zip;
    userServices.addcarddetails(cardinfo,function(err, result){
       if(err){
            res.status(401).json(result);
       }else{
           res.status(result.code).json(result);
       }

    });
});

router.post('/editcarddetails',function(req, res, next) {
    let cardinfo = {};
    cardinfo.email = req.body.email;
    cardinfo.name_on_card = req.body.name_on_card;
    cardinfo.card_number = req.body.card_number;
    cardinfo.card_type = req.body.card_type;
    cardinfo.address = req.body.address;
    cardinfo.city = req.body.city;
    cardinfo.state = req.body.state;
    cardinfo.zip = req.body.zip;
    userServices.editcarddetails(cardinfo, function(err, result){
        if(err){
            res.status(401).json(result);
        }else{
            res.status(result.code).json(result);
        }
    });
});


router.post('/deleteuseraccount',function(req, res, next){
    var email = (req.body.user_id).toLowerCase();
    userServices.deleteuser({"email" : email }, function(err,result){
        if(err){
            res.status(401).json(result);
        }
        else{
            console.log("its result in user routes"+result);
            res.status(201).json(result);
        }
    });
});

module.exports = router;
