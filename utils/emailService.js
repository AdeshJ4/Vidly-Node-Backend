const nodemailer = require('nodemailer');
/*
The error message indicates that the authentication process for your Gmail account is failing, and Google is requesting an 
application-specific password (app password).
Keep in mind that application-specific passwords are more secure and recommended for use with less secure apps or apps that 
don't support two-step verification
*/
const emailService = {
  sendEmail: async (to, subject, text) => {
    try {
      // Initialize nodemailer transporter (configure your email provider here)
      const transporter = nodemailer.createTransport({
        // Configure your email provider settings (SMTP, OAuth, etc.)
        service: 'gmail',
        auth: {
          user: 'vidlymoviesapplication@gmail.com',
          pass: 'paop zyiv iila wqty',
        },
      });

      // Email options
      const mailOptions = {
        from: 'vidlymoviesapplication@gmail.com',
        to,
        subject,
        text,
      };

      // Send email
      const result = await transporter.sendMail(mailOptions);

      console.log('Email sent:', result);

    //   return result;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  },
};

module.exports = emailService;


  



  
    // // send email to user/employee
    // var transporter = nodemailer.createTransport({
    //     service: 'gmail',
    //     auth: {
    //       user: 'vidlymoviesapplication@gmail.com',
    //       pass: 'paop zyiv iila wqty'
    //     }
    //   });
      
    //   var mailOptions = {
    //     from: 'vidlymoviesapplication@gmail.com',
    //     to: email,
    //     subject: `Welcome to ${name} - Registration Successful.`,
    //     text: `Dear ${name},
  
    //     Thank you for registering with Vidly! We are excited to welcome you to our community.
        
    //     Your account has been successfully created, and you can now enjoy the benefits of being a member. If you have any questions 
    //     or need assistance, feel free to reach out to our support team.
        
    //     Best regards,
    //     Vidly Team
    //     `
    //   };
      
    //   transporter.sendMail(mailOptions, function(error, info){
    //     if (error) {
    //       console.log(error);
    //     } else {
    //       console.log('Email sent: ' + info.response);
    //     }
    //   });
    