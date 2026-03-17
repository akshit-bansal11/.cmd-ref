import { getAllTools, getToolBySlug } from "@/lib/data";
import { notFound } from "next/navigation";
import ToolReference from "@/components/ToolReference";

export async function generateStaticParams() {
  const tools = await getAllTools();
  return tools.map((tool) => ({
    tool: tool.slug,
  }));
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ tool: string }>;
}) {
  const { tool: slug } = await params;
  const toolData = await getToolBySlug(slug);

  if (!toolData) {
    notFound();
  }

  return <ToolReference data={toolData} />;
}
