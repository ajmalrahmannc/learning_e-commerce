var db = require('../config/connection')
var collection = require('../config/collections')
var objectId = require('mongodb').ObjectId

module.exports = {
    addProduct:(product,callback)=>{
        db.get().collection('product').insertOne(product).then((data) => {
            callback(data.ops[0]._id)
        })
    },
    viewAllProducts:()=> {
        return new Promise(async(res,rej) => {
            let products = await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
            res(products)
        })
    },
    deleteProduct:(productId) => {
        return new Promise((resolve,reject) => {
            console.log(productId);
            db.get().collection(collection.PRODUCT_COLLECTION).removeOne({_id:objectId(productId)}).then((response) => {
                resolve(response)
            })
        })
    },
    getProductDetails : (productId) => {
        return new Promise((resolve,reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:objectId(productId)}).then((product) => {
                resolve(product)
            })
        })
    },
    updateProductDetails : (productId,ProductDetails) => {
        return new Promise((resolve,reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id:objectId(productId)},{
                $set:{
                    name : ProductDetails.name,
                    description: ProductDetails.description,
                    price : ProductDetails.price,
                    category : ProductDetails.category
                }
            }).then((responce) => {
                resolve()
            })
        })
    },
    getProductCount : (userId) => {
        return new Promise(async(resolve,reject) => {
            let count = 0
            let userCart =await db.get().collection(collection.CART_COLLECTION).findOne({user:objectId(userId)})
            if(userCart){
                count = userCart.products.length
            }
            resolve(count)
        })
    }
}