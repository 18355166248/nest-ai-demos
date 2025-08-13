import React, { useState } from "react";
import { Play, Square } from "lucide-react";

const ChatStreaming: React.FC = () => {
  const [message, setMessage] = useState("");
  const [delay, setDelay] = useState(20);
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [controller, setController] = useState<AbortController | null>(null);
  const [status, setStatus] = useState("");

  const handleStream = async () => {
    if (!message.trim()) return;

    setIsLoading(true);
    setResponse("");
    setStatus("");

    const abortController = new AbortController();
    setController(abortController);

    try {
      const es = new EventSource(
        `http://localhost:3001/streaming/chat?message=${encodeURIComponent(
          message
        )}&delay=${delay}`
      );
      es.onmessage = (e) => {
        if (e.data) {
          const data = JSON.parse(e.data);
          if (data.type === "chat") {
            setResponse((prev) => prev + data.char);
          }
        }
      };
      es.addEventListener("complete", (res) => {
        console.log("complete", res);
        setIsLoading(false);
        setStatus("完成");
      });
      es.addEventListener("error", (res) => {
        console.log("error", res);
        setIsLoading(false);
        setStatus("错误");
      });
    } catch (error: any) {
      if (error.name === "AbortError") {
        setResponse((prev) => prev + "\n\n[请求已取消]");
      } else {
        setResponse(`错误: ${error.message}`);
      }
      setIsLoading(false);
      setController(null);
      setStatus("");
    }
  };

  const handleStop = () => {
    if (controller) {
      controller.abort();
    }
  };

  return (
    <div>
      <h2>AI聊天流式响应</h2>
      <p style={{ color: "#718096", marginBottom: "16px" }}>
        体验真正的AI对话流式响应，支持智能回复生成和实时流式输出
      </p>

      <div className="controls">
        <div className="control-group" style={{ flex: 1 }}>
          <label htmlFor="message">消息内容</label>
          <textarea
            id="message"
            className="textarea"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="输入您要发送的消息...（试试：你好、天气、学习、编程、笑话等）"
          />
        </div>

        <div className="control-group" style={{ minWidth: "150px" }}>
          <label htmlFor="delay">字符延迟 (毫秒)</label>
          <input
            id="delay"
            type="number"
            className="input"
            value={delay}
            onChange={(e) => setDelay(Number(e.target.value))}
            min="10"
            max="1000"
            step="10"
          />
        </div>
      </div>

      <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
        <button
          className="btn"
          onClick={handleStream}
          disabled={isLoading || !message.trim()}
        >
          <Play size={16} />
          开始AI对话
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

      {status && (
        <div
          style={{
            marginBottom: "16px",
            padding: "8px 12px",
            background: "#f7fafc",
            border: "1px solid #e2e8f0",
            borderRadius: "6px",
            fontSize: "14px",
            color: "#4a5568",
          }}
        >
          {status}
        </div>
      )}

      <div className={`response-area ${isLoading ? "loading" : ""}`}>
        {response || "AI回复将在这里实时显示..."}
        {isLoading && (
          <div style={{ position: "absolute", top: "8px", right: "8px" }}>
            <div className="loading-spinner"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatStreaming;
