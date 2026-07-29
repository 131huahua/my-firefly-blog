/**
 * 站点设置加载器
 * 从 Decap CMS 管理的 site.json 读取设置，
 * 如果文件不存在或字段为空，回退到 TypeScript 配置的默认值
 */
import fs from "node:fs";
import path from "node:path";

interface SiteSettings {
  title?: string;
  subtitle?: string;
  description?: string;
  site_url?: string;
  profile_name?: string;
  profile_bio?: string;
  profile_avatar?: string;
  github?: string;
  email?: string;
  qq?: string;
}

let cachedSettings: SiteSettings | null = null;
let lastCheckTime = 0;

export function loadSiteSettings(): SiteSettings {
  const now = Date.now();
  // 开发模式下每次读取，生产模式下缓存（因为文件不会变）
  const isDev = process.env.NODE_ENV === "development";
  if (!isDev && cachedSettings && now - lastCheckTime < 60000) {
    return cachedSettings;
  }

  const settingsPath = path.resolve(
    process.cwd(),
    "src/content/settings/site.json"
  );

  try {
    if (fs.existsSync(settingsPath)) {
      const raw = fs.readFileSync(settingsPath, "utf-8");
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        cachedSettings = parsed;
        lastCheckTime = now;
        return parsed;
      }
    }
  } catch {
    // 文件损坏或不存在，返回空对象让调用方用默认值
  }

  return {};
}

/**
 * 安全地获取设置值，可指定默认值
 */
export function getSetting<K extends keyof SiteSettings>(
  key: K,
  defaultValue: string
): string {
  const settings = loadSiteSettings();
  return settings[key] || defaultValue;
}
