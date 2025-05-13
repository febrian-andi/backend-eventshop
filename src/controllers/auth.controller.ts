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
    .min(8, "Password must be at least 8 characters long")
    .test(
      "uppercase",
      "Password must contain at least one uppercase letter",
      (value) => {
        if (!value) return false;
        const regex = /^(?=.*[A-Z])/;
        return regex.test(value);
      }
    )
    .test("number", "Password must contain at least one number", (value) => {
      if (!value) return false;
      const regex = /^(?=.*\d)/;
      return regex.test(value);
    }),
  confirmPassword: Yup.string()
    .required("Confirm password is required")
    .oneOf([Yup.ref("password"), ""], "Password not match"),
});

export default {
  async register(req: Request, res: Response) {
    /**
     #swagger.tags = ["Auth"]
     #swagger.requestBody = {
       required: true,
       schema: {$ref: "#/components/schemas/RegisterRequest"}
     }
    */
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
     #swagger.tags = ["Auth"]
     #swagger.requestBody = {
       required: true,
       schema: {$ref: "#/components/schemas/LoginRequest"}
     }
    */
    try {
      const { identifier, password } = req.body as unknown as TLogin;

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
     #swagger.tags = ["Auth"]
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

  async activation(req: Request, res: Response) {
    /**
     #swagger.tags = ["Auth"]
     #swagger.requestBody = {
       required: true,
       schema: {$ref: "#/components/schemas/ActivationRequest"}
     }
    */
    try {
      const { code } = req.body as unknown as { code: string };

      const user = await UserModel.findOneAndUpdate(
        {
          activationCode: code,
        },
        {
          isActive: true,
        },
        {
          new: true,
        }
      );
      res.status(200).json({
        message: "User activated successfully",
        data: user,
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
