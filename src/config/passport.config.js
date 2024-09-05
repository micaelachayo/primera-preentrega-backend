import passport from "passport";
import local from "passport-local";
import github from "passport-github2";
import passportJWT from "passport-jwt";

import { hashing, validarPasword } from "../utils.js";

import usuarioDao from "../dao/usuario.dao.js";
import envsConfig from "./envs.config.js";

const searchToken = (req) => {
  let token = null;
  if (req.cookies.cookieMica) {
    token = req.cookies.cookieMica;
  }
  return token;
};

export const initPassport = () => {
  passport.use(
    "registro",
    new local.Strategy(
      { usernameField: "email", passReqToCallback: true },
      async (req, username, password, done) => {
        try {
          let { first_name, last_name, age} = req.body;
          console.log(first_name, last_name, age)
          if (!first_name || !last_name || !age) {
            console.log("completa los datos");
            return done(null, false);
          }
          let existe = await usuarioDao.existeUsuario({ email: username });
          if (existe) {
            console.log("usruario repetido, ya existe");
            return done(null, false);
          }
          let newUser = await usuarioDao.createUsuario({
            first_name,
            last_name,
            age,
            email: username,
            password: hashing(password),
          });
          return done(null, newUser);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "login",
    new local.Strategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          let usuario = await usuarioDao.existeUsuario({ email: username });
          if (!usuario || !usuario.password) {
            console.log("no existe ese usuario o la contraseña es invalidaß");
            return done(null, false);
          }
          if (!validarPasword(password, usuario.password)) {
            console.log("credenciales incorrectas");
            return done(null, false);
          }
          delete usuario.password;
          return done(null, usuario);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "github",
    new github.Strategy(
      {
        clientID: "Iv23liRfoYfwkSilG7hk",
        clientSecret: "4e25d0a74977460b9b43b413f3a99bd72779a209",
        callbackURL: "http://localhost:3000/api/session/callback",
        scope: ["user:email"],
      },
      async (token, refreshtoken, profile, done) => {
        try {
          let email =
            profile.emails && profile.emails[0] && profile.emails[0].value;
          let { name } = profile._json;
          if (!email) {
            console.log("falta email");
            return done(null, false);
          }
          let usuario = await usuarioDao.existeUsuario({ email });
          if (!usuario) {
            console.log("no existe usuario");
            usuario = await usuarioDao.createUsuario({
              nombre: name,
              email,
              profile,
            });
          }
          return done(null, usuario);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "current",
    new passportJWT.Strategy(
      {
        secretOrKey: envsConfig.SECRET,
        jwtFromRequest: new passportJWT.ExtractJwt.fromExtractors([
          searchToken
        ]),
      },
      async (contenidoToken, done) => {
        try {
          const usuario=await usuarioDao.existeUsuario(contenidoToken.id)
          if(!usuario){
            return done (null,fals)
          }
          return done(null, usuario);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  passport.serializeUser(function (user, done) {
    return done(null, user);
  });
  passport.deserializeUser(async function (usuario, done) {
    return done(null, usuario);
  });
};
