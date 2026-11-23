"""Integration constants and persisted schema version."""
DOMAIN = "warmwasser_zirkulation"
CONF_FLOW_SENSOR = "flow_sensor"
CONF_BUFFER_SENSOR = "buffer_sensor"
CONF_PUMP_ENTITY = "pump_entity"
CONF_COUNTRY = "country"
CONF_SUBDIVISION = "subdivision"
CONF_RUNTIME_SECONDS = "runtime_seconds"
CONF_WATER_THRESHOLD = "water_threshold"
CONF_MAX_STARTS = "max_starts"
CONF_ENABLED = "enabled"
CONF_DEMAND_AUTOMATION = "demand_automation"
DEFAULT_RUNTIME_SECONDS = 120
DEFAULT_MAX_STARTS = 6
DEFAULT_WATER_THRESHOLD = 40.0


MAX_RUNTIME_SECONDS = 86_400
MAX_DAILY_STARTS = 100


# Payload and native HA storage schema version.
SCHEMA_VERSION = 3
