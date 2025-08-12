import React, { useState } from "react";
import { MessageSquare, Brain, BarChart3, Play, Square } from "lucide-react";
import ChatStreaming from "./components/ChatStreaming";
import AIStreaming from "./components/AIStreaming";
import ProgressStreaming from "./components/ProgressStreaming";

function App() {
  const [activeTab, setActiveTab] = useState<"chat" | "ai" | "progress">(
    "chat"
  );

  const tabs = [
    { id: "chat", label: "聊天流式响应", icon: MessageSquare },
    { id: "ai", label: "AI流式响应", icon: Brain },
    { id: "progress", label: "进度条流式响应", icon: BarChart3 },
  ];

  return (
    <div className="container">
      <div className="card">
        <h1 style={{ textAlign: "center", fontSize: "2rem", color: "#2d3748" }}>
          流式响应调试器
        </h1>
        <p style={{ textAlign: "center", color: "#718096", marginTop: "8px" }}>
          测试和调试各种流式响应场景
        </p>
      </div>

      <div className="card">
        <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`btn ${activeTab === tab.id ? "" : "btn-secondary"}`}
                style={{
                  background: activeTab === tab.id ? "#4299e1" : "#e2e8f0",
                  color: activeTab === tab.id ? "white" : "#4a5568",
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
                onClick={() => setActiveTab(tab.id as any)}
              >
                <Icon size={20} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab === "chat" && <ChatStreaming />}
        {activeTab === "ai" && <AIStreaming />}
        {activeTab === "progress" && <ProgressStreaming />}
      </div>
    </div>
  );
}

export default App;
