// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const submissionRoutes = require('./routes/submissionRoutes');

// const app = express();

// app.use(cors());
// app.use(express.json());

// // MongoDB connection
// // mongoose.connect(process.env.MONGO_URI)
// //     .then(() => console.log('MongoDB Connected'))
// //     .catch(err => console.error(err));





// // Use submission routes
// app.use('/api/submissions', submissionRoutes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));




require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const submissionRoutes = require('./routes/submissionRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
// mongoose.connect(process.env.MONGO_URI)
//     .then(() => console.log('MongoDB Connected'))
//     .catch(err => console.error(err));




let isConnection = false;
async function connectToMongoDB(){
    try{
        await mongoose.connect(process.env.MONGO_URI,{
                userNewUrlParser:true,
                useUnifiedTopology:true
        });
        isConnection=true;
        console.log('Connected to MongoDB');
    } catch(error){
        console.error('Error connecting to MongoDB:',error);
    }
}

app.use((req,res,next)=>{
    if(!isConnection){
        connectToMongoDB();
    }
    next();
})


// Use submission routes
app.use('/api/submissions', submissionRoutes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports=app