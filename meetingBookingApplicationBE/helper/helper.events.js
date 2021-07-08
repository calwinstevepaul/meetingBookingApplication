const { Events, validateEvents } = require('../models/events');

module.exports.isDataValid = (data)=>{
    let newEventStartTime = new Date(data.timeRange[0]).getTime();
    let newEventEndTime = new Date(data.timeRange[1]).getTime();
    let currentDate = new Date().getTime();

    let isValid = true;
    if((newEventStartTime >= newEventEndTime) || (currentDate > newEventStartTime) || (currentDate > newEventEndTime)){
        isValid = false;
    }

    return isValid
}

module.exports.isSlotFree = async(data)=>{
    //* Getting all events on that day on event 
    let eventsArr = await Events.find({date:data.date, isActive:true})

    //* start and end time of the event to be added
    let newEventStartTime = new Date(data.timeRange[0]).getTime();
    let newEventEndTime = new Date(data.timeRange[1]).getTime();

    //* looping all old events and finding if the slot is free or not
    let isFree = true;
    if(!eventsArr.length == 0){
        eventsArr.map((ele)=>{
            let startTime = new Date(ele.timeRange[0]).getTime();
            let endTime = new Date(ele.timeRange[1]).getTime();
            console.log(startTime,endTime)
            
            //* checking that the new time range affectes any of the booked events
            if( 
                (
                    (newEventStartTime >= startTime && newEventStartTime <= endTime) || 
                    (newEventEndTime >= startTime && newEventEndTime <= endTime) || 
                    ((newEventStartTime <= startTime) && (endTime <= newEventEndTime)) 
                ) &&
                (
                    ele.isActive === true   
                )
            ){
                isFree = false
            }

            if(data._id && (JSON.stringify(data._id) === JSON.stringify(ele._id))){
                isFree = true
            }
        })
    }    
    return(isFree)
}

module.exports.formateDate = (startDate, endDate)=>{
    let dateFormated =`${(new Date(startDate)).getDate()}/${(new Date(startDate)).getUTCMonth()}/${(new Date(startDate)).getFullYear()}`;
    let startTimeFormated = `${(new Date(startDate)).getUTCHours()}:${(new Date(startDate)).getUTCMinutes()}`;
    let endTimeFormated = `${(new Date(endDate)).getUTCHours()}:${(new Date(endDate)).getUTCMinutes()}`;
    
    return {dateFormated, startTimeFormated, endTimeFormated}
}