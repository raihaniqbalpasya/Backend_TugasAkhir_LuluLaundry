const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifySid = process.env.TWILIO_VERIFY_SID;
const client = require("twilio")(accountSid, authToken);

module.exports = {
  async sendVerificationOTP(phoneNumber) {
    const verification = await client.verify.v2
      .services(verifySid)
      .verifications.create({ to: phoneNumber, channel: "whatsapp" });
    console.log(verification.status);
  },

  async verifyOTP(phoneNumber, otpCode) {
    const verificationCheck = await client.verify.v2
      .services(verifySid)
      .verificationChecks.create({ to: phoneNumber, code: otpCode });
    console.log(verificationCheck.status);
    return verificationCheck.status === "approved";
  },
};
