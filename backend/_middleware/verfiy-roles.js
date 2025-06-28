/**
 * Verify User Roles
 */
const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.auth_params) {
            return res.status(401).json({
                status: false,
                message: 'Unauthorized! : You are not authorized to perform this request!',
            });
        } else {
            const rolesArray = [...allowedRoles];
            const auth_params = req.auth_params;
            const result = rolesArray.includes(auth_params.role_id);
            if (!result) {
                return res.status(401).json({
                    status: false,
                    message: 'Unauthorized! : You are not authorized to perform this request!',
                });
            } else {
                next();
            }
        }
    }
}
module.exports = verifyRoles;