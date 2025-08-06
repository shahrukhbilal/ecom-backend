const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,       // e.g., yourstore@gmail.com
    pass: process.env.EMAIL_PASS,       // App password
  },
});

// ✅ Function to send shipment confirmation
const sendShipmentEmail = async (toEmail, customerName, orderId) => {
  const mailOptions = {
    from: `"Your Store" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: '🎉 Your Order Has Been Shipped!',
    html: `
      <h2>Hi ${customerName},</h2>
      <p>Good news! Your order <strong>#${orderId}</strong> has been <strong>shipped</strong>.</p>
      <p>You’ll receive another email once your package is out for delivery.</p>
      <br />
      <p>Thank you for shopping with us! ❤️</p>
      <p><strong>Your Store Team</strong></p>
    `,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = {
  sendShipmentEmail,
};
