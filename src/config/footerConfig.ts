import type { FooterConfig } from "../types/footerConfig";
import { loadSiteSettings } from "../utils/settings-loader";

const settings = loadSiteSettings();

export const footerConfig: FooterConfig = {
	// 是否启用Footer HTML注入功能 — 📌 可通过后台 CMS → 站点设置 在线修改
	enable: settings.footer_enable ?? false,
};

// 直接编辑 config/FooterConfig.html 文件来添加备案号等自定义内容
