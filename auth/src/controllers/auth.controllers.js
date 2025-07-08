import User from "../models/auth.models.js";

const registerUser = async (req, res) => {
  const { email, name, password } = req.body;

  if (!name || !email || !password) {
    return res.status(401).json({
      message: "All fields are required",
      success: false,
    });
  }

  try {
    const allreadyRegisteredUser = await User.findOne({ email });

    if (allreadyRegisteredUser) {
      return res.status(400).json({
        message: "User allready Registered",
        success: false,
      });
    }

    const user = User.create({
      name,
      email,
      password,
    });
    
  } catch (error) {
    console.log("Internel server error :- ", error.message);
    return res.status(500).json({
      message: "Internel server error",
      success: false,
      error: error.message,
    });
  }
};

export { registerUser };
