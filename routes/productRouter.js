const express = require("express");
const router = express.Router();
const path = require("path");
const productController = require("../controllers/productController"); 
const validate = require ("../middlewares/validator");
const adminMiddleware = require('../middlewares/adminMiddleware')
const authMiddleware = require('../middlewares/authMiddleware')


// GUARDAR ARCHIVOS CON MULTER 
const multer = require("multer")

  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(__dirname, '../public/images/products'))
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
  })

  var upload = multer({
    storage: storage,

    // Validate image
    fileFilter: (req, file, cb) => {

      const acceptedExtensions = ['.jpg', '.jpeg', '.png'];

      const ext = path.extname(file.originalname);

      if (!acceptedExtensions.includes(ext)) {
        req.file = file;
      }

      cb(null, acceptedExtensions.includes(ext));
    }
  });

  

  // RUTAS
  
 
  router.get('/create',authMiddleware ,adminMiddleware, productController.create);
  router.post('/create', upload.single('image'),validate.createProduct,productController.processCreate);
  router.get("/:id", productController.vista);
  router.post("/search",productController.search);
  router.put("/:id/edit",upload.any(),productController.edit);
  router.delete("/:id/delete",productController.delete);

  router.post('/add', productController.addCart);
  
module.exports = router;