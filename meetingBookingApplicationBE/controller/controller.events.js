const mongoose = require('mongoose');
const { Events, validateEvents } = require('../models/events');

const { isSlotFree, formateDate, isDataValid } = require("../helper/helper.events")

module.exports.getEvents = async(req)=>{
    try {
        //* checking input
        let date = `"${req.query.date}"`

        console.log("date", typeof(req.query.date))
        console.log("date", new Date(req.query.date))

        if(!date) throw ({status:false, error:"event ID is Missing", errorcode:400});

        //*formating  date
        let dateFormated =`${(new Date(date)).getDate()}/${(new Date(date)).getUTCMonth()}/${(new Date(date)).getFullYear()}`;

        let eventsArr = await Events.find({date:dateFormated, isActive:true})

        return({status:true, data:eventsArr, errorcode:null})

        
    } catch (error) {
        console.log("error in get event controller",error);

        if(!error.status && error.error){
            return {status:false, error:error.error, errorcode:error.errorcode}
        }
        return{status:false, error:"server error", errorcode:500}
    }

}

module.exports.setEvents = async(req)=>{
    try {
        const {startDate, endDate} = req.body;
        
        //* Formating the date
        const formatedDate = formateDate(startDate, endDate);
        const {dateFormated, startTimeFormated, endTimeFormated} = formatedDate;
        
        //* Creating event 
        let eventObj = {
            _id: mongoose.Types.ObjectId(),
            date: dateFormated,
            startTime: startTimeFormated,
            endDate:endTimeFormated,
            timeRange:[startDate, endDate],
            isActive: true,
            createdOn:new Date()
        };

        //* input date validation
        const isDataValidRes = await isDataValid(eventObj);
        if(!isDataValidRes) throw({status:false, error:"Invalid start time and end time", errorcode:400});

        //* finding slot availability
        const isFreeRes = await isSlotFree(eventObj)
        if(!isFreeRes) throw({status:false, error:"This slot is booked", errorcode:400});

        //* schema Validation
        let { error } = await validateEvents(eventObj);
        if (error) throw ({status:false, error:error.message, errorcode:400});

        const setEvent = await Events.create(eventObj);
       

        return({status:true, data:setEvent, errorcode:null})

        
    } catch (error) {
        console.log("error in add event controller",error);

        if(!error.status && error.error){
            return {status:false, error:error.error, errorcode:error.errorcode}
        }
        return{status:false, error:"server error", errorcode:500}
    }
    
}

module.exports.updateEvents = async(req)=>{
    try {
        const {startDate, endDate, _id} = req.body;
        if(!_id) throw ({status:false, error:"event ID is Missing", errorcode:400});
            
        //* Formating the date
        const formatedDate = formateDate(startDate, endDate);
        const {dateFormated, startTimeFormated, endTimeFormated} = formatedDate;

        //* Finding the event 
        const getEvent = await Events.findOne({_id}).lean();
        if(!getEvent) throw({status:false, error:"no such event", errorcode:400})

        //*updating event
        let eventObj = {...getEvent};
        eventObj.date = dateFormated;
        eventObj.startTime = startTimeFormated;
        eventObj.endDate =endTimeFormated;
        eventObj.timeRange =[startDate, endDate];
        delete eventObj.__v
        
        //* if time is not changed thow error
        if(
            JSON.stringify(getEvent.timeRange[0]) === JSON.stringify(eventObj.timeRange[0]) &&
            JSON.stringify(getEvent.timeRange[1]) === JSON.stringify(eventObj.timeRange[1])
        ) throw({status:false, error:"Event time is same as before", errorcode:400})
        
        console.log(eventObj)
        //* input date validation
        const isDataValidRes = await isDataValid(eventObj);
        if(!isDataValidRes) throw({status:false, error:"Invalid start time and end time", errorcode:400});

        //* finding slot availability
        const isFreeRes = await isSlotFree(eventObj)
        if(!isFreeRes) throw({status:false, error:"This slot is booked", errorcode:400});

        //* schema Validation
        let { error } = await validateEvents(eventObj);
        if (error) throw ({status:false, error:error.message, errorcode:400});

        const updateEvent = await Events.findOneAndUpdate({_id},{$set:eventObj},{new:true});



        return({status:true, data:updateEvent, errorcode:null})

    } catch (error) {
        console.log("error in update event controller",error);

        if(!error.status && error.error){
            return {status:false, error:error.error, errorcode:error.errorcode}
        }
        return{status:false, error:"server error", errorcode:500}
    }

}

module.exports.deleteEvents = async(req)=>{
    try {
        let {_id} = req.body
        if(_id.length === 0) throw({status:false, error:"event ID is Missing", errorcode:400})

        const cancelEvents = await Events.updateMany({_id:{$in:_id}, isActive:true},{$set:{isActive:false}}).lean();
        if(cancelEvents.n === 0) throw({status:false, error:"no such event to update", errorcode:400})


        return({status:true, data:"All given events are cancelled", errorcode:null})

        
    } catch (error) {
        console.log("error in cancel event controller",error);

        if(!error.status && error.error){
            return {status:false, error:error.error, errorcode:error.errorcode}
        }
        return{status:false, error:"server error", errorcode:500}
    }
}