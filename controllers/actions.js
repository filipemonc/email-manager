const authController = require("./auth");
const validateController = require("./validate");
const externalController = require("./external");
const querys = require("../model/querys");

exports.add = async (req, res) => {
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
    const { username, password, passwordConfirm } = req.body;
    if (!username || !password || !passwordConfirm) {
        return res.status(400).render("add", {
            user: isAuth,
            data: data,
            username: username,
            message: "Please fill in all fields",
            continuity: true,
        });
    }
    if (password !== passwordConfirm) {
        return res.status(400).render("add", {
            user: isAuth,
            data: data,
            username: username,
            message: "The passwords entered are not the same",
            continuity: true,
        });
    }
    const isValid = validateController.passwordRequirements(password);
    if (!isValid) {
        return res.status(400).render("add", {
            user: isAuth,
            data: data,
            username: username,
            message: "The password entered does not meet the requirements",
            continuity: true,
        });
    }
    const user_id = isAuth.user_id;
    const domain = data.domain;
    req.body.domain = domain;
    const result = await querys.verifyDomainAttribution(user_id, domain);
    if (result.length === 0) {
        return res.sendStatus(403);
    }
    const domainAvailability = await querys.verifyDomainAvailability(domain);
    if (!domainAvailability) {
        return res.sendStatus(403);
    }
    const result_quota = await querys.getEmailQuotaByDomain(domain);
    req.body.email_quota = result_quota[0].email_quota;
    const externalRes = await externalController.fetch("add_pop", req.body);
    if (externalRes.errors || !externalRes.status) {
        if (externalRes.errors[0].includes("already exists")) {
            return res.status(400).render("add", {
                user: isAuth,
                data: data,
                username: username,
                message: "The email entered already exists",
                continuity: true,
            });
        }
        if (externalRes.errors[0].includes("too weak")) {
            return res.status(400).render("add", {
                user: isAuth,
                data: data,
                username: username,
                message:
                    "The password you entered is considered weak and potentially insecure, please try again",
                continuity: true,
            });
        }
        return res.status(500).render("add", {
            user: isAuth,
            data: data,
            username: username,
            message:
                "An error occurred while processing your request, please try again",
            continuity: true,
        });
    }
    res.status(201).render("index", {
        user: isAuth,
        data: data,
        message: "Email created successfully",
        refresh: true,
    });
};

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
    const username = req.query.email;
    const { password, passwordConfirm } = req.body;
    if (!password || !passwordConfirm) {
        return res.status(400).render("update", {
            user: isAuth,
            data: data,
            username: username,
            message: "Please fill in all fields",
            continuity: true,
        });
    }
    if (password !== passwordConfirm) {
        return res.status(400).render("update", {
            user: isAuth,
            data: data,
            username: username,
            message: "The passwords entered are not the same",
            continuity: true,
        });
    }
    const isValid = validateController.passwordRequirements(password);
    if (!isValid) {
        return res.status(400).render("update", {
            user: isAuth,
            data: data,
            username: username,
            message: "The password entered does not meet the requirements",
            continuity: true,
        });
    }
    const user_id = isAuth.user_id;
    const domain = data.domain;
    req.body.username = username;
    req.body.domain = domain;
    const result = await querys.verifyDomainAttribution(user_id, domain);
    if (result.length === 0) {
        return res.sendStatus(403);
    }
    const externalRes = await externalController.fetch("passwd_pop", req.body);
    if (externalRes.errors || !externalRes.status) {
        if (externalRes.errors[0].includes("too weak")) {
            return res.status(400).render("update", {
                user: isAuth,
                data: data,
                username: username,
                url: `/change-password?email=${username}`,
                message:
                    "The password you entered is considered weak and potentially insecure, please try again",
                continuity: true,
            });
        }
        return res.status(500).render("update", {
            user: isAuth,
            data: data,
            username: username,
            url: `/change-password?email=${username}`,
            message:
                "An error occurred while processing your request, please try again",
            continuity: true,
        });
    }
    res.status(200).render("index", {
        user: isAuth,
        data: data,
        message: "Password was changed successfully",
        refresh: true,
    });
};

exports.delete = async (req, res) => {
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
    const username = req.query.email;
    const user_id = isAuth.user_id;
    const domain = data.domain;
    req.body.username = username;
    req.body.domain = domain;
    const result = await querys.verifyDomainAttribution(user_id, domain);
    if (result.length === 0) {
        return res.sendStatus(403);
    }
    const externalRes = await externalController.fetch("delete_pop", req.body);
    if (externalRes.errors || !externalRes.status) {
        return res.status(500).render("delete", {
            user: isAuth,
            data: data,
            username: username,
            url: `/delete?email=${username}`,
            message:
                "An error occurred while processing your request, please try again",
            continuity: true,
        });
    }
    res.status(200).render("index", {
        user: isAuth,
        data: data,
        message: "Email successfully deleted",
        refresh: true,
    });
};
