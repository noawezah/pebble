import { defineArrayMember, defineField, defineType } from "sanity";

const localizedText = defineType({
  name: "localizedText",
  title: "English / Romanian",
  type: "object",
  fields: [
    defineField({
      name: "en",
      title: "English (primary)",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "ro",
      title: "Romanian",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
  ],
});
const cafeSettings = defineType({
  name: "cafeSettings",
  title: "PEBBLE café",
  type: "document",
  fields: [
    ...[
      ["heroTitle", "Hero heading"],
      ["heroText", "Hero introduction"],
      ["storyTitle", "Our place heading"],
      ["storyText", "Our place story"],
      ["coffeeText", "Coffee description"],
    ].map(([name, title]) =>
      defineField({ name, title, type: "localizedText" }),
    ),
    defineField({
      name: "address",
      title: "Street address",
      type: "string",
      initialValue: "Str. D. I. Mendeleev 10",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "postalCode",
      title: "Postal code",
      type: "string",
      initialValue: "030167",
    }),
    defineField({
      name: "weekdayHours",
      title: "Monday–Friday hours",
      type: "string",
      initialValue: "08:00–17:00",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "weekendHours",
      title: "Saturday–Sunday hours",
      type: "string",
      initialValue: "10:00–19:00",
      validation: (rule) => rule.required(),
    }),
    ...["instagram", "facebook", "maps"].map((name) =>
      defineField({
        name,
        title: name.charAt(0).toUpperCase() + name.slice(1),
        type: "url",
        validation: (rule) => rule.uri({ scheme: ["https"] }),
      }),
    ),
    defineField({
      name: "menu",
      title: "Menu",
      description:
        "Leave empty until the menu is ready. Only published items appear on the website.",
      type: "array",
      of: [
        defineArrayMember({
          name: "menuItem",
          title: "Drink / item",
          type: "object",
          fields: [
            defineField({
              name: "name",
              title: "Name",
              type: "localizedText",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "description",
              title: "Description (optional)",
              type: "localizedText",
            }),
            defineField({
              name: "price",
              title: "Price (RON)",
              type: "number",
              validation: (rule) => rule.required().min(0).precision(2),
            }),
          ],
          preview: {
            select: { title: "name.en", price: "price" },
            prepare: ({ title, price }) => ({
              title,
              subtitle: `${price ?? "—"} lei`,
            }),
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({
      title: "PEBBLE café",
      subtitle: "Website content, hours and menu",
    }),
  },
});
export const schemaTypes = [localizedText, cafeSettings];
