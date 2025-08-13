import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router";
import { MessageSquare, BarChart3 } from "lucide-react";
import ChatStreaming from "./components/ChatStreaming";
import AIStreaming from "./components/AIStreaming";

// 导航组件
function Navigation() {
  const location = useLocation();

  const tabs = [
    { id: "chat", label: "EventSource", icon: MessageSquare, path: "/" },
    { id: "ai", label: "Fetch", icon: BarChart3, path: "/ai" },
  ];

  return (
    <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = location.pathname === tab.path;
        return (
          <Link
            key={tab.id}
            to={tab.path}
            className={`btn ${isActive ? "" : "btn-secondary"}`}
            style={{
              background: isActive ? "#4299e1" : "#e2e8f0",
              color: isActive ? "white" : "#4a5568",
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              textDecoration: "none",
            }}
          >
            <Icon size={20} />
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="container">
        <div className="card">
          <h1
            style={{ textAlign: "center", fontSize: "2rem", color: "#2d3748" }}
          >
            流式响应调试器
          </h1>
          <p
            style={{ textAlign: "center", color: "#718096", marginTop: "8px" }}
          >
            测试和调试各种流式响应场景
          </p>
        </div>

        <div className="card">
          <Navigation />

          <Routes>
            <Route path="/" element={<ChatStreaming />} />
            <Route path="/ai" element={<AIStreaming />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
