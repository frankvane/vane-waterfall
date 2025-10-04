import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import readmeContent from "@/components/WaterfallPlugin/README.md?raw";
import remarkGfm from "remark-gfm";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function ReadmeDemo() {
  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">📖 README 文档</h1>
        <p className="page-desc">WaterfallPlugin 完整使用文档</p>
      </div>
      <div className="page-card">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ inline, className, children, ...props }: any) {
              const match = /language-(\w+)/.exec(className || "");
              return !inline && match ? (
                <SyntaxHighlighter
                  style={tomorrow}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
            table({ children, ...props }: any) {
              return (
                <div style={{ overflowX: "auto", marginBottom: "16px" }}>
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      border: "1px solid #ddd",
                    }}
                    {...props}
                  >
                    {children}
                  </table>
                </div>
              );
            },
            thead({ children, ...props }: any) {
              return (
                <thead style={{ backgroundColor: "#f8f9fa" }} {...props}>
                  {children}
                </thead>
              );
            },
            th({ children, ...props }: any) {
              return (
                <th
                  style={{
                    padding: "12px",
                    textAlign: "left",
                    border: "1px solid #ddd",
                    fontWeight: "600",
                  }}
                  {...props}
                >
                  {children}
                </th>
              );
            },
            td({ children, ...props }: any) {
              return (
                <td
                  style={{
                    padding: "12px",
                    border: "1px solid #ddd",
                  }}
                  {...props}
                >
                  {children}
                </td>
              );
            },
          }}
        >
          {readmeContent}
        </ReactMarkdown>
      </div>
    </div>
  );
}
