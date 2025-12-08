const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const User = require("./models/User");
const authRoutes = require("./routes/authRoutes");
const { verifyToken } = require("./middleware/authMiddleware");
const tableRoutes = require("./routes/tableRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const preBookingRoutes = require("./routes/preBookingRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const menuItemRoutes = require("./routes/menuItemRoutes");
const orderRoutes = require("./routes/orderRoutes");
const billRoutes = require("./routes/billRoutes"); 

connectDB();//establish mongodb connection 

const app = express();
app.use(cors()); // for cross origin 
app.use(express.json());// to parse json
 
app.use("/api/auth", authRoutes); // Login and Register Routes
app.use("/api/tables", tableRoutes);//Table Details
app.use("/api/bookings", bookingRoutes);// Booking Details
app.use("/api/prebookings", preBookingRoutes);// PreBooking Details
 
app.use("/api/categories", categoryRoutes);// Handles Catagories
app.use("/api/menu-items", menuItemRoutes);//Menu Details
app.use("/api/orders", orderRoutes);//Handles Orders
app.use("/api/bills", billRoutes);// Handles bills 

  //default route
  app.get("/", (req, res) => {
    

    res.send("Restaurant Booking API is running...");
  });
  
  app.get("/getuser", async (req,res)=>  {
    try{
      const users = await User.find() ;
      res.json(users) ; 
    }catch(e){
      res.status(500).json({ message: "Error in Fetching Users", error: e.message });
    }
      
  } );



// Protected Route
  app.get("/api/protected", verifyToken, (req, res) => {
    res.json({
      message: "You have accessed a protected route",
      user: req.user
    });
  });


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
