// At it's simplest, access control is either a yes or a no value depending on the user's session

import { permissionsList } from "./schemas/fields";
import { ListAccessArgs } from "./types";

export function isSignedIn({ session }: ListAccessArgs) {
  return !!session;
}

// Permissions check if someone meets a criteria - yes or no
const generatedPermissions = Object.fromEntries(
  permissionsList.map((permission) => [
    permission,
    function ({ session }: ListAccessArgs) {
      return !!session?.data.role?.[permission];
    },
  ])
);

export const permissions = {
  ...generatedPermissions,
};

// Rule based functions
// Rules can return a boolean or a filter which limits which products they can CRUD
export const rules = {
  canManageProducts({ session }) {
    if (!isSignedIn({ session })) {
      return false;
    }
    // 1. Do they have the permission of canManageProducts
    if (permissions.canManageProducts({ session })) {
      return true;
    }
    // 2. if not, do they own this item?
    return { user: { id: session.itemId } };
  },
  canOrder({ session }) {
    if (!isSignedIn({ session })) {
      return false;
    }
    // 1. Do they have the permission of canManageCart
    if (permissions.canManageCart({ session })) {
      return true;
    }
    // 2. if not, do they own this item?
    return { user: { id: session.itemId } };
  },
  canManageOrderItems({ session }) {
    if (!isSignedIn({ session })) {
      return false;
    }
    // 1. Do they have the permission of canManageCart
    if (permissions.canManageCart({ session })) {
      return true;
    }
    // 2. if not, do they own this item?
    return { order: { user: { id: session.itemId } } };
  },
  canReadProducts({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    }
    if (permissions.canManageProducts({ session })) {
      return true; //They can read everything
    }

    //They should only see available products (based on the status field)
    return { status: "AVAILABLE" };
  },
};
