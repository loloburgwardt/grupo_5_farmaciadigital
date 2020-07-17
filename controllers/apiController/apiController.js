const db = require('../../database/models/index.js')
const sequelize = db.sequelize;
const Product = db.Product;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const {
    validationResult
} = require("express-validator");


const controlller = {
    products: function(req, res){
        Product.findAll({
            include: [
                {association: 'category'}
            ]
        })
        .then(function(products){
            let resultado = {
                meta: {
                    status: 200,
                    total: products.length,
                    url: '/api/products'
                },
                data: products
            };
           return res.json(resultado)
        })
    },
    users: function(req, res){
        db.User.findAll()
        .then(function(users){
            let resultado = {
                meta: {
                    status: 200,
                    total: users.length,
                    url: '/api/users'
                },
                data: users
            };
           return res.json(resultado)
        })
    },
    categories:function(req, res){
        db.Category.findAll()
        .then(function(cat){
            let resultado = {
                meta: {
                    status: 200,
                    total: cat.length,
                    url: '/api/categories'
                },
                data: cat
            };
           return res.json(resultado)
        })
    }

}



module.exports = controlller;