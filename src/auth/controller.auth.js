const nodemailer = require("nodemailer");

const CustomRouter = require("../classes/CustomRouter");
const { hashPassword } = require("../utils/bcrypt.util");
const {
  generateToken,
  verifyToken,
  generateTokenForPassword,
} = require("../utils/jwt.util");
const passportCall = require("../utils/passportCall.util");

const UserDao = require("../dao/mongoDb/Users.dao");
const { emailUser, emailPass } = require("../config/nodemailer.config");
const { frontEndUrl } = require("../config/app.config");

const userDao = new UserDao();

class AuthController extends CustomRouter {
  init() {
    this.post(
      "/signup",
      ["PUBLIC"],
      passportCall("register", { failureRedirect: "/api/failRegister" }),
      async (req, res) => {
        try {
          res
            .status(201)
            .json({
              status: "success",
              payload: "Usuario registrado",
              redirectUrl: "/api/login",
            });
        } catch (error) {
          console.error(error.message);
          res
            .status(500)
            .json({ status: "error", payload: "Server Internal error" });
        }
      }
    );

    this.post(
      "/login",
      ["PUBLIC"],
      passportCall("login", { failureRedirect: "/api/failLogin" }),
      async (req, res) => {
        try {
          console.log("/login");
          if (!req.user)
            return res
              .status(401)
              .json({ status: "success", redirectUrl: "/api/failLogin" });

          const accessToken = generateToken({
            id: req.user._id,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            email: req.user.email,
            role: req.user.role,
            nickName: req.user.nickName,
            cartId: req.user.cart || null,
          });
          console.log("User id: ", req.user._id)
          res
            .cookie("authToken", accessToken, {
              maxAge: 60 * 60 * 1000,
              httpOnly: true,
              secure: true,
              sameSite: "None",
            })
            .json({
              status: "success",
              payload: req.user,
              redirectUrl: "/api/viewsproducts",
            });
        } catch (error) {
          console.error(error.message);
          res
            .status(500)
            .json({ status: "error", payload: "Internal server error" });
        }
      }
    );

    this.get("/logout", ["CLIENT", "ADMIN"], (req, res) => {
      try {
        res.clearCookie("authToken");
        res.redirect("/api/login");
      } catch (error) {
        res
          .status(500)
          .json({ error: error.message, payload: "Server Internal error" });
      }
    });

    this.get(
      "/github",
      ["PUBLIC"],
      passportCall("github", { scope: ["user: email"] }),
      async (req, res) => {
        const accessToken = generateToken({
          id: req.user._id,
          firstName: req.user.firstName,
          lastName: req.user.lastName,
          email: req.user.email,
          role: req.user.role,
          nickName: req.user.nickName,
          cartId: req.user.cart || null,
        });
        res
          .cookie("authToken", accessToken, {
            maxAge: 60 * 60 * 1000,
            httpOnly: true,
          })
          .json({
            status: "success",
            payload: req.user,
          });
      }
    );

    this.get(
      "/githubCallback",
      ["PUBLIC"],
      passportCall("github", { failureRedirect: "/api/login" }),
      async (req, res) => {
        res.redirect("/api/viewsproducts");
      }
    );

    this.patch("/forgotPassword", ["PUBLIC"], async (req, res) => {
      try {
        const { email, password } = req.body;
        const passwordEncrypted = hashPassword(password);
        await User.updateOne({ email }, { password: passwordEncrypted });
        res.json({ message: "Password updated" });
      } catch (error) {
        res.json({ error: error.message });
      }
    });

    this.get("/current", ["CLIENT", "ADMIN"], (req, res) => {
      const token = req.cookies.authToken;
      if (!token) {
        return res.status(401).json({ error: "Invalid token" });
      }
      try {
        const user = verifyToken(token);
        res.json(user);
      } catch (error) {
        return res.status(401).json({ error: "Invalid token" });
      }
    });

    this.get("/me", ["CLIENT", "ADMIN"], (req, res) => {
      const token = req.cookies.authToken;
      try {
        return res.status(200).json(token);
      } catch (error) {
        return res.status(401).json({ error: "Invalid token" });
      }
    });

    this.post("/forgotPassword", ["PUBLIC"], async (req, res) => {
      try {
        const { email } = req.body;
        const user = await userDao.findOne({ email });
        if (!user) return res.status(404).json({ error: "User not found" });
        const token = generateTokenForPassword(user._id);

        await userDao.updateById(user._id, {
          resetToken: token,
          resetTokenExpires: Date.now() + 1800000,
        });

        // Enviar correo
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: emailUser,
            pass: emailPass,
          },
        });

        const resetURL = `${frontEndUrl}/resetPassword/${token}`;

        await transporter.sendMail({
          to: email,
          subject: "Recuperar contraseña",
          html: `<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p><a href="${resetURL}">${resetURL}</a>`,
        });

        res.status(200).json({ message: "Email send" });
      } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Error al recuperar contraseña" });
      }
    });

    this.patch("/resetPassword/:token", ["PUBLIC"], async (req, res) => {
      try {
        const { token } = req.params;
        const { password } = req.body;

        let payload;
        try {
          payload = verifyToken(token);
        } catch (err) {
          return res.status(401).json({ message: "Token inválido o expirado" });
        }

        const user = await userDao.findOne({ _id: payload.id, resetToken: token });

        if (!user || user.resetTokenExpires < Date.now()) {
          return res.status(401).json({ message: "Token expirado" });
        }

        const newPassword = hashPassword(password);
        await userDao.updateById(user._id, {
          password: newPassword,
          resetToken: null,
          resetTokenExpires: null,
        })
        
        res.json({ message: "Password updated" });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
  }
}

module.exports = AuthController;
