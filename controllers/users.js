const jwt = require("jsonwebtoken");
require("dotenv").config();
const Users = require("../model/users");
const { HttpCode } = require("../helpers/constants");
const UploadAvatar = require("../services/upload-avatars-local");
const EmailService = require("../services/email");
const {
  CreateSenderNodemailer,
  CreateSenderSendgrid,
} = require("../services/sender-email");
const AVATARS_OF_USERS = process.env.AVATARS_OF_USERS;

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const reg = async (req, res, next) => {
  try {
    const user = await Users.findByEmail(req.body.email);
    if (user) {
      return res.status(HttpCode.CONFLICT).json({
        status: "Conflict",
        code: HttpCode.CONFLICT,
        message: "Email in use",
      });
    }

    const newUser = await Users.create(req.body);
    const { verifyToken, email, name } = newUser;
    // TODO: send email
    try {
      const emailService = new EmailService(
        process.env.NODE_ENV,
        new CreateSenderSendgrid() //CreateSenderSendgrid
      );
      await emailService.sendVerifyPasswordEmail(verifyToken, email, name);
    } catch (e) {
      console.log(e.message);
    }
    return res.status(HttpCode.CREATED).json({
      status: "Created",
      code: HttpCode.CREATED,
      ResponseBody: {
        user: {
          email: newUser.email,
          subscription: newUser.subscription,
          avatar: newUser.avatarURL,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findByEmail(email);
    const isValidPassword = await user?.validPassword(password);

    if (!user || !isValidPassword) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: "Unauthorized",
        code: HttpCode.UNAUTHORIZED,
        message: "Email or password is wrong",
      });
    }
    if (!user.verify) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: "error",
        code: HttpCode.UNAUTHORIZED,
        message: "Check email for verification",
      });
    }

    const payload = { id: user.id };
    const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: "1d" });
    await Users.updateToken(user.id, token);

    return res.status(HttpCode.OK).json({
      status: "success",
      code: HttpCode.OK,
      ResponseBody: {
        token,
        user: {
          email: user.email,
          subscription: user.subscription,
        },
      },
    });
  } catch (e) {
    next(e);
  }
};

const logout = async (req, res, next) => {
  await Users.updateToken(req.user.id, null);
  return res.status(HttpCode.NO_CONTENT).json({});
};

const avatars = async (req, res, next) => {
  try {
    const id = req.user.id;
    const uploads = new UploadAvatar(AVATARS_OF_USERS);
    const avatarUrl = await uploads.saveAvatarToStatic({
      idUser: id,
      pathFile: req.file.path,
      name: req.file.filename,
      oldFile: req.user.avatarURL,
    });

    await Users.updateAvatar(id, avatarUrl);
    return res.json({
      status: "success",
      code: HttpCode.OK,
      ResponseBody: { avatarUrl },
    });
  } catch (error) {
    next(error);
  }
};

const verify = async (req, res, next) => {
  try {
    const user = await Users.getUserByVerifyToken(req.params.token);
    if (user) {
      await Users.updateVerifyToken(user.id, true, null);
      return res.status(HttpCode.OK).json({
        status: "success",
        code: HttpCode.OK,
        message: "Verification successful!",
      });
    }
    return res.status(HttpCode.NOT_FOUND).json({
      status: "error",
      code: HttpCode.NOT_FOUND,
      message: "User not found with verification token",
    });
  } catch (error) {
    next(error);
  }
};
const repeatSendEmailVerify = async (req, res, next) => {
  const user = await Users.findByEmail(req.body.email);

  if (user) {
    const { name, email, verifyToken, verify } = user;
    console.log(
      "🚀 ~ file: users.js ~ line 146 ~ repeatSendEmailVerify ~ user",
      user
    );
    if (!verify) {
      try {
        const emailService = new EmailService(
          process.env.NODE_ENV,
          new CreateSenderSendgrid()
        );

        await emailService.sendVerifyPasswordEmail(verifyToken, email, name);

        return res.status(200).json({
          status: "success",
          code: 200,
          message: "Verification email resubmited!",
        });
      } catch (e) {
        console.log(e.message);
        return next(e);
      }
    }
    return res.status(HttpCode.CONFLICT).json({
      status: "error",
      code: HttpCode.CONFLICT,
      message: "Email has already been verified",
    });
  }
  return res.status(HttpCode.NOT_FOUND).json({
    status: "error",
    code: HttpCode.NOT_FOUND,
    message: "User not found",
  });
};

module.exports = {
  reg,
  login,
  logout,
  avatars,
  verify,
  repeatSendEmailVerify,
};
