import {
  colors,
  palette,
  spacing,
  radii,
  typography,
} from "../../design-system";
import { colorRoles, fontSamples } from "./data";
import { SectionHeading, CopyButton } from "./PreviewPrimitives";
export default function Foundations({ theme }) {
  return (
    <>
      <section id="colors" className="preview-section section-anchor">
        <SectionHeading
          index="02"
          title="色彩系统"
          english="Colors"
          description="以中性底色承载信息，用品牌蓝引导关键操作。颜色通过语义角色使用，而非散落的色值。"
        />
        <div className="color-grid">
          {colorRoles.map(([role, name, desc]) => (
            <div className="color-swatch" key={role}>
              <div
                className="swatch-fill"
                style={{ background: colors[theme][role] }}
              >
                <span
                  style={{
                    color: ["text", "primary", "muted"].includes(role)
                      ? "#fff"
                      : "#344054",
                  }}
                >
                  {role === "primary" ? "Aa" : ""}
                </span>
              </div>
              <div className="swatch-info">
                <strong>{name}</strong>
                <span>{colors[theme][role].toUpperCase()}</span>
                <small>{desc}</small>
              </div>
              <CopyButton text={colors[theme][role]} label="复制色值" />
            </div>
          ))}
        </div>
        <div className="palette-line">
          <span className="palette-label">
            品牌色阶<small>Brand scale</small>
          </span>
          <div className="blue-scale">
            {Object.entries(palette.blue).map(([level, value]) => (
              <div key={level}>
                <span style={{ background: value }} />
                <small>{level}</small>
                <code>{value}</code>
              </div>
            ))}
          </div>
        </div>
        <div className="semantic-row">
          {[
            ["success", "正常", "服务运行正常"],
            ["warning", "注意", "用量接近阈值"],
            ["danger", "异常", "请检查配置信息"],
          ].map(([role, name, desc]) => (
            <div
              key={role}
              style={{
                "--status-color": colors[theme][role],
                "--status-bg": colors[theme][`${role}Soft`],
              }}
            >
              <i />
              <strong>{name}</strong>
              <span>{desc}</span>
              <code>{colors[theme][role]}</code>
            </div>
          ))}
        </div>
      </section>
      <section id="typography" className="preview-section section-anchor">
        <SectionHeading
          index="03"
          title="字体排印"
          english="Typography"
          description="中文以系统黑体保证清晰，英文优先使用 Inter（未安装时回退系统字体），代码采用等宽字体。"
        />
        <div className="type-table">
          {fontSamples.map(({ label, size, text, meta }) => (
            <div className="type-row" key={label}>
              <div className="type-meta">
                <strong>{label}</strong>
                <code>{meta}</code>
              </div>
              <p
                style={{
                  fontSize: typography.size[size],
                  fontFamily: label === "Code" ? "var(--font-mono)" : undefined,
                  fontWeight:
                    label.startsWith("Heading") || label === "Display"
                      ? 600
                      : 400,
                  lineHeight:
                    label === "Display"
                      ? 1.15
                      : label.startsWith("Heading")
                        ? 1.35
                        : 1.65,
                }}
              >
                {text}
              </p>
            </div>
          ))}
        </div>
        <div className="type-note">
          <span>Aa</span>
          <p>
            字体承担层级，留白建立节奏。
            <small>正文建议 14–16px · 行高 1.65 · 数据使用 tabular-nums</small>
          </p>
          <code>0123456789</code>
        </div>
      </section>
      <section id="geometry" className="preview-section section-anchor">
        <SectionHeading
          index="04"
          title="间距与形状"
          english="Geometry"
          description="以 4px 为基础单位。规则的空间节奏，让信息密度与呼吸感保持平衡。"
        />
        <div className="geometry-grid">
          <div className="foundation-panel">
            <h3>
              空间尺度 <span>4px base grid</span>
            </h3>
            <div className="spacing-scale">
              {[1, 2, 3, 4, 6, 8, 12, 16].map((key) => (
                <div key={key}>
                  <span style={{ height: spacing[key] }} />
                  <code>{spacing[key]}</code>
                </div>
              ))}
            </div>
            <p>组件内部 8–24px / 区块之间 32–64px</p>
          </div>
          <div className="foundation-panel">
            <h3>
              圆角规范 <span>Soft, with structure</span>
            </h3>
            <div className="radius-scale">
              {Object.entries(radii).map(([name, value]) => (
                <div key={name}>
                  <span style={{ borderRadius: value }} />
                  <strong>{name}</strong>
                  <code>{value}</code>
                </div>
              ))}
            </div>
            <p>控件 8px / 卡片 12px / 展示容器 20px</p>
          </div>
        </div>
      </section>
    </>
  );
}
