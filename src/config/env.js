import dotenv from "dotenv";
import path from "node:path";

dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});

export const env = {
  port: process.env.PORT || 3333,
  frontendUrl: process.env.FRONTEND_URL,
  notionApiKey: process.env.NOTION_API_KEY,
  notionDatabaseId: process.env.NOTION_DATABASE_ID,
  notionVersion: process.env.NOTION_VERSION || "2022-06-28",
};