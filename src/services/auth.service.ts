import bcrypt from "bcrypt";
import User from "../models/user.js";
import jwt from "jsonwebtoken";


export const registerUser = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const userExists = await User.findOne({ email });
  if (userExists) {
    const err: any = new Error("User already exists");
    err.status = 409;
    throw err;
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  return User.create({ email, password: hashedPassword });
};

export const loginUser = async ({ email, password }: { email: string; password: string }) => {
  const user = await User.findOne({ email }).select("+password");
  const isMatch = user ? await bcrypt.compare(password, user.password) : false;
  if (!user || !isMatch) {
    const err: any = new Error("Invalid email or password");
    err.status = 401;
    throw err;
  }

  if (!user.isActive) {                                  
    const err: any = new Error("Account is deactivated");
    err.status = 403;
    throw err;
  }

  return jwt.sign(
    { sub: user._id.toString(), role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "15m" },
  );
};
