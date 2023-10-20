const needle = require("needle");
const querys = require("../model/querys");
const authController = require("../controllers/auth");

exports.changePassword = async (req, res) => {
    const token = req.cookies.jwt;
    if (!token) {
        return res.sendStatus(401);
    }
    const isAuth = await authController.isTokenValid(token);
    if (!isAuth) {
        return res.sendStatus(401);
    }
    const results = await querys.getDomainsByUserId(isAuth.user_id);
    const data = results[0];
    var options = {
        headers: {
            Cookie: "jwt=" + req.cookies.jwt,
        },
    };
    const apiRes = await needle(
        "post",
        `${req.protocol}://auth.${process.env.MAIN_DOMAIN}/api/change-password`,
        req.body,
        options
    );
    res.status(200).render("profile", {
        user: isAuth,
        data: data,
        message: apiRes.body.message,
    });
};
