const router = require('express').Router();
const Cart = require('../models/Cart');
const {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin} = require('./verifyToken');


//Create Cart
router.post('/', verifyToken, async (req, res) => {
    const newCart = new Cart(req.body);
    try {
        const savedCart = await newCart.save();
        res.status(200).json(savedCart);
    } catch (error) {
        res.status(500).json(error);
    }
})

//Update Cart
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const updatedCart = await Cart.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new: true});
        res.status(200).json(updatedCart);
    } catch (error) {
        res.status(500).json(error);
    }
})

//Find User Cart
router.get("/find/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
      const cart = await Cart.findOne({ userId: req.params.id });
      res.status(200).json(cart);
    } catch (err) {
      res.status(500).json(err);
    }
  });

//Get All Carts
router.get('/', verifyTokenAndAdmin, async (req, res) => {
    try {
        const carts = await Cart.find();
        res.status(200).json(carts);
    } catch (error) {
        res.status(500).json(error);
    }
})

//Delete Cart
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json('Product has been deleted');
    } catch (error) {
        res.status(500).json(error);
    }
}) 



module.exports = router;