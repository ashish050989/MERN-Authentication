export const getOtpHtml = ({ email, otp }) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Verify Your Email</h2>
      <p style="color: #555;">Hello ${email},</p>
      <p style="color: #555;">Your verification OTP is:</p>
      <h3 style="color: #007BFF; text-align: center;">${otp}</h3>
      <p style="color: #555;">Please use this OTP to verify your email address.</p>
    </div>
  `;
};

export const getVerifyEmailHtml = ({ email, token }) => {
  const appName = process.env.APP_NAME || "MyApp";
  const verificationLink = `${process.env.FRONTEND_URL || "http://localhost:3000"}/verify-email?token=${token}`;

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px; background: #fafafa;">
      <h2 style="color: #333; margin-bottom: 8px;">Verify Your Email for ${appName}</h2>
      <p style="color: #555;">Hello ${email},</p>
      <p style="color: #555;">Please click the button below to verify your email address and activate your ${appName} account:</p>
      <div style="text-align: center; margin: 20px 0;">
        <a href="${verificationLink}" style="display: inline-block; padding: 12px 24px; background-color: #007BFF; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600;">Verify Email</a>
      </div>
      <p style="color: #777; font-size: 13px;">If the button doesn't work, paste the following link into your browser:</p>
      <p style="word-break: break-all; font-size: 13px;"><a href="${verificationLink}" style="color: #007BFF;">${verificationLink}</a></p>
      <p style="color: #999; font-size: 12px; margin-top: 18px;">Thanks — The ${appName} Team</p>
    </div>
  `;
};
