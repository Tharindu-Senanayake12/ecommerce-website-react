import mongoose from "mongoose";
import productModel from "./path_to_productModel.js"; // Adjust the path

const updateBestSellerField = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/your_database_name", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await productModel.updateMany(
      { bestSeller: { $exists: false } },
      { $set: { bestSeller: false } }
    );

    console.log("Added bestSeller field to all products.");
    mongoose.connection.close();
  } catch (error) {
    console.error("Error updating products:", error);
  }
};

updateBestSellerField();
