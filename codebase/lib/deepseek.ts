type DeepSeekResponse = {
  choices?: Array<{
    finish_reason?: string;
    message?: { content?: string; reasoning_content?: string };
  }>;
  usage?: Record<string, unknown>;
  error?: { message?: string };
};

export async function callDeepSeekJson(
  prompt: string,
  options: { maxTokens?: number; signal?: AbortSignal } = {},
) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) throw new Error("DEEPSEEK_API_KEY is not configured");

  const model = process.env.DEEPSEEK_MODEL ?? "deepseek-v4-flash";
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45_000);
  const signal = options.signal
    ? AbortSignal.any([options.signal, controller.signal])
    : controller.signal;
  const startedAt = Date.now();

  try {
    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      signal,
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
        thinking: { type: "disabled" },
        temperature: 0.2,
        max_tokens: options.maxTokens ?? 5000,
        response_format: { type: "json_object" },
      }),
    });

    const raw = (await response.json()) as DeepSeekResponse;
    if (!response.ok) {
      throw new Error(raw.error?.message ?? `DeepSeek API ${response.status}`);
    }
    const choice = raw.choices?.[0];
    const text = choice?.message?.content;
    if (!text || choice?.finish_reason === "length") {
      throw new Error("DeepSeek không trả về JSON hoàn chỉnh");
    }

    return {
      value: JSON.parse(text) as unknown,
      meta: {
        model,
        durationMs: Date.now() - startedAt,
        finishReason: choice.finish_reason ?? "unknown",
        usage: raw.usage ?? {},
      },
    };
  } finally {
    clearTimeout(timeout);
  }
}
