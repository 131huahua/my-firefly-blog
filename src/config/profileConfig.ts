import type { ProfileConfig } from "../types/profileConfig";
import { loadSiteSettings } from "../utils/settings-loader";

const settings = loadSiteSettings();

// 动态构建链接列表：只有填写了对应信息的链接才会显示
function buildLinks(): ProfileConfig["links"] {
	const links: ProfileConfig["links"] = [];

	if (settings.qq) {
		links.push({
			name: "qq",
			icon: "fa7-brands:qq",
			url: `https://qm.qq.com/q/${settings.qq}`,
			showName: false,
		});
	}

	if (settings.github) {
		links.push({
			name: "GitHub",
			icon: "fa7-brands:github",
			url: `https://github.com/${settings.github}`,
			showName: false,
		});
	}

	if (settings.email) {
		links.push({
			name: "Email",
			icon: "fa7-solid:envelope",
			url: `mailto:${settings.email}`,
			showName: false,
		});
	}

	// RSS 始终显示
	links.push({
		name: "RSS",
		icon: "fa7-solid:rss",
		url: "/rss/",
		showName: false,
	});

	return links;
}

export const profileConfig: ProfileConfig = {
	// 头像
	// 图片路径支持三种格式：
	// 1. public 目录（以 "/" 开头，不优化）："/assets/images/avatar.webp"
	// 2. src 目录（不以 "/" 开头，自动优化但会增加构建时间，推荐）："assets/images/avatar.webp"
	// 3. 远程 URL："https://example.com/avatar.jpg"
	// 📌 可通过后台 CMS → 站点设置 在线修改，无需改代码
	avatar: settings.profile_avatar || "assets/images/avatar.avif",

	// 名字
	name: settings.profile_name || "Firefly",

	// 个人签名
	bio: settings.profile_bio || "Hello, I'm Firefly.",

	// 链接配置
	// 📌 通过后台 CMS → 站点设置 填写对应信息即可自动显示/隐藏链接
	links: buildLinks(),
};
