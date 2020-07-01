const bcrypt = require("bcryptjs")
const { validationResult } = require('express-validator');
const db = require('../database/models/index.js')
const sequelize = db.sequelize;
const User = db.User;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const userController = {
    login: function(req, res){
        res.render('user/login')
    },
    processLogin: function(req,res){
        const errors = validationResult(req);
        if(errors.isEmpty()){
            
            User.findOne({
                where: {
                    email: req.body.emaillogin
                }
            })
                .then(function(usuario){
                    let u = usuario;
                    delete u.password;
                    req.session.user = u;
                    if(req.body.remember != undefined ){
                        res.cookie('user', u.email, {maxAge: 1000*60*60});
                    }
                    return res.redirect('/');
                })
        }else{
            return res.render('user/login', { errors: errors.mapped(), oldS: req.body })
        }
  
    },

    processRegister: function(req,res) {
        
      const errors = validationResult(req);
      
      //return res.send(errors)

      if(errors.isEmpty()){
        
         let user = req.body;
         delete user.passwordR
         user.password = bcrypt.hashSync(user.password, 10);
         user.rol = 0;
         user.avatar = 'avatarDefault.jpg';

         //return res.send(usuario);

         User.create(user)
            .then(function(usuario){
                let u = usuario;
                    delete u.name;
                    delete u.surname;
                    delete u.password;
                    delete u.passwordR;
                    req.session.user = u;
                res.redirect('/');
            })  
        }else{
           return res.render('user/login', { errors: errors.mapped(), old: req.body}) 
        }
        
    },
    profile: function(req, res){
        return res.render('user/profile');
    },
    processProfile: (req,res)=>{
        
        let update = {
            name: req.body.name,
            surname: req.body.surname,
            description: req.body.description
        }

        if(req.files[0] != undefined){
            update.avatar = req.files[0].filename
        }
        
         User.update(update, {
            where:{
                email: req.body.email
            }
        })
        .then(function(resultado){
            return User.findOne({
                where:{
                    email: req.body.email
                }
            })
            
        })
        .then((e)=>{
            req.session.user = e
            return res.redirect("/user/profile")
        })
    }

}


module.exports = userController;