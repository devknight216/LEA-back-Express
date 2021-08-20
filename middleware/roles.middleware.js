const ROLES = require('../constants/role');

const METHOD_RULES = {
    INDEX: [ROLES.ADMIN, ROLES.USER],
    CREATE: [ROLES.ADMIN],
    UPDATE: [ROLES.ADMIN],
    DELETE: [ROLES.ADMIN],
    READ: [ROLES.ADMIN, ROLES.USER]
}

const checkRolePermission = methodType => (req, res, next) => {
    if (!req.user) return res.status(401).json({error: 'Unauthorized'});

    //console.log(req.user.role);

    if (METHOD_RULES[methodType].includes(req.user.role)) return next();

    return res.status(405).json({error: 'Method Not Allowed'});
}

module.exports = checkRolePermission;