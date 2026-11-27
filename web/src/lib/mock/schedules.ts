import type { TaskSchedule } from "../types";

// Preview CRUD only: no timer, task execution or external side effects.
export function createMockSchedules() {
  let nextID = 1;
  let nextHistoryID = 1;
  const schedules = new Map<number, TaskSchedule>();
  const record = (item: TaskSchedule, action: string) => {
    const now = new Date().toISOString();
    item.last_transition_at = now;
    item.history = [
      { id: nextHistoryID++, action, success: true, message: "", created_at: now },
      ...(item.history ?? []),
    ];
  };
  return (method: string, path: string, body: Record<string, unknown>, validTaskIDs: Set<number>) => {
    if (path === "/schedules" && method === "GET") return { schedules: structuredClone([...schedules.values()]) };
    if (path === "/schedules" && method === "POST") {
      const input = normalize(body, validTaskIDs);
      const item: TaskSchedule = {
        ...input,
        id: nextID++,
        status: input.enabled ? "waiting" : "paused",
        run_count: 0,
        history: [],
      };
      schedules.set(item.id, item);
      return structuredClone(item);
    }
    const match = /^\/schedules\/(\d+)(?:\/(metadata|remark|pause|resume|run-now))?$/.exec(path);
    const item = match ? schedules.get(Number(match[1])) : undefined;
    if (!item) throw new Error("Schedule not found");
    const action = match?.[2];
    if (!action && method === "GET") return structuredClone(item);
    if (!action && method === "DELETE") {
      schedules.delete(item.id);
      return { ok: true };
    }
    if (!action && method === "PATCH") {
      const input = normalize(body, validTaskIDs);
      Object.assign(item, input, { status: input.enabled ? "waiting" : "paused" });
      return structuredClone(item);
    }
    if (action === "metadata" && method === "PATCH") {
      const name = String(body.name ?? "").trim();
      if (!name) throw new Error("Schedule name cannot be empty");
      item.name = name;
      return structuredClone(item);
    }
    if (action === "remark" && method === "PATCH") {
      item.remark = String(body.remark ?? "").trim();
      return structuredClone(item);
    }
    if ((action === "pause" || action === "resume") && method === "POST") {
      item.enabled = action === "resume";
      item.status = item.enabled ? "waiting" : "paused";
      record(item, item.status);
      return { ok: true, enabled: item.enabled };
    }
    if (action === "run-now" && method === "POST")
      throw new Error("Demo mode does not execute scheduled tasks; run in a live deployment");
    throw new Error("Schedule not found");
  };
}

function normalize(body: Record<string, unknown>, validTaskIDs: Set<number>): Omit<TaskSchedule, "id" | "status"> {
  const name = String(body.name ?? "").trim();
  if (!name) throw new Error("Schedule name cannot be empty");
  const timezone_mode = body.timezone_mode ?? "beijing";
  if (timezone_mode !== "beijing" && timezone_mode !== "system")
    throw new Error("Timezone must be Beijing Time or System Timezone");
  const schedule_type = body.schedule_type;
  if (schedule_type !== "once" && schedule_type !== "weekly")
    throw new Error("Schedule type must be once or weekly");
  const start_time = String(body.start_time ?? "");
  const end_time = String(body.end_time ?? "");
  const clock = /^([01]\d|2[0-3]):[0-5]\d$/;
  if (!clock.test(start_time)) throw new Error("Invalid start time format; use HH:MM");
  if (end_time && end_time !== "24:00" && !clock.test(end_time))
    throw new Error("Invalid end time format; use HH:MM");
  const run_date = schedule_type === "once" ? String(body.run_date ?? "") : "";
  const end_date = schedule_type === "once" ? String(body.end_date ?? "") : "";
  const weekdays = schedule_type === "weekly" && Array.isArray(body.weekdays) ? [...body.weekdays] : [];
  if (schedule_type === "once") {
    if (!validDate(run_date)) throw new Error("Invalid start date format");
    if (end_date && !validDate(end_date)) throw new Error("Invalid end date format");
    if (end_date && end_date < run_date) throw new Error("End date cannot be earlier than start date");
    if (end_date === run_date && end_time && end_time !== "24:00" && end_time <= start_time)
      throw new Error("End time must be later than start time on the same day");
  } else {
    if (!weekdays.length) throw new Error("Select at least one day for a weekly schedule");
    if (
      weekdays.some((day) => !Number.isInteger(day) || day < 1 || day > 7) ||
      new Set(weekdays).size !== weekdays.length
    )
      throw new Error("Weekdays must be unique values from Monday (1) to Sunday (7)");
    weekdays.sort((left, right) => left - right);
  }
  const task_ids = Array.isArray(body.task_ids) ? [...body.task_ids] : [];
  if (task_ids.length > 100) throw new Error("Select at most 100 tasks");
  if (task_ids.some((id) => !Number.isSafeInteger(id) || id < 1) || new Set(task_ids).size !== task_ids.length)
    throw new Error("Invalid or duplicate task IDs");
  for (const id of task_ids) if (!validTaskIDs.has(id)) throw new Error(`Task #${id} not found`);
  return {
    name,
    enabled: body.enabled !== false,
    timezone_mode,
    schedule_type,
    run_date,
    end_date,
    weekdays,
    start_time,
    end_time,
    start_immediately: body.start_immediately === true,
    task_ids,
    timezone: timezone_mode === "beijing" ? "Asia/Shanghai" : Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
}

function validDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}
