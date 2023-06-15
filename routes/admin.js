var express = require('express');
var router = express.Router();
var productHelpers = require('../helpers/product-helpers')

/* GET users listing. */
router.get('/', function(req, res, next) {

  productHelpers.viewAllProducts().then((products) => {
    console.log(products);
    res.render('admin/view-products',{admin:true,products })
  })
});

router.get('/add-product', function(req,res){
  res.render('admin/add-product',{admin:true})
})

router.post('/add-product',(req,res) => {
  productHelpers.addProduct(req.body,(id) => {
    let image = req.files.Image
    image.mv('./public/product-images/'+id+'.jpg',(err,done) => {
      if(!err){
        res.render('admin/add-product',{admin:true})
      }
      else{
        console.log('image issue',err);
      }
    })
  });
})

router.get('/delete-product/:id',(req,res) => {
  let proId = req.params.id;
  productHelpers.deleteProduct(proId).then((responce) => {
    res.redirect('/admin')
  })
})

router.get('/edit-product/:id',async(req,res) =>{
  let product =await productHelpers.getProductDetails(req.params.id)
  res.render('admin/edit-product',{admin:true,product})
})

router.post('/edit-product/:id',(req,res) => {
  productHelpers.updateProductDetails(req.params.id,req.body).then(() => {
    res.redirect('/admin')
  })
  let id = req.params.id;
  if(req.files.Image){
    req.files.Image.mv('./public/product-images/'+id+'.jpg')
  }
})

module.exports = router;
 