import jwt from "jsonwebtoken";

const isLoggedIn = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({
        message: "User not loggedIn",
        success: false,
      });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedToken) {
      return res.status(401).json({
        message: "User not loggedIn",
        success: false,
      });
    }

    console.log(`Decoded Email :- ${decodedToken.email}`);
    console.log(`Decoded _id   :- ${decodedToken._id}`);

    req.user = decodedToken;

    next();
  } catch (error) {
    console.log("Internel server error :- ", error.message);

    return res.status(500).json({
      message: "Internel server error",
      success: false,
      error: error.message,
    });
  }
};

export default isLoggedIn;
