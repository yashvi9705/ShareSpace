const LocalStrategy = require("passport-local").Strategy;
const { pool } = require("./dbConfig");
const bcrypt = require("bcrypt");

function initialize(passport) {
  console.log("Initialized");

  const authenticateUser = (email, password, done) => {
    console.log(email, password);
    pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [email],
      (err, results) => {
        if (err) {
          throw err;
        }
        console.log(results.rows);

        if (results.rows.length > 0) {
          const user = results.rows[0];

          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
              console.log(err);
            }
            if (isMatch) {
              return done(null, user);
            } else {
              //password is incorrect
              return done(null, false, { message: "Password is incorrect" });
            }
          });
        } else {
          // No user
          return done(null, false, {
            message: "No user with that email address"
          });
        }
      }
    );
  };

  passport.use(
    new LocalStrategy(
      { usernameField: "email", passwordField: "password" },
      authenticateUser
    )
  );

  // passport.serializeUser((user, done) => done(null, user.id));
  passport.serializeUser((user, done) => {
    done(null, user.id);  // Store only the user ID in the session
  });


  // In deserializeUser that key is matched with the in memory array / database or any data resource.
  // The fetched object is attached to the request object as req.user

  //   passport.deserializeUser((id, done) => {
  //     pool.query(`SELECT * FROM users WHERE id = $1`, [id], (err, results) => {
  //       if (err) {
  //         return done(err);
  //       }
  //       console.log(`ID is ${results.rows[0].id}`);
  //       return done(null, results.rows[0]);
  //     });
  //   });

  passport.deserializeUser(async (id, done) => {
    try {
      const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
      if (result.rows.length > 0) {
        done(null, result.rows[0]);  // Deserialize to full user object
      } else {
        done(null, false);  // If user doesn't exist in the database
      }
    } catch (error) {
      done(error, null);
    }
  });

}



module.exports = initialize;
