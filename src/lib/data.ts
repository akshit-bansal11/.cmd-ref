import fs from "fs/promises";
import path from "path";

export interface ToolCommand {
  command: string;
  description: string;
  flags?: string[] | { name: string; description?: string }[];
  example?: string;
  options?: Record<string, unknown>;
}

export interface CommandCategory {
  title: string;
  commands: ToolCommand[];
}

export interface ToolData {
  name: string;
  slug: string;
  logo: string;
  accent: string;
  description: string;
  categories: CommandCategory[];
}

const DATA_DIR = path.join(process.cwd(), "src/data");

export async function getAllTools(): Promise<ToolData[]> {
  try {
    const files = await fs.readdir(DATA_DIR);
    const jsonFiles = files.filter(file => file.endsWith(".json"));
    
    const tools = await Promise.all(
      jsonFiles.map(async (file) => {
        const filePath = path.join(DATA_DIR, file);
        const data = await fs.readFile(filePath, "utf-8");
        return JSON.parse(data) as ToolData;
      })
    );
    
    return tools;
  } catch (error) {
    console.error("Error reading tools data:", error);
    return [];
  }
}

export async function getToolBySlug(slug: string): Promise<ToolData | null> {
  const tools = await getAllTools();
  return tools.find(tool => tool.slug === slug) || null;
}
