import { integer, relationship, select, text } from "@keystone-next/fields";
import { list } from "@keystone-next/keystone/schema";
import { isSignedIn, rules } from "../access";

export const CartItem = list({
  access: {
    create: isSignedIn,
    read: rules.canOrder,
    update: rules.canorder,
    delete: rules.canOrder,
  },
  fields: {
    //TODO: Custom Label in here
    quantity: integer({
      defaultValue: 1,
      isRequired: true,
    }),
    product: relationship({ ref: "Product" }),
    user: relationship({ ref: "User.cart" }),
  },
});
