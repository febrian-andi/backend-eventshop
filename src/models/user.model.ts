import mongoose from "mongoose";
import { encrypt } from "../utils/encryption";
import { sendMail, renderMailHtml } from '../utils/mail/mail';
import { CLIENT_HOST, EMAIL_BREVO } from "../utils/env";

export interface User {
    fullName: string;
    userName: string;
    email: string;
    password: string;
    role: string;
    profilePicture: string;
    isActive: boolean;
    activationCode: string;
    createdAt?: String;
};

const Schema = mongoose.Schema;

const UserSchema = new Schema<User>({
    fullName: {
        type: Schema.Types.String,
        required: true,
    },
    userName: {
        type: Schema.Types.String,
        required: true,
        unique: true,
    },
    email: {
        type: Schema.Types.String,
        required: true,
        unique: true,
    },
    password: {
        type: Schema.Types.String,
        required: true,
    },
    role: {
        type: Schema.Types.String,
        enum: ["admin", "user"],
        default: "user",
    },
    profilePicture: {
        type: Schema.Types.String,
        default: "userProfileDefault.jpg",
    },
    isActive: {
        type: Schema.Types.Boolean,
        default: false,
    },
    activationCode: {
        type: Schema.Types.String,
    },
}, { timestamps: true });

UserSchema.pre("save", function (next) {
    const user = this;
    user.password = encrypt(user.password);
    user.activationCode = encrypt(user.id);
    next();
});

UserSchema.post("save", async function (doc, next) {
  try {
    const user = doc;
    const contentMail = await renderMailHtml("registration-success.ejs", {
      userName: user.userName,
      fullName: user.fullName,
      email: user.email,
      createdAt: user.createdAt,
      activationLink: `${CLIENT_HOST}/auth/activation?code=${user.activationCode}`,
    });
    await sendMail({
      from: `"FAN - Event Shop" <${EMAIL_BREVO}>`,
      to: user.email,
      subject: "Aktivasi Akun Anda",
      html: contentMail as string,
    });
  } catch (error) {
    console.log(error);
  } finally {
    next();
  }
});

UserSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    return user;
};

const UserModel = mongoose.model("User", UserSchema);


export default UserModel;