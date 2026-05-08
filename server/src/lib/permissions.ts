export type Permission = 'todo:read' | 'todo:write' | 'todo:delete' | 'user:read' | 'user:manage'

export type Role = 'USER' | 'ADMIN' | 'NONE'

export const rolePermissions: Record<Role, Permission[]> = {
  USER: ['todo:read', 'todo:write'],
  ADMIN: ['todo:read', 'todo:write', 'todo:delete', 'user:read', 'user:manage'],
  NONE: [],
}

export function hasPermission(role: Role, permission: Permission): boolean {
  return rolePermissions[role].includes(permission)
}
