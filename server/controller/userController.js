const User = require("../models/user");
const Book = require("../models/createbook");
const Std = require("../models/Createstdform");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/jwt"); // ← ADD THIS LINE

// Register / Create User
const createUser = async (req, res) => {
  try {
    const { username, password, email, age, gender,role } = req.body;

      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        return res.status(400).json({
          success: false,
          message:
            "Username already taken! Please choose a different username.",
        });
      }

     const existingEmail = await User.findOne({ email });

     if (existingEmail) {
       return res.status(400).json({
         success: false,
         message:
           "Email already registered! Please use a different email or login.",
       });
     }

    const hashedPassword = await bcrypt.hash(password, 10);
    
 console.log("Received:", { username, email, age, gender, role });
    const user = await User.create({
      username,
      password: hashedPassword,
      email,
      age,
      gender,
      role: role || "student",
    });



      const token = generateToken(user);


    
    res.status(201).json({
      success: true,
      message: "Successfully created",
      token: token, // ← SEND TOKEN
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};




const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      console.log("3. User not found!");
      return res.status(404).json({
        success: false,
        message: "User not found! Please register first.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid password! Please try again",
      });
    }



     const token = generateToken(user);

     res.status(200).json({
       success: true,
       message: "Login successful!",
       token: token, // ← SEND TOKEN
       user: {
         id: user._id,
         username: user.username,
         email: user.email,
         age: user.age,
         gender: user.gender,
         role: user.role
       },
     });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed. Server error.",
      error: error.message,
    });
  }
};

// ========== BOOK CONTROLLERS ==========

// Create Book
const book = async (req, res) => {
  try {
    const { title, author, category, publishedYear } = req.body;
    const newBook = await Book.create({
      title,
      author,
      category,
      publishedYear,
    });
    res.status(201).json({
      success: true,
      message: "Book successfully created",
      data: newBook,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// View All Books
const viewall = async (req, res) => {
  try {
    const allbooks = await Book.find();
    res.status(200).json({
      success: true,
      count: allbooks.length,
      data: allbooks,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ========== UPDATE BOOK ==========
const updateBook = async (req, res) => {
  try {
    const { id } = req.params; // Get ID from URL
    const { title, author, category, publishedYear } = req.body; // Get data from body

    // Find book by ID and update
    const updatedBook = await Book.findByIdAndUpdate(
      id, 
      {
       
        title,
        author,
        category,
        publishedYear,
      },
    
    );

    // If book not found
    if (!updatedBook) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    // Success response
    res.status(200).json({
      success: true,
      message: "Book updated successfully",
      data: updatedBook,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ========== DELETE BOOK ==========
const deleteBook = async (req, res) => {
  try {
    const { id } = req.params; // Get ID from URL

    // Find book by ID and delete
    const deletedBook = await Book.findByIdAndDelete(id);

    // If book not found
    if (!deletedBook) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    // Success response
    res.status(200).json({
      success: true,
      message: "Book deleted successfully",
      data: deletedBook,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// create studen from

const createstd = async (req, res) => {
  try {
    let { name, course, email, age, gender } = req.body;

    const student = await Std.create({
      name,

      course,
      email,
      age,
      gender,
    });
    res.status(201).json({ message: "Successfully created" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

// View All Std
const viewallstd = async (req, res) => {
  try {
    const allstd = await Std.find();
    res.status(200).json({
      success: true,
      count: allstd.length,
      data: allstd,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
//update Std

const updatestd = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, course, email, age, gender } = req.body;

  
    let updateData = { name, course, email, age, gender };

  
    const updatedstd = await Std.findByIdAndUpdate(id, updateData, {
      new: true, // Return updated document
      runValidators: true, // Run schema validation
    });

    
    if (!updatedstd) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

   
    res.status(200).json({
      success: true,
      message: "Student updated successfully",
      data: updatedstd,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// DELETE STd
const deletestd = async (req, res) => {
  try {
    const { id } = req.params; // Get ID from URL

  
    const deletedstd = await Std.findByIdAndDelete(id);


    if (!deletedstd) {
      return res.status(404).json({
        success: false,
        message: "std not found",
      });
    }

    
    res.status(200).json({
      success: true,
      message: "std deleted successfully",
      data: deletedstd,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  createUser,
  login,
  book,
  viewall,
  updateBook,
  deleteBook,
  createstd,
  viewallstd,
  updatestd,
  deletestd,
};
