const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      sparse: true,
    },
    gender: {
      type: String,
    },
    birthday: {
      type: String,
    },
    role: {
      type: String,
      required: true,
    },
    prevRole: {
      type: String,
    },
    img: {
      type: String,
      required: true,
    },
    location: {
      type: String,
    },
    profession: [{
      position: {
        type: String,
      },//lecturer, manager, student
      institution: {
        type: String,
      }, //IIUC, USTC, Chittaong University, Jamuna Bank
    }],
    degree: {
      type: String,
    }, //bba(hon's), mba
    result: {
      type: String,
    },
    isSuspended: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.statics.signup = async function (firstname, lastname, email, phone, role, prevRole, img, password) {
  console.log("🚀 ~ signup method ~ password before any processing:", password);
  const exist = await this.findOne({ email });
  console.log(password);
  if (exist) {
      if (!password)
          return exist;
      throw Error("Email already exists.!.");
  }
  if (!firstname || !lastname || !email || !phone) {
      throw Error("Required fields must be filled...");
  }
  if (!validator.isEmail(email)) {
      throw Error("Not a valid email.!.")
  }
  if (password && !validator.isStrongPassword(password)) {
      throw Error("Password is not strong enough.!.")
  }
  if (password) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      const user = await this.create({ firstname, lastname, email, phone, role, prevRole, img, password: hash });
      return user;
  }
  else {
      const user = await this.create({ firstname, lastname, email, phone, role, prevRole, img, password, });
      return user;
  }
};

userSchema.statics.login = async function (email, password) {
  if (password) {
    if (!password || !email) {
      throw Error("All fields must be filled...");
    }
    const user = await this.findOne({ email });
    if (!user) {
      throw Error("Incorrect Email.!.");
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw Error("Incorrect password.!.");
    }
    return user;
  } else {
    if (!email) {
      throw Error("All fields must be filled...");
    }
    const user = await this.findOne({ email });
    if (!user) {
      throw Error("Incorrect Email.!.");
    }
    return user;
  }
};

const user = mongoose.model("userCollection", userSchema);

module.exports = user;
