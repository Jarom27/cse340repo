const jwt = require("jsonwebtoken")
require("dotenv").config()
const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()

    console.log(data)
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
        list += "<li>"
        list +=
            '<a href="/inv/type/' +
            row.classification_id +
            '" title="See our inventory of ' +
            row.classification_name +
            ' vehicles">' +
            row.classification_name +
            "</a>"
        list += "</li>"
    })
    list += '<li><a href="/repair" title="repair page">Repairs</a></li>'
    list += "</ul>"
    return list
}
Util.getAccountLinks = async function (req, res, next) {
    let accountLink = "";
    if (res.locals.loggedin) {
        accountLink += `<a href = '/account/edit'>Name</a>`
        accountLink += `<a href = '/logout'>Logout</a>`
    }
    else {
        accountLink = `<a href="/account/login" title="Click to log in">My Account</a>`
    }
    return accountLink;
}
Util.buildClassificationGrid = async function (data) {
    let grid
    if (data.length > 0) {
        grid = '<ul id="inv-display">'
        data.forEach(vehicle => {
            grid += '<li>'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id
                + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model
                + 'details"><img src="' + vehicle.inv_thumbnail
                + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model
                + ' on CSE Motors" /></a>'
            grid += '<div class="namePrice">'
            grid += '<hr />'
            grid += '<h2>'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id + '" title="View '
                + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
                + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
            grid += '</h2>'
            grid += '<span>$'
                + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
            grid += '</div>'
            grid += '</li>'
        })
        grid += '</ul>'
    } else {
        grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
}
Util.buildClassificationList = async function (classification_id = null) {
    let data = await invModel.getClassifications()
    let classificationList =
        '<select name="classification_id" id="classificationList" required>'
    classificationList += "<option value=''>Choose a Classification</option>"
    data.rows.forEach((row) => {
        classificationList += '<option value="' + row.classification_id + '"'
        if (
            classification_id != null &&
            row.classification_id == classification_id
        ) {
            classificationList += " selected "
        }
        classificationList += ">" + row.classification_name + "</option>"
    })
    classificationList += "</select>"
    return classificationList
}
Util.buildInventoryList = async function (data) {
    let invList =
        '<select name="inv_id" id="invList" required>'
    invList += "<option value=''>Choose a vehicle</option>"
    console.log(data)
    data.rows.forEach((row) => {

        invList += '<option value="' + row.inv_id + '"'
        invList += ">" + row.inv_make + ", " + row.inv_model + "</option>"
    })
    invList += "</select>"
    return invList
}
Util.buildRepairList = async function (data) {
    let repairList = "<tbody>"
    console.log("Repair data " + data)
    data.forEach(async row => {
        console.log(row)
        let vehicle = await invModel.getVehicleById(row.inv_id)
        repairList += `
        <tr>
            <td>${vehicle.inv_make} ${vehicle.inv_model}</td>
            <td>${row.repair_description}</td>
            <td>${row.repair_date}</td>
            <td>${row.repair_cost}</td>
        </tr>`
    })
    repairList += "</tbody>"
    return repairList
}
Util.buildGetVehicleDetails = async function (data) {
    let detail = `
        <article id = 'detail-vehicle'>
            <section id = 'detail-image'>
                <img src = '${data.inv_image}' alt = '${data.inv_model} image'>
            </section>
            <section id = 'detail-info'>
                <div id = 'detail-highlight'>
                    <h2>${data.inv_year} ${data.inv_make}, ${data.inv_model}</h2>
                    <p id = 'detail-price'>$${new Intl.NumberFormat('en-US').format(data.inv_price)}</p>
                </div>
                <div id = 'detail-other'>
                    <p><span>Ext. Color:</span> ${data.inv_color}</p>
                    <p><span>Mileage:</span> ${new Intl.NumberFormat('en-US').format(data.inv_miles)} miles</p>
                    <p><span>Description:</span> ${data.inv_description}</p>
                </div>
                
                
            </section>
            
        </article>
    `
    return detail;
}
Util.getOptionsLinks = async function (options) {
    let triggers = "<ul id='management-options'>"
    options.forEach(option => {
        triggers += `<a href = '../../inv/add-${option}'>Add new ${option}</a>`
    })
    triggers += "</ul>"
    return triggers

}
/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
    if (req.cookies.jwt) {
        jwt.verify(
            req.cookies.jwt,
            process.env.ACCESS_TOKEN_SECRET,
            function (err, accountData) {
                if (err) {
                    req.flash("Please log in")
                    res.clearCookie("jwt")
                    return res.redirect("/account/login")
                }
                console.log("Account data")
                console.log(accountData)
                res.locals.accountData = accountData
                res.locals.loggedin = 1
                next()
            })
    } else {
        next()
    }
}
Util.checkLogin = (req, res, next) => {
    if (res.locals.loggedin) {
        next()
    } else {
        req.flash("notice", "Please log in.")
        return res.redirect("/account/login")
    }
}
Util.checkAccountType = (req, res, next) => {
    if (res.locals.accountData.account_type == "Employee" || res.locals.accountData.account_type == "Admin") {
        next()
    } else {
        req.flash("notice", "You do not have the permissions for this section")
        return res.redirect("/account/")
    }
}
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
module.exports = Util