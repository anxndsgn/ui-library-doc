import { Tabs } from "@base-ui/react/tabs";
import { Eye, FileCode2 } from "lucide-react";
import { Children, isValidElement, useMemo, type ReactElement, type ReactNode } from "react";
import { buttonVariants } from "registry/default/ui/button";
import { ComponentSource } from "./component-source";

type TabValue = "preview" | "source";

export function ComponentTabs({
  children,
  preview,
  source,
  defaultValue = "preview",
}: {
  children?: ReactNode;
  preview?: ReactNode;
  source?: ReactNode | string;
  defaultValue?: TabValue;
}) {
  const slots = useMemo(() => resolveSlots(children, preview, source), [children, preview, source]);

  return (
    <Tabs.Root className="relative overflow-hidden" defaultValue={defaultValue}>
      <Tabs.List className="mb-2 flex gap-1 overflow-x-auto" aria-label="Component view">
        <Tabs.Tab
          value="preview"
          className={buttonVariants({
            variant: "ghost",
            size: "lg",
            className:
              "min-h-10 px-3 font-bold text-muted-foreground hover:bg-accent hover:text-accent-foreground data-active:bg-accent data-active:text-accent-foreground",
          })}
        >
          <Eye size={16} aria-hidden="true" />
          Preview
        </Tabs.Tab>
        <Tabs.Tab
          value="source"
          className={buttonVariants({
            variant: "ghost",
            size: "lg",
            className:
              "min-h-10 px-3 font-bold text-muted-foreground hover:bg-accent hover:text-accent-foreground data-active:bg-accent data-active:text-accent-foreground",
          })}
        >
          <FileCode2 size={16} aria-hidden="true" />
          Source
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="preview" className="block min-h-65 data-hidden:hidden">
        {slots.preview}
      </Tabs.Panel>
      <Tabs.Panel value="source" className="min-h-65 data-hidden:hidden [&>figure]:border-0">
        {slots.source}
      </Tabs.Panel>
    </Tabs.Root>
  );
}

function resolveSlots(children: ReactNode, preview?: ReactNode, source?: ReactNode | string) {
  const childArray = Children.toArray(children);
  const childPreview = childArray.find((child) => hasDisplayName(child, "ComponentPreview"));
  const childSource = childArray.find((child) => hasDisplayName(child, "ComponentSource"));

  return {
    preview: preview ?? childPreview ?? null,
    source:
      typeof source === "string" ? (
        <ComponentSource code={source} />
      ) : (
        (source ?? childSource ?? null)
      ),
  };
}

function hasDisplayName(child: ReactNode, displayName: string): child is ReactElement {
  return (
    isValidElement(child) &&
    typeof child.type !== "string" &&
    "displayName" in child.type &&
    child.type.displayName === displayName
  );
}
