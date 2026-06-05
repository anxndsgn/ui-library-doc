export type PropRow = {
  name: string;
  type: string;
  default?: string;
  description: string;
};

export function PropsTable({ rows }: { rows: Array<PropRow> }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-card">
      <table className="w-full min-w-[680px] border-collapse">
        <thead>
          <tr>
            <th className="border-b border-border px-3.5 py-3 text-left align-top text-xs font-bold text-muted-foreground">
              Prop
            </th>
            <th className="border-b border-border px-3.5 py-3 text-left align-top text-xs font-bold text-muted-foreground">
              Type
            </th>
            <th className="border-b border-border px-3.5 py-3 text-left align-top text-xs font-bold text-muted-foreground">
              Default
            </th>
            <th className="border-b border-border px-3.5 py-3 text-left align-top text-xs font-bold text-muted-foreground">
              Description
            </th>
          </tr>
        </thead>
        <tbody className="[&_tr:last-child_td]:border-b-0">
          {rows.map((row) => (
            <tr key={row.name}>
              <td className="border-b border-border px-3.5 py-3 text-left align-top text-[0.92rem] leading-6 text-foreground">
                <code>{row.name}</code>
              </td>
              <td className="border-b border-border px-3.5 py-3 text-left align-top text-[0.92rem] leading-6 text-foreground">
                <code>{row.type}</code>
              </td>
              <td className="border-b border-border px-3.5 py-3 text-left align-top text-[0.92rem] leading-6 text-foreground">
                {row.default ? <code>{row.default}</code> : "-"}
              </td>
              <td className="border-b border-border px-3.5 py-3 text-left align-top text-[0.92rem] leading-6 text-foreground">
                {row.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
