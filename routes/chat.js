const express = require('express'),
  router = express.Router(),
  io = require('socket.io'),
  Chat = require('../models/Chat')

router.get('/',async(req,res)=>{
  res.status(200).json({
    status: true,
    data: await Chat.find()
  })
})

router.post('/',async(req,res)=>{
  let {from,to,message} = req.body
  Chat.create({from,to,message},(err,chat)=>{
    if(chat){
      io.
      res.status(200).json({
        status: true,
        data: chat
      })
    }
  })
})

router.delete('/:id',(req,res)=>{
  let id = req.params.id
  Chat.findByIdAndDelete(id,(err,chat)=>{
    res.status(200).json({
      status: true,
      message: "success delete chat !",
      data: chat
    })
  })
})
  
module.exports = router