const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const UserRepository = require("../repositories/userRepository");

const userRepository = new UserRepository();

class AuthService {
  async #encrypt(password, salt) {
    let hash = crypto
      .pbkdf2Sync(password, salt, 1000, 64, `sha512`)
      .toString(`hex`);
    return hash;
  }
  async #secretKey() {
    const secretKey = process.env.JWT_SECRET_KEY;
    return secretKey;
  }
  async #getExpiredTime(numOfHours, date = new Date()) {
    date.setTime(date.getTime() + numOfHours * 60 * 60 * 1000);
    return date;
  }
  async register(payload) {
    let err = null;
    let { username, email, password, confirmPassword, role } = payload.body;
    if (!username || !email || !password || !confirmPassword) {
      err = "Data can't be empty!";
      return [err, null];
    }
    const isEmail = await validator.isEmail(email);
    if (!isEmail) {
      err = "Please enter your email";
      return [err, null];
    }
    if (password !== confirmPassword) {
      err = "Password does not match";
      return [err, null];
    }
    let isStrongPassword = await validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      returnScore: false,
      pointsPerUnique: 1,
      pointsPerRepeat: 0.5,
      pointsForContainingLower: 10,
      pointsForContainingUpper: 10,
      pointsForContainingNumber: 10,
      pointsForContainingSymbol: 10,
    });
    if (!isStrongPassword) {
      err =
        "Password is weak: must contain minimum 1 letter, 1 number, 1 symbol, 1 lowercase, 1 uppercase and lenght more than 8 characters";
      return [err, null];
    }
    let conditions = { $or: [{ username }, { email }] };
    let [error, isUserFound] = await userRepository.viewOneUser(conditions);
    if (isUserFound) {
      error = "Username/Email is already exist.";
      return [error, null];
    }
    const salt = crypto.randomBytes(16).toString("hex");
    password = await this.#encrypt(password, salt);
    const verifiedToken = crypto.randomBytes(16).toString("hex");
    const expiredTokenAt = await this.#getExpiredTime(1); // 1 jam
    conditions = {
      username,
      email,
      password,
      salt,
      role,
      verifiedToken,
      expiredTokenAt,
    };
    return await userRepository.createUser(conditions);
  }
  async login(payload) {
    let err = null;
    let { username, password } = payload.body;
    if (!username || !password) {
      err = "Password/Username does not empty";
      return [err, null];
    }
    const conditions = {
      username,
    };
    let [error, isUserFound] = await userRepository.viewOneUser(conditions);
    if (error) {
      error = "User is not found";
      return [error, null];
    } else if (isUserFound) {
      const salt = isUserFound.salt;
      password = await this.#encrypt(password, salt);
      const dbPassword = isUserFound.password;
      if (password !== dbPassword) {
        err = "Password does not match";
        return [err, null];
      } else {
        try {
          const secretKey = await this.#secretKey();
          let token = jwt.sign(
            {
              userId: isUserFound.id,
              username: isUserFound.username,
              role: isUserFound.role,
            },
            secretKey,
            { expiresIn: 60 * 60 }
          );
          return [err, token];
        } catch (error) {
          console.log(error);
          return [error, null];
        }
      }
    }
  }
}

module.exports = AuthService;
