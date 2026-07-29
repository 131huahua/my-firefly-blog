/**
 * GitHub OAuth 授权入口
 * Decap CMS 点击"登录"时调用此接口，重定向到 GitHub 授权页面
 */
export default async function handler(req, res) {
  const { GITHUB_CLIENT_ID, GITHUB_OAUTH_HOST = "https://github.com" } =
    process.env;

  if (!GITHUB_CLIENT_ID) {
    return res.status(500).json({
      error: "GITHUB_CLIENT_ID 环境变量未设置",
      hint: "请在 Vercel 项目设置中添加 GITHUB_CLIENT_ID 和 GITHUB_CLIENT_SECRET",
    });
  }

  const proto = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const redirectUri = `${proto}://${host}/api/callback`;

  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    redirect_uri: redirectUri,
    scope: "repo,user",
  });

  res.writeHead(302, {
    Location: `${GITHUB_OAUTH_HOST}/login/oauth/authorize?${params}`,
  });
  res.end();
}
