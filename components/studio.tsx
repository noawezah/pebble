"use client";
import { NextStudio } from "next-sanity/studio";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "@/sanity/schema";
export default function Studio({
  projectId,
  dataset,
}: {
  projectId: string;
  dataset: string;
}) {
  const config = defineConfig({
    name: "pebble",
    title: "PEBBLE",
    projectId,
    dataset,
    basePath: "/studio",
    schema: { types: schemaTypes },
    plugins: [
      structureTool({
        structure: (S) =>
          S.list()
            .title("PEBBLE")
            .items([
              S.listItem()
                .title("Café content")
                .id("cafeSettings")
                .child(
                  S.document()
                    .schemaType("cafeSettings")
                    .documentId("pebble-cafe"),
                ),
            ]),
      }),
    ],
    document: { newDocumentOptions: () => [] },
  });
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "white",
        color: "#292b28",
      }}
    >
      <NextStudio config={config} />
    </div>
  );
}
