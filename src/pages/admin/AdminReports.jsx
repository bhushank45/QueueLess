import { useEffect, useMemo, useState } from "react";
import { Download, FileSpreadsheet, Filter } from "lucide-react";
import { collection, onSnapshot } from "firebase/firestore";

import AdminPageLayout from "../../components/admin/AdminPageLayout";
import { db } from "../../firebase/firebase";

const terminalStatuses = new Set([
  "completed",
  "skipped",
  "no_show",
  "left",
]);

const outcomeLabels = {
  completed: "Completed",
  skipped: "Skipped",
  no_show: "No-show",
  left: "Left",
};

function localDateInputValue(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function toDate(value) {
  if (!value) return null;
  if (typeof value.toDate === "function") return value.toDate();
  if (value instanceof Date) return value;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function terminalDate(queue) {
  return toDate(
    queue.completedAt ||
      queue.skippedAt ||
      queue.noShowAt ||
      queue.leftAt ||
      queue.joinedAt
  );
}

function formatDateTime(value) {
  const date = toDate(value);
  return date ? date.toLocaleString() : "—";
}

function minutesBetween(start, end) {
  const startDate = toDate(start);
  const endDate = toDate(end);
  if (!startDate || !endDate || endDate < startDate) return null;
  return Math.round((endDate - startDate) / 60000);
}

function average(values) {
  const validValues = values.filter(Number.isFinite);
  if (!validValues.length) return 0;
  return Math.round(
    validValues.reduce((total, value) => total + value, 0) /
      validValues.length
  );
}

function AdminReports() {
  const today = localDateInputValue();
  const [services, setServices] = useState([]);
  const [queues, setQueues] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

  useEffect(() => {
    const unsubscribeServices = onSnapshot(
      collection(db, "services"),
      (snapshot) => {
        setServices(
          snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))
        );
      },
      (loadError) => {
        console.error("Report services listener error:", loadError);
        setError("Unable to load services for the report.");
      }
    );

    const unsubscribeQueues = onSnapshot(
      collection(db, "queues"),
      (snapshot) => {
        setQueues(
          snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))
        );
        setLoading(false);
      },
      (loadError) => {
        console.error("Report queues listener error:", loadError);
        setError("Unable to load queue history. Check admin Firestore access.");
        setLoading(false);
      }
    );

    const unsubscribeUsers = onSnapshot(
      collection(db, "users"),
      (snapshot) => {
        const userMap = {};
        snapshot.docs.forEach((item) => {
          userMap[item.id] = item.data();
        });
        setUsers(userMap);
      },
      (loadError) => {
        console.error("Report user listener error:", loadError);
      }
    );

    return () => {
      unsubscribeServices();
      unsubscribeQueues();
      unsubscribeUsers();
    };
  }, []);

  const serviceNames = useMemo(
    () => Object.fromEntries(services.map((service) => [service.id, service.name])),
    [services]
  );

  const reportRows = useMemo(() => {
    const rangeStart = startDate
      ? new Date(`${startDate}T00:00:00`)
      : null;
    const rangeEnd = endDate
      ? new Date(`${endDate}T23:59:59.999`)
      : null;

    return queues
      .filter((queue) => terminalStatuses.has(queue.status))
      .filter((queue) => serviceFilter === "all" || queue.serviceId === serviceFilter)
      .filter((queue) => {
        const reportDate = terminalDate(queue);
        if (!reportDate) return false;
        return (!rangeStart || reportDate >= rangeStart) &&
          (!rangeEnd || reportDate <= rangeEnd);
      })
      .map((queue) => {
        const user = users[queue.userId] || {};
        const finishAt =
          queue.completedAt || queue.skippedAt || queue.noShowAt || queue.leftAt;
        const waitMinutes = minutesBetween(
          queue.joinedAt,
          queue.startedAt || finishAt
        );
        const serviceMinutes =
          queue.status === "completed"
            ? minutesBetween(queue.startedAt, queue.completedAt)
            : null;

        return {
          ...queue,
          customerName:
            queue.userName || user.name || user.fullName || user.email || "Unknown user",
          customerEmail: queue.userEmail || user.email || "",
          serviceName: queue.serviceName || serviceNames[queue.serviceId] || "Unknown service",
          outcome: outcomeLabels[queue.status] || queue.status,
          finishedAt: finishAt,
          waitMinutes,
          serviceMinutes,
        };
      })
      .sort((a, b) => {
        const dateA = terminalDate(a)?.getTime() || 0;
        const dateB = terminalDate(b)?.getTime() || 0;
        return dateB - dateA;
      });
  }, [queues, users, serviceNames, serviceFilter, startDate, endDate]);

  const summary = useMemo(() => ({
    total: reportRows.length,
    completed: reportRows.filter((row) => row.status === "completed").length,
    skipped: reportRows.filter((row) => row.status === "skipped").length,
    noShow: reportRows.filter((row) => row.status === "no_show").length,
    left: reportRows.filter((row) => row.status === "left").length,
    averageWait: average(reportRows.map((row) => row.waitMinutes)),
    averageService: average(
      reportRows
        .filter((row) => row.status === "completed")
        .map((row) => row.serviceMinutes)
    ),
  }), [reportRows]);

  const handleExport = async () => {
    const XLSX = await import("xlsx-js-style");
    const workbook = XLSX.utils.book_new();
    const selectedServiceName =
      serviceFilter === "all"
        ? "All services"
        : serviceNames[serviceFilter] || "Selected service";
    const rows = [
      ["QueueLess Queue Report"],
      ["Service", selectedServiceName, "Date range", `${startDate || "Any"} to ${endDate || "Any"}`],
      [],
      ["Total visits", "Completed", "Skipped / no-show", "Left queue"],
      [summary.total, summary.completed, summary.skipped + summary.noShow, summary.left],
      [],
      ["Queue details"],
      ["CUSTOMER", "SERVICE / TOKEN", "STATUS", "JOINED", "FINISHED", "WAIT"],
      ...reportRows.map((row) => [
        [row.customerName, row.customerEmail || "—"].join("\n"),
        [row.serviceName, row.token || `#${row.tokenNumber ?? "—"}`].join("\n"),
        row.outcome,
        formatDateTime(row.joinedAt),
        formatDateTime(row.finishedAt),
        row.waitMinutes == null ? "—" : `${row.waitMinutes} min`,
      ]),
    ];
    const reportSheet = XLSX.utils.aoa_to_sheet(rows);
    reportSheet["!cols"] = [
      { wch: 32 },
      { wch: 32 },
      { wch: 20 },
      { wch: 26 },
      { wch: 26 },
      { wch: 14 },
    ];
    reportSheet["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } },
      { s: { r: 6, c: 0 }, e: { r: 6, c: 5 } },
    ];
    reportSheet["!rows"] = rows.map((_, index) => ({
      hpt:
        index === 0 ? 28 : index === 3 || index === 4 ? 24 : index >= 8 ? 36 : 20,
    }));
    reportSheet["!autofilter"] = {
      ref: `A8:F${rows.length}`,
    };
    const setCellStyle = (row, column, style) => {
      const address = XLSX.utils.encode_cell({ r: row, c: column });
      if (reportSheet[address]) {
        reportSheet[address].s = style;
      }
    };
    const thinBottomBorder = {
      bottom: { style: "thin", color: { rgb: "FFE2E8F0" } },
    };

    setCellStyle(0, 0, {
      font: { name: "Aptos Display", sz: 16, bold: true, color: { rgb: "FFFFFFFF" } },
      fill: { fgColor: { rgb: "FF1D5EFF" } },
      alignment: { vertical: "center" },
    });
    [0, 2].forEach((column) =>
      setCellStyle(1, column, {
        font: { bold: true, color: { rgb: "FF334155" } },
        fill: { fgColor: { rgb: "FFF1F5F9" } },
        alignment: { vertical: "center" },
      })
    );
    [1, 3].forEach((column) =>
      setCellStyle(1, column, {
        font: { color: { rgb: "FF334155" } },
        alignment: { vertical: "center" },
      })
    );
    [0, 1, 2, 3].forEach((column) => {
      setCellStyle(3, column, {
        font: { bold: true, color: { rgb: "FF475569" } },
        fill: { fgColor: { rgb: "FFF1F5F9" } },
        alignment: { horizontal: "center", vertical: "center", wrapText: true },
        border: thinBottomBorder,
      });
      setCellStyle(4, column, {
        font: { sz: 14, bold: true, color: { rgb: "FF1D4ED8" } },
        fill: { fgColor: { rgb: "FFEFF6FF" } },
        alignment: { horizontal: "center", vertical: "center" },
        border: thinBottomBorder,
      });
    });
    setCellStyle(6, 0, {
      font: { sz: 12, bold: true, color: { rgb: "FF0F172A" } },
      fill: { fgColor: { rgb: "FFF8FAFC" } },
      alignment: { vertical: "center" },
      border: thinBottomBorder,
    });
    for (let column = 0; column < 6; column += 1) {
      setCellStyle(7, column, {
        font: { bold: true, color: { rgb: "FF64748B" } },
        fill: { fgColor: { rgb: "FFF1F5F9" } },
        alignment: { vertical: "center", horizontal: "left", wrapText: true },
        border: thinBottomBorder,
      });
    }
    reportRows.forEach((row, index) => {
      const excelRow = index + 8;
      const baseStyle = {
        fill: { fgColor: { rgb: index % 2 === 0 ? "FFFFFFFF" : "FFF8FAFC" } },
        alignment: { vertical: "center", wrapText: true },
        border: thinBottomBorder,
      };
      for (let column = 0; column < 6; column += 1) {
        setCellStyle(excelRow, column, baseStyle);
      }
      const statusStyle = {
        completed: { fill: "FFECFDF5", color: "FF047857" },
        skipped: { fill: "FFFFFBEB", color: "FFB45309" },
        "no-show": { fill: "FFFEF2F2", color: "FFB91C1C" },
        left: { fill: "FFF1F5F9", color: "FF475569" },
      }[row.outcome.toLowerCase()];
      if (statusStyle) {
        setCellStyle(excelRow, 2, {
          font: { bold: true, color: { rgb: statusStyle.color } },
          fill: { fgColor: { rgb: statusStyle.fill } },
          alignment: { vertical: "center" },
          border: thinBottomBorder,
        });
      }
    });
    XLSX.utils.book_append_sheet(workbook, reportSheet, "Queue Report");

    const serviceSlug =
      serviceFilter === "all"
        ? "all-services"
        : (serviceNames[serviceFilter] || "service")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");
    XLSX.writeFile(
      workbook,
      `queueless-report-${serviceSlug}-${startDate || "all"}-to-${endDate || "all"}.xlsx`
    );
  };

  return (
    <AdminPageLayout
      title="Queue Reports"
      description="Review completed queue visits and export service outcomes."
    >
      <div className="space-y-6 p-5 sm:p-8">
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Filter className="h-4 w-4 text-blue-600" />
            <h2 className="font-semibold text-slate-900">Report filters</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <label className="text-sm font-medium text-slate-700">
              Service
              <select
                value={serviceFilter}
                onChange={(event) => setServiceFilter(event.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5"
              >
                <option value="all">All services</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>{service.name}</option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium text-slate-700">
              From
              <input
                type="date"
                value={startDate}
                max={endDate || undefined}
                onChange={(event) => setStartDate(event.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5"
              />
            </label>
            <label className="text-sm font-medium text-slate-700">
              To
              <input
                type="date"
                value={endDate}
                min={startDate || undefined}
                onChange={(event) => setEndDate(event.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5"
              />
            </label>
            <div className="flex items-end">
              <button
                type="button"
                onClick={handleExport}
                disabled={loading || reportRows.length === 0}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                <Download className="h-4 w-4" />
                Export Excel
              </button>
            </div>
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ["Total visits", summary.total],
            ["Completed", summary.completed],
            ["Skipped / no-show", summary.skipped + summary.noShow],
            ["Left queue", summary.left],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm text-slate-500">{label}</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
            </div>
          ))}
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4 text-blue-600" />
              <h2 className="font-semibold text-slate-900">Queue details</h2>
            </div>
            <span className="text-sm text-slate-500">{reportRows.length} records</span>
          </div>
          {loading ? (
            <p className="p-8 text-center text-sm text-slate-500">Loading queue history…</p>
          ) : reportRows.length === 0 ? (
            <p className="p-8 text-center text-sm text-slate-500">
              No completed, skipped, no-show, or left queue records match these filters.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Service / token</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Joined</th>
                    <th className="px-4 py-3">Finished</th>
                    <th className="px-4 py-3">Wait</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {reportRows.map((row) => (
                    <tr key={row.id}>
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-900">{row.customerName}</p>
                        <p className="text-xs text-slate-500">{row.customerEmail || "—"}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-slate-800">{row.serviceName}</p>
                        <p className="text-xs font-semibold text-blue-700">{row.token || `#${row.tokenNumber ?? "—"}`}</p>
                      </td>
                      <td className="px-4 py-3">{row.outcome}</td>
                      <td className="px-4 py-3 text-slate-600">{formatDateTime(row.joinedAt)}</td>
                      <td className="px-4 py-3 text-slate-600">{formatDateTime(row.finishedAt)}</td>
                      <td className="px-4 py-3 text-slate-600">{row.waitMinutes == null ? "—" : `${row.waitMinutes} min`}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </AdminPageLayout>
  );
}

export default AdminReports;
