import Role from '../models/Role.js';

export const requirePermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      // 1. ADMIN has unrestricted system-level authority
      if (req.user.role === 'ADMIN') {
        return next();
      }

      // 2. Fetch the user's role and populate its permissions
      const userRole = await Role.findOne({ name: req.user.role }).populate('permissions');
      
      if (!userRole) {
        return res.status(403).json({ success: false, message: 'Role not found', errorCode: 'FORBIDDEN' });
      }

      // 3. Extract permission strings
      const userPermissions = userRole.permissions.map(p => p.name);

      // 4. Combine with any user-specific custom permissions (if assigned directly to the User model)
      const totalPermissions = new Set([...userPermissions, ...(req.user.permissions || [])]);

      // 5. Check if the required permission exists
      if (!totalPermissions.has(requiredPermission)) {
        return res.status(403).json({ 
          success: false, 
          message: `Missing required permission: ${requiredPermission}`, 
          errorCode: 'FORBIDDEN' 
        });
      }

      // 6. Attach permissions to request for resource-level scoping later
      req.userPermissions = Array.from(totalPermissions);
      next();

    } catch (error) {
      return res.status(500).json({ success: false, message: 'Authorization error', errorCode: 'SERVER_ERROR' });
    }
  };
};