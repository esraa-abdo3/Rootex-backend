// const mongoose = require("mongoose");
// const mongoconnect = async () => {
//     try {
//         await mongoose.connect(process.env.DB_URI)
//         console.log(" MongoDB connected")
        
//     }
//     catch (err) {
//         console.log(" MongoDB connection error:", err)
        
//     }

// }
// module.exports=mongoconnect
const mongoose = require("mongoose");

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const mongoconnect = async () => {
  try {
    // لو في connection موجود — استخدمه مباشرة
    if (cached.conn) {
      console.log("MongoDB using cached connection");
      return cached.conn;
    }

    // لو مفيش — عمل connection جديد وخزنه
    if (!cached.promise) {
      cached.promise = mongoose.connect(process.env.DB_URI, {
        bufferCommands: false,
        maxPoolSize: 10,
      });
    }

    cached.conn = await cached.promise;
    console.log("MongoDB connected");
    return cached.conn;

  } catch (err) {
    cached.promise = null;
    console.log("MongoDB connection error:", err);
  }
};

module.exports = mongoconnect;
