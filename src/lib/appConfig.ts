import fs from "fs";
import path from "path";

const CONFIG_FILE = path.join(process.cwd(), "data", "config.json");

interface AppConfig {
  registrationEnabled: boolean;
  pauseUntil: string | null; // ISO string or null
}

const DEFAULT_CONFIG: AppConfig = {
  registrationEnabled: false,
  pauseUntil: null,
};

function ensureDataDir() {
  const dir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function getConfig(): AppConfig {
  ensureDataDir();
  if (!fs.existsSync(CONFIG_FILE)) {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(DEFAULT_CONFIG, null, 2));
    return DEFAULT_CONFIG;
  }
  try {
    const data = fs.readFileSync(CONFIG_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return DEFAULT_CONFIG;
  }
}

export function setConfig(config: Partial<AppConfig>) {
  const current = getConfig();
  const updated = { ...current, ...config };
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(updated, null, 2));
  return updated;
}

export function isRegistrationOpen() {
  const config = getConfig();
  if (!config.registrationEnabled) return false;
  
  if (config.pauseUntil) {
    const pauseTime = new Date(config.pauseUntil).getTime();
    if (Date.now() < pauseTime) return false;
  }
  
  return true;
}
