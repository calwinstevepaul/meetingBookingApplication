const express = require('express');
const {getEvents, setEvents, updateEvents, deleteEvents} = require("../controller/controller.events")
var router = express.Router();


router.get('/',async(req,res)=>{
    try {
        let getEventsRes = await getEvents(req) 
        if(!getEventsRes.status) throw getEventsRes      
        
        res.status(200).send(getEventsRes.data)
        
    } catch (error) {
        console.log("error in get event router",error)
        
        if(!error.status && error.error){
            return res.status(error.errorcode).send(error.error)
        }
        return res.status(500).send("server error")
    }
})

router.post('/add',async(req,res)=>{
    try {
        let setEventsRes = await setEvents(req) 
        if(!setEventsRes.status) throw setEventsRes      
        
        res.status(200).send(setEventsRes.data)
        
    } catch (error) {
        console.log("error in add event router",error)
        
        if(!error.status && error.error){
            return res.status(error.errorcode).send(error.error)
        }
        return res.status(500).send("server error")
    }
})

router.put('/update',async(req,res)=>{
    try {
        let updateEventsRes = await updateEvents(req) 
        if(!updateEventsRes.status) throw updateEventsRes      
        
        res.status(200).send(updateEventsRes.data)
        
    } catch (error) {
        console.log("error in update event router",error)
        
        if(!error.status && error.error){
            return res.status(error.errorcode).send(error.error)
        }
        return res.status(500).send("server error")
    }
})

router.delete('/cancel',async(req,res)=>{
    try {
        let deleteEventsRes = await deleteEvents(req) 
        if(!deleteEventsRes.status) throw deleteEventsRes      
        
        res.status(200).send(deleteEventsRes.data)
        
    } catch (error) {
        console.log("error in delete event router",error)
        
        if(!error.status && error.error){
            return res.status(error.errorcode).send(error.error)
        }
        return res.status(500).send("server error")
    }
})

module.exports = router


