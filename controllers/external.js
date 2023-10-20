const needle = require("needle");

const API_BASE_URL = process.env.API_BASE_URL;
const API_KEY_NAME = process.env.API_KEY_NAME;
const API_KEY_VALUE = process.env.API_KEY_VALUE;

function returnBody(action, query_data) {
    if (action === "list_pops") {
        return {
            regex: query_data.domain,
            skip_main: 1,
        };
    }
    if (action === "add_pop") {
        return {
            email: query_data.username,
            password: query_data.password,
            domain: query_data.domain,
            quota: query_data.email_quota * 1024,
            send_welcome_email: 1,
        };
    }
    if (action === "passwd_pop") {
        return {
            email: query_data.username,
            password: query_data.password,
            domain: query_data.domain,
        };
    }
    if (action === "delete_pop") {
        return {
            email: query_data.username,
            domain: query_data.domain,
        };
    }
}

exports.fetch = async (action, query_data) => {
    try {
        const params = new URLSearchParams(returnBody(action, query_data));
        const options = {
            headers: {
                Authorization: `cpanel ${API_KEY_NAME}:${API_KEY_VALUE}`,
            },
        };
        const apiRes = await needle(
            "post",
            `${API_BASE_URL}Email/${action}?${params}`,
            null,
            options
        );
        const data = apiRes.body;
        return JSON.parse(data);
    } catch (err) {
        return err;
    }
};

exports.createSession = async (query_data) => {
    try {
        const body = {
            login: query_data.username.split("@")[0],
            domain: query_data.domain,
        };
        const params = new URLSearchParams(body);
        const options = {
            headers: {
                Authorization: `cpanel ${API_KEY_NAME}:${API_KEY_VALUE}`,
            },
        };
        const apiRes = await needle(
            "post",
            `${API_BASE_URL}/Session/create_webmail_session_for_mail_user?${params}`,
            null,
            options
        );
        const data = apiRes.body;
        return JSON.parse(data);
    } catch (err) {
        return err;
    }
};
