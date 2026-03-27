export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    // Notion API proxy
    if (url.pathname.startsWith("/api/notion/")) {
      try {
        const notionPath = url.pathname.replace("/api/notion", "");
        const notionUrl = `https://api.notion.com/v1${notionPath}${url.search}`;

        const notionReq = new Request(notionUrl, {
          method: request.method,
          headers: {
            "Authorization": `Bearer ${env.NOTION_API_KEY}`,
            "Notion-Version": "2022-06-28",
            "Content-Type": "application/json",
          },
          body: request.method !== "GET" ? request.body : undefined,
        });

        const notionRes = await fetch(notionReq);
        const data = await notionRes.json();

        return new Response(JSON.stringify(data), {
          status: notionRes.status,
          headers: { ...cors, "Content-Type": "application/json" },
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: { ...cors, "Content-Type": "application/json" },
        });
      }
    }

    // Static assets
    try {
      return await env.ASSETS.fetch(request);
    } catch {
      return new Response("Not found", { status: 404 });
    }
  },
};
