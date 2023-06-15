var express = require('express');
var router = express.Router();
var productHelpers = require('../helpers/product-helpers')
var userHelpers = require('../helpers/user-helpers')
const verifyLogin = (req,res,next) => {
  if(req.session.logedIn){
    next()
  }
  else{
    res.redirect('/login')
  }
}
/* GET home page. */
router.get('/',async function(req, res, next) {
  
  let user = req.session.user;
  let productCount = null
  if(user) {
    productCount =await productHelpers.getProductCount(user._id)
  }
  productHelpers.viewAllProducts().then((products) => {
    res.render('users/view-products',{products,user,productCount})
  })

});

router.get('/login',(req,res) => {
  if(req.session.logedIn){
    res.redirect('/')
  }
  else{
    res.render('users/login',{'loginErr':req.session.loginErr})
    req.session.loginErr = false
  }
})

router.get('/signup',(req,res) => {
  res.render('users/signup')
})

router.post('/signup',(req,res) => {
  userHelpers.doSignUp(req.body).then((responce) => {
    req.session.loggedIn = true
    req.session.user = responce
    res.redirect('/')
  })
})

router.post('/login',(req,res) => {
  userHelpers.doLogin(req.body).then((responce) => {
    if(responce.status) {
      req.session.logedIn = true;
      req.session.user = responce.user
      res.redirect('/')
    }
    else{
      req.session.loginErr = 'Invalid Username or Password';
      res.redirect('/login')
    }
  })
})

router.get('/logout',(req,res) => {
  req.session.destroy();
  res.redirect('/')
})

router.get('/cart',verifyLogin,async(req,res) => {
  let products =await userHelpers.getCartProducts(req.session.user._id)
  res.render('users/cart',{products,user:req.session.user})
})

router.get('/add-to-cart/:id',verifyLogin,(req,res) => {
  userHelpers.addToCart(req.params.id,req.session.user._id).then(()=> {
    res.redirect('/')
  })
})

module.exports = router;
