import { Request, Response } from "express";
import * as Yup from "yup";
import UserModel from "../models/user.model";
import { encrypt } from "../utils/encryption";
import { generateToken } from "../utils/jwt";
import { IReqUser } from "../utils/interfaces";
import response from "../utils/response";

type TRegister = {
  fullName: string;
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type TLogin = {
  identifier: string;
  password: string;
};

const registerValidationSchema = Yup.object({
  fullName: Yup.string().required("Full name is required"),
  userName: Yup.string()
    .required("User name is required")
    .min(3, "User name must be at least 3 characters long"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters long")
    .test(
      "has-letter",
      "Password must contain at least one letter",
      (value) => {
        if (!value) return false;
        const regex = /[a-zA-Z]/;
        return regex.test(value);
      }
    )
    .test(
      "has-number",
      "Password must contain at least one number",
      (value) => {
        if (!value) return false;
        const regex = /^(?=.*\d)/;
        return regex.test(value);
      }
    ),
  confirmPassword: Yup.string()
    .required("Confirm password is required")
    .oneOf([Yup.ref("password"), ""], "Password not match"),
});

export default {
  async register(req: Request, res: Response) {
    try {
      const { fullName, userName, email, password, confirmPassword } =
        req.body as unknown as TRegister;

      await registerValidationSchema.validate({
        fullName,
        userName,
        email,
        password,
        confirmPassword,
      });

      const existingUserName = await UserModel.findOne({ userName });
      if (existingUserName) {
        throw new Error("Username already exists");
      }

      const existingEmail = await UserModel.findOne({ email });
      if (existingEmail) {
        throw new Error("Email already exists");
      }

      const result = await UserModel.create({
        fullName,
        userName,
        email,
        password,
      });

      response.success(res, result, "User registered successfully");
    } catch (error) {
      const err = error as unknown as Error;
      response.error(res, err, "Registration failed");
    }
  },

  async login(req: Request, res: Response) {
    try {
      const { identifier, password } = req.body as unknown as TLogin;

      const userByIdentifier = await UserModel.findOne({
        $or: [{ email: identifier }, { userName: identifier }],
      });

      if (!userByIdentifier) {
        throw new Error("username, email or password is incorrect");
      }

      const validatePassword: boolean =
        encrypt(password) === userByIdentifier.password;

      if (!validatePassword) {
        throw new Error("username, email or password is incorrect");
      }

      if (!userByIdentifier.isActive) {
        throw new Error("User is not activated");
      }

      const token = generateToken({
        id: userByIdentifier._id,
        role: userByIdentifier.role,
      });

      response.success(res, token, "Login successful");
    } catch (error) {
      const err = error as unknown as Error;
      response.error(res, err, "Login failed");
    }
  },

  async me(req: IReqUser, res: Response) {
    try {
      const user = req.user;

      const result = await UserModel.findById(user?.id);

      if (!result) {
        throw new Error("User not found");
      }

      response.success(res, result, "User data retrieved successfully");
    } catch (error) {
      const err = error as unknown as Error;
      response.error(res, err, "Failed to retrieve user data");
    }
  },

  async activation(req: Request, res: Response) {
    try {
      const { code } = req.body as unknown as { code: string };
      const user = await UserModel.findOne({ activationCode: code });

      if (!user) {
        throw new Error("invalid activation code");
      }

      if (user.isActive) {
        throw new Error("User already activated");
      }

      const updatedUser = await UserModel.findOneAndUpdate(
        { _id: user._id },
        { isActive: true },
        { new: true }
      );

      response.success(res, updatedUser, "User activated successfully");
    } catch (error) {
      const err = error as unknown as Error;
      response.error(res, err, "Activation failed");
    }
  },
};
