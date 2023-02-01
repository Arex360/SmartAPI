const nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        auth: {
            user: "eprogrammer786@gmail.com",
            pass: "uehmnohhliaxacln"
        }
})
let sendEmail = async ({code,username,subject,to}) => {
let html = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap"
      rel="stylesheet"
    />
    <link
      href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap"
      rel="stylesheet"
    />
    <title>Account Verification</title>
  </head>
  <style>
    .referal-code {
      padding-top: 10px;
      padding-left: 270px;
      font-family: "Poppins", sans-serif;
      font-weight: bold;
      font-size: 28px;
      letter-spacing: 13px;
    }
    .normal-text {
      color: #333333;
      font-weight: 400;
      font-size: 14px;
      line-height: 22px;
    }
    .black-text {
      color: #222222;
      font-weight: bold;
      font-size: 16px;
      line-height: 14px;
    }
    .gray-text {
      color: gray;
      font-weight: 400;
      font-size: 12px;
      line-height: 14px;
      font-family: "Poppins", sans-serif;
    }
    .table {
      width: 100%;
      display: table;
      position: relative;
      margin: 0px 20px;
    }
    .table-footer {
      width: 100%;
      display: table;
      position: relative;
      padding-top: 10px;
    }
    .row {
      display: table-row;
    }
    .cell {
      display: table-cell;
    }
    .row,
    .cell {
      padding: 0px 10px;
    }
    .refno {
      font-family: "Proxima Nova";
      font-style: normal;
      font-weight: 400;
      font-size: 10px;
      line-height: 28px;
    }
  </style>
​
  <body>
    <div
      style="
        width: 700px;
        margin: 0px auto;
        background: rgb(247, 246, 246);
        font-family: 'Playfair Display', serif;
      "
    >
      <div style="text-align: center; padding-top: 20px">​
      <h1 style="font-size: 40px; font-weight: 600; text-align: center">
        Account Verification
      </h1>
      <p
        style="
          color: #333333;
          font-size: 16px;
          font-family: 'Poppins', sans-serif;
          text-align: center;
        "
      >
      Hi, ${username}  Here is the confirmation code for your account verification.
      </p>
      <p
        style="
          padding-top: 10px;
          font-size: 15px;
          font-family: 'Poppins', sans-serif;
          text-align: center;
        "
      >
        Your 4 digit verification code
      </p>
​
      <div class="" style="margin: auto; width: max-content">
        <p
          style="
            border: 1px solid #b9b2b2;
            padding: 10px;
            padding-left: 20px;
            margin-right: -20px;
            letter-spacing: 15px;
            font-family: 'Poppins', sans-serif;
          "
        >
          ${code}
        </p>
      </div>
      <!-- <div class="referal-code" style="margin-bottom: 40px">
    </div> -->
​
      <p
        style="
          color: #333333;
          font-size: 16px;
          font-family: 'Poppins', sans-serif;
          text-align: center;
          padding-left: 10%;
          padding-right: 10%;
        "
      >
        All you have to do is the copy the verification code & paste and then submit to verify your account
      </p>
​
      <div class="table-footer" style="background-color: #f0f3ff">
        <div class="row">
          <div class="cell">
            
          </div>
          <div
            class="cell"
            style="width: max-content; margin-left: auto; display: block"
          >
          </div>
        </div>
      </div>
    </div>
  </body>
</html>
`
message = {
    from: "eprogrammer786@gmail.com",
    to: to,
    subject: subject,
    html:html
}
await new Promise((resolve, reject) => {
  // send mail
  transporter.sendMail(message, (err, info) => {
      if (err) {
          console.error(err);
          reject(err);
      } else {
          console.log(info);
          resolve(info);
      }
  });




});
}
module.exports = sendEmail
