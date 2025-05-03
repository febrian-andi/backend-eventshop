import { Request, Response } from "express";
import * as Yup from "yup";
import UserModel from "../models/user.model";
import { encrypt } from "../utils/encryption";
import { generateToken } from "../utils/jwt";
import { IReqUser } from "../middlewares/auth.middleware";

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
    .min(8, "Password must be at least 8 characters long"),
  confirmPassword: Yup.string()
    .required("Confirm password is required")
    .oneOf([Yup.ref("password"), ""], "Password not match"),
});

export default {
  async register(req: Request, res: Response) {
    /**
     #swagger.requestBody = {
       required: true,
       schema: {$ref: "#/components/schemas/RegisterRequest"}
     }
    */

    const { fullName, userName, email, password, confirmPassword } =
      req.body as unknown as TRegister;

    try {
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

      res.status(200).json({
        message: "Registration successful",
        data: result,
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({
        message: err.message,
        data: null,
      });
    }
  },

  async login(req: Request, res: Response) {
    /**
     #swagger.requestBody = {
       required: true,
       schema: {$ref: "#/components/schemas/LoginRequest"}
     }
    */
    const { identifier, password } = req.body as unknown as TLogin;

    try {
      const userByIdentifier = await UserModel.findOne({
        $or: [{ email: identifier }, { userName: identifier }],
      });

      if (!userByIdentifier) {
        throw new Error("User not found");
      }

      const validatePassword: boolean =
        encrypt(password) === userByIdentifier.password;

      if (!validatePassword) {
        throw new Error("User not found");
      }

      const token = generateToken({
        id: userByIdentifier._id,
        role: userByIdentifier.role,
      });

      res.status(200).json({
        message: "Login successful",
        data: token,
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({
        message: err.message,
        data: null,
      });
    }
  },

  async me(req: IReqUser, res: Response) {
    /**
     #swagger.security = [{
        "bearerAuth": []
     }]
    */
    try {
      const user = req.user;

      const result = await UserModel.findById(user?.id);

      if (!result) {
        throw new Error("User not found");
      }

      res.status(200).json({
        message: "Success get user profile",
        data: result,
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({
        message: err.message,
        data: null,
      });
    }
  },
};
