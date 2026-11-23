export interface Reading { entity_id: string; name: string; value: number | null; unit: string | null; stale: boolean; updated_at: string | null }
export interface HeatCell { observed_days: number; event_days: number; partial_days: number; ratio: number | null; sufficient: boolean; level: number | null }
export interface Heatmap { rows: { key: string; cells: HeatCell[] }[]; calendar_enabled: boolean; retention_days: number; minimum_coverage_minutes: number; minimum_observed_days: number; observed_dates: number }
export interface EntryStatus {
  entry_id: string; title: string; reason: string; status_level: 'normal' | 'warning' | 'error'; flow: Reading | null; buffer: Reading | null;
  pump: { entity_id: string; state: 'on' | 'off' | 'unknown' }; enabled: boolean; demand_automation: boolean;
  threshold: number; sample_size: number; learning_ready: boolean; daily_starts: number;
  max_starts: number; remaining_starts: number; runtime_seconds: number; next_start: string | null;
  country: string | null; subdivision: string | null; heatmap: Heatmap | null;
}
export interface DashboardState { entries: EntryStatus[]; loading: boolean; error: string | null; updatedAt: string | null }
export interface HomeAssistant { callWS<T>(message: { type: string }): Promise<T> }
