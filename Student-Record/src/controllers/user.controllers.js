import User from "../models/user.models.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";

const registerUser = async (req, res) => {
  try {
    const { fullname, username, email, password } = req.body;

    if (
      [fullname, username, email, password].some(
        (element) => element?.trim() === ""
      )
    ) {
      throw new ApiError(400, "All fields are required");
    }

    const allreadyRegisterUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (allreadyRegisterUser)
      throw new ApiError(402, "This user allready register");

    


  } catch (error) {
    console.error("Internet server error :- ", error.message);
    throw new ApiError(500, "Internet server error", error.message);
  }
};
