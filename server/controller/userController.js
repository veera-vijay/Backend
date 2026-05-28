const User = require("../models/user");
const Book = require("../models/createbook");
const Std = require("../models/Createstdform");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/jwt"); // ← ADD THIS LINE
const { sendOTP, generateOTP } = require("../service/Emailservice");
const {
  sendForgotPasswordOTP,
  generateForgotPasswordOTP,
} = require("../service/Emailservice");


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
    res.status(201).json({
      success: true,
      message: "Successfully created",
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


// ========== LOGIN - SEND OTP ==========
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found! Please register first.",
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid password! Please try again",
      });
    }

    // Generate OTP (4-digit)
    const otp = generateOTP();

    
   
     console.log("OTP after function call:", otp); // Debug

     if (!otp) {
       console.log("❌ OTP is undefined!");
       return res.status(500).json({ message: "OTP generation failed" });
     }
    const expiresAt = new Date(Date.now() + 60 * 1000); // 1 minutes

    // Save OTP to user
    user.otpCode = otp;
    user.otpExpiresAt = expiresAt;
    await user.save();

    // Send OTP email
  await sendOTP(user.email, user.username, otp);

    res.status(200).json({
      success: true,
      message: "OTP sent to your email. Please verify to complete login.",
      requiresOTP: true,
      userId: user._id,
      email: user.email,
      role: user.role, 
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



const verifyOTP = async (req, res) => {
  try {
    const { userId, otpCode } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Check if OTP exists
    if (!user.otpCode) {
      return res.status(400).json({
        success: false,
        message: "No OTP found. Please login again."
      });
    }

    // Check if expired
    if (Date.now() > user.otpExpiresAt) {
      return res.status(400).json({
        success: false,
        message: "OTP expired. Please login again."
      });
    }
   

    // Check if OTP matches
    if (user.otpCode !== otpCode) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP. Please try again."
      });
    }
    

    // Clear OTP
    user.otpCode = null;
    user.otpExpiresAt = null;
    await user.save();

    // Generate JWT token
    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: "Login successful!",
      token: token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        age: user.age,
        gender: user.gender,
        role: user.role
      }
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

//  NEW FUNCTION: Resend OTP 
const resendOTP = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Generate new OTP
    const newOtp = generateOTP();
    const newExpiry = new Date(Date.now() +  60 * 1000);

    user.otpCode = newOtp;
    user.otpExpiresAt = newExpiry;
    await user.save();

    // Send new OTP
    await sendOTP(user.email, user.username, newOtp);

    //generate token 

     const token = generateToken(user);


    res.json({
      success: true,
      message: "New OTP sent to your email"
    });
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
//FORGOT PASSWORD
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ success: false, message: "Email not found" });
    }

    // Generate forgot  password OTP
    const otp = generateForgotPasswordOTP();  // 4-digit OTP
    const expiresAt = new Date(Date.now() + 30 * 1000);

    // Save to database
    user.forgotPasswordOtp = otp;
    user.forgotPasswordExpiry = expiresAt;
    await user.save();

    //  Send email using nodemailer 
    await sendForgotPasswordOTP(user.email, user.username, otp);

    res.json({ 
      success: true, 
      message: "OTP sent to your email" 
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ========== VERIFY FORGOT PASSWORD OTP ==========
const verifyForgotPasswordOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    if (!user.forgotPasswordOtp) {
      return res.status(400).json({ success: false, message: "No OTP found. Request a new one." });
    }
    
    if (user.forgotPasswordOtp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }
    
    if (Date.now() > user.forgotPasswordExpiry) {
      return res.status(400).json({ success: false, message: "OTP expired. Request a new one." });
    }
    
    res.json({ success: true, message: "OTP verified" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ========== RESET PASSWORD ==========
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    if (user.forgotPasswordOtp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }
    
    if (Date.now() > user.forgotPasswordExpiry) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.forgotPasswordOtp = null;
    user.forgotPasswordExpiry = null;
    await user.save();
    
    res.json({ success: true, message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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
  verifyOTP, 
  resendOTP,
  forgotPassword,
  verifyForgotPasswordOtp ,
  resetPassword,
  viewall,
  updateBook,
  deleteBook,
  createstd,
  viewallstd,
  updatestd,
  deletestd,
};
