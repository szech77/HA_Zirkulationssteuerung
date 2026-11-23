export interface TimeWindow { start: string; end: string }
export interface ControlSettings { mode: 'monitoring' | 'active'; schedule: Record<string, TimeWindow[]>; vacation_active: boolean; vacation_windows: TimeWindow[] }
export type ImportHistory = (entryId: string) => Promise<void>
export interface HistoryImport {state:'idle'|'loading'|'complete'|'unavailable'|'error'; days:number; events:number; assumed_pump_off:boolean; until:string|null}
export type SaveSettings = (entryId: string, settings: ControlSettings, revision: number) => Promise<void>
export interface Reading { entity_id: string; name: string; value: number | null; unit: string | null; stale: boolean; updated_at: string | null }
export interface HeatWindow { start:string; end:string; offset:number; width:number; date?:string }
export interface HeatCell { observed_days: number; event_days: number; partial_days: number; ratio: number | null; sufficient: boolean; level: number | null; allowed_windows?:HeatWindow[]; planned_runs?:HeatWindow[] }
export interface Heatmap { planning?:{mode:'monitoring'|'active';vacation_active:boolean;horizon_days:number;next_start:string|null}; rows: { key: string; cells: HeatCell[] }[]; calendar_enabled: boolean; retention_days: number; minimum_coverage_minutes: number; minimum_observed_days: number; observed_dates: number }
export interface EntryStatus {
  entry_id: string; title: string; reason: string; status_level: 'normal' | 'warning' | 'error'; flow: Reading | null; buffer: Reading | null;
  pump: { entity_id: string; state: 'on' | 'off' | 'unknown' }; enabled: boolean; demand_automation: boolean;
  threshold: number; sample_size: number; learning_ready: boolean; daily_starts: number;
  max_starts: number; remaining_starts: number; runtime_seconds: number; next_start: string | null;
  settings: ControlSettings; settings_revision: number;
  history_import: HistoryImport | null;
  country: string | null; subdivision: string | null; heatmap: Heatmap | null;
}
export interface DashboardState { darkMode?: boolean; entries: EntryStatus[]; loading: boolean; error: string | null; updatedAt: string | null }
export interface HomeAssistant { themes?: { darkMode?: boolean }; callWS<T>(message: { type: string; [key: string]: unknown }): Promise<T> }
