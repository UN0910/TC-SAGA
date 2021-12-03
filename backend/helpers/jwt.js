const expressJwt = require("express-jwt");

function authJwt() {
  const secret = process.env.JWT_SECRET;
  return expressJwt({
    secret,
    algorithms: ["HS256"],
    isRevoked: isRevoked,
  }).unless({
    path: [
      // { url: /\/public\/uploads(.*)/, methods: ["GET", "OPTIONS"] },
      // { url: /\/product(.*)/, methods: ["GET", "OPTIONS"] },
      // { url: /\/category(.*)/, methods: ["GET", "OPTIONS"] },
      // { url: /\/order(.*)/, methods: ["POST", "OPTIONS"] },
      // `/user/login`,
      // `/user/register`,
      // `/user/resend-verification`,
      // `/user/forgot-password`,
      // {
      //   url: /\/user\/reset-password(.*)/,
      //   methods: ["GET", "OPTIONS", "POST"],
      // },
      // { url: /\/user\/confirm-email(.*)/, methods: ["GET", "OPTIONS"] },
      // `/user/confirm-email/:token`,
      { url: /(.*)/ },
    ],
  });
}

async function isRevoked(req, payload, done) {
  if (payload.userRole == "CUSTOMER") {
    done(null, true);
  }

  done();
}

module.exports = authJwt;
