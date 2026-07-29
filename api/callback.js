/**
 * GitHub OAuth 回调处理
 * GitHub 授权后回调此接口，换取 access_token 并传给 Decap CMS
 */
export default async function handler(req, res) {
  const { code } = req.query;
  const {
    GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET,
    GITHUB_OAUTH_HOST = "https://github.com",
  } = process.env;

  if (!code) {
    return res.status(400).send(`
      <html><body style="font-family:system-ui;padding:40px;text-align:center">
        <h2>❌ 授权失败</h2>
        <p>未收到 GitHub 授权码</p>
        <a href="/admin/">返回后台</a>
      </body></html>
    `);
  }

  if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
    return res.status(500).send(`
      <html><body style="font-family:system-ui;padding:40px;text-align:center">
        <h2>⚠️ 服务器配置缺失</h2>
        <p>GITHUB_CLIENT_ID 或 GITHUB_CLIENT_SECRET 未设置</p>
        <p>请在 Vercel 环境变量中配置这两个值</p>
      </body></html>
    `);
  }

  try {
    const tokenRes = await fetch(
      `${GITHUB_OAUTH_HOST}/login/oauth/access_token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          client_id: GITHUB_CLIENT_ID,
          client_secret: GITHUB_CLIENT_SECRET,
          code,
        }),
      }
    );

    const data = await tokenRes.json();

    if (data.error) {
      return res.status(400).send(`
        <html><body style="font-family:system-ui;padding:40px;text-align:center">
          <h2>❌ 授权错误</h2>
          <p>${data.error_description || data.error}</p>
          <a href="/admin/">重试</a>
        </body></html>
      `);
    }

    // 将 token 传回 Decap CMS（通过 postMessage）
    res.setHeader("Content-Type", "text/html");
    res.send(`
      <!DOCTYPE html>
      <html><body><script>
        (function() {
          if (window.opener) {
            window.opener.postMessage(
              ${JSON.stringify(
                JSON.stringify({
                  token: data.access_token,
                  provider: "github",
                  backendName: "github",
                })
              )},
              "*"
            );
          }
          window.close();
        })();
      </script></body></html>
    `);
  } catch (err) {
    return res.status(500).send(`
      <html><body style="font-family:system-ui;padding:40px;text-align:center">
        <h2>❌ 网络错误</h2>
        <p>${err.message}</p>
        <a href="/admin/">重试</a>
      </body></html>
    `);
  }
}
