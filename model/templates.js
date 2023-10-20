exports.recovery = (data) => {
    const text = `COMPANY NAME\n
Hello, ${data.name}.\n
You requested a link to reset your password. Click the button below to create a new password.\n
Company Team\n
This is an automated message, please do not respond.\n
Create new password: https://auth.companyname.com/forgot-password/${data.token}\n
© 2023 Company Name, All rights reserved.\n`;

    const html = `<!DOCTYPE html>
<html lang="pt-BR">
    <head>
        <meta charset="UTF-8" />
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                font-family: sans-serif;
            }
            .container {
                margin: 20px;
                overflow: hidden;
            }
            .container .top {
                padding: 50px;
                background-color: #000000;
                border-bottom: 1px solid #d9d9d9;
            }
            .container .top .logo {
                display: block;
                margin: 0;
                width: 300px;
            }
            .container .top .logo img {
                width: 100%;
                height: auto;
            }
            .container .message {
                padding: 50px 50px 30px 50px;
            }
            .container .message h5,
            .container .message p {
                width: 100%;
            }
            .container .message h5 {
                margin-bottom: 1rem;
                font-size: 1.5rem;
                font-weight: normal;
            }
            .container .message .sign {
                margin-top: 30px;
                margin-bottom: 10px;
                font-weight: bold;
            }
            .container .message .sign,
            .container .message .sign + p {
                color: #808080;
            }
            .container .message a {
                margin: 30px auto;
                padding: 0 20px;
                display: block;
                width: max-content;
                height: 50px;
                line-height: 50px;
                border-radius: 25px;
                font-size: 1.2rem;
                font-weight: 300;
                text-decoration: none;
                text-transform: uppercase;
                color: white;
                background-color: black;
                border: none;
                outline: none;
                cursor: pointer;
            }
            .container .message a:hover {
                background-color: #282828;
            }
            .container .footer {
                padding: 15px 50px 20px 50px;
                font-size: 0.8rem;
                color: #808080;
                background-color: #f1f1f1;
            }
            .container .footer p {
                margin-top: 10px;
                text-align: center;
                word-wrap: break-word;
            }
            @media (max-width: 790px) {
                .container {
                    margin: 10px;
                }
                .container .top {
                    padding: 30px;
                }
                .container .top .logo {
                    width: 200px;
                }
                .container .message {
                    padding: 40px 30px 20px 30px;
                }
                .container .footer {
                    padding: 15px 30px 20px 30px;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="top">
                <a href="https://www.companyname.com/" class="logo">
                    <img
                        src="https://static.companyname.com/logo_white.png"
                        alt="COMPANY NAME"
                /></a>
            </div>
            <div class="message">
                <h5>Hello, <strong>${data.name}</strong>.</h5>
                <p>
                    You requested a link to reset your password. click on the
                    button below to create a new password.
                </p>
                <p class="sign">Company Team</p>
                <p>This is an automated message, please do not respond.</p>
                <a href="https://auth.companyname.com/forgot-password/${data.token}">Create new password</a>
            </div>
            <div class="footer">
                <p>© 2023 Company Name, All rights reserved.</p>
                <p>URL: https://auth.companyname.com/forgot-password/${data.token}</p>
            </div>
        </div>
    </body>
</html>`;
    return (message = {
        text: text,
        html: html,
    });
};
