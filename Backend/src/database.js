import mongoose from 'mongoose';

mongoose.connect("mongodb://admin:cuandoteveatedigo@localhost:27017/tic3?authSource=admin")
    .then(db => console.log("Connected"))
    .catch(db => console.log("Error conection db"))
