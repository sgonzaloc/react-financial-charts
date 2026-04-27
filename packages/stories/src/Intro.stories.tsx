import * as React from "react";
import StockChart from "./introduction/Intro";
import { CandlestickChart, TrendingUp, PenTool, Braces, Activity, Settings, ZoomIn, Gauge } from "lucide-react";

export default {
    title: "Intro",
};

export const intro = () => (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", padding: "0 24px" }}>
        <div
            style={{
                background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
                color: "white",
                padding: "48px 32px",
                borderRadius: 12,
                marginBottom: 32,
                textAlign: "center",
            }}
        >
            <h1 style={{ fontSize: 40, marginBottom: 12, fontWeight: 600 }}>React Financial Charts</h1>
            <p style={{ fontSize: 18, opacity: 0.9, maxWidth: 500, margin: "0 auto" }}>
                Professional charting library for financial markets
            </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 48 }}>
            {[
                { number: "15+", label: "Chart Types", color: "#3b82f6", icon: CandlestickChart },
                { number: "11", label: "Indicators", color: "#10b981", icon: TrendingUp },
                { number: "12+", label: "Drawing Tools", color: "#f59e0b", icon: PenTool },
                { number: "100%", label: "TypeScript", color: "#6366f1", icon: Braces },
            ].map((stat) => (
                <div
                    key={stat.label}
                    style={{ background: "#f8f9fa", padding: "20px", borderRadius: 8, border: "1px solid #e9ecef" }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                        <stat.icon size={32} color={stat.color} strokeWidth={1.5} absoluteStrokeWidth />
                        <div style={{ fontSize: 28, fontWeight: 700, color: "#1a1a2e" }}>{stat.number}</div>
                    </div>
                    <div style={{ color: "#6c757d", fontSize: 14, paddingLeft: 44 }}>{stat.label}</div>
                </div>
            ))}
        </div>

        <div style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 24, marginBottom: 24, fontWeight: 600 }}>Features</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
                {[
                    {
                        title: "Chart Types",
                        items: "Candlestick, OHLC, Line, Area, Bar, Renko, Kagi, Heikin Ashi, Scatter",
                        color: "#3b82f6",
                        icon: CandlestickChart,
                    },
                    {
                        title: "Indicators",
                        items: "MACD, RSI, Bollinger, EMA, SAR, Stochastic, ATR, Force Index",
                        color: "#10b981",
                        icon: Activity,
                    },
                    {
                        title: "Drawing Tools",
                        items: "Trend Lines, Fibonacci, Channels, Gann Fan, Arrows, Freehand, Text",
                        color: "#f59e0b",
                        icon: PenTool,
                    },
                    {
                        title: "Interaction",
                        items: "Zoom, Pan, Crosshair, Marquee Zoom, Tooltips",
                        color: "#ef4444",
                        icon: ZoomIn,
                    },
                    {
                        title: "Configuration",
                        items: "Custom axes, Scales (linear/log/time), Coordinates",
                        color: "#8b5cf6",
                        icon: Settings,
                    },
                    {
                        title: "Performance",
                        items: "Canvas rendering, Optimized for large datasets",
                        color: "#06b6d4",
                        icon: Gauge,
                    },
                ].map((feat) => (
                    <div
                        key={feat.title}
                        style={{ padding: 20, border: "1px solid #e9ecef", borderRadius: 8, background: "white" }}
                    >
                        <feat.icon
                            size={32}
                            color={feat.color}
                            strokeWidth={1.5}
                            absoluteStrokeWidth
                            style={{ marginBottom: 16 }}
                        />
                        <div
                            style={{ width: 40, height: 3, background: feat.color, marginBottom: 12, borderRadius: 2 }}
                        />
                        <h3 style={{ marginBottom: 12, fontSize: 18, fontWeight: 600 }}>{feat.title}</h3>
                        <p style={{ color: "#6c757d", margin: 0, lineHeight: 1.5, fontSize: 14 }}>{feat.items}</p>
                    </div>
                ))}
            </div>
        </div>

        <div>
            <h2 style={{ fontSize: 24, marginBottom: 20, fontWeight: 600 }}>Live Demo</h2>
            <div style={{ background: "white", border: "1px solid #e9ecef", borderRadius: 8, padding: 20 }}>
                <StockChart />
            </div>
        </div>
    </div>
);
