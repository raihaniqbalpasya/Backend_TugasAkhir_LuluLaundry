const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const router = require("../routes");

// database connection
const port = process.env.PORT || 3000;
require("dotenv").config();

const app = express();

app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(router);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// client.verify.v2
//   .services(verifySid)
//   .verifications.create({ to: "+6281370154694", channel: "whatsapp" })
//   .then((verification) => console.log(verification.accountSid));

// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const verifySid = process.env.TWILIO_VERIFY_SID;
// const client = require("twilio")(accountSid, authToken);

// client.verify.v2
//   .services(verifySid)
//   .verifications.create({ to: "+6281370154694", channel: "whatsapp" })
//   .then((verification) => console.log(verification.status))
//   .then(() => {
//     const readline = require("readline").createInterface({
//       input: process.stdin,
//       output: process.stdout,
//     });
//     readline.question("Please enter the OTP:", (otpCode) => {
//       client.verify.v2
//         .services(verifySid)
//         .verificationChecks.create({ to: "+6281370154694", code: otpCode })
//         .then((verification_check) => console.log(verification_check.status))
//         .then(() => readline.close());
//     });
//   });
