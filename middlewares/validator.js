const { body } = require('express-validator');
const path = require('path');
const bcrypt = require('bcryptjs');
const db = require('../database/models/index.js')
const sequelize = db.sequelize;
const User = db.User;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


module.exports = {
   register: [
      body('name').notEmpty().withMessage('Este campo es obligatorio'),
      body('surname').notEmpty().withMessage('Este campo es obligatorio'),      
      body('email')
            .notEmpty().withMessage('este campo es obligatorio').bail()
            .isEmail().withMessage('debes colocar un email valido').bail()
            .custom(value => {
                return User.findOne({
                    where:{
                        email: value
                    }
                })
                .then(function(resultado){
                    if(resultado){
                        return Promise.reject('email en uso')
                    }
                })
            }),   
      
      body('password')
         .notEmpty().withMessage('Este campo es obligatorio').bail()
         .isLength({min: 8}).withMessage('La contraseña debe tener por lo menos 8 caracteres').bail()
         .custom((value, { req }) => req.body.password == req.body.passwordR).withMessage('Las passwords no coinciden'),
      body('passwordR')
         .notEmpty().withMessage('Este campo es obligatorio')
   ],
   login: [
      body('emaillogin')
            .notEmpty().withMessage('este campo es obligatorio').bail()
            .isEmail().withMessage('debes colocar un email valido').bail()
            .custom((value, {req}) => {
                return User.findOne({
                    where:{
                        email : value
                    }
                })
                .then(function(resultado){
                    if(resultado){
                        if(!bcrypt.compareSync(req.body.passwordlogin, resultado.password)){
                            return Promise.reject('la contraseña o el email no coinciden')
                        }
                    }else{
                        return Promise.reject('la contraseña o el email no coinciden')
                    }
                })
            }),   
   ]
}