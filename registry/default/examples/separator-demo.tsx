import { Separator } from "../ui/separator";

export function SeparatorDemo() {
  return (
    <div className="w-80 space-y-2">
      <div className="flex h-5 items-center space-x-4 text-sm">
        <div>Blog</div>
        <Separator orientation="vertical" />
        <div>Docs</div>
        <Separator orientation="vertical" />
        <div>Source</div>
      </div>
      <Separator />
      <div className="flex h-5 items-center space-x-4 text-sm">
        <div>Overview</div>
        <Separator orientation="vertical" />
        <div>Analytics</div>
      </div>
    </div>
  );
}
