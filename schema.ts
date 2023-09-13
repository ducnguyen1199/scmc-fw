import { list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import {
  text,
  relationship,
  password,
  timestamp,
  integer,
} from "@keystone-6/core/fields";
import { cloudinaryImage } from "@keystone-6/cloudinary";
import type { Lists } from ".keystone/types";

const cloudinary = cloudinaryImage({
  cloudinary: {
    cloudName: "ddmftgb3q",
    apiKey: "299646847629884",
    apiSecret: "m_NkmAGlQqC1w24AhdTB6zHwYEk",
    folder: "scmc",
  },
});

export const lists: Lists = {
  User: list({
    access: allowAll,
    fields: {
      name: text({ validation: { isRequired: true } }),
      email: text({
        validation: { isRequired: true },
        isIndexed: "unique",
      }),
      password: password({ validation: { isRequired: true } }),
      createdAt: timestamp({
        defaultValue: { kind: "now" },
      }),
    },
  }),
  Instagram: list({
    access: allowAll,
    fields: {
      name: text(),
      url: text(),
    },
  }),
  Motorcycle: list({
    access: allowAll,
    fields: {
      name: text({ validation: { isRequired: true } }),
      customs: relationship({
        ref: "Custom.motorcycles",
        many: true,
      }),
    },
  }),
  Custom: list({
    access: allowAll,
    fields: {
      name: text({ validation: { isRequired: true } }),
      thumbnail: cloudinary,
      banner: cloudinary,
      motorcycles: relationship({ ref: "Motorcycle.customs", many: true }),
      images: relationship({
        ref: "CustomImage.custom",
        many: true,
      }),
    },
  }),
  CustomImage: list({
    access: allowAll,
    ui: {
      hideCreate: true,
    },
    fields: {
      name: text({ validation: { isRequired: true } }),
      image: cloudinary,
      custom: relationship({ ref: "Custom.images", many: false }),
      width: integer({ validation: { isRequired: true } }),
      height: integer({ validation: { isRequired: true } }),
      timestamp: timestamp(),
    },
  }),
};
