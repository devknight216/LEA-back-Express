const ROLES = require('../constants/role');

const METHOD_RULES = {
    INDEX: [ROLES.ADMIN],
    CREATE: [ROLES.ADMIN],
    UPDATE: [ROLES.ADMIN],
    DELETE: [ROLES.ADMIN],
    READ: [ROLES.ADMIN]
}

const usersManagePermission = methodType => (req, res, next) => {
    if (!req.user) return res.status(401).json({error: 'Unauthorized'});

    if (METHOD_RULES[methodType].includes(req.user.role) || req.params.id === req.user.id  || req.body.userId === req.user.id) return next();

    return res.status(405).json({error: 'Method Not Allowed'});
}

module.exports = usersManagePermission;