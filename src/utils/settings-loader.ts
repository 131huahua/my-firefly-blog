/**
 * 站点设置加载器
 * 从 Decap CMS 管理的 site.json 读取设置。
 * 自动展平嵌套结构，保持配置文件的简单写法。
 * 如果文件不存在或字段为空，回退到 TypeScript 默认值。
 */
import fs from "node:fs";
import path from "node:path";

export interface SiteSettings {
  title?: string;
  subtitle?: string;
  description?: string;
  site_url?: string;

  theme_hue?: number;
  theme_default_mode?: string;

  profile_name?: string;
  profile_bio?: string;
  profile_avatar?: string;

  github?: string;
  email?: string;
  qq?: string;

  nav_bar_title?: string;
  nav_bar_logo?: string;

  sidebar_position?: string;
  sidebar_tablet_side?: string;

  post_list_layout?: string;
  post_list_description_lines?: number;
  post_list_show_tags?: boolean;
  post_per_page?: number;

  wallpaper_mode?: string;
  wallpaper_url?: string;
  wallpaper_dim?: number;

  card_border?: boolean;
  card_follow_theme?: boolean;

  page_friends?: boolean;
  page_guestbook?: boolean;
  page_sponsor?: boolean;
  page_gallery?: boolean;
  page_bangumi?: boolean;
  page_anime?: boolean;
  page_dynamic?: boolean;

  category_bar?: boolean;
  fold_article?: boolean;

  footer_html?: string;
  footer_enable?: boolean;

  font_family?: string;

  sakura_enable?: boolean;
}

let cachedSettings: SiteSettings | null = null;
let lastCheckTime = 0;

/**
 * 展平嵌套对象
 * { basic_info: { title: "x" } } → { title: "x" }
 */
function flatten(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    if (val !== null && typeof val === "object" && !Array.isArray(val)) {
      Object.assign(result, val as Record<string, unknown>);
    } else {
      result[key] = val;
    }
  }
  return result;
}

export function loadSiteSettings(): SiteSettings {
  const now = Date.now();
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
        cachedSettings = flatten(parsed) as SiteSettings;
        lastCheckTime = now;
        return cachedSettings;
      }
    }
  } catch {
    // 文件损坏或不存在
  }

  return {};
}
