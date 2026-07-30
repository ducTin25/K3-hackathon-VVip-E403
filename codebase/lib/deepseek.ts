type DeepSeekResponse = {
  choices?: Array<{
    finish_reason?: string;
    message?: { content?: string; reasoning_content?: string };
  }>;
  usage?: Record<string, unknown>;
  error?: { message?: string };
};

const VIETNAMESE_OUTPUT_SYSTEM_PROMPT = `Bạn là AI phục vụ người học Việt Nam trong hệ thống VLearn.

QUY TẮC NGÔN NGỮ BẮT BUỘC
- Mọi nội dung hướng đến người học phải viết bằng tiếng Việt tự nhiên, rõ ràng và đúng chính tả.
- Chỉ giữ tiếng Anh cho thuật ngữ chuyên ngành đã được dùng phổ biến hoặc không nên dịch, ví dụ: AI Agent, LLM, ReAct, Thought, Action, Observation, Tool Calling, Function Calling, API, system prompt, prompt injection.
- Khi giữ thuật ngữ tiếng Anh, phần giải thích, câu hỏi và ngữ cảnh xung quanh vẫn phải là tiếng Việt.
- Không viết nguyên câu hoặc nguyên đoạn bằng tiếng Anh, kể cả khi nguồn có nội dung tiếng Anh; phải diễn đạt lại bằng tiếng Việt.
- Các key kỹ thuật của JSON phải giữ đúng schema được yêu cầu, nhưng mọi value dạng nội dung tự nhiên phải tuân thủ các quy tắc trên.
- Chỉ trả về JSON hợp lệ theo schema trong yêu cầu, không thêm Markdown hoặc văn bản bên ngoài JSON.`;

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
        messages: [
          { role: "system", content: VIETNAMESE_OUTPUT_SYSTEM_PROMPT },
          { role: "user", content: prompt },
        ],
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
