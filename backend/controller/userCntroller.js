const connection = require("../db/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const processEnv = process.env
let refreshTokens = [];

  
exports.refreshToken = async (req, res) =>{
  //take the refresh token from the user
  const refreshToken = req.body.token;
  
  console.log({e : refreshToken, a : refreshTokens});
//send error if there is no token or it's invalid
if (!refreshToken) return res.status(401).json({message:"You are not authenticated!"});
if (!refreshTokens.includes(refreshToken)) {
  return res.status(403).json({message:"Refresh token is not valid!"});
}
console.log(processEnv.JWT_REFRESH_SECRET);
jwt.verify(refreshToken,processEnv.JWT_REFRESH_SECRET, (err, data) => {
 err && console.log(err);
 console.log(data);
  refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
  console.log(refreshTokens);
 const newAccessToken = jwt.sign({ id: data.id,role:data.role}, process.env.JWT_SECRET, { expiresIn: "25s"})
   const newRefreshToken =  jwt.sign({ id: data.id,role:data.role}, process.env.JWT_REFRESH_SECRET)

  refreshTokens.push(newRefreshToken);

  res.status(200).json({
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  });
}); 
}

 exports.signup = async (req, res) => {
    const sql = "SELECT * FROM `user` WHERE email =?";
    const { firstName, lastName, email, password } = req.body;

    const hashed = bcrypt.hashSync(password, 10);
    connection.query(sql, [email], (error,data) =>{
        if(error) return res.json(error);
        if(data.length>0){
             return res.status(422).json("user already existe");
        }else{
             const q = "INSERT INTO user (`firstName`,`lastName`,`email`,`password`) VALUES (?)";
             const values = [firstName,lastName,email,hashed];
             connection.query(q,[values], (error,data) =>{
                 if(error) return res.json(error);
                 if(data)  return res.status(201).json({
                    message : "User created successfully !"
                 })
             })
        }  
  }) 

}
const generateAccessToken = (data) => {
  return  jwt.sign({ id: data[0].iduser,role:data[0].role}, process.env.JWT_SECRET, { expiresIn: "25s"})
};

const generateRefreshToken = (data) => {
  return  jwt.sign({ id: data[0].iduser,role:data[0].role}, process.env.JWT_REFRESH_SECRET)
};

exports.signin = async (req, res) => {
    const q = "SELECT * FROM `user` WHERE email =?";
    const { email, password } = req.body;
  
    connection.query(q, [email,password],  (err, data) => {
     if (err) return res.status(500).json(err);
     if (data.length === 0) return res.status(404).json("User not found!");
 
     //Check password
     const isPasswordCorrect = bcrypt.compareSync(
        req.body.password,
        data[0].password
     );

     if (!isPasswordCorrect) return res.status(400).json("Wrong username or password!");
     const accessToken = generateAccessToken(data);
     const refreshToken =generateRefreshToken(data);
     refreshTokens.push(refreshToken);

     const { password, ...other } = data[0];
     const {firstName,lastName,img}=other
     console.log(firstName,lastName);
     res.json({
       accessToken,
       refreshToken,
       firstName,
       lastName,
       img
      }); 
    });
    
  }  
  
exports.deleteUser = (req, res) => {
   const {id}= req.params
   const q = "DELETE FROM user WHERE `iduser` = ?";

   connection.query(q, [id], (err, data) => {
     if (err)  res.status(403).json("You are not allowed to delete this user!");

     return res.status(200).json("User has been deleted.");
   });
};

