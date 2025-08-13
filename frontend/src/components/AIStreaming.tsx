import React, { useState } from "react";
import { Play, Square } from "lucide-react";

const AIStreaming: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [responseType, setResponseType] = useState<
    "story" | "code" | "explanation"
  >("explanation");
  const [speed, setSpeed] = useState<"slow" | "normal" | "fast">("fast");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [controller, setController] = useState<AbortController | null>(null);

  const handleStream = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setResponse("");

    const abortController = new AbortController();
    setController(abortController);

    try {
      const response = await fetch(
        `http://localhost:3001/streaming/simulate-ai?prompt=${encodeURIComponent(
          prompt
        )}&responseType=${responseType}&speed=${speed}`,
        {
          method: "GET",
          signal: abortController.signal,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("无法获取响应流");
      }

      const decoder = new TextDecoder();
      let accumulatedResponse = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        let data: any = {};
        try {
          data = JSON.parse(chunk);
        } catch (error) {}
        if (data.type === "char") {
          accumulatedResponse += data.char;
        }
        setResponse(accumulatedResponse);
      }
    } catch (error: any) {
      if (error.name === "AbortError") {
        setResponse((prev) => prev + "\n\n[请求已取消]");
      } else {
        setResponse(`错误: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
      setController(null);
    }
  };

  const handleStop = () => {
    if (controller) {
      controller.abort();
    }
  };

  const speedLabels = {
    slow: "慢速 (200ms/字符)",
    normal: "正常 (100ms/字符)",
    fast: "快速 (50ms/字符)",
  };

  const typeLabels = {
    story: "故事创作",
    code: "代码生成",
    explanation: "解释说明",
  };

  return (
    <div>
      <h2>Fetch请求</h2>
      <p style={{ color: "#718096", marginBottom: "16px" }}>
        模拟AI的流式响应，支持不同类型的输出和速度控制
      </p>

      <div className="controls">
        <div className="control-group" style={{ flex: 1 }}>
          <label htmlFor="prompt">AI提示词</label>
          <textarea
            id="prompt"
            className="textarea"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="输入您的AI提示词..."
          />
        </div>

        <div style={{ display: "flex", gap: "12px", minWidth: "200px" }}>
          <div className="control-group">
            <label htmlFor="responseType">响应类型</label>
            <select
              id="responseType"
              className="select"
              value={responseType}
              onChange={(e) => setResponseType(e.target.value as any)}
            >
              <option value="explanation">解释说明</option>
              <option value="story">故事创作</option>
              <option value="code">代码生成</option>
            </select>
          </div>

          <div className="control-group">
            <label htmlFor="speed">响应速度</label>
            <select
              id="speed"
              className="select"
              value={speed}
              onChange={(e) => setSpeed(e.target.value as any)}
            >
              <option value="slow">慢速</option>
              <option value="normal">正常</option>
              <option value="fast">快速</option>
            </select>
          </div>
        </div>
      </div>

      <div
        style={{
          marginBottom: "16px",
          padding: "12px",
          background: "#f7fafc",
          borderRadius: "8px",
        }}
      >
        <p style={{ margin: 0, fontSize: "0.9rem", color: "#4a5568" }}>
          <strong>当前设置:</strong> {typeLabels[responseType]} |{" "}
          {speedLabels[speed]}
        </p>
      </div>

      <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
        <button
          className="btn"
          onClick={handleStream}
          disabled={isLoading || !prompt.trim()}
        >
          <Play size={16} />
          开始流式响应
        </button>

        {isLoading && (
          <button
            className="btn"
            onClick={handleStop}
            style={{ background: "#e53e3e" }}
          >
            <Square size={16} />
            停止
          </button>
        )}
      </div>

      <div className={`response-area ${isLoading ? "loading" : ""}`}>
        {response || "AI响应内容将在这里显示..."}
        {isLoading && (
          <div style={{ position: "absolute", top: "8px", right: "8px" }}>
            <div className="loading-spinner"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIStreaming;
