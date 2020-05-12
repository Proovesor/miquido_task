import UserDAO from "../db/UserDAO";
import Isemail from "isemail";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { promisify } from "util";

export class User {
    constructor(email, password) {
        this.email = email;
        this.password = password;
    }

    getInfo() {
        return { email: this.email };
    }

    async encryptPassword() {
        return await bcrypt.hash(this.password, 12);
    }

    async comparePasswords(password) {
        return await bcrypt.compare(this.password, password);
    }

    signToken() {
        return jwt.sign(
            {
                ...this.getInfo(),
            },
            `${process.env.TOKEN_SECRET}`,
            { expiresIn: "1h" }
        );
    }

    static async verifyToken(token) {
        return await jwt.verify(
            token,
            `${process.env.TOKEN_SECRET}`,
            (error, data) => {
                if (error) return { error };
                return data;
            }
        );
    }
}

export default class UserApi {
    static async signUp(req, res, next) {
        const { email, password } = req.body;

        let errors = {};
        if (!password) {
            errors.noPassword = "Must provide password";
        }
        if (password && password.length < 7) {
            errors.password = "Password must be at least 7 characters.";
        }

        if (email && !Isemail.validate(email)) {
            errors.email = "Email form must be correct.";
        }

        if (Object.keys(errors).length > 0) {
            res.status(400).json(errors);
            return;
        }

        try {
            if (await UserDAO.checkForUser(email)) {
                res.status(400).json({ exists: "Such user already exists." });
                return;
            }

            const user = new User(email, password);

            const hashedPassword = await user.encryptPassword();
            const userDetails = { ...user.getInfo(), password: hashedPassword };
            const createdUser = await UserDAO.createUser(userDetails);

            if (createdUser) {
                res.status(201).json({
                    created: "User created succesfully",
                    ...user.getInfo(),
                });
            }
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }

    static async signIn(req, res, next) {
        const { email, password } = req.body;

        let errors = {};

        if (email && !Isemail.validate(email)) {
            errors.email = "Incorrect password or email.";
        }

        if (Object.keys(errors).length > 0) {
            res.status(400).json(errors);
            return;
        }

        const user = new User(email, password);

        try {
            const existingUser = await UserDAO.checkForUser(email);
            if (!existingUser) {
                res.status(401).json({ login: "Incorrect password or email." });
                return;
            }

            if (!(await user.comparePasswords(existingUser.password))) {
                res.status(401).json({ login: "Incorrect password or email." });
                return;
            }

            res.status(200).json({
                token: user.signToken(),
                userInfo: user.getInfo(),
            });
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }
}
