import express from "express";
import connectDB from "../config/dbconnection";
import user from "./routes/user";
import product from "./routes/product";
import cart from "./routes/cart";
import order from "./routes/order";
import admin from "./routes/admin";
import flash from "express-flash";
import stripe from "./routes/stripe";
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const Emitter = require('events');
require("dotenv").config();

//db connection
connectDB();

app.set('view-engine', 'ejs');

app.use(cookieParser())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const eventEmitter = new Emitter();

app.set('eventEmitter',eventEmitter);
app.use(
    session({
      secret: process.env.PASS_SECRET,
      resave: true,
      saveUninitialized: true
    })
  );
app.use(flash());
app.use('/static', express.static('public'));
// app.use('/api/users', user);
// app.use('/api/products', product);
// app.use('/api/cart', cart);
// app.use('/api/order', order);
app.use('/', user);
app.use('/', product);
app.use('/', cart);
app.use('/', stripe);
app.use('/', order);
app.use('/', admin);

//start the server
const server = app.listen(process.env.PORT || 3000, () =>
    console.log(`server started on the port ${process.env.PORT || 3000}`)
);

const io = require('socket.io')(server);
io.on('connection',(socket: any) => {
  socket.on('join',(orderId: any) => {
    socket.join(orderId);
  });
}); 

eventEmitter.on('orderUpdated',(data:any) => {
  io.to(`order_${data.id}`).emit('orderUpdated',data);
});