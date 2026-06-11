import type { MdTable } from "@/lib/schedule";
import { humanize } from "@/lib/nodeLabels";

function cleanCell(s: string): string {
  const stripped = s
    .replace(/~~(.*?)~~/g, "$1")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/`/g, "")
    .trim();
  return humanize(stripped);
}

function cellClass(text: string): string {
  if (!text || text === "—") return "text-line";
  if (/draft|排期|待|TBD/i.test(text)) return "text-accent";
  if (/\d{4}-\d{2}-\d{2}/.test(text)) return "text-ink";
  return "text-ink-soft";
}

export function TableView({ table }: { table: MdTable }) {
  // 过滤已迁出的删除线行（首列以 ~~ 开头）
  const rows = table.rows.filter((r) => !/^~~/.test(r[0] || ""));
  if (rows.length === 0) return null;

  return (
    <div className="overflow-x-auto rounded-lg border border-line bg-white">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-line bg-paper">
            {table.headers.map((h, i) => (
              <th
                key={i}
                className="whitespace-nowrap px-3 py-2 text-left text-xs font-semibold text-muted"
              >
                {cleanCell(h)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri} className="border-b border-line/60 last:border-0">
              {table.headers.map((_, ci) => {
                const text = cleanCell(r[ci] ?? "");
                return (
                  <td
                    key={ci}
                    className={`px-3 py-2 align-top ${ci === 0 ? "font-medium" : ""} ${cellClass(
                      text,
                    )}`}
                  >
                    {text || <span aria-hidden="true">·</span>}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
