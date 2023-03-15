const jwt = require('jsonwebtoken');
const secret_key = 'SfBrweENW2A5VS703';

 const fetchuser = (req, res, next) =>{
  // Get the token from the header
  const token = req.header('auth-token');
  // Check if token doesn't exist
  if (!token) {
    return res.status(401).send({ msg: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, secret_key);
    // console.log('Token:', token);
    // console.log('Decoded:', decoded);
    // // Add user from payload
    req.user = decoded.userId;
    next();
  } catch (err) {
    res.status(401).send({ msg: 'Token is not valid' });
  }
};


module.exports = fetchuser;