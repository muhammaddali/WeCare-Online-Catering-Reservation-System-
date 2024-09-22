import mongoose from "mongoose";

const connectDatabase = () => {
  mongoose
    .connect(
      "mongodb+srv://Whiz:CMFFbiaQkqZQ9hMg@cluster0.8xws3ua.mongodb.net/WhizBang?retryWrites=true&w=majority&appName=Cluster0",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )
    .then((data) => {
      console.log(`mongod connected with server: ${data.connection.host}`);
    });
};

export default connectDatabase;
