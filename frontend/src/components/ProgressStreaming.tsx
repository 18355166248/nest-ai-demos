import React, { useState } from "react";
import { Play, Square } from "lucide-react";

const ProgressStreaming: React.FC = () => {
  const [totalSteps, setTotalSteps] = useState(10);
  const [stepDelay, setStepDelay] = useState(500);
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [controller, setController] = useState<AbortController | null>(null);

  const handleStream = async () => {
    setIsLoading(true);
    setResponse("");

    const abortController = new AbortController();
    setController(abortController);

    try {
      const response = await fetch("/streaming/progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ totalSteps, stepDelay }),
        signal: abortController.signal,
      });

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
        accumulatedResponse += chunk;
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

  const estimatedTime = Math.round((totalSteps * stepDelay) / 1000);

  return (
    <div>
      <h2>进度条流式响应</h2>
      <p style={{ color: "#718096", marginBottom: "16px" }}>
        测试进度条的流式更新，可以调整步骤数量和延迟时间
      </p>

      <div className="controls">
        <div className="control-group">
          <label htmlFor="totalSteps">总步骤数</label>
          <input
            id="totalSteps"
            type="number"
            className="input"
            value={totalSteps}
            onChange={(e) => setTotalSteps(Number(e.target.value))}
            min="1"
            max="50"
            step="1"
          />
        </div>

        <div className="control-group">
          <label htmlFor="stepDelay">每步延迟 (毫秒)</label>
          <input
            id="stepDelay"
            type="number"
            className="input"
            value={stepDelay}
            onChange={(e) => setStepDelay(Number(e.target.value))}
            min="100"
            max="3000"
            step="100"
          />
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
          <strong>预计完成时间:</strong> {estimatedTime} 秒
        </p>
      </div>

      <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
        <button className="btn" onClick={handleStream} disabled={isLoading}>
          <Play size={16} />
          开始进度条流式响应
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
        {response || "进度条响应内容将在这里显示..."}
        {isLoading && (
          <div style={{ position: "absolute", top: "8px", right: "8px" }}>
            <div className="loading-spinner"></div>
          </div>
        )}
      </div>

      <div className="progress-container">
        <h3 style={{ marginBottom: "12px", color: "#4a5568" }}>实时进度预览</h3>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: isLoading ? "100%" : "0%",
              transition: isLoading ? "none" : "width 0.3s ease",
            }}
          />
        </div>
        <div className="status">{isLoading ? "正在处理中..." : "等待开始"}</div>
      </div>
    </div>
  );
};

export default ProgressStreaming;
