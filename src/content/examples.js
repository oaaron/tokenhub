import { siteConfig } from "../config/site";
export function apiExamples(model = "qwen3.6-plus") {
  const url = siteConfig.apiBaseUrl || "${VELINK_API_BASE_URL}";
  return [
    {
      language: "Python",
      code: `import os\nfrom openai import OpenAI\n\nclient = OpenAI(\n    base_url=${siteConfig.apiBaseUrl ? JSON.stringify(url) : 'os.environ["VELINK_API_BASE_URL"]'},\n    api_key=os.environ["VELINK_API_KEY"],\n)\nresponse = client.chat.completions.create(\n    model=${JSON.stringify(model)},\n    messages=[{"role": "user", "content": "请介绍一下你的能力。"}],\n)\nprint(response.choices[0].message.content)`,
    },
    {
      language: "Node.js",
      code: `import OpenAI from 'openai';\n\nconst client = new OpenAI({\n  baseURL: ${siteConfig.apiBaseUrl ? JSON.stringify(url) : "process.env.VELINK_API_BASE_URL"},\n  apiKey: process.env.VELINK_API_KEY,\n});\nconst response = await client.chat.completions.create({\n  model: ${JSON.stringify(model)},\n  messages: [{ role: 'user', content: '请介绍一下你的能力。' }],\n});\nconsole.log(response.choices[0].message.content);`,
    },
    {
      language: "cURL",
      code: `curl "${url}/chat/completions" \\\n  -H "Authorization: Bearer $VELINK_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '${JSON.stringify({ model, messages: [{ role: "user", content: "请介绍一下你的能力。" }] }, null, 2)}'`,
    },
  ];
}
