const router = require('express').Router();
const Order = require('../models/Order');
const {verifyToken, verifyTokenAndAdmin} = require('./verifyToken');


//Create Order
router.post('/', verifyToken, async (req, res) => {
    const newOrder = new Order(req.body);
    try {
        const savedOrder = await newOrder.save();
        res.status(200).json(savedOrder);
    } catch (error) {
        res.status(500).json(error);
    }
})

//Update Order
router.put('/:id', verifyTokenAndAdmin, async (req, res) => {
    
    try {
        const updatedOrder= await Order.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new: true});
        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json(error);
    }
})

//Find USER ORDER
router.get('/find/:id', verifyToken, async (req, res) => {
    try {
        const orders = await Order.findOne({userId: req.params.id})
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json(error);
    }
})

//Get All Orders
router.get('/', verifyTokenAndAdmin, async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json(error);
    }
})

//Delete Order
router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json('Order has been deleted');
    } catch (error) {
        res.status(500).json(error);
    }
}) 

//Get MOnthly Income
router.get('/income', verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastmonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousmonth = new Date(new Date().setMonth(lastmonth.getMonth() - 1));

    try {
        const income = await Order.aggregate([
            {$match: {createdAt: {$gte: previousmonth}}},
            {$project: {
                month: {$month: "$createdAt"},
                sales: "$amount"
            }},
            {$group: {
                _id: "$month",
                total: {$sum: "$sales"}
            }}
        ])
        res.status(200).json(income);
    } catch (error) {
        res.status(500).json(error);
    }

})


module.exports = router;