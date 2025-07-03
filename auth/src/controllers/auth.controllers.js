const registerUser = (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(401).json({
      message: "All fields are required",
      success: false,
    });
  }

  res.status(201).json({
    message: "Register Successfully",
    user: {
      name,
      email,
    },
    success: true,
  });
};

export { registerUser };
