import React, { useState } from "react";
import { Play, Square } from "lucide-react";

const ChatStreaming: React.FC = () => {
  const [message, setMessage] = useState("");
  const [delay, setDelay] = useState(100);
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [controller, setController] = useState<AbortController | null>(null);

  const handleStream = async () => {
    if (!message.trim()) return;

    setIsLoading(true);
    setResponse("");

    const abortController = new AbortController();
    setController(abortController);

    try {
      const response = await fetch("/streaming/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, delay }),
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

  return (
    <div>
      <h2>聊天流式响应</h2>
      <p style={{ color: "#718096", marginBottom: "16px" }}>
        测试聊天消息的流式响应，可以调整每个字符的延迟时间
      </p>

      <div className="controls">
        <div className="control-group" style={{ flex: 1 }}>
          <label htmlFor="message">消息内容</label>
          <textarea
            id="message"
            className="textarea"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="输入您要发送的消息..."
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
        {response || "响应内容将在这里显示..."}
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
