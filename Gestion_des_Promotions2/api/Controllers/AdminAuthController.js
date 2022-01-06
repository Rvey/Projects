const Auth = require("../Models/Auth");
const jwt = require("jsonwebtoken");
const sendMail = require("../../utils/mail");

const EmailLogin = async (req, res) => {
  try {
    const Admins = await Auth.findAllAdmins();

    const { email, password } = req.body;

    // validate user creds
    if (!(email && password)) {
      return res.status(400).send("All input is required");
    }

    // validate if user exist in our database
    const CAdmin = Admins.find((admin) => admin.email == req.body.email);

    if (CAdmin) {
      await sendMail.sendMail(email, CAdmin.password);
      return res.json({ message: "Email has been send with your password" });
    }

    // create token
  } catch (error) {
    return res.json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const Admins = await Auth.findAllAdmins();

    const { email, password } = req.body;

    // validate user creds
    if (!(email && password)) {
      return res.status(400).send("All input is required");
    }

    // validate if user exist in our database
    const Admin = Admins.find(
      (admin) =>
        admin.email == req.body.email && admin.password == req.body.password
    );

    if (Admin) {
      const token = jwt.sign(
        { id: Admin.id },
        `${process.env.JWT_SECRET_KEY}`,
        {
          expiresIn: "2h",
        }
      );
      await Auth.update(token, Admin.id);

      return  res.status(200).json({ welcome: Admin });

    } else {

      res.status(400).json({ error: 'wrong creds' });
    }
    // create token
  } catch (error) {
    res.json({ message: error.message });
  }
};


module.exports = {
  login,
  EmailLogin,
  // UpdatePasswordLog  in,
};
