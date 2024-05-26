const jwt = require("jsonwebtoken")
require("dotenv").config()
let utilities = require("../utilities/")
let accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const { render } = require("ejs")
/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
        errors: null
    })
}
async function accountLogin(req, res) {
    let nav = await utilities.getNav()
    const { account_email, account_password } = req.body
    const accountData = await accountModel.getAccountByEmail(account_email)
    if (!accountData) {
        req.flash("notice", "Please check your credentials and try again.")
        res.status(400).render("account/login", {
            title: "Login",
            nav,
            errors: null,
            account_email,
        })
        return
    }
    try {
        if (await bcrypt.compare(account_password, accountData.account_password)) {
            console.log("We created a cookie for authentication")
            delete accountData.account_password
            const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
            if (process.env.NODE_ENV === 'development') {
                res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
            } else {
                res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
            }
            return res.redirect("/account/")
        }
    } catch (error) {
        return new Error('Access Forbidden')
    }
}
async function buildManagement(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/management", {
        title: "Success",
        nav
    })
}
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
        title: "Register",
        nav,
        errors: null
    })
}

async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body
    let hashedPassword
    try {
        // regular password and cost (salt is generated automatically)
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error processing the registration.')
        res.status(500).render("account/register", {
            title: "Registration",
            nav,
            errors: null,
        })
    }
    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword
    )

    if (regResult) {
        req.flash(
            "notice",
            `Congratulations, you\'re registered ${account_firstname}. Please log in.`
        )
        res.status(201).render("account/login", {
            title: "Login",
            nav,
            errors: null
        })
    } else {
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("account/register", {
            title: "Registration",
            nav,
        })
    }
}
async function buildAccountEdit(req, res, next) {
    let nav = await utilities.getNav()
    let account_firstname = res.locals.accountData.account_firstname
    res.render("account/update", {
        title: "Edit account",
        nav,
        errors: null,
        account_firstname
    })
}
async function updateAccount(req, res) {
    const { account_firstname, account_lastname, account_email, account_id } = req.body;

    const updateResult = await accountModel.updateAccount(
        account_id, account_firstname, account_lastname, account_email
    )
    if (updateResult) {
        req.flash("notice", `Your profile was successfully updated.`)

        res.redirect("/account/")
    } else {
        req.flash("notice", "Sorry, it was not possible to edit your information")
        res.status(501).render("account/update", {
            title: "Edit account",
            nav,
            errors: null,
            account_firstname
        })
    }
}
async function changePassword(req, res) {
    let nav = await utilities.getNav()
    const { account_password } = req.body
    let hashedPassword
    try {
        // regular password and cost (salt is generated automatically)
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error processing the registration.')
        res.status(500).render("account/register", {
            title: "Registration",
            nav,
            errors: null,
        })
    }
    const updateResult = await accountModel.changePassword(
        account_id, account_password
    )
    if (updateResult) {
        req.flash("notice", `Your password was successfully updated.`)

        res.redirect("/account/")
    } else {
        req.flash("notice", "Sorry, it was not possible to change your password")
        res.status(501).render("account/update", {
            title: "Edit account",
            nav,
            errors: null,
            account_firstname
        })
    }
}
module.exports = { buildLogin, accountLogin, registerAccount, buildRegister, buildManagement, buildAccountEdit, updateAccount, changePassword }