const User = require("../models/user");
const utils = require("../utils/common");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { request } = require("http");
const { validationResult } = require("express-validator/check");

var transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "b804552d975d26",
    pass: "cb01bc868a7e4d",
  },
});

exports.getLogin = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("pugs/auth/login.pug", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: message,
    oldInput:{email:"",password:""},
    validationErrors:[]
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("pugs/auth/signup.pug", {
    path: "/signup",
    pageTitle: "SignUp",
    errorMessage: message,
    oldInput:{email:"",password:"",confirmPassword:""},
    validationErrors:[]
  });
};

exports.postLogin = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render("pugs/auth/login.pug", {
      path: "/login",
      pageTitle: "Login",
      errorMessage: errors
        .array()
        .map((x) => x.msg)
        .join("\n"),
      oldInput:{email:email,password:password},
      validationErrors:errors.array()
    });
  }
  let user = await User.findOne({ where: { email: email } });
  if (user) {
    return bcrypt
      .compare(password, user.password)
      .then((result) => {
        if (result) {
          console.log("post login", user);
          req.session.user = {
            Id: user.id,
            Name: user.name,
            Email: user.email,
          };
          req.session.isLoggedIn = true;
          res.setHeader("Set-Cookie", "loggedIn=true; Max-Age=10");
          return req.session.save((err) => {
            console.log(err);
            return res.redirect("/");
          });
        }
        req.flash("error", "Invalid email or password");
        return res.redirect("/login");
      })
      .catch((err) => {
        console.log(err);
      });
    //res.redirect('/');
  } else {
    req.flash("error", "Email is not regirstered");
    return res.redirect("/signup");
  }
};

exports.postSignup = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  // this is a server side forms validation achieved by using express-validator
  // the validatorResult gets errors if any added to the request by the check middleware in the routes
  // before comming to this controller(ref the documentation)
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render("pugs/auth/signup.pug", {
      path: "/signup",
      pageTitle: "SignUp",
      errorMessage: errors
        .array()
        .map((x) => x.msg)
        .join("\n"),
      oldInput:{email: email, password:password, confirmPassword:confirmPassword},
      validationErrors:errors.array()
    });
  }
  if (password == confirmPassword) {
    bcrypt.hash(password, 12).then((hashedPassword) => {
      user = User.create({
        name: email.split("@")[0],
        email: email,
        password: hashedPassword,
      })
        .then((result) => {
          res.redirect("/login");
          transport.sendMail(
            {
              to: email,
              from: "shop@node-complete.com",
              subject: "Signup Succeeded!",
              html: "<h1> You successfully signed up! </h1>",
            },
            (err, info) => {
              if (err) console.log(err);
              else console.log(info);
            }
          );
        })
        .catch((err) => {
          console.log(err);
        });
    });
    return;
  }
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

exports.getReset = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("pugs/auth/reset.pug", {
    path: "/reset",
    pageTitle: "Reset Password",
    errorMessage: message,
  });
};

exports.postReset = (req, res, next) => {
  const email = req.body.email;
  crypto.randomBytes(32, (err, buff) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }
    const token = buff.toString("hex");
    User.findOne({ where: { email: email } })
      .then((user) => {
        if (!user) {
          req.flash("error", "No account with that email found.");
          return res.redirect("/reset");
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 36000000;
        return user.save();
      })
      .then((result) => {
        res.redirect("/");
        transport.sendMail(
          {
            to: email,
            from: "shop@node-complete.com",
            subject: "Password reset",
            html: `
                <p>You requested a password reset</p>
                <p>Click this <a href="http://localhost:3000/reset/${token}">link </a> to set a new password.</p>
                `,
          },
          (err, info) => {
            if (err) console.log(err);
            else console.log(info);
          }
        );
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({
    where: { resetToken: token, resetTokenExpiration: { [Op.gt]: Date.now() } },
  })
    .then((user) => {
      if (!user) {
        req.flash("error", "token has expired.");
      }
      let message = req.flash("error");
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render("pugs/auth/new-password.pug", {
        path: "/new-password",
        pageTitle: "New Password",
        errorMessage: message,
        userId: user ? user.id.toString() : "0",
        token: token,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const token = req.body.passwordToken;
  let resetUser = null;

  User.findOne({
    where: {
      resetToken: token,
      resetTokenExpiration: { [Op.gt]: Date.now() },
      id: userId,
    },
  })
    .then((user) => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then((hashedPassword) => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = null;
      resetUser.resetTokenExpiration = null;
      return resetUser.save();
    })
    .then((result) => {
      return res.redirect("/login");
    })
    .catch((err) => {
      console.log(err);
    });
};
