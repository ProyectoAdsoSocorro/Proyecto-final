import jwt from 'jsonwebtoken';
import users from "../models/users.js";
import coreDirection from '../models/coreDirection.js';

const generateJWT = (uid, role) => {
    return new Promise((resolve, reject) => {
        const payload = { uid, role };
        jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "4h"
        },
            (err, token) => {
                if (err) {
                    console.log(err);
                    reject("No se pudo generar el token")
                } else {
                    resolve(token)
                }
            })
    })
}

const validateJWT = async (req, res, next) => {
    try {
        let user = null;
        const token = req.header("x-token");
        if (!token) {
            return res.status(401).json({
                msg: "No hay token en la peticion"
            })
        };
        const userInfo = jwt.verify(token, process.env.JWT_SECRET)


        if (userInfo.role == "direccionNucleo") {
             user = await coreDirection.findById(userInfo.uid)
        } else {
             user = await users.findById(userInfo.uid);
        }
        if (!user) {
            return res.status(404).json({
                msg: "usuario no existe"
            })
        };
        if (!user.isActive) {
            return res.status(403).json({
                msg: "El usuario no esta activo"
            })
        };
        let { uid, role } = userInfo;
        req.user = {
            uid: uid,
            role: role
        };
        next();
    } catch (error) {
        res.status(401).json({
            msg: "token no valido"
        })
    }
}

export { validateJWT, generateJWT }
