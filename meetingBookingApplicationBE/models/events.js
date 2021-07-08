// let event = []

// module.exports.event = ()=>{
//     return event
// } 
const Joi = require('@hapi/joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const joiEvents = Joi.object({
    _id: Joi.string().meta({ _mongoose: { _id: "ObjectId", ref: "Events" } }),
    date: Joi.string().required(), 
    startTime: Joi.string().required(),
    endDate: Joi.string().required(),
    timeRange: Joi.array().items(Joi.date()).required(),
    isActive: Joi.boolean().required(),
    createdOn: Joi.date()
});

const validateEvents = async function (orderDetails) {
    return joiEvents.validate(JSON.parse(JSON.stringify(orderDetails)));
}

const mongooseEvents = new Schema({
    _id: { type: ObjectId, ref: 'Events' },
    date: String, 
    startTime: String,
    endDate: String,
    timeRange:[Date],
    isActive: Boolean,
    createdOn: Date,
});

const Events = mongoose.model("Events", mongooseEvents);

module.exports.validateEvents = validateEvents;
module.exports.Events = Events;