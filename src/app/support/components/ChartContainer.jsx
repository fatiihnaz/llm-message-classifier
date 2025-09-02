"use client";

export default function ChartContainer({
  title,
  children,
  className = "",
  height = "h-64",
}) {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-5 hover:border-gray-300 transition-colors ${className}`}>
      <div className="mb-3">
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        <p className="text-xs text-gray-500 mt-0.5">Güncel telemetri verileri</p>
      </div>
      <div className={height}>{children}</div>
    </div>
  );
}
