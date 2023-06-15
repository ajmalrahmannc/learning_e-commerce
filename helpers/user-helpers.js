var db = require('../config/connection')
var collection = require('../config/collections')
const bcrypt = require('bcrypt')
var objectId = require('mongodb').ObjectId

module.exports = {
    doSignUp : (userData) => {
        return new Promise(async(resolve,reject) => {
            userData.Password =await bcrypt.hash(userData.Password,10)
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data) => {
                resolve(data.ops[0])
            })
        })
    },
    doLogin : (userData) => {
        return new Promise (async (resolve,reject) => {
            let loginStatus = false ;
            let responce = {}
            console.log("Email",userData);
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({Email : userData.Email})

            if(user) {
                bcrypt.compare(userData.Password,user.Password).then((status) => {
                    if(status){
                        console.log('Login Sucess');
                        responce.user = user;
                        responce.status = true
                        resolve(responce)
                    }
                    else {
                        console.log('Incorrect Password');
                        resolve({status:false})
                    }
                })
            }
            else{
                console.log('Invalid User');
                resolve({status:false})
            }
        })
    },
    addToCart: (prodId,userId) => {
        return new Promise (async(resolve,reject) => {
            let userCart =await db.get().collection(collection.CART_COLLECTION).findOne({user:objectId(userId)})

            if(userCart) {
                db.get().collection(collection.CART_COLLECTION).updateOne({user:objectId(userId)},{
                    $push:{products:objectId(prodId)}
                }).then((responce) => {
                    resolve(responce)
                })
            }
            else{
                let cartObj = {
                    user:objectId(userId),
                    products:[objectId(prodId)]
                }
                db.get().collection(collection.CART_COLLECTION).insertOne(cartObj).then((responce) => {
                    resolve(responce)
                })
            }
        })
    },
    getCartProducts:(userId) => {
        return new Promise(async(resolve,reject) => {
            let cartItems = await db.get().collection(collection.CART_COLLECTION).aggregate([
                {
                    $match:{user:objectId(userId)}
                },
                {
                    $lookup:{
                        from:collection.PRODUCT_COLLECTION,
                        let : {prodList:'$products'},
                        pipeline:[
                            {
                                $match:{
                                    $expr:{
                                        $in:['$_id','$$prodList']
                                    }
                                }
                            }
                        ],
                        as:'cartItems'
                    }
                }
            ]).toArray()
            resolve(cartItems[0].cartItems)
        })
    }
}