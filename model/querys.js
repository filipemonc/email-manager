const db = require("./db");
const external = require("../controllers/external");

exports.getDomainsByUserId = async (user_id) => {
    const [query] = await db.start.query(
        "SELECT * FROM email_manager LEFT JOIN email_plans ON email_manager.email_plan_id=email_plans.email_plan_id WHERE user_id = ?",
        [user_id]
    );
    return query;
};

exports.getEmailQuotaByDomain = async (domain) => {
    const [query] = await db.start.query(
        "SELECT email_quota FROM email_manager LEFT JOIN email_plans ON email_manager.email_plan_id=email_plans.email_plan_id WHERE domain = ?",
        [domain]
    );
    return query;
};

exports.verifyDomainAttribution = async (user_id, domain) => {
    const [query] = await db.start.query(
        "SELECT * FROM email_manager WHERE user_id = ? AND domain = ?",
        [user_id, domain]
    );
    return query;
};

exports.verifyDomainAvailability = async (domain) => {
    const [query] = await db.start.query(
        "SELECT email_quantity_total FROM email_manager LEFT JOIN email_plans ON email_manager.email_plan_id=email_plans.email_plan_id WHERE domain = ?",
        [domain]
    );
    const email_quantity_total = query[0].email_quantity_total;
    const externalRes = await external.fetch("list_pops", { domain: domain });
    if (email_quantity_total === 0) return true;
    if (email_quantity_total > externalRes.data.length) return true;
    return false;
};
