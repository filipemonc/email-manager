const express = require("express");
const authController = require("../controllers/auth");
const validateController = require("../controllers/validate");
const externalController = require("../controllers/external");
const emailController = require("../controllers/sender");
const querys = require("../model/querys");

const router = express.Router();

router.post("/list", express.json({ type: "*/*" }), async (req, res) => {
    const token = req.cookies.jwt;
    if (!token) {
        return res.sendStatus(401);
    }
    const isAuth = await authController.isTokenValid(token);
    if (!isAuth) {
        return res.sendStatus(401);
    }
    const user_id = isAuth.user_id;
    const domain = req.body.domain;
    const results = await querys.verifyDomainAttribution(user_id, domain);
    if (results.length === 0) {
        return res.sendStatus(403);
    }
    const domainAvailability = await querys.verifyDomainAvailability(domain);
    const externalRes = await externalController.fetch("list_pops", req.body);
    if (externalRes.errors || !externalRes.status) {
        return res.status(500).json({
            message:
                "Ocorreu um erro ao processar a sua solicitação, tente novamente",
        });
    }
    res.status(200).send(externalRes.data);
});

router.post("/add", express.json({ type: "*/*" }), async (req, res) => {
    const token = req.cookies.jwt;
    if (!token) {
        return res.sendStatus(401);
    }
    const isAuth = await authController.isTokenValid(token);
    if (!isAuth) {
        return res.sendStatus(401);
    }
    const { username, password, passwordConfirm, domain } = req.body;
    if (!username || !password || !passwordConfirm) {
        return res
            .status(400)
            .json({ message: "Por favor, preencha todos os campos" });
    }
    if (password !== passwordConfirm) {
        return res
            .status(400)
            .json({ message: "As senhas digitadas não são iguais" });
    }
    const isValid = validateController.passwordRequirements(password);
    if (!isValid) {
        return res.status(400).json({
            message: "A senha digitada não cumpre os requisitos",
        });
    }
    const user_id = isAuth.user_id;
    const results = await querys.verifyDomainAttribution(user_id, domain);
    if (results.length === 0) {
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
            return res.status(400).json({
                message: "O e-mail digitado já exite",
            });
        }
        if (externalRes.errors[0].includes("too weak")) {
            return res.status(400).json({
                message:
                    "A senha digitada é considerada fraca e potencialmente insegura, tente novamente",
            });
        }
        return res.status(500).json({
            message:
                "Ocorreu um erro ao processar a sua solicitação, tente novamente",
        });
    }
    res.status(201).json({ message: "E-mail criado com sucesso" });
});

router.post("/update", express.json({ type: "*/*" }), async (req, res) => {
    const token = req.cookies.jwt;
    if (!token) {
        return res.sendStatus(401);
    }
    const isAuth = await authController.isTokenValid(token);
    if (!isAuth) {
        return res.sendStatus(401);
    }
    const { username, password, passwordConfirm, domain } = req.body;
    if (!username || !password || !passwordConfirm) {
        return res
            .status(400)
            .json({ message: "Por favor, preencha todos os campos" });
    }
    if (password !== passwordConfirm) {
        return res
            .status(400)
            .json({ message: "As senhas digitadas não são iguais" });
    }
    const isValid = validateController.passwordRequirements(password);
    if (!isValid) {
        return res.status(400).json({
            message: "A senha digitada não cumpre os requisitos",
        });
    }
    const user_id = isAuth.user_id;
    const results = await querys.verifyDomainAttribution(user_id, domain);
    if (results.length === 0) {
        return res.sendStatus(403);
    }
    const externalRes = await externalController.fetch("passwd_pop", req.body);
    if (externalRes.errors || !externalRes.status) {
        if (externalRes.errors[0].includes("too weak")) {
            return res.status(400).json({
                message:
                    "A senha digitada é considerada fraca e potencialmente insegura, tente novamente",
            });
        }
        return res.status(500).json({
            message:
                "Ocorreu um erro ao processar a sua solicitação, tente novamente",
        });
    }
    res.status(200).json({ message: "A senha foi alterada com sucesso" });
});

router.post("/delete", express.json({ type: "*/*" }), async (req, res) => {
    const token = req.cookies.jwt;
    if (!token) {
        return res.sendStatus(401);
    }
    const isAuth = await authController.isTokenValid(token);
    if (!isAuth) {
        return res.sendStatus(401);
    }
    const { username, domain } = req.body;
    if (!username) {
        return res
            .status(400)
            .json({ message: "Por favor, preencha todos os campos" });
    }
    const user_id = isAuth.user_id;
    const results = await querys.verifyDomainAttribution(user_id, domain);
    if (results.length === 0) {
        return res.sendStatus(403);
    }
    const externalRes = await externalController.fetch("delete_pop", req.body);
    if (externalRes.errors || !externalRes.status) {
        return res.status(500).json({
            message:
                "Ocorreu um erro ao processar a sua solicitação, tente novamente",
        });
    }
    res.status(200).json({ message: "E-mail excluído com sucesso" });
});

router.post("/session", express.json({ type: "*/*" }), async (req, res) => {
    const token = req.cookies.jwt;
    if (!token) {
        return res.sendStatus(401);
    }
    const isAuth = await authController.isTokenValid(token);
    if (!isAuth) {
        return res.sendStatus(401);
    }
    const { username, domain } = req.body;
    if (!username) {
        return res
            .status(400)
            .json({ message: "Por favor, preencha todos os campos" });
    }
    const user_id = isAuth.user_id;
    const results = await querys.verifyDomainAttribution(user_id, domain);
    if (results.length === 0) {
        return res.sendStatus(403);
    }
    const externalRes = await externalController.createSession(req.body);
    if (externalRes.errors || !externalRes.status) {
        return res.status(500).json({
            message:
                "Ocorreu um erro ao processar a sua solicitação, tente novamente",
        });
    }
    res.status(200).send(externalRes.data);
});

router.post("/sender", express.json({ type: "*/*" }), async (req, res) => {
    if (!req.headers.authorization) {
        return res.sendStatus(401);
    }
    const token = req.headers.authorization.split(" ")[1];
    if (token !== process.env.CROSS_DOMAIN_API_KEY) {
        return res.sendStatus(403);
    }
    const isSent = await emailController.send(req.body);
    if (isSent) {
        res.status(200).json({ message: "E-mail enviado com sucesso" });
    }
    return res.status(500).json({
        message:
            "Ocorreu um erro ao processar a sua solicitação, tente novamente",
    });
});

module.exports = router;
