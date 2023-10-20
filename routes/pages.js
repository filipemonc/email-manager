const express = require("express");
const authController = require("../controllers/auth");
const actionsController = require("../controllers/actions");
const passwordController = require("../controllers/password");
const querys = require("../model/querys");

const router = express.Router();

const MAIN_DOMAIN = process.env.MAIN_DOMAIN;

router.get("/", authController.isLoggedIn, async (req, res) => {
    if (!req.user) {
        return res.redirect(
            `${req.protocol}://auth.${MAIN_DOMAIN}/?utm_source=email`
        );
    }
    const results = await querys.getDomainsByUserId(req.user.user_id);
    if (results.length === 0) {
        return res.render("index", {
            user: req.user,
        });
    }
    const data = results[0];
    res.render("index", {
        user: req.user,
        data: data,
        refresh: true,
    });
});

router.get("/create-new", authController.isLoggedIn, async (req, res) => {
    if (!req.user) {
        return res.redirect(
            `${req.protocol}://auth.${MAIN_DOMAIN}/?utm_source=email`
        );
    }
    const results = await querys.getDomainsByUserId(req.user.user_id);
    if (results.length === 0) {
        return res.render("index", {
            user: req.user,
        });
    }
    const data = results[0];
    res.render("add", {
        user: req.user,
        data: data,
    });
});

router.post("/create-new", actionsController.add);

router.get("/change-password", authController.isLoggedIn, async (req, res) => {
    if (!req.user) {
        return res.redirect(
            `${req.protocol}://auth.${MAIN_DOMAIN}/?utm_source=email`
        );
    }
    const results = await querys.getDomainsByUserId(req.user.user_id);
    if (results.length === 0) {
        return res.render("index", {
            user: req.user,
        });
    }
    const data = results[0];
    const username = req.query.email;
    if (!username) {
        return res.redirect("/");
    }
    res.render("update", {
        user: req.user,
        data: data,
        username: username,
        url: `/change-password?email=${username}`,
    });
});

router.post("/change-password", actionsController.changePassword);

router.get("/delete", authController.isLoggedIn, async (req, res) => {
    if (!req.user) {
        return res.redirect(
            `${req.protocol}://auth.${MAIN_DOMAIN}/?utm_source=email`
        );
    }
    const results = await querys.getDomainsByUserId(req.user.user_id);
    if (results.length === 0) {
        return res.render("index", {
            user: req.user,
        });
    }
    const data = results[0];
    const username = req.query.email;
    if (!username) {
        return res.redirect("/");
    }
    res.render("delete", {
        user: req.user,
        data: data,
        username: username,
        url: `/delete?email=${username}`,
    });
});

router.post("/delete", actionsController.delete);

router.get("/profile", authController.isLoggedIn, async (req, res) => {
    if (!req.user) {
        return res.redirect(
            `${req.protocol}://auth.${MAIN_DOMAIN}/?utm_source=email`
        );
    }
    const results = await querys.getDomainsByUserId(req.user.user_id);
    if (results.length === 0) {
        return res.render("profile", {
            user: req.user,
        });
    }
    const data = results[0];
    res.render("profile", {
        user: req.user,
        data: data,
    });
});

router.post("/profile", passwordController.changePassword);

router.get("/logout", (req, res) => {
    res.redirect(
        `${req.protocol}://auth.${MAIN_DOMAIN}/logout?utm_source=email`
    );
});

module.exports = router;
