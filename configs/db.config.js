const mongoose = require('mongoose');
const MONGODB_URI = 'mongodb+srv://Aitor:Aitorgb9.@cluster0.p3vwi.mongodb.net/ironcook?retryWrites=true&w=majority'
//process.env.MONGODB_URI || 'mongodb://localhost/ironcook';

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => console.log(`Successfully connected to the database ${MONGODB_URI}`))
  .catch((error) => {
    console.error(`An error ocurred trying to connect to the database ${MONGODB_URI}: `, error);
    process.exit(1);
  });
