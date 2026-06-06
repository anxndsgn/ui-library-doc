import { ScrollArea } from "../ui/scroll-area";

const tags = Array.from({ length: 50 }).map((_, i) => `Tag ${i + 1}`);

export function ScrollAreaDemo() {
  return (
    <ScrollArea className="h-72 w-48 rounded-lg border border-border p-4">
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Tags</h4>
        {tags.map((tag) => (
          <div key={tag} className="text-sm text-muted-foreground">
            {tag}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
