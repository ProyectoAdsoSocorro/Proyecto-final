import jwt from 'jsonwebtoken';
import users from "../models/users.js";

const generarJWT = (uid) => {
    return new Promise((resolve, reject) => {
        const payload = { uid };
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


const validar = async (req, res, next) => {
    try {
        const token = req.header("x-token");
        console.log(token)
        if (!token) {
            return res.status(401).json({
                msg: "No hay token en la peticion"
            })
        };
        console.log("1")
        
        const uid = jwt.verify(token, process.env.JWT_SECRET).uid;
        console.log(uid)
        let user = await users.findById(uid).select('roles isActive');

        if (!user) {
            return res.status(401).json({
                msg: "usuario no existe"
            })
        };
        
        if (!user.isActive) {
            return res.status(401).json({
                msg: "El usuario no esta activo"
            })
        };
        req.user = user;
        console.log("2")
        next();
    } catch (error) {
        res.status(401).json({
            msg: "token no valido"
        })
    }
}

export { validar, generarJWT }