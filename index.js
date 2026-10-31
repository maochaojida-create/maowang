/* Siren Voice TT/iOS adaptation 2.3.1-tt.2. Original: Ellina / https://github.com/Ellinav/Siren-Voice (aef6bb5ee443488edd6c0ef1e28468c9218e1975). CC BY-NC 4.0; see LICENSE.txt. Modified 2026-10-19: bounded media lifecycle, metadata-only cache checks, TT/iOS lazy sentence playback. */
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e) {
    throw err = [e], e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// scripts/settings.js
function deepMergeDefaults(target, defaults) {
  for (const key of Object.keys(defaults)) {
    const defaultValue = defaults[key];
    const targetValue = target[key];
    if (!Object.hasOwn(target, key)) {
      target[key] = structuredClone(defaultValue);
      continue;
    }
    if (defaultValue && typeof defaultValue === "object" && !Array.isArray(defaultValue)) {
      if (!targetValue || typeof targetValue !== "object" || Array.isArray(targetValue)) {
        target[key] = structuredClone(defaultValue);
      } else {
        deepMergeDefaults(targetValue, defaultValue);
      }
    }
  }
}
function getSirenSettings() {
  const context = SillyTavern.getContext();
  if (!context || !context.extensionSettings) {
    console.warn("[Siren Voice] SillyTavern context \u672A\u5C31\u7EEA\uFF0C\u4F7F\u7528\u9ED8\u8BA4\u8BBE\u7F6E\u3002");
    return structuredClone(defaultSettings);
  }
  if (!context.extensionSettings[MODULE_NAME]) {
    context.extensionSettings[MODULE_NAME] = structuredClone(defaultSettings);
  }
  const settings = context.extensionSettings[MODULE_NAME];
  deepMergeDefaults(settings, defaultSettings);
  return settings;
}
function saveSirenSettings(silent = false) {
  const context = SillyTavern.getContext();
  if (context && context.saveSettingsDebounced) {
    context.saveSettingsDebounced();
    console.log("[Siren Voice] \u5168\u5C40\u8BBE\u7F6E\u5DF2\u4FDD\u5B58\u81F3 SillyTavern\u3002");
    if (!silent && window.toastr) {
      window.toastr.success("Siren Voice \u8BBE\u7F6E\u5DF2\u4FDD\u5B58\uFF01");
    }
  } else {
    console.error(
      "[Siren Voice] \u4FDD\u5B58\u5931\u8D25\uFF1A\u672A\u627E\u5230 saveSettingsDebounced \u65B9\u6CD5\u3002"
    );
  }
}
async function saveToCharacterCard(extensionKey, payload, silent = false) {
  const context = SillyTavern.getContext();
  const { writeExtensionField, characterId, characters } = context;
  if (characterId === void 0 || characterId === null) {
    if (!silent && window.toastr)
      window.toastr.warning(
        "\u5F53\u524D\u672A\u9009\u4E2D\u4EFB\u4F55\u89D2\u8272\uFF08\u6216\u5904\u4E8E\u7FA4\u804A\u4E2D\uFF09\uFF0C\u65E0\u6CD5\u4FDD\u5B58\u5230\u89D2\u8272\u5361\uFF01"
      );
    return false;
  }
  try {
    if (characters && characters[characterId] && characters[characterId].data) {
      if (!characters[characterId].data.extensions) {
        characters[characterId].data.extensions = {};
      }
      characters[characterId].data.extensions[extensionKey] = JSON.parse(
        JSON.stringify(payload)
      );
    }
    await writeExtensionField(characterId, extensionKey, payload);
    if (!silent && window.toastr)
      window.toastr.success("\u914D\u7F6E\u5DF2\u6210\u529F\u5199\u5165\u5F53\u524D\u89D2\u8272\u5361\uFF01");
    console.log(`[Siren Voice] \u6210\u529F\u5199\u5165\u89D2\u8272\u5361 (${extensionKey}):`, payload);
    return true;
  } catch (err) {
    console.error("[Siren Voice] \u5199\u5165\u89D2\u8272\u5361\u5931\u8D25:", err);
    if (!silent && window.toastr) window.toastr.error("\u5199\u5165\u89D2\u8272\u5361\u5931\u8D25\uFF01");
    return false;
  }
}
var MODULE_NAME, defaultSettings;
var init_settings = __esm({
  "scripts/settings.js"() {
    MODULE_NAME = "siren_voice_settings";
    defaultSettings = Object.freeze({
      ambience: {
        enabled: true,
        auto_play: true,
        // 🌟 新增：全局自动播放
        custom_end_tags: "",
        // 🌟 新增：自定义触发标签
        fade_duration: 2,
        // 平滑过渡时间（秒）
        start_tag: "<content>",
        end_tag: "</content>",
        karaoke_speed: 1,
        // 卡拉OK速度
        current_list: "default",
        // 当前选中的列表名
        libraries: {
          default: [
            {
              name: "\u5C0F\u96E8",
              url: "https://raw.githubusercontent.com/Ellinav/ST-Audio-Assets/main/Ambience/%E4%B8%8B%E9%9B%A8/%E5%B0%8F%E9%9B%A8-1.ogg"
            },
            { name: "\u9152\u5427", url: "https://files.catbox.moe/qc7a9g.wav" }
          ]
        },
        // 🌟 新增：SFX 效果音库
        sfx_current_list: "default",
        sfx_libraries: {
          default: [
            {
              name: "\u95E8\u94C3",
              url: "https://raw.githubusercontent.com/Ellinav/ST-Audio-Assets/main/SFX/%E9%97%A8/%E9%97%A8%E9%93%83-1.ogg"
            },
            {
              name: "\u6572\u95E8",
              url: "https://raw.githubusercontent.com/Ellinav/ST-Audio-Assets/main/SFX/%E9%97%A8/%E6%95%B2%E9%97%A8-1.ogg"
            }
          ]
        },
        // 🌟 新增：旁白滚动样式
        karaoke_style: {
          current: "default",
          dict: {
            default: {
              name: "\u84DD\u8272",
              code: `
.siren-scene-active .mes_text { color: #64748b; transition: color 0.5s ease; }
.siren-karaoke-playing {
    background: linear-gradient(to right, #06b6d4 var(--k-prog, 0%), #64748b var(--k-prog, 0%));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    box-decoration-break: clone;
    -webkit-box-decoration-break: clone;
}
.siren-karaoke-done {
    background: linear-gradient(to right, #06b6d4 100%, #64748b 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    box-decoration-break: clone;
    -webkit-box-decoration-break: clone;
}`
            },
            glass: {
              name: "\u7EFF\u8272",
              code: `
.siren-scene-active .mes_text { color: #94a3b8; transition: color 0.5s ease; }
.siren-karaoke-playing {
    background: linear-gradient(to right, #34d399 var(--k-prog, 0%), #94a3b8 var(--k-prog, 0%));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    box-decoration-break: clone;
    -webkit-box-decoration-break: clone;
}
.siren-karaoke-done {
    background: linear-gradient(to right, #34d399 100%, #94a3b8 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    box-decoration-break: clone;
    -webkit-box-decoration-break: clone;
}`
            },
            vinyl: {
              name: "\u9EC4\u8272",
              code: `
.siren-scene-active .mes_text { color: #6b7280; transition: color 0.5s ease; }
.siren-karaoke-playing {
    background: linear-gradient(to right, #f59e0b var(--k-prog, 0%), #6b7280 var(--k-prog, 0%));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    box-decoration-break: clone;
    -webkit-box-decoration-break: clone;
}
.siren-karaoke-done {
    background: linear-gradient(to right, #f59e0b 100%, #6b7280 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    box-decoration-break: clone;
    -webkit-box-decoration-break: clone;
}`
            },
            cyber: {
              name: "\u8D5B\u535A\u84DD",
              code: `
.siren-scene-active .mes_text { color: #334155; transition: color 0.5s ease; }
.siren-karaoke-playing {
    background: linear-gradient(to right, #00f5d4 var(--k-prog, 0%), #334155 var(--k-prog, 0%));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    box-decoration-break: clone;
    -webkit-box-decoration-break: clone;
}
.siren-karaoke-done {
    background: linear-gradient(to right, #00f5d4 100%, #334155 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    box-decoration-break: clone;
    -webkit-box-decoration-break: clone;
}`
            },
            nebula: {
              name: "\u7C89\u8272",
              code: `
.siren-scene-active .mes_text { color: #64748b; transition: color 0.5s ease; }
.siren-karaoke-playing {
    background: linear-gradient(to right, #f472b6 var(--k-prog, 0%), #64748b var(--k-prog, 0%));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    box-decoration-break: clone;
    -webkit-box-decoration-break: clone;
}
.siren-karaoke-done {
    background: linear-gradient(to right, #f472b6 100%, #64748b 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    box-decoration-break: clone;
    -webkit-box-decoration-break: clone;
}`
            },
            gothic: {
              name: "\u7EA2\u8272",
              code: `
.siren-scene-active .mes_text { color: #1a1a1a; transition: color 0.5s ease; }
.siren-karaoke-playing {
    background: linear-gradient(to right, #b91c1c var(--k-prog, 0%), #1a1a1a var(--k-prog, 0%));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    box-decoration-break: clone;
    -webkit-box-decoration-break: clone;
}
.siren-karaoke-done {
    background: linear-gradient(to right, #b91c1c 100%, #1a1a1a 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    box-decoration-break: clone;
    -webkit-box-decoration-break: clone;
}`
            },
            phantom: {
              name: "\u7D2B\u8272",
              code: `
.siren-scene-active .mes_text { color: #2e1065; transition: color 0.5s ease; }
.siren-karaoke-playing {
    background: linear-gradient(to right, #d287e9 var(--k-prog, 0%), #5d3d9a var(--k-prog, 0%));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    box-decoration-break: clone;
    -webkit-box-decoration-break: clone;
}
.siren-karaoke-done {
    background: linear-gradient(to right, #d287e9 100%, #5d3d9a 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    box-decoration-break: clone;
    -webkit-box-decoration-break: clone;
}`
            },
            simple: {
              name: "\u7D20\u96C5\u7070\u767D",
              code: `/* \u26AA \u5361\u62C9OK\uFF1A\u7070\u8F6C\u767D (Gray to White) */
.siren-scene-active .mes_text { color: #4b5563; transition: color 0.5s ease; }
.siren-karaoke-playing {
    background: linear-gradient(to right, #ffffff var(--k-prog, 0%), #4b5563 var(--k-prog, 0%));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    box-decoration-break: clone;
    -webkit-box-decoration-break: clone;
}
.siren-karaoke-done {
    background: linear-gradient(to right, #ffffff 100%, #4b5563 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    box-decoration-break: clone;
    -webkit-box-decoration-break: clone;
}`
            }
          }
        },
        // 🌟 新增：背景音卡片样式
        card_style: {
          current: "default",
          dict: {
            default: {
              name: "\u6DF1\u6D77",
              icon: "fa-solid fa-headphones-simple",
              code: `
.siren-ambience-card { display:inline-flex; align-items:center; gap:8px; background:rgba(10,15,30,0.85); backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px); border:1px solid rgba(6,182,212,0.3); padding:4px 12px; border-radius:20px; cursor:pointer; box-shadow:0 2px 10px rgba(0,0,0,0.3); transition:all 0.2s; margin: 4px 0; }
.siren-ambience-card:hover { border-color:#06b6d4; box-shadow:0 4px 15px rgba(6,182,212,0.2); transform: translateY(-1px); }
.siren-ambience-text { color:#f1f5f9; font-size:0.9em; text-shadow:0 0 5px rgba(255,255,255,0.2); }
.siren-ambience-card .siren-btn-wrap { display: inline-flex !important; flex-shrink: 0; width: 24px !important; height: 24px !important; align-items: center !important; justify-content: center !important; transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important; }
.siren-ambience-card .siren-btn-wrap:hover { transform: scale(1.15) !important; }
.siren-ambience-card i { display: flex; align-items: center; justify-content: center; transition: filter 0.3s ease !important; color: #06b6d4 !important; font-size: 1.1em !important; filter: drop-shadow(0 0 8px rgba(6,182,212,0.8)); }`
            },
            deepsea: {
              name: "\u9713\u8679",
              icon: "fa-solid fa-headphones-simple",
              code: `
.siren-ambience-card { display:inline-flex; align-items:center; gap:8px; background:linear-gradient(135deg, rgba(8,47,73,0.88), rgba(15,23,42,0.92)); border:1px solid rgba(34,211,238,0.35); padding:4px 12px; border-radius:12px; cursor:pointer; box-shadow:0 0 14px rgba(6,182,212,0.18), inset 0 0 12px rgba(6,182,212,0.08); transition:all 0.2s; margin: 4px 0; }
.siren-ambience-card:hover { border-color:rgba(34,211,238,0.8); box-shadow:0 0 20px rgba(6,182,212,0.4), inset 0 0 15px rgba(6,182,212,0.2); transform: translateY(-1px); }
.siren-ambience-text { color:#67e8f9; font-weight:700; font-size:0.9em; }
.siren-ambience-card .siren-btn-wrap { display: inline-flex !important; flex-shrink: 0; width: 24px !important; height: 24px !important; align-items: center !important; justify-content: center !important; transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important; }
.siren-ambience-card .siren-btn-wrap:hover { transform: scale(1.15) !important; }
.siren-ambience-card i { display: flex; align-items: center; justify-content: center; transition: filter 0.3s ease !important; color: #22c55e !important; font-size: 1.1em !important; filter: drop-shadow(0 0 5px rgba(34,197,94,0.5)); }`
            },
            glass: {
              name: "\u73BB\u7483",
              icon: "fa-solid fa-headphones-simple",
              code: `
.siren-ambience-card { display:inline-flex; align-items:center; gap:8px; background:rgba(255,255,255,0.08); backdrop-filter:blur(10px); -webkit-backdrop-filter:blur(10px); border:1px solid rgba(255,255,255,0.18); padding:4px 12px; border-radius:16px; cursor:pointer; box-shadow:0 8px 24px rgba(0,0,0,0.18); transition:all 0.2s; margin: 4px 0; }
.siren-ambience-card:hover { background: rgba(255,255,255,0.12); border-color:rgba(52,211,153,0.6); box-shadow:0 12px 28px rgba(0,0,0,0.25), 0 0 15px rgba(52,211,153,0.2); transform: translateY(-1px); }
.siren-ambience-text { color:#e2e8f0; font-weight:600; font-size:0.9em; }
.siren-ambience-card .siren-btn-wrap { display: inline-flex !important; flex-shrink: 0; width: 24px !important; height: 24px !important; align-items: center !important; justify-content: center !important; transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important; }
.siren-ambience-card .siren-btn-wrap:hover { transform: scale(1.15) !important; }
.siren-ambience-card i { display: flex; align-items: center; justify-content: center; transition: filter 0.3s ease !important; color: #34d399 !important; font-size: 1.1em !important; }`
            },
            vinyl: {
              name: "\u9ED1\u80F6\u5531\u7247",
              icon: "fa-solid fa-headphones-simple",
              code: `
.siren-ambience-card { display:inline-flex; align-items:center; gap:8px; background:#111827; border:1px solid #374151; padding:4px 12px; border-radius:14px; cursor:pointer; box-shadow:0 4px 18px rgba(0,0,0,0.35); transition:all 0.2s; margin: 4px 0; }
.siren-ambience-card:hover { border-color:#f59e0b; box-shadow:0 6px 22px rgba(0,0,0,0.5), 0 0 15px rgba(245,158,11,0.15); transform: translateY(-1px); }
.siren-ambience-text { color:#f9fafb; font-weight:700; font-size:0.9em; }
.siren-ambience-card .siren-btn-wrap { display: inline-flex !important; flex-shrink: 0; width: 24px !important; height: 24px !important; align-items: center !important; justify-content: center !important; transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important; }
.siren-ambience-card .siren-btn-wrap:hover { transform: scale(1.15) !important; }
.siren-ambience-card i { display: flex; align-items: center; justify-content: center; transition: filter 0.3s ease !important; color: #f59e0b !important; font-size: 1.1em !important; }`
            },
            cyber: {
              name: "\u8D5B\u535A\u7EC8\u7AEF",
              icon: "fa-solid fa-headphones-simple",
              code: `
.siren-ambience-card { display:inline-flex; align-items:center; gap:8px; background:#0a0f1e; border:1px solid #00f5d4; padding:4px 12px; border-radius:6px; cursor:pointer; box-shadow:0 0 12px rgba(0,245,212,0.18), inset 0 0 10px rgba(0,245,212,0.08); font-family:monospace !important; transition:all 0.2s; margin: 4px 0; }
.siren-ambience-card:hover { border-color:#00f5d4; box-shadow:0 0 20px rgba(0,245,212,0.4), inset 0 0 15px rgba(0,245,212,0.2); transform: translateY(-1px); }
.siren-ambience-text { color:#d1fae5; font-weight:700; font-size:0.9em; }
.siren-ambience-card .siren-btn-wrap { display: inline-flex !important; flex-shrink: 0; width: 24px !important; height: 24px !important; align-items: center !important; justify-content: center !important; transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important; }
.siren-ambience-card .siren-btn-wrap:hover { transform: scale(1.15) !important; }
.siren-ambience-card i { display: flex; align-items: center; justify-content: center; transition: filter 0.3s ease !important; color: #00f5d4 !important; font-size: 1.1em !important; filter: drop-shadow(0 0 5px rgba(0,245,212,0.6)); }`
            },
            nebula: {
              name: "\u68A6\u5E7B\u661F\u4E91",
              icon: "fa-solid fa-headphones-simple",
              code: `
.siren-ambience-card { display:inline-flex; align-items:center; gap:8px; background:linear-gradient(135deg, rgba(76,29,149,0.9), rgba(30,41,59,0.92), rgba(219,39,119,0.18)); border:1px solid rgba(244,114,182,0.35); padding:4px 12px; border-radius:18px; cursor:pointer; box-shadow:0 0 18px rgba(168,85,247,0.18); transition:all 0.2s; margin: 4px 0; }
.siren-ambience-card:hover { border-color:rgba(244,114,182,0.8); box-shadow:0 4px 25px rgba(244,114,182,0.4), 0 0 15px rgba(168,85,247,0.3); transform: translateY(-1px); }
.siren-ambience-text { color:#fce7f3; font-weight:700; font-size:0.9em; }
.siren-ambience-card .siren-btn-wrap { display: inline-flex !important; flex-shrink: 0; width: 24px !important; height: 24px !important; align-items: center !important; justify-content: center !important; transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important; }
.siren-ambience-card .siren-btn-wrap:hover { transform: scale(1.15) !important; }
.siren-ambience-card i { display: flex; align-items: center; justify-content: center; transition: filter 0.3s ease !important; color: #f472b6 !important; font-size: 1.1em !important; filter: drop-shadow(0 0 5px rgba(244,114,182,0.5)); }`
            },
            retro: {
              name: "\u7559\u58F0\u673A",
              icon: "fa-solid fa-headphones-simple",
              code: `
.siren-ambience-card { display:inline-flex; align-items:center; gap:8px; background:linear-gradient(135deg,#3f2f23,#1f1812); border:1px solid #8b6b4a; padding:4px 12px; border-radius:10px; cursor:pointer; box-shadow:0 6px 16px rgba(0,0,0,0.28); transition:all 0.2s; margin: 4px 0; }
.siren-ambience-card:hover { border-color:#d6c1a3; box-shadow:0 8px 20px rgba(0,0,0,0.4), 0 0 12px rgba(139,107,74,0.3); transform: translateY(-1px); }
.siren-ambience-text { color:#f5deb3; font-weight:700; font-size:0.9em; }
.siren-ambience-card .siren-btn-wrap { display: inline-flex !important; flex-shrink: 0; width: 24px !important; height: 24px !important; align-items: center !important; justify-content: center !important; transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important; }
.siren-ambience-card .siren-btn-wrap:hover { transform: scale(1.15) !important; }
.siren-ambience-card i { display: flex; align-items: center; justify-content: center; transition: filter 0.3s ease !important; color: #f5deb3 !important; font-size: 1.1em !important; }`
            },
            pill: {
              name: "\u6781\u7B80\u80F6\u56CA",
              icon: "fa-solid fa-headphones-simple",
              code: `
.siren-ambience-card { display:inline-flex; align-items:center; gap:8px; background:rgba(255,255,255,0.95); backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px); border:1px solid rgba(0,0,0,0.08); padding:4px 12px; border-radius:999px; cursor:pointer; box-shadow:0 2px 10px rgba(0,0,0,0.04); transition:all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); margin: 4px 0; }
.siren-ambience-card:hover { border-color:rgba(0,0,0,0.15); box-shadow:0 4px 16px rgba(0,0,0,0.08); transform: translateY(-1px); }
.siren-ambience-text { color:#1d1d1f; font-weight:600; font-size:0.9em; }
.siren-ambience-card .siren-btn-wrap { display: inline-flex !important; flex-shrink: 0; width: 24px !important; height: 24px !important; align-items: center !important; justify-content: center !important; transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important; }
.siren-ambience-card .siren-btn-wrap:hover { transform: scale(1.15) !important; }
.siren-ambience-card i { display: flex; align-items: center; justify-content: center; transition: filter 0.3s ease !important; color: #1d1d1f !important; font-size: 1.1em !important; filter: drop-shadow(0 0 2px rgba(0,0,0,0.05)); }`
            }
          }
        },
        // 🌟 新增：效果音卡片样式 (SFX)
        sfx_card_style: {
          current: "default",
          dict: {
            default: {
              name: "\u6DF1\u6D77",
              icon: "fa-solid fa-bell",
              code: `
.siren-sfx-card { display:inline-flex; align-items:center; gap:8px; background:rgba(10,15,30,0.85); backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px); border:1px solid rgba(6,182,212,0.3); padding:4px 12px; border-radius:16px 4px 16px 4px; cursor:pointer; box-shadow:0 2px 10px rgba(0,0,0,0.3); transition:all 0.2s; margin: 4px 0; }
.siren-sfx-card:hover { border-color:#06b6d4; box-shadow:0 4px 15px rgba(6,182,212,0.2); transform: translateY(-1px); }
.siren-sfx-text { color:#f1f5f9; font-size:0.9em; text-shadow:0 0 5px rgba(255,255,255,0.2); }
.siren-sfx-card .siren-btn-wrap { display: inline-flex !important; flex-shrink: 0; width: 24px !important; height: 24px !important; align-items: center !important; justify-content: center !important; transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important; }
.siren-sfx-card .siren-btn-wrap:hover { transform: scale(1.15) !important; }
.siren-sfx-card i { display: flex; align-items: center; justify-content: center; transition: filter 0.3s ease !important; color: #06b6d4 !important; font-size: 1.1em !important; filter: drop-shadow(0 0 8px rgba(6,182,212,0.8)); }`
            },
            deepsea: {
              name: "\u9713\u8679",
              icon: "fa-solid fa-bell",
              code: `
.siren-sfx-card { display:inline-flex; align-items:center; gap:8px; background:linear-gradient(135deg, rgba(8,47,73,0.88), rgba(15,23,42,0.92)); border:1px solid rgba(34,211,238,0.35); padding:4px 12px; border-radius:14px 4px 14px 4px; cursor:pointer; box-shadow:0 0 14px rgba(6,182,212,0.18), inset 0 0 12px rgba(6,182,212,0.08); transition:all 0.2s; margin: 4px 0; }
.siren-sfx-card:hover { border-color:rgba(34,211,238,0.8); box-shadow:0 0 20px rgba(6,182,212,0.4), inset 0 0 15px rgba(6,182,212,0.2); transform: translateY(-1px); }
.siren-sfx-text { color:#67e8f9; font-weight:700; font-size:0.9em; }
.siren-sfx-card .siren-btn-wrap { display: inline-flex !important; flex-shrink: 0; width: 24px !important; height: 24px !important; align-items: center !important; justify-content: center !important; transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important; }
.siren-sfx-card .siren-btn-wrap:hover { transform: scale(1.15) !important; }
.siren-sfx-card i { display: flex; align-items: center; justify-content: center; transition: filter 0.3s ease !important; color: #22c55e !important; font-size: 1.1em !important; filter: drop-shadow(0 0 5px rgba(34,197,94,0.5)); }`
            },
            glass: {
              name: "\u73BB\u7483",
              icon: "fa-solid fa-bell",
              code: `
.siren-sfx-card { display:inline-flex; align-items:center; gap:8px; background:rgba(255,255,255,0.08); backdrop-filter:blur(10px); -webkit-backdrop-filter:blur(10px); border:1px solid rgba(255,255,255,0.18); padding:4px 12px; border-radius:16px 4px 16px 4px; cursor:pointer; box-shadow:0 8px 24px rgba(0,0,0,0.18); transition:all 0.2s; margin: 4px 0; }
.siren-sfx-card:hover { background: rgba(255,255,255,0.12); border-color:rgba(52,211,153,0.6); box-shadow:0 12px 28px rgba(0,0,0,0.25), 0 0 15px rgba(52,211,153,0.2); transform: translateY(-1px); }
.siren-sfx-text { color:#e2e8f0; font-weight:600; font-size:0.9em; }
.siren-sfx-card .siren-btn-wrap { display: inline-flex !important; flex-shrink: 0; width: 24px !important; height: 24px !important; align-items: center !important; justify-content: center !important; transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important; }
.siren-sfx-card .siren-btn-wrap:hover { transform: scale(1.15) !important; }
.siren-sfx-card i { display: flex; align-items: center; justify-content: center; transition: filter 0.3s ease !important; color: #34d399 !important; font-size: 1.1em !important; }`
            },
            vinyl: {
              name: "\u9ED1\u80F6\u5531\u7247",
              icon: "fa-solid fa-bell",
              code: `
.siren-sfx-card { display:inline-flex; align-items:center; gap:8px; background:#111827; border:1px solid #374151; padding:4px 12px; border-radius:12px 4px 12px 4px; cursor:pointer; box-shadow:0 4px 18px rgba(0,0,0,0.35); transition:all 0.2s; margin: 4px 0; }
.siren-sfx-card:hover { border-color:#f59e0b; box-shadow:0 6px 22px rgba(0,0,0,0.5), 0 0 15px rgba(245,158,11,0.15); transform: translateY(-1px); }
.siren-sfx-text { color:#f9fafb; font-weight:700; font-size:0.9em; }
.siren-sfx-card .siren-btn-wrap { display: inline-flex !important; flex-shrink: 0; width: 24px !important; height: 24px !important; align-items: center !important; justify-content: center !important; transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important; }
.siren-sfx-card .siren-btn-wrap:hover { transform: scale(1.15) !important; }
.siren-sfx-card i { display: flex; align-items: center; justify-content: center; transition: filter 0.3s ease !important; color: #f59e0b !important; font-size: 1.1em !important; }`
            },
            cyber: {
              name: "\u8D5B\u535A\u7EC8\u7AEF",
              icon: "fa-solid fa-bell",
              code: `
.siren-sfx-card { display:inline-flex; align-items:center; gap:8px; background:#0a0f1e; border:1px solid #00f5d4; padding:4px 12px; border-radius:8px 0px 8px 0px; cursor:pointer; box-shadow:0 0 12px rgba(0,245,212,0.18), inset 0 0 10px rgba(0,245,212,0.08); font-family:monospace !important; transition:all 0.2s; margin: 4px 0; }
.siren-sfx-card:hover { border-color:#00f5d4; box-shadow:0 0 20px rgba(0,245,212,0.4), inset 0 0 15px rgba(0,245,212,0.2); transform: translateY(-1px); }
.siren-sfx-text { color:#d1fae5; font-weight:700; font-size:0.9em; }
.siren-sfx-card .siren-btn-wrap { display: inline-flex !important; flex-shrink: 0; width: 24px !important; height: 24px !important; align-items: center !important; justify-content: center !important; transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important; }
.siren-sfx-card .siren-btn-wrap:hover { transform: scale(1.15) !important; }
.siren-sfx-card i { display: flex; align-items: center; justify-content: center; transition: filter 0.3s ease !important; color: #00f5d4 !important; font-size: 1.1em !important; filter: drop-shadow(0 0 5px rgba(0,245,212,0.6)); }`
            },
            retro: {
              name: "\u7559\u58F0\u673A",
              icon: "fa-solid fa-bell",
              code: `
.siren-sfx-card { display:inline-flex; align-items:center; gap:8px; background:linear-gradient(135deg,#3f2f23,#1f1812); border:1px solid #8b6b4a; padding:4px 12px; border-radius:10px 2px 10px 2px; cursor:pointer; box-shadow:0 6px 16px rgba(0,0,0,0.28); transition:all 0.2s; margin: 4px 0; }
.siren-sfx-card:hover { border-color:#d6c1a3; box-shadow:0 8px 20px rgba(0,0,0,0.4), 0 0 12px rgba(139,107,74,0.3); transform: translateY(-1px); }
.siren-sfx-text { color:#f5deb3; font-weight:700; font-size:0.9em; }
.siren-sfx-card .siren-btn-wrap { display: inline-flex !important; flex-shrink: 0; width: 24px !important; height: 24px !important; align-items: center !important; justify-content: center !important; transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important; }
.siren-sfx-card .siren-btn-wrap:hover { transform: scale(1.15) !important; }
.siren-sfx-card i { display: flex; align-items: center; justify-content: center; transition: filter 0.3s ease !important; color: #f5deb3 !important; font-size: 1.1em !important; }`
            },
            pill: {
              name: "\u6781\u7B80\u80F6\u56CA",
              icon: "fa-solid fa-bell",
              code: `
.siren-sfx-card { display:inline-flex; align-items:center; gap:8px; background:rgba(255,255,255,0.95); backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px); border:1px solid rgba(0,0,0,0.08); padding:4px 12px; border-radius:16px 4px 16px 4px; cursor:pointer; box-shadow:0 2px 10px rgba(0,0,0,0.04); transition:all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); margin: 4px 0; }
.siren-sfx-card:hover { border-color:rgba(0,0,0,0.15); box-shadow:0 4px 16px rgba(0,0,0,0.08); transform: translateY(-1px); }
.siren-sfx-text { color:#1d1d1f; font-weight:600; font-size:0.9em; }
.siren-sfx-card .siren-btn-wrap { display: inline-flex !important; flex-shrink: 0; width: 24px !important; height: 24px !important; align-items: center !important; justify-content: center !important; transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important; }
.siren-sfx-card .siren-btn-wrap:hover { transform: scale(1.15) !important; }
.siren-sfx-card i { display: flex; align-items: center; justify-content: center; transition: filter 0.3s ease !important; color: #1d1d1f !important; font-size: 1.1em !important; filter: drop-shadow(0 0 2px rgba(0,0,0,0.05)); }`
            }
          }
        }
      },
      music: {
        enabled: true,
        floating_enabled: true,
        auto_play: true,
        source: "netease",
        mode: "smart",
        play_mode: "sequential",
        insert_pos: "at_d",
        char: "system",
        depth: 4,
        order: 100,
        prompt: "\u8BF7\u6839\u636E\u5F53\u524D\u804A\u5929\u6C1B\u56F4\uFF0C\u5728\u56DE\u590D\u672B\u5C3E\u9644\u5E26\u4E00\u9996\u5408\u9002\u7684\u80CC\u666F\u97F3\u4E50...",
        playlist: [],
        styles: {
          msgEnabled: true,
          playerCurrent: "default",
          msgCurrent: "default",
          playerDict: {
            default: {
              name: "\u6DF1\u6D77",
              isReadonly: true,
              code: `/* \u6DF1\u6D77\u63A7\u5236\u53F0\u6536\u5230\u5927\u6D77\u4FDD\u62A4\uFF0C\u4E0D\u53EF\u7F16\u8F91\u3002\u5982\u9700\u81EA\u5B9A\u4E49\uFF0C\u8BF7\u9009\u62E9\u65B0\u589E\u6D82\u88C5\u3002*/`
            },
            deepsea: {
              name: "\u9713\u8679",
              isReadonly: true,
              code: `
#siren-music-player {
    background: linear-gradient(135deg, rgba(8,47,73,0.92), rgba(15,23,42,0.95));
    border: 1px solid rgba(34,211,238,0.35);
    box-shadow: 0 10px 25px rgba(0,0,0,0.5), 0 0 14px rgba(6,182,212,0.18), inset 0 0 12px rgba(6,182,212,0.08);
}
#siren-music-player .siren-ext-music-title { color: #67e8f9; }
#siren-music-player .siren-ext-music-artist { color: #94a3b8; }
#siren-music-player .siren-ext-ctrl-btn { color: #67e8f9; }
#siren-music-player #siren-play-btn { color: #22c55e !important; }
#siren-music-player #siren-ext-progress.siren-ext-progress-bar {
    background-image: linear-gradient(to right, #22c55e var(--progress, 0%), rgba(255,255,255,0.15) var(--progress, 0%)) !important;
}
#siren-music-player #siren-ext-progress.siren-ext-progress-bar::-webkit-slider-thumb { background: #22c55e !important; box-shadow: 0 0 8px rgba(34,197,94,0.8) !important; }
#siren-music-player #siren-ext-progress.siren-ext-progress-bar::-moz-range-thumb { background: #22c55e !important; box-shadow: 0 0 8px rgba(34,197,94,0.8) !important; }`
            },
            glass: {
              name: "\u73BB\u7483",
              isReadonly: true,
              code: `
#siren-music-player {
    background: rgba(255,255,255,0.08);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255,255,255,0.18);
    box-shadow: 0 12px 32px rgba(0,0,0,0.25);
}
#siren-music-player .siren-ext-player-cover { background: rgba(16,185,129,0.18); border: 1px solid rgba(16,185,129,0.35); }
#siren-music-player .siren-ext-music-title { color: #e2e8f0; }
#siren-music-player .siren-ext-music-artist { color: #cbd5e1; }
#siren-music-player .siren-ext-ctrl-btn { color: #e2e8f0; }
#siren-music-player #siren-play-btn { color: #34d399 !important; }
#siren-music-player #siren-ext-progress.siren-ext-progress-bar {
    background-image: linear-gradient(to right, #34d399 var(--progress, 0%), rgba(255,255,255,0.2) var(--progress, 0%)) !important;
}
#siren-music-player #siren-ext-progress.siren-ext-progress-bar::-webkit-slider-thumb { background: #34d399 !important; box-shadow: 0 0 8px rgba(52,211,153,0.8) !important; }
#siren-music-player #siren-ext-progress.siren-ext-progress-bar::-moz-range-thumb { background: #34d399 !important; box-shadow: 0 0 8px rgba(52,211,153,0.8) !important; }`
            },
            vinyl: {
              name: "\u9ED1\u80F6\u5531\u7247",
              isReadonly: true,
              code: `
#siren-music-player {
    background: #111827;
    border: 1px solid #374151;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
}
#siren-music-player .siren-ext-player-cover {
    background: radial-gradient(circle at center, #1f2937 0 18%, #000 19% 58%, #1f2937 59% 70%, #000 71% 100%);
    border: 1px solid #4b5563;
}
#siren-music-player .siren-ext-music-title { color: #f9fafb; }
#siren-music-player .siren-ext-music-artist { color: #9ca3af; }
#siren-music-player .siren-ext-ctrl-btn { color: #d1d5db; }
#siren-music-player #siren-play-btn { color: #f59e0b !important; }
#siren-music-player #siren-ext-progress.siren-ext-progress-bar {
    background-image: linear-gradient(to right, #f59e0b var(--progress, 0%), rgba(255,255,255,0.15) var(--progress, 0%)) !important;
}
#siren-music-player #siren-ext-progress.siren-ext-progress-bar::-webkit-slider-thumb { background: #f59e0b !important; box-shadow: 0 0 8px rgba(245,158,11,0.8) !important; }
#siren-music-player #siren-ext-progress.siren-ext-progress-bar::-moz-range-thumb { background: #f59e0b !important; box-shadow: 0 0 8px rgba(245,158,11,0.8) !important; }`
            },
            cyber: {
              name: "\u8D5B\u535A\u7EC8\u7AEF",
              isReadonly: true,
              code: `
#siren-music-player {
    background: #0a0f1e;
    border: 1px solid #00f5d4;
    border-radius: 8px; /* \u5F3A\u5236\u65B9\u6B63\u4E00\u70B9 */
    box-shadow: 0 10px 25px rgba(0,0,0,0.6), 0 0 12px rgba(0,245,212,0.18), inset 0 0 10px rgba(0,245,212,0.08);
    font-family: monospace;
}
#siren-music-player.expanded { border-radius: 8px; }
#siren-music-player .siren-ext-player-cover { border-radius: 4px; border: 1px solid #00f5d4; }
#siren-music-player .siren-ext-music-title { color: #d1fae5; font-weight: 700; text-shadow: 0 0 5px rgba(0,245,212,0.4); }
#siren-music-player .siren-ext-music-artist { color: #7dd3fc; }
#siren-music-player .siren-ext-ctrl-btn { color: #7dd3fc; }
#siren-music-player #siren-play-btn { color: #00f5d4 !important; text-shadow: 0 0 8px rgba(0,245,212,0.8); }
#siren-music-player #siren-ext-progress.siren-ext-progress-bar {
    background-image: linear-gradient(to right, #00f5d4 var(--progress, 0%), rgba(255,255,255,0.15) var(--progress, 0%)) !important;
}
#siren-music-player #siren-ext-progress.siren-ext-progress-bar::-webkit-slider-thumb { border-radius: 2px !important; background: #00f5d4 !important; box-shadow: 0 0 10px rgba(0,245,212,0.8) !important; }
#siren-music-player #siren-ext-progress.siren-ext-progress-bar::-moz-range-thumb { border-radius: 2px !important; background: #00f5d4 !important; box-shadow: 0 0 10px rgba(0,245,212,0.8) !important; }`
            },
            nebula: {
              name: "\u68A6\u5E7B\u661F\u4E91",
              isReadonly: true,
              code: `
#siren-music-player {
    background: linear-gradient(135deg, rgba(76,29,149,0.92), rgba(30,41,59,0.95), rgba(219,39,119,0.25));
    border: 1px solid rgba(244,114,182,0.35);
    box-shadow: 0 10px 25px rgba(0,0,0,0.5), 0 0 18px rgba(168,85,247,0.18);
}
#siren-music-player .siren-ext-player-cover { background: linear-gradient(135deg, #f472b6, #a855f7); }
#siren-music-player .siren-ext-player-cover i { color: #ffffff !important; } /* \u{1F31F} \u5F3A\u5236\u5C06\u97F3\u7B26\u67D3\u6210\u767D\u8272 */
#siren-music-player .siren-ext-music-title { color: #fce7f3; }
#siren-music-player .siren-ext-music-artist { color: #ddd6fe; }
#siren-music-player .siren-ext-ctrl-btn { color: #e9d5ff; }
#siren-music-player #siren-play-btn { color: #f472b6 !important; }
#siren-music-player #siren-ext-progress.siren-ext-progress-bar {
    background-image: linear-gradient(to right, #a855f7 var(--progress, 0%), rgba(255,255,255,0.2) var(--progress, 0%)) !important;
}
#siren-music-player #siren-ext-progress.siren-ext-progress-bar::-webkit-slider-thumb { background: #f472b6 !important; border-color: #fce7f3 !important; box-shadow: 0 0 8px rgba(244,114,182,0.8) !important; }
#siren-music-player #siren-ext-progress.siren-ext-progress-bar::-moz-range-thumb { background: #f472b6 !important; border-color: #fce7f3 !important; box-shadow: 0 0 8px rgba(244,114,182,0.8) !important; }`
            },
            retro: {
              name: "\u7559\u58F0\u673A",
              isReadonly: true,
              code: `
#siren-music-player {
    background: linear-gradient(135deg, #3f2f23, #1f1812);
    border: 1px solid #8b6b4a;
    box-shadow: 0 12px 28px rgba(0,0,0,0.6);
}
#siren-music-player .siren-ext-player-cover { background: #8b6b4a; border: 2px solid #5c4033; }
#siren-music-player .siren-ext-player-cover i { color: #f5deb3 !important; } /* \u{1F31F} \u5F3A\u5236\u5C06\u97F3\u7B26\u67D3\u6210\u590D\u53E4\u9EC4\u94DC\u8272 */
#siren-music-player .siren-ext-music-title { color: #f5deb3; }
#siren-music-player .siren-ext-music-artist { color: #d6c1a3; }
#siren-music-player .siren-ext-ctrl-btn { color: #d6c1a3; }
#siren-music-player #siren-play-btn { color: #f5deb3 !important; }
#siren-music-player #siren-ext-progress.siren-ext-progress-bar {
    background-image: linear-gradient(to right, #8b6b4a var(--progress, 0%), rgba(255,255,255,0.15) var(--progress, 0%)) !important;
}
#siren-music-player #siren-ext-progress.siren-ext-progress-bar::-webkit-slider-thumb { background: #f5deb3 !important; border-color: #8b6b4a !important; box-shadow: 0 0 8px rgba(139,107,74,0.8) !important; }
#siren-music-player #siren-ext-progress.siren-ext-progress-bar::-moz-range-thumb { background: #f5deb3 !important; border-color: #8b6b4a !important; box-shadow: 0 0 8px rgba(139,107,74,0.8) !important; }`
            },
            pill: {
              name: "\u6781\u7B80\u80F6\u56CA",
              isReadonly: true,
              code: `
#siren-music-player {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(0,0,0,0.08);
    border-radius: 20px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.06);
}
#siren-music-player .siren-ext-music-title { color: #1d1d1f; font-weight: 600; }
#siren-music-player .siren-ext-music-artist { color: #86868b; font-weight: 500; }
#siren-music-player .siren-ext-ctrl-btn { color: #86868b; transition: color 0.2s ease; }
#siren-music-player .siren-ext-ctrl-btn:hover { color: #1d1d1f; }
#siren-music-player #siren-play-btn { color: #1d1d1f !important; }
#siren-music-player #siren-ext-progress.siren-ext-progress-bar {
    background-image: linear-gradient(to right, #1d1d1f var(--progress, 0%), rgba(0,0,0,0.08) var(--progress, 0%)) !important;
}
/* \u4EFF Apple \u7684\u7EAF\u767D\u5E26\u9634\u5F71\u6ED1\u5757 */
#siren-music-player #siren-ext-progress.siren-ext-progress-bar::-webkit-slider-thumb { background: #ffffff !important; border: 1px solid rgba(0,0,0,0.1) !important; box-shadow: 0 2px 6px rgba(0,0,0,0.15) !important; height: 12px !important; width: 12px !important; }
#siren-music-player #siren-ext-progress.siren-ext-progress-bar::-moz-range-thumb { background: #ffffff !important; border: 1px solid rgba(0,0,0,0.1) !important; box-shadow: 0 2px 6px rgba(0,0,0,0.15) !important; height: 12px !important; width: 12px !important; }`
            }
          },
          msgDict: {
            default: {
              name: "\u6DF1\u6D77",
              isReadonly: false,
              code: `
.siren-music-card { display:inline-flex !important; align-items:center !important; gap:12px !important; background:rgba(10,15,30,0.85) !important; backdrop-filter:blur(12px) !important; -webkit-backdrop-filter:blur(12px) !important; border:1px solid rgba(6,182,212,0.3) !important; padding:6px 14px 6px 6px !important; border-radius:40px !important; box-shadow:0 4px 15px rgba(0,0,0,0.5), 0 0 10px rgba(6,182,212,0.1) !important; cursor:pointer !important; transition:all 0.3s ease !important; }
.siren-music-card:hover { transform: translateY(-1px) !important; box-shadow:0 6px 20px rgba(6,182,212,0.2) !important; }
.siren-music-cover-wrap { width:30px !important; height:30px !important; border-radius:50% !important; background:#1e293b !important; display:flex !important; align-items:center !important; justify-content:center !important; box-shadow:0 0 8px rgba(0,0,0,0.5) !important; flex-shrink:0 !important; }
/* \u{1F6E1}\uFE0F \u5F3A\u5236\u8986\u76D6 ST \u56FE\u6807\u989C\u8272 */
.siren-play-icon { color:#06b6d4 !important; font-size:12px !important; filter:drop-shadow(0 0 8px rgba(6,182,212,0.8)) !important; opacity: 1 !important; }
.siren-music-info-wrap { display:flex !important; flex-direction:column !important; line-height:1.2 !important; min-width:0 !important; }
/* \u{1F6E1}\uFE0F \u5F3A\u5236\u8986\u76D6 ST \u5B57\u4F53\u989C\u8272 */
.siren-title { color:#f1f5f9 !important; font-weight:600 !important; text-shadow:0 0 5px rgba(255,255,255,0.2) !important; white-space:nowrap !important; overflow:hidden !important; text-overflow:ellipsis !important; max-width:240px !important; }
.siren-artist { color:#94a3b8 !important; font-size:11px !important; white-space:nowrap !important; overflow:hidden !important; text-overflow:ellipsis !important; max-width:240px !important; }`
            },
            deepsea: {
              name: "\u9713\u8679",
              isReadonly: false,
              code: `
.siren-music-card { display:inline-flex !important; align-items:center !important; gap:10px !important; background:linear-gradient(135deg, rgba(8,47,73,0.88), rgba(15,23,42,0.92)) !important; border:1px solid rgba(34,211,238,0.35) !important; padding:10px 14px !important; border-radius:12px !important; box-shadow:0 0 14px rgba(6,182,212,0.18), inset 0 0 12px rgba(6,182,212,0.08) !important; cursor:pointer !important; transition:all 0.3s ease !important; }
.siren-music-card:hover { transform: translateY(-1px) !important; }
/* \u{1F6E1}\uFE0F \u9713\u8679\u5E95\u5EA7\u900F\u660E\u5316 */
.siren-music-cover-wrap { background:transparent !important; box-shadow:none !important; width:auto !important; height:auto !important; display:inline-flex !important; align-items:center !important; flex-shrink:0 !important; border-radius: 0 !important; }
.siren-play-icon { color:#22c55e !important; font-size:14px !important; filter:none !important; }
.siren-music-info-wrap { display:flex !important; flex-direction:column !important; line-height:1.2 !important; min-width:0 !important; }
.siren-title { color:#67e8f9 !important; font-weight:700 !important; white-space:nowrap !important; overflow:hidden !important; text-overflow:ellipsis !important; max-width:240px !important; }
.siren-artist { color:#94a3b8 !important; font-size:12px !important; white-space:nowrap !important; overflow:hidden !important; text-overflow:ellipsis !important; max-width:240px !important; }`
            },
            glass: {
              name: "\u73BB\u7483",
              isReadonly: false,
              code: `
.siren-music-card { display:inline-flex !important; align-items:center !important; gap:12px !important; background:rgba(255,255,255,0.08) !important; backdrop-filter:blur(10px) !important; -webkit-backdrop-filter:blur(10px) !important; border:1px solid rgba(255,255,255,0.18) !important; padding:10px 14px !important; border-radius:16px !important; box-shadow:0 8px 24px rgba(0,0,0,0.18) !important; cursor:pointer !important; transition:all 0.3s ease !important; }
.siren-music-card:hover { transform: translateY(-1px) !important; }
.siren-music-cover-wrap { width:28px !important; height:28px !important; border-radius:50% !important; background:rgba(16,185,129,0.18) !important; border:1px solid rgba(16,185,129,0.35) !important; display:flex !important; align-items:center !important; justify-content:center !important; flex-shrink:0 !important; box-shadow:none !important; }
.siren-play-icon { color:#34d399 !important; font-size:12px !important; filter:none !important; }
.siren-music-info-wrap { display:flex !important; flex-direction:column !important; line-height:1.2 !important; min-width:0 !important; }
.siren-title { color:#e2e8f0 !important; font-weight:600 !important; white-space:nowrap !important; overflow:hidden !important; text-overflow:ellipsis !important; max-width:240px !important; }
.siren-artist { color:#cbd5e1 !important; font-size:12px !important; white-space:nowrap !important; overflow:hidden !important; text-overflow:ellipsis !important; max-width:240px !important; }`
            },
            vinyl: {
              name: "\u9ED1\u80F6\u5531\u7247",
              isReadonly: false,
              code: `
.siren-music-card { display:inline-flex !important; align-items:center !important; gap:12px !important; background:#111827 !important; border:1px solid #374151 !important; padding:10px 14px !important; border-radius:14px !important; box-shadow:0 4px 18px rgba(0,0,0,0.35) !important; cursor:pointer !important; transition:all 0.3s ease !important; }
.siren-music-card:hover { transform: translateY(-1px) !important; }
.siren-music-cover-wrap { width:34px !important; height:34px !important; border-radius:50% !important; background:radial-gradient(circle at center, #1f2937 0 18%, #000 19% 58%, #1f2937 59% 70%, #000 71% 100%) !important; border:1px solid #4b5563 !important; display:flex !important; align-items:center !important; justify-content:center !important; flex-shrink:0 !important; box-shadow:none !important; }
.siren-play-icon { color:#f59e0b !important; font-size:11px !important; filter:none !important; }
.siren-music-info-wrap { display:flex !important; flex-direction:column !important; line-height:1.15 !important; min-width:0 !important; }
.siren-title { color:#f9fafb !important; font-weight:700 !important; white-space:nowrap !important; overflow:hidden !important; text-overflow:ellipsis !important; max-width:240px !important; }
.siren-artist { color:#9ca3af !important; font-size:12px !important; white-space:nowrap !important; overflow:hidden !important; text-overflow:ellipsis !important; max-width:240px !important; }`
            },
            cyber: {
              name: "\u8D5B\u535A\u7EC8\u7AEF",
              isReadonly: false,
              code: `
.siren-music-card { display:inline-flex !important; align-items:center !important; gap:10px !important; background:#0a0f1e !important; border:1px solid #00f5d4 !important; padding:10px 14px !important; border-radius:6px !important; box-shadow:0 0 12px rgba(0,245,212,0.18), inset 0 0 10px rgba(0,245,212,0.08) !important; cursor:pointer !important; position:relative !important; transition:all 0.3s ease !important; font-family:monospace !important; }
.siren-music-card:hover { transform: translateY(-1px) !important; box-shadow:0 0 16px rgba(0,245,212,0.3), inset 0 0 10px rgba(0,245,212,0.12) !important; }
/* \u91CD\u7F6E\u5E95\u5EA7\u900F\u660E\uFF0C\u9002\u914D\u7EDF\u4E00\u7684 HTML \u7ED3\u6784 */
.siren-music-cover-wrap { background:transparent !important; box-shadow:none !important; width:auto !important; height:auto !important; display:inline-flex !important; align-items:center !important; flex-shrink:0 !important; border-radius:0 !important; }
.siren-play-icon { color:#00f5d4 !important; font-size:13px !important; filter:none !important; }
.siren-music-info-wrap { display:flex !important; flex-direction:column !important; line-height:1.2 !important; min-width:0 !important; }
.siren-title { color:#d1fae5 !important; font-weight:700 !important; white-space:nowrap !important; overflow:hidden !important; text-overflow:ellipsis !important; max-width:240px !important; }
.siren-artist { color:#7dd3fc !important; font-size:12px !important; white-space:nowrap !important; overflow:hidden !important; text-overflow:ellipsis !important; max-width:240px !important; }`
            },
            nebula: {
              name: "\u68A6\u5E7B\u661F\u4E91",
              isReadonly: false,
              code: `
.siren-music-card { display:inline-flex !important; align-items:center !important; gap:12px !important; background:linear-gradient(135deg, rgba(76,29,149,0.9), rgba(30,41,59,0.92), rgba(219,39,119,0.18)) !important; border:1px solid rgba(244,114,182,0.35) !important; padding:10px 14px !important; border-radius:18px !important; box-shadow:0 0 18px rgba(168,85,247,0.18) !important; cursor:pointer !important; transition:all 0.3s ease !important; }
.siren-music-card:hover { transform: translateY(-1px) !important; }
.siren-music-cover-wrap { width:30px !important; height:30px !important; border-radius:999px !important; background:linear-gradient(135deg,#f472b6,#a855f7) !important; display:flex !important; align-items:center !important; justify-content:center !important; flex-shrink:0 !important; box-shadow:none !important; }
.siren-play-icon { color:white !important; font-size:12px !important; filter:none !important; }
.siren-music-info-wrap { display:flex !important; flex-direction:column !important; line-height:1.2 !important; min-width:0 !important; }
.siren-title { color:#fce7f3 !important; font-weight:700 !important; white-space:nowrap !important; overflow:hidden !important; text-overflow:ellipsis !important; max-width:240px !important; }
.siren-artist { color:#ddd6fe !important; font-size:12px !important; white-space:nowrap !important; overflow:hidden !important; text-overflow:ellipsis !important; max-width:240px !important; }`
            },
            retro: {
              name: "\u7559\u58F0\u673A",
              isReadonly: false,
              code: `
.siren-music-card { display:inline-flex !important; align-items:center !important; gap:12px !important; background:linear-gradient(135deg,#3f2f23,#1f1812) !important; border:1px solid #8b6b4a !important; padding:10px 14px !important; border-radius:10px !important; box-shadow:0 6px 16px rgba(0,0,0,0.28) !important; cursor:pointer !important; transition:all 0.3s ease !important; }
.siren-music-card:hover { transform: translateY(-1px) !important; }
.siren-music-cover-wrap { width:30px !important; height:30px !important; border-radius:50% !important; background:#8b6b4a !important; display:flex !important; align-items:center !important; justify-content:center !important; flex-shrink:0 !important; box-shadow:none !important; }
.siren-play-icon { color:#f5deb3 !important; font-size:12px !important; filter:none !important; }
.siren-music-info-wrap { display:flex !important; flex-direction:column !important; line-height:1.2 !important; min-width:0 !important; }
.siren-title { color:#f5deb3 !important; font-weight:700 !important; white-space:nowrap !important; overflow:hidden !important; text-overflow:ellipsis !important; max-width:240px !important; }
.siren-artist { color:#d6c1a3 !important; font-size:12px !important; white-space:nowrap !important; overflow:hidden !important; text-overflow:ellipsis !important; max-width:240px !important; }`
            },
            pill: {
              name: "\u6781\u7B80\u80F6\u56CA",
              isReadonly: false,
              code: `
.siren-music-card { display:inline-flex !important; align-items:center !important; gap:10px !important; background:rgba(255,255,255,0.95) !important; backdrop-filter:blur(12px) !important; -webkit-backdrop-filter:blur(12px) !important; border:1px solid rgba(0,0,0,0.08) !important; padding:8px 14px !important; border-radius:999px !important; cursor:pointer !important; transition:all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important; box-shadow:0 2px 10px rgba(0,0,0,0.04) !important; }
.siren-music-card:hover { transform: translateY(-1px) !important; box-shadow:0 4px 16px rgba(0,0,0,0.08) !important; border-color:rgba(0,0,0,0.15) !important; }
.siren-music-cover-wrap { background:transparent !important; box-shadow:none !important; width:auto !important; height:auto !important; display:inline-flex !important; align-items:center !important; flex-shrink:0 !important; border-radius:0 !important; }
.siren-play-icon { color:#1d1d1f !important; font-size:13px !important; filter:none !important; }
.siren-music-info-wrap { display:flex !important; flex-direction:row !important; align-items:center !important; gap:6px !important; line-height:1 !important; min-width:0 !important; }
.siren-title { color:#1d1d1f !important; font-weight:600 !important; white-space:nowrap !important; overflow:hidden !important; text-overflow:ellipsis !important; max-width:120px !important; }
.siren-title::after { content: ' \xB7'; color:#86868b !important; margin-left:6px; font-weight:normal !important; }
.siren-artist { color:#86868b !important; font-size:12px !important; white-space:nowrap !important; overflow:hidden !important; text-overflow:ellipsis !important; max-width:120px !important; }`
            }
          }
        }
      },
      tts: {
        enabled: false,
        history_length: 30,
        clean_speak_tags_to_llm: false,
        clean_speak_tags_replacement: "\u201C\u201D",
        // 🌟 新增：TTS 语音条美化预设和状态机
        beautify_enabled: false,
        beautify_current: "\u6DF1\u6D77",
        beautify_css: "",
        // 当前生效的 CSS 会被写入这里供全局应用
        beautify_list: {
          \u6DF1\u6D77: `/* =========================
   \u2728 \u6DF1\u6D77 (Deep Sea)
   ========================= */
.siren-speak-card { background: rgba(10,15,30,0.85) !important; backdrop-filter: blur(12px) !important; -webkit-backdrop-filter: blur(12px) !important; border: 1px solid rgba(6,182,212,0.3) !important; padding: 6px 8px !important; border-radius: 40px !important; box-shadow: 0 4px 15px rgba(0,0,0,0.5), 0 0 10px rgba(6,182,212,0.1) !important; }
.siren-speak-card:hover { transform: translateY(-1px) !important; box-shadow: 0 6px 20px rgba(6,182,212,0.2) !important; }
.siren-speak-card .siren-btn-wrap { background: #1e293b !important; border-radius: 50% !important; box-shadow: 0 0 8px rgba(0,0,0,0.5) !important; }
.siren-speak-text { color: #f1f5f9 !important; font-weight: normal !important; text-shadow: 0 0 5px rgba(255,255,255,0.2) !important; }

/* \u{1F31F} \u65E0\u89C6 ST \u5265\u58F3\uFF0C\u76F4\u63A5\u7ED9 data \u5C5E\u6027\u91CC\u7684 i \u6807\u7B7E\u4E0A\u8272 */
.siren-speak-card .fa-circle-play,
.siren-speak-card .siren-play-spinner-wrap .fa-spinner,
.siren-speak-card [data-siren-icon="1"] i {
    color: #06b6d4 !important; 
    filter: drop-shadow(0 0 8px rgba(6,182,212,0.8)) !important; 
}
.siren-speak-card .fa-rotate-right, .siren-speak-card .siren-regen-spinner-wrap .fa-spinner { color: #10b981 !important; filter: drop-shadow(0 0 8px rgba(16,185,129,0.8)) !important; }`,
          \u9713\u8679: `/* =========================
   \u2728 \u9713\u8679 (Neon)
   ========================= */
.siren-speak-card { background: linear-gradient(135deg, rgba(8,47,73,0.88), rgba(15,23,42,0.92)) !important; border: 1px solid rgba(34,211,238,0.35) !important; box-shadow: 0 0 14px rgba(6,182,212,0.18), inset 0 0 12px rgba(6,182,212,0.08) !important; }
.siren-speak-card:hover { border-color: rgba(34, 211, 238, 0.8) !important; box-shadow: 0 0 20px rgba(6, 182, 212, 0.4), inset 0 0 15px rgba(6, 182, 212, 0.2) !important; }
.siren-speak-text { color: #67e8f9 !important; font-weight: normal !important; }
.siren-speak-card .fa-circle-play, .siren-speak-card .siren-play-spinner-wrap .fa-spinner, .siren-speak-card [data-siren-icon="1"] i { color: #22c55e !important; filter: drop-shadow(0 0 5px rgba(34,197,94,0.5)) !important; } 
.siren-speak-card .fa-rotate-right, .siren-speak-card .siren-regen-spinner-wrap .fa-spinner { color: #f59e0b !important; filter: drop-shadow(0 0 5px rgba(245,158,11,0.5)) !important; }`,
          \u73BB\u7483: `/* =========================
   \u2728 \u73BB\u7483 (Glass)
   ========================= */
.siren-speak-card { background: rgba(255,255,255,0.08) !important; backdrop-filter: blur(10px) !important; border: 1px solid rgba(255,255,255,0.18) !important; box-shadow: 0 8px 24px rgba(0,0,0,0.18) !important; }
.siren-speak-card:hover { background: rgba(255,255,255,0.12) !important; border-color: rgba(52, 211, 153, 0.6) !important; box-shadow: 0 12px 28px rgba(0,0,0,0.25), 0 0 15px rgba(52,211,153,0.2) !important; }
.siren-speak-text { color: #e2e8f0 !important; font-weight: normal !important; }
.siren-speak-card .fa-circle-play, .siren-speak-card .siren-play-spinner-wrap .fa-spinner, .siren-speak-card [data-siren-icon="1"] i { color: #34d399 !important; }
.siren-speak-card .fa-rotate-right, .siren-speak-card .siren-regen-spinner-wrap .fa-spinner { color: #34d399 !important; }`,
          \u9ED1\u80F6\u5531\u7247: `/* =========================
   \u2728 \u9ED1\u80F6\u5531\u7247 (Vinyl)
   ========================= */
.siren-speak-card { background: #111827 !important; border: 1px solid #374151 !important; box-shadow: 0 4px 18px rgba(0,0,0,0.35) !important; }
.siren-speak-card:hover { border-color: #f59e0b !important; box-shadow: 0 6px 22px rgba(0,0,0,0.5), 0 0 15px rgba(245,158,11,0.15) !important; }
.siren-speak-text { color: #f9fafb !important; font-weight: normal !important; }
.siren-speak-card .fa-circle-play, .siren-speak-card .siren-play-spinner-wrap .fa-spinner, .siren-speak-card [data-siren-icon="1"] i { color: #f59e0b !important; }
.siren-speak-card .fa-rotate-right, .siren-speak-card .siren-regen-spinner-wrap .fa-spinner { color: #9ca3af !important; }`,
          \u8D5B\u535A\u7EC8\u7AEF: `/* =========================
   \u2728 \u8D5B\u535A\u7EC8\u7AEF (Cyber)
   ========================= */
.siren-speak-card { background: #0a0f1e !important; border: 1px solid #00f5d4 !important; border-radius: 6px !important; box-shadow: 0 0 12px rgba(0,245,212,0.18), inset 0 0 10px rgba(0,245,212,0.08) !important; }
.siren-speak-card:hover { border-color: #00f5d4 !important; box-shadow: 0 0 20px rgba(0,245,212,0.4), inset 0 0 15px rgba(0,245,212,0.2) !important; }
.siren-speak-text { color: #d1fae5 !important; font-weight: normal !important; font-family: monospace !important; }
.siren-speak-card .fa-circle-play, .siren-speak-card .siren-play-spinner-wrap .fa-spinner, .siren-speak-card [data-siren-icon="1"] i { color: #00f5d4 !important; filter: drop-shadow(0 0 5px rgba(0,245,212,0.6)) !important; }
.siren-speak-card .fa-rotate-right, .siren-speak-card .siren-regen-spinner-wrap .fa-spinner { color: #00f5d4 !important; }`,
          \u68A6\u5E7B\u661F\u4E91: `/* =========================
   \u2728 \u68A6\u5E7B\u661F\u4E91 (Nebula)
   ========================= */
.siren-speak-card { background: linear-gradient(135deg, rgba(76,29,149,0.9), rgba(30,41,59,0.92), rgba(219,39,119,0.18)) !important; border: 1px solid rgba(244,114,182,0.35) !important; box-shadow: 0 0 18px rgba(168,85,247,0.18) !important; }
.siren-speak-card:hover { border-color: rgba(244, 114, 182, 0.8) !important; box-shadow: 0 4px 25px rgba(244, 114, 182, 0.4), 0 0 15px rgba(168,85,247,0.3) !important; }
.siren-speak-text { color: #fce7f3 !important; font-weight: normal !important; }
.siren-speak-card .fa-circle-play, .siren-speak-card .siren-play-spinner-wrap .fa-spinner, .siren-speak-card [data-siren-icon="1"] i { color: #f472b6 !important; filter: drop-shadow(0 0 5px rgba(244,114,182,0.5)) !important; }
.siren-speak-card .fa-rotate-right, .siren-speak-card .siren-regen-spinner-wrap .fa-spinner { color: #f472b6 !important; }`,
          \u7559\u58F0\u673A: `/* =========================
   \u2728 \u7559\u58F0\u673A (Retro)
   ========================= */
.siren-speak-card { background: linear-gradient(135deg,#3f2f23,#1f1812) !important; border: 1px solid #8b6b4a !important; box-shadow: 0 6px 16px rgba(0,0,0,0.28) !important; }
.siren-speak-card:hover { border-color: #d6c1a3 !important; box-shadow: 0 8px 20px rgba(0,0,0,0.4), 0 0 12px rgba(139,107,74,0.3) !important; }
.siren-speak-text { color: #f5deb3 !important; font-weight: normal !important; }
.siren-speak-card .fa-circle-play, .siren-speak-card .siren-play-spinner-wrap .fa-spinner, .siren-speak-card [data-siren-icon="1"] i { color: #f5deb3 !important; }
.siren-speak-card .fa-rotate-right, .siren-speak-card .siren-regen-spinner-wrap .fa-spinner { color: #f5deb3 !important; }`,
          \u6781\u7B80\u80F6\u56CA: `/* =========================
   \u2728 \u6781\u7B80\u80F6\u56CA (Pill)
   ========================= */
.siren-speak-card { background: rgba(255, 255, 255, 0.95) !important; backdrop-filter: blur(12px) !important; -webkit-backdrop-filter: blur(12px) !important; border: 1px solid rgba(0, 0, 0, 0.08) !important; padding: 8px 16px !important; border-radius: 999px !important; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04) !important; transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important; }
.siren-speak-card:hover { border-color: rgba(0, 0, 0, 0.15) !important; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08) !important; transform: translateY(-1px) !important; }
.siren-speak-text { color: #1d1d1f !important; font-weight: 500 !important; }
.siren-speak-card .fa-circle-play, .siren-speak-card .siren-play-spinner-wrap .fa-spinner, .siren-speak-card [data-siren-icon="1"] i { color: #1d1d1f !important; filter: none !important; transition: color 0.2s ease !important; }
.siren-speak-card .fa-circle-play:hover, .siren-speak-card .fa-rotate-right:hover, .siren-speak-card [data-siren-icon="1"] i:hover { color: #86868b !important; }`
        },
        // API
        provider: "indextts",
        minimax: {
          region: "cn",
          api_key: "",
          model: "speech-2.8-hd",
          text_norm: false
        },
        indextts: {
          api_base: "http://127.0.0.1:7880",
          api_key: "",
          auto_play: true,
          clean_text: true,
          // 采样参数
          emo_weight: 0.65,
          max_text_tokens_per_segment: 120,
          // 范围 20-600
          do_sample: true,
          // 启用采样
          emo_random: false,
          top_p: 0.8,
          top_k: 30,
          temperature: 0.8,
          length_penalty: 0,
          num_beams: 3,
          // 范围 1-10
          repetition_penalty: 10,
          max_mel_tokens: 1500,
          // mood 词表提示
          mood_prompt_mode: "preset_plus_custom",
          // preset_plus_custom / freeform
          // 全局情绪资产库
          // method: "audio" | "vector"
          emotion_presets: [
            /*
                    {
                      id: "emo_xxx",
                      name: "悲伤",
                      triggers: ["悲伤"],
                      method: "audio",
                      ref_audio: "sad.wav",
                      emo_weight: 0.75, // 音频专属权重
                      emo_vec: null,
                      emo_random: false
                    },
                    {
                      id: "emo_yyy",
                      name: "疯狂",
                      triggers: ["疯狂"],
                      method: "vector",
                      ref_audio: null,
                      emo_weight: 0.65,
                      emo_vec: [0.1, 0.8, ...],
                      emo_random: true // 向量专属随机
                    }
                    */
          ],
          // 自定义 mood 输出时，是否走 detail => emo_text
          allow_detail_as_emo_text: true,
          // 如果 mood 命中预设，detail 是否继续附加到 emo_text 中
          append_detail_to_emo_text: false
        },
        doubao: {
          app_id: "",
          access_key: ""
        },
        gptsovits: {
          api_base: "http://127.0.0.1:8000",
          api_key: "",
          text_split_method: "\u6309\u6807\u70B9\u7B26\u53F7\u5207",
          fragment_interval: 0.3,
          parallel_infer: true,
          speed_factor: 1,
          temperature: 1,
          top_p: 1,
          top_k: 15,
          repetition_penalty: 1.35,
          seed: -1
        },
        voxcpm: {
          api_base: "http://127.0.0.1:8000",
          api_key: "",
          split_method: "punctuation",
          chunk_min_len: 15,
          chunk_max_len: 60,
          norm_text: false,
          denoise: false,
          retry_badcase: true,
          cfg_value: 2,
          inference_timesteps: 10,
          min_len: 2,
          max_len: 4096,
          retry_badcase_max_times: 3,
          retry_badcase_ratio_threshold: 6
        }
      },
      mixer: {
        volume: {
          master: 100,
          // 主音量
          tts: 100,
          // TTS 语音
          ambience: 100,
          // 环境背景音
          sfx: 100,
          // 效果音
          music: 100
          // 潮汐音乐台
        },
        spatial_mode: 1,
        // 0: 无, 1: 简单模式, 2: 沉浸模式
        stereo_width: 0.8,
        // 简单模式的声相宽度 (范围 0.0 ~ 1.0)
        spatial_radius: 2,
        // 沉浸模式的声场半径 (为了方便滑动条，存储时可保持浮点数，UI上映射)
        effects: {
          inner_voice: {
            enabled: true,
            reverb: 50,
            // 广度/空间感 (0-100)
            echo: 30
            // 回声强度 (0-100)
          },
          telephone: {
            enabled: true,
            bandwidth: 60,
            // 频段压缩 (0-100)
            distortion: 40
            // 失真度 (0-100)
          }
        }
      }
    });
  }
});

// scripts/audio_engine.js
function disconnectAudioFromMixer(audioElement) {
  const route = routeCache.get(audioElement);
  if (!route) return;
  audioElement.removeEventListener("ended", route.finish);
  audioElement.removeEventListener("error", route.finish);
  for (const node of route.nodes) {
    try {
      node.disconnect();
    } catch {
    }
    if ("buffer" in node) node.buffer = null;
    if ("curve" in node) node.curve = null;
  }
  routeCache.delete(audioElement);
}
function releaseAudioElement(audioElement) {
  if (!audioElement) return;
  const src = audioElement.getAttribute("src");
  audioElement.onended = audioElement.onerror = null;
  audioElement.pause();
  disconnectAudioFromMixer(audioElement);
  audioElement.removeAttribute("src");
  audioElement.load();
  if (src?.startsWith("blob:")) URL.revokeObjectURL(src);
}
function initAudioEngine() {
  if (audioCtx) return audioCtx;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  audioCtx = new AudioContext({ latencyHint: "playback" });
  buses.master = audioCtx.createGain();
  buses.master.connect(audioCtx.destination);
  ["tts", "ambience", "sfx", "music"].forEach((ch) => {
    buses[ch] = audioCtx.createGain();
    buses[ch].connect(buses.master);
  });
  syncAllVolumesFromSettings();
  if (audioCtx.state === "suspended") {
    audioCtx.resume().catch((error) => console.warn("[Siren TT] \u97F3\u9891\u7B49\u5F85\u7528\u6237\u70B9\u51FB\u540E\u89E3\u9501:", error));
  }
  console.log(
    "[Siren Voice] \u{1F39B}\uFE0F \u786C\u4EF6\u7EA7\u7A7A\u95F4\u6DF7\u97F3\u53F0 (Web Audio Mixer) \u521D\u59CB\u5316\u5B8C\u6210\uFF01"
  );
  return audioCtx;
}
function setBusVolume(channel, value) {
  if (!audioCtx || !buses[channel]) return;
  buses[channel].gain.value = Math.max(0, Math.min(1, (Number(value) || 0) / 100));
}
function syncAllVolumesFromSettings() {
  if (!audioCtx) return;
  const settings = getSirenSettings();
  const vol = settings?.mixer?.volume || {
    master: 100,
    tts: 100,
    ambience: 100,
    sfx: 100,
    music: 100
  };
  for (const channel of ["master", "tts", "ambience", "sfx", "music"]) {
    setBusVolume(channel, vol[channel] ?? 100);
  }
}
function routeAudioToMixer(audioElement, channel = "tts", dir = "center", tagType = "speak") {
  const ctx = initAudioEngine();
  const settings = getSirenSettings();
  const mode = settings?.mixer?.spatial_mode || 0;
  const fxConfig = settings?.mixer?.effects;
  disconnectAudioFromMixer(audioElement);
  if (ctx.state === "suspended") {
    ctx.resume().catch((error) => console.warn("[Siren TT] \u97F3\u9891\u5F15\u64CE\u5C1A\u672A\u89E3\u9501:", error));
  }
  let source = sourceCache.get(audioElement);
  if (!source) {
    source = ctx.createMediaElementSource(audioElement);
    sourceCache.set(audioElement, source);
  }
  source.disconnect();
  const nodes = [source];
  const track = (node) => {
    nodes.push(node);
    return node;
  };
  const finish = () => disconnectAudioFromMixer(audioElement);
  routeCache.set(audioElement, { nodes, finish });
  audioElement.addEventListener("ended", finish);
  audioElement.addEventListener("error", finish);
  const fxOut = track(ctx.createGain());
  if (tagType === "phone" && fxConfig?.telephone?.enabled) {
    const bw = fxConfig.telephone.bandwidth;
    const dist = fxConfig.telephone.distortion;
    console.log(
      `[Siren Voice] \u{1F4DE} \u6FC0\u6D3B\u7535\u8BDD\u5931\u771F\u5904\u7406: \u9891\u6BB5\u538B\u7F29=${bw}%, \u5931\u771F\u5EA6=${dist}%`
    );
    const hpf = track(ctx.createBiquadFilter());
    hpf.type = "highpass";
    hpf.frequency.value = 300 + bw * 7;
    const lpf = track(ctx.createBiquadFilter());
    lpf.type = "lowpass";
    lpf.frequency.value = 4e3 - bw * 20;
    const waveShaper = track(ctx.createWaveShaper());
    waveShaper.curve = makeDistortionCurve(dist * 1.5);
    waveShaper.oversample = "4x";
    source.connect(hpf);
    hpf.connect(lpf);
    lpf.connect(waveShaper);
    waveShaper.connect(fxOut);
  } else if (tagType === "inner" && fxConfig?.inner_voice?.enabled) {
    const revVal = fxConfig.inner_voice.reverb;
    const echoVal = fxConfig.inner_voice.echo;
    console.log(
      `[Siren Voice] \u{1F4AD} \u6FC0\u6D3B\u5FC3\u58F0\u56DE\u54CD\u5904\u7406: \u7A7A\u95F4\u5E7F\u5EA6=${revVal}%, \u56DE\u58F0\u5F3A\u5EA6=${echoVal}%`
    );
    source.connect(fxOut);
    if (revVal > 0) {
      const convolver = track(ctx.createConvolver());
      const duration = 1 + revVal / 100 * 3;
      convolver.buffer = createImpulseResponse(ctx, duration, 2);
      const reverbGain = track(ctx.createGain());
      reverbGain.gain.value = revVal / 100 * 0.8;
      source.connect(convolver);
      convolver.connect(reverbGain);
      reverbGain.connect(fxOut);
    }
    if (echoVal > 0) {
      const delay = track(ctx.createDelay());
      delay.delayTime.value = 0.3;
      const delayGain = track(ctx.createGain());
      delayGain.gain.value = echoVal / 100 * 0.5;
      source.connect(delay);
      delay.connect(delayGain);
      delayGain.connect(fxOut);
    }
  } else {
    source.connect(fxOut);
  }
  const targetBus = buses[channel] || buses.master;
  const effectiveDir = tagType === "inner" || tagType === "phone" ? "center" : dir;
  const effectiveMode = tagType === "inner" || tagType === "phone" ? 0 : mode;
  const modeNames = ["0 (\u4E2D\u5FC3\u70B9)", "1 (\u7B80\u5355\u7ACB\u4F53\u58F0)", "2 (\u6C89\u6D78\u5168\u666F\u58F0)"];
  console.log(
    `[Siren Voice] \u{1F3A7} \u6700\u7EC8\u7269\u7406\u5206\u914D | \u901A\u9053:[${channel}] | \u6807\u7B7E:<${tagType}> | \u573A\u57DF: ${modeNames[effectiveMode]} | \u65B9\u4F4D: ${effectiveDir}`
  );
  if (effectiveMode === 0 || effectiveDir === "center") {
    fxOut.connect(targetBus);
    return;
  }
  if (effectiveMode === 1) {
    const width = settings.mixer?.stereo_width ?? 0.8;
    const panner = track(ctx.createStereoPanner());
    let panValue = 0;
    if (effectiveDir === "left") panValue = -width;
    else if (effectiveDir === "right") panValue = width;
    else if (effectiveDir === "far_left") panValue = -1;
    else if (effectiveDir === "far_right") panValue = 1;
    panner.pan.value = panValue;
    fxOut.connect(panner);
    panner.connect(targetBus);
    return;
  }
  if (effectiveMode === 2) {
    const R = settings.mixer?.spatial_radius ?? 2;
    const X_WIDER = R * 0.866;
    const Z_CLOSER = R * 0.5;
    const panner = track(ctx.createPanner());
    panner.panningModel = "HRTF";
    panner.distanceModel = "inverse";
    const posMap = {
      front: [0, 0, -R],
      back: [0, 0, R],
      left: [-R, 0, 0],
      right: [R, 0, 0],
      front_left: [-X_WIDER, 0, -Z_CLOSER],
      front_right: [X_WIDER, 0, -Z_CLOSER],
      back_left: [-X_WIDER, 0, Z_CLOSER],
      back_right: [X_WIDER, 0, Z_CLOSER]
    };
    const targetPos = posMap[effectiveDir] || [0, 0, -R];
    panner.positionX.value = targetPos[0];
    panner.positionY.value = targetPos[1];
    panner.positionZ.value = targetPos[2];
    fxOut.connect(panner);
    panner.connect(targetBus);
    return;
  }
}
function makeDistortionCurve(amount) {
  const k = typeof amount === "number" ? amount : 50;
  const n_samples = 44100;
  const curve = new Float32Array(n_samples);
  const deg = Math.PI / 180;
  for (let i = 0; i < n_samples; ++i) {
    const x = i * 2 / n_samples - 1;
    curve[i] = (3 + k) * x * 20 * deg / (Math.PI + k * Math.abs(x));
  }
  return curve;
}
function createImpulseResponse(ctx, duration, decay) {
  const key = `${ctx.sampleRate}:${duration}:${decay}`;
  if (impulseCache.has(key)) return impulseCache.get(key);
  const length = ctx.sampleRate * duration;
  const impulse = ctx.createBuffer(2, length, ctx.sampleRate);
  const left = impulse.getChannelData(0);
  const right = impulse.getChannelData(1);
  for (let i = 0; i < length; i++) {
    const multiplier = Math.pow(1 - i / length, decay);
    left[i] = (Math.random() * 2 - 1) * multiplier;
    right[i] = (Math.random() * 2 - 1) * multiplier;
  }
  if (impulseCache.size >= 2) impulseCache.delete(impulseCache.keys().next().value);
  impulseCache.set(key, impulse);
  return impulse;
}
var audioCtx, buses, sourceCache, routeCache, impulseCache;
var init_audio_engine = __esm({
  "scripts/audio_engine.js"() {
    init_settings();
    audioCtx = null;
    buses = {
      master: null,
      tts: null,
      ambience: null,
      sfx: null,
      music: null
    };
    sourceCache = /* @__PURE__ */ new WeakMap();
    routeCache = /* @__PURE__ */ new WeakMap();
    impulseCache = /* @__PURE__ */ new Map();
  }
});

// scripts/runtime.js
function isTauriIOS() {
  if (!globalThis.window?.__TAURITAVERN__) return false;
  const nav = globalThis.navigator;
  return /iPad|iPhone|iPod/.test(nav?.userAgent || "") || nav?.platform === "MacIntel" && nav?.maxTouchPoints > 1;
}
function createTaskLimiter(getLimit) {
  let active = 0;
  const waiting = [];
  function drain() {
    while (waiting.length && active < Math.max(1, getLimit())) {
      const { task, resolve, reject } = waiting.shift();
      active++;
      Promise.resolve().then(task).then(resolve, reject).finally(() => {
        active--;
        drain();
      });
    }
  }
  return (task) => new Promise((resolve, reject) => {
    waiting.push({ task, resolve, reject });
    drain();
  });
}
function setAudioPreview(audio, blob) {
  const previous = audio.getAttribute("src");
  audio.pause();
  audio.removeAttribute("src");
  audio.load();
  if (previous?.startsWith("blob:")) URL.revokeObjectURL(previous);
  const url = URL.createObjectURL(blob);
  audio.src = url;
  audio.preload = "metadata";
  audio.setAttribute("playsinline", "");
  return url;
}
var init_runtime = __esm({
  "scripts/runtime.js"() {
  }
});

// scripts/utils.js
function updateSirenSliderUI(slider) {
  const min = parseFloat(slider.min || 0);
  const max = parseFloat(slider.max || 100);
  const val = parseFloat(slider.value);
  const percent = max > min ? (val - min) / (max - min) * 100 : 0;
  slider.style.setProperty("--val", `${percent}%`);
}
function bindSirenSliders(sliderIds) {
  sliderIds.forEach((id) => {
    const slider = document.getElementById(id);
    if (!slider) return;
    updateSirenSliderUI(slider);
    slider.addEventListener("input", (e) => {
      updateSirenSliderUI(e.target);
    });
  });
}
function compileSirenCss(rawCss) {
  if (!rawCss) return "";
  let safeCss = rawCss.replace(
    /\.siren-scene-active\s+\.mes_text/gi,
    ".siren-scene-active .siren-karaoke-target"
  );
  safeCss = safeCss.replace(
    /background:\s*linear-gradient\(to right,\s*(.*?)\s+var\(--k-prog,\s*0%\),\s*(.*?)\s+var\(--k-prog,\s*0%\)\);/g,
    "background: linear-gradient(to right, $1 50%, $2 50%); background-size: 200% 100%; background-position: calc(100% - var(--k-prog, 0%)) 0;"
  );
  return safeCss.replace(
    /\.siren-([a-zA-Z0-9_-]+)/g,
    ":is(.siren-$1, .custom-siren-$1)"
  );
}
function safeStr(value) {
  return typeof value === "string" ? value.trim() : "";
}
function stripParentheticalAsides(text) {
  return String(text || "").replace(/\[[^[\]]*\]/g, "").replace(/【[^【】]*】/g, "").replace(/[ \t]+/g, " ").trim();
}
function stripInlineMarkdown(text) {
  if (!text || typeof text !== "string") return "";
  return text.replace(/[*_`]/g, "").replace(/~~/g, "").trim();
}
function stripWrappingPunctuation(textOrHtml) {
  if (!textOrHtml || typeof textOrHtml !== "string") return "";
  let trimmed = textOrHtml.trim();
  const trimEdges = (str) => str.replace(/^(?:\s|<br\s*\/?>|&nbsp;)+|(?:\s|<br\s*\/?>|&nbsp;)+$/gi, "");
  const pairedPunctuation = [
    ['"', '"'],
    ["'", "'"],
    ["\u201C", "\u201D"],
    ["\u2018", "\u2019"],
    ["\u300C", "\u300D"],
    ["\u300E", "\u300F"],
    ["\u300A", "\u300B"],
    ["\u3008", "\u3009"],
    ["*", "*"],
    ["`", "`"]
  ];
  let previous;
  do {
    previous = trimmed;
    trimmed = trimEdges(trimmed);
    for (const [open, close] of pairedPunctuation) {
      if (trimmed.startsWith(open) && trimmed.endsWith(close) && trimmed.length >= open.length + close.length) {
        trimmed = trimmed.slice(open.length, -close.length);
        break;
      }
    }
  } while (trimmed !== previous);
  return trimmed.trim();
}
function getActiveSirenWorldbookName() {
  if (!window.TavernHelper || typeof window.TavernHelper.getGlobalWorldbookNames !== "function") {
    return null;
  }
  try {
    const globalWbs = window.TavernHelper.getGlobalWorldbookNames();
    return globalWbs.find((name) => name.includes("Siren-Voice")) || null;
  } catch (error) {
    console.warn("[Siren Voice] \u83B7\u53D6\u4E16\u754C\u4E66\u540D\u79F0\u5931\u8D25:", error);
    return null;
  }
}
async function syncTtsWorldbookEntries(selectedProvider, isTtsEnabled) {
  if (!window.TavernHelper || typeof window.TavernHelper.updateWorldbookWith !== "function")
    return;
  const targetWbName = getActiveSirenWorldbookName();
  if (!targetWbName) return;
  const providerToEntrySuffix = {
    indextts: "indexTTS",
    gptsovits: "GPT-SoVITS",
    doubao: "\u8C46\u5305",
    minimax: "minimax",
    voxcpm: "VoxCPM"
    // <--- 🌟 新增这一行：将 voxcpm 映射到世界书条目 TTS-VoxCPM
  };
  const targetEntryName = isTtsEnabled ? `TTS-${providerToEntrySuffix[selectedProvider]}` : null;
  try {
    await window.TavernHelper.updateWorldbookWith(
      targetWbName,
      (worldbook) => {
        worldbook.forEach((entry) => {
          if (entry.name && entry.name.startsWith("TTS-")) {
            entry.enabled = isTtsEnabled ? entry.name === targetEntryName : false;
          }
        });
        return worldbook;
      },
      { render: "debounced" }
    );
    console.log(
      `[Siren Voice] TTS\u4E16\u754C\u4E66\u6761\u76EE\u5F00\u5173\u540C\u6B65\u5B8C\u6210\u3002\u6FC0\u6D3B\u6761\u76EE: ${targetEntryName || "\u65E0"}`
    );
  } catch (error) {
    console.error("[Siren Voice] \u540C\u6B65\u4E16\u754C\u4E66\u5931\u8D25:", error);
  }
}
async function syncSpatialWorldbookEntries(spatialMode) {
  const targetWbName = getActiveSirenWorldbookName();
  if (!targetWbName || typeof window.TavernHelper.updateWorldbookWith !== "function") {
    console.warn(
      "[Siren Voice] \u672A\u627E\u5230\u5305\u542B 'Siren-Voice' \u7684\u4E16\u754C\u4E66\u6216\u73AF\u5883\u4E0D\u53EF\u7528\uFF0C\u8DF3\u8FC7\u7A7A\u95F4\u611F\u4E16\u754C\u4E66\u540C\u6B65\u3002"
    );
    return;
  }
  try {
    await window.TavernHelper.updateWorldbookWith(
      targetWbName,
      (worldbook) => {
        worldbook.forEach((entry) => {
          if (entry.name === "Direction-Simple") {
            entry.enabled = spatialMode === 1;
          }
          if (entry.name === "Direction-Immersive") {
            entry.enabled = spatialMode === 2;
          }
        });
        return worldbook;
      },
      { render: "debounced" }
    );
    console.log(`[Siren Voice] \u7A7A\u95F4\u611F\u4E16\u754C\u4E66\u540C\u6B65\u5B8C\u6210\u3002\u5F53\u524D\u6A21\u5F0F: ${spatialMode}`);
  } catch (error) {
    console.error("[Siren Voice] \u540C\u6B65\u7A7A\u95F4\u611F\u4E16\u754C\u4E66\u5931\u8D25:", error);
  }
}
async function syncAmbienceWorldbookEntries(isAmbienceEnabled) {
  const targetWbName = getActiveSirenWorldbookName();
  if (!targetWbName || typeof window.TavernHelper.updateWorldbookWith !== "function")
    return;
  try {
    await window.TavernHelper.updateWorldbookWith(
      targetWbName,
      (worldbook) => {
        worldbook.forEach((entry) => {
          if (entry.name === "AMBIENCE" || entry.name === "SFX") {
            entry.enabled = isAmbienceEnabled;
          }
        });
        return worldbook;
      },
      { render: "debounced" }
    );
    console.log(
      `[Siren Voice] AMBIENCE/SFX\u4E16\u754C\u4E66\u6761\u76EE\u5F00\u5173\u540C\u6B65\u5B8C\u6210\u3002\u72B6\u6001: ${isAmbienceEnabled}`
    );
  } catch (error) {
    console.error("[Siren Voice] \u540C\u6B65AMBIENCE\u4E16\u754C\u4E66\u5931\u8D25:", error);
  }
}
async function syncMusicWorldbookEntry(isMusicEnabled) {
  const targetWbName = getActiveSirenWorldbookName();
  if (!targetWbName || typeof window.TavernHelper.updateWorldbookWith !== "function") {
    console.warn(
      "[Siren Voice] \u672A\u627E\u5230\u5305\u542B 'Siren-Voice' \u7684\u4E16\u754C\u4E66\u6216\u73AF\u5883\u4E0D\u53EF\u7528\uFF0C\u8DF3\u8FC7 Music \u4E16\u754C\u4E66\u540C\u6B65\u3002"
    );
    return;
  }
  try {
    await window.TavernHelper.updateWorldbookWith(
      targetWbName,
      (worldbook) => {
        worldbook.forEach((entry) => {
          if (entry.name === "Music") {
            entry.enabled = isMusicEnabled;
          }
        });
        return worldbook;
      },
      { render: "debounced" }
    );
    console.log(
      `[Siren Voice] Music\u4E16\u754C\u4E66\u540C\u6B65\u5B8C\u6210\u3002\u6F6E\u6C50\u97F3\u4E50\u53F0\u72B6\u6001: ${isMusicEnabled}`
    );
  } catch (error) {
    console.error("[Siren Voice] \u540C\u6B65Music\u4E16\u754C\u4E66\u5931\u8D25:", error);
  }
}
function checkReplyIntegrity(content, customStopRaw) {
  if (!content || content.trim().length < 1) {
    console.warn("[Siren Voice] \u26D4 \u62E6\u622A\uFF1A\u56DE\u590D\u5185\u5BB9\u4E3A\u7A7A");
    return false;
  }
  const trimmedContent = content.trim();
  if (customStopRaw && customStopRaw.trim().length > 0) {
    const customList = customStopRaw.split(/[,，]/);
    for (const item of customList) {
      const symbol = item.trim();
      if (!symbol) continue;
      if (trimmedContent.endsWith(symbol)) {
        return true;
      }
    }
    const lastChar2 = trimmedContent.slice(-1);
    console.warn(
      `[Siren Voice] \u26D4 \u62E6\u622A\uFF1A\u56DE\u590D\u88AB\u622A\u65AD\u3002\u7ED3\u5C3E\u5B57\u7B26: [${lastChar2}] (\u672A\u5339\u914D\u81EA\u5B9A\u4E49\u89C4\u5219: ${customStopRaw})`
    );
    return false;
  }
  const defaultPunctuation = /[.!?。！？"”'’…—\-~>）)\]\}】》〉」』*＊`_；;]$/;
  if (defaultPunctuation.test(trimmedContent)) {
    return true;
  }
  const lastChar = trimmedContent.slice(-1);
  console.warn(
    `[Siren Voice] \u26D4 \u62E6\u622A\uFF1A\u56DE\u590D\u88AB\u622A\u65AD\u3002\u7ED3\u5C3E\u5B57\u7B26: [${lastChar}] (\u672A\u5339\u914D\u9ED8\u8BA4\u89C4\u5219)`
  );
  return false;
}
function getRealVolume(channel) {
  const settings = getSirenSettings();
  if (!settings || !settings.mixer) return 1;
  const master = (settings.mixer.volume.master ?? 100) / 100;
  const chVol = (settings.mixer.volume[channel] ?? 100) / 100;
  return Math.max(0, Math.min(1, master * chVol));
}
var init_utils = __esm({
  "scripts/utils.js"() {
    init_settings();
  }
});

// scripts/indextts_logic.js
function getTtsSettings() {
  const context = SillyTavern.getContext();
  const settings = context?.extensionSettings?.[MODULE_NAME2];
  return settings?.tts?.indextts || {};
}
function findCharacterIdByName(charName) {
  const context = SillyTavern.getContext();
  const characters = context?.characters || [];
  if (!charName) return void 0;
  const normalized = charName.trim().toLowerCase();
  let index = characters.findIndex((c) => {
    const name = c?.name || c?.data?.name || "";
    return name.trim().toLowerCase() === normalized;
  });
  if (index !== -1) return index;
  index = characters.findIndex((c) => {
    const ext = c?.data?.extensions?.[CHARACTER_TTS_KEY];
    const aliases = Array.isArray(ext?.aliases) ? ext.aliases : [];
    return aliases.some(
      (alias) => String(alias).trim().toLowerCase() === normalized
    );
  });
  if (index !== -1) return index;
  return void 0;
}
function getCharacterTtsConfig(characterId) {
  const context = SillyTavern.getContext();
  if (characterId === void 0 || characterId === null) return null;
  const character = context?.characters?.[characterId];
  return character?.data?.extensions?.[CHARACTER_TTS_KEY] || null;
}
function resolveVoiceRefBySpeakChar(speakChar) {
  const context = SillyTavern.getContext();
  const currentId = context?.characterId;
  const safeSpeakChar = (speakChar || "").trim().toLowerCase();
  if (currentId !== void 0 && currentId !== null) {
    const currentCfg = getCharacterTtsConfig(currentId);
    if (currentCfg && currentCfg.voices) {
      const matchKey = Object.keys(currentCfg.voices).find(
        (k) => k.trim().toLowerCase() === safeSpeakChar
      );
      if (matchKey && currentCfg.voices[matchKey]) {
        return {
          voice_ref: currentCfg.voices[matchKey],
          characterId: currentId,
          source: "current_char_voices_map",
          config: currentCfg
        };
      }
    }
  }
  if (safeSpeakChar) {
    const cid = findCharacterIdByName(speakChar);
    if (cid !== void 0) {
      const cfg = getCharacterTtsConfig(cid);
      if (cfg && cfg.voices) {
        const matchKey = Object.keys(cfg.voices).find(
          (k) => k.trim().toLowerCase() === safeSpeakChar
        );
        if (matchKey && cfg.voices[matchKey]) {
          return {
            voice_ref: cfg.voices[matchKey],
            characterId: cid,
            source: "global_char_match",
            config: cfg
          };
        }
      } else if (cfg && cfg.voice_ref) {
        return {
          voice_ref: cfg.voice_ref,
          characterId: cid,
          source: "global_char_legacy",
          config: cfg
        };
      }
    }
  }
  if (currentId !== void 0 && currentId !== null) {
    const currentCfg = getCharacterTtsConfig(currentId);
    if (currentCfg && currentCfg.voices) {
      const firstVoice = Object.values(currentCfg.voices)[0];
      if (firstVoice) {
        return {
          voice_ref: firstVoice,
          characterId: currentId,
          source: "fallback_to_first_voice",
          config: currentCfg
        };
      }
    }
  }
  return {
    voice_ref: "",
    characterId: void 0,
    source: "none",
    config: null
  };
}
function matchEmotionPreset(mood, settings = null) {
  const tts = settings || getTtsSettings();
  const presets = Array.isArray(tts?.emotion_presets) ? tts.emotion_presets : [];
  if (!mood) return null;
  const normalizedMood = mood.trim().toLowerCase();
  const matchedPresets = [];
  for (const preset of presets) {
    const normalizedName = String(preset?.name || "").trim().toLowerCase();
    if (!normalizedName) continue;
    if (normalizedName === normalizedMood || normalizedName.startsWith(normalizedMood + "-")) {
      matchedPresets.push(preset);
    }
  }
  if (matchedPresets.length === 0) {
    return null;
  }
  const randomIndex = Math.floor(Math.random() * matchedPresets.length);
  const selectedPreset = matchedPresets[randomIndex];
  if (matchedPresets.length > 1) {
    console.log(
      `\u{1F30A} [Siren Voice][TTS] \u{1F3AF} \u60C5\u7EEA\u6C60\u547D\u4E2D: mood="${mood}", \u5339\u914D\u5230 ${matchedPresets.length} \u4E2A\u5019\u9009\uFF0C\u968F\u673A\u9009\u4E2D\u4E86: ${selectedPreset.name}`
    );
  }
  return selectedPreset;
}
function buildIndexTtsPayload(speakObj, voiceRef, ttsSettings = null) {
  const settings = ttsSettings || getTtsSettings();
  const text = safeStr(speakObj?.text);
  const mood = safeStr(speakObj?.mood);
  const detail = safeStr(speakObj?.detail);
  const payload = {
    text,
    prompt_audio: voiceRef || "",
    clean_text: settings.clean_text !== false,
    emo_control_method: 0,
    emo_ref_path: null,
    emo_text: null,
    emo_vec: null,
    // 全局兜底参数
    emo_weight: Number(settings.emo_weight ?? 0.65),
    emo_random: Boolean(settings.emo_random),
    // 高级采样参数
    do_sample: Boolean(settings.do_sample ?? true),
    max_text_tokens_per_segment: Number(
      settings.max_text_tokens_per_segment ?? 120
    ),
    top_p: Number(settings.top_p ?? 0.8),
    top_k: Number(settings.top_k ?? 30),
    temperature: Number(settings.temperature ?? 0.8),
    length_penalty: Number(settings.length_penalty ?? 0),
    num_beams: Number(settings.num_beams ?? 3),
    repetition_penalty: Number(settings.repetition_penalty ?? 10),
    max_mel_tokens: Number(settings.max_mel_tokens ?? 1500)
  };
  if (!mood && !detail) {
    return payload;
  }
  const preset = matchEmotionPreset(mood, settings);
  if (preset) {
    if (preset.method === "audio" && preset.ref_audio) {
      payload.emo_control_method = 1;
      payload.emo_ref_path = preset.ref_audio;
      if (preset.emo_weight !== void 0 && preset.emo_weight !== null) {
        payload.emo_weight = Number(preset.emo_weight);
      }
      return payload;
    }
    if (preset.method === "vector" && Array.isArray(preset.emo_vec) && preset.emo_vec.length > 0) {
      payload.emo_control_method = 2;
      payload.emo_vec = preset.emo_vec;
      payload.emo_random = Boolean(preset.emo_random);
      if (preset.emo_weight !== void 0 && preset.emo_weight !== null) {
        payload.emo_weight = Number(preset.emo_weight);
      }
      return payload;
    }
  }
  const allowDetailAsText = settings.allow_detail_as_emo_text !== false;
  const appendDetail = Boolean(settings.append_detail_to_emo_text);
  if (allowDetailAsText) {
    payload.emo_control_method = 3;
    if (mood && detail) {
      payload.emo_text = appendDetail ? `${mood}\u3002${detail}` : detail;
    } else if (detail) {
      payload.emo_text = detail;
    } else if (mood) {
      payload.emo_text = mood;
    } else {
      payload.emo_control_method = 0;
    }
  }
  return payload;
}
async function requestIndexTTS(payload) {
  const settings = getTtsSettings();
  const apiBase = String(settings.api_base || "http://127.0.0.1:7880").replace(
    /\/+$/,
    ""
  );
  const apiKey = settings.api_key || "";
  const url = `${apiBase}/api/v1/tts/tasks`;
  const headers = {
    "Content-Type": "application/json"
  };
  if (apiKey) {
    headers["Authorization"] = `Bearer ${apiKey}`;
  }
  const response = await fetch(url, {
    method: "POST",
    headers,
    // 发送 Header
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(`IndexTTS \u8BF7\u6C42\u5931\u8D25: ${response.status} ${errorText}`);
  }
  const blob = await response.blob();
  if (!blob || blob.size === 0) {
    throw new Error("IndexTTS \u8FD4\u56DE\u4E86\u7A7A\u97F3\u9891\u3002");
  }
  return blob;
}
async function requestIndexTtsGeneration(speakObj, settings) {
  const resolvedVoice = resolveVoiceRefBySpeakChar(speakObj.char);
  if (!resolvedVoice.voice_ref)
    throw new Error(`\u672A\u627E\u5230\u89D2\u8272 ${speakObj.char} \u7684\u97F3\u8272\u53C2\u8003`);
  const payload = buildIndexTtsPayload(
    speakObj,
    resolvedVoice.voice_ref,
    settings
  );
  console.log(
    `\u{1F30A} [Siren Voice][IndexTTS] \u{1F680} \u51C6\u5907\u53D1\u9001\u8BF7\u6C42\uFF0CPayload:`,
    JSON.parse(JSON.stringify(payload))
  );
  return await requestIndexTTS(payload);
}
var MODULE_NAME2, CHARACTER_TTS_KEY;
var init_indextts_logic = __esm({
  "scripts/indextts_logic.js"() {
    init_utils();
    MODULE_NAME2 = "siren_voice_settings";
    CHARACTER_TTS_KEY = "siren_voice_tts";
  }
});

// scripts/minimax_logic.js
var minimax_logic_exports = {};
__export(minimax_logic_exports, {
  cloneMinimaxVoice: () => cloneMinimaxVoice,
  fetchMinimaxVoices: () => fetchMinimaxVoices,
  generateMinimaxAudioBlob: () => generateMinimaxAudioBlob,
  uploadMinimaxFile: () => uploadMinimaxFile
});
function getBaseUrl(region) {
  return region === "global" ? "https://api.minimax.io" : "https://api.minimaxi.com";
}
function hexToBlob(hexString, mimeType = "audio/mpeg") {
  if (!hexString) return null;
  const bytes = new Uint8Array(Math.ceil(hexString.length / 2));
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hexString.substring(i * 2, i * 2 + 2), 16);
  }
  return new Blob([bytes], { type: mimeType });
}
async function fetchMinimaxVoices(apiKey, region = "cn") {
  const url = `${getBaseUrl(region)}/v1/get_voice`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({ voice_type: "all" })
  });
  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status}`);
  }
  const resData = await response.json();
  if (resData.base_resp && resData.base_resp.status_code !== 0) {
    throw new Error(resData.base_resp.status_msg || "API Error");
  }
  let voices = [];
  if (resData.system_voice) {
    resData.system_voice.forEach((v) => {
      voices.push({
        id: v.voice_id,
        name: `[\u7CFB\u7EDF] ${v.voice_name || v.voice_id}`
      });
    });
  }
  if (resData.voice_generation) {
    resData.voice_generation.forEach((v) => {
      voices.push({ id: v.voice_id, name: `[\u751F\u6210] ${v.voice_id}` });
    });
  }
  if (resData.voice_cloning) {
    resData.voice_cloning.forEach((v) => {
      voices.push({ id: v.voice_id, name: `[\u590D\u523B] ${v.voice_id}` });
    });
  }
  return voices;
}
async function generateMinimaxAudioBlob(text, mood, config, { signal } = {}) {
  const url = `${getBaseUrl(config.region || "cn")}/v1/t2a_v2`;
  const requestBody = {
    model: config.model || "speech-2.8-hd",
    text,
    stream: false,
    output_format: "hex",
    // 非流式直接要 hex
    language_boost: "auto",
    voice_setting: {
      voice_id: config.voice_id,
      speed: parseFloat(config.speed) || 1,
      vol: parseFloat(config.vol) || 1,
      pitch: parseInt(config.pitch) || 0,
      text_normalization: config.text_norm === true
    },
    audio_setting: {
      sample_rate: 32e3,
      bitrate: 128e3,
      format: "mp3",
      channel: 1
    }
  };
  const validEmotions = [
    "happy",
    "sad",
    "angry",
    "fearful",
    "disgusted",
    "surprised",
    "calm",
    "fluent",
    "whisper"
  ];
  if (mood && validEmotions.includes(mood)) {
    requestBody.voice_setting.emotion = mood;
  }
  let hasModify = false;
  const modifyData = {};
  if (config.modify_pitch !== 0) {
    modifyData.pitch = parseInt(config.modify_pitch);
    hasModify = true;
  }
  if (config.modify_intensity !== 0) {
    modifyData.intensity = parseInt(config.modify_intensity);
    hasModify = true;
  }
  if (config.modify_timbre !== 0) {
    modifyData.timbre = parseInt(config.modify_timbre);
    hasModify = true;
  }
  if (config.sound_effect && config.sound_effect !== "none") {
    modifyData.sound_effects = config.sound_effect;
    hasModify = true;
  }
  if (hasModify) {
    requestBody.voice_modify = modifyData;
  }
  console.log(
    `[Siren Voice] \u{1F680} \u53D1\u9001\u7ED9 MiniMax \u7684\u8BF7\u6C42\u53C2\u6570 (\u89D2\u8272: ${config.char || "\u672A\u77E5"}):`,
    JSON.stringify(requestBody, null, 2)
  );
  const response = await fetch(url, {
    method: "POST",
    signal,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.api_key}`
    },
    body: JSON.stringify(requestBody)
  });
  if (!response.ok) {
    throw new Error(`MiniMax \u8BF7\u6C42\u5931\u8D25: HTTP ${response.status}`);
  }
  const resData = await response.json();
  if (resData.base_resp && resData.base_resp.status_code !== 0) {
    throw new Error(
      `MiniMax API \u62A5\u9519 [${resData.base_resp.status_code}]: ${resData.base_resp.status_msg}`
    );
  }
  if (!resData.data || !resData.data.audio) {
    throw new Error("MiniMax \u8FD4\u56DE\u6570\u636E\u4E2D\u7F3A\u5931\u97F3\u9891 (Hex) \u5B57\u6BB5");
  }
  const blob = hexToBlob(resData.data.audio, "audio/mpeg");
  return blob;
}
async function uploadMinimaxFile(apiKey, file, purpose, region = "cn") {
  const url = `${getBaseUrl(region)}/v1/files/upload`;
  const formData = new FormData();
  formData.append("purpose", purpose);
  formData.append("file", file);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`
      // 注意：不要手动设置 Content-Type，浏览器会自动设置包含 boundary 的 multipart/form-data
    },
    body: formData
  });
  if (!response.ok) {
    throw new Error(`\u6587\u4EF6\u4E0A\u4F20\u5931\u8D25: HTTP ${response.status}`);
  }
  const resData = await response.json();
  if (resData.base_resp && resData.base_resp.status_code !== 0) {
    throw new Error(
      `\u4E0A\u4F20\u62A5\u9519 [${resData.base_resp.status_code}]: ${resData.base_resp.status_msg}`
    );
  }
  return resData.file;
}
async function cloneMinimaxVoice(apiKey, cloneConfig) {
  const url = `${getBaseUrl(cloneConfig.region || "cn")}/v1/voice_clone`;
  const requestBody = {
    file_id: parseInt(cloneConfig.file_id),
    voice_id: cloneConfig.voice_id,
    text: cloneConfig.text,
    model: cloneConfig.model || "speech-2.8-hd",
    language_boost: "auto",
    need_noise_reduction: cloneConfig.need_noise_reduction === true,
    need_volume_normalization: true,
    // 按照要求默认 true
    aigc_watermark: false
    // 按照要求默认 false
  };
  if (cloneConfig.prompt_audio && cloneConfig.prompt_text) {
    requestBody.clone_prompt = {
      prompt_audio: parseInt(cloneConfig.prompt_audio),
      prompt_text: cloneConfig.prompt_text
    };
  }
  console.log(
    `[Siren Voice] \u{1F680} \u53D1\u9001\u97F3\u8272\u514B\u9686\u8BF7\u6C42:`,
    JSON.stringify(requestBody, null, 2)
  );
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify(requestBody)
  });
  if (!response.ok) {
    throw new Error(`\u514B\u9686\u8BF7\u6C42\u5931\u8D25: HTTP ${response.status}`);
  }
  const resData = await response.json();
  if (resData.base_resp && resData.base_resp.status_code !== 0) {
    throw new Error(
      `\u514B\u9686\u62A5\u9519 [${resData.base_resp.status_code}]: ${resData.base_resp.status_msg}`
    );
  }
  return resData;
}
var init_minimax_logic = __esm({
  "scripts/minimax_logic.js"() {
  }
});

// scripts/doubao_logic.js
async function requestDoubaoTTSBlob(appId, accessKey, model, speaker, text, additionsObj) {
  const url = "https://openspeech.bytedance.com/api/v3/tts/unidirectional";
  const headers = {
    "Content-Type": "application/json",
    "X-Api-App-Key": appId,
    "X-Api-Access-Key": accessKey,
    "X-Api-Resource-Id": model
  };
  const uniqueId = Date.now().toString() + "_" + Math.random().toString(36).substring(2, 8);
  const payload = {
    user: { uid: "siren_" + uniqueId },
    req_params: {
      text,
      speaker,
      audio_params: {
        format: "mp3",
        sample_rate: 24e3
      },
      additions: JSON.stringify(additionsObj)
    }
  };
  if (model.includes("seed-icl-2.0")) {
    payload.req_params.model = "seed-tts-2.0-expressive";
  } else if (model.includes("seed-icl-1.0")) {
    payload.req_params.model = "seed-tts-1.1";
  }
  console.log(
    "%c\u{1F30A} [Siren Voice] \u53D1\u8D77\u8C46\u5305 TTS \u8BF7\u6C42",
    "color: #3b82f6; font-weight: bold; font-size: 13px;",
    payload
  );
  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      const errText = await response.text().catch(() => response.statusText);
      throw new Error(`HTTP ${response.status}: ${errText}`);
    }
    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let base64AudioData = "";
    let buffer = "";
    while (true) {
      const { done, value } = await reader.read();
      if (value) {
        buffer += decoder.decode(value, { stream: true });
      }
      if (done && buffer.trim()) {
        buffer += "\n";
      }
      let lines = buffer.split("\n");
      buffer = lines.pop();
      for (let line of lines) {
        line = line.trim();
        if (!line) continue;
        if (line.startsWith("data:")) {
          line = line.replace(/^data:\s*/, "");
        }
        try {
          const jsonObj = JSON.parse(line);
          if (jsonObj.data) {
            base64AudioData += jsonObj.data;
          }
          if (jsonObj.code && jsonObj.code !== 0 && jsonObj.code !== 2e7) {
            throw new Error(
              `\u706B\u5C71\u5F15\u64CE\u8FD4\u56DE\u5F02\u5E38 [${jsonObj.code}]: ${jsonObj.message}`
            );
          }
        } catch (e) {
          if (e.message.startsWith("\u706B\u5C71\u5F15\u64CE\u8FD4\u56DE\u5F02\u5E38")) throw e;
          console.warn(
            "[Siren Voice] \u8B66\u544A\uFF1A\u65E0\u6CD5\u89E3\u6790\u6B64\u884C\u6D41\u6570\u636E ->",
            line,
            e.message
          );
        }
      }
      if (done) break;
    }
    if (!base64AudioData) {
      throw new Error(
        `\u8BF7\u6C42\u6210\u529F\uFF0C\u4F46\u672A\u80FD\u4ECE\u6D41\u4E2D\u63D0\u53D6\u5230\u4EFB\u4F55\u97F3\u9891\u6570\u636E\uFF01\u8BF7\u68C0\u67E5\u6587\u672C\u662F\u5426\u8FC7\u77ED\u6216\u4EC5\u542B\u6807\u70B9\uFF08\u5F53\u524D\u6587\u672C\uFF1A${text.substring(0, 10)}...\uFF09`
      );
    }
    const binaryString = atob(base64AudioData);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    console.log(
      "%c\u2705 [Siren Voice] \u8C46\u5305\u97F3\u9891\u89E3\u6790\u6210\u529F\uFF01",
      "color: #10b981; font-weight: bold;"
    );
    return new Blob([bytes.buffer], { type: "audio/mp3" });
  } catch (error) {
    console.error("\u274C [Siren Voice] \u8C46\u5305 TTS \u8BF7\u6C42\u5931\u8D25:", error);
    throw error;
  }
}
function buildDoubaoPayloadParams(model, rawText, emotionPrompt) {
  let finalText = rawText;
  const additionsObj = {};
  if (model.includes("seed-tts") && emotionPrompt) {
    additionsObj.context_texts = [emotionPrompt];
  } else if (model.includes("seed-icl-2.0")) {
    additionsObj.use_tag_parser = true;
    if (emotionPrompt) {
      finalText = `<cot text=${emotionPrompt}>${rawText}</cot>`;
    }
  } else if (model.includes("seed-icl-1.0")) {
    console.log("[Siren Voice] \u5F53\u524D\u4F7F\u7528\u590D\u523B1.0\u6A21\u578B\uFF0C\u5DF2\u81EA\u52A8\u4E22\u5F03\u60C5\u7EEA\u6807\u7B7E");
  }
  return { finalText, additionsObj };
}
async function generateDoubaoTestAudio(params) {
  const { appId, accessKey, model, speaker, text } = params;
  let emotionPrompt = "";
  let cleanText = text;
  const match = text.match(/^\[(.*?)\]\s*(.*)$/);
  if (match) {
    emotionPrompt = match[1].trim();
    cleanText = match[2].trim();
  }
  const { finalText, additionsObj } = buildDoubaoPayloadParams(
    model,
    cleanText,
    emotionPrompt
  );
  const blob = await requestDoubaoTTSBlob(
    appId,
    accessKey,
    model,
    speaker,
    finalText,
    additionsObj
  );
  return URL.createObjectURL(blob);
}
async function generateDoubaoProductionAudioBlob(speakObj, config) {
  const { app_id, access_key, model, voice_id } = config;
  const emotionPrompt = speakObj.detail || "";
  const rawText = speakObj.text || "";
  const { finalText, additionsObj } = buildDoubaoPayloadParams(
    model,
    rawText,
    emotionPrompt
  );
  return await requestDoubaoTTSBlob(
    app_id,
    access_key,
    model,
    voice_id,
    finalText,
    additionsObj
  );
}
var init_doubao_logic = __esm({
  "scripts/doubao_logic.js"() {
  }
});

// scripts/gptsovits_logic.js
function getGptSovitsCardData() {
  const context = SillyTavern.getContext();
  const charId = context.characterId;
  if (charId !== void 0 && charId !== null && context.characters && context.characters[charId]) {
    return context.characters[charId].data?.extensions?.siren_voice_gptsovits || {};
  }
  return {};
}
async function generateGptSovitsAudio(text, charName, emotionName = "") {
  const settings = getSirenSettings();
  const gsvSettings = settings.tts?.gptsovits || {};
  const apiBase = (gsvSettings.api_base || "http://127.0.0.1:9880").replace(
    /\/$/,
    ""
  );
  const cardData = getGptSovitsCardData();
  const chars = cardData.characters || [];
  const emos = cardData.emotions || [];
  const charConfig = chars.find((c) => c.charName === charName);
  if (!charConfig) {
    const errMsg = `\u672A\u627E\u5230\u89D2\u8272 [${charName}] \u7684 GSV \u7ED1\u5B9A\u914D\u7F6E\uFF0C\u8BF7\u524D\u5F80\u6269\u5C55\u9762\u677F\u6DFB\u52A0\u3002`;
    if (window.toastr) window.toastr.warning(errMsg, "Siren Voice");
    throw new Error(errMsg);
  }
  const globalParams = {
    speed: parseFloat(gsvSettings.speed_factor) || 1,
    temp: parseFloat(gsvSettings.temperature) || 1,
    topp: parseFloat(gsvSettings.top_p) || 1,
    topk: parseInt(gsvSettings.top_k) || 15,
    rep: parseFloat(gsvSettings.repetition_penalty) || 1.35,
    seed: parseInt(gsvSettings.seed) || -1,
    textLang: "\u4E2D\u6587"
  };
  let finalGptModel = charConfig.gptModel;
  let finalSovitsModel = charConfig.sovitsModel;
  let finalRefPath = charConfig.refPath;
  let finalRefText = charConfig.refText;
  let finalPromptLang = charConfig.promptLang || "\u4E2D\u6587";
  let finalParams = {
    speed: charConfig.speedFactor ?? globalParams.speed,
    temp: charConfig.temperature ?? globalParams.temp,
    topp: charConfig.topP ?? globalParams.topp,
    topk: charConfig.topK ?? globalParams.topk,
    rep: charConfig.repetitionPenalty ?? globalParams.rep,
    seed: charConfig.seed ?? globalParams.seed,
    textLang: charConfig.textLang || "\u4E2D\u6587"
  };
  if (emotionName) {
    const emotionRegex = new RegExp(`^${emotionName}(-\\d+)?$`);
    const matchingEmos = emos.filter(
      (e) => e.charName === charName && emotionRegex.test(e.emotion)
    );
    let emoConfig = null;
    if (matchingEmos.length > 0) {
      const randomIndex = Math.floor(Math.random() * matchingEmos.length);
      emoConfig = matchingEmos[randomIndex];
      console.log(
        `[Siren GSV] \u{1F3B2} \u60C5\u7EEA\u6C60\u62BD\u53D6: \u627E\u5230 ${matchingEmos.length} \u4E2A [${emotionName}] \u7684\u53D8\u4F53\uFF0C\u968F\u673A\u547D\u4E2D: [${emoConfig.emotion}] (\u6A21\u5F0F: ${emoConfig.mode})`
      );
    }
    if (emoConfig) {
      if (emoConfig.mode === "audio") {
        if (emoConfig.refPath) finalRefPath = emoConfig.refPath;
        if (emoConfig.refText) finalRefText = emoConfig.refText;
      } else if (emoConfig.mode === "model") {
        if (emoConfig.gptModel) finalGptModel = emoConfig.gptModel;
        if (emoConfig.refPath && emoConfig.refText) {
          finalRefPath = emoConfig.refPath;
          finalRefText = emoConfig.refText;
          finalPromptLang = emoConfig.promptLang || finalPromptLang;
        } else {
          console.log(
            `[Siren GSV] \u6A21\u578B\u63A7\u5236\u672A\u8BBE\u7F6E\u72EC\u7ACB\u97F3\u9891\uFF0C\u964D\u7EA7\u4F7F\u7528\u89D2\u8272\u9ED8\u8BA4\u53C2\u8003\u97F3\u9891`
          );
        }
      }
    } else {
      console.warn(
        `[Siren GSV] \u964D\u7EA7\u89E6\u53D1\uFF1A\u60C5\u7EEA [${emotionName}] \u672A\u6CE8\u518C\u3002\u542F\u7528\u5168\u5C40\u9ED8\u8BA4\u63A8\u7406\u53C2\u6570\u4E0E\u89D2\u8272\u9ED8\u8BA4\u53C2\u8003\u97F3\u9891\u3002`
      );
      finalParams = {
        ...globalParams,
        textLang: charConfig.textLang || globalParams.textLang
      };
    }
  }
  if (!finalGptModel || !finalSovitsModel || !finalRefPath || !finalRefText) {
    const errMsg = `\u89D2\u8272 [${charName}] \u7684\u6A21\u578B\u6216\u53C2\u8003\u97F3\u9891\u914D\u7F6E\u4E0D\u5B8C\u6574\uFF0C\u8BF7\u68C0\u67E5\u3002`;
    if (window.toastr) window.toastr.error(errMsg, "Siren Voice");
    throw new Error(errMsg);
  }
  let processedRefPath = finalRefPath.trim();
  if (!processedRefPath.includes("/") && !processedRefPath.includes("\\")) {
    processedRefPath = `custom_refs/${processedRefPath}`;
  }
  let reqVersion = "v4";
  let realGptName = finalGptModel;
  if (finalGptModel.includes("::")) {
    [reqVersion, realGptName] = finalGptModel.split("::");
  }
  let realSovitsName = finalSovitsModel.includes("::") ? finalSovitsModel.split("::")[1] : finalSovitsModel;
  const payload = {
    app_key: gsvSettings.api_key || "",
    version: reqVersion,
    gpt_model_name: realGptName,
    sovits_model_name: realSovitsName,
    ref_audio_path: processedRefPath,
    prompt_text: finalRefText,
    prompt_text_lang: finalPromptLang,
    text,
    text_lang: finalParams.textLang,
    // 核心语音参数 (取自状态机)
    speed_facter: finalParams.speed,
    temperature: finalParams.temp,
    top_p: finalParams.topp,
    top_k: finalParams.topk,
    repetition_penalty: finalParams.rep,
    seed: finalParams.seed,
    // 全局级控制参数
    text_split_method: gsvSettings.text_split_method || "\u6309\u6807\u70B9\u7B26\u53F7\u5207",
    fragment_interval: gsvSettings.fragment_interval || 0.3,
    parallel_infer: gsvSettings.parallel_infer ?? true,
    batch_size: 1,
    batch_threshold: 0.75,
    split_bucket: true,
    sample_steps: 16,
    if_sr: false,
    media_type: "wav"
  };
  console.log("[Siren GSV] \u53D1\u8D77\u8BF7\u6C42 Payload:", payload);
  let response;
  try {
    response = await fetch(`${apiBase}/infer_classic`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  } catch (networkErr) {
    const errMsg = "\u65E0\u6CD5\u8FDE\u63A5\u5230 GSV \u540E\u7AEF\uFF0C\u8BF7\u786E\u8BA4\u670D\u52A1\u5DF2\u542F\u52A8\u4E14\u5730\u5740\u6B63\u786E\u3002";
    console.error("[Siren GSV] \u7F51\u7EDC\u8BF7\u6C42\u5931\u8D25:", networkErr);
    if (window.toastr) window.toastr.error(errMsg, "\u7F51\u7EDC\u9519\u8BEF");
    throw new Error(`\u7F51\u7EDC\u8FDE\u63A5\u5931\u8D25: ${networkErr.message}`);
  }
  if (!response.ok) {
    let errorMsg = `HTTP ${response.status}`;
    try {
      const errData = await response.json();
      if (errData.msg) errorMsg = errData.msg;
      else if (errData.detail) errorMsg = JSON.stringify(errData.detail);
    } catch {
      const errText = await response.text();
      if (errText) errorMsg = errText;
    }
    if (response.status === 401) {
      const msg = "API Key \u9519\u8BEF\u6216\u672A\u6388\u6743\uFF0C\u8BF7\u68C0\u67E5 GSV \u63A5\u53E3\u8BBE\u7F6E\uFF01";
      if (window.toastr) window.toastr.error(msg, "Siren Voice");
      throw new Error(msg);
    } else {
      if (window.toastr)
        window.toastr.error(`\u63A8\u7406\u5931\u8D25: ${errorMsg}`, "Siren Voice");
      throw new Error(`\u63A8\u7406\u5931\u8D25: ${errorMsg}`);
    }
  }
  const blob = await response.blob();
  if (blob.size === 0) {
    throw new Error("\u63A5\u6536\u5230\u7684\u97F3\u9891\u6D41\u4E3A\u7A7A\uFF01");
  }
  return blob;
}
var init_gptsovits_logic = __esm({
  "scripts/gptsovits_logic.js"() {
    init_settings();
  }
});

// scripts/voxcpm_logic.js
function getVoxCpmCharConfig(charName) {
  const context = SillyTavern.getContext();
  const charId = context.characterId;
  const charData = context.characters[charId]?.data?.extensions?.siren_voice_tts_voxcpm?.voices || {};
  return charData[charName] || null;
}
async function fetchVoxCpmAudioList(ttsSettings) {
  const apiBase = ttsSettings.api_base?.replace(/\/$/, "") || "http://127.0.0.1:8000";
  const apiKey = ttsSettings.api_key || "";
  const headers = {};
  if (apiKey) {
    headers["X-API-Key"] = apiKey;
  }
  try {
    const response = await fetch(`${apiBase}/v1/audio/list`, {
      method: "GET",
      headers
    });
    if (response.ok) {
      const data = await response.json();
      return data.files || [];
    }
    return [];
  } catch (error) {
    console.error("[Siren Voice] \u83B7\u53D6 VoxCPM \u97F3\u9891\u5217\u8868\u5931\u8D25:", error);
    return [];
  }
}
async function uploadVoxCpmAudio(file, ttsSettings) {
  const apiBase = ttsSettings.api_base?.replace(/\/$/, "") || "http://127.0.0.1:8000";
  const apiKey = ttsSettings.api_key || "";
  const headers = {};
  if (apiKey) {
    headers["X-API-Key"] = apiKey;
  }
  const formData = new FormData();
  formData.append("file", file);
  try {
    const response = await fetch(`${apiBase}/v1/audio/upload`, {
      method: "POST",
      headers,
      body: formData
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error(`HTTP ${response.status}`);
    }
  } catch (error) {
    console.error("[Siren Voice] \u4E0A\u4F20 VoxCPM \u97F3\u9891\u5931\u8D25:", error);
    return null;
  }
}
async function generateVoxCpmAudioBlob(speakObj, ttsSettings) {
  const apiBase = ttsSettings.api_base?.replace(/\/$/, "") || "http://127.0.0.1:8000";
  const apiKey = ttsSettings.api_key || "";
  const charName = speakObj.char || "";
  const detail = speakObj.detail || "";
  const originalText = speakObj.text || "";
  const charConfig = getVoxCpmCharConfig(charName);
  let endpoint = "";
  let payload = {
    split_method: ttsSettings.split_method || "punctuation",
    chunk_min_len: ttsSettings.chunk_min_len ?? 15,
    chunk_max_len: ttsSettings.chunk_max_len ?? 60,
    // 原有的其他参数保持不变
    cfg_value: ttsSettings.cfg_value ?? 2.5,
    inference_timesteps: ttsSettings.inference_timesteps ?? 10,
    min_len: ttsSettings.min_len ?? 2,
    max_len: ttsSettings.max_len ?? 4096,
    normalize: ttsSettings.norm_text ?? true,
    denoise: ttsSettings.denoise ?? false,
    retry_badcase: ttsSettings.retry_badcase ?? true,
    retry_badcase_max_times: ttsSettings.retry_badcase_max_times ?? 3,
    retry_badcase_ratio_threshold: ttsSettings.retry_badcase_ratio_threshold ?? 6
  };
  let instructionText = "";
  if (charConfig) {
    if (charConfig.mode === "clone") {
      endpoint = "/v1/audio/clone";
      payload.reference_wav_path = charConfig.data;
      const tags = [];
      if (charConfig.extra) tags.push(charConfig.extra);
      if (detail) tags.push(detail);
      if (tags.length > 0) {
        instructionText = `(${tags.join(", ")}) `;
      }
    } else {
      endpoint = "/v1/audio/design";
      const tags = [];
      if (charConfig.data) tags.push(charConfig.data);
      if (detail) tags.push(detail);
      if (tags.length > 0) {
        instructionText = `(${tags.join(", ")}) `;
      }
    }
  } else {
    endpoint = "/v1/audio/design";
    const tags = [];
    if (charName) tags.push(charName);
    if (detail) tags.push(detail);
    if (tags.length > 0) {
      instructionText = `(${tags.join(", ")}) `;
    }
  }
  payload.text = instructionText + originalText;
  const headers = {
    "Content-Type": "application/json"
  };
  if (apiKey) {
    headers["X-API-Key"] = apiKey;
  }
  console.groupCollapsed(
    `[Siren Voice][VoxCPM] \u53D1\u8D77 TTS \u8BF7\u6C42 -> ${charName || "\u81EA\u5B9A\u4E49"}`
  );
  console.log(`Endpoint: ${apiBase}${endpoint}`);
  console.log(`Headers:`, headers);
  console.log(`Payload (\u5B8C\u6574\u53C2\u6570):`, JSON.parse(JSON.stringify(payload)));
  console.log(`\u539F\u59CB\u6587\u672C:`, originalText);
  console.log(`\u6700\u7EC8\u53D1\u7ED9\u6A21\u578B\u7684\u7EC4\u5408\u6587\u672C:`, payload.text);
  console.groupEnd();
  try {
    const response = await fetch(`${apiBase}${endpoint}`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`VoxCPM HTTP ${response.status}: ${errorText}`);
    }
    const blob = await response.blob();
    return blob;
  } catch (error) {
    console.error(`[Siren Voice][VoxCPM] \u8BF7\u6C42\u5931\u8D25:`, error);
    if (window.toastr) {
      window.toastr.error(`VoxCPM \u751F\u6210\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u63A7\u5236\u53F0`);
    }
    return null;
  }
}
var init_voxcpm_logic = __esm({
  "scripts/voxcpm_logic.js"() {
  }
});

// scripts/db.js
var db_exports = {};
__export(db_exports, {
  addTtsRecord: () => addTtsRecord,
  clearTtsHistory: () => clearTtsHistory,
  deleteTtsRecord: () => deleteTtsRecord,
  findExactTtsRecord: () => findExactTtsRecord,
  getAmbienceRecord: () => getAmbienceRecord,
  getTtsHistory: () => getTtsHistory,
  getTtsRecord: () => getTtsRecord,
  hasExactTtsRecord: () => hasExactTtsRecord,
  saveAmbienceRecord: () => saveAmbienceRecord,
  toggleFavoriteTtsRecord: () => toggleFavoriteTtsRecord
});
function openDB() {
  if (databasePromise) return databasePromise;
  databasePromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      for (const [name, keyPath] of [[STORE_NAME, "id"], [AMBIENCE_STORE_NAME, "url"]]) {
        if (!db.objectStoreNames.contains(name)) {
          const store = db.createObjectStore(name, { keyPath });
          store.createIndex("timestamp", "timestamp", { unique: false });
        }
      }
    };
    request.onsuccess = () => {
      const db = request.result;
      const invalidate = () => {
        databasePromise = null;
        metadataPromise = null;
      };
      db.onversionchange = () => {
        db.close();
        invalidate();
      };
      db.onclose = invalidate;
      resolve(db);
    };
    request.onerror = () => {
      databasePromise = null;
      reject(request.error);
    };
    request.onblocked = () => console.warn("[Siren TT] \u6570\u636E\u5E93\u6B63\u5728\u88AB\u5176\u4ED6\u9875\u9762\u5360\u7528\uFF0C\u8BF7\u5173\u95ED\u65E7\u9875\u9762\u540E\u91CD\u8BD5\u3002");
  });
  return databasePromise;
}
function completed(transaction) {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = transaction.onabort = () => reject(
      transaction.error || new Error("IndexedDB transaction aborted")
    );
  });
}
function requestResult(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
function withoutAudio(record) {
  const { audioBlob, ...metadata } = record;
  return metadata;
}
function restoreBlob(record) {
  if (record && (record.audioBlob instanceof ArrayBuffer || ArrayBuffer.isView(record.audioBlob))) {
    record.audioBlob = new Blob([record.audioBlob], { type: record.mimeType || "audio/mpeg" });
  }
  return record;
}
async function metadataIndex() {
  if (metadataPromise) return metadataPromise;
  metadataPromise = (async () => {
    const db = await openDB();
    const index = /* @__PURE__ */ new Map();
    const tx = db.transaction(STORE_NAME, "readonly");
    const done = completed(tx);
    const request = tx.objectStore(STORE_NAME).openCursor();
    request.onsuccess = () => {
      const cursor = request.result;
      if (!cursor) return;
      index.set(cursor.primaryKey, withoutAudio(cursor.value));
      cursor.continue();
    };
    await done;
    return index;
  })().catch((error) => {
    metadataPromise = null;
    throw error;
  });
  return metadataPromise;
}
function serializeWrite(task) {
  const result = writeTail.then(task);
  writeTail = result.catch(() => {
  });
  return result;
}
function exactMetadata(index, chatId, floor, char, text, mood = "", detail = "") {
  let match = null;
  for (const record of index.values()) {
    if (record.chatId === chatId && String(record.floor) === String(floor) && record.char === char && record.text === text && (record.mood || "") === (mood || "") && (record.detail || "") === (detail || "") && (!match || record.timestamp >= match.timestamp)) match = record;
  }
  return match;
}
async function addTtsRecord(record) {
  return serializeWrite(async () => {
    try {
      const index = await metadataIndex();
      const db = await openDB();
      const audio = record.audioBlob;
      const isBlob = audio && typeof audio.arrayBuffer === "function";
      const stored = {
        ...record,
        id: record.id || `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        timestamp: Date.now(),
        isFavorite: record.isFavorite ?? false,
        chatId: record.chatId || "default",
        audioBlob: isBlob ? await audio.arrayBuffer() : audio,
        mimeType: isBlob ? audio.type || "audio/mpeg" : record.mimeType || "audio/mpeg"
      };
      const limit = Number(getSirenSettings()?.tts?.history_length ?? 30);
      const candidates = [...index.values(), withoutAudio(stored)].filter((row) => !row.isFavorite).sort((a, b) => a.timestamp - b.timestamp);
      const expired = limit > 0 ? candidates.slice(0, Math.max(0, candidates.length - limit)) : [];
      const tx = db.transaction(STORE_NAME, "readwrite");
      const done = completed(tx);
      const store = tx.objectStore(STORE_NAME);
      store.put(stored);
      for (const row of expired) store.delete(row.id);
      await done;
      index.set(stored.id, withoutAudio(stored));
      for (const row of expired) index.delete(row.id);
      return stored.id;
    } catch (error) {
      console.error("[Siren TT] \u4FDD\u5B58\u8BED\u97F3\u5931\u8D25:", error);
      return null;
    }
  });
}
async function getTtsRecord(id) {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readonly");
  return restoreBlob(await requestResult(tx.objectStore(STORE_NAME).get(id)));
}
async function getTtsHistory(chatId, { includeAudio = true, limit = Infinity } = {}) {
  try {
    const index = await metadataIndex();
    const rows = [...index.values()].filter((row) => row.chatId === chatId).sort((a, b) => b.timestamp - a.timestamp).slice(0, limit);
    if (!includeAudio) return rows.map((row) => ({ ...row }));
    const records = [];
    for (const row of rows) {
      const record = await getTtsRecord(row.id);
      if (record) records.push(record);
    }
    return records;
  } catch (error) {
    console.error("[Siren TT] \u8BFB\u53D6\u8BED\u97F3\u5386\u53F2\u5931\u8D25:", error);
    return [];
  }
}
async function hasExactTtsRecord(...args) {
  try {
    return !!exactMetadata(await metadataIndex(), ...args);
  } catch (error) {
    console.warn("[Siren TT] \u68C0\u67E5\u7F13\u5B58\u5931\u8D25:", error);
    return false;
  }
}
async function findExactTtsRecord(...args) {
  try {
    const match = exactMetadata(await metadataIndex(), ...args);
    return match ? await getTtsRecord(match.id) : null;
  } catch (error) {
    console.error("[Siren TT] \u8BFB\u53D6\u8BED\u97F3\u7F13\u5B58\u5931\u8D25:", error);
    return null;
  }
}
async function deleteTtsRecord(id) {
  return serializeWrite(async () => {
    const index = await metadataIndex();
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const done = completed(tx);
    tx.objectStore(STORE_NAME).delete(id);
    await done;
    index.delete(id);
  });
}
async function toggleFavoriteTtsRecord(id, isFavorite) {
  return serializeWrite(async () => {
    const index = await metadataIndex();
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const done = completed(tx);
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(id);
    request.onsuccess = () => {
      if (request.result) store.put({ ...request.result, isFavorite });
    };
    await done;
    if (index.has(id)) index.get(id).isFavorite = isFavorite;
  });
}
async function clearTtsHistory() {
  return serializeWrite(async () => {
    const index = await metadataIndex();
    const ids = [...index.values()].filter((row) => !row.isFavorite).map((row) => row.id);
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const done = completed(tx);
    const store = tx.objectStore(STORE_NAME);
    for (const id of ids) store.delete(id);
    await done;
    for (const id of ids) index.delete(id);
  });
}
async function getAmbienceRecord(url) {
  try {
    const db = await openDB();
    const tx = db.transaction(AMBIENCE_STORE_NAME, "readwrite");
    const done = completed(tx);
    const store = tx.objectStore(AMBIENCE_STORE_NAME);
    let result = null;
    const request = store.get(url);
    request.onsuccess = () => {
      result = request.result || null;
      if (result) store.put({ ...result, timestamp: Date.now() });
    };
    await done;
    return restoreBlob(result);
  } catch (error) {
    console.error("[Siren TT] \u8BFB\u53D6\u73AF\u5883\u97F3\u7F13\u5B58\u5931\u8D25:", error);
    return null;
  }
}
async function saveAmbienceRecord(url, audioBlob) {
  try {
    const db = await openDB();
    const tx = db.transaction(AMBIENCE_STORE_NAME, "readwrite");
    const done = completed(tx);
    const store = tx.objectStore(AMBIENCE_STORE_NAME);
    store.put({ url, audioBlob, mimeType: audioBlob.type, timestamp: Date.now() });
    let count = 0;
    const request = store.index("timestamp").openKeyCursor(null, "prev");
    request.onsuccess = () => {
      const cursor = request.result;
      if (!cursor) return;
      if (++count > 20) store.delete(cursor.primaryKey);
      cursor.continue();
    };
    await done;
  } catch (error) {
    console.error("[Siren TT] \u4FDD\u5B58\u73AF\u5883\u97F3\u7F13\u5B58\u5931\u8D25:", error);
  }
}
var DB_NAME, STORE_NAME, AMBIENCE_STORE_NAME, DB_VERSION, databasePromise, metadataPromise, writeTail;
var init_db = __esm({
  "scripts/db.js"() {
    init_settings();
    DB_NAME = "SirenVoiceDB";
    STORE_NAME = "TTS_History";
    AMBIENCE_STORE_NAME = "AMBIENCE_Cache";
    DB_VERSION = 3;
    databasePromise = null;
    metadataPromise = null;
    writeTail = Promise.resolve();
  }
});

// scripts/tts_logic.js
function getMinimaxCharConfig(charName, ttsSettings) {
  const context = SillyTavern.getContext();
  const charId = context.characterId;
  const charData = context.characters[charId]?.data?.extensions?.siren_voice_tts_minimax?.voices || {};
  const charConfig = charData[charName];
  if (!charConfig || !charConfig.voice_id) {
    if (window.toastr)
      window.toastr.warning(`\u672A\u914D\u7F6E [${charName}] \u7684 MiniMax \u97F3\u8272\u6620\u5C04\uFF01`);
    return null;
  }
  return {
    region: ttsSettings.region || "cn",
    // 👈 关键修复：把 region 透传给底层逻辑！
    api_key: ttsSettings.api_key,
    model: ttsSettings.model,
    text_norm: ttsSettings.text_norm,
    ...charConfig
  };
}
function getDoubaoCharConfig(charName, ttsSettings) {
  const context = SillyTavern.getContext();
  const charId = context.characterId;
  const charData = context.characters[charId]?.data?.extensions?.siren_voice_tts_doubao?.voices || {};
  const charConfig = charData[charName];
  if (!charConfig || !charConfig.speaker) {
    if (window.toastr)
      window.toastr.warning(`\u672A\u914D\u7F6E [${charName}] \u7684\u8C46\u5305\u97F3\u8272\u6620\u5C04\uFF01`);
    return null;
  }
  return {
    app_id: ttsSettings.appId || ttsSettings.app_id,
    access_key: ttsSettings.accessKey || ttsSettings.access_key,
    // 🌟 修复 2：优先使用角色卡里保存的专属模型（支持合成与复刻混用）
    model: charConfig.model || ttsSettings.model,
    // 🌟 修复 3：将 speaker 赋值给 voice_id 供底层请求使用
    voice_id: charConfig.speaker
  };
}
async function dispatchTtsGeneration(speakObj, floorId, provider, ttsSettings, forceRegen = false) {
  const expectedPlayback = playbackEpoch;
  try {
    const blob = await fetchTtsBlobProvider(
      speakObj,
      floorId,
      provider,
      ttsSettings,
      forceRegen
    );
    if (blob && expectedPlayback === playbackEpoch) {
      enqueueTTSBlob(blob, speakObj);
    }
  } catch (error) {
    console.error(`[Siren Voice][Router] \u274C ${provider} \u5206\u53D1\u5931\u8D25:`, error);
  }
}
function cancelPendingTtsRequests() {
  requestEpoch++;
  for (const controller of activeRequests) controller.abort();
}
async function enqueueTTSBlob(blob, speakObj = null) {
  if (!blob) return false;
  const maxItems = isTauriIOS() ? 12 : 64;
  const queuedBytes = audioQueue.reduce((sum, item) => sum + item.blob.size, 0);
  if (audioQueue.length >= maxItems || queuedBytes + blob.size > 16 * 1024 * 1024) {
    window.toastr?.warning("\u8BED\u97F3\u64AD\u653E\u961F\u5217\u5DF2\u6EE1\uFF0C\u8BF7\u64AD\u5B8C\u540E\u518D\u8BD5\u3002", "Siren Voice");
    return false;
  }
  audioQueue.push({ blob, speakObj });
  if (!isPlaying) void playNextInQueue();
  return true;
}
async function playNextInQueue() {
  if (!audioQueue.length) {
    isPlaying = false;
    return;
  }
  isPlaying = true;
  const item = audioQueue.shift();
  await playSingleBlob(item.blob, item.speakObj);
}
async function playSingleBlob(blob, speakObj = null) {
  cleanupCurrentTTS();
  const epoch = ++playbackEpoch;
  const audio = reusableTtsAudio ||= new Audio();
  currentTtsAudio = audio;
  audio.src = URL.createObjectURL(blob);
  audio.preload = "auto";
  audio.setAttribute("playsinline", "");
  audio.volume = 1;
  const tagType = speakObj?.tag || "speak";
  const dir = ["inner", "phone"].includes(tagType) ? "center" : speakObj?.dir || speakObj?.attrs?.dir || "center";
  try {
    routeAudioToMixer(audio, "tts", dir, tagType);
  } catch (error) {
    console.warn("[Siren TT] \u6DF7\u97F3\u8DEF\u7531\u5931\u8D25\uFF0C\u4F7F\u7528\u666E\u901A\u64AD\u653E:", error);
    audio.volume = getRealVolume("tts");
  }
  let finished = false;
  const finish = () => {
    if (finished || epoch !== playbackEpoch) return;
    finished = true;
    cleanupCurrentTTS();
    void playNextInQueue();
  };
  audio.onended = finish;
  audio.onerror = finish;
  try {
    await audio.play();
  } catch (error) {
    if (epoch !== playbackEpoch) return;
    console.warn("[Siren TT] \u8BED\u97F3\u64AD\u653E\u5931\u8D25:", error);
    if (error.name === "NotAllowedError") {
      window.toastr?.info("\u8BF7\u5148\u70B9\u4E00\u6B21\u8BED\u97F3\u64AD\u653E\u952E\uFF0C\u89E3\u9501 iOS \u97F3\u9891\u64AD\u653E\u3002", "Siren Voice");
      stopCurrentTTS();
    } else finish();
  }
}
function stopCurrentTTS() {
  playbackEpoch++;
  audioQueue = [];
  isPlaying = false;
  cleanupCurrentTTS();
}
function cleanupCurrentTTS() {
  releaseAudioElement(currentTtsAudio);
  currentTtsAudio = null;
}
async function fetchTtsBlobProvider(speakObj, floor, provider, ttsSettings, forceRegen = false) {
  const epoch = requestEpoch;
  const { chatId, characterId } = SillyTavern.getContext();
  return runTtsRequest(async () => {
    const current = SillyTavern.getContext();
    if (epoch !== requestEpoch || current.chatId !== chatId || current.characterId !== characterId) return null;
    const controller = new AbortController();
    activeRequests.add(controller);
    try {
      return await generateTtsBlob(speakObj, floor, provider, ttsSettings, forceRegen, controller.signal);
    } finally {
      activeRequests.delete(controller);
    }
  });
}
async function generateTtsBlob(speakObj, floor, provider, ttsSettings, forceRegen = false, signal) {
  try {
    const context = SillyTavern.getContext();
    const currentChatId = context?.chatId;
    const { findExactTtsRecord: findExactTtsRecord2 } = await Promise.resolve().then(() => (init_db(), db_exports));
    if (!forceRegen && currentChatId) {
      const cachedRecord = await findExactTtsRecord2(
        currentChatId,
        floor,
        speakObj.char,
        speakObj.text,
        speakObj.mood || "",
        speakObj.detail || ""
      );
      if (cachedRecord && cachedRecord.audioBlob) {
        return cachedRecord.audioBlob;
      }
    }
    let apiPayloadText = speakObj.text;
    apiPayloadText = stripInlineMarkdown(apiPayloadText);
    apiPayloadText = stripWrappingPunctuation(apiPayloadText);
    if (provider === "indextts" || provider === "doubao" || provider === "gptsovits") {
      apiPayloadText = stripParentheticalAsides(apiPayloadText);
    }
    if (!apiPayloadText.trim()) {
      console.log(
        `[Siren Voice][\u9884\u52A0\u8F7D] \u26A0\uFE0F \u6587\u672C\u6E05\u6D17\u540E\u4E3A\u7A7A\uFF0C\u8DF3\u8FC7 TTS\u3002\u539F\u6587\u672C: ${speakObj.text}`
      );
      return null;
    }
    let blob = null;
    switch (provider) {
      case "indextts":
        blob = await requestIndexTtsGeneration(
          { ...speakObj, text: apiPayloadText },
          ttsSettings
        );
        break;
      case "minimax":
        const preloadMmConfig = getMinimaxCharConfig(
          speakObj.char,
          ttsSettings
        );
        if (!preloadMmConfig) return null;
        const preloadMmText = apiPayloadText.replace(/\[([^\]]+)\]/g, "($1)").replace(/【([^】]+)】/g, "($1)");
        blob = await generateMinimaxAudioBlob(
          preloadMmText,
          speakObj.mood,
          preloadMmConfig,
          { signal }
        );
        break;
      case "doubao":
        const dbConfig = getDoubaoCharConfig(speakObj.char, ttsSettings);
        if (!dbConfig) return null;
        blob = await generateDoubaoProductionAudioBlob(
          { ...speakObj, text: apiPayloadText },
          dbConfig
        );
        break;
      case "gptsovits":
        blob = await generateGptSovitsAudio(
          apiPayloadText,
          speakObj.char,
          speakObj.mood
        );
        break;
      case "voxcpm":
        const voxSettings = ttsSettings?.voxcpm || ttsSettings;
        const preloadVoxText = apiPayloadText.replace(/【([^】]+)】/g, "[$1]");
        blob = await generateVoxCpmAudioBlob(
          { ...speakObj, text: preloadVoxText },
          // 传入转换括号后的文本
          voxSettings
        );
        break;
      default:
        console.warn(`[Siren Voice][\u9884\u52A0\u8F7D] \u6682\u4E0D\u652F\u6301\u8BE5\u5F15\u64CE: ${provider}`);
        return null;
    }
    if (signal?.aborted || SillyTavern.getContext().chatId !== currentChatId) return null;
    if (blob && currentChatId) {
      await addTtsRecord({
        provider,
        char: speakObj.char,
        text: speakObj.text,
        // 数据库仍保存带有**和[]的完整原文
        mood: speakObj.mood || "",
        detail: speakObj.detail || "",
        floor,
        chatId: currentChatId,
        audioBlob: blob
      });
      console.log(
        `[Siren Voice][\u9884\u52A0\u8F7D] \u{1F4BE} \u6210\u529F\u751F\u6210\u97F3\u9891\u5E76\u5199\u5165\u7F13\u5B58\u5E93\uFF0C\u53EF\u4F9B\u8BED\u97F3\u6761\u590D\u7528 (Floor: ${floor})`
      );
    }
    return blob;
  } catch (err) {
    if (signal?.aborted) return null;
    console.error(`[Siren Voice][\u9884\u52A0\u8F7D] \u274C ${provider} \u8BF7\u6C42\u5931\u8D25:`, err);
    return null;
  }
}
async function preloadTtsForTimeline(timeline, floorId, provider, ttsSettings, forceRegen = false) {
  const context = SillyTavern.getContext();
  const chatId = context?.chatId;
  try {
    switch (provider) {
      case "indextts":
      case "doubao":
      case "gptsovits":
      case "voxcpm":
        for (let i = 0; i < timeline.length; i++) {
          const node = timeline[i];
          if (node.type === "tts") {
            node.blob = await fetchTtsBlobProvider(
              node.speakObj,
              floorId,
              provider,
              ttsSettings,
              forceRegen
            );
          }
        }
        break;
      case "minimax":
        const promises = timeline.map(async (node) => {
          if (node.type === "tts") {
            node.blob = await fetchTtsBlobProvider(
              node.speakObj,
              floorId,
              provider,
              ttsSettings,
              forceRegen
            );
          }
        });
        await Promise.all(promises);
        break;
      default:
        for (let i = 0; i < timeline.length; i++) {
          const node = timeline[i];
          if (node.type === "tts") {
            node.blob = await fetchTtsBlobProvider(
              node.speakObj,
              floorId,
              provider,
              ttsSettings,
              forceRegen
            );
          }
        }
        break;
    }
  } catch (err) {
    console.error(`[Siren Voice][\u9884\u52A0\u8F7D] \u6279\u91CF\u5904\u7406\u65F6\u95F4\u8F74\u65F6\u5D29\u6E83:`, err);
  }
}
var currentTtsAudio, reusableTtsAudio, audioQueue, isPlaying, playbackEpoch, requestEpoch, activeRequests, runTtsRequest;
var init_tts_logic = __esm({
  "scripts/tts_logic.js"() {
    init_runtime();
    init_indextts_logic();
    init_minimax_logic();
    init_doubao_logic();
    init_gptsovits_logic();
    init_voxcpm_logic();
    init_utils();
    init_db();
    init_audio_engine();
    document.addEventListener("sirenVolumeChanged", (e) => {
      syncAllVolumesFromSettings();
    });
    currentTtsAudio = null;
    reusableTtsAudio = null;
    audioQueue = [];
    isPlaying = false;
    playbackEpoch = 0;
    requestEpoch = 0;
    activeRequests = /* @__PURE__ */ new Set();
    runTtsRequest = createTaskLimiter(() => isTauriIOS() ? 1 : 3);
  }
});

// scripts/ambience_logic.js
var ambience_logic_exports = {};
__export(ambience_logic_exports, {
  clearAmbienceCacheForFloor: () => clearAmbienceCacheForFloor,
  generateSignatureFromTimeline: () => generateSignatureFromTimeline,
  getActiveSfxAudio: () => getActiveSfxAudio,
  handleMessageEditRevert: () => handleMessageEditRevert,
  injectScenePlayButtons: () => injectScenePlayButtons,
  playSceneAmbience: () => playSceneAmbience,
  playSceneSfx: () => playSceneSfx,
  randomAmbienceCache: () => randomAmbienceCache,
  randomSfxCache: () => randomSfxCache,
  scanAndRefreshAllScenes: () => scanAndRefreshAllScenes,
  stopScenePlayback: () => stopScenePlayback,
  triggerSceneAutoPlay: () => triggerSceneAutoPlay
});
function initStealthKaraokeCss() {
  if (document.getElementById("siren-stealth-karaoke-css")) return;
  const style = document.createElement("style");
  style.id = "siren-stealth-karaoke-css";
  document.head.appendChild(style);
  const sheet = style.sheet;
  sheet.insertRule(
    `
        .siren-karaoke-playing {
            --k-prog: calc(max(0, min(100, (var(--siren-cursor, 0) - var(--c-off, 0)) / var(--c-len, 1) * 100)) * 1%) !important;
        }
    `,
    0
  );
  sheet.insertRule(
    `
        .siren-scene-active {
            --siren-cursor: 0;
        }
    `,
    1
  );
  stealthCssRule = sheet.cssRules[1];
}
function clearAmbienceCacheForFloor(floorId) {
  if (!floorId) return;
  for (const key of randomAmbienceCache.keys()) {
    if (key.startsWith(`${floorId}_`)) randomAmbienceCache.delete(key);
  }
  for (const key of randomSfxCache.keys()) {
    if (key.startsWith(`${floorId}_`)) randomSfxCache.delete(key);
  }
}
function mapTimelineToDom(floorId, timeline) {
  const mesNode = document.querySelector(`.mes[mesid="${floorId}"]`);
  if (!mesNode) return;
  const mesText = mesNode.querySelector(".mes_text");
  if (!mesText) return;
  const walker = document.createTreeWalker(
    mesText,
    NodeFilter.SHOW_ALL,
    null,
    false
  );
  const domSequence = [];
  let currentNode;
  let skipParent = null;
  while (currentNode = walker.nextNode()) {
    if (skipParent) {
      if (skipParent.contains(currentNode)) continue;
      else skipParent = null;
    }
    if (currentNode.nodeType === 1) {
      if (currentNode.matches?.('[data-siren-speak="1"]')) {
        domSequence.push({ type: "tts", el: currentNode });
        skipParent = currentNode;
      } else if (currentNode.matches?.(
        '.siren-music-card, [data-siren-music-card="1"], .siren-ambience-card, [data-siren-ambience="1"]'
      ) || currentNode.tagName.toLowerCase() === "ambience" || currentNode.tagName.toLowerCase() === "sfx") {
        domSequence.push({ type: "ambience_or_sfx", el: currentNode });
        skipParent = currentNode;
      }
    } else if (currentNode.nodeType === 3) {
      const txt = currentNode.textContent;
      if (txt.trim() !== "") {
        if (/<ambience>[\s\S]*?<\/ambience>/i.test(txt) || /<sfx>[\s\S]*?<\/sfx>/i.test(txt)) {
          domSequence.push({ type: "ambience_or_sfx", el: currentNode });
        } else {
          domSequence.push({ type: "text", el: currentNode });
        }
      }
    }
  }
  let domIndex = 0;
  for (const node of timeline) {
    node.domElements = [];
    if (node.type === "ambience" || node.type === "sfx") continue;
    if (node.type === "tts") {
      while (domIndex < domSequence.length) {
        const item = domSequence[domIndex++];
        if (item.type === "tts") {
          const textSpan = item.el.querySelector(".siren-speak-text, .custom-siren-speak-text");
          if (textSpan) node.domElements.push(textSpan);
          break;
        }
      }
    }
    if (node.type === "text") {
      const cleanTargetText = node.text.replace(/[*_~`]/g, "").replace(/\s+/g, "");
      let matchedChars = 0;
      const targetLength = cleanTargetText.length;
      while (domIndex < domSequence.length) {
        if (targetLength > 0 && matchedChars >= targetLength) {
          break;
        }
        const item = domSequence[domIndex];
        if (item.type === "tts") break;
        if (item.type === "ambience_or_sfx") {
          domIndex++;
          continue;
        }
        const textNode = item.el;
        const cleanDomText = textNode.textContent.replace(/\s+/g, "");
        if (!cleanDomText) {
          domIndex++;
          continue;
        }
        if (cleanTargetText.includes(cleanDomText)) {
          matchedChars += cleanDomText.length;
          if (textNode.parentNode.classList.contains("siren-karaoke-target")) {
            textNode.parentNode.className = "siren-karaoke-target";
            node.domElements.push(textNode.parentNode);
          } else {
            const fragment = document.createDocumentFragment();
            const chars = isTauriIOS() ? [textNode.textContent] : Array.from(textNode.textContent);
            for (const char of chars) {
              if (/^\s+$/.test(char)) {
                fragment.appendChild(document.createTextNode(char));
              } else {
                const span = document.createElement("span");
                span.className = "siren-karaoke-target";
                span.textContent = char;
                fragment.appendChild(span);
                node.domElements.push(span);
              }
            }
            textNode.parentNode.replaceChild(fragment, textNode);
          }
        }
        domIndex++;
      }
    }
  }
}
function startKaraokeAnimation(node, durationMs, audioObj = null, expectedFloorId = null, onReady = null) {
  return new Promise((resolve) => {
    if (!node || !node.domElements || node.domElements.length === 0) {
      if (onReady) onReady();
      return resolve();
    }
    if (stealthCssRule) {
      stealthCssRule.style.setProperty("--siren-cursor", "0");
    }
    let totalChars = 0;
    node.domElements.forEach((el) => {
      el.classList.add("siren-karaoke-target", "siren-karaoke-playing");
      const len = el.textContent.length;
      el.style.setProperty("--c-off", totalChars);
      el.style.setProperty("--c-len", len);
      totalChars += len;
    });
    if (totalChars === 0) totalChars = 1;
    initStealthKaraokeCss();
    if (onReady) onReady();
    let start = null;
    let lastNow = null;
    let lastWrittenCursor = -1;
    let lastPaint = -Infinity;
    function step(now) {
      if (!activeSceneState.isPlaying || expectedFloorId && activeSceneState.floorId !== expectedFloorId) {
        return resolve();
      }
      if (isTauriIOS() && now - lastPaint < 33) {
        activeKaraokeRaf = requestAnimationFrame(step);
        return;
      }
      lastPaint = now;
      const isDetached = !node.domElements || node.domElements.length === 0 || !document.body.contains(node.domElements[0]);
      if (isDetached) {
        if (!start) {
          start = now;
          lastNow = now;
        }
        lastNow = now;
        activeKaraokeRaf = requestAnimationFrame(step);
        return;
      }
      if (!start) {
        start = now;
        lastNow = now;
      }
      if (activeSceneState.isPaused) {
        start += now - lastNow || 0;
        lastNow = now;
        activeKaraokeRaf = requestAnimationFrame(step);
        return;
      }
      let globalProgress = 0;
      let elapsed = now - start;
      if (audioObj) {
        if (!isNaN(audioObj.duration) && audioObj.duration > 0) {
          let actualTime = audioObj.currentTime;
          if (actualTime === 0) {
            start = now;
            globalProgress = 0;
          } else {
            let expectedTime = (now - start) / 1e3;
            let drift = expectedTime - actualTime;
            if (Math.abs(drift) > 0.05) {
              start += drift * 100;
              expectedTime = (now - start) / 1e3;
            }
            globalProgress = Math.min(expectedTime / audioObj.duration, 1);
          }
        } else {
          globalProgress = 0;
        }
      } else {
        globalProgress = Math.min(elapsed / durationMs, 1);
      }
      lastNow = now;
      const currentScannedChars = globalProgress * totalChars;
      if (stealthCssRule && Math.abs(currentScannedChars - lastWrittenCursor) > 0.01) {
        stealthCssRule.style.setProperty("--siren-cursor", currentScannedChars);
        lastWrittenCursor = currentScannedChars;
      }
      if (globalProgress >= 1 || audioObj && audioObj.ended) {
        if (node.domElements) {
          node.domElements.forEach((el) => {
            el.classList.remove(
              "siren-karaoke-playing",
              "siren-karaoke-paused-playing"
            );
            el.classList.add("siren-karaoke-target", "siren-karaoke-done");
            el.style.removeProperty("--c-off");
            el.style.removeProperty("--c-len");
          });
        }
        resolve();
      } else {
        activeKaraokeRaf = requestAnimationFrame(step);
      }
    }
    activeKaraokeRaf = requestAnimationFrame(step);
  });
}
async function handleGlobalSceneClick(e) {
  const path = typeof e.composedPath === "function" ? e.composedPath() : [];
  let playBtn = null;
  let regenBtn = null;
  for (const node of path) {
    if (node instanceof Element) {
      if (node.matches?.(".siren-scene-play-btn")) playBtn = node;
      if (node.matches?.(".siren-scene-regen-btn")) regenBtn = node;
    }
  }
  if (!playBtn && !regenBtn && e.target instanceof Element) {
    playBtn = e.target.closest(".siren-scene-play-btn");
    regenBtn = e.target.closest(".siren-scene-regen-btn");
  }
  if (regenBtn) {
    e.preventDefault();
    e.stopPropagation();
    const mesNode = regenBtn.closest(".mes");
    if (mesNode) await handleSceneRegenClick(regenBtn, mesNode);
    return;
  }
  if (playBtn) {
    e.preventDefault();
    e.stopPropagation();
    const mesNode = playBtn.closest(".mes");
    if (mesNode) await handleSceneButtonClick(playBtn, mesNode);
    return;
  }
}
async function injectScenePlayButtons() {
  if (!isAmbienceEventBound) {
    document.addEventListener("click", handleGlobalSceneClick, true);
    isAmbienceEventBound = true;
  }
  const messageBlocks = document.querySelectorAll(".mes");
  const context = SillyTavern.getContext();
  const chatId = context?.chatId;
  const injectPromises = Array.from(messageBlocks).map(async (mes) => {
    const mesButtons = mes.querySelector(".mes_buttons");
    if (!mesButtons || mesButtons.querySelector(".siren-scene-btn-group"))
      return;
    const floorId = mes.getAttribute("mesid");
    if (!floorId) return;
    let finalState = "initial";
    let showRegen = false;
    let parsedTimeline = [];
    try {
      parsedTimeline = parseMessageTimeline(floorId);
      const hasAction = parsedTimeline.some(
        (n) => ["ambience", "tts", "sfx"].includes(n.type)
      );
      if (!hasAction) {
        return;
      }
      const ttsNodes = parsedTimeline.filter((n) => n.type === "tts");
      if (ttsNodes.length === 0) {
        finalState = "ready";
        showRegen = true;
      } else if (chatId) {
        const { findExactTtsRecord: findExactTtsRecord2 } = await Promise.resolve().then(() => (init_db(), db_exports));
        const checks = await Promise.all(
          ttsNodes.map(async (node) => {
            return hasExactTtsRecord(
              chatId,
              floorId,
              node.speakObj.char,
              node.speakObj.text,
              node.speakObj.mood,
              // 👈 新增
              node.speakObj.detail
              // 👈 新增
            );
          })
        );
        if (checks.length > 0 && checks.every((exists) => exists === true)) {
          finalState = "ready";
          showRegen = true;
        }
      }
    } catch (err) {
      console.warn(`[Siren Voice] \u9884\u626B\u63CF\u697C\u5C42 ${floorId} \u5931\u8D25:`, err);
    }
    if (!document.body.contains(mesButtons) || mesButtons.querySelector(".siren-scene-btn-group"))
      return;
    const btnGroup = document.createElement("div");
    btnGroup.className = "siren-scene-btn-group";
    btnGroup.style.cssText = "display: flex; align-items: center; gap: 4px; margin-right: 8px; padding-right: 8px; border-right: 1px solid rgba(255, 255, 255, 0.1);";
    const playBtn = document.createElement("div");
    playBtn.className = "mes_button siren-scene-play-btn interactable";
    playBtn.title = "\u5E7B\u5883\u6C1B\u56F4 (\u8BF7\u6C42\u5E76\u64AD\u653E)";
    playBtn.dataset.signature = generateSignatureFromTimeline(parsedTimeline);
    if (finalState === "ready") {
      playBtn.dataset.state = "ready";
      playBtn.innerHTML = `<i class="fa-solid fa-play" style="color: #10b981; filter: drop-shadow(0 0 5px #10b981);"></i>`;
    } else {
      playBtn.dataset.state = "initial";
      playBtn.innerHTML = `<i class="fa-solid fa-clapperboard" style="color: #3b82f6;"></i>`;
    }
    const regenBtn = document.createElement("div");
    regenBtn.className = "mes_button siren-scene-regen-btn interactable";
    regenBtn.title = "\u91CD\u65B0\u8BF7\u6C42\u8BE5\u5C42\u8BED\u97F3";
    regenBtn.innerHTML = `<i class="fa-solid fa-rotate-right" style="color: #a855f7;"></i>`;
    regenBtn.style.display = showRegen ? "" : "none";
    btnGroup.appendChild(playBtn);
    btnGroup.appendChild(regenBtn);
    mesButtons.prepend(btnGroup);
  });
  await Promise.all(injectPromises);
  scanAndRefreshAllScenes();
}
async function scanAndRefreshAllScenes() {
  const context = SillyTavern.getContext();
  const chatId = context?.chatId;
  if (!chatId) return;
  const playBtns = document.querySelectorAll(".siren-scene-play-btn");
  if (!playBtns.length) return;
  await new Promise((r) => setTimeout(r, 800));
  playBtns.forEach(async (playBtn) => {
    if (playBtn.dataset.state !== "initial") return;
    const mesNode = playBtn.closest(".mes");
    if (!mesNode) return;
    const floorId = mesNode.getAttribute("mesid");
    if (!floorId) return;
    const regenBtn = mesNode.querySelector(".siren-scene-regen-btn");
    try {
      const timeline = parseMessageTimeline(floorId);
      const hasAction = timeline.some(
        (n) => ["ambience", "tts", "sfx"].includes(n.type)
      );
      if (!hasAction) return;
      const ttsNodes = timeline.filter((n) => n.type === "tts");
      if (ttsNodes.length === 0) {
        playBtn.dataset.state = "ready";
        playBtn.innerHTML = `<i class="fa-solid fa-play" style="color: #10b981; filter: drop-shadow(0 0 5px #10b981);"></i>`;
        if (regenBtn) regenBtn.style.display = "";
        return;
      }
      const checks = await Promise.all(
        ttsNodes.map(async (node) => {
          return hasExactTtsRecord(
            chatId,
            floorId,
            node.speakObj.char,
            node.speakObj.text,
            node.speakObj.mood,
            // 👈 补齐参数
            node.speakObj.detail
            // 👈 补齐参数
          );
        })
      );
      if (checks.length > 0 && checks.every((exists) => exists === true)) {
        playBtn.dataset.state = "ready";
        playBtn.innerHTML = `<i class="fa-solid fa-play" style="color: #10b981; filter: drop-shadow(0 0 5px #10b981);"></i>`;
        if (regenBtn) regenBtn.style.display = "";
        console.log(
          `[Siren Voice] \u{1F50D} \u626B\u5E93\u6FC0\u6D3B\uFF1A\u697C\u5C42 ${floorId} \u7684\u73AF\u5883\u97F3\u4E0E\u8BED\u97F3\u5DF2\u5C31\u7EEA\u3002`
        );
      }
    } catch (err) {
      console.warn(`[Siren Voice] \u626B\u5E93\u68C0\u67E5\u5931\u8D25 (Floor: ${floorId})`, err);
    }
  });
}
async function handleSceneRegenClick(regenBtn, mesNode) {
  const playBtn = regenBtn.parentElement.querySelector(".siren-scene-play-btn");
  if (!playBtn) return;
  const floorId = mesNode.getAttribute("mesid");
  clearAmbienceCacheForFloor(floorId);
  if (activeSceneState.floorId === floorId) {
    stopScenePlayback(playBtn);
  }
  regenBtn.style.display = "none";
  playBtn.dataset.state = "initial";
  await handleSceneButtonClick(playBtn, mesNode, true);
}
async function handleSceneButtonClick(btn, mesNode, forceRegen = false) {
  const currentState = btn.dataset.state || "initial";
  const floorId = mesNode.getAttribute("mesid");
  const regenBtn = btn.parentElement.querySelector(".siren-scene-regen-btn");
  if (activeSceneState.floorId && activeSceneState.floorId !== floorId) {
    if (currentState === "initial" || currentState === "ready") {
      console.log(
        `[Siren Voice] \u{1F504} \u5207\u697C\u62E6\u622A: \u5F3A\u884C\u505C\u6B62\u697C\u5C42 ${activeSceneState.floorId}\uFF0C\u51C6\u5907\u64AD\u653E\u697C\u5C42 ${floorId}`
      );
      const oldBtn = document.querySelector(
        `.mes[mesid="${activeSceneState.floorId}"] .siren-scene-play-btn`
      );
      stopScenePlayback(oldBtn, false);
    }
  }
  if (currentState === "initial") {
    btn.dataset.state = "loading";
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin" style="color: #f59e0b;"></i>`;
    try {
      const timeline = parseMessageTimeline(floorId);
      const hasAction = timeline.some(
        (n) => ["ambience", "tts", "sfx"].includes(n.type)
      );
      if (!hasAction) {
        if (window.toastr)
          window.toastr.warning("\u672A\u68C0\u6D4B\u5230\u4EFB\u4F55 Ambience \u6216 \u8BED\u97F3 \u6807\u7B7E\u3002");
        btn.dataset.state = "initial";
        btn.innerHTML = `<i class="fa-solid fa-clapperboard" style="color: #3b82f6;"></i>`;
        return;
      }
      const context = SillyTavern.getContext();
      const settings = context?.extensionSettings?.siren_voice_settings;
      const provider = settings?.tts?.provider || "indextts";
      const ttsSettings = settings?.tts?.[provider] || {};
      if (!isTauriIOS()) {
        await preloadAmbienceForTimeline(timeline, floorId);
        await preloadSfxForTimeline(timeline, floorId);
        await preloadTtsForTimeline(timeline, floorId, provider, ttsSettings, forceRegen);
      }
      btn.dataset.sirenForceRegen = forceRegen ? "1" : "0";
      btn.dataset.state = "ready";
      btn.innerHTML = `<i class="fa-solid fa-play" style="color: #10b981; filter: drop-shadow(0 0 5px #10b981);"></i>`;
      if (regenBtn) regenBtn.style.display = "";
      if (window.toastr) window.toastr.success(isTauriIOS() ? "\u64AD\u653E\u5DF2\u5C31\u7EEA\uFF0C\u8BED\u97F3\u5C06\u5728\u64AD\u653E\u65F6\u9010\u53E5\u52A0\u8F7D\u3002" : "\u73AF\u5883\u6C1B\u56F4\u51C6\u5907\u5C31\u7EEA\uFF01");
    } catch (error) {
      console.error("[Siren Voice] \u573A\u666F\u9884\u52A0\u8F7D\u5931\u8D25", error);
      btn.dataset.state = "initial";
      btn.innerHTML = `<i class="fa-solid fa-triangle-exclamation" style="color: #ef4444;" title="\u8BF7\u6C42\u5931\u8D25\uFF0C\u70B9\u51FB\u91CD\u8BD5"></i>`;
    }
  } else if (currentState === "ready") {
    btn.dataset.state = "playing";
    btn.innerHTML = `<i class="fa-solid fa-pause" style="color: #3b82f6;"></i>`;
    const latestTimeline = parseMessageTimeline(floorId);
    const { findExactTtsRecord: findExactTtsRecord2 } = await Promise.resolve().then(() => (init_db(), db_exports));
    const chatId = SillyTavern.getContext().chatId;
    if (!isTauriIOS()) for (const node of latestTimeline) {
      if (node.type === "tts") {
        const record = await findExactTtsRecord2(
          chatId,
          floorId,
          node.speakObj.char,
          node.speakObj.text,
          node.speakObj.mood,
          // 👈 补齐参数
          node.speakObj.detail
          // 👈 补齐参数
        );
        node.blob = record?.audioBlob || null;
        if (!node.blob) {
          const settings = SillyTavern.getContext()?.extensionSettings?.siren_voice_settings;
          const provider = settings?.tts?.provider || "indextts";
          node.blob = await fetchTtsBlobProvider(
            node.speakObj,
            floorId,
            provider,
            settings?.tts?.[provider] || {}
          );
        }
      }
    }
    if (isTauriIOS()) {
      for (const node of latestTimeline) node.forceRegen = btn.dataset.sirenForceRegen === "1";
      delete btn.dataset.sirenForceRegen;
    }
    startScenePlayback(floorId, latestTimeline, btn);
  } else if (currentState === "paused") {
    btn.dataset.state = "playing";
    btn.innerHTML = `<i class="fa-solid fa-pause" style="color: #3b82f6;"></i>`;
    resumeScenePlayback();
  } else if (currentState === "playing") {
    btn.dataset.state = "paused";
    btn.innerHTML = `<i class="fa-solid fa-play" style="color: #10b981;"></i>`;
    pauseScenePlayback();
  }
}
function parseMessageTimeline(floorId) {
  const targetId = Number(floorId);
  let mesArr = typeof getChatMessages === "function" ? getChatMessages(targetId) : window.TavernHelper?.getChatMessages(targetId);
  if (!mesArr || !mesArr.length) return [];
  const rawText = mesArr[0].message;
  const settings = getSirenSettings();
  const startTag = settings.ambience?.start_tag || "<content>";
  const endTag = settings.ambience?.end_tag || "</content>";
  const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const contentRegex = new RegExp(
    `${escape(startTag)}([\\s\\S]*?)${escape(endTag)}`,
    "gi"
  );
  let textToParse = rawText;
  let contentMatches = [];
  let match;
  while ((match = contentRegex.exec(rawText)) !== null) {
    contentMatches.push(match[1]);
  }
  if (contentMatches.length > 0) {
    textToParse = contentMatches.join("\n");
  }
  const timeline = [];
  const combinedRegex = /(<ambience\b[^>]*>[\s\S]*?<\/ambience>|<sfx\b[^>]*>[\s\S]*?<\/sfx>|<(?:speak|inner|phone)\b[^>]*>(?:(?!<(?:speak|inner|phone)\b)[\s\S])*?<\/(?:speak|inner|phone|(?!(?:i|b|u|s|em|strong|span|a|p|br)\b)[a-zA-Z0-9_-]+)>)/gi;
  const parts = textToParse.split(combinedRegex);
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (part === void 0 || part === null) continue;
    const trimmed = part.trim();
    if (trimmed === "") continue;
    if (trimmed.toLowerCase().startsWith("<ambience")) {
      const ambienceMatch = /<ambience\b[^>]*>([\s\S]*?)<\/ambience>/i.exec(
        part
      );
      if (ambienceMatch) {
        timeline.push({
          type: "ambience",
          name: ambienceMatch[1].trim(),
          raw: part
        });
      }
    } else if (trimmed.toLowerCase().startsWith("<sfx")) {
      const sfxMatch = /<sfx\b[^>]*>([\s\S]*?)<\/sfx>/i.exec(part);
      if (sfxMatch) {
        const dirMatch = /\bdir=["']?([^"'>\s]+)["']?/i.exec(part);
        timeline.push({
          type: "sfx",
          dir: dirMatch ? dirMatch[1].toLowerCase() : "center",
          name: sfxMatch[1].trim(),
          raw: part
        });
      }
    } else if (/^<(speak|inner|phone)\b/i.test(trimmed)) {
      const ttsMatch = /<(speak|inner|phone)\b([^>]*)>([\s\S]*?)<\/(?:speak|inner|phone|(?!(?:i|b|u|s|em|strong|span|a|p|br)\b)[a-zA-Z0-9_-]+)>/i.exec(
        part
      );
      if (ttsMatch) {
        const tagType = ttsMatch[1].toLowerCase();
        const rawAttrs = ttsMatch[2];
        const rawText2 = ttsMatch[3];
        const attrs = {};
        const attrRegex = /(\w+)\s*=\s*(?:"|&quot;|')([^"']*)(?:"|&quot;|')/g;
        let matchAttr;
        while ((matchAttr = attrRegex.exec(rawAttrs)) !== null) {
          attrs[matchAttr[1].toLowerCase()] = matchAttr[2];
        }
        const cleanText = rawText2.replace(/\{\{[\s\S]*?\}\}/g, "").trim();
        const speakObj = {
          tag: tagType,
          attrs,
          // 👈 补回原有的 attrs 结构，防止下游逻辑报错
          char: attrs.char || "",
          mood: attrs.mood || "",
          detail: attrs.detail || "",
          dir: attrs.dir || "center",
          text: cleanText,
          raw: part
        };
        timeline.push({
          type: "tts",
          speakObj,
          raw: part,
          blob: null
        });
      }
    } else {
      timeline.push({ type: "text", text: trimmed, raw: part });
    }
  }
  return timeline;
}
async function preloadAmbienceForTimeline(timeline, floorId) {
  const settings = getSirenSettings();
  const ambienceLibs = settings?.ambience?.libraries || {};
  const downloadingUrls = /* @__PURE__ */ new Set();
  for (const node of timeline) {
    if (node.type === "ambience") {
      let targetUrl = null;
      let actualAmbienceName = node.name;
      let candidates = [];
      for (const libKey in ambienceLibs) {
        for (const item of ambienceLibs[libKey]) {
          if (item.name === node.name || item.name.startsWith(node.name + "-")) {
            candidates.push(item);
          }
        }
      }
      const cacheKey = floorId ? `${floorId}_${node.name}` : null;
      if (cacheKey && randomAmbienceCache.has(cacheKey)) {
        const cachedName = randomAmbienceCache.get(cacheKey);
        const found = candidates.find((c) => c.name === cachedName);
        if (found) {
          targetUrl = found.url;
          actualAmbienceName = found.name;
        }
      }
      if (!targetUrl && candidates.length > 0) {
        const picked = candidates[Math.floor(Math.random() * candidates.length)];
        targetUrl = picked.url;
        actualAmbienceName = picked.name;
        if (cacheKey) randomAmbienceCache.set(cacheKey, actualAmbienceName);
      }
      if (!targetUrl) continue;
      if (downloadingUrls.has(targetUrl)) continue;
      downloadingUrls.add(targetUrl);
      try {
        const record = await getAmbienceRecord(targetUrl);
        if (record && record.audioBlob) {
          continue;
        }
        console.log(
          `[Siren Voice] \u{1F4E5} \u5F00\u59CB\u540E\u53F0\u4E0B\u8F7D\u5E76\u7F13\u5B58 Ambience: ${actualAmbienceName}`
        );
        const response = await fetch(targetUrl);
        if (response.ok) {
          const blob = await response.blob();
          await saveAmbienceRecord(targetUrl, blob);
        } else {
          console.warn(
            `[Siren Voice] \u26A0\uFE0F Ambience \u4E0B\u8F7D\u5931\u8D25\uFF0C\u72B6\u6001\u7801: ${response.status}`
          );
        }
      } catch (e) {
        console.error(
          `[Siren Voice] \u274C Ambience \u4E0B\u8F7D\u7F13\u5B58\u5931\u8D25: ${actualAmbienceName}`,
          e
        );
      }
    }
  }
}
async function preloadSfxForTimeline(timeline, floorId) {
  const settings = getSirenSettings();
  const sfxLibs = settings?.ambience?.sfx_libraries || {};
  const downloadingUrls = /* @__PURE__ */ new Set();
  for (const node of timeline) {
    if (node.type === "sfx") {
      let targetUrl = null;
      let candidates = [];
      for (const libKey in sfxLibs) {
        for (const item of sfxLibs[libKey]) {
          if (item.name === node.name || item.name.startsWith(node.name + "-")) {
            candidates.push(item);
          }
        }
      }
      const cacheKey = floorId ? `${floorId}_${node.name}` : null;
      if (cacheKey && randomSfxCache.has(cacheKey)) {
        const cachedName = randomSfxCache.get(cacheKey);
        const found = candidates.find((c) => c.name === cachedName);
        if (found) targetUrl = found.url;
      }
      if (!targetUrl && candidates.length > 0) {
        const picked = candidates[Math.floor(Math.random() * candidates.length)];
        targetUrl = picked.url;
        if (cacheKey) randomSfxCache.set(cacheKey, picked.name);
      }
      if (!targetUrl || downloadingUrls.has(targetUrl)) continue;
      downloadingUrls.add(targetUrl);
      try {
        const record = await getAmbienceRecord(targetUrl);
        if (record && record.audioBlob) continue;
        console.log(`[Siren Voice] \u{1F4E5} \u540E\u53F0\u7F13\u5B58 SFX: ${node.name}`);
        const response = await fetch(targetUrl);
        if (response.ok) {
          const blob = await response.blob();
          await saveAmbienceRecord(targetUrl, blob);
        }
      } catch (e) {
        console.error(`[Siren Voice] \u274C SFX \u7F13\u5B58\u5931\u8D25: ${node.name}`, e);
      }
    }
  }
}
async function startScenePlayback(floorId, timeline, btnNode) {
  const epoch = ++sceneEpoch;
  const chatId = SillyTavern.getContext().chatId;
  activeSceneState.currentStepIndex = 0;
  activeSceneState.isPlaying = true;
  activeSceneState.isPaused = false;
  activeSceneState.floorId = floorId;
  activeSceneState.timeline = timeline;
  mapTimelineToDom(floorId, timeline);
  const mesNode = document.querySelector(`.mes[mesid="${floorId}"]`);
  if (mesNode) mesNode.classList.add("siren-scene-active");
  await new Promise((r) => setTimeout(r, 100));
  for (let i = activeSceneState.currentStepIndex; i < timeline.length; i++) {
    if (epoch !== sceneEpoch || !activeSceneState.isPlaying || activeSceneState.floorId !== floorId) {
      console.log(
        `[Siren Voice] \u{1F6D1} \u697C\u5C42 ${floorId} \u64AD\u653E\u88AB\u6253\u65AD\uFF0C\u5B89\u5168\u9000\u51FA\u5FAA\u73AF\u3002`
      );
      break;
    }
    activeSceneState.currentStepIndex = i;
    const node = timeline[i];
    if (node.type === "ambience") {
      await playSceneAmbience(node.name, floorId, true);
    } else if (node.type === "sfx") {
      playSceneSfxSync(node.name, floorId, node.dir);
    } else if (node.type === "tts" && (node.blob || isTauriIOS())) {
      if (!node.blob) {
        const settings = getSirenSettings();
        const provider = settings.tts?.provider || "indextts";
        node.blob = await fetchTtsBlobProvider(node.speakObj, floorId, provider, settings.tts?.[provider] || {}, node.forceRegen);
        node.forceRegen = false;
      }
      if (epoch !== sceneEpoch || !activeSceneState.isPlaying || SillyTavern.getContext().chatId !== chatId) {
        node.blob = null;
        break;
      }
      if (!node.blob) continue;
      while (activeSceneState.isPaused && epoch === sceneEpoch) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      if (epoch !== sceneEpoch) {
        node.blob = null;
        break;
      }
      if (activeSceneState.activeSfxPool.size > 0) {
        await checkableSleep(500, floorId);
      } else {
        await checkableSleep(50, floorId);
      }
      if (!activeSceneState.isPlaying || activeSceneState.floorId !== floorId)
        break;
      const { audio, promise, startAudio } = playSceneTtsSync(
        node.blob,
        node.speakObj
      );
      startKaraokeAnimation(node, 0, audio, floorId, startAudio);
      await promise;
      node.blob = null;
      if (epoch !== sceneEpoch) break;
      if (activeKaraokeRaf) cancelAnimationFrame(activeKaraokeRaf);
      for (const element of node.domElements || []) {
        element.classList.remove("siren-karaoke-playing");
        element.classList.add("siren-karaoke-done");
      }
      await checkableSleep(50, floorId);
    } else if (node.type === "text") {
      const settings = SillyTavern.getContext()?.extensionSettings?.siren_voice_settings;
      const speed = settings?.ambience?.karaoke_speed || 1;
      const waitTime = Math.max(300, node.text.length * 150 / speed);
      await startKaraokeAnimation(node, waitTime, null, floorId);
    }
  }
  if (epoch === sceneEpoch && !activeSceneState.isPaused && activeSceneState.isPlaying && activeSceneState.floorId === floorId) {
    stopScenePlayback(btnNode, true);
  }
}
async function checkableSleep(ms, expectedFloorId) {
  const step = 50;
  const totalSteps = ms / step;
  for (let i = 0; i < totalSteps; i++) {
    if (!activeSceneState.isPlaying || activeSceneState.floorId !== expectedFloorId)
      return;
    while (activeSceneState.isPaused) {
      if (activeSceneState.floorId !== expectedFloorId) return;
      await new Promise((r) => setTimeout(r, 100));
    }
    await new Promise((r) => setTimeout(r, step));
  }
}
function pauseScenePlayback() {
  activeSceneState.isPaused = true;
  if (activeSceneState.ttsAudio) activeSceneState.ttsAudio.pause();
  if (activeSceneState.ambienceAudio) activeSceneState.ambienceAudio.pause();
  activeSceneState.activeSfxPool.forEach((audio) => audio.pause());
  const activeMes = document.querySelector(
    `.mes[mesid="${activeSceneState.floorId}"]`
  );
  if (activeMes) {
    activeMes.classList.remove("siren-scene-active");
    activeMes.querySelectorAll(".siren-karaoke-playing").forEach((el) => {
      el.classList.remove("siren-karaoke-playing");
      el.classList.add("siren-karaoke-paused-playing");
    });
    activeMes.querySelectorAll(".siren-karaoke-done").forEach((el) => {
      el.classList.remove("siren-karaoke-done");
      el.classList.add("siren-karaoke-paused-done");
    });
  }
}
function resumeScenePlayback() {
  activeSceneState.isPaused = false;
  const activeMes = document.querySelector(
    `.mes[mesid="${activeSceneState.floorId}"]`
  );
  if (activeMes) {
    activeMes.classList.add("siren-scene-active");
    activeMes.querySelectorAll(".siren-karaoke-paused-playing").forEach((el) => {
      el.classList.remove("siren-karaoke-paused-playing");
      el.classList.add("siren-karaoke-playing");
    });
    activeMes.querySelectorAll(".siren-karaoke-paused-done").forEach((el) => {
      el.classList.remove("siren-karaoke-paused-done");
      el.classList.add("siren-karaoke-done");
    });
  }
  if (activeSceneState.ttsAudio && !activeSceneState.ttsAudio.ended) {
    activeSceneState.ttsAudio.play();
  }
  if (activeSceneState.ambienceAudio) {
    activeSceneState.ambienceAudio.play();
  }
  activeSceneState.activeSfxPool.forEach((audio) => {
    if (!audio.ended) audio.play();
  });
}
function stopScenePlayback(btnNode = null, fadeOutAmbience = false) {
  sceneEpoch++;
  cancelPendingTtsRequests();
  for (const node of activeSceneState.timeline) {
    node.blob = null;
    node.domElements = [];
  }
  activeSceneState.timeline = [];
  activeSceneState.isPlaying = false;
  activeSceneState.isPaused = false;
  activeSceneState.currentStepIndex = 0;
  if (activeSceneState.ttsAudio) {
    const audio = activeSceneState.ttsAudio;
    audio._resolve?.();
    releaseAudioElement(audio);
    activeSceneState.ttsAudio = null;
  }
  for (const audio of activeSceneState.activeSfxPool) {
    audio._resolve?.();
    releaseAudioElement(audio);
  }
  activeSceneState.activeSfxPool.clear();
  if (activeSceneState.ambienceAudio) {
    const audio = activeSceneState.ambienceAudio;
    activeSceneState.ambienceAudio = null;
    if (fadeOutAmbience) fadeAudio(audio, 0, 2).then(() => releaseAudioElement(audio));
    else releaseAudioElement(audio);
  }
  if (activeKaraokeRaf) cancelAnimationFrame(activeKaraokeRaf);
  const activeMes = document.querySelector(".siren-scene-active");
  if (activeMes) {
    activeMes.classList.remove("siren-scene-active");
    activeMes.querySelectorAll(
      ".siren-karaoke-playing, .siren-karaoke-done, .siren-karaoke-paused-playing, .siren-karaoke-paused-done, .siren-karaoke-target"
    ).forEach((el) => {
      el.classList.remove(
        "siren-karaoke-playing",
        "siren-karaoke-done",
        "siren-karaoke-paused-playing",
        "siren-karaoke-paused-done"
      );
      el.style.removeProperty("--k-prog");
      el.style.removeProperty("--c-off");
      el.style.removeProperty("--c-len");
    });
  }
  const targetBtn = btnNode || document.querySelector(
    `.siren-scene-play-btn[data-state="playing"], .siren-scene-play-btn[data-state="paused"]`
  );
  if (targetBtn) {
    targetBtn.dataset.state = "ready";
    targetBtn.innerHTML = `<i class="fa-solid fa-play" style="color: #10b981; filter: drop-shadow(0 0 5px #10b981);"></i>`;
  }
  const settings = getSirenSettings();
  const bStyle = settings?.ambience?.card_style;
  const sStyle = settings?.ambience?.sfx_card_style;
  const currentAmbienceIcon = bStyle?.dict?.[bStyle.current]?.icon || "fa-solid fa-music";
  const currentSfxIcon = sStyle?.dict?.[sStyle.current]?.icon || "fa-solid fa-bolt";
  document.querySelectorAll('[data-siren-ambience="1"] i').forEach((el) => {
    if (el.classList.contains("fa-circle-pause") || el.classList.contains("fa-spinner")) {
      el.className = currentAmbienceIcon;
    }
  });
  document.querySelectorAll('[data-siren-sfx="1"] i').forEach((el) => {
    if (el.classList.contains("fa-circle-pause") || el.classList.contains("fa-spinner")) {
      el.className = currentSfxIcon;
    }
  });
}
function playSceneTtsSync(blob, speakObj = null) {
  const audio = reusableSceneTtsAudio ||= new Audio();
  releaseAudioElement(audio);
  audio.src = URL.createObjectURL(blob);
  audio.preload = "auto";
  audio.setAttribute("playsinline", "");
  audio.volume = 1;
  activeSceneState.ttsAudio = audio;
  try {
    routeAudioToMixer(audio, "tts", speakObj?.dir || speakObj?.attrs?.dir || "center", speakObj?.tag || "speak");
  } catch (error) {
    console.warn("[Siren TT] \u573A\u666F\u6DF7\u97F3\u5931\u8D25\uFF0C\u4F7F\u7528\u666E\u901A\u64AD\u653E:", error);
    audio.volume = getRealVolume("tts");
  }
  let settled = false;
  let resolvePlayback;
  const promise = new Promise((resolve) => {
    resolvePlayback = resolve;
  });
  const finish = () => {
    if (settled) return;
    settled = true;
    if (activeSceneState.ttsAudio === audio) activeSceneState.ttsAudio = null;
    releaseAudioElement(audio);
    audio._resolve = null;
    if (activeSceneState.ambienceAudio) fadeAudio(activeSceneState.ambienceAudio, getRealVolume("ambience"), 1);
    for (const sfx of activeSceneState.activeSfxPool) fadeAudio(sfx, 1, 1);
    resolvePlayback();
  };
  audio._resolve = audio.onended = audio.onerror = finish;
  const startAudio = () => {
    if (settled) return;
    audio.play().catch((error) => {
      console.warn("[Siren TT] \u573A\u666F\u8BED\u97F3\u64AD\u653E\u5931\u8D25:", error);
      if (error.name === "NotAllowedError") {
        window.toastr?.info("\u8BF7\u70B9\u4E00\u6B21\u573A\u666F\u64AD\u653E\u952E\uFF0C\u89E3\u9501 iOS \u97F3\u9891\u3002", "Siren Voice");
        stopScenePlayback();
      }
      finish();
    });
    if (activeSceneState.ambienceAudio) fadeAudio(activeSceneState.ambienceAudio, getRealVolume("ambience") * 0.5, 0.5);
    for (const sfx of activeSceneState.activeSfxPool) fadeAudio(sfx, 0.5, 0.5);
  };
  return { audio, promise, startAudio };
}
async function playSceneAmbience(ambienceName, floorId = null, forcePlay = false) {
  const requestVersion = sceneEpoch;
  const settings = getSirenSettings();
  const ambienceLibs = settings?.ambience?.libraries || {};
  const fadeSec = settings?.ambience?.fade_duration ?? 2;
  let targetUrl = null;
  let actualAmbienceName = ambienceName;
  let candidates = [];
  for (const libKey in ambienceLibs) {
    for (const item of ambienceLibs[libKey]) {
      if (item.name === ambienceName || item.name.startsWith(ambienceName + "-")) {
        candidates.push(item);
      }
    }
  }
  const cacheKey = floorId ? `${floorId}_${ambienceName}` : null;
  if (cacheKey && randomAmbienceCache.has(cacheKey)) {
    const cachedName = randomAmbienceCache.get(cacheKey);
    const found = candidates.find((c) => c.name === cachedName);
    if (found) {
      targetUrl = found.url;
      actualAmbienceName = found.name;
    }
  }
  if (!targetUrl && candidates.length > 0) {
    const picked = candidates[Math.floor(Math.random() * candidates.length)];
    targetUrl = picked.url;
    actualAmbienceName = picked.name;
    if (cacheKey) {
      randomAmbienceCache.set(cacheKey, actualAmbienceName);
    }
  }
  if (!targetUrl) {
    console.warn(`[Siren Voice] \u26A0\uFE0F Ambience \u672A\u627E\u5230\u5339\u914D\u7684 URL: ${ambienceName}`);
    if (window.toastr) window.toastr.warning(`\u672A\u627E\u5230\u80CC\u666F\u97F3: ${ambienceName}`);
    return "not_found";
  }
  if (activeSceneState.ambienceAudio && activeSceneState.ambienceName === actualAmbienceName) {
    if (activeSceneState.ambienceAudio.paused) {
      await activeSceneState.ambienceAudio.play();
      return "playing";
    } else {
      if (forcePlay) return "playing";
      activeSceneState.ambienceAudio.pause();
      return "paused";
    }
  }
  console.log(
    `[Siren Voice] \u{1F3B5} \u5207\u5165 Ambience: ${actualAmbienceName} -> ${targetUrl}`
  );
  const oldAmbience = activeSceneState.ambienceAudio;
  if (oldAmbience && activeSceneState.ambienceName !== actualAmbienceName) {
    await fadeAudio(oldAmbience, 0, fadeSec);
    releaseAudioElement(oldAmbience);
    if (floorId) {
      await checkableSleep(500, floorId);
      if (!activeSceneState.isPlaying || activeSceneState.floorId !== floorId)
        return "interrupted";
    } else {
      await new Promise((r) => setTimeout(r, 500));
    }
  }
  let finalSrc = targetUrl;
  const record = await getAmbienceRecord(targetUrl);
  if (record && record.audioBlob) {
    finalSrc = URL.createObjectURL(record.audioBlob);
    console.log(`[Siren Voice] \u26A1 \u547D\u4E2D\u672C\u5730 Ambience \u7F13\u5B58\uFF01`);
  } else {
    console.log(
      `[Siren Voice] \u{1F4E5} Ambience \u7F13\u5B58\u672A\u547D\u4E2D\uFF0C\u5F00\u59CB\u515C\u5E95\u4E0B\u8F7D: ${actualAmbienceName}`
    );
    try {
      const response = await fetch(targetUrl);
      if (response.ok) {
        const blob = await response.blob();
        await saveAmbienceRecord(targetUrl, blob);
        finalSrc = URL.createObjectURL(blob);
        console.log(`[Siren Voice] \u2705 \u515C\u5E95\u4E0B\u8F7D\u5B8C\u6210\u5E76\u7F13\u5B58\u5165\u5E93\uFF01`);
      } else {
        console.warn(
          `[Siren Voice] \u26A0\uFE0F Ambience \u4E0B\u8F7D\u5931\u8D25 (HTTP ${response.status})`
        );
        if (window.toastr) window.toastr.error("\u80CC\u666F\u97F3\u52A0\u8F7D\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u94FE\u63A5");
        return "error";
      }
    } catch (e) {
      console.error(`[Siren Voice] \u274C Ambience \u4E0B\u8F7D\u62A5\u9519:`, e);
      if (window.toastr) window.toastr.error("\u80CC\u666F\u97F3\u7F51\u7EDC\u8BF7\u6C42\u5931\u8D25");
      return "error";
    }
  }
  if (requestVersion !== sceneEpoch) {
    if (finalSrc.startsWith("blob:")) URL.revokeObjectURL(finalSrc);
    return "interrupted";
  }
  const newAmbience = new Audio(finalSrc);
  newAmbience.loop = true;
  newAmbience.volume = 0;
  activeSceneState.ambienceAudio = newAmbience;
  activeSceneState.ambienceName = actualAmbienceName;
  try {
    await newAmbience.play();
    await fadeAudio(newAmbience, getRealVolume("ambience"), fadeSec);
    return "playing";
  } catch (e) {
    console.error("[Siren Voice] \u274C Ambience \u64AD\u653E\u5931\u8D25", e);
    releaseAudioElement(newAmbience);
    if (activeSceneState.ambienceAudio === newAmbience) activeSceneState.ambienceAudio = null;
    return "error";
  }
}
async function playSceneSfx(sfxName, floorId = null, forcePlay = false, dir = "center") {
  const requestVersion = sceneEpoch;
  const settings = getSirenSettings();
  const sfxLibs = settings?.ambience?.sfx_libraries || {};
  let targetUrl = null;
  let actualSfxName = sfxName;
  let candidates = [];
  for (const libKey in sfxLibs) {
    for (const item of sfxLibs[libKey]) {
      if (item.name === sfxName || item.name.startsWith(sfxName + "-")) {
        candidates.push(item);
      }
    }
  }
  const cacheKey = floorId ? `${floorId}_${sfxName}` : null;
  if (cacheKey && randomSfxCache.has(cacheKey)) {
    const cachedName = randomSfxCache.get(cacheKey);
    const found = candidates.find((c) => c.name === cachedName);
    if (found) {
      targetUrl = found.url;
      actualSfxName = found.name;
    }
  }
  if (!targetUrl && candidates.length > 0) {
    const picked = candidates[Math.floor(Math.random() * candidates.length)];
    targetUrl = picked.url;
    actualSfxName = picked.name;
    if (cacheKey) randomSfxCache.set(cacheKey, actualSfxName);
  }
  if (!targetUrl) {
    console.warn(`[Siren Voice] \u26A0\uFE0F SFX \u672A\u627E\u5230\u5339\u914D\u7684 URL: ${sfxName}`);
    if (window.toastr) window.toastr.warning(`\u672A\u627E\u5230\u6548\u679C\u97F3: ${sfxName}`);
    return "not_found";
  }
  let existingSfx = null;
  for (const audio of activeSceneState.activeSfxPool) {
    if (audio._sirenName === actualSfxName) {
      existingSfx = audio;
      break;
    }
  }
  if (existingSfx) {
    if (existingSfx.paused) {
      await existingSfx.play();
      return "playing";
    } else {
      if (forcePlay) {
        existingSfx.currentTime = 0;
        return "playing";
      }
      existingSfx.pause();
      return "paused";
    }
  }
  console.log(
    `[Siren Voice] \u26A1 \u72EC\u7ACB\u89E6\u53D1\u5E76\u884C SFX: ${actualSfxName} -> ${targetUrl}`
  );
  let finalSrc = targetUrl;
  const record = await getAmbienceRecord(targetUrl);
  if (record && record.audioBlob) {
    finalSrc = URL.createObjectURL(record.audioBlob);
  } else {
    try {
      const response = await fetch(targetUrl);
      if (response.ok) {
        const blob = await response.blob();
        await saveAmbienceRecord(targetUrl, blob);
        finalSrc = URL.createObjectURL(blob);
      } else {
        console.warn(`[Siren Voice] \u26A0\uFE0F SFX \u4E0B\u8F7D\u5931\u8D25 (HTTP ${response.status})`);
        if (window.toastr) window.toastr.error("\u6548\u679C\u97F3\u52A0\u8F7D\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u94FE\u63A5");
        return "error";
      }
    } catch (e) {
      console.error(`[Siren Voice] \u274C SFX \u4E0B\u8F7D\u62A5\u9519:`, e);
      if (window.toastr) window.toastr.error("\u6548\u679C\u97F3\u7F51\u7EDC\u8BF7\u6C42\u5931\u8D25");
      return "error";
    }
  }
  if (requestVersion !== sceneEpoch) {
    if (finalSrc.startsWith("blob:")) URL.revokeObjectURL(finalSrc);
    return "interrupted";
  }
  trimSfxPool();
  const newSfx = new Audio(finalSrc);
  newSfx.loop = false;
  newSfx.volume = 1;
  newSfx._sirenName = actualSfxName;
  activeSceneState.activeSfxPool.add(newSfx);
  try {
    initAudioEngine();
    routeAudioToMixer(newSfx, "sfx", dir, "sfx");
  } catch (e) {
    console.warn("[Siren Voice] SFX \u7A7A\u95F4\u8DEF\u7531\u5931\u8D25\uFF0C\u9000\u56DE\u539F\u751F\u63A7\u5236", e);
    newSfx.volume = getRealVolume("sfx");
  }
  try {
    newSfx.onerror = newSfx.onended = () => {
      activeSceneState.activeSfxPool.delete(newSfx);
      releaseAudioElement(newSfx);
    };
    await newSfx.play();
    return "playing";
  } catch (e) {
    console.error("[Siren Voice] \u274C SFX \u64AD\u653E\u5931\u8D25", e);
    activeSceneState.activeSfxPool.delete(newSfx);
    releaseAudioElement(newSfx);
    return "error";
  }
}
function playSceneSfxSync(sfxName, floorId = null, dir = "center") {
  const requestVersion = sceneEpoch;
  return new Promise(async (resolve) => {
    if (!activeSceneState.isPlaying || activeSceneState.floorId !== floorId)
      return resolve();
    const settings = getSirenSettings();
    const sfxLibs = settings?.ambience?.sfx_libraries || {};
    let targetUrl = null;
    let candidates = [];
    for (const libKey in sfxLibs) {
      for (const item of sfxLibs[libKey]) {
        if (item.name === sfxName || item.name.startsWith(sfxName + "-")) {
          candidates.push(item);
        }
      }
    }
    const cacheKey = floorId ? `${floorId}_${sfxName}` : null;
    if (cacheKey && randomSfxCache.has(cacheKey)) {
      const cachedName = randomSfxCache.get(cacheKey);
      const found = candidates.find((c) => c.name === cachedName);
      if (found) targetUrl = found.url;
    }
    if (!targetUrl && candidates.length > 0) {
      const picked = candidates[Math.floor(Math.random() * candidates.length)];
      targetUrl = picked.url;
      if (cacheKey) randomSfxCache.set(cacheKey, picked.name);
    }
    if (!targetUrl) {
      console.warn(`[Siren Voice] \u26A0\uFE0F SFX \u672A\u627E\u5230: ${sfxName}`);
      return resolve();
    }
    let finalSrc = targetUrl;
    const record = await getAmbienceRecord(targetUrl);
    if (record && record.audioBlob) {
      finalSrc = URL.createObjectURL(record.audioBlob);
    } else {
      try {
        const response = await fetch(targetUrl);
        if (response.ok) {
          const blob = await response.blob();
          await saveAmbienceRecord(targetUrl, blob);
          finalSrc = URL.createObjectURL(blob);
        } else {
          console.warn(
            `[Siren Voice] \u26A0\uFE0F SFX \u4E0B\u8F7D\u5931\u8D25 (HTTP ${response.status})`
          );
          return resolve();
        }
      } catch (e) {
        console.warn(`[Siren Voice] \u274C SFX \u4E0B\u8F7D\u62A5\u9519:`, e);
        return resolve();
      }
    }
    if (requestVersion !== sceneEpoch || !activeSceneState.isPlaying) {
      if (finalSrc.startsWith("blob:")) URL.revokeObjectURL(finalSrc);
      return resolve();
    }
    trimSfxPool();
    const audio = new Audio(finalSrc);
    audio.volume = 1;
    audio._sirenName = sfxName;
    activeSceneState.activeSfxPool.add(audio);
    try {
      initAudioEngine();
      routeAudioToMixer(audio, "sfx", dir, "sfx");
    } catch (e) {
      console.warn("[Siren Voice] SFX \u7A7A\u95F4\u8DEF\u7531\u5931\u8D25\uFF0C\u9000\u56DE\u539F\u751F\u63A7\u5236", e);
      audio.volume = getRealVolume("sfx");
    }
    audio._resolve = () => {
      activeSceneState.activeSfxPool.delete(audio);
      releaseAudioElement(audio);
      audio._resolve = null;
      resolve();
    };
    audio.onended = () => {
      activeSceneState.activeSfxPool.delete(audio);
      audio._resolve();
    };
    audio.onerror = () => {
      activeSceneState.activeSfxPool.delete(audio);
      audio._resolve();
    };
    audio.play().catch((e) => {
      console.warn("[Siren Voice] \u26A0\uFE0F SFX \u64AD\u653E\u88AB\u6D4F\u89C8\u5668\u62E6\u622A", e);
      audio._resolve();
    });
  });
}
function trimSfxPool() {
  if (!isTauriIOS()) return;
  while (activeSceneState.activeSfxPool.size >= 4) {
    const audio = activeSceneState.activeSfxPool.values().next().value;
    audio._resolve?.();
    releaseAudioElement(audio);
    activeSceneState.activeSfxPool.delete(audio);
  }
}
function fadeAudio(audioObj, targetVolume, durationSec) {
  return new Promise((resolve) => {
    if (!audioObj || durationSec <= 0) {
      if (audioObj) audioObj.volume = targetVolume;
      return resolve();
    }
    const startVol = audioObj.volume;
    const diff = targetVolume - startVol;
    const steps = 20;
    const stepTime = durationSec * 1e3 / steps;
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      let newVol = startVol + diff * (currentStep / steps);
      if (newVol < 0) newVol = 0;
      if (newVol > 1) newVol = 1;
      try {
        audioObj.volume = newVol;
      } catch (e) {
      }
      if (currentStep >= steps) {
        clearInterval(timer);
        resolve();
      }
    }, stepTime);
  });
}
function getActiveSfxAudio() {
  if (activeSceneState.activeSfxPool.size > 0) {
    return Array.from(activeSceneState.activeSfxPool)[0];
  }
  return null;
}
function generateSignatureFromTimeline(timeline) {
  return timeline.filter((n) => ["ambience", "tts", "sfx"].includes(n.type)).map((n) => {
    if (n.type === "ambience") return `ambience:${n.name}`;
    if (n.type === "sfx") return `sfx:${n.name}`;
    if (n.type === "tts") {
      const s = n.speakObj || {};
      const char = (s.char || "").trim();
      const mood = (s.mood || "").trim();
      const detail = (s.detail || "").trim();
      const text = (s.text || "").replace(/\{\{[\s\S]*?\}\}/g, "").trim();
      return `tts:${char}|${mood}|${detail}|${text}`;
    }
    return "";
  }).join("||");
}
async function handleMessageEditRevert(floorId) {
  console.log(
    `[Siren Debug] \u{1F514} \u89E6\u53D1 handleMessageEditRevert\uFF0C\u697C\u5C42: ${floorId}`
  );
  const isActivePlaying = activeSceneState.floorId === String(floorId) && (activeSceneState.isPlaying || activeSceneState.isPaused);
  if (isActivePlaying) {
    recoverActiveSceneDom(floorId);
  }
  if (revertDebounceTimers[floorId]) {
    clearTimeout(revertDebounceTimers[floorId]);
  }
  revertDebounceTimers[floorId] = setTimeout(async () => {
    delete revertDebounceTimers[floorId];
    const mesNode = document.querySelector(`.mes[mesid="${floorId}"]`);
    if (!mesNode) return;
    let playBtn = mesNode.querySelector(".siren-scene-play-btn");
    const regenBtn = mesNode.querySelector(".siren-scene-regen-btn");
    if (!playBtn) {
      await injectScenePlayButtons();
      playBtn = mesNode.querySelector(".siren-scene-play-btn");
    }
    const timeline = parseMessageTimeline(floorId);
    const newSignature = generateSignatureFromTimeline(timeline);
    const oldSignature = playBtn?.dataset?.signature || newSignature;
    if (oldSignature !== newSignature) {
      console.log(
        `[Siren Debug] \u{1F4A5} \u7B7E\u540D\u53D1\u751F\u4E0D\u4E00\u81F4\uFF01
\u65E7: ${oldSignature}
\u65B0: ${newSignature}`
      );
    } else {
      console.log(`[Siren Debug] \u{1F50D} \u7B7E\u540D\u4E00\u81F4\uFF0C\u5C5E\u4E8E\u65E0\u5BB3\u91CD\u7ED8\u3002`);
    }
    if (oldSignature && newSignature !== oldSignature) {
      console.log(`[Siren Debug] \u{1F6D1} \u6267\u884C stopScenePlayback\uFF01`);
      console.log(
        `[Siren Voice] \u{1F504} \u68C0\u6D4B\u5230\u697C\u5C42 ${floorId} \u6838\u5FC3\u5185\u5BB9\u53D8\u66F4\uFF0C\u5F3A\u884C\u505C\u6B62\u64AD\u653E\u3002`
      );
      if (activeSceneState.floorId === String(floorId) && activeSceneState.isPlaying) {
        stopScenePlayback(playBtn);
      }
      if (playBtn) {
        playBtn.dataset.state = "initial";
        playBtn.dataset.signature = newSignature;
        playBtn.innerHTML = `<i class="fa-solid fa-clapperboard" style="color: #3b82f6;"></i>`;
      }
      if (regenBtn) regenBtn.style.display = "none";
    } else {
      const isActivePlaying2 = activeSceneState.floorId === String(floorId) && (activeSceneState.isPlaying || activeSceneState.isPaused);
      if (isActivePlaying2) {
        if (playBtn) {
          playBtn.dataset.state = activeSceneState.isPaused ? "paused" : "playing";
          playBtn.innerHTML = activeSceneState.isPaused ? `<i class="fa-solid fa-play" style="color: #10b981;"></i>` : `<i class="fa-solid fa-pause" style="color: #3b82f6;"></i>`;
        }
        console.log(
          `[Siren Voice] \u{1FA79} DOM \u98CE\u66B4\u5DF2\u5E73\u606F\uFF0C\u89E6\u53D1\u7CBE\u51C6\u70ED\u91CD\u8F7D(Hot Reload)\uFF0C\u7F1D\u5408\u65AD\u88C2\u52A8\u753B...`
        );
        recoverActiveSceneDom(floorId);
      }
    }
  }, 500);
}
function recoverActiveSceneDom(floorId) {
  const mesNode = document.querySelector(`.mes[mesid="${floorId}"]`);
  if (!mesNode) return;
  mesNode.classList.add("siren-scene-active");
  mapTimelineToDom(floorId, activeSceneState.timeline);
  for (let i = 0; i < activeSceneState.timeline.length; i++) {
    const node = activeSceneState.timeline[i];
    if (!node.domElements) continue;
    if (i < activeSceneState.currentStepIndex) {
      node.domElements.forEach((el) => {
        el.classList.remove(
          "siren-karaoke-playing",
          "siren-karaoke-paused-playing"
        );
        el.classList.add("siren-karaoke-target", "siren-karaoke-done");
      });
    } else if (i === activeSceneState.currentStepIndex) {
      let totalChars = 0;
      node.domElements.forEach((el) => {
        el.classList.remove(
          "siren-karaoke-done",
          "siren-karaoke-paused-playing",
          "siren-karaoke-playing"
        );
        el.classList.add("siren-karaoke-target");
        el.classList.add(
          activeSceneState.isPaused ? "siren-karaoke-paused-playing" : "siren-karaoke-playing"
        );
        const len = el.textContent.length;
        el.style.setProperty("--c-off", totalChars);
        el.style.setProperty("--c-len", len);
        totalChars += len;
      });
    } else {
      node.domElements.forEach((el) => {
        el.classList.remove(
          "siren-karaoke-playing",
          "siren-karaoke-paused-playing",
          "siren-karaoke-done"
        );
        el.classList.add("siren-karaoke-target");
      });
    }
  }
}
async function triggerSceneAutoPlay() {
  const context = SillyTavern.getContext();
  const settings = context?.extensionSettings?.siren_voice_settings;
  if (!settings?.ambience?.enabled || !settings?.ambience?.auto_play) return;
  if (!window.TavernHelper) return;
  const messages = window.TavernHelper.getChatMessages(-1);
  if (!messages || messages.length === 0) return;
  const lastMsg = messages[0];
  if (!lastMsg || lastMsg.role === "user" || lastMsg.is_user) return;
  const floorId = lastMsg.message_id;
  const isComplete = checkReplyIntegrity(
    lastMsg.message,
    settings.ambience.custom_end_tags
  );
  if (!isComplete) {
    console.warn(
      "[Siren Voice] \u26A0\uFE0F \u56DE\u590D\u4E0D\u5B8C\u6574\u6216\u89E6\u53D1\u62A5\u9519\u622A\u65AD\uFF0C\u5DF2\u53D6\u6D88\u573A\u666F\u81EA\u52A8\u64AD\u62A5\u3002"
    );
    return;
  }
  const mesNode = document.querySelector(`.mes[mesid="${floorId}"]`);
  if (!mesNode) return;
  const playBtn = mesNode.querySelector(".siren-scene-play-btn");
  if (!playBtn) {
    console.log(`[Siren Voice] \u697C\u5C42 ${floorId} \u6CA1\u6709\u573A\u63A7\u6309\u94AE\uFF0C\u8DF3\u8FC7\u81EA\u52A8\u64AD\u653E\u3002`);
    return;
  }
  if (activeSceneState.isPlaying && activeSceneState.floorId !== String(floorId)) {
    console.log("[Siren Voice] \u{1F6D1} \u89E6\u53D1\u8DE8\u697C\u5C42\u81EA\u52A8\u6253\u65AD...");
    const oldBtn = document.querySelector(
      `.mes[mesid="${activeSceneState.floorId}"] .siren-scene-play-btn`
    );
    if (oldBtn) stopScenePlayback(oldBtn, false);
  }
  stopCurrentTTS();
  console.log(`[Siren Voice] \u{1F3AC} \u89E6\u53D1\u81EA\u52A8\u573A\u63A7\u6A21\u62DF\u8FDE\u62DB\uFF01(Floor: ${floorId})`);
  if (playBtn.dataset.state === "initial") {
    console.log("[Siren Voice] \u23F3 \u8FDE\u62DB 1/2\uFF1A\u89E6\u53D1\u540E\u53F0\u8BF7\u6C42...");
    await handleSceneButtonClick(playBtn, mesNode);
  }
  if (playBtn.dataset.state === "ready") {
    console.log("[Siren Voice] \u25B6\uFE0F \u8FDE\u62DB 2/2\uFF1A\u8BF7\u6C42\u5C31\u7EEA\uFF0C\u89E6\u53D1\u5B9E\u673A\u64AD\u653E\uFF01");
    await handleSceneButtonClick(playBtn, mesNode);
  }
}
var stealthCssRule, isAmbienceEventBound, activeSceneState, activeKaraokeRaf, sceneEpoch, reusableSceneTtsAudio, LocalStorageCache, randomAmbienceCache, randomSfxCache, revertDebounceTimers;
var init_ambience_logic = __esm({
  "scripts/ambience_logic.js"() {
    init_runtime();
    init_settings();
    init_utils();
    init_tts_logic();
    init_db();
    init_audio_engine();
    stealthCssRule = null;
    isAmbienceEventBound = false;
    activeSceneState = {
      floorId: null,
      isPlaying: false,
      isPaused: false,
      ambienceAudio: null,
      ttsAudio: null,
      activeSfxPool: /* @__PURE__ */ new Set(),
      currentStepIndex: 0,
      timeline: [],
      lastNow: 0
    };
    activeKaraokeRaf = null;
    sceneEpoch = 0;
    reusableSceneTtsAudio = null;
    document.addEventListener("sirenVolumeChanged", (e) => {
      const channel = e.detail.channel;
      if (channel === "ambience" && activeSceneState.ambienceAudio) {
        activeSceneState.ambienceAudio.volume = getRealVolume("ambience");
      }
      if (channel === "sfx" && activeSceneState.activeSfxPool.size > 0) {
        activeSceneState.activeSfxPool.forEach((audio) => {
          audio.volume = getRealVolume("sfx");
        });
      }
      if (channel === "tts" && activeSceneState.ttsAudio) {
        activeSceneState.ttsAudio.volume = getRealVolume("tts");
      }
    });
    LocalStorageCache = class {
      constructor(prefix, maxLimit = 500) {
        this.prefix = prefix;
        this.maxLimit = maxLimit;
      }
      _getFullKey(key) {
        const context = typeof SillyTavern !== "undefined" ? SillyTavern.getContext() : null;
        const chatId = context?.chatId || "default";
        return `${this.prefix}_${chatId}_${key}`;
      }
      get(key) {
        const fullKey = this._getFullKey(key);
        const itemStr = localStorage.getItem(fullKey);
        if (!itemStr) return null;
        try {
          const item = JSON.parse(itemStr);
          item.timestamp = Date.now();
          localStorage.setItem(fullKey, JSON.stringify(item));
          return item.value;
        } catch (e) {
          return itemStr;
        }
      }
      set(key, value) {
        const fullKey = this._getFullKey(key);
        const item = {
          value,
          timestamp: Date.now()
        };
        localStorage.setItem(fullKey, JSON.stringify(item));
        this._enforceLimit();
      }
      has(key) {
        return localStorage.getItem(this._getFullKey(key)) !== null;
      }
      delete(key) {
        localStorage.removeItem(this._getFullKey(key));
      }
      keys() {
        const context = typeof SillyTavern !== "undefined" ? SillyTavern.getContext() : null;
        const chatId = context?.chatId || "default";
        const searchPrefix = `${this.prefix}_${chatId}_`;
        const keys = [];
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && k.startsWith(searchPrefix)) {
            keys.push(k.replace(searchPrefix, ""));
          }
        }
        return keys;
      }
      // 👇 核心清理引擎
      _enforceLimit() {
        const allKeys = [];
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && k.startsWith(this.prefix + "_")) {
            allKeys.push(k);
          }
        }
        if (allKeys.length > this.maxLimit) {
          const records = allKeys.map((k) => {
            try {
              const item = JSON.parse(localStorage.getItem(k));
              return { key: k, timestamp: item.timestamp || 0 };
            } catch (e) {
              return { key: k, timestamp: 0 };
            }
          });
          records.sort((a, b) => a.timestamp - b.timestamp);
          const deleteCount = records.length - this.maxLimit;
          for (let i = 0; i < deleteCount; i++) {
            localStorage.removeItem(records[i].key);
            console.log(`[Siren Voice] \u{1F9F9} \u81EA\u52A8\u6E05\u7406\u65E7\u7F13\u5B58\u8BB0\u5F55: ${records[i].key}`);
          }
        }
      }
    };
    randomAmbienceCache = new LocalStorageCache("siren_ambience", 500);
    randomSfxCache = new LocalStorageCache("siren_sfx", 500);
    revertDebounceTimers = {};
  }
});

// index.js
init_audio_engine();

// scripts/music.js
init_settings();

// scripts/music_logic.js
init_runtime();
init_audio_engine();

// scripts/music_player.js
init_settings();
var stealthRule = null;
var uiCache = {
  curText: null,
  totText: null,
  prevLyric: null,
  currLyric: null,
  nextLyric: null,
  duration: 0
};
function initFloatingPlayer() {
  if (document.getElementById("siren-music-player")) return;
  if (!document.getElementById("siren-stealth-engine")) {
    const style = document.createElement("style");
    style.id = "siren-stealth-engine";
    document.head.appendChild(style);
    style.sheet.insertRule(
      `#siren-music-player { 
                --progress: 0%; 
                --lyric-progress: 0%;
                --time-cur: "00:00";
                --time-tot: "00:00";
                --lyric-prev: "";
                --lyric-cur: "\u51C6\u5907\u6F5C\u5165\u6DF1\u6D77...";
                --lyric-next: "";
            }`,
      0
    );
    stealthRule = style.sheet.cssRules[0];
    const rules = [
      `.siren-ext-time-current::after { content: var(--time-cur); }`,
      `.siren-ext-time-total::after { content: var(--time-tot); }`,
      `.siren-ext-lyric-prev::after { content: var(--lyric-prev); }`,
      `.siren-ext-lyric-next::after { content: var(--lyric-next); }`,
      // 当前歌词特殊处理：继承你在 style.css 写的渐变色和裁切属性
      `.siren-ext-lyric-current::after { 
                content: var(--lyric-cur); 
                background-image: inherit;
                background-size: inherit;
                background-position: inherit;
                -webkit-background-clip: text;
                background-clip: text;
                -webkit-text-fill-color: transparent;
                color: transparent;
            }`,
      `#siren-music-player.siren-ghost-mode { 
                opacity: 0.25 !important; 
                filter: blur(0.5px); 
            }`,
      // 👇 新增：让进入和退出潜航模式都像潜水一样丝滑 (1.2秒平滑过渡)
      `#siren-music-player {
                transition: border-radius 0.3s ease, height 0.3s ease, opacity 1.2s cubic-bezier(0.25, 0.8, 0.25, 1), filter 1.2s ease, transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
            }`
    ];
    rules.forEach((rule, i) => style.sheet.insertRule(rule, i + 1));
  }
  const settings = getSirenSettings();
  const savedPos = settings?.music?.player_pos || { x: 0, y: 0 };
  const playerHtml = `
        <div id="siren-music-player" class="siren-ext-player-pill" style="display: none; top: 55px; left: calc(100vw - 320px); transform: translate(${savedPos.x}px, ${savedPos.y}px);">
            <div class="siren-ext-player-basic">
                <div class="siren-ext-player-drag-handle" title="\u62D6\u62FD\u79FB\u52A8"><i class="fa-solid fa-grip-vertical"></i></div>
                <div class="siren-ext-player-cover">
                    <i class="fa-solid fa-music" style="color: #06b6d4;"></i>
                </div>
                <div class="siren-ext-player-info">
                    <div class="siren-ext-music-title">\u7B49\u5F85\u5171\u9E23</div>
                    <div class="siren-ext-music-artist">\u585E\u58EC\u4E4B\u58F0</div>
                </div>
                <div class="siren-ext-player-controls">
                    <i class="fa-solid fa-arrow-right-arrow-left siren-ext-ctrl-btn" id="siren-btn-mode-pill" title="\u987A\u5E8F\u64AD\u653E" style="font-size: 0.9em; margin-right: 2px;"></i>
                    
                    <i class="fa-solid fa-backward-step siren-ext-ctrl-btn" id="siren-btn-prev" title="\u4E0A\u4E00\u9996"></i>
                    <i class="fa-solid fa-play siren-ext-ctrl-btn" id="siren-btn-play" title="\u64AD\u653E/\u6682\u505C"></i>
                    <i class="fa-solid fa-forward-step siren-ext-ctrl-btn" id="siren-btn-next" title="\u4E0B\u4E00\u9996"></i>
                    <i class="fa-solid fa-chevron-down siren-ext-ctrl-btn" id="siren-btn-expand" title="\u5C55\u5F00\u6B4C\u8BCD"></i>
                </div>
            </div>
            <div class="siren-ext-player-expanded-panel">
                <div class="siren-ext-progress-container">
                    <span class="siren-ext-time-current"></span>
                    <div id="siren-ext-progress" class="siren-ext-progress-bar">
                        <div class="siren-ext-progress-thumb"></div>
                    </div>
                    <span class="siren-ext-time-total"></span>
                </div>

                <div class="siren-ext-lyrics-wrapper" style="position: relative; width: 100%;">
                    <div id="siren-btn-lyric-toggle" class="siren-ext-lyric-toggle" style="display: none;">\u539F</div>
                    
                    <div class="siren-ext-player-lyrics">
                        <div class="siren-ext-lyric-line siren-ext-lyric-prev"></div>
                        <div class="siren-ext-lyric-line siren-ext-lyric-current"></div>
                        <div class="siren-ext-lyric-line siren-ext-lyric-next"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
  document.body.insertAdjacentHTML("beforeend", playerHtml);
  bindPlayerEvents();
  updatePlayerCustomStyle();
}
function bindPlayerEvents() {
  const player = document.getElementById("siren-music-player");
  const dragHandle = player.querySelector(".siren-ext-player-drag-handle");
  const expandBtn = document.getElementById("siren-btn-expand");
  let ghostTimer = null;
  const GHOST_DELAY = 1e4;
  function wakeUpPlayer() {
    player.classList.remove("siren-ghost-mode");
  }
  function startGhostTimer() {
    clearTimeout(ghostTimer);
    ghostTimer = setTimeout(() => {
      if (!isDragging && !player.classList.contains("expanded")) {
        player.classList.add("siren-ghost-mode");
      }
    }, GHOST_DELAY);
  }
  player.addEventListener("mouseenter", () => {
    wakeUpPlayer();
    clearTimeout(ghostTimer);
  });
  player.addEventListener("mouseleave", startGhostTimer);
  player.addEventListener(
    "touchstart",
    () => {
      wakeUpPlayer();
      startGhostTimer();
    },
    { passive: true }
  );
  startGhostTimer();
  expandBtn.addEventListener("click", () => {
    player.classList.toggle("expanded");
    if (player.classList.contains("expanded")) {
      expandBtn.classList.replace("fa-chevron-down", "fa-chevron-up");
      clearTimeout(ghostTimer);
      wakeUpPlayer();
    } else {
      expandBtn.classList.replace("fa-chevron-up", "fa-chevron-down");
      startGhostTimer();
    }
  });
  const settings = getSirenSettings();
  const savedPos = settings?.music?.player_pos || { x: 0, y: 0 };
  let isDragging = false;
  let xOffset = savedPos.x;
  let yOffset = savedPos.y;
  let currentX = xOffset;
  let currentY = yOffset;
  let initialX;
  let initialY;
  let baseRect = null;
  dragHandle.addEventListener("mousedown", dragStart);
  dragHandle.addEventListener("touchstart", dragStart, { passive: false });
  document.addEventListener("mousemove", drag);
  document.addEventListener("touchmove", drag, { passive: false });
  document.addEventListener("mouseup", dragEnd);
  document.addEventListener("touchend", dragEnd);
  function getClientPos(e) {
    return {
      x: e.clientX ?? (e.touches && e.touches[0].clientX) ?? 0,
      y: e.clientY ?? (e.touches && e.touches[0].clientY) ?? 0
    };
  }
  function dragStart(e) {
    wakeUpPlayer();
    clearTimeout(ghostTimer);
    const pos = getClientPos(e);
    initialX = pos.x - xOffset;
    initialY = pos.y - yOffset;
    if (e.target === dragHandle || dragHandle.contains(e.target)) {
      isDragging = true;
      const rect = player.getBoundingClientRect();
      baseRect = {
        left: rect.left - xOffset,
        top: rect.top - yOffset,
        width: rect.width,
        height: rect.height
      };
    }
  }
  function drag(e) {
    if (isDragging) {
      if (e.type === "touchmove") e.preventDefault();
      const pos = getClientPos(e);
      let nextX = pos.x - initialX;
      let nextY = pos.y - initialY;
      if (baseRect) {
        const minX = -baseRect.left;
        const maxX = window.innerWidth - baseRect.left - baseRect.width;
        const minY = -baseRect.top;
        const maxY = window.innerHeight - baseRect.top - baseRect.height;
        nextX = Math.max(minX, Math.min(nextX, maxX));
        nextY = Math.max(minY, Math.min(nextY, maxY));
      }
      currentX = nextX;
      currentY = nextY;
      xOffset = currentX;
      yOffset = currentY;
      player.style.transform = `translate(${currentX}px, ${currentY}px)`;
      player.style.transition = "none";
    }
  }
  function dragEnd(e) {
    if (!isDragging) return;
    initialX = currentX;
    initialY = currentY;
    isDragging = false;
    player.style.transition = "border-radius 0.3s ease, height 0.3s ease, opacity 1.2s cubic-bezier(0.25, 0.8, 0.25, 1), filter 1.2s ease";
    const mSettings = getSirenSettings().music;
    mSettings.player_pos = { x: currentX, y: currentY };
    saveSirenSettings(true);
    startGhostTimer();
  }
  document.getElementById("siren-btn-play").addEventListener("click", () => {
    wakeUpPlayer();
    startGhostTimer();
    togglePlayPause();
  });
  const prevBtn = document.getElementById("siren-btn-prev");
  if (prevBtn)
    prevBtn.addEventListener("click", () => {
      wakeUpPlayer();
      startGhostTimer();
      playPrev();
    });
  const nextBtn = document.getElementById("siren-btn-next");
  if (nextBtn)
    nextBtn.addEventListener("click", () => {
      wakeUpPlayer();
      startGhostTimer();
      playNext();
    });
  const modeBtnPill = document.getElementById("siren-btn-mode-pill");
  if (modeBtnPill) {
    const modeMap = {
      sequential: {
        icon: "fa-arrow-right-arrow-left",
        title: "\u987A\u5E8F\u64AD\u653E",
        next: "random"
      },
      random: { icon: "fa-shuffle", title: "\u968F\u673A\u64AD\u653E", next: "single" },
      single: { icon: "fa-repeat", title: "\u5355\u66F2\u5FAA\u73AF", next: "sequential" }
    };
    const initialMode = getSirenSettings().music.play_mode || "sequential";
    modeBtnPill.className = `fa-solid ${modeMap[initialMode].icon} siren-ext-ctrl-btn`;
    modeBtnPill.title = modeMap[initialMode].title;
    modeBtnPill.addEventListener("click", function() {
      wakeUpPlayer();
      startGhostTimer();
      const currentMode = getSirenSettings().music.play_mode || "sequential";
      const nextMode = modeMap[currentMode].next;
      const mSettings = getSirenSettings().music;
      mSettings.play_mode = nextMode;
      saveSirenSettings(true);
      this.className = `fa-solid ${modeMap[nextMode].icon} siren-ext-ctrl-btn`;
      this.title = modeMap[nextMode].title;
      const panelIcon = document.getElementById("siren-music-play-mode-icon");
      if (panelIcon) {
        panelIcon.className = `fa-solid ${modeMap[nextMode].icon}`;
        panelIcon.title = modeMap[nextMode].title;
      }
    });
  }
  const toggleBtn = document.getElementById("siren-btn-lyric-toggle");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      wakeUpPlayer();
      startGhostTimer();
      if (onLyricToggleCallback) onLyricToggleCallback();
    });
  }
  function checkAndFixBoundaries() {
    const rect = player.getBoundingClientRect();
    let isOut = false;
    let nextX = xOffset;
    let nextY = yOffset;
    if (rect.left < 0) {
      nextX -= rect.left;
      isOut = true;
    }
    if (rect.right > window.innerWidth) {
      nextX -= rect.right - window.innerWidth;
      isOut = true;
    }
    if (rect.top < 0) {
      nextY -= rect.top;
      isOut = true;
    }
    if (rect.bottom > window.innerHeight) {
      nextY -= rect.bottom - window.innerHeight;
      isOut = true;
    }
    if (isOut) {
      xOffset = nextX;
      yOffset = nextY;
      currentX = nextX;
      currentY = nextY;
      player.style.transform = `translate(${nextX}px, ${nextY}px)`;
      player.style.transition = "transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)";
      const mSettings = getSirenSettings().music;
      if (mSettings) {
        mSettings.player_pos = { x: nextX, y: nextY };
        saveSirenSettings(true);
      }
    }
  }
  setTimeout(checkAndFixBoundaries, 150);
  window.addEventListener("resize", checkAndFixBoundaries);
}
function updatePlayerUI(title, artist, picUrl, isLoading = false) {
  const player = document.getElementById("siren-music-player");
  if (!player) return;
  const titleEl = player.querySelector(".siren-ext-music-title");
  const artistEl = player.querySelector(".siren-ext-music-artist");
  const coverEl = player.querySelector(".siren-ext-player-cover");
  if (titleEl) titleEl.textContent = title;
  if (artistEl) artistEl.textContent = artist;
  if (coverEl) {
    if (isLoading) {
      coverEl.innerHTML = `<i class="fa-solid fa-spinner fa-spin" style="color: #06b6d4;"></i>`;
    } else if (picUrl) {
      coverEl.innerHTML = `<img src="${picUrl}" alt="cover" onerror="this.onerror=null; this.parentElement.innerHTML='<i class=\\'fa-solid fa-music\\' style=\\'color: #06b6d4;\\'></i>';">`;
    } else {
      coverEl.innerHTML = `<i class="fa-solid fa-music" style="color: #06b6d4;"></i>`;
    }
  }
}
function updateLyricUI(current, prev = "", next = "", progress = 0) {
  const player = document.getElementById("siren-music-player");
  if (!player) return;
  const safeText = (t) => `"${(t || "").replace(/"/g, '\\"')}"`;
  if (uiCache.prevLyric !== prev) {
    uiCache.prevLyric = prev;
    if (stealthRule)
      stealthRule.style.setProperty("--lyric-prev", safeText(prev));
  }
  if (uiCache.nextLyric !== next) {
    uiCache.nextLyric = next;
    if (stealthRule)
      stealthRule.style.setProperty("--lyric-next", safeText(next));
  }
  if (uiCache.currLyric !== current) {
    uiCache.currLyric = current;
    if (stealthRule)
      stealthRule.style.setProperty("--lyric-cur", safeText(current));
  }
  if (stealthRule) {
    stealthRule.style.setProperty("--lyric-progress", `${progress}%`);
  }
}
function setPlayButtonState(isPlaying2) {
  const playBtn = document.getElementById("siren-btn-play");
  if (!playBtn) return;
  if (isPlaying2) {
    playBtn.classList.replace("fa-play", "fa-pause");
    playBtn.style.color = "#ef4444";
  } else {
    playBtn.classList.replace("fa-pause", "fa-play");
    playBtn.style.color = "#10b981";
  }
}
function updateProgressUI(currentTime, duration) {
  const player = document.getElementById("siren-music-player");
  if (!player) return;
  const progressEl = document.getElementById("siren-ext-progress");
  const currentEl = player.querySelector(".siren-ext-time-current");
  const totalEl = player.querySelector(".siren-ext-time-total");
  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";
    const m = Math.floor(time / 60).toString().padStart(2, "0");
    const s = Math.floor(time % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };
  const curText = formatTime(currentTime);
  const totText = formatTime(duration);
  if (currentEl && uiCache.curText !== curText) {
    uiCache.curText = curText;
    if (stealthRule)
      stealthRule.style.setProperty("--time-cur", `"${curText}"`);
  }
  if (totalEl && uiCache.totText !== totText) {
    uiCache.totText = totText;
    if (stealthRule)
      stealthRule.style.setProperty("--time-tot", `"${totText}"`);
  }
  if (progressEl && !window.isDraggingProgress) {
    uiCache.duration = duration;
    const percent = duration ? currentTime / duration * 100 : 0;
    if (stealthRule) stealthRule.style.setProperty("--progress", `${percent}%`);
  }
}
function bindProgressDragEvent(onSeekCallback) {
  const progressEl = document.getElementById("siren-ext-progress");
  if (!progressEl) return;
  const calculateTime = (e) => {
    const rect = progressEl.getBoundingClientRect();
    const clientX = e.clientX || e.touches && e.touches[0].clientX;
    let x = clientX - rect.left;
    x = Math.max(0, Math.min(x, rect.width));
    const percent = x / rect.width;
    const duration = uiCache.duration || 0;
    return percent * duration;
  };
  const handlePointerDown = (e) => {
    window.isDraggingProgress = true;
    updateUI(e);
    document.addEventListener("mousemove", handlePointerMove);
    document.addEventListener("mouseup", handlePointerUp);
    document.addEventListener("touchmove", handlePointerMove, {
      passive: false
    });
    document.addEventListener("touchend", handlePointerUp);
  };
  const handlePointerMove = (e) => {
    if (!window.isDraggingProgress) return;
    e.preventDefault();
    updateUI(e);
  };
  const handlePointerUp = (e) => {
    if (!window.isDraggingProgress) return;
    window.isDraggingProgress = false;
    document.removeEventListener("mousemove", handlePointerMove);
    document.removeEventListener("mouseup", handlePointerUp);
    document.removeEventListener("touchmove", handlePointerMove);
    document.removeEventListener("touchend", handlePointerUp);
    const newTime = calculateTime(e);
    if (onSeekCallback) onSeekCallback(newTime);
  };
  const updateUI = (e) => {
    const newTime = calculateTime(e);
    const duration = uiCache.duration || 100;
    const percent = duration ? newTime / duration * 100 : 0;
    if (stealthRule) {
      stealthRule.style.setProperty("--progress", `${percent}%`);
    }
    const m = Math.floor(newTime / 60).toString().padStart(2, "0");
    const s = Math.floor(newTime % 60).toString().padStart(2, "0");
    const curText = `${m}:${s}`;
    if (uiCache.curText !== curText) {
      uiCache.curText = curText;
      if (stealthRule)
        stealthRule.style.setProperty("--time-cur", `"${curText}"`);
    }
  };
  progressEl.addEventListener("mousedown", handlePointerDown);
  progressEl.addEventListener("touchstart", handlePointerDown, {
    passive: false
  });
}
var onLyricToggleCallback = null;
function bindLyricToggleEvent(callback) {
  onLyricToggleCallback = callback;
}
function updateLyricToggleUI(hasTranslation2, currentMode) {
  const toggleBtn = document.getElementById("siren-btn-lyric-toggle");
  if (!toggleBtn) return;
  if (!hasTranslation2) {
    toggleBtn.style.display = "none";
  } else {
    toggleBtn.style.display = "block";
    toggleBtn.textContent = currentMode === "tlyric" ? "\u8BD1" : "\u539F";
    toggleBtn.title = currentMode === "tlyric" ? "\u5207\u6362\u81F3\u539F\u6587" : "\u5207\u6362\u81F3\u8BD1\u6587";
  }
}
function updatePlayerCustomStyle(forceStyles = null) {
  const styles = forceStyles || getSirenSettings().music.styles || {};
  let styleTag = document.getElementById("siren-custom-player-style");
  let cssText = "";
  if (styles.playerDict && styles.playerCurrent) {
    const currentStyle = styles.playerDict[styles.playerCurrent];
    if (currentStyle && currentStyle.code) {
      cssText = currentStyle.code;
    }
  }
  if (cssText) {
    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = "siren-custom-player-style";
      document.head.appendChild(styleTag);
    }
    styleTag.innerHTML = cssText;
  } else {
    if (styleTag) styleTag.remove();
  }
}

// scripts/music_logic.js
init_settings();
init_utils();
var animationFrameId = null;
var currentAudio = null;
var currentPlayRequestId = 0;
var currentLyrics = [];
var originalLyrics = [];
var translatedLyrics = [];
var currentLyricMode = "tlyric";
var hasTranslation = false;
var currentPlaylist = [];
var currentMusicIndex = -1;
var currentPlayingTrack = null;
document.addEventListener("sirenVolumeChanged", (e) => {
  if (e.detail.channel === "music" && currentAudio) {
    currentAudio.volume = getRealVolume("music");
  }
});
async function fetchGDAPI(params) {
  const baseUrl = "https://music-api.gdstudio.xyz/api.php";
  const queryString = new URLSearchParams(params).toString();
  try {
    const response = await fetch(`${baseUrl}?${queryString}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("[Siren Voice API] \u8BF7\u6C42\u5931\u8D25:", error);
    return null;
  }
}
async function searchMusicList(keyword, source = "netease", count = 15, maxRetries = 1) {
  console.log(`[Siren Voice API] \u53D1\u8D77\u5217\u8868\u641C\u7D22: "${keyword}" (\u6E90: ${source})`);
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const data = await fetchGDAPI({
      types: "search",
      source,
      name: keyword,
      count
    });
    let results = data;
    if (data && data.data) results = data.data;
    else if (data && data.result) results = data.result;
    const finalResults = Array.isArray(results) ? results : [];
    if (finalResults.length > 0) {
      if (attempt > 0)
        console.log(
          `[Siren Voice API] \u7B2C ${attempt + 1} \u6B21\u91CD\u8BD5\u6210\u529F\u6253\u635E\u5230\u6570\u636E\uFF01`
        );
      return finalResults;
    }
    if (attempt < maxRetries) {
      console.warn(
        `[Siren Voice API] \u63A5\u53E3\u8FD4\u56DE\u7A7A\u6570\u636E(\u53EF\u80FD\u89E6\u53D1\u9650\u6D41\u6216\u8282\u70B9\u6CE2\u52A8)\uFF0C500ms \u540E\u81EA\u52A8\u91CD\u8BD5...`
      );
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
  console.log(`[Siren Voice API] \u641C\u7D22\u5F7B\u5E95\u65E0\u679C\u539F\u59CB\u6570\u636E:`, []);
  return [];
}
async function searchMusic(keyword, source = "netease") {
  const results = await searchMusicList(keyword, source, 5);
  return results.length > 0 ? results[0] : null;
}
async function getTrackUrl(id, source = "netease") {
  const data = await fetchGDAPI({
    types: "url",
    source,
    id,
    br: 320
  });
  console.log(`[Siren Voice API] \u83B7\u53D6 URL \u8FD4\u56DE (ID:${id}):`, data);
  return data && data.url ? data.url : null;
}
async function getAlbumPic(pic_id, source = "netease") {
  if (!pic_id) return null;
  const data = await fetchGDAPI({
    types: "pic",
    source,
    id: pic_id,
    size: 300
  });
  console.log(`[Siren Voice API] \u83B7\u53D6\u5C01\u9762\u8FD4\u56DE (pic_id:${pic_id}):`, data);
  return data && data.url ? data.url : null;
}
async function getLyric(id, source = "netease") {
  return await fetchGDAPI({ types: "lyric", source, id });
}
function parseLRC(lrcText) {
  const lines = lrcText.split("\n");
  const result = [];
  const timeReg = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/;
  for (let line of lines) {
    const match = timeReg.exec(line);
    if (match) {
      const timeInSeconds = parseInt(match[1]) * 60 + parseInt(match[2]) + parseInt(match[3].length === 2 ? match[3] * 10 : match[3]) / 1e3;
      const text = line.replace(timeReg, "").trim();
      if (text) result.push({ time: timeInSeconds, text });
    }
  }
  return result;
}
async function playTargetMusic(title, artist, source = "netease") {
  if (currentAudio && !currentAudio.ended && currentPlayingTrack) {
    const isTitleMatch = currentPlayingTrack.title === title;
    const isArtistMatch = !artist || currentPlayingTrack.artist && currentPlayingTrack.artist.includes(artist);
    if (isTitleMatch && isArtistMatch) {
      console.log(
        `[Siren Voice] \u{1F3B5} \u667A\u80FD\u914D\u4E50\u62E6\u622A: \u68C0\u6D4B\u5230 [${title}] \u6B63\u5728\u64AD\u653E\uFF0C\u4FDD\u6301\u6F5C\u6D41...`
      );
      return;
    }
  }
  const requestId = ++currentPlayRequestId;
  const keyword = artist ? `${title} ${artist}` : title;
  updatePlayerUI(title, artist || "\u641C\u7D22\u4E2D...", null, true);
  updateLyricUI("\u6B63\u5728\u6253\u635E\u6F5C\u6D41...");
  let trackInfo = await searchMusic(keyword, source);
  if (requestId !== currentPlayRequestId) return;
  if (!trackInfo && artist) trackInfo = await searchMusic(title, source);
  if (requestId !== currentPlayRequestId) return;
  if (!trackInfo) {
    updatePlayerUI("\u672A\u627E\u5230\u6B4C\u66F2", "\u8BF7\u5C1D\u8BD5\u66F4\u6362\u97F3\u4E50\u6E90", null, false);
    updateLyricUI("\u641C\u7D22\u5931\u8D25\uFF0C\u6C89\u5165\u6D77\u5E95...");
    return;
  }
  await playExactMusic(trackInfo, requestId);
}
async function playExactMusic(trackInfo, requestId = null) {
  if (!requestId) {
    requestId = ++currentPlayRequestId;
  } else {
    if (requestId !== currentPlayRequestId) return;
  }
  if (currentAudio && !currentAudio.ended && currentPlayingTrack && currentPlayingTrack.id === trackInfo.id) {
    console.log(
      `[Siren Voice] \u{1F3B5} \u7CBE\u786E\u64AD\u653E\u62E6\u622A: \u68C0\u6D4B\u5230\u76EE\u6807 ID [${trackInfo.id}] \u6B63\u5728\u64AD\u653E\uFF0C\u8DF3\u8FC7\u6253\u65AD\u3002`
    );
    return;
  }
  console.log("[Siren Voice API] \u9501\u5B9A\u64AD\u653E\u76EE\u6807\uFF0C\u51C6\u5907\u62C9\u53D6\u8D44\u6E90:", trackInfo);
  const artistName = Array.isArray(trackInfo.artist) ? trackInfo.artist.join("/") : trackInfo.artist;
  currentPlayingTrack = {
    id: trackInfo.id,
    title: trackInfo.name,
    artist: artistName
  };
  updatePlayerUI(trackInfo.name, artistName, null, true);
  let directPicUrl = trackInfo.pic || trackInfo.cover || trackInfo.pic_url || trackInfo.picUrl;
  const [audioUrl, fetchedPicUrl, lyricData] = await Promise.all([
    getTrackUrl(trackInfo.id, trackInfo.source),
    directPicUrl ? Promise.resolve(null) : getAlbumPic(trackInfo.pic_id, trackInfo.source),
    getLyric(trackInfo.id, trackInfo.source)
  ]);
  if (requestId !== currentPlayRequestId) return;
  if (!audioUrl) {
    updatePlayerUI("\u83B7\u53D6\u94FE\u63A5\u5931\u8D25", "\u7248\u6743\u53D7\u9650\u6216VIP\u4E13\u5C5E", null, false);
    updateLyricUI("\u97F3\u9891\u94FE\u63A5\u83B7\u53D6\u5931\u8D25");
    return;
  }
  hasTranslation = !!(lyricData && lyricData.tlyric);
  if (lyricData && lyricData.lyric) {
    originalLyrics = parseLRC(lyricData.lyric);
    translatedLyrics = hasTranslation ? parseLRC(lyricData.tlyric) : [];
    if (hasTranslation && currentLyricMode === "tlyric") {
      currentLyrics = translatedLyrics;
    } else {
      currentLyrics = originalLyrics;
    }
    updateLyricToggleUI(
      hasTranslation,
      hasTranslation ? currentLyricMode : "lyric"
    );
    updateLyricUI("\u6B4C\u8BCD\u89E3\u6790\u5B8C\u6BD5\uFF0C\u7B49\u5F85\u5171\u9E23...");
  } else {
    originalLyrics = [];
    translatedLyrics = [];
    currentLyrics = [];
    hasTranslation = false;
    updateLyricToggleUI(false, "lyric");
    updateLyricUI("\u7EAF\u97F3\u4E50 / \u65E0\u6B4C\u8BCD\u6570\u636E");
  }
  const finalPicUrl = directPicUrl || fetchedPicUrl;
  executePlay(audioUrl, trackInfo.name, artistName, finalPicUrl);
}
bindLyricToggleEvent(() => {
  if (!hasTranslation) return;
  currentLyricMode = currentLyricMode === "tlyric" ? "lyric" : "tlyric";
  currentLyrics = currentLyricMode === "tlyric" ? translatedLyrics : originalLyrics;
  updateLyricToggleUI(hasTranslation, currentLyricMode);
  updateLyricUI("\u6B4C\u8BCD\u5171\u9E23\u5207\u6362\u4E2D...", "", "", 0);
  const mSettings = getSirenSettings().music;
  mSettings.lyric_mode = currentLyricMode;
  saveSirenSettings(true);
});
function executePlay(url, title, artist, picUrl) {
  if (currentAudio) {
    currentAudio.pause();
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    releaseAudioElement(currentAudio);
  }
  currentAudio = new Audio(url);
  currentAudio.volume = getRealVolume("music");
  let lastRealTime = 0;
  let lastSysTime = 0;
  let smoothTime = 0;
  let diagnosticCounter = 0;
  let lastPaint = 0;
  currentAudio.addEventListener("play", () => {
    setPlayButtonState(true);
    lastRealTime = currentAudio.currentTime;
    lastSysTime = performance.now();
    smoothTime = lastRealTime;
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    animationFrameId = requestAnimationFrame(renderLoop);
  });
  currentAudio.addEventListener("pause", () => {
    setPlayButtonState(false);
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
  });
  currentAudio.addEventListener("loadedmetadata", () => {
    updateProgressUI(0, currentAudio.duration);
  });
  currentAudio.addEventListener("ended", () => {
    setPlayButtonState(false);
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    if (currentPlaylist.length > 0) playNext();
  });
  bindProgressDragEvent((newTime) => {
    if (currentAudio) {
      currentAudio.currentTime = newTime;
      lastRealTime = newTime;
      smoothTime = newTime;
      lastSysTime = performance.now();
    }
  });
  const renderLoop = (sysTime) => {
    if (!currentAudio || currentAudio.paused) return;
    if (isTauriIOS() && sysTime - lastPaint < 33) {
      animationFrameId = requestAnimationFrame(renderLoop);
      return;
    }
    lastPaint = sysTime;
    const realTime = currentAudio.currentTime;
    const deltaMs = sysTime - lastSysTime;
    const deltaSec = deltaMs / 1e3;
    if (realTime !== lastRealTime) {
      smoothTime = realTime;
      lastRealTime = realTime;
      lastSysTime = sysTime;
    } else {
      smoothTime = realTime + (sysTime - lastSysTime) / 1e3;
    }
    let fpsStatus = "\u2705 \u4E1D\u6ED1 (60FPS)";
    if (deltaMs > 35) fpsStatus = `\u26A0\uFE0F \u6389\u5E27 (\u95F4\u9694:${deltaMs.toFixed(1)}ms)`;
    if (deltaMs > 100) fpsStatus = `\u274C \u4E25\u91CD\u5361\u6B7B (\u95F4\u9694:${deltaMs.toFixed(1)}ms)`;
    const currentTime = smoothTime;
    const duration = currentAudio.duration;
    updateProgressUI(currentTime, duration);
    let currentProgress = 0;
    if (currentLyrics.length > 0) {
      let currentIndex = -1;
      for (let i = 0; i < currentLyrics.length; i++) {
        if (currentTime >= currentLyrics[i].time) currentIndex = i;
        else break;
      }
      if (currentIndex !== -1) {
        const currentLine = currentLyrics[currentIndex];
        const prevLine = currentIndex > 0 ? currentLyrics[currentIndex - 1].text : "";
        const nextLineObj = currentIndex < currentLyrics.length - 1 ? currentLyrics[currentIndex + 1] : null;
        const nextLine = nextLineObj ? nextLineObj.text : "";
        if (nextLineObj) {
          const durationOfLine = nextLineObj.time - currentLine.time;
          const elapsed = currentTime - currentLine.time;
          if (durationOfLine > 0.1) {
            currentProgress = elapsed / durationOfLine * 100;
          } else {
            currentProgress = 100;
          }
        } else {
          currentProgress = 100;
        }
        currentProgress = Math.min(100, Math.max(0, currentProgress));
        updateLyricUI(currentLine.text, prevLine, nextLine, currentProgress);
      }
    }
    diagnosticCounter++;
    if (diagnosticCounter >= 15) {
      const playerEl = document.querySelector(".siren-ext-lyric-current");
      const actualCssVar = playerEl ? playerEl.style.getPropertyValue("--lyric-progress") : "\u672A\u627E\u5230";
      diagnosticCounter = 0;
    }
    animationFrameId = requestAnimationFrame(renderLoop);
  };
  currentAudio.play().catch((e) => console.error("[Siren Voice] \u64AD\u653E\u5931\u8D25:", e));
  updatePlayerUI(title, artist, picUrl, false);
}
function togglePlayPause() {
  if (!currentAudio) return;
  if (currentAudio.paused) currentAudio.play();
  else currentAudio.pause();
}
function setPlaylistContext(playlist, targetMusicObj) {
  currentPlaylist = playlist;
  currentMusicIndex = playlist.findIndex((s) => {
    if (s.id && targetMusicObj.id) return s.id === targetMusicObj.id;
    return s.name === targetMusicObj.name && s.artist === targetMusicObj.artist;
  });
  if (currentMusicIndex === -1) currentMusicIndex = 0;
}
async function playNext() {
  if (currentPlaylist.length === 0) return;
  const mode = getSirenSettings().music.play_mode || "sequential";
  if (mode === "random") {
    currentMusicIndex = Math.floor(Math.random() * currentPlaylist.length);
  } else if (mode === "single") {
    if (currentAudio) {
      currentAudio.currentTime = 0;
      currentAudio.play();
      return;
    }
  } else {
    currentMusicIndex = (currentMusicIndex + 1) % currentPlaylist.length;
  }
  const nextMusic = currentPlaylist[currentMusicIndex];
  if (nextMusic.id && !String(nextMusic.id).startsWith("echo_")) {
    await playExactMusic(nextMusic);
  } else {
    const defaultSource = getSirenSettings().music.source || "netease";
    await playTargetMusic(
      nextMusic.name,
      nextMusic.artist,
      nextMusic.source || defaultSource
    );
  }
}
async function playPrev() {
  if (currentPlaylist.length === 0) return;
  const mode = getSirenSettings().music.play_mode || "sequential";
  if (mode === "random") {
    currentMusicIndex = Math.floor(Math.random() * currentPlaylist.length);
  } else if (mode === "single") {
    if (currentAudio) {
      currentAudio.currentTime = 0;
      currentAudio.play();
      return;
    }
  } else {
    currentMusicIndex = (currentMusicIndex - 1 + currentPlaylist.length) % currentPlaylist.length;
  }
  const prevMusic = currentPlaylist[currentMusicIndex];
  if (prevMusic.id && !String(prevMusic.id).startsWith("echo_")) {
    await playExactMusic(prevMusic);
  } else {
    const defaultSource = getSirenSettings().music.source || "netease";
    await playTargetMusic(
      prevMusic.name,
      prevMusic.artist,
      prevMusic.source || defaultSource
    );
  }
}
window.addEventListener("pagehide", () => {
  currentPlayRequestId++;
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  releaseAudioElement(currentAudio);
  currentAudio = null;
});

// scripts/events.js
init_utils();
init_settings();
init_tts_logic();
init_db();
init_ambience_logic();
var INLINE_CARD_SELECTOR = '.siren-music-card, .siren-ext-play-inline-btn, [data-siren-music-card="1"]';
function findInlineCardFromEvent(e) {
  const path = typeof e.composedPath === "function" ? e.composedPath() : [];
  for (const node of path) {
    if (node instanceof Element && node.matches?.(INLINE_CARD_SELECTOR)) {
      return node;
    }
  }
  return e.target instanceof Element ? e.target.closest(INLINE_CARD_SELECTOR) : null;
}
function getMessageIdFromElement(element) {
  if (!element) return null;
  const mes = element.closest(".mes, [mesid], [data-mesid], [data-message-id]");
  if (!mes) return null;
  const rawId = mes.getAttribute("mesid") || mes.getAttribute("data-mesid") || mes.dataset?.mesid || mes.getAttribute("data-message-id") || mes.dataset?.messageId || null;
  if (rawId === null || rawId === void 0 || rawId === "") return null;
  const num = Number(rawId);
  return Number.isNaN(num) ? null : num;
}
function extractMusicInfoFromCard(target) {
  const floor = getMessageIdFromElement(target);
  if (floor !== null && window.TavernHelper) {
    try {
      const vars = window.TavernHelper.getVariables({
        type: "message",
        message_id: floor
      });
      const ambience = vars?.["siren-voice"]?.ambience;
      if (ambience?.music) {
        return {
          title: ambience.music,
          artist: ambience.artist || "",
          floor,
          from: "message_vars"
        };
      }
    } catch (err) {
      console.warn("[Siren Voice] \u8BFB\u53D6\u697C\u5C42\u53D8\u91CF\u5931\u8D25\uFF0C\u56DE\u9000 DOM \u63D0\u53D6:", err);
    }
  }
  let title = target.getAttribute("data-siren-music-title") || target.getAttribute("data-title") || "";
  let artist = target.getAttribute("data-siren-music-artist") || target.getAttribute("data-artist") || "";
  if (!title) {
    const titleEl = target.querySelector(".siren-title") || target.querySelector(".siren-inline-title") || target.querySelector("span:nth-child(2)");
    title = titleEl ? titleEl.textContent.trim() : "";
  }
  if (!artist) {
    const artistEl = target.querySelector(".siren-artist") || target.querySelector(".siren-inline-artist") || target.querySelector("span:nth-child(3)");
    artist = artistEl ? artistEl.textContent.trim() : "";
    artist = artist.replace(/^-/, "").trim();
  }
  return {
    title,
    artist,
    floor,
    from: "dom"
  };
}
window["playSirenMusicInline"] = async function(element, title, artist) {
  console.log(`[Siren Voice] \u{1F9EC} \u5185\u8054\u76F4\u8FDE\u89E6\u53D1\u64AD\u653E: ${title} - ${artist}`);
  const floor = getMessageIdFromElement(element);
  await handleInlineMusicPlay(element, title, artist, floor);
};
var sirenCardObserver = null;
var observerTimeout = null;
// Keep rendered voice text untouched while TT is rebuilding a streaming message.
// A single final cleanup after generation avoids alternating raw/cleaned lengths.
var sirenSpeakStreamActive = false;
async function handleInlineMusicPlay(element, title, artist = "", floor = null) {
  try {
    console.log(
      `[Siren Voice] \u{1F3AF} \u51C6\u5907\u64AD\u653E\u5185\u8054\u6B4C\u66F2: ${title} - ${artist} @floor=${floor}`
    );
    if (!title || title.includes("{{title}}") || title.includes("$1")) {
      console.warn("[Siren Voice] \u26A0\uFE0F \u6807\u9898\u975E\u6CD5\uFF0C\u7EC8\u6B62\u64AD\u653E\u3002", {
        title,
        artist,
        floor
      });
      if (window.toastr) window.toastr.warning("\u672A\u80FD\u63D0\u53D6\u5230\u6B63\u786E\u7684\u6B4C\u66F2\u540D\u3002");
      return;
    }
    const setCardState = (isLoading) => {
      if (!element) return;
      const wrap = element.querySelector(".siren-music-cover-wrap");
      const iconHtml = isLoading ? '<i class="fa-solid fa-spinner fa-spin siren-play-icon"></i>' : '<i class="fa-solid fa-play siren-play-icon"></i>';
      if (wrap) {
        wrap.innerHTML = iconHtml;
      } else {
        const icon = element.querySelector(".siren-play-icon") || element.querySelector("i");
        if (icon) {
          icon.className = isLoading ? "fa-solid fa-spinner fa-spin siren-play-icon" : "fa-solid fa-play siren-play-icon";
        }
      }
    };
    setCardState(true);
    const settings = getSirenSettings();
    const source = settings?.music?.source || "netease";
    if (settings?.music?.mode !== "smart") {
      settings.music.mode = "smart";
      saveSirenSettings(true);
      const modeSelect = document.getElementById("siren-music-mode");
      if (modeSelect) modeSelect.value = "smart";
    }
    const history = getEchoHistory();
    console.log("[Siren Voice] \u{1F30A} \u5F53\u524D Echo History:", history);
    const currentMusic = floor !== null ? history.find((item) => Number(item.floor) === Number(floor)) || {
      name: title,
      artist
    } : { name: title, artist };
    setPlaylistContext(history, currentMusic);
    if (window.toastr) window.toastr.info(`\u58F0\u7EB3\u91CD\u65B0\u9501\u5B9A: ${title}...`);
    console.log(
      `[Siren Voice] \u{1F680} \u53D1\u8D77\u64AD\u653E\u8BF7\u6C42: ${title} - ${artist} via ${source}`
    );
    await playTargetMusic(title, artist, source);
    setCardState(false);
  } catch (error) {
    console.error("[Siren Voice] \u274C handleInlineMusicPlay \u5D29\u6E83:", error);
    if (element) {
      const wrap = element.querySelector(".siren-music-cover-wrap");
      if (wrap)
        wrap.innerHTML = '<i class="fa-solid fa-play siren-play-icon"></i>';
    }
  }
}
function bindInlineSpeakCards(root = document) {
  // TT may replace the very same speech card several times per second.
  // Do not rewrite text during generation: its source HTML is still changing.
  if (sirenSpeakStreamActive) return;
  const cards = root.querySelectorAll('[data-siren-speak="1"]');
  if (!cards.length) return;
  cards.forEach((card) => {
    if (card.dataset.sirenBound === "1") return;
    const textSpan = card.querySelector(
      ".siren-speak-text, .custom-siren-speak-text"
    );
    const rawSpan = card.querySelector(
      ".siren-raw-text, .custom-siren-raw-text"
    );
    if (textSpan && rawSpan) {
      const rawHtml = rawSpan.innerHTML || "";
      let cleanDisplay = rawHtml.replace(/\{\{[\s\S]*?\}\}/g, "").trim();
      cleanDisplay = cleanDisplay.replace(/<\/?(?!br\b)[a-z0-9]+[^>]*>/gi, "");
      cleanDisplay = stripParentheticalAsides(cleanDisplay);
      cleanDisplay = stripWrappingPunctuation(cleanDisplay);
      if (textSpan.innerHTML !== cleanDisplay) {
        textSpan.innerHTML = cleanDisplay;
      }
    }
    card.dataset.sirenBound = "1";
  });
}
function bindInlineMusicCards(root = document) {
  const cards = root.querySelectorAll(INLINE_CARD_SELECTOR);
  if (!cards.length) return;
  cards.forEach((card) => {
    if (card.dataset.sirenBound === "1") return;
    card.dataset.sirenBound = "1";
    if (!card.getAttribute("role")) card.setAttribute("role", "button");
    if (!card.getAttribute("tabindex")) card.setAttribute("tabindex", "0");
    card.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log("[Siren Voice] \u{1FAE7} \u5361\u7247\u76F4\u7ED1\u70B9\u51FB\u547D\u4E2D:", card);
      const musicInfo = extractMusicInfoFromCard(card);
      console.log("[Siren Voice] \u{1F3B5} \u76F4\u7ED1\u63D0\u53D6\u7ED3\u679C:", musicInfo);
      await handleInlineMusicPlay(
        card,
        musicInfo.title,
        musicInfo.artist,
        musicInfo.floor
      );
    });
    card.addEventListener("keydown", async (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      e.stopPropagation();
      console.log("[Siren Voice] \u2328\uFE0F \u952E\u76D8\u89E6\u53D1\u5361\u7247\u64AD\u653E:", card);
      const musicInfo = extractMusicInfoFromCard(card);
      await handleInlineMusicPlay(
        card,
        musicInfo.title,
        musicInfo.artist,
        musicInfo.floor
      );
    });
  });
}
function initCardObserver() {
  if (sirenCardObserver) return;
  const pending = /* @__PURE__ */ new Set();
  const root = document.getElementById("chat") || document.body;
  sirenCardObserver = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      const parent = mutation.target.nodeType === 1 ? mutation.target : mutation.target.parentElement;
      const message = parent?.closest?.(".mes");
      if (message) pending.add(message);
      for (const node of mutation.addedNodes) {
        if (node.nodeType !== 1) continue;
        if (node.matches?.(".mes")) pending.add(node);
        for (const message2 of node.querySelectorAll?.(".mes") || []) pending.add(message2);
      }
    }
    if (!pending.size || observerTimeout) return;
    observerTimeout = setTimeout(() => {
      observerTimeout = null;
      const settings = getSirenSettings();
      const ambience = settings?.ambience?.card_style;
      const sfx = settings?.ambience?.sfx_card_style;
      const ambienceIcon = ambience?.dict?.[ambience.current]?.icon || "fa-solid fa-music";
      const sfxIcon = sfx?.dict?.[sfx.current]?.icon || "fa-solid fa-bolt";
      const messages = [...pending];
      pending.clear();
      for (const message of messages) {
        if (!message.isConnected) continue;
        for (const [selector, className] of [['[data-siren-ambience="1"] i', ambienceIcon], ['[data-siren-sfx="1"] i', sfxIcon]]) {
          for (const icon of message.querySelectorAll(selector)) {
            if (!icon.classList.contains("fa-circle-pause") && !icon.classList.contains("fa-spinner") && icon.className !== className) icon.className = className;
          }
        }
        bindInlineMusicCards(message);
        bindInlineSpeakCards(message);
      }
    }, 100);
  });
  sirenCardObserver.observe(root, { childList: true, subtree: true });
  window.addEventListener("pagehide", () => {
    sirenCardObserver.disconnect();
    clearTimeout(observerTimeout);
    observerTimeout = null;
    pending.clear();
  });
  window.addEventListener("pageshow", () => {
    sirenCardObserver.observe(root, { childList: true, subtree: true });
  });
}
function applyAmbienceAndKaraokeCss() {
  const settings = getSirenSettings();
  const kStyle = settings?.ambience?.karaoke_style;
  const kCss = kStyle?.dict?.[kStyle.current]?.code || "";
  let kStyleTag = document.getElementById("siren-karaoke-style");
  if (!kStyleTag) {
    kStyleTag = document.createElement("style");
    kStyleTag.id = "siren-karaoke-style";
    document.head.appendChild(kStyleTag);
  }
  kStyleTag.textContent = compileSirenCss(kCss);
  const bStyle = settings?.ambience?.card_style;
  const bCss = bStyle?.dict?.[bStyle.current]?.code || "";
  let bStyleTag = document.getElementById("siren-ambience-card-style");
  if (!bStyleTag) {
    bStyleTag = document.createElement("style");
    bStyleTag.id = "siren-ambience-card-style";
    document.head.appendChild(bStyleTag);
  }
  bStyleTag.textContent = compileSirenCss(bCss);
  const sStyle = settings?.ambience?.sfx_card_style;
  const sCss = sStyle?.dict?.[sStyle.current]?.code || "";
  let sStyleTag = document.getElementById("siren-sfx-card-style");
  if (!sStyleTag) {
    sStyleTag = document.createElement("style");
    sStyleTag.id = "siren-sfx-card-style";
    document.head.appendChild(sStyleTag);
  }
  sStyleTag.textContent = compileSirenCss(sCss);
}
function buildAmbienceRegexes(ambienceIcon = "fa-solid fa-music") {
  return [
    {
      id: "siren-voice-scene-ambience",
      script_name: "Siren-Voice-Auto-Scene-AMBIENCE",
      enabled: true,
      run_on_edit: true,
      scope: "global",
      find_regex: "/<ambience>\\s*([\\s\\S]*?)\\s*<\\/ambience>/gi",
      replace_string: `<span class="siren-ambience-card" data-siren-ambience="1" data-ambience-name="$1" tabindex="0">
    <span class="siren-btn-wrap" data-siren-action="play_ambience" title="\u64AD\u653E\u80CC\u666F\u97F3">
        <i class="${ambienceIcon}"></i>
    </span>
    <span class="siren-ambience-text">$1</span>
</span>`.replace(/\n\s+/g, " "),
      source: {
        user_input: true,
        ai_output: true,
        slash_command: true,
        world_info: false
      },
      destination: { display: true, prompt: false },
      min_depth: null,
      max_depth: null
    }
  ];
}
function buildSfxRegexes(sfxIcon = "fa-solid fa-bolt") {
  return [
    {
      id: "siren-voice-scene-sfx",
      script_name: "Siren-Voice-Auto-Scene-SFX",
      enabled: true,
      run_on_edit: true,
      scope: "global",
      // 🌟 升级正则：兼容提取 dir 属性
      find_regex: `/<sfx(?:\\s+dir=["']?([^"'>\\s]+)["']?)?>\\s*([\\s\\S]*?)\\s*<\\/sfx>/gi`,
      replace_string: `<span class="siren-sfx-card" data-siren-sfx="1" data-sfx-name="$2" data-dir="$1" tabindex="0">
    <span class="siren-btn-wrap" data-siren-action="play_sfx" title="\u64AD\u653E\u6548\u679C\u97F3">
        <i class="${sfxIcon}"></i>
    </span>
    <span class="siren-sfx-text">$2</span>
</span>`.replace(/\n\s+/g, " "),
      source: {
        user_input: true,
        ai_output: true,
        slash_command: true,
        world_info: false
      },
      destination: { display: true, prompt: false },
      min_depth: null,
      max_depth: null
    }
  ];
}
var eventsInitialized = false;
function initEvents() {
  if (eventsInitialized) return;
  eventsInitialized = true;
  const context = SillyTavern.getContext();
  const eventSource = context.eventSource;
  const event_types = context.event_types;
  eventSource.on("generation_started", () => {
    sirenSpeakStreamActive = true;
  });
  const finalizeSirenSpeakDisplay = () => {
    sirenSpeakStreamActive = false;
    bindInlineSpeakCards(document);
  };
  // Some TT builds emit stopped on cancellation rather than ended.
  eventSource.on("generation_stopped", finalizeSirenSpeakDisplay);
  const messageEvent = event_types.MESSAGE_RECEIVED || "message_received";
  eventSource.on(messageEvent, async () => await handleNewMessage());
  const messageEditedEvent = event_types.MESSAGE_EDITED || "message_edited";
  const messageUpdatedEvent = event_types.MESSAGE_UPDATED || "message_updated";
  const handleEdit = async (msgId) => {
    if (msgId !== void 0 && msgId !== null) {
      const { handleMessageEditRevert: handleMessageEditRevert2 } = await Promise.resolve().then(() => (init_ambience_logic(), ambience_logic_exports));
      handleMessageEditRevert2(msgId);
      setTimeout(() => {
        bindInlineMusicCards(document);
        bindInlineSpeakCards(document);
      }, 200);
    }
  };
  eventSource.on(messageEditedEvent, handleEdit);
  eventSource.on(messageUpdatedEvent, handleEdit);
  eventSource.on("character_message_rendered", handleEdit);
  const swipeEvent = event_types.MESSAGE_SWIPED || "message_swiped";
  eventSource.on(swipeEvent, async (...args) => {
    let msgId = typeof args[0] === "number" ? args[0] : null;
    if (!msgId && window.TavernHelper) {
      const msgs = window.TavernHelper.getChatMessages(-1);
      if (msgs && msgs.length > 0) msgId = msgs[0].message_id;
    }
    if (msgId) {
      const { clearAmbienceCacheForFloor: clearAmbienceCacheForFloor2 } = await Promise.resolve().then(() => (init_ambience_logic(), ambience_logic_exports));
      clearAmbienceCacheForFloor2(msgId);
    }
    await handleNewMessage();
  });
  eventSource.on("generation_ended", async () => {
    finalizeSirenSpeakDisplay();
    console.log("[Siren Voice] \u{1F3C1} \u68C0\u6D4B\u5230 AI \u751F\u6210\u5B8C\u6BD5\uFF0C\u6B63\u5728\u6253\u635E\u6DF1\u6D77\u6F5C\u6D41...");
    await handleNewMessage();
    await injectScenePlayButtons();
    await triggerSceneAutoPlay();
    setTimeout(() => {
      bindInlineMusicCards(document);
      bindInlineSpeakCards(document);
      scanAndRefreshAllScenes();
    }, 500);
  });
  window.addEventListener("pagehide", () => {
    stopCurrentTTS();
    stopScenePlayback();
    cancelPendingTtsRequests();
  });
  eventSource.on("chat_id_changed", async (...args) => {
    finalizeSirenSpeakDisplay();
    stopCurrentTTS();
    stopScenePlayback();
    cancelPendingTtsRequests();
    const payload = args[0];
    if (payload !== void 0 && payload !== null && payload !== "") {
      console.log("[Siren Voice] \u{1F4D6} \u68C0\u6D4B\u5230\u804A\u5929\u5207\u6362\uFF0C\u51C6\u5907\u5168\u91CF\u540C\u6B65\u4E16\u754C\u4E66...");
      const settings = getSirenSettings();
      if (settings) {
        const isTtsEnabled = settings.tts?.enabled ?? false;
        const ttsProvider = settings.tts?.provider || "indextts";
        const spatialMode = settings.mixer?.spatial_mode ?? 0;
        const isAmbienceEnabled = settings.ambience?.enabled ?? false;
        const isMusicEnabled = settings.music?.enabled ?? false;
        await Promise.all([
          syncTtsWorldbookEntries(ttsProvider, isTtsEnabled),
          syncSpatialWorldbookEntries(spatialMode),
          syncAmbienceWorldbookEntries(isAmbienceEnabled),
          syncMusicWorldbookEntry(isMusicEnabled)
        ]);
        console.log("[Siren Voice] \u2728 \u804A\u5929\u5207\u6362\u4E16\u754C\u4E66\u5168\u91CF\u540C\u6B65\u5B8C\u6210\u3002");
      }
    }
    window.dispatchEvent(new CustomEvent("siren:echo_updated"));
    window.dispatchEvent(new CustomEvent("siren:character_changed"));
    setTimeout(() => {
      bindInlineMusicCards(document);
      bindInlineSpeakCards(document);
      injectScenePlayButtons();
    }, 200);
  });
  eventSource.on("message_received", () => {
    setTimeout(() => injectScenePlayButtons(), 200);
  });
  if (typeof initSecuritySweeper === "function") {
    initSecuritySweeper();
  }
  window.addEventListener("siren:ambience_settings_updated", () => {
    applyAmbienceAndKaraokeCss();
    const settings = getSirenSettings();
    const bStyle = settings?.ambience?.card_style;
    const sStyle = settings?.ambience?.sfx_card_style;
    const currentAmbienceIcon = bStyle?.dict?.[bStyle.current]?.icon || "fa-solid fa-music";
    const currentSfxIcon = sStyle?.dict?.[sStyle.current]?.icon || "fa-solid fa-bolt";
    document.querySelectorAll('[data-siren-ambience="1"] i').forEach((el) => {
      if (!el.classList.contains("fa-circle-pause") && !el.classList.contains("fa-spinner")) {
        el.className = currentAmbienceIcon;
      }
    });
    document.querySelectorAll('[data-siren-sfx="1"] i').forEach((el) => {
      if (!el.classList.contains("fa-circle-pause") && !el.classList.contains("fa-spinner")) {
        el.className = currentSfxIcon;
      }
    });
  });
  window.addEventListener("siren:settings_saved", async () => {
    const settings = getSirenSettings();
    await updateSirenRegex(settings?.music?.styles || {});
    applyMusicBeautifyCss();
    applyAmbienceAndKaraokeCss();
  });
  setTimeout(() => {
    const settings = getSirenSettings();
    updateSirenRegex(settings?.music?.styles || {});
    applyMusicBeautifyCss();
    applyAmbienceAndKaraokeCss();
  }, 1e3);
  console.log("[Siren Voice] \u{1F7E2} \u9E70\u773C\u6355\u83B7\u7EA7\u76D1\u542C\u5668\u5DF2\u5C31\u7EEA\uFF01");
  if (!window.sirenGlobalClickBound) {
    window.sirenGlobalClickBound = true;
    document.addEventListener(
      "click",
      async function(e) {
        const path = typeof e.composedPath === "function" ? e.composedPath() : [];
        const musicTarget = findInlineCardFromEvent(e);
        if (musicTarget) {
          e.preventDefault();
          e.stopPropagation();
          console.log(
            "[Siren Voice] \u{1F985} \u6355\u83B7\u9636\u6BB5\u62E6\u622A\u6210\u529F (\u97F3\u4E50)\uFF01",
            musicTarget
          );
          const musicInfo = extractMusicInfoFromCard(musicTarget);
          await handleInlineMusicPlay(
            musicTarget,
            musicInfo.title,
            musicInfo.artist,
            musicInfo.floor
          );
          return;
        }
        let speakTarget = null;
        for (const node of path) {
          if (node instanceof Element && node.matches?.('[data-siren-speak="1"]')) {
            speakTarget = node;
            break;
          }
        }
        if (!speakTarget && e.target instanceof Element) {
          speakTarget = e.target.closest('[data-siren-speak="1"]');
        }
        if (speakTarget) {
          let action = null;
          for (const node of path) {
            if (node instanceof Element) {
              action = node.getAttribute("data-siren-action");
              if (action) break;
            }
          }
          if (action) {
            e.preventDefault();
            e.stopPropagation();
            console.log(`[Siren Voice] \u{1F985} \u6355\u83B7\u9636\u6BB5\u62E6\u622A\u6210\u529F (\u8BED\u97F3-${action})\uFF01`);
            const rawAttrs = speakTarget.getAttribute("data-raw-attrs") || "";
            let rawText = "";
            const hiddenSpan = speakTarget.querySelector(
              ".siren-raw-text, .custom-siren-raw-text"
            );
            const visibleSpan = speakTarget.querySelector(
              ".siren-speak-text, .custom-siren-speak-text"
            );
            if (hiddenSpan && hiddenSpan.textContent) {
              rawText = hiddenSpan.textContent;
            } else if (visibleSpan && visibleSpan.textContent) {
              rawText = visibleSpan.textContent;
            } else {
              rawText = speakTarget.getAttribute("data-raw-text") || "";
            }
            if (!rawText || !rawText.trim()) {
              console.warn(
                "[Siren Voice] \u26A0\uFE0F \u53D1\u73B0 DOM \u6587\u672C\u88AB ST \u541E\u566C\uFF0C\u542F\u52A8\u6DF1\u6D77\u5E95\u5C42\u6253\u635E\u534F\u8BAE..."
              );
              const floor = getMessageIdFromElement(speakTarget);
              if (floor !== null) {
                let originalMarkdown = "";
                const context2 = SillyTavern.getContext();
                if (context2 && context2.chat && context2.chat[floor]) {
                  originalMarkdown = context2.chat[floor].mes;
                } else if (window.TavernHelper) {
                  const msgs = window.TavernHelper.getChatMessages();
                  const msgObj = msgs && msgs.find((m) => Number(m.message_id) === Number(floor));
                  if (msgObj) originalMarkdown = msgObj.message;
                }
                if (originalMarkdown) {
                  const floorElement = speakTarget.closest(
                    ".mes, [mesid], [data-mesid], [data-message-id]"
                  );
                  let targetIndex = -1;
                  if (floorElement) {
                    const allCards = Array.from(
                      floorElement.querySelectorAll('[data-siren-speak="1"]')
                    );
                    targetIndex = allCards.indexOf(speakTarget);
                  }
                  const regex = /<(speak|inner|phone)\b([^>]*)>((?:(?!<(?:speak|inner|phone)\b)[\s\S])*?)<\/\1>/gi;
                  let match;
                  let currentMatchIndex = 0;
                  while ((match = regex.exec(originalMarkdown)) !== null) {
                    const currentAttrs = (match[2] || "").trim();
                    if (targetIndex !== -1) {
                      if (currentMatchIndex === targetIndex) {
                        rawText = match[3] || "";
                        break;
                      }
                    } else {
                      if (currentAttrs === rawAttrs.trim()) {
                        rawText = match[3] || "";
                        break;
                      }
                    }
                    currentMatchIndex++;
                  }
                  console.log(
                    `[Siren Voice] \u{1F3AF} \u5E95\u5C42\u6253\u635E\u6210\u529F\uFF01\u627E\u5230\u697C\u5C42 ${floor} \u7684\u771F\u5B9E\u6587\u672C:`,
                    rawText
                  );
                }
              }
            }
            rawText = rawText || "";
            console.log("\u3010Siren Voice \u8C03\u8BD5 1\u3011\u6700\u7EC8\u786E\u5B9A\u7684\u539F\u59CB\u6587\u672C:", rawText);
            const attrs = parseRawSpeakAttrs(rawAttrs);
            let baseText = rawText.replace(/\{\{[\s\S]*?\}\}/g, "").trim();
            let cleanText = stripParentheticalAsides(baseText);
            cleanText = stripWrappingPunctuation(cleanText);
            const tagType = speakTarget.getAttribute("data-tag") || "speak";
            console.log(
              "\u3010Siren Voice \u8C03\u8BD5 2\u3011\u7EC4\u88C5\u8FDB speakObj \u7684\u6587\u672C (\u7F13\u5B58\u952E):",
              baseText
            );
            const speakObj = {
              tag: tagType,
              char: attrs.char || "",
              mood: attrs.mood || "",
              detail: attrs.detail || "",
              dir: attrs.dir || "center",
              text: baseText,
              // 👈 核心修复：恢复为未剥离的原始文本，保证能命中 DB 缓存
              cleanText,
              // 附带干净文本保持对象结构与 utils.js 一致
              raw: `<${tagType} ${rawAttrs}>${rawText}</${tagType}>`
            };
            await handleInlineSpeakPlay(speakObj, speakTarget, action);
          }
          return;
        }
        let ambienceTarget = null;
        for (const node of path) {
          if (node instanceof Element && node.matches?.('[data-siren-ambience="1"]')) {
            ambienceTarget = node;
            break;
          }
        }
        if (!ambienceTarget && e.target instanceof Element) {
          ambienceTarget = e.target.closest('[data-siren-ambience="1"]');
        }
        if (ambienceTarget) {
          e.preventDefault();
          e.stopPropagation();
          const ambienceName = ambienceTarget.getAttribute("data-ambience-name");
          const floor = getMessageIdFromElement(ambienceTarget);
          if (ambienceName) {
            console.log(`[Siren Voice] \u{1F3B5} \u5355\u72EC\u70B9\u51FB\u73AF\u5883\u97F3: ${ambienceName}`);
            const icon = ambienceTarget.querySelector("i");
            if (icon) {
              document.querySelectorAll(".siren-ambience-card i").forEach((el) => {
                if (el !== icon) el.className = "fa-solid fa-music";
              });
              icon.className = "fa-solid fa-spinner fa-spin";
            }
            const { playSceneAmbience: playSceneAmbience2 } = await Promise.resolve().then(() => (init_ambience_logic(), ambience_logic_exports));
            const state = await playSceneAmbience2(ambienceName, floor);
            if (icon) {
              if (state === "playing") {
                icon.className = "fa-solid fa-circle-pause";
              } else {
                const bStyle = getSirenSettings()?.ambience?.card_style;
                icon.className = bStyle?.dict?.[bStyle.current]?.icon || "fa-solid fa-music";
              }
            }
          }
          return;
        }
        let sfxTarget = null;
        for (const node of path) {
          if (node instanceof Element && node.matches?.('[data-siren-sfx="1"]')) {
            sfxTarget = node;
            break;
          }
        }
        if (!sfxTarget && e.target instanceof Element) {
          sfxTarget = e.target.closest('[data-siren-sfx="1"]');
        }
        if (sfxTarget) {
          e.preventDefault();
          e.stopPropagation();
          const sfxName = sfxTarget.getAttribute("data-sfx-name");
          const sfxDir = sfxTarget.getAttribute("data-dir") || "center";
          const floor = getMessageIdFromElement(sfxTarget);
          if (sfxName) {
            console.log(`[Siren Voice] \u26A1 \u5355\u72EC\u70B9\u51FB\u6548\u679C\u97F3: ${sfxName}`);
            const icon = sfxTarget.querySelector("i");
            if (icon) {
              document.querySelectorAll(".siren-sfx-card i").forEach((el) => {
                if (el !== icon) el.className = "fa-solid fa-bolt";
              });
              icon.className = "fa-solid fa-spinner fa-spin";
            }
            const { playSceneSfx: playSceneSfx2, getActiveSfxAudio: getActiveSfxAudio2 } = await Promise.resolve().then(() => (init_ambience_logic(), ambience_logic_exports));
            if (typeof playSceneSfx2 === "function") {
              const state = await playSceneSfx2(sfxName, floor, false, sfxDir);
              if (icon) {
                if (state === "playing") {
                  icon.className = "fa-solid fa-circle-pause";
                  const currentAudio2 = getActiveSfxAudio2();
                  if (currentAudio2) {
                    const resetIcon = () => {
                      const sStyle = getSirenSettings()?.ambience?.sfx_card_style;
                      icon.className = sStyle?.dict?.[sStyle.current]?.icon || "fa-solid fa-bolt";
                    };
                    currentAudio2.addEventListener("ended", resetIcon, {
                      once: true
                    });
                    currentAudio2.addEventListener("pause", resetIcon, {
                      once: true
                    });
                  }
                } else {
                  const sStyle = getSirenSettings()?.ambience?.sfx_card_style;
                  icon.className = sStyle?.dict?.[sStyle.current]?.icon || "fa-solid fa-bolt";
                }
              }
            } else {
              console.warn(
                "[Siren Voice] \u5C1A\u672A\u5728 ambience_logic.js \u4E2D\u5B9E\u73B0 playSceneSfx \u65B9\u6CD5\uFF01"
              );
              if (icon) icon.className = "fa-solid fa-bolt";
            }
          }
          return;
        }
      },
      true
      // <- true 代表捕获阶段，永远比 ST 原生逻辑先执行
    );
  }
  bindInlineMusicCards(document);
  bindInlineSpeakCards(document);
  initCardObserver();
}
async function handleNewMessage() {
  if (!window.TavernHelper) return;
  const messages = window.TavernHelper.getChatMessages(-1);
  if (!messages || messages.length === 0) return;
  const lastMsg = messages[0];
  if (lastMsg.role === "user" || lastMsg.is_user) {
    cleanGhostVariables(lastMsg.message_id);
    return;
  }
  const originalText = lastMsg.message;
  const musicRegex = /<music>([\s\S]*?)<\/music>/i;
  const match = originalText.match(musicRegex);
  if (!match) return;
  const innerText = match[1].trim();
  let musicName = innerText;
  let artistName = "";
  const separatorRegex = /[-—–~]/;
  if (separatorRegex.test(innerText)) {
    const parts = innerText.split(separatorRegex);
    artistName = parts.pop().trim();
    musicName = parts.join("-").trim();
    if (!musicName) {
      musicName = artistName;
      artistName = "";
    }
  }
  if (!musicName) return;
  try {
    await window.TavernHelper.updateVariablesWith(
      (vars) => {
        if (!vars["siren-voice"]) vars["siren-voice"] = {};
        vars["siren-voice"].ambience = {
          music: musicName,
          artist: artistName
        };
        return vars;
      },
      { type: "message", message_id: lastMsg.message_id }
    );
  } catch (e) {
    console.error("[Siren Voice] \u274C \u53D8\u91CF\u5199\u5165\u5931\u8D25", e);
  }
  const settings = getSirenSettings();
  if (settings?.music?.enabled && settings?.music?.mode === "smart") {
    const source = settings.music.source || "netease";
    const history = getEchoHistory();
    const isExist = history.some(
      (s) => s.name === musicName && s.artist === artistName
    );
    if (!isExist) {
      history.unshift({
        floor: lastMsg.message_id,
        name: musicName,
        artist: artistName,
        source
      });
    }
    setPlaylistContext(history, { name: musicName, artist: artistName });
    const isAutoPlay = settings.music.auto_play ?? true;
    const customStopRaw = settings.tts?.stop_chars || "";
    if (isAutoPlay) {
      const isComplete = checkReplyIntegrity(originalText, customStopRaw);
      if (isComplete) {
        console.log(
          `[Siren Voice] \u{1F7E2} \u6D88\u606F\u5B8C\u6574\uFF0C\u5141\u8BB8\u81EA\u52A8\u8BF7\u6C42\u6B4C\u66F2 API: ${musicName}`
        );
        await playTargetMusic(musicName, artistName, source);
      } else {
        console.log(
          `[Siren Voice] \u26A0\uFE0F \u56DE\u590D\u4E0D\u5B8C\u6574 (\u53EF\u80FD\u88AB\u622A\u65AD/\u6D41\u5F0F\u8F93\u51FA\u4E2D)\uFF0C\u7EC8\u6B62\u81EA\u52A8\u97F3\u4E50\u8BF7\u6C42\u3002`
        );
      }
    } else {
      console.log(
        `[Siren Voice] \u23F8\uFE0F \u81EA\u52A8\u64AD\u653E\u5DF2\u5173\u95ED\u3002\u5DF2\u6355\u83B7 [${musicName}] \u4F46\u4E0D\u4E3B\u52A8\u53D1\u8D77\u8BF7\u6C42\u3002`
      );
    }
  }
  setTimeout(() => {
    window.dispatchEvent(new CustomEvent("siren:echo_updated"));
    bindInlineMusicCards(document);
  }, 200);
}
function buildMusicRegexes(styles) {
  const isEnabled = styles?.msgEnabled;
  const regexes = [];
  if (isEnabled) {
    let displayReplace = `<span class="siren-music-card" data-siren-music-card="1" data-siren-music-title="$1" data-siren-music-artist="$2" tabindex="0" style="display: flex;">
    <span class="siren-music-cover-wrap">
        <i class="fa-solid fa-play siren-play-icon"></i>
    </span>
    <span class="siren-music-info-wrap">
        <span class="siren-title">$1</span>
        <span class="siren-artist">$2</span>
    </span>
</span>`;
    displayReplace = displayReplace.replace(/\r?\n|\r/g, " ");
    regexes.push({
      id: "siren-voice-music-display-html",
      script_name: "Siren-Voice-Auto-Music-HTML",
      enabled: true,
      run_on_edit: true,
      scope: "global",
      // 🌟 已更新：支持全部类型破折号
      find_regex: "/<music>\\s*([^-\u2014\u2013~<]+?)(?:\\s*[-\u2014\u2013~]\\s*([^<]+?))?\\s*<\\/music>/gi",
      replace_string: displayReplace,
      source: {
        user_input: true,
        ai_output: true,
        slash_command: true,
        world_info: false
      },
      destination: { display: true, prompt: false },
      min_depth: null,
      max_depth: null
    });
  } else {
    regexes.push({
      id: "siren-voice-music-display-text-full",
      script_name: "Siren-Voice-Auto-Music-Text-Full",
      enabled: true,
      run_on_edit: true,
      scope: "global",
      // 🌟 已更新：支持全部类型破折号
      find_regex: "/<music>\\s*(.+?)\\s*[-\u2014\u2013~]\\s*(.+?)\\s*<\\/music>/gi",
      replace_string: "<span style='color: #10b981;'>[\u{1F3B5} \u6B63\u5728\u6253\u635E: $1 - $2]</span>",
      source: {
        user_input: true,
        ai_output: true,
        slash_command: true,
        world_info: false
      },
      destination: { display: true, prompt: false },
      min_depth: null,
      max_depth: null
    });
    regexes.push({
      id: "siren-voice-music-display-text-single",
      script_name: "Siren-Voice-Auto-Music-Text-Single",
      enabled: true,
      run_on_edit: true,
      scope: "global",
      // 🌟 已更新：排除全部类型破折号
      find_regex: "/<music>\\s*([^-\u2014\u2013~<]+?)\\s*<\\/music>/gi",
      replace_string: "<span style='color: #10b981;'>[\u{1F3B5} \u6B63\u5728\u6253\u635E: $1]</span>",
      source: {
        user_input: true,
        ai_output: true,
        slash_command: true,
        world_info: false
      },
      destination: { display: true, prompt: false },
      min_depth: null,
      max_depth: null
    });
  }
  return regexes;
}
function applyMusicBeautifyCss() {
  const settings = getSirenSettings();
  const enabled = settings?.music?.styles?.msgEnabled ?? false;
  const currentStyle = settings?.music?.styles?.msgCurrent || "default";
  const customCss = settings?.music?.styles?.msgDict?.[currentStyle]?.code || "";
  let styleTag = document.getElementById("siren-music-msg-style");
  if (!styleTag) {
    styleTag = document.createElement("style");
    styleTag.id = "siren-music-msg-style";
    document.head.appendChild(styleTag);
  }
  if (enabled && customCss) {
    styleTag.textContent = customCss.replace(
      /\.siren-([a-zA-Z0-9_-]+)/g,
      ":is(.siren-$1, .custom-siren-$1)"
    );
  } else {
    styleTag.textContent = "";
  }
}
function buildSpeakRegexes() {
  const createRegexConfig = (tag, iconHtml) => {
    const capitalizedTag = tag.charAt(0).toUpperCase() + tag.slice(1);
    return {
      id: `siren-voice-${tag}-display`,
      script_name: `Siren-Voice-Auto-${capitalizedTag}`,
      enabled: true,
      run_on_edit: true,
      scope: "global",
      find_regex: `/<${tag}\\b([^>]*)>((?:(?!<(?:speak|inner|phone)\\b)[\\s\\S])*?)<\\/${tag}>/gi`,
      // 👇 主要修改这里：最外层加了一个 <span style="display: block; width: 100%;">，并在末尾加上 </span>
      replace_string: `<span style="display: block; width: 100%;"><span class="siren-speak-card" data-siren-speak="1" data-tag="${tag}" data-raw-attrs='$1' tabindex="0" style="display: flex; width: fit-content; margin-top: 6px; margin-bottom: 6px;">
    <span class="siren-btn-wrap siren-play-wrap" data-siren-action="play" title="\u64AD\u653E">
        <i class="fa-solid fa-circle-play"></i>
    </span>
    <span class="siren-btn-wrap siren-play-spinner-wrap" style="display: none;">
        <i class="fa-solid fa-spinner fa-spin"></i>
    </span>
    ${iconHtml}
    <span class="siren-speak-text">$2</span>
    <span class="siren-raw-text" style="display: none;">$2</span> <span class="siren-btn-wrap siren-regen-wrap" data-siren-action="regenerate" title="\u91CD\u65B0\u751F\u6210">
        <i class="fa-solid fa-rotate-right"></i>
    </span>
    <span class="siren-btn-wrap siren-regen-spinner-wrap" style="display: none;">
        <i class="fa-solid fa-spinner fa-spin"></i>
    </span>
</span></span>`.replace(/\n\s+/g, ""),
      // 👈 注意这里也要多加一个 </span> 闭合外层标签
      source: {
        user_input: true,
        ai_output: true,
        slash_command: true,
        world_info: false
      },
      destination: { display: true, prompt: false },
      min_depth: null,
      max_depth: null
    };
  };
  const getIndicatorHtml = (faClass) => `<span class="siren-tag-icon" data-siren-icon="1" style="pointer-events: none; opacity: 0.85; margin-right: 6px;">
            <i class="${faClass}"></i>
        </span>`;
  return [
    createRegexConfig("speak", ""),
    createRegexConfig("inner", getIndicatorHtml("fa-solid fa-comment")),
    createRegexConfig("phone", getIndicatorHtml("fa-solid fa-phone")),
    // Last-resort display rule. During streaming an open speech tag must NOT
    // be mistaken for a finished card; retain its raw text until the real
    // closing tag arrives instead of showing unstable intermediate HTML.
    {
      id: "siren-voice-pending-speech-display",
      script_name: "Siren-Voice-Auto-Pending-Speech",
      enabled: true,
      run_on_edit: true,
      scope: "global",
      find_regex: "/<(speak|inner|phone)\\b[^>]*>([\\s\\S]*)$/gi",
      replace_string: '<span class="siren-stream-pending">$2</span>',
      source: {
        user_input: true,
        ai_output: true,
        slash_command: true,
        world_info: false
      },
      destination: { display: true, prompt: false },
      min_depth: null,
      max_depth: null
    }
  ];
}
async function updateSirenRegex(styles) {
  if (!window.TavernHelper || typeof window.TavernHelper.updateTavernRegexesWith !== "function")
    return;
  const settings = getSirenSettings();
  const bStyle = settings?.ambience?.card_style;
  const sStyle = settings?.ambience?.sfx_card_style;
  const ambienceIcon = bStyle?.dict?.[bStyle.current]?.icon || "fa-solid fa-music";
  const sfxIcon = sStyle?.dict?.[sStyle.current]?.icon || "fa-solid fa-bolt";
  const musicRegexes = buildMusicRegexes(styles);
  const speakRegexes = buildSpeakRegexes();
  const ambienceRegexes = buildAmbienceRegexes(ambienceIcon);
  const sfxRegexes = buildSfxRegexes(sfxIcon);
  const allSirenRegexes = [
    ...speakRegexes,
    ...musicRegexes,
    ...ambienceRegexes,
    ...sfxRegexes
  ];
  await window.TavernHelper.updateTavernRegexesWith((regexes) => {
    let newRegexes = regexes.filter(
      (r) => !r.script_name.startsWith("Siren-Voice-Auto-")
    );
    newRegexes.unshift(...allSirenRegexes);
    return newRegexes;
  });
  setTimeout(() => {
    bindInlineMusicCards(document);
    bindInlineSpeakCards(document);
  }, 200);
}
function initSecuritySweeper() {
  const context = SillyTavern.getContext();
  const eventSource = context.eventSource;
  eventSource.on("user_message_rendered", async (messageId) => {
    cleanGhostVariables(messageId);
  });
  eventSource.on("generation_started", async () => {
    const msgs = window.TavernHelper.getChatMessages(-1);
    if (msgs && msgs.length > 0) {
      const lastMsg = msgs[0];
      if (lastMsg.role === "user" || lastMsg.is_user) {
        cleanGhostVariables(lastMsg.message_id);
      }
    }
  });
}
async function cleanGhostVariables(msgId) {
  if (!msgId || !window.TavernHelper) return;
  try {
    const vars = window.TavernHelper.getVariables({
      type: "message",
      message_id: msgId
    });
    if (vars && vars["siren-voice"] && vars["siren-voice"].ambience) {
      const cleanVars = { ...vars };
      delete cleanVars["siren-voice"].ambience;
      if (cleanVars["siren-voice"] && Object.keys(cleanVars["siren-voice"]).length === 0) {
        delete cleanVars["siren-voice"];
      }
      await window.TavernHelper.replaceVariables(cleanVars, {
        type: "message",
        message_id: msgId
      });
    }
  } catch (e) {
    console.warn("[Siren Voice] cleanGhostVariables \u5FFD\u7565\u5F02\u5E38:", e);
  }
}
function parseRawSpeakAttrs(rawAttrs) {
  const attrs = {};
  const attrRegex = /(\w+)\s*=\s*(?:"|&quot;|')([^"']*)(?:"|&quot;|')/g;
  let match;
  while ((match = attrRegex.exec(rawAttrs)) !== null) {
    attrs[match[1]] = match[2];
  }
  return attrs;
}
async function handleInlineSpeakPlay(speakObj, cardElement, action = "play") {
  const context = SillyTavern.getContext();
  const currentChatId = context.chatId;
  const settings = getSirenSettings();
  const provider = settings?.tts?.provider || "indextts";
  const ttsSettings = settings?.tts?.[provider] || {};
  const floor = getMessageIdFromElement(cardElement);
  stopCurrentTTS();
  const loadingClass = action === "regenerate" ? "is-loading-regen" : "is-loading-play";
  if (cardElement.classList.contains(loadingClass)) return;
  cardElement.classList.add(loadingClass);
  await new Promise((resolve) => requestAnimationFrame(resolve));
  try {
    if (action === "play") {
      const cachedRecord = await findExactTtsRecord(
        currentChatId,
        floor,
        speakObj.char,
        speakObj.text,
        speakObj.mood,
        // 👈 新增情绪参数
        speakObj.detail
        // 👈 新增情绪细节参数
      );
      if (cachedRecord && cachedRecord.audioBlob) {
        console.log(`[Siren Voice] \u547D\u4E2D\u672C\u5730\u7F13\u5B58\uFF0C\u76F4\u63A5\u64AD\u653E: ${speakObj.text}`);
        enqueueTTSBlob(cachedRecord.audioBlob, speakObj);
        return;
      } else {
        console.log(
          `[Siren Voice] \u672A\u547D\u4E2D\u7F13\u5B58(\u6216\u6587\u672C\u5DF2\u4FEE\u6539)\uFF0C\u8F6C\u5165\u5B9E\u65F6\u751F\u6210: ${speakObj.text}`
        );
      }
    }
    const isRegen = action === "regenerate";
    await dispatchTtsGeneration(
      speakObj,
      floor,
      provider,
      ttsSettings,
      isRegen
    );
  } finally {
    cardElement.classList.remove(loadingClass);
  }
}

// scripts/music.js
init_utils();
var sirenStyleDraft = null;
var currentPlaylistPage = 1;
var PLAYLIST_PAGE_SIZE = 15;
function initMusicSettings() {
  const musicTab = document.getElementById("tab-music");
  if (!musicTab) return;
  const musicHtml = `
        <div class="siren-ext-settings-container">
            <h3 style="display: flex; align-items: center; justify-content: space-between;">
                <span><i class="fa-solid fa-compact-disc fa-fw" style="color:#06b6d4; margin-right:8px;"></i>\u6F6E\u6C50\u97F3\u4E50\u53F0</span>
                <i id="siren-music-save-btn" class="fa-solid fa-floppy-disk" style="cursor: pointer; color: #10b981; font-size: 1.2em;" title="\u4FDD\u5B58\u5168\u5C40\u8BBE\u7F6E"></i>
            </h3>
            
            <div class="siren-ext-setting-row siren-ext-flex-between" style="border-color: #06b6d4; background: rgba(6, 182, 212, 0.1);">
                <div class="siren-ext-setting-label">
                    <label for="siren-music-enable" style="color: #06b6d4; font-size: 1.1em;">\u5524\u9192\u6F6E\u6C50</label>
                </div>
                <label class="siren-ext-switch">
                    <input type="checkbox" id="siren-music-enable">
                    <span class="siren-ext-slider"></span>
                </label>
            </div>

            <div id="siren-music-settings-wrapper">
                <div class="siren-ext-setting-row siren-ext-flex-between">
                    <div class="siren-ext-setting-label">
                        <label for="siren-music-floating-enable">\u663E\u793A\u6F6E\u6C50\u63A7\u5236\u53F0</label>
                    </div>
                    <label class="siren-ext-switch">
                        <input type="checkbox" id="siren-music-floating-enable">
                        <span class="siren-ext-slider"></span>
                    </label>
                </div>
                <div class="siren-ext-setting-row siren-ext-flex-between">
                    <div class="siren-ext-setting-label"><label>\u6F6E\u6C50\u5F15\u5BFC\u822A\u7EBF</label></div>
                    <select id="siren-music-mode" class="siren-ext-select">
                        <option value="smart">\u585E\u58EC\u7075\u611F</option>
                        <option value="playlist">\u6DF1\u6D77\u6B4C\u5355</option>
                    </select>
                </div>
                <div class="siren-ext-setting-row siren-ext-flex-between">
                    <div class="siren-ext-setting-label">
                        <label for="siren-music-auto-play">\u81EA\u52A8\u64AD\u653E</label>
                    </div>
                    <label class="siren-ext-switch">
                        <input type="checkbox" id="siren-music-auto-play">
                        <span class="siren-ext-slider"></span>
                    </label>
                </div>
                <div class="siren-ext-setting-row siren-ext-flex-between">
                    <div class="siren-ext-setting-label">
                        <label>\u63A2\u7D22\u6D77\u57DF</label>
                    </div>
                    <select id="siren-music-source" class="siren-ext-select">
                        <option value="netease">\u7F51\u6613\u4E91</option>
                        <option value="tencent">QQ\u97F3\u4E50</option>
                        <option value="tidal">Tidal</option>
                        <option value="spotify">Spotify</option>
                        <option value="apple">Apple Music</option>
                        <option value="ytmusic">YouTube Music</option>
                        <option value="qobuz">Qobuz</option>
                        <option value="joox">JOOX</option>
                        <option value="deezer">Deezer</option>
                        <option value="migu">\u54AA\u5495</option>
                        <option value="kugou">\u9177\u72D7</option>
                        <option value="kuwo">\u9177\u6211</option>
                        <option value="ximalaya">\u559C\u9A6C\u62C9\u96C5</option>
                    </select>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; margin-top: 15px;">
                    <h4 style="margin: 0; color: #f472b6;"><i class="fa-solid fa-palette" style="margin-right:8px;"></i>\u5E7B\u5F69\u8D1D\u58F3</h4>
                    <div style="display: flex; gap: 8px; align-items: center;">
                        <button id="siren-style-import-btn" class="siren-ext-btn siren-ext-btn-secondary" style="padding: 4px 10px; font-size: 0.85em;" title="\u5BFC\u5165\u6D82\u88C5"><i class="fa-solid fa-file-import"></i></button>
                        <button id="siren-style-export-btn" class="siren-ext-btn siren-ext-btn-secondary" style="padding: 4px 10px; font-size: 0.85em;" title="\u5BFC\u51FA\u6D82\u88C5"><i class="fa-solid fa-file-export"></i></button>
                        <input type="file" id="siren-style-import-file" accept=".json" style="display: none;">
                    </div>
                </div>

                <div class="siren-ext-setting-row siren-ext-flex-between">
                    <div class="siren-ext-setting-label"><label>\u{1F3A8}\u63A7\u5236\u53F0\u6D82\u88C5</label></div>
                    <div style="display: flex; gap: 8px; align-items: center;">
                        <select id="siren-style-player-select" class="siren-ext-select" style="max-width: 150px;"></select>
                        <button id="siren-style-player-add-btn" class="siren-ext-btn siren-ext-btn-secondary" style="padding: 4px 10px;" title="\u65B0\u589E\u81EA\u5B9A\u4E49\u6837\u5F0F"><i class="fa-solid fa-plus"></i></button>
                        <button id="siren-style-player-del-btn" class="siren-ext-btn siren-ext-btn-secondary" style="padding: 4px 10px; color: #ef4444;" title="\u5220\u9664\u5F53\u524D\u6837\u5F0F"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </div>
                <div id="siren-style-player-css-wrapper" style="margin-bottom: 15px;">
                    <textarea id="siren-style-player-css" class="siren-ext-textarea" rows="5" placeholder="/* \u81EA\u5B9A\u4E49 CSS */" style="font-family: monospace; font-size: 0.85em;"></textarea>
                </div>

                <div class="siren-ext-setting-row siren-ext-flex-between">
                    <div class="siren-ext-setting-label">
                        <label>\u6DF1\u6D77\u6C14\u6CE1\u62DF\u6001</label>
                        <small style="display:block; margin-top:4px;">\u66FF\u6362\u9ED8\u8BA4\u9690\u85CF\u7684 &lt;music&gt; \u6807\u7B7E\u4E3A\u7CBE\u7F8E\u5361\u7247</small>
                    </div>
                    <label class="siren-ext-switch">
                        <input type="checkbox" id="siren-style-msg-enable">
                        <span class="siren-ext-slider"></span>
                    </label>
                </div>
                
                <div id="siren-style-msg-html-wrapper" style="display: none;">
                    <div class="siren-ext-setting-row siren-ext-flex-between" style="background: rgba(0,0,0,0.2); border-color: transparent;">
                        <div class="siren-ext-setting-label"><label>\u5F53\u524D\u6837\u5F0F</label></div>
                        <div style="display: flex; gap: 8px; align-items: center;">
                            <select id="siren-style-msg-select" class="siren-ext-select" style="max-width: 150px;"></select>
                            <button id="siren-style-msg-add-btn" class="siren-ext-btn siren-ext-btn-secondary" style="padding: 4px 10px;" title="\u65B0\u589E\u81EA\u5B9A\u4E49\u6837\u5F0F"><i class="fa-solid fa-plus"></i></button>
                            <button id="siren-style-msg-del-btn" class="siren-ext-btn siren-ext-btn-secondary" style="padding: 4px 10px; color: #ef4444;" title="\u5220\u9664\u5F53\u524D\u6837\u5F0F"><i class="fa-solid fa-trash"></i></button>
                        </div>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <textarea id="siren-style-msg-html" class="siren-ext-textarea" rows="5" placeholder="" style="font-family: monospace; font-size: 0.85em;"></textarea>
                    </div>
                </div>

                <div class="siren-ext-style-preview-box">
                    <div style="color: #94a3b8; font-size: 0.8em; margin-bottom: 12px; display:flex; justify-content:space-between;">
                        <span><i class="fa-solid fa-eye"></i> \u5168\u606F\u6295\u5F71\u9884\u89C8</span>
                        <span id="siren-preview-status" style="color:#10b981;">\u5DF2\u5C31\u7EEA</span>
                    </div>
                    
                    <div style="position: relative; height: 80px; margin-bottom: 15px; pointer-events: none;">
                        <div id="siren-music-player-preview" class="siren-ext-player-pill" style="position: absolute; top:0; left:0; width: 280px; transform: scale(0.8); transform-origin: top left;">
                            <div class="siren-ext-player-basic">
                                <div class="siren-ext-player-cover"><i class="fa-solid fa-music" style="color: #06b6d4;"></i></div>
                                <div class="siren-ext-player-info">
                                    <div class="siren-ext-music-title">\u6DF1\u6D77\u56DE\u54CD (Preview)</div>
                                    <div class="siren-ext-music-artist">\u585E\u58EC\u4E4B\u58F0</div>
                                </div>
                                <div class="siren-ext-player-controls">
                                    <i class="fa-solid fa-arrow-right-arrow-left siren-ext-ctrl-btn" title="\u987A\u5E8F\u64AD\u653E" style="font-size: 0.9em; margin-right: 2px;"></i>
                                    <i class="fa-solid fa-backward-step siren-ext-ctrl-btn" title="\u4E0A\u4E00\u9996"></i>
                                    <i class="fa-solid fa-play siren-ext-ctrl-btn" title="\u64AD\u653E/\u6682\u505C" style="color: #10b981; font-size: 1.1em;"></i>
                                    <i class="fa-solid fa-forward-step siren-ext-ctrl-btn" title="\u4E0B\u4E00\u9996"></i>
                                    <i class="fa-solid fa-chevron-down siren-ext-ctrl-btn" title="\u5C55\u5F00\u6B4C\u8BCD"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="siren-ext-chat-msg-mock">
                        <div style="width: 32px; height: 32px; border-radius: 50%; background: #1e293b; display: flex; align-items: center; justify-content: center; font-size: 1.2em; border: 1px solid #06b6d4; box-shadow: 0 0 8px rgba(6, 182, 212, 0.4); flex-shrink: 0;">\u{1F9DC}\u200D\u2640\uFE0F</div>
                        <div style="flex: 1;">
                            <div style="font-size: 0.85em; color: #94a3b8; margin-bottom: 4px;">Siren</div>
                            <div style="color: #cbd5e1; font-size: 0.9em; line-height: 1.5;">
                                \u6DF1\u6D77\u4E2D\u6D6E\u73B0\u51FA\u8FD9\u6BB5\u65CB\u5F8B~~
                                <div id="siren-preview-msg-render" style="margin-top: 8px;">
                                    </div>
                            </div>
                        </div>
                    </div>
                </div>
                <hr class="siren-ext-divider">

                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; margin-top: 15px;">
                    <h4 style="margin: 0; color: #a855f7;"><i class="fa-solid fa-ear-listen" style="margin-right:8px;"></i>\u62FE\u97F3\u6D77\u87BA</h4>
                    <button id="siren-echo-refresh-btn" class="siren-ext-btn siren-ext-btn-secondary" style="padding: 4px 10px; font-size: 0.85em;" title="\u5237\u65B0\u5217\u8868">
                        <i class="fa-solid fa-rotate-right"></i>
                    </button>
                </div>

                <div id="siren-echo-container" class="siren-ext-playlist-box" style="background: #0a0f1e; border-radius: 6px; border: 1px dashed #64748b; margin-bottom: 15px; max-height: 300px; overflow-y: auto;">
                    <div id="siren-echo-empty" style="text-align:center; padding: 20px; color: #475569;">\u6682\u65E0\u5386\u53F2\u56DE\u54CD\u3002</div>
                    <ul id="siren-echo-list" style="list-style: none; padding: 0; margin: 0;"></ul>
                </div>

                <div style="display: flex; justify-content: center; align-items: center; gap: 15px; margin-bottom: 15px; color: #94a3b8; font-size: 0.9em;">
                    <button id="siren-echo-prev" class="siren-ext-btn siren-ext-btn-secondary" style="padding: 4px 12px;"><i class="fa-solid fa-chevron-left"></i></button>
                    <span id="siren-echo-page-info" style="font-family: monospace; font-size: 1.1em; width: 60px; text-align: center;">1 / 1</span>
                    <button id="siren-echo-next" class="siren-ext-btn siren-ext-btn-secondary" style="padding: 4px 12px;"><i class="fa-solid fa-chevron-right"></i></button>
                </div>

                <hr class="siren-ext-divider">
            
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; margin-top: 15px;">
                    <h4 style="margin: 0;"><i class="fa-solid fa-list-ul" style="color:#10b981; margin-right:8px;"></i>\u6DF1\u6D77\u6B4C\u5355</h4>
                    <div style="display: flex; gap: 8px; align-items: center;">
                        <button id="siren-music-import-btn" class="siren-ext-btn siren-ext-btn-secondary" style="padding: 4px 10px; font-size: 0.85em;" title="\u5BFC\u5165\u6B4C\u5355"><i class="fa-solid fa-file-import"></i></button>
                        <button id="siren-music-export-btn" class="siren-ext-btn siren-ext-btn-secondary" style="padding: 4px 10px; font-size: 0.85em;" title="\u5BFC\u51FA\u6B4C\u5355"><i class="fa-solid fa-file-export"></i></button>
                        <input type="file" id="siren-music-import-file" accept=".json" style="display: none;">
                    </div>
                </div>
                
                <div class="siren-ext-add-music-row" style="display: flex; gap: 10px; margin-bottom: 15px;">
                    <input type="text" id="siren-music-search-title" class="siren-ext-input" placeholder="\u6B4C\u66F2\u540D (\u5FC5\u586B)" style="flex: 2;">
                    <input type="text" id="siren-music-search-artist" class="siren-ext-input" placeholder="\u6B4C\u624B (\u9009\u586B)" style="flex: 1;">
                    <button id="siren-music-search-btn" class="siren-ext-btn siren-ext-btn-primary"><i class="fa-solid fa-magnifying-glass"></i> \u641C\u7D22</button>
                </div>
                
                <div id="siren-music-playlist-container" class="siren-ext-playlist-box" style="background: #0a0f1e; border-radius: 6px; border: 1px solid #334155; margin-bottom: 15px;">
                    <div id="siren-music-empty-state" style="text-align:center; padding: 20px; color: #475569;">\u6682\u65E0\u66F2\u76EE\uFF0C\u8BF7\u641C\u7D22\u6DFB\u52A0\u3002</div>
                    <ul id="siren-music-list" style="list-style: none; padding: 0; margin: 0;"></ul>
                </div>
                
                <div style="display: flex; justify-content: center; align-items: center; gap: 15px; margin-bottom: 15px; color: #94a3b8; font-size: 0.9em;">
                    <button id="siren-btn-page-prev" class="siren-ext-btn siren-ext-btn-secondary" style="padding: 4px 12px;"><i class="fa-solid fa-chevron-left"></i></button>
                    <span id="siren-playlist-page-info" style="font-family: monospace; font-size: 1.1em; width: 60px; text-align: center;">1 / 1</span>
                    <button id="siren-btn-page-next" class="siren-ext-btn siren-ext-btn-secondary" style="padding: 4px 12px;"><i class="fa-solid fa-chevron-right"></i></button>
                </div>
            </div>
        </div>
    `;
  musicTab.innerHTML = musicHtml;
  if (!document.getElementById("siren-music-search-modal")) {
    const modalHtml = `
            <div id="siren-music-search-modal" class="siren-ext-hidden" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); z-index: 10000; display: flex; justify-content: center; align-items: center;">
                <div style="background: #0f172a; width: 600px; max-width: 90%; max-height: 80vh; border-radius: 12px; border: 1px solid #334155; display: flex; flex-direction: column; box-shadow: 0 10px 30px rgba(0,0,0,0.8);">
                    <div style="padding: 15px 20px; border-bottom: 1px solid #1e293b; display: flex; justify-content: space-between; align-items: center;">
                        <h3 style="margin:0; color:#06b6d4; font-size:1.1em;"><i class="fa-solid fa-satellite-dish"></i> \u58F0\u7EB3\u63A2\u6D4B\u7ED3\u679C</h3>
                        <i id="siren-close-modal-btn" class="fa-solid fa-xmark" style="cursor: pointer; color:#94a3b8; font-size: 1.2em; transition: color 0.2s;"></i>
                    </div>
                    <div id="siren-modal-results-container" style="padding: 15px; overflow-y: auto; flex: 1;">
                        </div>
                </div>
            </div>
        `;
    document.body.insertAdjacentHTML("beforeend", modalHtml);
  }
  bindMusicSettingsEvents();
  loadSettingsToUI();
}
var currentEchoPage = 1;
var ECHO_PAGE_SIZE = 15;
function getEchoHistory() {
  if (!window.TavernHelper) return [];
  const allMsgs = window.TavernHelper.getChatMessages("0-{{lastMessageId}}", {
    include_swipes: false
  });
  const history = [];
  const seenMusics = /* @__PURE__ */ new Set();
  for (let i = allMsgs.length - 1; i >= 0; i--) {
    const msg = allMsgs[i];
    if (msg.is_user || msg.role === "user" || msg.name === SillyTavern.getContext().userName)
      continue;
    const vars = window.TavernHelper.getVariables({
      type: "message",
      message_id: msg.message_id
    });
    if (vars && vars["siren-voice"] && vars["siren-voice"].ambience) {
      const ambience = vars["siren-voice"].ambience;
      const uniqueKey = `${ambience.music}::${ambience.artist}`;
      if (!seenMusics.has(uniqueKey)) {
        seenMusics.add(uniqueKey);
        history.push({
          floor: msg.message_id,
          name: ambience.music,
          artist: ambience.artist || "\u672A\u77E5",
          source: "netease"
        });
      }
    }
  }
  return history;
}
function renderEchoPage() {
  const history = getEchoHistory();
  const totalPages = Math.ceil(history.length / ECHO_PAGE_SIZE) || 1;
  if (currentEchoPage > totalPages) currentEchoPage = totalPages;
  if (currentEchoPage < 1) currentEchoPage = 1;
  const startIndex = (currentEchoPage - 1) * ECHO_PAGE_SIZE;
  const pageData = history.slice(startIndex, startIndex + ECHO_PAGE_SIZE);
  const listEl = $("#siren-echo-list");
  listEl.empty();
  if (history.length > 0) {
    $("#siren-echo-empty").hide();
    pageData.forEach((item) => {
      const b64Data = btoa(encodeURIComponent(JSON.stringify(item)));
      const liHtml = `
                <li style="display: flex; justify-content: space-between; align-items: center; padding: 12px; border-bottom: 1px solid #1e293b; color: #cbd5e1;">
                    <span style="flex: 1; display: flex; align-items: center; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">
                        <i class="fa-solid fa-play siren-ext-play-echo" data-name="${item.name}" data-artist="${item.artist}" style="cursor: pointer; color: #10b981; margin-right: 12px; font-size: 1.1em;" title="\u518D\u6B21\u5171\u9E23 (\u76F2\u641C\u64AD\u653E)"></i>
                        <span style="display: inline-block; width: 45px; color: #64748b; font-family: monospace; font-size: 0.85em;">#${item.floor}</span>
                        <span class="siren-ext-music-data" style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">
                            <strong style="color: #f1f5f9;">${item.name}</strong> 
                            <small style="color: #64748b; margin-left: 5px;">${item.artist ? `- ${item.artist}` : ""}</small>
                        </span>
                    </span>
                    <i class="fa-solid fa-folder-plus siren-ext-echo-to-playlist" data-obj="${b64Data}" style="cursor: pointer; color: #06b6d4; font-size: 1.3em; padding: 4px 8px; transition: transform 0.2s;" title="\u6DFB\u52A0\u5230\u6DF1\u6D77\u6B4C\u5355" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'"></i>
                </li>
            `;
      listEl.append(liHtml);
    });
  } else {
    $("#siren-echo-empty").show();
  }
  $("#siren-echo-page-info").text(`${currentEchoPage} / ${totalPages}`);
}
function renderPlaylistPage() {
  const playlist = getSirenSettings().music.playlist || [];
  const totalPages = Math.ceil(playlist.length / PLAYLIST_PAGE_SIZE) || 1;
  if (currentPlaylistPage > totalPages) currentPlaylistPage = totalPages;
  if (currentPlaylistPage < 1) currentPlaylistPage = 1;
  const startIndex = (currentPlaylistPage - 1) * PLAYLIST_PAGE_SIZE;
  const endIndex = startIndex + PLAYLIST_PAGE_SIZE;
  const pageData = playlist.slice(startIndex, endIndex);
  $("#siren-music-list").empty();
  if (playlist.length > 0) {
    $("#siren-music-empty-state").hide();
    pageData.forEach((music) => appendMusicToUI(music));
  } else {
    $("#siren-music-empty-state").show();
  }
  $("#siren-playlist-page-info").text(`${currentPlaylistPage} / ${totalPages}`);
}
function loadSettingsToUI() {
  const config = getSirenSettings().music;
  $("#siren-music-enable").prop("checked", config.enabled);
  $("#siren-music-floating-enable").prop("checked", config.floating_enabled);
  $("#siren-music-auto-play").prop("checked", config.auto_play ?? true);
  $("#siren-music-source").val(config.source);
  $("#siren-music-mode").val(config.mode);
  $("#siren-music-insert-pos").val(config.insert_pos);
  $("#siren-music-char").val(config.char);
  $("#siren-music-depth").val(config.depth);
  $("#siren-music-order").val(config.order);
  $("#siren-music-prompt").val(config.prompt);
  sirenStyleDraft = JSON.parse(JSON.stringify(defaultSettings.music.styles));
  if (config.styles) {
    if (config.styles.msgEnabled !== void 0) {
      sirenStyleDraft.msgEnabled = config.styles.msgEnabled;
    }
    if (config.styles.playerCurrent) {
      sirenStyleDraft.playerCurrent = config.styles.playerCurrent;
    }
    if (config.styles.msgCurrent) {
      sirenStyleDraft.msgCurrent = config.styles.msgCurrent;
    }
    if (config.styles.playerDict) {
      for (let key in config.styles.playerDict) {
        if (!sirenStyleDraft.playerDict[key]) {
          sirenStyleDraft.playerDict[key] = config.styles.playerDict[key];
        }
      }
    }
    if (config.styles.msgDict) {
      for (let key in config.styles.msgDict) {
        if (!sirenStyleDraft.msgDict[key]) {
          sirenStyleDraft.msgDict[key] = config.styles.msgDict[key];
        }
      }
    }
  }
  $("#siren-style-msg-enable").prop("checked", sirenStyleDraft.msgEnabled);
  refreshStyleDropdowns();
  updateStylePreview();
  $("#siren-style-msg-enable").trigger("change");
  renderPlaylistPage();
  $("#siren-music-enable").trigger("change");
}
function appendMusicToUI(musicObj) {
  const artistText = musicObj.artist ? `- ${musicObj.artist}` : "";
  const b64Data = btoa(encodeURIComponent(JSON.stringify(musicObj)));
  const liHtml = `
        <li style="display: flex; justify-content: space-between; align-items: center; padding: 12px; border-bottom: 1px solid #1e293b; color: #cbd5e1;">
            <span style="flex: 1; display: flex; align-items: center; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">
                <i class="fa-solid fa-play siren-ext-play-music" data-obj="${b64Data}" style="cursor: pointer; color: #10b981; margin-right: 12px; font-size: 1.1em;" title="\u7CBE\u51C6\u64AD\u653E"></i>
                <span class="siren-ext-music-data" data-obj="${b64Data}">
                    <strong style="color: #f1f5f9;">${musicObj.name || musicObj.title}</strong> 
                    <small style="color: #64748b; margin-left: 5px;">${artistText}</small>
                    <span style="font-size: 0.7em; background: #1e293b; padding: 2px 6px; border-radius: 4px; margin-left: 8px;">${musicObj.source}</span>
                </span>
            </span>
            <i class="fa-solid fa-trash siren-ext-del-music" style="cursor: pointer; color: #ef4444; padding: 5px;" title="\u5220\u9664"></i>
        </li>
    `;
  $("#siren-music-list").append(liHtml);
}
function bindMusicSettingsEvents() {
  $("#siren-music-enable").on("change", async function() {
    const isChecked = $(this).is(":checked");
    if (isChecked) {
      $("#siren-music-settings-wrapper").slideDown(200);
      if ($("#siren-music-floating-enable").is(":checked"))
        $("#siren-music-player").fadeIn(200);
    } else {
      $("#siren-music-settings-wrapper").slideUp(200);
      $("#siren-music-player").fadeOut(200);
    }
    const mSettings = getSirenSettings().music;
    mSettings.enabled = isChecked;
    saveSirenSettings(true);
    await syncMusicWorldbookEntry(isChecked);
  });
  $("#siren-music-floating-enable").on("change", function() {
    if ($(this).is(":checked") && $("#siren-music-enable").is(":checked")) {
      $("#siren-music-player").fadeIn(200);
    } else {
      $("#siren-music-player").fadeOut(200);
    }
  });
  $("#siren-music-save-btn").on("click", function() {
    $(this).css("transform", "scale(1.2)");
    setTimeout(() => $(this).css("transform", "scale(1)"), 200);
    const oldSettings = getSirenSettings();
    const wasMsgEnabled = oldSettings.music?.styles?.msgEnabled;
    const mSettings = getSirenSettings().music;
    mSettings.enabled = $("#siren-music-enable").is(":checked");
    mSettings.floating_enabled = $("#siren-music-floating-enable").is(
      ":checked"
    );
    mSettings.auto_play = $("#siren-music-auto-play").is(":checked");
    mSettings.source = $("#siren-music-source").val();
    mSettings.mode = $("#siren-music-mode").val();
    if (typeof sirenStyleDraft !== "undefined" && sirenStyleDraft) {
      mSettings.styles = JSON.parse(JSON.stringify(sirenStyleDraft));
    }
    saveSirenSettings();
    if (typeof updatePlayerCustomStyle === "function") {
      updatePlayerCustomStyle(mSettings.styles);
    }
    if (typeof applyMusicBeautifyCss === "function") {
      applyMusicBeautifyCss();
    }
    const isMsgEnabledNow = $("#siren-style-msg-enable").is(":checked");
    if (wasMsgEnabled !== isMsgEnabledNow) {
      if (typeof updateSirenRegex === "function") {
        updateSirenRegex(mSettings.styles);
      }
    } else if (window.toastr) {
    }
  });
  $("#siren-echo-refresh-btn").on("click", () => {
    currentEchoPage = 1;
    renderEchoPage();
  });
  $("#siren-echo-prev").on("click", () => {
    currentEchoPage--;
    renderEchoPage();
  });
  $("#siren-echo-next").on("click", () => {
    currentEchoPage++;
    renderEchoPage();
  });
  $(document).off("click", ".siren-ext-echo-to-playlist").on("click", ".siren-ext-echo-to-playlist", function() {
    const musicObj = JSON.parse(
      decodeURIComponent(atob($(this).data("obj")))
    );
    const mSettings = getSirenSettings().music;
    const isExist = mSettings.playlist.some(
      (s) => s.name === musicObj.name && s.artist === musicObj.artist
    );
    if (!isExist) {
      musicObj.id = "echo_" + Date.now();
      mSettings.playlist.push(musicObj);
      saveSirenSettings(true);
      renderPlaylistPage();
      if (window.toastr)
        window.toastr.success(`\u5DF2\u5C06\u300A${musicObj.name}\u300B\u52A0\u5165\u6DF1\u6D77\u6B4C\u5355\uFF01`);
    } else {
      if (window.toastr) window.toastr.warning("\u8FD9\u9996\u6B4C\u5DF2\u7ECF\u5728\u6B4C\u5355\u91CC\u5566\uFF01");
    }
  });
  window.addEventListener("siren:echo_updated", () => {
    currentEchoPage = 1;
    renderEchoPage();
  });
  $(document).off("click", ".siren-ext-play-echo").on("click", ".siren-ext-play-echo", function() {
    const name = $(this).data("name");
    const artist = $(this).data("artist");
    const source = $("#siren-music-source").val() || "netease";
    const icon = $(this);
    icon.removeClass("fa-play").addClass("fa-spinner fa-spin");
    setTimeout(() => {
      icon.removeClass("fa-spinner fa-spin").addClass("fa-play");
    }, 1e3);
    if ($("#siren-music-mode").val() !== "smart") {
      $("#siren-music-mode").val("smart");
      $("#siren-music-save-btn").trigger("click");
    }
    const history = getEchoHistory();
    setPlaylistContext(history, { name, artist });
    if (window.toastr) window.toastr.info(`\u6B63\u5728\u91CD\u65B0\u6253\u635E: ${name}...`);
    playTargetMusic(name, artist, source);
  });
  const modal = $("#siren-music-search-modal");
  $("#siren-close-modal-btn, #siren-music-search-modal").on(
    "click",
    function(e) {
      if (e.target === this) modal.addClass("siren-ext-hidden");
    }
  );
  $(document).off("click", "#siren-music-search-btn").on("click", "#siren-music-search-btn", async () => {
    let title = ($("#siren-music-search-title").val() || "").trim();
    let artist = ($("#siren-music-search-artist").val() || "").trim();
    if (!title) {
      alert("\u6B4C\u66F2\u540D\u662F\u5FC5\u586B\u9879\u54E6\uFF01");
      return;
    }
    const source = $("#siren-music-source").val();
    title = title.replace(/\s+/g, " ");
    artist = artist.replace(/\s+/g, " ");
    const keyword = artist ? `${title} ${artist}` : title;
    const modal2 = $("#siren-music-search-modal");
    modal2.removeClass("siren-ext-hidden");
    const container = $("#siren-modal-results-container");
    container.html(
      `<div style="text-align:center; padding: 40px; color:#06b6d4;"><i class="fa-solid fa-spinner fa-spin fa-2x"></i><div style="margin-top:10px;">\u58F0\u7EB3\u626B\u63CF\u4E2D...</div></div>`
    );
    let results = await searchMusicList(keyword, source);
    if ((!results || results.length === 0) && artist) {
      console.log(`[Siren] \u7EC4\u5408\u641C\u7D22\u65E0\u7ED3\u679C\uFF0C\u964D\u7EA7\u4E3A\u4EC5\u641C\u7D22\u6B4C\u540D: ${title}`);
      results = await searchMusicList(title, source);
    }
    if (!results || results.length === 0) {
      container.html(
        `<div style="text-align:center; padding: 40px; color:#ef4444;"><i class="fa-solid fa-triangle-exclamation fa-2x"></i><div style="margin-top:10px;">\u672A\u80FD\u6253\u635E\u5230\u76EE\u6807\uFF0C\u8BF7\u5C1D\u8BD5\u66F4\u6362\u5173\u952E\u8BCD\u6216\u5728\u4E0A\u65B9\u66F4\u6362\u97F3\u4E50\u6E90\u3002</div></div>`
      );
      return;
    }
    let resultHtml = '<ul style="list-style:none; padding:0; margin:0;">';
    results.forEach((music) => {
      const artistName = Array.isArray(music.artist) ? music.artist.join("/") : music.artist;
      music.source = source;
      const b64Data = btoa(encodeURIComponent(JSON.stringify(music)));
      resultHtml += `
                <li style="display: flex; justify-content: space-between; align-items: center; padding: 12px; border-bottom: 1px solid #1e293b;">
                    <div style="flex:1; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; padding-right: 15px;">
                        <strong style="color: #f1f5f9; font-size: 1.05em;">${music.name}</strong>
                        <div style="color: #64748b; font-size: 0.85em; margin-top: 4px;">
                            <i class="fa-solid fa-user"></i> ${artistName} &nbsp;|&nbsp; 
                            <i class="fa-solid fa-compact-disc"></i> ${music.album || "\u672A\u77E5\u4E13\u8F91"}
                        </div>
                    </div>
                    <button class="siren-ext-btn siren-ext-add-exact-btn" data-obj="${b64Data}" style="background: #1e293b; color: #06b6d4; border: 1px solid #06b6d4;">
                        <i class="fa-solid fa-plus"></i> \u6DFB\u52A0
                    </button>
                </li>
            `;
    });
    resultHtml += "</ul>";
    container.html(resultHtml);
  });
  $(document).off("click", ".siren-ext-add-exact-btn").on("click", ".siren-ext-add-exact-btn", function() {
    const musicObj = JSON.parse(
      decodeURIComponent(atob($(this).data("obj")))
    );
    const mSettings = getSirenSettings().music;
    if (!mSettings.playlist.some((s) => s.id === musicObj.id)) {
      mSettings.playlist.push(musicObj);
      saveSirenSettings();
    }
    renderPlaylistPage();
    $("#siren-music-search-title").val("");
    $("#siren-music-search-artist").val("");
    $("#siren-music-search-modal").addClass("siren-ext-hidden");
  });
  $(document).off("click", ".siren-ext-del-music").on("click", ".siren-ext-del-music", function() {
    const b64Data = $(this).siblings("span").find(".siren-ext-music-data").data("obj");
    if (!b64Data) return;
    const musicObj = JSON.parse(decodeURIComponent(atob(b64Data)));
    const mSettings = getSirenSettings().music;
    mSettings.playlist = mSettings.playlist.filter(
      (s) => s.id !== musicObj.id
    );
    saveSirenSettings();
    renderPlaylistPage();
  });
  $(document).off("click", "#siren-btn-page-prev").on("click", "#siren-btn-page-prev", () => {
    currentPlaylistPage--;
    renderPlaylistPage();
  });
  $(document).off("click", "#siren-btn-page-next").on("click", "#siren-btn-page-next", () => {
    currentPlaylistPage++;
    renderPlaylistPage();
  });
  $("#siren-music-list").on("click", ".siren-ext-play-music", function() {
    const musicObj = JSON.parse(decodeURIComponent(atob($(this).data("obj"))));
    if ($("#siren-music-mode").val() !== "playlist") {
      $("#siren-music-mode").val("playlist");
      $("#siren-music-save-btn").trigger("click");
    }
    const mSettings = getSirenSettings().music;
    setPlaylistContext(mSettings.playlist, musicObj);
    playExactMusic(musicObj);
  });
  $("#siren-music-export-btn").on("click", function() {
    const playlist = getSirenSettings().music.playlist || [];
    const blob = new Blob([JSON.stringify(playlist, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "siren_playlist.json";
    a.click();
    URL.revokeObjectURL(url);
  });
  $("#siren-music-import-btn").on(
    "click",
    () => $("#siren-music-import-file").click()
  );
  $("#siren-music-import-file").on("change", function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(event) {
      try {
        const importedList = JSON.parse(event.target.result);
        if (Array.isArray(importedList)) {
          const mSettings = getSirenSettings().music;
          mSettings.playlist = mSettings.playlist.concat(importedList);
          saveSirenSettings();
          loadSettingsToUI();
          if (window.toastr) window.toastr.success("\u6536\u7EB3\u6D77\u87BA\uFF1A\u6B4C\u5355\u5BFC\u5165\u6210\u529F\uFF01");
        }
      } catch (err) {
        alert("\u89E3\u6790\u5931\u8D25\uFF0C\u8FD9\u597D\u50CF\u4E0D\u662F\u6709\u6548\u7684\u58F0\u7EB3\u6570\u636E(JSON)\u3002");
      }
      $(this).val("");
    };
    reader.readAsText(file);
  });
  $("#siren-style-player-mode").on("change", function() {
    if ($(this).val() === "custom") {
      $("#siren-style-player-css-wrapper").slideDown(200);
    } else {
      $("#siren-style-player-css-wrapper").slideUp(200);
    }
    updateStylePreview();
  });
  $("#siren-style-msg-enable").on("change", function() {
    sirenStyleDraft.msgEnabled = $(this).is(":checked");
    if (sirenStyleDraft.msgEnabled) {
      $("#siren-style-msg-html-wrapper").slideDown(200);
    } else {
      $("#siren-style-msg-html-wrapper").slideUp(200);
    }
    updateStylePreview();
  });
  $("#siren-style-player-select").on("change", function() {
    sirenStyleDraft.playerCurrent = $(this).val();
    updateTextareasState();
    updateStylePreview();
  });
  $("#siren-style-msg-select").on("change", function() {
    sirenStyleDraft.msgCurrent = $(this).val();
    updateTextareasState();
    updateStylePreview();
  });
  $("#siren-style-player-add-btn").on("click", function() {
    const name = prompt("\u4E3A\u65B0\u7684\u836F\u4E38\u6D82\u88C5\u547D\u540D\uFF1A", "\u81EA\u5B9A\u4E49\u6D82\u88C5");
    if (!name || !name.trim()) return;
    const id = "p_custom_" + Date.now();
    sirenStyleDraft.playerDict[id] = {
      name: name.trim(),
      code: "/* \u5728\u6B64\u8F93\u5165\u9488\u5BF9 #siren-music-player \u7684 CSS */\n",
      isReadonly: false
    };
    sirenStyleDraft.playerCurrent = id;
    refreshStyleDropdowns();
    updateStylePreview();
  });
  $("#siren-style-player-del-btn").on("click", function() {
    const id = sirenStyleDraft.playerCurrent;
    if (sirenStyleDraft.playerDict[id].isReadonly) {
      if (window.toastr)
        window.toastr.warning("\u539F\u751F\u6D82\u88C5\u53D7\u5230\u6DF1\u6D77\u529B\u91CF\u4FDD\u62A4\uFF0C\u65E0\u6CD5\u5220\u9664\uFF01");
      return;
    }
    const name = sirenStyleDraft.playerDict[id].name;
    if (confirm(
      `\u786E\u5B9A\u8981\u79FB\u9664\u6D82\u88C5 "${name}" \u5417\uFF1F
(\u6CE8\u610F\uFF1A\u8FD9\u53EA\u662F\u4ECE\u8349\u7A3F\u4E2D\u79FB\u9664\uFF0C\u70B9\u51FB\u53F3\u4E0A\u89D2\u4FDD\u5B58\u540E\u6B63\u5F0F\u751F\u6548)`
    )) {
      delete sirenStyleDraft.playerDict[id];
      sirenStyleDraft.playerCurrent = "default";
      refreshStyleDropdowns();
      updateStylePreview();
    }
  });
  $("#siren-style-msg-add-btn").on("click", function() {
    const name = prompt("\u4E3A\u65B0\u7684\u697C\u5C42\u5361\u7247\u547D\u540D\uFF1A", "\u81EA\u5B9A\u4E49\u5361\u7247");
    if (!name || !name.trim()) return;
    const id = "m_custom_" + Date.now();
    sirenStyleDraft.msgDict[id] = {
      name: name.trim(),
      code: "<div class='siren-msg-card-default'>\n  \u{1F3B5} {{title}} - {{artist}}\n</div>",
      isReadonly: false
    };
    sirenStyleDraft.msgCurrent = id;
    refreshStyleDropdowns();
    updateStylePreview();
  });
  $("#siren-style-msg-del-btn").on("click", function() {
    const id = sirenStyleDraft.msgCurrent;
    if (sirenStyleDraft.msgDict[id].isReadonly) {
      if (window.toastr)
        window.toastr.warning("\u539F\u751F\u5361\u7247\u53D7\u5230\u6DF1\u6D77\u529B\u91CF\u4FDD\u62A4\uFF0C\u65E0\u6CD5\u5220\u9664\uFF01");
      return;
    }
    const name = sirenStyleDraft.msgDict[id].name;
    if (confirm(
      `\u786E\u5B9A\u8981\u79FB\u9664\u5361\u7247 "${name}" \u5417\uFF1F
(\u6CE8\u610F\uFF1A\u8FD9\u53EA\u662F\u4ECE\u8349\u7A3F\u4E2D\u79FB\u9664\uFF0C\u70B9\u51FB\u53F3\u4E0A\u89D2\u4FDD\u5B58\u540E\u6B63\u5F0F\u751F\u6548)`
    )) {
      delete sirenStyleDraft.msgDict[id];
      sirenStyleDraft.msgCurrent = "default";
      refreshStyleDropdowns();
      updateStylePreview();
    }
  });
  $("#siren-style-player-css").on("input", function() {
    const id = sirenStyleDraft.playerCurrent;
    if (!sirenStyleDraft.playerDict[id].isReadonly) {
      sirenStyleDraft.playerDict[id].code = $(this).val();
      updateStylePreview();
    }
  });
  $("#siren-style-msg-html").on("input", function() {
    const id = sirenStyleDraft.msgCurrent;
    if (!sirenStyleDraft.msgDict[id].isReadonly) {
      sirenStyleDraft.msgDict[id].code = $(this).val();
      updateStylePreview();
    }
  });
  $("#siren-style-export-btn").on("click", function() {
    const blob = new Blob([JSON.stringify(sirenStyleDraft, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "siren_theme_coating.json";
    a.click();
    URL.revokeObjectURL(url);
  });
  $("#siren-style-import-btn").on(
    "click",
    () => $("#siren-style-import-file").click()
  );
  $("#siren-style-import-file").on("change", function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(event) {
      try {
        const importedStyles = JSON.parse(event.target.result);
        if (importedStyles.playerDict) {
          sirenStyleDraft = Object.assign({}, sirenStyleDraft, importedStyles);
          refreshStyleDropdowns();
          updateStylePreview();
          if (window.toastr)
            window.toastr.success("\u5E7B\u5F69\u8D1D\u58F3\uFF1A\u6D82\u88C5\u8349\u7A3F\u5DF2\u5BFC\u5165\uFF01(\u70B9\u51FB\u4FDD\u5B58\u540E\u751F\u6548)");
        }
      } catch (err) {
        alert("\u89E3\u6790\u5931\u8D25\u3002");
      }
      $(this).val("");
    };
    reader.readAsText(file);
  });
}
function refreshStyleDropdowns() {
  const pSelect = $("#siren-style-player-select").empty();
  const mSelect = $("#siren-style-msg-select").empty();
  Object.entries(sirenStyleDraft.playerDict).forEach(([key, obj]) => {
    pSelect.append(new Option(obj.name, key));
  });
  Object.entries(sirenStyleDraft.msgDict).forEach(([key, obj]) => {
    mSelect.append(new Option(obj.name, key));
  });
  pSelect.val(sirenStyleDraft.playerCurrent);
  mSelect.val(sirenStyleDraft.msgCurrent);
  updateTextareasState();
}
function updateTextareasState() {
  const pObj = sirenStyleDraft.playerDict[sirenStyleDraft.playerCurrent];
  if (pObj) {
    $("#siren-style-player-css").val(pObj.code).prop("disabled", !!pObj.isReadonly);
  }
  const mObj = sirenStyleDraft.msgDict[sirenStyleDraft.msgCurrent];
  if (mObj) {
    $("#siren-style-msg-html").val(mObj.code).prop("disabled", !!mObj.isReadonly);
  }
}
function updateStylePreview() {
  if (!sirenStyleDraft) return;
  const pKey = sirenStyleDraft.playerCurrent;
  let cssText = sirenStyleDraft.playerDict[pKey]?.code || "";
  cssText = cssText.replace(
    /#siren-music-player/g,
    "#siren-music-player-preview"
  );
  let styleTag = document.getElementById("siren-preview-dynamic-style");
  if (!styleTag) {
    styleTag = document.createElement("style");
    styleTag.id = "siren-preview-dynamic-style";
    document.head.appendChild(styleTag);
  }
  styleTag.innerHTML = cssText;
  const msgEnabled = sirenStyleDraft.msgEnabled;
  const renderBox = $("#siren-preview-msg-render").css(
    "pointer-events",
    "none"
  );
  if (msgEnabled) {
    const htmlTpl = `
        <div class="siren-music-card" tabindex="0">
            <div class="siren-music-cover-wrap">
                <i class="fa-solid fa-play siren-play-icon"></i>
            </div>
            <div class="siren-music-info-wrap">
                <span class="siren-title">Music of Siren</span>
                <span class="siren-artist">Siren</span>
            </div>
        </div>`;
    renderBox.html(htmlTpl).show();
    const mKey = sirenStyleDraft.msgCurrent;
    const msgCss = sirenStyleDraft.msgDict[mKey]?.code || "";
    if (msgCss) {
      const scopedCss = msgCss.replace(
        /\.siren-([a-zA-Z0-9_-]+)/g,
        "#siren-preview-msg-render :is(.siren-$1, .custom-siren-$1)"
      );
      styleTag.innerHTML += "\n" + scopedCss;
    }
  } else {
    renderBox.hide().empty();
  }
}

// scripts/tts.js
init_runtime();

// scripts/indextts.js
init_audio_engine();
init_runtime();
init_settings();
init_indextts_logic();
init_utils();
function getIndexTtsHtml() {
  return `
        <style>
            .siren-idx-search-item:hover { background: rgba(6, 182, 212, 0.2); color: #06b6d4 !important; }
            .siren-idx-search-results::-webkit-scrollbar { width: 4px; }
            .siren-idx-search-results::-webkit-scrollbar-thumb { background: #06b6d4; border-radius: 2px; }
            /* \u5F3A\u5236\u5BF9\u9F50\u4FEE\u590D */
            .siren-idx-align-fix { margin: 0 !important; height: 34px !important; box-sizing: border-box !important; }
            
            /* \u{1F447} \u65B0\u589E\uFF1A\u9690\u85CF\u6570\u5B57\u8F93\u5165\u6846\u7684\u4E0A\u4E0B\u7BAD\u5934\uFF0C\u4F7F\u5176\u53D8\u6210\u7EAF\u7CB9\u7684\u8F93\u5165\u6846 */
            .siren-idx-emo-weight-input::-webkit-outer-spin-button,
            .siren-idx-emo-weight-input::-webkit-inner-spin-button {
                -webkit-appearance: none;
                margin: 0;
            }
            .siren-idx-emo-weight-input[type=number] {
                -moz-appearance: textfield;
            }
            .siren-idx-param-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr); /* \u{1F4F1} \u624B\u673A\u7AEF\u9ED8\u8BA4\u4E00\u884C2\u4E2A */
    gap: 15px;
}
@media screen and (min-width: 768px) {
    .siren-idx-param-grid {
        grid-template-columns: repeat(3, 1fr); /* \u{1F4BB} \u5E73\u677F\u6216\u5C0F\u5C4F\u4E00\u884C3\u4E2A */
    }
}
@media screen and (min-width: 1024px) {
    .siren-idx-param-grid {
        grid-template-columns: repeat(4, 1fr); /* \u{1F5A5}\uFE0F \u5927\u5C4F\u7535\u8111\u4E00\u884C4\u4E2A */
    }
}

/* \u9AD8\u7EA7\u53C2\u6570\u72EC\u7ACB\u5361\u7247\u7F8E\u5316 */
.siren-idx-param-card {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 8px;
    background: rgba(30, 41, 59, 0.4);
    padding: 10px 12px;
    border-radius: 8px;
    border: 1px solid rgba(51, 65, 85, 0.5);
    transition: all 0.2s;
}
.siren-idx-param-card:hover {
    border-color: rgba(6, 182, 212, 0.4);
    background: rgba(30, 41, 59, 0.6);
}

/* \u9690\u85CF\u53C2\u6570\u6570\u5B57\u6846\u7684\u81EA\u5E26\u4E0A\u4E0B\u7BAD\u5934\uFF0C\u5E76\u7F8E\u5316 */
.siren-idx-param-num::-webkit-outer-spin-button,
.siren-idx-param-num::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
.siren-idx-param-num {
    -moz-appearance: textfield;
    width: 48px;
    text-align: center;
    padding: 2px 4px;
    font-family: monospace;
    font-size: 0.9em;
    color: #06b6d4 !important;
    background: rgba(15, 23, 42, 0.6) !important;
    border: 1px solid #334155 !important;
    border-radius: 4px;
} 
        </style>

        <div>
            <div style="margin-bottom: 20px;">
                <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 10px; align-items: center;">
                    <h4 style="margin: 0; color: #cbd5e1; font-size: 1.1em; white-space: nowrap; width: 85px;"><i class="fa-solid fa-link" style="margin-right: 5px;"></i>API Base</h4>
                    <div style="display: flex; gap: 5px; flex: 1; min-width: 200px; align-items: center;">
                        <input type="text" id="siren-indextts-api" class="siren-ext-input" value="http://127.0.0.1:7880" style="flex: 1; min-width: 0;">
        
                        <button id="siren-indextts-check" style="background:none; border:none; padding:5px; width:30px; flex-shrink:0; cursor:pointer;" title="\u5065\u5EB7\u68C0\u67E5">
                            <i class="fa-solid fa-heart-pulse" style="color:#ef4444; font-size:1.1em;"></i>
                        </button>
                        
                        <button id="siren-idx-select-files-btn" style="background:none; border:none; padding:5px; width:30px; flex-shrink:0; cursor:pointer;" title="\u9009\u62E9\u97F3\u9891\u6587\u4EF6">
                            <i class="fa-solid fa-cloud-arrow-up" style="color:#38bdf8; font-size:1.1em;"></i>
                        </button>
        
                        <input type="file" id="siren-idx-file-input" multiple accept=".wav,.mp3,.flac,.m4a,.ogg,audio/*" style="display: none;">
                    </div>
                </div>
                
                <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 10px; align-items: center;">
                    <h4 style="margin: 0; color: #cbd5e1; font-size: 1.1em; white-space: nowrap; width: 85px;"><i class="fa-solid fa-key" style="margin-right: 5px;"></i>API Key</h4>
                    <div style="display: flex; flex: 1; min-width: 200px;">
                        <input type="password" id="siren-indextts-apikey" class="siren-ext-input" placeholder="\u5982\u679C\u4E0D\u8BBE\u7F6E\u8BF7\u7559\u7A7A" style="flex: 1; min-width: 0;">
                    </div>
                </div>

                <div id="siren-idx-upload-staging-area" style="display: none; background: rgba(15, 23, 42, 0.6); padding: 12px; border-radius: 8px; border: 1px dashed rgba(56, 189, 248, 0.5);">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 15px;">
                        <div id="siren-idx-file-tags-container" style="flex: 1; display: flex; flex-wrap: wrap; gap: 8px; min-height: 34px;">
                        </div>
                        <button id="siren-idx-confirm-upload-btn" class="siren-ext-btn siren-ext-btn-primary" style="flex-shrink: 0; background: linear-gradient(135deg, #0284c7, #38bdf8);">
                            <i class="fa-solid fa-cloud-arrow-up"></i> \u786E\u8BA4\u4E0A\u4F20
                        </button>
                    </div>
                </div>
            </div>

            <hr class="siren-ext-divider" style="border-color: #334155;">

            <div style="margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <h4 style="margin: 0; color: #38bdf8; font-size: 1.1em;"><i class="fa-solid fa-users" style="margin-right: 5px;"></i>\u89D2\u8272\u5217\u8868</h4>
                    <button id="siren-idx-char-add" class="siren-ext-btn siren-ext-btn-secondary" style="padding: 2px 8px; font-size: 0.85em;"><i class="fa-solid fa-plus"></i> \u6DFB\u52A0</button>
                </div>
                
                <div id="siren-idx-char-list" style="background: rgba(0,0,0,0.3); padding: 8px; border-radius: 6px; margin-bottom: 10px; min-height: 50px;">
                    </div>
            </div>

            <hr class="siren-ext-divider" style="border-color: #334155;">

            <div style="margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <h4 style="margin: 0; color: #fb7185; font-size: 1.1em;"><i class="fa-solid fa-masks-theater" style="margin-right: 5px;"></i>\u60C5\u7EEA\u5217\u8868</h4>
                    <button id="siren-idx-emo-add" class="siren-ext-btn siren-ext-btn-secondary" style="padding: 2px 8px; font-size: 0.85em;"><i class="fa-solid fa-plus"></i> \u6DFB\u52A0</button>
                </div>
                
                <div id="siren-idx-emo-list" style="background: rgba(0,0,0,0.3); padding: 8px; border-radius: 6px; margin-bottom: 15px; min-height: 50px;">
                </div>
                <div class="siren-ext-setting-row siren-ext-flex-between" style="border: none; padding: 0;">
                    <div class="siren-ext-setting-label">
                        <label style="font-size: 1.1em; color: #cbd5e1;">\u5168\u5C40\u60C5\u7EEA\u6743\u91CD</label>
                    </div>
                    <div style="display: flex; align-items: center; gap: 10px; width: 50%;">
                        <input type="range" id="siren-idx-emo-weight" class="siren-ext-progress-bar" min="0" max="1.6" step="0.05" value="0.65" style="flex: 1; --progress: 40.625%;">
                        <span id="siren-idx-emo-weight-val" style="font-family: monospace; width: 35px; text-align: right; color: #06b6d4;">0.65</span>
                    </div>
                </div>
            </div>

            <div style="background: rgba(0,0,0,0.2); padding: 10px; border-radius: 6px; margin-bottom: 20px;">
            <h4 style="margin: 0 0 10px 0; color: #94a3b8; font-size: 1.1em;"><i class="fa-solid fa-wrench" style="margin-right: 5px;"></i>\u9AD8\u7EA7\u53C2\u6570</h4>

            <div class="siren-idx-param-grid">
    <div class="siren-idx-param-card" style="flex-direction: row; justify-content: space-between; align-items: center;">
        <label style="font-size: 0.85em; color: #cbd5e1; white-space: nowrap;">\u91C7\u6837\u6A21\u5F0F</label>
        <label class="siren-ext-switch" style="flex-shrink: 0;">
            <input type="checkbox" id="siren-idx-param-dosample" checked>
            <span class="siren-ext-slider"></span>
        </label>
    </div>
    
    <div class="siren-idx-param-card" style="flex-direction: row; justify-content: space-between; align-items: center;" title="\u4F5C\u7528\u4E8E\u81EA\u7136\u8BED\u8A00\u60C5\u7EEA\u63A7\u5236">
        <label style="font-size: 0.85em; color: #cbd5e1; white-space: nowrap;">\u60C5\u7EEA\u968F\u673A</label>
        <label class="siren-ext-switch" style="flex-shrink: 0;">
            <input type="checkbox" id="siren-idx-param-emorandom">
            <span class="siren-ext-slider"></span>
        </label>
    </div>

    <div class="siren-idx-param-card">
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <label style="font-size: 0.85em; color: #94a3b8;" title="20-600">\u5206\u53E5 Token</label>
            <input type="number" id="siren-idx-param-maxtxt-num" class="siren-idx-param-num" value="120" step="10" min="20" max="600">
        </div>
        <input type="range" id="siren-idx-param-maxtxt" class="siren-ext-slider-input" min="20" max="600" step="10" value="120" style="--theme-color: #06b6d4;">
    </div>

    <div class="siren-idx-param-card">
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <label style="font-size: 0.85em; color: #94a3b8;" title="0.1-2">\u6E29\u5EA6 (Temp)</label>
            <input type="number" id="siren-idx-param-temp-num" class="siren-idx-param-num" value="0.8" step="0.05" min="0.1" max="2.0">
        </div>
        <input type="range" id="siren-idx-param-temp" class="siren-ext-slider-input" min="0.1" max="2.0" step="0.05" value="0.8" style="--theme-color: #06b6d4;">
    </div>

    <div class="siren-idx-param-card">
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <label style="font-size: 0.85em; color: #94a3b8;" title="0-1">Top P</label>
            <input type="number" id="siren-idx-param-topp-num" class="siren-idx-param-num" value="0.8" step="0.05" min="0.0" max="1.0">
        </div>
        <input type="range" id="siren-idx-param-topp" class="siren-ext-slider-input" min="0" max="1" step="0.05" value="0.8" style="--theme-color: #06b6d4;">
    </div>

    <div class="siren-idx-param-card">
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <label style="font-size: 0.85em; color: #94a3b8;" title="0-100">Top K</label>
            <input type="number" id="siren-idx-param-topk-num" class="siren-idx-param-num" value="30" step="1" min="0" max="100">
        </div>
        <input type="range" id="siren-idx-param-topk" class="siren-ext-slider-input" min="0" max="100" step="1" value="30" style="--theme-color: #06b6d4;">
    </div>

    <div class="siren-idx-param-card">
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <label style="font-size: 0.85em; color: #94a3b8;" title="1-10">Num Beams</label>
            <input type="number" id="siren-idx-param-beams-num" class="siren-idx-param-num" value="3" step="1" min="1" max="10">
        </div>
        <input type="range" id="siren-idx-param-beams" class="siren-ext-slider-input" min="1" max="10" step="1" value="3" style="--theme-color: #06b6d4;">
    </div>

    <div class="siren-idx-param-card">
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <label style="font-size: 0.85em; color: #94a3b8;" title=">=1.0">\u91CD\u590D\u60E9\u7F5A</label>
            <input type="number" id="siren-idx-param-rep-num" class="siren-idx-param-num" value="10.0" step="0.1" min="1.0" max="20.0">
        </div>
        <input type="range" id="siren-idx-param-rep" class="siren-ext-slider-input" min="1" max="20" step="0.1" value="10" style="--theme-color: #06b6d4;">
    </div>

    <div class="siren-idx-param-card">
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <label style="font-size: 0.85em; color: #94a3b8;" title="-10 ~ 10">\u957F\u5EA6\u60E9\u7F5A</label>
            <input type="number" id="siren-idx-param-len-num" class="siren-idx-param-num" value="0.0" step="0.1" min="-10" max="10">
        </div>
        <input type="range" id="siren-idx-param-len" class="siren-ext-slider-input" min="-10" max="10" step="0.1" value="0" style="--theme-color: #06b6d4;">
    </div>

    <div class="siren-idx-param-card">
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <label style="font-size: 0.85em; color: #94a3b8;" title="50-1815">Mel Token</label>
            <input type="number" id="siren-idx-param-mel-num" class="siren-idx-param-num" value="1500" step="50" min="50" max="1815">
        </div>
        <input type="range" id="siren-idx-param-mel" class="siren-ext-slider-input" min="50" max="1815" step="50" value="1500" style="--theme-color: #06b6d4;">
    </div>
</div>
        </div>
            <button id="siren-idx-global-save" class="siren-ext-btn siren-ext-btn-primary" style="width: 100%; padding: 12px 0; justify-content: center; font-size: 1.05em; margin-top: 15px; background: linear-gradient(135deg, #0ea5e9, #10b981); border: none;">
                <i class="fa-solid fa-layer-group"></i> \u4FDD\u5B58\u5168\u90E8\u914D\u7F6E
            </button>

            <hr class="siren-ext-divider" style="border-color: #334155;">

            <div id="siren-idx-vector-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(6, 11, 23, 0.85); backdrop-filter: blur(4px); z-index: 10000; align-items: center; justify-content: center;">
                <div style="background: #0f172a; border: 1px solid #a855f7; border-radius: 12px; width: 450px; padding: 25px; box-shadow: 0 10px 30px rgba(0,0,0,0.8);">
                    <h3 style="margin: 0 0 15px 0; color: #d8b4fe; border-bottom: 1px solid #334155; padding-bottom: 10px;">
                        <i class="fa-solid fa-wave-square" style="margin-right:8px;"></i>\u60C5\u611F\u5411\u91CF\u8C03\u8282\u4EEA
                    </h3>

                    <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 20px; background: rgba(0,0,0,0.2); padding: 15px 20px; border-radius: 8px;">
                        
                        <div style="flex: 3;">
                            <div style="display: flex; justify-content: space-between; font-size: 0.9em; color: #cbd5e1; margin-bottom: 8px;">
                                <span>\u60C5\u611F\u6743\u91CD</span>
                                <span id="siren-idx-modal-weight-val" style="color: #06b6d4; font-family: monospace;">0.65</span>
                            </div>
                            <input type="range" id="siren-idx-modal-weight-slider" class="siren-ext-progress-bar" min="0" max="1.6" step="0.05" value="0.65" style="--progress: 40.625%; width: 100%;">
                        </div>

                        <div style="width: 1px; height: 35px; background: rgba(255, 255, 255, 0.1);"></div>
                        
                        <div style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px;">
                            <span style="font-size: 0.9em; color: #cbd5e1;">\u968F\u673A\u5316</span>
                            <label class="siren-ext-switch">
                                <input type="checkbox" id="siren-idx-modal-random-cb">
                                <span class="siren-ext-slider"></span>
                            </label>
                        </div>
                        
                    </div>
                    
                    <div id="siren-idx-vector-sliders" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px;">
                        </div>

                    <div style="display: flex; justify-content: flex-end; gap: 12px;">
                        <button id="siren-idx-vec-cancel" class="siren-ext-btn siren-ext-btn-secondary">\u53D6\u6D88</button>
                        <button id="siren-idx-vec-save" class="siren-ext-btn siren-ext-btn-primary" style="background: linear-gradient(135deg, #7e22ce, #a855f7); border: none; box-shadow: 0 2px 10px rgba(168,85,247,0.4);">
                            <i class="fa-solid fa-check"></i> \u786E\u8BA4\u4FDD\u5B58
                        </button>
                    </div>
                </div>
            </div>
            <hr class="siren-ext-divider" style="border-color: #334155;">

            <h4 style="color: #10b981; margin-bottom: 10px; font-size: 1.1em;"><i class="fa-solid fa-vial" style="margin-right: 5px;"></i> IndexTTS \u53D1\u97F3\u6D4B\u8BD5</h4>
            <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 6px; padding: 10px;">
                <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 10px;">
                    <select id="siren-idx-test-char" class="siren-ext-select" style="flex: 1; min-width: 160px;">
                        <option value="">(\u9009\u62E9\u89D2\u8272\u97F3\u8272)</option>
                    </select>
                    <select id="siren-idx-test-mood" class="siren-ext-select" style="flex: 1; min-width: 160px;">
                        <option value="0">\u4F7F\u7528\u53C2\u8003\u97F3\u9891\u60C5\u7EEA (\u9ED8\u8BA4)</option>
                        <option value="3">\u81EA\u7136\u8BED\u8A00\u63CF\u8FF0 (Text)</option> 
                    </select>
                </div>

                <div id="siren-idx-test-emo-text-wrapper" style="display: none; margin-bottom: 10px;">
                    <input type="text" id="siren-idx-test-emo-text" class="siren-ext-input" style="width: 100%;" placeholder="\u8F93\u5165\u60C5\u611F\u63CF\u8FF0\uFF0C\u4F8B\u5982\uFF1A\u5341\u5206\u60B2\u4F24\u5730\u3001\u5174\u594B\u5730\u3001\u5145\u6EE1\u8BF1\u60D1\u5730...">
                </div>
                <textarea id="siren-idx-test-text" class="siren-ext-textarea" rows="2" placeholder="\u8F93\u5165\u4E00\u53E5\u53F0\u8BCD\uFF0C\u6D4B\u8BD5 IndexTTS \u5F15\u64CE\u8F93\u51FA..."></textarea>
                
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                    <button id="siren-idx-test-generate" class="siren-ext-btn siren-ext-btn-primary" style="background: #10b981; border-color: #10b981;"><i class="fa-solid fa-bolt"></i> \u751F\u6210</button>
                    
                    <div id="siren-idx-test-preview" style="flex: 1; margin-left: 15px; display: flex; align-items: center; gap: 10px;">
                        <audio id="siren-idx-test-audio" controls style="height: 32px; flex: 1; display: none;"></audio>
                        
                        <a id="siren-idx-test-download" class="siren-ext-btn siren-ext-btn-secondary" style="display: none; padding: 4px 10px; text-decoration: none; color: #cbd5e1;" download="siren_test.wav" title="\u4E0B\u8F7D\u97F3\u9891\u6392\u67E5\u541E\u5B57">
                            <i class="fa-solid fa-download"></i>
                        </a>
                        
                        <span id="siren-idx-test-status" style="color: #64748b; font-size: 0.85em; white-space: nowrap;">\u7B49\u5F85\u751F\u6210...</span>
                    </div>
                </div>
            </div>
        </div>

        </div>
    `;
}
var charRowHtml = `
<div class="siren-ext-setting-row" style="display: flex; gap: 8px; border: none; padding: 0; margin-bottom: 5px; align-items: center;">
    
    <div style="flex: 2; display: flex; min-width: 0;">
        <input type="text" class="siren-ext-input siren-idx-align-fix" placeholder="\u89D2\u8272\u540D" style="width: 100%; min-width: 0;">
    </div>
    
    <div style="position: relative; flex: 3; display: flex; gap: 4px; min-width: 0;">
        <input type="text" class="siren-ext-input siren-idx-audio-input siren-idx-align-fix" placeholder="\u8F93\u5165\u5173\u952E\u5B57\u641C\u7D22" style="flex: 1; min-width: 0;">
        <div class="siren-idx-search-results" style="display: none; position: absolute; top: calc(100% + 4px); left: 0; width: 100%; max-height: 150px; overflow-y: auto; background: #1e293b; border: 1px solid #06b6d4; border-radius: 6px; z-index: 100;"></div>
    </div>
    
    <button class="siren-ext-btn siren-idx-row-del siren-idx-align-fix" style="background:none; border:none; color: #ef4444; flex-shrink: 0; padding: 0 5px; width: 30px;" title="\u5220\u9664">
        <i class="fa-solid fa-trash"></i>
    </button>
</div>
`;
var emoRowHtml = `
<div class="siren-ext-setting-row" style="display: flex; flex-direction: column; gap: 8px; border: 1px solid rgba(51, 65, 85, 0.4); border-radius: 6px; padding: 10px; margin-bottom: 10px;">
    <div style="display: flex; gap: 8px; align-items: center;">
        <input type="text" class="siren-ext-input siren-idx-align-fix" placeholder="\u60C5\u7EEA\u540D" style="flex: 1; min-width: 0;">
        <select class="siren-ext-select siren-idx-emo-method-select siren-idx-align-fix" style="flex: 1; min-width: 0;">
            <option value="audio" selected>\u53C2\u8003\u97F3\u9891</option>
            <option value="vector">\u60C5\u7EEA\u5411\u91CF</option>
        </select>
        <button class="siren-ext-btn siren-idx-row-del siren-idx-align-fix" style="background:none; border:none; color: #ef4444; flex-shrink: 0; padding: 0 5px; width: 30px;">
            <i class="fa-solid fa-trash"></i>
        </button>
    </div>
  
    <div class="siren-idx-audio-mode-ui" style="position: relative; display: flex; gap: 8px; min-width: 0;">
        <input type="text" class="siren-ext-input siren-idx-audio-input siren-idx-align-fix" placeholder="\u5173\u952E\u5B57\u641C\u7D22" style="flex: 1; min-width: 0;">
        <input type="number" class="siren-ext-input siren-idx-emo-weight-input siren-idx-align-fix" placeholder="\u6743\u91CD" min="0" max="1.6" step="0.05" style="width: 70px; flex-shrink: 0; text-align: center;" title="\u72EC\u7ACB\u60C5\u7EEA\u6743\u91CD (0-1.6)">
        <div class="siren-idx-search-results" style="display: none; position: absolute; top: calc(100% + 4px); left: 0; width: 100%; max-height: 150px; overflow-y: auto; background: #1e293b; border: 1px solid #06b6d4; border-radius: 6px; z-index: 100;"></div>
    </div>
    
    <div class="siren-idx-vector-mode-ui" style="display: none; gap: 8px; min-width: 0; align-items: center;">
        <button class="siren-ext-btn siren-idx-vec-open-btn siren-idx-align-fix" style="flex: 1; background: rgba(168, 85, 247, 0.1); border: 1px solid #a855f7; color: #d8b4fe; justify-content: center; min-width: 0;">
            <i class="fa-solid fa-sliders"></i> \u8C03\u6574 8 \u7EF4\u5411\u91CF
        </button>
        <input type="hidden" class="siren-idx-vec-data" value="[0,0,0,0,0,0,0,0]">
        <input type="hidden" class="siren-idx-vec-weight-hidden" value="">
        <input type="hidden" class="siren-idx-vec-random-hidden" value="false">
    </div>
</div>
`;
function loadCharacterTtsList() {
  const $charList = $("#siren-idx-char-list");
  $charList.empty();
  const context = SillyTavern.getContext();
  if (context && context.characterId !== void 0) {
    const charConfig = getCharacterTtsConfig(context.characterId);
    if (charConfig && charConfig.voices) {
      Object.entries(charConfig.voices).forEach(([charName, voicePath]) => {
        if (!voicePath) return;
        const $row = $(charRowHtml);
        $row.find('input[placeholder="\u89D2\u8272\u540D"]').val(charName);
        $row.find(".siren-idx-audio-input").val(voicePath);
        $charList.append($row);
      });
    }
  }
}
async function loadIndexTtsData() {
  const settings = getSirenSettings();
  const ttsSettings = settings?.tts?.indextts || {};
  $("#siren-indextts-api").val(ttsSettings.api_base || "http://127.0.0.1:7880");
  $("#siren-indextts-apikey").val(ttsSettings.api_key || "");
  $("#siren-idx-param-dosample").prop("checked", ttsSettings.do_sample ?? true);
  $("#siren-idx-param-emorandom").prop(
    "checked",
    ttsSettings.emo_random || false
  );
  $("#siren-idx-param-maxtxt").val(ttsSettings.max_text_tokens_per_segment ?? 120).trigger("input");
  $("#siren-idx-param-temp").val(ttsSettings.temperature ?? 0.8).trigger("input");
  $("#siren-idx-param-topp").val(ttsSettings.top_p ?? 0.8).trigger("input");
  $("#siren-idx-param-topk").val(ttsSettings.top_k ?? 30).trigger("input");
  $("#siren-idx-param-beams").val(ttsSettings.num_beams ?? 3).trigger("input");
  $("#siren-idx-param-rep").val(ttsSettings.repetition_penalty ?? 10).trigger("input");
  $("#siren-idx-param-len").val(ttsSettings.length_penalty ?? 0).trigger("input");
  $("#siren-idx-param-mel").val(ttsSettings.max_mel_tokens ?? 1500).trigger("input");
  $("#siren-idx-emo-weight").val(ttsSettings.emo_weight ?? 0.65).trigger("input");
  const $emoList = $("#siren-idx-emo-list");
  $emoList.empty();
  if (Array.isArray(ttsSettings.emotion_presets)) {
    ttsSettings.emotion_presets.forEach((emo) => {
      const $row = $(emoRowHtml);
      $row.find('input[placeholder="\u60C5\u7EEA\u540D"]').val(emo.name);
      if (emo.method === "vector") {
        $row.find(".siren-idx-emo-method-select").val("vector");
        $row.find(".siren-idx-audio-mode-ui").hide();
        $row.find(".siren-idx-vector-mode-ui").css("display", "flex");
        $row.find(".siren-idx-vec-data").val(JSON.stringify(emo.emo_vec || [0, 0, 0, 0, 0, 0, 0, 0]));
        $row.find(".siren-idx-vec-random-hidden").val(emo.emo_random ? "true" : "false");
        if (emo.emo_weight !== void 0 && emo.emo_weight !== null) {
          $row.find(".siren-idx-vec-weight-hidden").val(emo.emo_weight);
        } else {
          $row.find(".siren-idx-vec-weight-hidden").val("");
        }
      } else {
        $row.find(".siren-idx-emo-method-select").val("audio");
        $row.find(".siren-idx-audio-mode-ui .siren-idx-audio-input").val(emo.ref_audio || "");
        if (emo.emo_weight !== void 0 && emo.emo_weight !== null) {
          $row.find(".siren-idx-audio-mode-ui .siren-idx-emo-weight-input").val(emo.emo_weight);
        }
      }
      $emoList.append($row);
    });
  }
  loadCharacterTtsList();
  const $charList = $("#siren-idx-char-list");
  $charList.empty();
  const context = SillyTavern.getContext();
  if (context && context.characterId !== void 0) {
    const charConfig = getCharacterTtsConfig(context.characterId);
    if (charConfig && charConfig.voices) {
      Object.entries(charConfig.voices).forEach(([charName, voicePath]) => {
        const $row = $(charRowHtml);
        $row.find('input[placeholder="\u89D2\u8272\u540D"]').val(charName);
        $row.find(".siren-idx-audio-input").val(voicePath);
        $charList.append($row);
      });
    }
  }
}
function bindIndexTtsEvents() {
  $("#siren-idx-emo-weight").off("input").on("input", function() {
    const val = parseFloat($(this).val());
    $("#siren-idx-emo-weight-val").text(val.toFixed(2));
    $(this).css("--progress", `${val / 1.6 * 100}%`);
  });
  const paramSliders = [
    { id: "maxtxt", min: 20, max: 600 },
    { id: "temp", min: 0.1, max: 2 },
    { id: "topp", min: 0, max: 1 },
    { id: "topk", min: 0, max: 100 },
    { id: "beams", min: 1, max: 10 },
    { id: "rep", min: 1, max: 20 },
    { id: "len", min: -10, max: 10 },
    { id: "mel", min: 50, max: 1815 }
  ];
  paramSliders.forEach((param) => {
    const $range = $(`#siren-idx-param-${param.id}`);
    const $num = $(`#siren-idx-param-${param.id}-num`);
    const updateProgress = (val) => {
      const percent = (val - param.min) / (param.max - param.min) * 100;
      $range.css("--val", `${percent}%`);
    };
    $range.off("input.sirenSlider").on("input.sirenSlider", function() {
      const val = parseFloat($(this).val());
      $num.val(val);
      updateProgress(val);
    });
    $num.off("input.sirenNum").on("input.sirenNum", function() {
      let val = parseFloat($(this).val());
      if (isNaN(val)) return;
      if (val < param.min) val = param.min;
      if (val > param.max) val = param.max;
      $range.val(val);
      updateProgress(val);
    });
    $num.on("blur", function() {
      let val = parseFloat($(this).val());
      if (isNaN(val)) {
        $(this).val($range.val());
      }
    });
  });
  let searchTimeout = null;
  async function executeVoiceSearch($container, keyword) {
    const $results = $container.find(".siren-idx-search-results");
    const apiBase = $("#siren-indextts-api").val().replace(/\/+$/, "");
    const apiKey = $("#siren-indextts-apikey").val().trim();
    const headers = {};
    if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`;
    try {
      const res = await fetch(`${apiBase}/api/v1/voices`, { headers });
      if (!res.ok) throw new Error("API \u8BF7\u6C42\u5931\u8D25");
      const data = await res.json();
      const voices = data.voices || [];
      const filtered = keyword ? voices.filter((v) => v.toLowerCase().includes(keyword.toLowerCase())) : voices;
      $results.empty();
      if (filtered.length === 0) {
        $results.append(
          '<div style="padding: 10px; color: #94a3b8; font-size: 0.85em; text-align: center;">\u672A\u627E\u5230\u5339\u914D\u7684\u97F3\u9891</div>'
        );
      } else {
        filtered.forEach((voice) => {
          $results.append(
            `<div class="siren-idx-search-item" style="padding: 8px 12px; cursor: pointer; color: #e2e8f0; font-size: 0.9em; border-bottom: 1px solid #1e293b; transition: all 0.2s;">${voice}</div>`
          );
        });
      }
      $(".siren-idx-search-results").not($results).slideUp(200);
      $results.slideDown(200);
    } catch (err) {
      console.error("\u83B7\u53D6\u97F3\u9891\u5217\u8868\u5931\u8D25", err);
      $results.empty().append(
        '<div style="padding: 10px; color: #ef4444; font-size: 0.85em; text-align: center;">\u83B7\u53D6\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u670D\u52A1</div>'
      );
      $results.slideDown(200);
    }
  }
  $("#siren-tts-provider-settings").off("input", ".siren-idx-audio-input").on("input", ".siren-idx-audio-input", function() {
    const $container = $(this).parent();
    const keyword = $(this).val().trim();
    clearTimeout(searchTimeout);
    if (!keyword) {
      $container.find(".siren-idx-search-results").slideUp(200);
      return;
    }
    searchTimeout = setTimeout(() => {
      executeVoiceSearch($container, keyword);
    }, 400);
  });
  $("#siren-tts-provider-settings").off("focus", ".siren-idx-audio-input").on("focus", ".siren-idx-audio-input", function() {
    const $container = $(this).parent();
    const keyword = $(this).val().trim();
    executeVoiceSearch($container, keyword);
  });
  $("#siren-tts-provider-settings").off("click", ".siren-idx-search-item").on("click", ".siren-idx-search-item", function() {
    const $item = $(this);
    const text = $item.text();
    const $container = $item.closest(".siren-idx-search-results").parent();
    $container.find(".siren-idx-audio-input").val(text);
    $container.find(".siren-idx-search-results").slideUp(200);
  });
  $(document).off("click.sirenHideSearch").on("click.sirenHideSearch", function(e) {
    if (!$(e.target).closest(
      ".siren-idx-audio-search, .siren-idx-search-results"
    ).length) {
      $(".siren-idx-search-results").slideUp(200);
    }
  });
  function updateTestDropdowns2() {
    const $charSelect = $("#siren-idx-test-char");
    const $moodSelect = $("#siren-idx-test-mood");
    const currentChar = $charSelect.val();
    const currentMood = $moodSelect.val();
    $charSelect.empty().append('<option value="">(\u9009\u62E9\u89D2\u8272\u97F3\u8272)</option>');
    $moodSelect.empty().append(`
            <option value="0">\u4F7F\u7528\u97F3\u8272\u97F3\u9891\u60C5\u7EEA (\u9ED8\u8BA4)</option>
            <option value="3">\u81EA\u7136\u8BED\u8A00\u63CF\u8FF0 (Text)</option>
        `);
    $("#siren-idx-char-list .siren-ext-setting-row").each(function() {
      const name = $(this).find('input[placeholder="\u89D2\u8272\u540D"]').val().trim();
      const path = $(this).find(".siren-idx-audio-input").val().trim();
      if (name && path) {
        $charSelect.append(`<option value="${path}">${name}</option>`);
      }
    });
    $("#siren-idx-emo-list .siren-ext-setting-row").each(function() {
      const name = $(this).find('input[placeholder="\u60C5\u7EEA\u540D"]').val().trim();
      const method = $(this).find(".siren-idx-emo-method-select").val();
      let dataVal = "";
      let weightVal = 0.65;
      let randomVal = false;
      if (method === "audio") {
        dataVal = $(this).find(".siren-idx-audio-mode-ui .siren-idx-audio-input").val().trim();
        const w = $(this).find(".siren-idx-audio-mode-ui .siren-idx-emo-weight-input").val();
        weightVal = w === "" ? 0.65 : parseFloat(w);
      } else if (method === "vector") {
        dataVal = $(this).find(".siren-idx-vec-data").val();
        randomVal = $(this).find(".siren-idx-vec-random-hidden").val() === "true";
        const w = $(this).find(".siren-idx-vec-weight-hidden").val();
        weightVal = w === "" ? 0.65 : parseFloat(w);
      }
      if (name) {
        const optVal = JSON.stringify({
          method,
          data: dataVal,
          weight: weightVal,
          random: randomVal
        });
        $moodSelect.append(
          `<option value='${optVal}'>${name} (${method === "audio" ? "\u53C2\u8003\u97F3\u9891" : "\u60C5\u611F\u5411\u91CF"})</option>`
        );
      }
    });
    if (currentChar) $charSelect.val(currentChar);
    if (currentMood) $moodSelect.val(currentMood);
  }
  $("#siren-idx-test-char, #siren-idx-test-mood").on(
    "mousedown",
    updateTestDropdowns2
  );
  $("#siren-idx-test-mood").off("change").on("change", function() {
    const val = $(this).val();
    if (val === "3") {
      $("#siren-idx-test-emo-text-wrapper").slideDown(200);
    } else {
      $("#siren-idx-test-emo-text-wrapper").slideUp(200);
    }
  });
  $("#siren-idx-test-generate").off("click").on("click", async function() {
    const charAudioPath = $("#siren-idx-test-char").val();
    let text = $("#siren-idx-test-text").val().trim();
    const moodVal = $("#siren-idx-test-mood").val();
    if (!charAudioPath) return window.toastr?.warning("\u8BF7\u5148\u9009\u62E9\u89D2\u8272\u97F3\u8272\uFF01");
    if (!text) return window.toastr?.warning("\u8BF7\u8F93\u5165\u8981\u6D4B\u8BD5\u7684\u53F0\u8BCD\uFF01");
    const apiBase = $("#siren-indextts-api").val().replace(/\/+$/, "");
    const apiKey = $("#siren-indextts-apikey").val().trim();
    const $btn = $(this);
    const $status = $("#siren-idx-test-status");
    const $audio = $("#siren-idx-test-audio");
    try {
      $btn.html('<i class="fa-solid fa-spinner fa-spin"></i> \u751F\u6210\u4E2D...').prop("disabled", true);
      $status.text("\u6B63\u5728\u4E0E\u5C40\u57DF\u7F51\u670D\u52A1\u5668\u5408\u6210...").css("color", "#0ea5e9");
      $audio.hide();
      const payload = {
        text,
        prompt_audio: charAudioPath,
        clean_text: true,
        emo_weight: parseFloat($("#siren-idx-emo-weight").val()) || 0.65,
        emo_random: $("#siren-idx-param-emorandom").is(":checked"),
        do_sample: $("#siren-idx-param-dosample").is(":checked"),
        max_text_tokens_per_segment: parseInt($("#siren-idx-param-maxtxt").val()) || 120,
        temperature: parseFloat($("#siren-idx-param-temp").val()) || 0.8,
        top_p: parseFloat($("#siren-idx-param-topp").val()) || 0.8,
        top_k: parseInt($("#siren-idx-param-topk").val()) || 30,
        repetition_penalty: parseFloat($("#siren-idx-param-rep").val()) || 10,
        length_penalty: parseFloat($("#siren-idx-param-len").val()) || 0,
        max_mel_tokens: parseInt($("#siren-idx-param-mel").val()) || 1500
      };
      if (moodVal === "3") {
        payload.emo_control_method = 3;
        payload.emo_text = $("#siren-idx-test-emo-text").val().trim() || text;
      } else if (moodVal === "0") {
        payload.emo_control_method = 0;
      } else {
        try {
          const moodObj = JSON.parse(moodVal);
          if (moodObj.method === "audio") {
            payload.emo_control_method = 1;
            payload.emo_ref_path = moodObj.data;
            payload.emo_weight = moodObj.weight;
          } else if (moodObj.method === "vector") {
            payload.emo_control_method = 2;
            payload.emo_vec = JSON.parse(moodObj.data);
            payload.emo_random = moodObj.random;
            payload.emo_weight = moodObj.weight;
          }
        } catch (e) {
          payload.emo_control_method = 0;
        }
      }
      console.log(
        `\u{1F30A} [Siren Voice][IndexTTS Test] \u{1F680} \u51C6\u5907\u53D1\u9001\u6D4B\u8BD5\u8BF7\u6C42\uFF0CPayload:`,
        JSON.parse(JSON.stringify(payload))
        // 使用 JSON 序列化深拷贝，防止控制台显示的是被后续修改过的对象
      );
      const headers = { "Content-Type": "application/json" };
      if (apiKey) {
        headers["Authorization"] = `Bearer ${apiKey}`;
      }
      const res = await fetch(`${apiBase}/api/v1/tts/tasks`, {
        method: "POST",
        headers,
        // 使用带有鉴权信息的 Headers
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        if (res.status === 401) throw new Error("API Key \u65E0\u6548\u6216\u672A\u63D0\u4F9B");
        throw new Error(`HTTP Error: ${res.status}`);
      }
      const blob = await res.blob();
      const audioUrl = setAudioPreview($audio[0], blob);
      $audio.attr("src", audioUrl);
      $audio.show();
      const $downloadBtn = $("#siren-idx-test-download");
      $downloadBtn.attr("href", audioUrl);
      $downloadBtn.show();
      try {
        const ctx = initAudioEngine();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.value = 20;
        gain.gain.value = 0.01;
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.onended = () => {
          osc.disconnect();
          gain.disconnect();
        };
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      } catch (e) {
        console.warn("[Siren Voice] \u5524\u9192\u97F3\u9891\u786C\u4EF6\u5931\u8D25", e);
      }
      setTimeout(() => {
        $audio[0].play().catch((e) => console.warn("\u64AD\u653E\u5931\u8D25", e));
      }, 500);
      $status.text("\u751F\u6210\u6210\u529F\uFF01").css("color", "#10b981");
    } catch (err) {
      console.error("\u6D4B\u8BD5\u751F\u6210\u5931\u8D25:", err);
      $status.text(`\u751F\u6210\u5931\u8D25: ${err.message}`).css("color", "#ef4444");
    } finally {
      $btn.html('<i class="fa-solid fa-bolt"></i> \u751F\u6210').prop("disabled", false);
    }
  });
  $("#siren-indextts-check").off("click").on("click", async function(e) {
    e.preventDefault();
    const $btn = $(this);
    const apiBase = $("#siren-indextts-api").val().replace(/\/+$/, "");
    const apiKey = $("#siren-indextts-apikey").val().trim();
    const headers = {};
    if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`;
    try {
      $btn.html(
        '<i class="fa-solid fa-spinner fa-spin" style="color:#06b6d4;"></i>'
      );
      const res = await fetch(`${apiBase}/health`, { headers });
      if (res.ok) {
        if (window.toastr) window.toastr.success("IndexTTS \u5F15\u64CE\u8FDE\u63A5\u6210\u529F\uFF01");
        $btn.html('<i class="fa-solid fa-check" style="color:#10b981;"></i>');
      } else {
        throw new Error("\u72B6\u6001\u7801\u5F02\u5E38");
      }
    } catch (err) {
      console.error(err);
      if (window.toastr)
        window.toastr.error("\u65E0\u6CD5\u8FDE\u63A5\u5230 IndexTTS \u670D\u52A1\uFF0C\u8BF7\u68C0\u67E5\u7AEF\u53E3\u662F\u5426\u5F00\u542F\u3002");
      $btn.html(
        '<i class="fa-solid fa-heart-pulse" style="color:#ef4444;"></i>'
      );
    }
    setTimeout(() => {
      $btn.html(
        '<i class="fa-solid fa-heart-pulse" style="color:#ef4444;"></i>'
      );
    }, 2e3);
  });
  let pendingFiles = [];
  function renderStagingArea() {
    const $container = $("#siren-idx-file-tags-container");
    const $stagingArea = $("#siren-idx-upload-staging-area");
    $container.empty();
    if (pendingFiles.length === 0) {
      $stagingArea.slideUp(200);
      return;
    }
    pendingFiles.forEach((file, index) => {
      const tagHtml = `
                <div class="siren-idx-file-tag">
                    <i class="fa-solid fa-file-audio" style="color: #38bdf8;"></i>
                    <span>${file.name}</span>
                    <i class="fa-solid fa-xmark siren-idx-file-tag-remove" data-index="${index}" title="\u79FB\u9664"></i>
                </div>
            `;
      $container.append(tagHtml);
    });
    $stagingArea.slideDown(200);
  }
  $("#siren-idx-select-files-btn").off("click").on("click", function(e) {
    e.preventDefault();
    $("#siren-idx-file-input").click();
  });
  $("#siren-idx-file-input").off("change").on("change", function(e) {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    const existingNames = pendingFiles.map((f) => f.name);
    files.forEach((f) => {
      if (!existingNames.includes(f.name)) {
        pendingFiles.push(f);
      }
    });
    renderStagingArea();
    $(this).val("");
  });
  $("#siren-idx-file-tags-container").off("click", ".siren-idx-file-tag-remove").on("click", ".siren-idx-file-tag-remove", function() {
    const index = $(this).data("index");
    pendingFiles.splice(index, 1);
    renderStagingArea();
  });
  $("#siren-idx-confirm-upload-btn").off("click").on("click", async function() {
    if (pendingFiles.length === 0) return;
    const apiBase = $("#siren-indextts-api").val().replace(/\/+$/, "");
    const $btn = $(this);
    const originalHtml = $btn.html();
    $btn.html('<i class="fa-solid fa-spinner fa-spin"></i> \u4E0A\u4F20\u4E2D...').prop("disabled", true);
    $(".siren-idx-file-tag-remove").hide();
    let successCount = 0;
    let failCount = 0;
    for (let i = 0; i < pendingFiles.length; i++) {
      const file = pendingFiles[i];
      const formData = new FormData();
      formData.append("file", file);
      const apiKey = $("#siren-indextts-apikey").val().trim();
      const headers = {};
      if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`;
      try {
        const res = await fetch(`${apiBase}/api/v1/upload`, {
          method: "POST",
          headers,
          body: formData
        });
        if (res.ok) {
          successCount++;
        } else {
          failCount++;
        }
      } catch (err) {
        console.error(`\u4E0A\u4F20\u5F02\u5E38: ${file.name}`, err);
        failCount++;
      }
    }
    $btn.html(originalHtml).prop("disabled", false);
    if (window.toastr) {
      if (failCount === 0) {
        window.toastr.success(`\u6210\u529F\u4E0A\u4F20 ${successCount} \u4E2A\u97F3\u9891\uFF01`);
        pendingFiles = [];
        renderStagingArea();
      } else if (successCount > 0) {
        window.toastr.warning(
          `\u90E8\u5206\u6210\u529F\uFF1A\u6210\u529F ${successCount} \u4E2A\uFF0C\u5931\u8D25 ${failCount} \u4E2A\u3002`
        );
        pendingFiles = [];
        renderStagingArea();
      } else {
        window.toastr.error(
          "\u5168\u90E8\u4E0A\u4F20\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u63A7\u5236\u53F0\u62A5\u9519\u6216\u6587\u4EF6\u683C\u5F0F\u662F\u5426\u652F\u6301\uFF01"
        );
        $(".siren-idx-file-tag-remove").show();
      }
    }
  });
  $("#siren-idx-char-add").off("click").on("click", function() {
    $("#siren-idx-char-list").append(charRowHtml);
  });
  $("#siren-idx-emo-add").off("click").on("click", function() {
    $("#siren-idx-emo-list").append(emoRowHtml);
  });
  $("#siren-idx-emo-list").off("change", ".siren-idx-emo-method-select").on("change", ".siren-idx-emo-method-select", function() {
    const val = $(this).val();
    const $row = $(this).closest(".siren-ext-setting-row");
    if (val === "audio") {
      $row.find(".siren-idx-audio-mode-ui").show();
      $row.find(".siren-idx-vector-mode-ui").hide();
    } else {
      $row.find(".siren-idx-audio-mode-ui").hide();
      $row.find(".siren-idx-vector-mode-ui").css("display", "flex");
    }
  });
  const vectorLabels = [
    "\u7EF4\u5EA61 (\u559C\u60A6)",
    "\u7EF4\u5EA62 (\u6124\u6012)",
    "\u7EF4\u5EA63 (\u60B2\u4F24)",
    "\u7EF4\u5EA64 (\u6050\u60E7)",
    "\u7EF4\u5EA65 (\u538C\u6076)",
    "\u7EF4\u5EA66 (\u60CA\u8BB6)",
    "\u7EF4\u5EA67 (\u5E73\u9759)",
    "\u7EF4\u5EA68 (\u6FC0\u52A8)"
  ];
  let currentRowVectorInput = null;
  const $slidersContainer = $("#siren-idx-vector-sliders");
  $slidersContainer.empty();
  for (let i = 0; i < 8; i++) {
    $slidersContainer.append(`
            <div style="display: flex; flex-direction: column; gap: 5px;">
                <div style="display: flex; justify-content: space-between; font-size: 0.85em; color: #cbd5e1;">
                    <span>${vectorLabels[i]}</span>
                    <span id="siren-vec-val-${i}" style="color: #d8b4fe; font-family: monospace;">0.00</span>
                </div>
                <input type="range" class="siren-ext-progress-bar siren-vec-slider" data-idx="${i}" min="0" max="1.4" step="0.05" value="0" style="--progress: 0%;">
            </div>
        `);
  }
  $(".siren-vec-slider").on("input", function() {
    const val = parseFloat($(this).val());
    const idx = $(this).data("idx");
    $(`#siren-vec-val-${idx}`).text(val.toFixed(2));
    const percentage = val / 1.4 * 100;
    $(this).css("--progress", `${percentage}%`);
  });
  $("#siren-idx-modal-weight-slider").on("input", function() {
    const val = parseFloat($(this).val());
    $("#siren-idx-modal-weight-val").text(val.toFixed(2));
    $(this).css("--progress", `${val / 1.6 * 100}%`);
  });
  $("#siren-idx-emo-list").off("click", ".siren-idx-vec-open-btn").on("click", ".siren-idx-vec-open-btn", function() {
    const $hiddenInput = $(this).siblings(".siren-idx-vec-data");
    currentRowVectorInput = $hiddenInput;
    const savedWeight = $(this).siblings(".siren-idx-vec-weight-hidden").val();
    const isRandom = $(this).siblings(".siren-idx-vec-random-hidden").val() === "true";
    const displayWeight = savedWeight !== "" ? parseFloat(savedWeight) : parseFloat($("#siren-idx-emo-weight").val()) || 0.65;
    $("#siren-idx-modal-weight-slider").val(displayWeight).trigger("input");
    $("#siren-idx-modal-random-cb").prop("checked", isRandom);
    try {
      const dataArr = JSON.parse($hiddenInput.val());
      $(".siren-vec-slider").each(function() {
        const idx = $(this).data("idx");
        const val = parseFloat(dataArr[idx]) || 0;
        $(this).val(val).trigger("input");
      });
    } catch (e) {
      console.warn("\u89E3\u6790\u5411\u91CF\u6570\u636E\u51FA\u9519\uFF0C\u91CD\u7F6E\u4E3A 0");
    }
    $("#siren-idx-vector-modal").css("display", "flex");
  });
  $("#siren-idx-vec-cancel").on("click", function() {
    $("#siren-idx-vector-modal").hide();
    currentRowVectorInput = null;
  });
  $("#siren-idx-vec-save").on("click", function() {
    if (!currentRowVectorInput) return;
    const newVec = [];
    $(".siren-vec-slider").each(function() {
      newVec.push(parseFloat($(this).val()));
    });
    currentRowVectorInput.val(JSON.stringify(newVec));
    currentRowVectorInput.siblings(".siren-idx-vec-weight-hidden").val($("#siren-idx-modal-weight-slider").val());
    currentRowVectorInput.siblings(".siren-idx-vec-random-hidden").val($("#siren-idx-modal-random-cb").is(":checked") ? "true" : "false");
    $("#siren-idx-vector-modal").hide();
    currentRowVectorInput = null;
    if (window.toastr) window.toastr.success("\u60C5\u611F\u5411\u91CF\u5DF2\u6682\u5B58\u3002");
  });
  $("#siren-idx-char-list, #siren-idx-emo-list").off("click", ".siren-idx-row-del").on("click", ".siren-idx-row-del", function() {
    $(this).closest(".siren-ext-setting-row").remove();
  });
  const performUnifiedSave = async (isSilent = false) => {
    const pMaxTxt = parseInt($("#siren-idx-param-maxtxt").val());
    const pTemp = parseFloat($("#siren-idx-param-temp").val());
    const pTopp = parseFloat($("#siren-idx-param-topp").val());
    const pTopk = parseInt($("#siren-idx-param-topk").val());
    const pBeams = parseInt($("#siren-idx-param-beams").val());
    const pRep = parseFloat($("#siren-idx-param-rep").val());
    const pLen = parseFloat($("#siren-idx-param-len").val());
    const pMel = parseInt($("#siren-idx-param-mel").val());
    if (isNaN(pMaxTxt) || pMaxTxt < 20 || pMaxTxt > 600)
      return window.toastr?.warning("\u5206\u53E5\u6700\u5927 Token \u8303\u56F4\u5E94\u4E3A 20-600");
    if (isNaN(pTemp) || pTemp < 0.1 || pTemp > 2)
      return window.toastr?.warning("\u6E29\u5EA6 (Temperature) \u8303\u56F4\u5E94\u4E3A 0.1-2.0");
    if (isNaN(pTopp) || pTopp < 0 || pTopp > 1)
      return window.toastr?.warning("Top P \u8303\u56F4\u5E94\u4E3A 0-1");
    if (isNaN(pTopk) || pTopk < 0 || pTopk > 100)
      return window.toastr?.warning("Top K \u8303\u56F4\u5E94\u4E3A 0-100");
    if (isNaN(pBeams) || pBeams < 1 || pBeams > 10)
      return window.toastr?.warning("Num Beams \u8303\u56F4\u5E94\u4E3A 1-10");
    if (isNaN(pRep) || pRep < 1)
      return window.toastr?.warning(
        "\u91CD\u590D\u60E9\u7F5A (Repetition Penalty) \u63A8\u8350 >= 1.0"
      );
    if (isNaN(pMel) || pMel < 50 || pMel > 1815)
      return window.toastr?.warning("max_mel_tokens \u8303\u56F4\u5E94\u4E3A 50-1815");
    const voiceMap = {};
    $("#siren-idx-char-list .siren-ext-setting-row").each(function() {
      const charName = $(this).find('input[placeholder="\u89D2\u8272\u540D"]').val().trim();
      const voicePath = $(this).find(".siren-idx-audio-input").val().trim();
      if (charName && voicePath) {
        voiceMap[charName] = voicePath;
      }
    });
    let isCharSaved = false;
    const context2 = SillyTavern.getContext();
    if (context2 && context2.characterId !== void 0 && context2.characterId !== null) {
      const charExt = context2.characters[context2.characterId].data.extensions?.siren_voice_tts || {};
      const oldVoices = charExt.voices || {};
      for (const oldChar of Object.keys(oldVoices)) {
        if (voiceMap[oldChar] === void 0) {
          voiceMap[oldChar] = null;
        }
      }
      try {
        await saveToCharacterCard(
          "siren_voice_tts",
          {
            voices: voiceMap,
            updated_at: Date.now()
          },
          true
        );
        isCharSaved = true;
      } catch (e) {
        console.warn("[Siren Voice] \u89D2\u8272\u5361\u97F3\u8272\u4FDD\u5B58\u5931\u8D25", e);
      }
    }
    const settings = getSirenSettings();
    const tts = settings.tts.indextts;
    tts.api_base = $("#siren-indextts-api").val().trim();
    tts.api_key = $("#siren-indextts-apikey").val().trim();
    tts.emo_weight = parseFloat($("#siren-idx-emo-weight").val()) || 0.65;
    tts.do_sample = $("#siren-idx-param-dosample").is(":checked");
    tts.emo_random = $("#siren-idx-param-emorandom").is(":checked");
    tts.max_text_tokens_per_segment = pMaxTxt;
    tts.temperature = pTemp;
    tts.top_p = pTopp;
    tts.top_k = pTopk;
    tts.num_beams = pBeams;
    tts.repetition_penalty = pRep;
    tts.length_penalty = pLen;
    tts.max_mel_tokens = pMel;
    const emotionPresets = [];
    $("#siren-idx-emo-list .siren-ext-setting-row").each(function() {
      const name = $(this).find('input[placeholder="\u60C5\u7EEA\u540D"]').val().trim();
      if (!name) return;
      const method = $(this).find(".siren-idx-emo-method-select").val();
      const preset = {
        id: `emo_${Date.now()}_${Math.floor(Math.random() * 1e3)}`,
        name,
        method
      };
      if (method === "audio") {
        preset.ref_audio = $(this).find(".siren-idx-audio-mode-ui .siren-idx-audio-input").val().trim();
        const weightVal = $(this).find(".siren-idx-audio-mode-ui .siren-idx-emo-weight-input").val();
        preset.emo_weight = weightVal === "" ? null : parseFloat(weightVal);
        preset.emo_vec = null;
        preset.emo_random = false;
      } else {
        try {
          preset.emo_vec = JSON.parse(
            $(this).find(".siren-idx-vec-data").val()
          );
        } catch (e) {
          preset.emo_vec = [0, 0, 0, 0, 0, 0, 0, 0];
        }
        preset.emo_random = $(this).find(".siren-idx-vec-random-hidden").val() === "true";
        const weightVal = $(this).find(".siren-idx-vec-weight-hidden").val();
        preset.emo_weight = weightVal === "" ? null : parseFloat(weightVal);
        preset.ref_audio = null;
      }
      emotionPresets.push(preset);
    });
    tts.emotion_presets = emotionPresets;
    saveSirenSettings(true);
    if (isSilent) {
    } else {
      if (window.toastr) {
        if (isCharSaved) {
          window.toastr.success(
            "IndexTTS: \u914D\u7F6E\u5DF2\u4FDD\u5B58\uFF0C\u5DF2\u81EA\u52A8\u5207\u6362\u5E76\u540C\u6B65\u4E16\u754C\u4E66\uFF01"
          );
        } else {
          window.toastr.success(
            "IndexTTS: \u5168\u5C40\u53C2\u6570\u5DF2\u4FDD\u5B58\u5E76\u5207\u6362 (\u5F53\u524D\u672A\u9009\u4E2D\u89D2\u8272)"
          );
        }
      }
      const currentSettings = getSirenSettings();
      currentSettings.tts.provider = "indextts";
      currentSettings.tts.enabled = true;
      saveSirenSettings(true);
      await syncTtsWorldbookEntries("indextts", true);
    }
  };
  $("#siren-idx-global-save").off("click.indexTtsSave").on("click.indexTtsSave", async function(e, isSilent = false) {
    await performUnifiedSave(isSilent);
  });
  const context = SillyTavern.getContext();
  if (context && context.eventSource) {
    context.eventSource.removeListener("chat_id_changed", loadCharacterTtsList);
    context.eventSource.on("chat_id_changed", loadCharacterTtsList);
  }
  loadIndexTtsData();
}

// scripts/minimax.js
init_runtime();
init_settings();
init_minimax_logic();
init_utils();
var currentEditingRow = null;
var availableVoices = [];
function getDefaultMinimaxAdvData() {
  return {
    speed: 1,
    vol: 1,
    pitch: 0,
    modify_pitch: 0,
    modify_intensity: 0,
    modify_timbre: 0,
    sound_effect: "none"
  };
}
function getMinimaxHtml() {
  return `
    <div id="siren-minimax-wrapper">
        <div style="background: rgba(15, 23, 42, 0.4); border: 1px solid #334155; border-radius: 6px; padding: 15px; display: flex; flex-direction: column; gap: 12px;">
            <h4 style="color: #06b6d4; font-size: 1.1em; margin: 0;">
                <i class="fa-solid fa-server" style="margin-right: 5px;"></i> MiniMax API \u914D\u7F6E
            </h4>

            <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 10px;">
                <div class="siren-ext-setting-label" style="white-space: nowrap; font-size: 0.95em; color: #cbd5e1;">API \u6765\u6E90</div>
                <select id="siren-mm-region" class="siren-ext-select" style="flex: 1; min-width: 200px;">
                    <option value="cn">\u56FD\u5185\u7248 (api.minimaxi.com)</option>
                    <option value="global">\u56FD\u9645\u7248 (api.minimax.io)</option>
                </select>
            </div>
    
            <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 10px;">
                <div class="siren-ext-setting-label" style="white-space: nowrap; font-size: 0.95em; color: #cbd5e1;">API Key</div>
                <input type="password" id="siren-mm-apikey" class="siren-ext-input" style="flex: 1; min-width: 200px;" placeholder="\u8F93\u5165 MiniMax API Key">
            </div>
    
            <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 10px;">
                <div class="siren-ext-setting-label" style="white-space: nowrap; font-size: 0.95em; color: #cbd5e1;">\u5408\u6210\u6A21\u578B</div>
                <select id="siren-mm-model" class="siren-ext-select" style="flex: 1; min-width: 200px;">
                    <option value="speech-2.8-hd">speech-2.8-hd</option>
                    <option value="speech-2.8-turbo">speech-2.8-turbo</option>
                    <option value="speech-2.6-hd">speech-2.6-hd</option>
                    <option value="speech-2.6-turbo">speech-2.6-turbo</option>
                    <option value="speech-02-hd">speech-02-hd</option>
                    <option value="speech-02-turbo">speech-02-turbo</option>
                    <option value="speech-01-hd">speech-01-hd</option>
                    <option value="speech-01-turbo">speech-01-turbo</option>
                </select>
            </div>
    
            <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 10px; border-top: 1px dashed rgba(255,255,255,0.1); padding-top: 10px;">
                <div class="siren-ext-setting-label">
                    <label style="color:#cbd5e1; font-size: 0.95em;">\u6587\u672C\u667A\u80FD\u89C4\u8303\u5316</label>
                    <small style="display:block; color:#64748b; font-size: 0.85em; margin-top: 2px;">\u4F18\u5316\u6570\u5B57\u3001\u65E5\u671F\u7684\u6717\u8BFB\uFF0C\u4F46\u4F1A\u7565\u5FAE\u589E\u52A0\u5EF6\u8FDF</small>
                </div>
                <label class="siren-ext-switch" style="flex-shrink: 0;">
                    <input type="checkbox" id="siren-mm-norm">
                    <span class="siren-ext-slider"></span>
                </label>
            </div>
        </div>

        <h4 style="color: #a78bfa; font-size: 1.1em; margin-bottom: 10px; margin-top: 20px; border-bottom: 1px solid rgba(168, 85, 247, 0.3); padding-bottom: 5px; display: flex; justify-content: space-between; align-items: center;">
            <span><i class="fa-solid fa-users-viewfinder" style="margin-right: 5px;"></i> \u89D2\u8272\u97F3\u8272\u914D\u7F6E</span>
            <div>
                <button id="siren-mm-fetch-voices" class="siren-ext-btn siren-ext-btn-primary" style="padding: 4px 10px; font-size: 0.9em; margin-right: 8px; background: #f59e0b; border-color: #d97706; color: #ffffff; box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);">
                    <i class="fa-solid fa-cloud-arrow-down"></i> \u540C\u6B65\u97F3\u8272
                </button>
            </div>
        </h4>
        
        <div style="background: rgba(0,0,0,0.2); padding: 10px; border-radius: 6px; border: 1px solid #334155;">
            <div id="siren-mm-char-list" style="display: flex; flex-direction: column; gap: 4px;">
            </div>
            
            <div style="margin-top: 10px; text-align: center;">
                <button id="siren-mm-char-add" class="siren-ext-btn siren-ext-btn-secondary" style="width: 100%; border: 1px dashed #64748b; color: #94a3b8; background: transparent;">
                    <i class="fa-solid fa-plus"></i> \u65B0\u589E\u89D2\u8272\u97F3\u8272\u6620\u5C04
                </button>
            </div>
            <div style="margin-top: 15px;">
                <button id="siren-mm-save-all" class="siren-ext-btn siren-ext-btn-primary" style="width: 100%; padding: 12px 0; justify-content: center; font-size: 1.05em; margin-top: 10px; background: #0284c7; border-color: #0284c7; color: #fff;">
                    <i class="fa-solid fa-floppy-disk"></i> \u4FDD\u5B58\u5168\u90E8\u8BBE\u7F6E
                </button>
            </div>
        </div>

        <h4 style="color: #f59e0b; margin-bottom: 10px; font-size: 1.1em; margin-top: 25px;"><i class="fa-solid fa-microphone-lines" style="margin-right: 5px;"></i> \u97F3\u8272\u514B\u9686 </h4>
        <div style="background: rgba(0,0,0,0.2); border: 1px solid #334155; border-radius: 6px; padding: 15px; display: flex; flex-direction: column; gap: 10px;">
            
<div class="siren-ext-flex-between">
    <div style="flex: 1;">
        <label style="color:#cbd5e1; font-size:0.9em;">\u590D\u523B\u97F3\u9891 (\u9700 10s-5m)</label>
        <div style="display: flex; flex-wrap: wrap; gap: 5px; margin-top: 5px;">
            <input type="file" id="siren-mm-clone-file" accept=".mp3,.m4a,.wav" style="display: none;">
            <button id="siren-mm-btn-choose-clone" class="siren-ext-btn siren-ext-btn-secondary" style="flex: 1; min-width: 110px; white-space: nowrap;"><i class="fa-solid fa-folder-open"></i> \u9009\u62E9\u6587\u4EF6</button>
            <button id="siren-mm-btn-up-clone" class="siren-ext-btn siren-ext-btn-primary" style="flex: 1; min-width: 110px; white-space: nowrap;"><i class="fa-solid fa-cloud-arrow-up"></i> \u4E0A\u4F20</button>
            <input type="text" id="siren-mm-clone-id" class="siren-ext-input" readonly placeholder="\u4E0A\u4F20\u540E\u81EA\u52A8\u586B\u5165 File ID" style="width: 100%; margin-top: 5px; background: rgba(0,0,0,0.3);">
        </div>
        <div id="siren-mm-clone-filename" style="font-size: 0.8em; color: #64748b; margin-top: 4px;">\u672A\u9009\u62E9\u6587\u4EF6</div>
    </div>
</div>

<div class="siren-ext-flex-between">
    <div style="flex: 1;">
        <label style="color:#cbd5e1; font-size:0.9em;">\u793A\u4F8B\u97F3\u9891 (\u53EF\u9009\uFF0C\u9700 &lt; 8s)</label>
        <div style="display: flex; flex-wrap: wrap; gap: 5px; margin-top: 5px;">
            <input type="file" id="siren-mm-prompt-file" accept=".mp3,.m4a,.wav" style="display: none;">
            <button id="siren-mm-btn-choose-prompt" class="siren-ext-btn siren-ext-btn-secondary" style="flex: 1; min-width: 110px; white-space: nowrap;"><i class="fa-solid fa-folder-open"></i> \u9009\u62E9\u6587\u4EF6</button>
            <button id="siren-mm-btn-up-prompt" class="siren-ext-btn siren-ext-btn-primary" style="flex: 1; min-width: 110px; white-space: nowrap;"><i class="fa-solid fa-cloud-arrow-up"></i> \u4E0A\u4F20</button>
            <input type="text" id="siren-mm-prompt-id" class="siren-ext-input" readonly placeholder="\u4E0A\u4F20\u540E\u81EA\u52A8\u586B\u5165 File ID" style="width: 100%; margin-top: 5px; background: rgba(0,0,0,0.3);">
        </div>
        <div id="siren-mm-prompt-filename" style="font-size: 0.8em; color: #64748b; margin-top: 4px;">\u672A\u9009\u62E9\u6587\u4EF6</div>
    </div>
</div>

<div style="display: flex; flex-direction: column; gap: 15px;">
    <div>
        <label style="color:#cbd5e1; font-size:0.9em; display:block; margin-bottom:5px;">\u793A\u4F8B\u97F3\u9891\u6587\u672C</label>
        <input type="text" id="siren-mm-prompt-text" class="siren-ext-input" placeholder="\u5982\u4E0A\u4F20\u793A\u4F8B\u97F3\u9891\uFF0C\u5219\u5FC5\u987B\u586B\u5165\u5BF9\u5E94\u6587\u672C\uFF08\u5E26\u6807\u70B9\uFF09" style="width: 100%;">
    </div>
    <div>
        <label style="color:#f59e0b; font-size:0.9em; display:block; margin-bottom:5px;">Voice ID <span style="color:#ef4444;">*</span></label>
        <input type="text" id="siren-mm-clone-vid" class="siren-ext-input" placeholder="\u5141\u8BB8\u6570\u5B57\u3001\u5B57\u6BCD\u3001-\u3001_" style="width: 100%; border-color: rgba(245, 158, 11, 0.5);">
    </div>
</div>

            <div style="display: flex; flex-direction: column; gap: 5px;">
                <label style="color:#cbd5e1; font-size:0.9em;">\u8BD5\u542C\u6587\u672C <span style="color:#ef4444;">*</span></label>
                <textarea id="siren-mm-clone-text" class="siren-ext-textarea" rows="2" placeholder="\u8F93\u5165\u4E00\u6BB5\u8BD5\u542C\u6587\u672C\uFF08\u5C06\u5728\u6210\u529F\u540E\u8FD4\u56DE\u6717\u8BFB\u97F3\u9891\uFF09..."></textarea>
            </div>

            <div class="siren-ext-setting-row siren-ext-flex-between" style="border: none; padding: 0; background: transparent;">
                <div class="siren-ext-setting-label"><label>\u97F3\u9891\u964D\u566A</label></div>
                <label class="siren-ext-switch">
                    <input type="checkbox" id="siren-mm-clone-nr">
                    <span class="siren-ext-slider"></span>
                </label>
            </div>

            <div>
                <div style="color: #f59e0b; font-size: 0.85em; margin-bottom: 5px; font-weight: bold;">
                    <i class="fa-solid fa-lightbulb"></i> \u63D0\u793A\uFF1A\u5982\u679C\u62A5\u9519\uFF0C\u8BF7\u786E\u8BA4\u4E0A\u4F20\u7684\u97F3\u9891\u6587\u4EF6\u957F\u5EA6\u7B26\u5408\u8981\u6C42\uFF0C\u6CE8\u610FVoice ID\u683C\u5F0F\uFF0C\u4EE5\u53CA\u4E0D\u8981\u592A\u77ED\uFF01
                </div>
                <div style="color: #ef4444; font-size: 0.8em; margin-bottom: 10px;">
                    <i class="fa-solid fa-triangle-exclamation"></i> \u6CE8\u610F\uFF1A\u514B\u9686\u5E76\u8BD5\u542C\u6EE1\u610F\u540E\uFF0C\u8BF7\u5FC5\u987B\u6B63\u5F0F\u8BF7\u6C42\uFF08\u53D1\u97F3\u6D4B\u8BD5/\u5B9E\u9645\u4F7F\u7528\uFF09\u81F3\u5C11\u4E00\u6B21\u590D\u523B\u7684\u97F3\u8272\uFF0C\u5426\u5219\u5C06\u4F1A\u5728 7 \u5929\u5185\u81EA\u52A8\u5220\u9664\uFF01
                </div>
                
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <button id="siren-mm-btn-doclone" class="siren-ext-btn siren-ext-btn-primary" style="background: #a855f7; border: 1px solid #9333ea; color: #ffffff; box-shadow: 0 4px 12px rgba(168, 85, 247, 0.3); font-weight: bold; flex-shrink: 0; margin-top: 2px;">
                        <i class="fa-solid fa-wand-magic-sparkles"></i> \u7ACB\u5373\u514B\u9686
                    </button>
                    
                    <div id="siren-mm-clone-status-box" style="flex: 1; margin-left: 15px; display: flex; align-items: center; gap: 10px; min-width: 0;">
                        <audio id="siren-mm-clone-audio" controls style="height: 32px; flex: 1; display: none;"></audio>
                        <span id="siren-mm-clone-status" style="color: #64748b; font-size: 0.85em; white-space: normal; word-break: break-word; line-height: 1.4;"></span>
                    </div>
                </div>
            </div>

        <h4 style="color: #10b981; margin-bottom: 10px; font-size: 1.1em; margin-top: 25px;"><i class="fa-solid fa-vial" style="margin-right: 5px;"></i> MiniMax \u53D1\u97F3\u6D4B\u8BD5</h4>
        <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 6px; padding: 10px;">
            
            <div style="color: #94a3b8; font-size: 0.85em; margin-bottom: 12px; line-height: 1.5;">
                <i class="fa-solid fa-circle-info" style="margin-right: 4px; color: #10b981;"></i> \u4E00\u822C\u65E0\u9700\u624B\u52A8\u6307\u5B9A\u60C5\u7EEA\uFF0C\u6A21\u578B\u4F1A\u6839\u636E\u8F93\u5165\u6587\u672C\u81EA\u52A8\u5339\u914D\u3002<br>
                <span style="margin-left: 18px;"><b>\u751F\u52A8 (fluent)</b>\u3001<b>\u4F4E\u8BED (whisper)</b> \u4EC5\u5BF9 <span style="color: #cbd5e1;">speech-2.6-turbo / hd</span> \u6A21\u578B\u751F\u6548\u3002</span>
            </div>

<div style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 10px;">
    <select id="siren-mm-test-char" class="siren-ext-select" style="flex: 1; min-width: 160px;">
        <option value="">(\u70B9\u51FB\u9009\u62E9\u5DF2\u914D\u7F6E\u7684\u89D2\u8272)</option>
    </select>
    <select id="siren-mm-test-mood" class="siren-ext-select" style="flex: 1; min-width: 160px;">
        <option value="">\u81EA\u52A8\u5339\u914D\u60C5\u7EEA</option>
        <option value="happy">\u9AD8\u5174\uFF08happy\uFF09</option>
        <option value="sad">\u60B2\u4F24\uFF08sad\uFF09</option>
        <option value="angry">\u6124\u6012\uFF08angry\uFF09</option>
        <option value="fearful">\u5BB3\u6015\uFF08fearful\uFF09</option>
        <option value="disgusted">\u538C\u6076\uFF08disgusted\uFF09</option>
        <option value="surprised">\u60CA\u8BB6\uFF08surprised\uFF09</option>
        <option value="calm">\u51B7\u9759\uFF08clam\uFF09</option>
        <option value="fluent">\u751F\u52A8\uFF08fluent\uFF09</option>
        <option value="whisper">\u4F4E\u8BED\uFF08whisper\uFF09</option>
    </select>
</div>

            <textarea id="siren-mm-test-text" class="siren-ext-textarea" rows="2" placeholder="\u8F93\u5165\u4E00\u53E5\u53F0\u8BCD\u6D4B\u8BD5\u6548\u679C\uFF0C\u652F\u6301\u7A7F\u63D2\u8BED\u6C14\u8BCD\u3002\u4F8B\u5982\uFF1A\u4ECA\u5929\u771F\u7684\u5F88\u5F00\u5FC3\uFF01(laughs) \u6211\u4EEC\u8D70\u5427\u3002"></textarea>
            
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                <button id="siren-mm-test-generate" class="siren-ext-btn siren-ext-btn-primary" style="background: #10b981; border: 1px solid #059669; color: #ffffff; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3); font-weight: bold;">
                    <i class="fa-solid fa-bolt"></i> \u751F\u6210\u6D4B\u8BD5
                </button>
                
                <div id="siren-mm-test-preview" style="flex: 1; margin-left: 15px; display: flex; align-items: center; gap: 10px;">
                    <audio id="siren-mm-test-audio" controls style="height: 32px; flex: 1; display: none;"></audio>
                    
                    <a id="siren-mm-test-download" class="siren-ext-btn siren-ext-btn-secondary" style="display: none; padding: 4px 10px; text-decoration: none; color: #cbd5e1;" download="minimax_test.mp3" title="\u4E0B\u8F7D\u97F3\u9891">
                        <i class="fa-solid fa-download"></i>
                    </a>
                    
                    <span id="siren-mm-test-status" style="color: #64748b; font-size: 0.85em; white-space: nowrap;">\u7B49\u5F85\u751F\u6210...</span>
                </div>
            </div>
        </div>

        <datalist id="siren-mm-voice-datalist"></datalist>

    </div> <div id="siren-mm-adv-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(6, 11, 23, 0.85); backdrop-filter: blur(4px); z-index: 10000; align-items: center; justify-content: center;">
        <div style="background: #0f172a; border: 1px solid #06b6d4; border-radius: 12px; width: 90%; max-width: 480px; padding: 20px; box-sizing: border-box; box-shadow: 0 10px 30px rgba(0,0,0,0.8);">
            <h3 style="margin: 0 0 15px 0; color: #06b6d4; border-bottom: 1px solid #1e293b; padding-bottom: 10px; display: flex; align-items: center;">
                <i class="fa-solid fa-sliders" style="margin-right:8px;"></i> \u9AD8\u7EA7\u58F0\u97F3\u53C2\u6570
                <span id="siren-mm-adv-charname" style="margin-left: auto; font-size: 0.8em; color: #64748b; background: #1e293b; padding: 2px 8px; border-radius: 4px;">\u672A\u547D\u540D</span>
            </h3>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                <div style="display:flex; flex-direction:column; gap:5px;">
                    <div style="display:flex; justify-content:space-between; color:#94a3b8; font-size:0.9em;">
                        <span>\u8BED\u901F (0.5~2.0)</span><span id="val-mm-speed" style="color:#0ea5e9;">1.0</span>
                    </div>
                    <input type="range" id="adv-mm-speed" min="0.5" max="2.0" step="0.1" value="1.0" class="siren-ext-slider-input" style="--theme-color: #06b6d4;">
                </div>
                <div style="display:flex; flex-direction:column; gap:5px;">
                    <div style="display:flex; justify-content:space-between; color:#94a3b8; font-size:0.9em;">
                        <span>\u97F3\u91CF (0.1~10.0)</span><span id="val-mm-vol" style="color:#0ea5e9;">1.0</span>
                    </div>
                    <input type="range" id="adv-mm-vol" min="0.1" max="10.0" step="0.1" value="1.0" class="siren-ext-slider-input" style="--theme-color: #06b6d4;">
                </div>
                
                <div style="display:flex; flex-direction:column; gap:5px;">
                    <div style="display:flex; justify-content:space-between; color:#94a3b8; font-size:0.9em;">
                        <span>\u8BED\u8C03 (-12~12)</span><span id="val-mm-pitch" style="color:#0ea5e9;">0</span>
                    </div>
                    <input type="range" id="adv-mm-pitch" min="-12" max="12" step="1" value="0" class="siren-ext-slider-input" style="--theme-color: #06b6d4;">
                </div>
                <div style="display:flex; flex-direction:column; gap:5px;">
                    <div style="display:flex; justify-content:space-between; color:#94a3b8; font-size:0.9em;">
                        <span>\u4F4E\u6C89/\u660E\u4EAE (-100~100)</span><span id="val-mm-mpitch" style="color:#0ea5e9;">0</span>
                    </div>
                    <input type="range" id="adv-mm-mpitch" min="-100" max="100" step="1" value="0" class="siren-ext-slider-input" style="--theme-color: #06b6d4;">
                </div>
                
                <div style="display:flex; flex-direction:column; gap:5px;">
                    <div style="display:flex; justify-content:space-between; color:#94a3b8; font-size:0.9em;">
                        <span>\u521A\u52B2/\u8F7B\u67D4 (-100~100)</span><span id="val-mm-int" style="color:#0ea5e9;">0</span>
                    </div>
                    <input type="range" id="adv-mm-int" min="-100" max="100" step="1" value="0" class="siren-ext-slider-input" style="--theme-color: #06b6d4;">
                </div>
                <div style="display:flex; flex-direction:column; gap:5px;">
                    <div style="display:flex; justify-content:space-between; color:#94a3b8; font-size:0.9em;">
                        <span>\u6D51\u539A/\u6E05\u8106 (-100~100)</span><span id="val-mm-timbre" style="color:#0ea5e9;">0</span>
                    </div>
                    <input type="range" id="adv-mm-timbre" min="-100" max="100" step="1" value="0" class="siren-ext-slider-input" style="--theme-color: #06b6d4;">
                </div>
            </div>

            <div style="display:flex; flex-direction:column; gap:5px; margin-bottom: 25px;">
                <div style="color:#94a3b8; font-size:0.9em;">\u7A7A\u95F4\u97F3\u6548\u8BBE\u7F6E</div>
                <select id="adv-mm-sfx" class="siren-ext-select" style="width: 100%;">
                    <option value="none">\u65E0\u6548\u679C</option>
                    <option value="spacious_echo">\u7A7A\u65F7\u56DE\u97F3</option>
                    <option value="auditorium_echo">\u793C\u5802\u5E7F\u64AD</option>
                    <option value="lofi_telephone">\u7535\u8BDD\u5931\u771F</option>
                    <option value="robotic">\u673A\u68B0\u7535\u97F3</option>
                </select>
            </div>

            <div style="display: flex; justify-content: flex-end; gap: 12px;">
                <button id="siren-mm-adv-cancel" class="siren-ext-btn siren-ext-btn-secondary">\u53D6\u6D88</button>
                <button id="siren-mm-adv-save" class="siren-ext-btn siren-ext-btn-primary" style="background: rgba(6, 182, 212, 0.15); border: 1px solid #06b6d4; color: #06b6d4; box-shadow: 0 0 10px rgba(6, 182, 212, 0.2);">
                    <i class="fa-solid fa-check"></i> \u786E\u8BA4
                </button>
            </div>
        </div>
    </div>
    `;
}
function updateVoiceDatalist() {
  const $datalist = $("#siren-mm-voice-datalist");
  $datalist.empty();
  availableVoices.forEach((v) => {
    $datalist.append(`<option value="${v.id}">${v.name}</option>`);
  });
}
function createMinimaxCharRow(charName = "", voiceId = "", advData = null) {
  if (!advData) advData = getDefaultMinimaxAdvData();
  const dataStr = encodeURIComponent(JSON.stringify(advData));
  return `
        <div class="siren-ext-setting-row siren-mm-char-item" style="display:flex; flex-wrap:wrap; gap:6px; align-items:center; padding: 8px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); border-radius: 6px;">
            <input type="text" class="siren-ext-input mm-char-name" placeholder="\u89D2\u8272\u540D" value="${charName}" style="flex: 1 1 100%; width: 100%; box-sizing: border-box; height: 32px;">
            
            <div style="display: flex; gap: 6px; width: 100%; align-items: center;">
                <input type="text" list="siren-mm-voice-datalist" class="siren-ext-input mm-voice-id" placeholder="\u53CC\u51FB\u9009\u62E9\u6216\u7C98\u8D34ID" value="${voiceId}" style="flex: 1; min-width: 0; height: 32px; box-sizing: border-box;">
                
                <button class="siren-ext-btn mm-btn-adv" style="background: none; border: none; color: #06b6d4; width: 30px; height: 32px; padding: 0 5px; flex-shrink: 0; display: flex; align-items: center; justify-content: center;" title="\u9AD8\u7EA7\u58F0\u97F3\u914D\u7F6E"><i class="fa-solid fa-sliders"></i></button>
                <button class="siren-ext-btn mm-btn-del" style="background: none; border: none; color: #ef4444; width: 30px; height: 32px; padding: 0 5px; flex-shrink: 0; display: flex; align-items: center; justify-content: center;" title="\u5220\u9664"><i class="fa-solid fa-trash"></i></button>
            </div>
            <input type="hidden" class="mm-adv-data" value="${dataStr}">
        </div>
    `;
}
function bindMinimaxEvents() {
  const settings = getSirenSettings();
  if (!settings.tts.minimax) {
    settings.tts.minimax = {
      api_key: "",
      model: "speech-2.8-hd",
      text_norm: false
    };
  }
  const mmConfig = settings.tts.minimax;
  $("#siren-mm-region").val(mmConfig.region || "cn");
  $("#siren-mm-apikey").val(mmConfig.api_key || "");
  $("#siren-mm-model").val(mmConfig.model || "speech-2.8-hd");
  $("#siren-mm-norm").prop("checked", mmConfig.text_norm || false);
  loadCharDataFromST();
  $("#siren-mm-fetch-voices").off("click").on("click", async function() {
    const apiKey = $("#siren-mm-apikey").val().trim();
    if (!apiKey) {
      if (window.toastr) window.toastr.warning("\u8BF7\u5148\u8F93\u5165 API Key\uFF01");
      return;
    }
    const $btn = $(this);
    const originalHtml = $btn.html();
    $btn.html('<i class="fa-solid fa-spinner fa-spin"></i> \u540C\u6B65\u4E2D...').prop("disabled", true);
    try {
      const region = $("#siren-mm-region").val();
      availableVoices = await fetchMinimaxVoices(apiKey, region);
      if (window.toastr)
        window.toastr.success(`\u6210\u529F\u62C9\u53D6 ${availableVoices.length} \u4E2A\u97F3\u8272\uFF01`);
      updateVoiceDatalist();
    } catch (e) {
      if (window.toastr) window.toastr.error("\u62C9\u53D6\u97F3\u8272\u5931\u8D25\uFF1A" + e.message);
    } finally {
      $btn.html(originalHtml).prop("disabled", false);
    }
  });
  $("#siren-mm-char-add").off("click").on("click", function() {
    $("#siren-mm-char-list").append(createMinimaxCharRow());
    bindRowEvents();
  });
  $("#siren-mm-region, #siren-mm-apikey, #siren-mm-model, #siren-mm-norm").on(
    "change input",
    function() {
      const settings2 = getSirenSettings();
      settings2.tts.minimax.region = $("#siren-mm-region").val();
      settings2.tts.minimax.api_key = $("#siren-mm-apikey").val().trim();
      settings2.tts.minimax.model = $("#siren-mm-model").val();
      settings2.tts.minimax.text_norm = $("#siren-mm-norm").is(":checked");
    }
  );
  const sliders = [
    { id: "#adv-mm-speed", valId: "#val-mm-speed" },
    { id: "#adv-mm-vol", valId: "#val-mm-vol" },
    { id: "#adv-mm-pitch", valId: "#val-mm-pitch" },
    { id: "#adv-mm-mpitch", valId: "#val-mm-mpitch" },
    { id: "#adv-mm-int", valId: "#val-mm-int" },
    { id: "#adv-mm-timbre", valId: "#val-mm-timbre" }
  ];
  sliders.forEach((s) => {
    $(s.id).on("input", function() {
      $(s.valId).text($(this).val());
    });
  });
  bindSirenSliders([
    "adv-mm-speed",
    "adv-mm-vol",
    "adv-mm-pitch",
    "adv-mm-mpitch",
    "adv-mm-int",
    "adv-mm-timbre"
  ]);
  $("#siren-mm-adv-cancel").off("click").on("click", function() {
    $("#siren-mm-adv-modal").css("display", "none");
    currentEditingRow = null;
  });
  $("#siren-mm-adv-save").off("click").on("click", function() {
    if (!currentEditingRow) return;
    const newData = {
      speed: parseFloat($("#adv-mm-speed").val()),
      vol: parseFloat($("#adv-mm-vol").val()),
      pitch: parseInt($("#adv-mm-pitch").val()),
      modify_pitch: parseInt($("#adv-mm-mpitch").val()),
      modify_intensity: parseInt($("#adv-mm-int").val()),
      modify_timbre: parseInt($("#adv-mm-timbre").val()),
      sound_effect: $("#adv-mm-sfx").val()
    };
    currentEditingRow.find(".mm-adv-data").val(encodeURIComponent(JSON.stringify(newData)));
    currentEditingRow.find(".mm-btn-adv").css({
      background: "rgba(16, 185, 129, 0.2)",
      "border-color": "#10b981",
      color: "#10b981"
    });
    $("#siren-mm-adv-modal").css("display", "none");
    currentEditingRow = null;
  });
  $("#siren-mm-save-all").off("click").on("click", async function(e, isSilent = false) {
    const settings2 = getSirenSettings();
    settings2.tts.minimax.region = $("#siren-mm-region").val();
    settings2.tts.minimax.api_key = $("#siren-mm-apikey").val().trim();
    settings2.tts.minimax.model = $("#siren-mm-model").val();
    settings2.tts.minimax.text_norm = $("#siren-mm-norm").is(":checked");
    saveSirenSettings(true);
    const mapData = {};
    $("#siren-mm-char-list .siren-mm-char-item").each(function() {
      const charName = $(this).find(".mm-char-name").val().trim();
      const voiceId = $(this).find(".mm-voice-id").val();
      if (charName && voiceId) {
        const advDataStr = decodeURIComponent(
          $(this).find(".mm-adv-data").val()
        );
        let advData = getDefaultMinimaxAdvData();
        try {
          advData = { ...advData, ...JSON.parse(advDataStr) };
        } catch (e2) {
        }
        mapData[charName] = { voice_id: voiceId, ...advData };
      }
    });
    const isSaved = await saveToCharacterCard(
      "siren_voice_tts_minimax",
      { voices: mapData },
      true
    );
    if (!isSilent && window.toastr) {
      window.toastr.success("MiniMax: \u914D\u7F6E\u5DF2\u4FDD\u5B58\uFF0C\u5DF2\u81EA\u52A8\u5207\u6362\u5E76\u540C\u6B65\u4E16\u754C\u4E66\uFF01");
    }
    const currentSettings = getSirenSettings();
    currentSettings.tts.provider = "minimax";
    currentSettings.tts.enabled = true;
    saveSirenSettings(true);
    await syncTtsWorldbookEntries("minimax", true);
  });
  window.addEventListener("siren:character_changed", () => {
    if ($("#siren-mm-char-list").length > 0) {
      console.log(
        "[Siren Voice] \u{1F504} \u68C0\u6D4B\u5230\u804A\u5929\u5207\u6362\uFF0C\u6B63\u5728\u5237\u65B0 MiniMax \u97F3\u8272\u6620\u5C04..."
      );
      loadCharDataFromST();
    }
  });
  $("#siren-mm-test-char").off("focus").on("focus", function() {
    const $select = $(this);
    const currentVal = $select.val();
    $select.empty().append('<option value="">(\u70B9\u51FB\u9009\u62E9\u5DF2\u914D\u7F6E\u7684\u89D2\u8272)</option>');
    $("#siren-mm-char-list .siren-mm-char-item").each(function() {
      const charName = $(this).find(".mm-char-name").val().trim();
      if (charName) {
        $select.append(`<option value="${charName}">${charName}</option>`);
      }
    });
    if ($select.find(`option[value="${currentVal}"]`).length > 0) {
      $select.val(currentVal);
    }
  });
  $("#siren-mm-test-generate").off("click").on("click", async function() {
    const charName = $("#siren-mm-test-char").val();
    if (!charName) {
      if (window.toastr)
        window.toastr.warning("\u8BF7\u5148\u5728\u5DE6\u4FA7\u4E0B\u62C9\u6846\u9009\u62E9\u8981\u6D4B\u8BD5\u7684\u89D2\u8272\uFF01");
      return;
    }
    const text = $("#siren-mm-test-text").val().trim();
    if (!text) {
      if (window.toastr) window.toastr.warning("\u8BF7\u8F93\u5165\u6D4B\u8BD5\u53F0\u8BCD\uFF01");
      return;
    }
    const mood = $("#siren-mm-test-mood").val();
    const apiKey = $("#siren-mm-apikey").val().trim();
    const model = $("#siren-mm-model").val();
    const textNorm = $("#siren-mm-norm").is(":checked");
    if (!apiKey) {
      if (window.toastr) window.toastr.warning("\u7F3A\u5C11 API Key\uFF0C\u8BF7\u5148\u914D\u7F6E\uFF01");
      return;
    }
    let voiceId = "";
    let advData = null;
    $("#siren-mm-char-list .siren-mm-char-item").each(function() {
      if ($(this).find(".mm-char-name").val().trim() === charName) {
        voiceId = $(this).find(".mm-voice-id").val();
        const dataStr = decodeURIComponent(
          $(this).find(".mm-adv-data").val() || "%7B%7D"
        );
        try {
          advData = JSON.parse(dataStr);
        } catch (e) {
        }
      }
    });
    if (!voiceId) {
      if (window.toastr)
        window.toastr.error("\u9009\u4E2D\u7684\u89D2\u8272\u6CA1\u6709\u914D\u7F6E Voice ID\uFF0C\u8BF7\u68C0\u67E5\u4E0A\u65B9\u5217\u8868\uFF01");
      return;
    }
    const config = {
      region: $("#siren-mm-region").val(),
      api_key: apiKey,
      model,
      text_norm: textNorm,
      voice_id: voiceId,
      ...advData || getDefaultMinimaxAdvData()
    };
    const $btn = $(this);
    const $status = $("#siren-mm-test-status");
    const $audio = $("#siren-mm-test-audio");
    const $download = $("#siren-mm-test-download");
    $btn.prop("disabled", true);
    $status.html('<i class="fa-solid fa-spinner fa-spin"></i> \u6B63\u5728\u5408\u6210\u4E2D...');
    $audio.hide();
    $download.hide();
    try {
      const { generateMinimaxAudioBlob: generateMinimaxAudioBlob2 } = await Promise.resolve().then(() => (init_minimax_logic(), minimax_logic_exports));
      const blob = await generateMinimaxAudioBlob2(text, mood, config);
      const url = setAudioPreview($audio[0], blob);
      $audio.attr("src", url).show();
      $download.attr("href", url).show();
      $status.html('<span style="color: #06b6d4;">\u751F\u6210\u6210\u529F\uFF01</span>');
      $audio[0].play().catch((e) => console.warn("\u81EA\u52A8\u64AD\u653E\u88AB\u6D4F\u89C8\u5668\u62E6\u622A", e));
    } catch (err) {
      console.error("[Siren Voice] \u514B\u9686\u5931\u8D25:", err);
      $status.html(
        `<span style="color: #ef4444;" title="${err.message}">\u5931\u8D25: ${err.message}</span>`
      );
    } finally {
      $btn.prop("disabled", false);
    }
  });
  let cloneFileCache = null;
  let promptFileCache = null;
  $("#siren-mm-btn-choose-clone").on(
    "click",
    () => $("#siren-mm-clone-file").click()
  );
  $("#siren-mm-btn-choose-prompt").on(
    "click",
    () => $("#siren-mm-prompt-file").click()
  );
  $("#siren-mm-clone-file").on("change", function(e) {
    const file = e.target.files[0];
    if (file) {
      cloneFileCache = file;
      $("#siren-mm-clone-filename").text(file.name + ` (${(file.size / 1024 / 1024).toFixed(2)} MB)`).css("color", "#0ea5e9");
      $("#siren-mm-clone-id").val("");
    }
  });
  $("#siren-mm-prompt-file").on("change", function(e) {
    const file = e.target.files[0];
    if (file) {
      promptFileCache = file;
      $("#siren-mm-prompt-filename").text(file.name + ` (${(file.size / 1024).toFixed(2)} KB)`).css("color", "#0ea5e9");
      $("#siren-mm-prompt-id").val("");
    }
  });
  async function handleUploadClick(fileCache, type, purpose, $btn, $idInput) {
    if (!fileCache) {
      if (window.toastr) window.toastr.warning("\u8BF7\u5148\u9009\u62E9\u6587\u4EF6\uFF01");
      return;
    }
    const apiKey = $("#siren-mm-apikey").val().trim();
    if (!apiKey) {
      if (window.toastr) window.toastr.error("\u8BF7\u5148\u5728\u4E0A\u65B9\u914D\u7F6E API Key\uFF01");
      return;
    }
    const originalText = $btn.html();
    $btn.html('<i class="fa-solid fa-spinner fa-spin"></i> \u4E0A\u4F20\u4E2D').prop("disabled", true);
    try {
      const region = $("#siren-mm-region").val();
      const { uploadMinimaxFile: uploadMinimaxFile2 } = await Promise.resolve().then(() => (init_minimax_logic(), minimax_logic_exports));
      const fileData = await uploadMinimaxFile2(
        apiKey,
        fileCache,
        purpose,
        region
      );
      $idInput.val(fileData.file_id);
      if (window.toastr) window.toastr.success(`${type} \u4E0A\u4F20\u6210\u529F\uFF01`);
    } catch (err) {
      console.error(`[Siren Voice] ${type} \u4E0A\u4F20\u5931\u8D25:`, err);
      if (window.toastr) window.toastr.error(err.message);
    } finally {
      $btn.html(originalText).prop("disabled", false);
    }
  }
  $("#siren-mm-btn-up-clone").on("click", function() {
    handleUploadClick(
      cloneFileCache,
      "\u590D\u523B\u97F3\u9891",
      "voice_clone",
      $(this),
      $("#siren-mm-clone-id")
    );
  });
  $("#siren-mm-btn-up-prompt").on("click", function() {
    handleUploadClick(
      promptFileCache,
      "\u793A\u4F8B\u97F3\u9891",
      "prompt_audio",
      $(this),
      $("#siren-mm-prompt-id")
    );
  });
  $("#siren-mm-btn-doclone").on("click", async function() {
    const apiKey = $("#siren-mm-apikey").val().trim();
    const cloneId = $("#siren-mm-clone-id").val().trim();
    const voiceId = $("#siren-mm-clone-vid").val().trim();
    const demoText = $("#siren-mm-clone-text").val().trim();
    if (!apiKey) return window.toastr && window.toastr.warning("\u7F3A\u5C11 API Key");
    if (!cloneId)
      return window.toastr && window.toastr.warning("\u8BF7\u5148\u4E0A\u4F20\u590D\u523B\u97F3\u9891\u5E76\u83B7\u53D6 File ID\uFF01");
    if (!voiceId)
      return window.toastr && window.toastr.warning("\u8BF7\u586B\u5199\u81EA\u5B9A\u4E49\u7684 Voice ID\uFF01");
    if (!demoText)
      return window.toastr && window.toastr.warning("\u8BF7\u586B\u5199\u8BD5\u542C\u6587\u672C\uFF01");
    const promptId = $("#siren-mm-prompt-id").val().trim();
    const promptText = $("#siren-mm-prompt-text").val().trim();
    if (promptId && !promptText || !promptId && promptText) {
      return window.toastr && window.toastr.warning("\u793A\u4F8B\u97F3\u9891 ID \u548C\u793A\u4F8B\u6587\u672C\u5FC5\u987B\u540C\u65F6\u586B\u5199\uFF01");
    }
    const config = {
      region: $("#siren-mm-region").val(),
      file_id: cloneId,
      voice_id: voiceId,
      text: demoText,
      prompt_audio: promptId || null,
      prompt_text: promptText || null,
      model: $("#siren-mm-model").val(),
      need_noise_reduction: $("#siren-mm-clone-nr").is(":checked")
    };
    const $btn = $(this);
    const $status = $("#siren-mm-clone-status");
    const $audio = $("#siren-mm-clone-audio");
    $btn.prop("disabled", true);
    $status.html('<i class="fa-solid fa-spinner fa-spin"></i> \u6B63\u5728\u5904\u7406\u590D\u523B\u4E0E\u5408\u6210...').css("color", "#f59e0b");
    $audio.hide();
    try {
      const { cloneMinimaxVoice: cloneMinimaxVoice2 } = await Promise.resolve().then(() => (init_minimax_logic(), minimax_logic_exports));
      const resData = await cloneMinimaxVoice2(apiKey, config);
      $status.html(
        '<span style="color: #10b981;"><i class="fa-solid fa-check"></i> \u590D\u523B\u6210\u529F\uFF01\u5DF2\u53EF\u540C\u6B65\u3002</span>'
      );
      if (resData.demo_audio) {
        $audio.attr("src", resData.demo_audio).show();
        $audio[0].play().catch((e) => console.warn("\u62E6\u622A", e));
      }
      $("#siren-mm-fetch-voices").trigger("click");
    } catch (err) {
      console.error("[Siren Voice] \u514B\u9686\u5931\u8D25:", err);
      $status.html(
        `<span style="color: #ef4444;" title="${err.message}">\u5931\u8D25: ${err.message.substring(0, 20)}...</span>`
      );
    } finally {
      $btn.prop("disabled", false);
    }
  });
}
function bindRowEvents() {
  $(".mm-voice-id").off("click").on("click", function() {
    if (availableVoices.length === 0 && !$(this).val()) {
      if (window.toastr)
        window.toastr.info(
          "\u5217\u8868\u4E3A\u7A7A\uFF1A\u8BF7\u5148\u586B\u5165 API Key \u5E76\u70B9\u51FB\u4E0A\u65B9\u7684\u3010\u540C\u6B65\u53EF\u7528\u97F3\u8272\u3011\u6309\u94AE\u54E6\uFF01"
        );
    }
  });
  $(".mm-btn-del").off("click").on("click", function() {
    $(this).closest(".siren-mm-char-item").remove();
  });
  $(".mm-btn-adv").off("click").on("click", function() {
    const $row = $(this).closest(".siren-mm-char-item");
    currentEditingRow = $row;
    const charName = $row.find(".mm-char-name").val().trim() || "\u672A\u547D\u540D\u89D2\u8272";
    $("#siren-mm-adv-charname").text(charName);
    const dataStr = decodeURIComponent(
      $row.find(".mm-adv-data").val() || "%7B%7D"
    );
    let data = getDefaultMinimaxAdvData();
    try {
      data = { ...data, ...JSON.parse(dataStr) };
    } catch (e) {
      console.error("Parse adv data failed", e);
    }
    $("#adv-mm-speed").val(data.speed).trigger("input");
    $("#adv-mm-vol").val(data.vol).trigger("input");
    $("#adv-mm-pitch").val(data.pitch).trigger("input");
    $("#adv-mm-mpitch").val(data.modify_pitch).trigger("input");
    $("#adv-mm-int").val(data.modify_intensity).trigger("input");
    $("#adv-mm-timbre").val(data.modify_timbre).trigger("input");
    $("#adv-mm-sfx").val(data.sound_effect || "none");
    $("#siren-mm-adv-modal").css("display", "flex").hide().fadeIn(150);
  });
}
async function loadCharDataFromST() {
  const context = SillyTavern.getContext();
  const characterId = context.characterId;
  const $list = $("#siren-mm-char-list");
  $list.empty();
  if (characterId === void 0 || characterId === null) {
    $list.html(
      `<div style="color: #64748b; text-align: center;">\u5F53\u524D\u672A\u9009\u4E2D\u89D2\u8272\uFF0C\u65E0\u6CD5\u52A0\u8F7D\u6620\u5C04\u914D\u7F6E\u3002</div>`
    );
    return;
  }
  const currentAvatar = context.characters[characterId];
  const charExt = currentAvatar?.data?.extensions?.siren_voice_tts_minimax?.voices || {};
  const keys = Object.keys(charExt);
  if (keys.length === 0) {
  } else {
    for (const [cName, config] of Object.entries(charExt)) {
      const voiceId = config.voice_id || "";
      const advData = {
        speed: config.speed ?? 1,
        vol: config.vol ?? 1,
        pitch: config.pitch ?? 0,
        modify_pitch: config.modify_pitch ?? 0,
        modify_intensity: config.modify_intensity ?? 0,
        modify_timbre: config.modify_timbre ?? 0,
        sound_effect: config.sound_effect ?? "none"
      };
      $list.append(createMinimaxCharRow(cName, voiceId, advData));
    }
  }
  bindRowEvents();
}

// scripts/doubao.js
init_audio_engine();
init_settings();
init_doubao_logic();
init_utils();
var DOUBAO_VOICES_2_0 = [
  { id: "zh_female_vv_uranus_bigtts", name: "Vivi 2.0" },
  { id: "zh_female_xiaohe_uranus_bigtts", name: "\u5C0F\u4F55 2.0" },
  { id: "zh_male_m191_uranus_bigtts", name: "\u4E91\u821F 2.0" },
  { id: "zh_male_taocheng_uranus_bigtts", name: "\u5C0F\u5929 2.0" },
  { id: "zh_male_liufei_uranus_bigtts", name: "\u5218\u98DE 2.0" },
  { id: "zh_female_sophie_uranus_bigtts", name: "\u9B45\u529B\u82CF\u83F2 2.0" },
  { id: "zh_female_qingxinnvsheng_uranus_bigtts", name: "\u6E05\u65B0\u5973\u58F0 2.0" },
  { id: "zh_female_cancan_uranus_bigtts", name: "\u77E5\u6027\u707F\u707F 2.0" },
  { id: "zh_female_sajiaoxuemei_uranus_bigtts", name: "\u6492\u5A07\u5B66\u59B9 2.0" },
  { id: "zh_female_tianmeixiaoyuan_uranus_bigtts", name: "\u751C\u7F8E\u5C0F\u6E90 2.0" },
  { id: "zh_female_tianmeitaozi_uranus_bigtts", name: "\u751C\u7F8E\u6843\u5B50 2.0" },
  { id: "zh_female_shuangkuaisisi_uranus_bigtts", name: "\u723D\u5FEB\u601D\u601D 2.0" },
  { id: "zh_female_peiqi_uranus_bigtts", name: "\u4F69\u5947\u732A 2.0" },
  { id: "zh_female_linjianvhai_uranus_bigtts", name: "\u90BB\u5BB6\u5973\u5B69 2.0" },
  { id: "zh_male_shaonianzixin_uranus_bigtts", name: "\u5C11\u5E74\u6893\u8F9B/Brayan 2.0" },
  { id: "zh_male_sunwukong_uranus_bigtts", name: "\u7334\u54E5 2.0" },
  { id: "zh_female_yingyujiaoxue_uranus_bigtts", name: "Tina\u8001\u5E08 2.0" },
  { id: "zh_female_kefunvsheng_uranus_bigtts", name: "\u6696\u9633\u5973\u58F0 2.0" },
  { id: "zh_female_xiaoxue_uranus_bigtts", name: "\u513F\u7AE5\u7ED8\u672C 2.0" },
  { id: "zh_male_dayi_uranus_bigtts", name: "\u5927\u58F9 2.0" },
  { id: "zh_female_mizai_uranus_bigtts", name: "\u9ED1\u732B\u4FA6\u63A2\u793E\u54AA\u4ED4 2.0" },
  { id: "zh_female_jitangnv_uranus_bigtts", name: "\u9E21\u6C64\u5973 2.0" },
  { id: "zh_female_meilinvyou_uranus_bigtts", name: "\u9B45\u529B\u5973\u53CB 2.0" },
  { id: "zh_female_liuchangnv_uranus_bigtts", name: "\u6D41\u7545\u5973\u58F0 2.0" },
  { id: "zh_male_ruyayichen_uranus_bigtts", name: "\u5112\u96C5\u9038\u8FB0 2.0" },
  { id: "en_male_tim_uranus_bigtts", name: "Tim" },
  { id: "en_female_dacey_uranus_bigtts", name: "Dacey" },
  { id: "en_female_stokie_uranus_bigtts", name: "Stokie" },
  { id: "zh_female_wenroumama_uranus_bigtts", name: "\u6E29\u67D4\u5988\u5988 2.0" },
  { id: "zh_male_jieshuoxiaoming_uranus_bigtts", name: "\u89E3\u8BF4\u5C0F\u660E 2.0" },
  { id: "zh_female_tvbnv_uranus_bigtts", name: "TVB\u5973\u58F0 2.0" },
  { id: "zh_male_yizhipiannan_uranus_bigtts", name: "\u8BD1\u5236\u7247\u7537 2.0" },
  { id: "zh_female_qiaopinv_uranus_bigtts", name: "\u4FCF\u76AE\u5973\u58F0 2.0" },
  { id: "zh_female_zhishuaiyingzi_uranus_bigtts", name: "\u76F4\u7387\u82F1\u5B50 2.0" },
  { id: "zh_male_linjiananhai_uranus_bigtts", name: "\u90BB\u5BB6\u7537\u5B69 2.0" },
  { id: "zh_male_silang_uranus_bigtts", name: "\u56DB\u90CE 2.0" },
  { id: "zh_male_ruyaqingnian_uranus_bigtts", name: "\u5112\u96C5\u9752\u5E74 2.0" },
  { id: "zh_male_qingcang_uranus_bigtts", name: "\u64CE\u82CD 2.0" },
  { id: "zh_male_xionger_uranus_bigtts", name: "\u718A\u4E8C 2.0" },
  { id: "zh_female_yingtaowanzi_uranus_bigtts", name: "\u6A31\u6843\u4E38\u5B50 2.0" },
  { id: "zh_male_wennuanahu_uranus_bigtts", name: "\u6E29\u6696\u963F\u864E/Alvin 2.0" },
  { id: "zh_male_naiqimengwa_uranus_bigtts", name: "\u5976\u6C14\u840C\u5A03 2.0" },
  { id: "zh_female_popo_uranus_bigtts", name: "\u5A46\u5A46 2.0" },
  { id: "zh_female_gaolengyujie_uranus_bigtts", name: "\u9AD8\u51B7\u5FA1\u59D0 2.0" },
  { id: "zh_male_aojiaobazong_uranus_bigtts", name: "\u50B2\u5A07\u9738\u603B 2.0" },
  { id: "zh_male_lanyinmianbao_uranus_bigtts", name: "\u61D2\u97F3\u7EF5\u5B9D 2.0" },
  { id: "zh_male_fanjuanqingnian_uranus_bigtts", name: "\u53CD\u5377\u9752\u5E74 2.0" },
  { id: "zh_female_wenroushunv_uranus_bigtts", name: "\u6E29\u67D4\u6DD1\u5973 2.0" },
  { id: "zh_female_gufengshaoyu_uranus_bigtts", name: "\u53E4\u98CE\u5C11\u5FA1 2.0" },
  { id: "zh_male_huolixiaoge_uranus_bigtts", name: "\u6D3B\u529B\u5C0F\u54E5 2.0" },
  { id: "zh_male_baqiqingshu_uranus_bigtts", name: "\u9738\u6C14\u9752\u53D4 2.0" },
  { id: "zh_male_xuanyijieshuo_uranus_bigtts", name: "\u60AC\u7591\u89E3\u8BF4 2.0" },
  { id: "zh_female_mengyatou_uranus_bigtts", name: "\u840C\u4E2B\u5934/Cutey 2.0" },
  { id: "zh_female_tiexinnvsheng_uranus_bigtts", name: "\u8D34\u5FC3\u5973\u58F0/Candy 2.0" },
  { id: "zh_female_jitangmei_uranus_bigtts", name: "\u9E21\u6C64\u59B9\u59B9/Hope 2.0" },
  {
    id: "zh_male_cixingjieshuonan_uranus_bigtts",
    name: "\u78C1\u6027\u89E3\u8BF4\u7537\u58F0/Morgan 2.0"
  },
  { id: "zh_male_liangsangmengzai_uranus_bigtts", name: "\u4EAE\u55D3\u840C\u4ED4 2.0" },
  { id: "zh_female_kailangjiejie_uranus_bigtts", name: "\u5F00\u6717\u59D0\u59D0 2.0" },
  { id: "zh_male_gaolengchenwen_uranus_bigtts", name: "\u9AD8\u51B7\u6C89\u7A33 2.0" },
  { id: "zh_male_shenyeboke_uranus_bigtts", name: "\u6DF1\u591C\u64AD\u5BA2 2.0" },
  { id: "zh_male_lubanqihao_uranus_bigtts", name: "\u9C81\u73ED\u4E03\u53F7 2.0" },
  { id: "zh_female_jiaochuannv_uranus_bigtts", name: "\u5A07\u5598\u5973\u58F0 2.0" },
  { id: "zh_female_linxiao_uranus_bigtts", name: "\u6797\u6F47 2.0" },
  { id: "zh_female_lingling_uranus_bigtts", name: "\u73B2\u73B2\u59D0\u59D0 2.0" },
  { id: "zh_female_chunribu_uranus_bigtts", name: "\u6625\u65E5\u90E8\u59D0\u59D0 2.0" },
  { id: "zh_male_tangseng_uranus_bigtts", name: "\u5510\u50E7 2.0" },
  { id: "zh_male_zhuangzhou_uranus_bigtts", name: "\u5E84\u5468 2.0" },
  { id: "zh_male_kailangdidi_uranus_bigtts", name: "\u5F00\u6717\u5F1F\u5F1F 2.0" },
  { id: "zh_male_zhubajie_uranus_bigtts", name: "\u732A\u516B\u6212 2.0" },
  { id: "zh_female_ganmaodianyin_uranus_bigtts", name: "\u611F\u5192\u7535\u97F3\u59D0\u59D0 2.0" },
  { id: "zh_female_chanmeinv_uranus_bigtts", name: "\u8C04\u5A9A\u5973\u58F0 2.0" },
  { id: "zh_female_nvleishen_uranus_bigtts", name: "\u5973\u96F7\u795E 2.0" },
  { id: "zh_female_qinqienv_uranus_bigtts", name: "\u4EB2\u5207\u5973\u58F0 2.0" },
  { id: "zh_male_kuailexiaodong_uranus_bigtts", name: "\u5FEB\u4E50\u5C0F\u4E1C 2.0" },
  { id: "zh_male_kailangxuezhang_uranus_bigtts", name: "\u5F00\u6717\u5B66\u957F 2.0" },
  { id: "zh_male_youyoujunzi_uranus_bigtts", name: "\u60A0\u60A0\u541B\u5B50 2.0" },
  { id: "zh_female_wenjingmaomao_uranus_bigtts", name: "\u6587\u9759\u6BDB\u6BDB 2.0" },
  { id: "zh_female_zhixingnv_uranus_bigtts", name: "\u77E5\u6027\u5973\u58F0 2.0" },
  { id: "zh_male_qingshuangnanda_uranus_bigtts", name: "\u6E05\u723D\u7537\u5927 2.0" },
  { id: "zh_male_yuanboxiaoshu_uranus_bigtts", name: "\u6E0A\u535A\u5C0F\u53D4 2.0" },
  { id: "zh_male_yangguangqingnian_uranus_bigtts", name: "\u9633\u5149\u9752\u5E74 2.0" },
  { id: "zh_female_qingchezizi_uranus_bigtts", name: "\u6E05\u6F88\u6893\u6893 2.0" },
  { id: "zh_female_tianmeiyueyue_uranus_bigtts", name: "\u751C\u7F8E\u60A6\u60A6 2.0" },
  { id: "zh_female_xinlingjitang_uranus_bigtts", name: "\u5FC3\u7075\u9E21\u6C64 2.0" },
  { id: "zh_male_wenrouxiaoge_uranus_bigtts", name: "\u6E29\u67D4\u5C0F\u54E5 2.0" },
  { id: "zh_female_roumeinvyou_uranus_bigtts", name: "\u67D4\u7F8E\u5973\u53CB 2.0" },
  { id: "zh_male_dongfanghaoran_uranus_bigtts", name: "\u4E1C\u65B9\u6D69\u7136 2.0" },
  { id: "zh_female_wenrouxiaoya_uranus_bigtts", name: "\u6E29\u67D4\u5C0F\u96C5 2.0" },
  { id: "zh_male_tiancaitongsheng_uranus_bigtts", name: "\u5929\u624D\u7AE5\u58F0 2.0" },
  { id: "zh_female_wuzetian_uranus_bigtts", name: "\u6B66\u5219\u5929 2.0" },
  { id: "zh_female_gujie_uranus_bigtts", name: "\u987E\u59D0 2.0" },
  { id: "zh_male_guanggaojieshuo_uranus_bigtts", name: "\u5E7F\u544A\u89E3\u8BF4 2.0" },
  { id: "zh_female_shaoergushi_uranus_bigtts", name: "\u5C11\u513F\u6545\u4E8B 2.0" },
  { id: "saturn_zh_female_tiaopigongzhu_tob", name: "\u8C03\u76AE\u516C\u4E3B" },
  { id: "saturn_zh_female_keainvsheng_tob", name: "\u53EF\u7231\u5973\u751F" },
  { id: "saturn_zh_male_shuanglangshaonian_tob", name: "\u723D\u6717\u5C11\u5E74" },
  { id: "saturn_zh_male_tiancaitongzhuo_tob", name: "\u5929\u624D\u540C\u684C" },
  { id: "saturn_zh_female_cancan_tob", name: "\u77E5\u6027\u707F\u707F" },
  { id: "saturn_zh_female_qingyingduoduo_cs_tob", name: "\u8F7B\u76C8\u6735\u6735 2.0" },
  { id: "saturn_zh_female_wenwanshanshan_cs_tob", name: "\u6E29\u5A49\u73CA\u73CA 2.0" },
  { id: "saturn_zh_female_reqingaina_cs_tob", name: "\u70ED\u60C5\u827E\u5A1C 2.0" },
  { id: "saturn_zh_male_qingxinmumu_cs_tob", name: "\u6E05\u65B0\u6C90\u6C90 2.0" }
];
function getDoubaoHtml() {
  let optionsHtml = DOUBAO_VOICES_2_0.map(
    (v) => `<option value="${v.id}">${v.name}</option>`
  ).join("");
  return `
    <div id="siren-doubao-settings" style="display: flex; flex-direction: column; gap: 15px;">
        
        <div style="background: rgba(15, 23, 42, 0.4); border: 1px solid #334155; border-radius: 6px; padding: 15px;">
            <h4 style="color: #94a3b8; margin-top: 0; margin-bottom: 15px;">
                <i class="fa-solid fa-key" style="margin-right: 5px;"></i> \u5168\u5C40\u8BA4\u8BC1\u914D\u7F6E
            </h4>
            <div class="siren-ext-setting-row siren-ext-flex-between" style="margin-bottom: 10px;">
                <div class="siren-ext-setting-label">App ID</div>
                <input type="text" id="siren-db-appid" class="siren-ext-input" style="max-width: 60%;" placeholder="\u706B\u5C71\u5F15\u64CE\u63A7\u5236\u53F0\u83B7\u53D6">
            </div>
            <div class="siren-ext-setting-row siren-ext-flex-between">
                <div class="siren-ext-setting-label">Access Key</div>
                <input type="password" id="siren-db-ak" class="siren-ext-input" style="max-width: 60%;" placeholder="\u8F93\u5165 Access Key (Token)">
            </div>
        </div>

        <div style="background: rgba(15, 23, 42, 0.4); border: 1px solid #334155; border-radius: 6px; padding: 15px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <h4 style="color: #06b6d4; margin: 0;">
                    <i class="fa-solid fa-users" style="margin-right: 5px;"></i> \u89D2\u8272\u97F3\u8272\u6620\u5C04
                </h4>
            </div>

            <div id="siren-db-char-list" style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 10px;">
                </div>

            <button id="siren-db-char-add" class="siren-ext-btn siren-ext-btn-secondary" style="width: 100%; border-style: dashed;">
                <i class="fa-solid fa-plus" style="margin-right: 5px;"></i> \u65B0\u589E\u89D2\u8272\u6620\u5C04
            </button>
        </div>

        <div style="display: flex; justify-content: center;">
            <button id="siren-db-char-save" class="siren-ext-btn siren-ext-btn-primary" style="width: 100%; padding: 12px 0; justify-content: center; font-size: 1.05em; background: #10b981; border-color: #10b981;">
                <i class="fa-solid fa-floppy-disk" style="margin-right: 8px;"></i>\u4FDD\u5B58\u914D\u7F6E
            </button>
        </div>

        <div style="margin-top: 10px; border-top: 1px dashed #475569; padding-top: 20px;">
            <h4 style="color: #3b82f6; margin-bottom: 10px; font-size: 1.1em;">
                <i class="fa-solid fa-vial" style="margin-right: 5px;"></i> \u8C46\u5305\u53D1\u97F3\u6D4B\u8BD5
            </h4>
            
            <div style="background: rgba(59, 130, 246, 0.08); border: 1px solid rgba(59, 130, 246, 0.3); border-radius: 6px; padding: 15px;">
                
                <div style="color: #94a3b8; font-size: 0.85em; margin-bottom: 12px; line-height: 1.5;">
                    <i class="fa-solid fa-circle-info" style="margin-right: 4px; color: #3b82f6;"></i> 
                    <b>\u5408\u6210 2.0</b> \u652F\u6301\u81EA\u7136\u8BED\u8A00\u60C5\u7EEA\u63D0\u793A\uFF1B<b>\u590D\u523B 2.0</b> \u652F\u6301 CoT \u6807\u7B7E\u63A7\u5236\u3002
                </div>

                <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 10px;">
                    <select id="siren-db-test-char" class="siren-ext-select" style="height: 32px; box-sizing: border-box; padding: 0 8px; flex: 1; min-width: 160px;">
                        <option value="">(\u8BF7\u5148\u914D\u7F6E\u5E76\u4FDD\u5B58\u4E0A\u65B9\u89D2\u8272)</option>
                    </select>
                    <input type="text" id="siren-db-test-emotion" class="siren-ext-input" style="height: 32px; box-sizing: border-box; padding: 0 8px; flex: 1; min-width: 160px;" placeholder="\u60C5\u7EEA\u63D0\u793A\u8BCD (\u5982: \u7528\u5F00\u5FC3\u7684\u8BED\u6C14)">
                </div>

                <textarea id="siren-db-test-text" class="siren-ext-textarea" rows="2" placeholder="\u8F93\u5165\u4E00\u53E5\u53F0\u8BCD\u6D4B\u8BD5\u6548\u679C\u3002\u590D\u523B2.0\u53EF\u76F4\u63A5\u5728\u6B64\u8F93\u5165 <cot text=\u54ED\u8154> \u7B49\u6807\u7B7E\u3002" style="margin-bottom: 10px;"></textarea>
                
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <button id="siren-db-test-generate" class="siren-ext-btn siren-ext-btn-primary" style="background: #3b82f6; border-color: #3b82f6; color: #ffffff;">
                        <i class="fa-solid fa-bolt"></i> \u751F\u6210
                    </button>
                    
                    <div id="siren-db-test-preview" style="flex: 1; margin-left: 15px; display: flex; align-items: center; gap: 10px;">
                        <audio id="siren-db-test-audio" controls style="height: 32px; flex: 1; display: none;"></audio>
                        
                        <a id="siren-db-test-download" class="siren-ext-btn siren-ext-btn-secondary" style="display: none; padding: 4px 10px; text-decoration: none; color: #cbd5e1;" download="doubao_test.mp3" title="\u4E0B\u8F7D\u97F3\u9891">
                            <i class="fa-solid fa-download"></i>
                        </a>
                        
                        <span id="siren-db-test-status" style="color: #64748b; font-size: 0.85em; white-space: nowrap;">\u7B49\u5F85\u751F\u6210...</span>
                    </div>
                </div>
            </div>
        </div>
        
        <template id="siren-db-voice-options">${optionsHtml}</template>
    </div>
    `;
}
function bindDoubaoEvents() {
  const settings = getSirenSettings();
  const context = SillyTavern.getContext();
  if (settings.tts.doubao) {
    $("#siren-db-appid").val(settings.tts.doubao.app_id || "");
    $("#siren-db-ak").val(settings.tts.doubao.access_key || "");
  }
  loadCharacterDoubaoSettings();
  $("#siren-db-char-save").off("click").on("click", async function(e, isSilent = false) {
    settings.tts.doubao.app_id = $("#siren-db-appid").val().trim();
    settings.tts.doubao.access_key = $("#siren-db-ak").val().trim();
    saveSirenSettings(true);
    const voiceMap = {};
    $("#siren-db-char-list .siren-db-char-row:not(.siren-db-deleted)").each(
      function() {
        const charName = $(this).find(".siren-db-char-name").val().trim();
        const speakerVal = $(this).find(".siren-db-speaker-input").val()?.trim() || "";
        const modelVal = $(this).find(".siren-db-model-select").val();
        if (charName && speakerVal) {
          voiceMap[charName] = {
            speaker: speakerVal,
            model: modelVal
          };
        }
      }
    );
    const context2 = SillyTavern.getContext();
    const charExt = context2.characters?.[context2.characterId]?.data?.extensions?.siren_voice_tts_doubao || {};
    const oldVoices = charExt.voices || {};
    for (const oldChar of Object.keys(oldVoices)) {
      if (voiceMap[oldChar] === void 0) {
        voiceMap[oldChar] = null;
      }
    }
    const success = await saveToCharacterCard(
      "siren_voice_tts_doubao",
      {
        voices: voiceMap
      },
      true
    );
    if (success) {
      if (!isSilent && window.toastr) {
        window.toastr.success("Doubao: \u914D\u7F6E\u5DF2\u4FDD\u5B58\uFF0C\u5DF2\u81EA\u52A8\u5207\u6362\u5E76\u540C\u6B65\u4E16\u754C\u4E66\uFF01");
      }
      refreshTestCharacterSelect(voiceMap);
      const currentSettings = getSirenSettings();
      currentSettings.tts.provider = "doubao";
      currentSettings.tts.enabled = true;
      saveSirenSettings(true);
      await syncTtsWorldbookEntries("doubao", true);
    }
  });
  $("#siren-db-char-add").off("click").on("click", function() {
    addCharRow("", "seed-tts-2.0", "zh_female_vv_uranus_bigtts");
  });
  $("#siren-db-test-generate").off("click").on("click", async function() {
    const charName = $("#siren-db-test-char").val();
    const emotionPrompt = $("#siren-db-test-emotion").val().trim();
    const text = $("#siren-db-test-text").val().trim();
    if (!charName)
      return window.toastr && window.toastr.warning("\u8BF7\u5148\u5728\u4E0A\u65B9\u914D\u7F6E\u89D2\u8272\u6620\u5C04\u5E76\u70B9\u51FB\u4FDD\u5B58\uFF01");
    if (!text)
      return window.toastr && window.toastr.warning("\u6D4B\u8BD5\u6587\u672C\u4E0D\u80FD\u4E3A\u7A7A");
    const context2 = SillyTavern.getContext();
    const charExt = context2.characters?.[context2.characterId]?.data?.extensions?.siren_voice_tts_doubao || {};
    const config = charExt.voices?.[charName];
    if (!config)
      return window.toastr && window.toastr.error("\u672A\u80FD\u8BFB\u53D6\u5230\u8BE5\u89D2\u8272\u7684\u97F3\u8272\u914D\u7F6E");
    const settings2 = getSirenSettings();
    const appId = settings2.tts.doubao?.app_id;
    const accessKey = settings2.tts.doubao?.access_key;
    if (!appId || !accessKey)
      return window.toastr && window.toastr.error("\u8BF7\u5148\u914D\u7F6E\u5E76\u4FDD\u5B58 App ID \u548C Access Key\uFF01");
    $("#siren-db-test-status").text("\u6B63\u5728\u5411\u8C46\u5305\u53D1\u8D77\u8BF7\u6C42...").css("color", "#3b82f6");
    $("#siren-db-test-audio").hide();
    $("#siren-db-test-download").hide();
    $(this).prop("disabled", true).css("opacity", "0.6");
    try {
      const blobUrl = await generateDoubaoTestAudio({
        appId,
        accessKey,
        model: config.model,
        speaker: config.speaker,
        emotionPrompt,
        text
      });
      const $audio = $("#siren-db-test-audio");
      releaseAudioElement($audio[0]);
      $audio.attr("src", blobUrl);
      $audio.show();
      $audio[0].play();
      const $download = $("#siren-db-test-download");
      $download.attr("href", blobUrl);
      $download.attr("download", `Doubao_Test_${charName}.mp3`);
      $download.show().css("display", "flex");
      $("#siren-db-test-status").text("\u751F\u6210\u6210\u529F\uFF01").css("color", "#10b981");
    } catch (err) {
      $("#siren-db-test-status").text("\u751F\u6210\u5931\u8D25 (\u8BE6\u89C1\u63A7\u5236\u53F0)").css("color", "#ef4444");
      if (window.toastr) window.toastr.error(err.message || "\u8BF7\u6C42\u5931\u8D25");
    } finally {
      $(this).prop("disabled", false).css("opacity", "1");
    }
  });
  context.eventSource.on("chat_id_changed", loadCharacterDoubaoSettings);
}
function loadCharacterDoubaoSettings() {
  const context = SillyTavern.getContext();
  const $list = $("#siren-db-char-list");
  $list.empty();
  if (!context.characterId) {
    $list.html(
      `<div style="color:#64748b; font-size:0.9em; text-align:center; padding: 10px;">\u5F53\u524D\u672A\u9009\u4E2D\u89D2\u8272\uFF0C\u8BF7\u5728\u5BF9\u8BDD\u5185\u8BBE\u7F6E\u3002</div>`
    );
    refreshTestCharacterSelect({});
    return;
  }
  const charExt = context.characters?.[context.characterId]?.data?.extensions?.siren_voice_tts_doubao || {};
  const voices = charExt.voices || {};
  let hasValidVoice = false;
  const validVoiceMap = {};
  if (Object.keys(voices).length > 0) {
    for (const [charName, config] of Object.entries(voices)) {
      if (!config) continue;
      hasValidVoice = true;
      validVoiceMap[charName] = config;
      addCharRow(charName, config.model, config.speaker);
    }
  }
  if (!hasValidVoice) {
    addCharRow("", "seed-tts-2.0", "zh_female_vv_uranus_bigtts");
  }
  refreshTestCharacterSelect(validVoiceMap);
}
function refreshTestCharacterSelect(voiceMap) {
  const $select = $("#siren-db-test-char");
  $select.empty();
  const charNames = Object.keys(voiceMap);
  if (charNames.length === 0) {
    $select.append('<option value="">(\u8BF7\u5148\u914D\u7F6E\u5E76\u4FDD\u5B58\u4E0A\u65B9\u89D2\u8272)</option>');
    return;
  }
  charNames.forEach((name) => {
    $select.append(`<option value="${name}">${name}</option>`);
  });
}
function addCharRow(name, model, speaker) {
  const rowId = "db-row-" + Date.now() + Math.floor(Math.random() * 1e3);
  const rowHtml = `
        <div id="${rowId}" class="siren-ext-setting-row siren-db-char-row" style="display: flex; flex-direction: column; gap: 8px; padding: 12px; background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; margin-bottom: 4px;">
            
            <div style="display: flex; gap: 8px; width: 100%; align-items: center;">
                <input type="text" class="siren-ext-input siren-db-char-name" placeholder="\u89D2\u8272\u540D" value="${name}" style="flex: 1; min-width: 0; height: 32px; box-sizing: border-box; margin: 0;">
                
                <select class="siren-ext-select siren-db-model-select" style="flex: 1.5; min-width: 0; height: 32px; box-sizing: border-box; margin: 0;">
                    <option value="seed-tts-2.0">\u5B98\u65B9\u5408\u6210 2.0</option>
                    <option value="seed-icl-2.0">\u58F0\u97F3\u590D\u523B 2.0</option>
                    <option value="seed-icl-1.0">\u58F0\u97F3\u590D\u523B 1.0</option>
                </select>
            </div>
            
            <div style="display: flex; gap: 8px; width: 100%; align-items: center;">
                <div class="siren-db-speaker-container" style="flex: 1; min-width: 0; display: flex; align-items: center; height: 32px;">
                    </div>
                
                <button class="siren-ext-btn siren-db-btn-del" style="background:none; border:none; width: 30px; height: 32px; padding: 0 5px; box-sizing: border-box; margin: 0; color: #ef4444; flex-shrink: 0; display: flex; align-items: center; justify-content: center;" title="\u5220\u9664">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        </div>
    `;
  const $row = $(rowHtml);
  const $modelSelect = $row.find(".siren-db-model-select");
  const $speakerContainer = $row.find(".siren-db-speaker-container");
  $modelSelect.val(model || "seed-tts-2.0");
  function renderSpeakerField(currentModel, currentValue) {
    if (currentModel === "seed-tts-2.0") {
      let initialName = "";
      if (currentValue) {
        const found = DOUBAO_VOICES_2_0.find((v) => v.id === currentValue);
        if (found) initialName = found.name;
      }
      let listHtml = DOUBAO_VOICES_2_0.map(
        (v) => `<div class="siren-db-voice-item" data-id="${v.id}" data-name="${v.name}" style="padding: 6px 10px; cursor: pointer; color: #cbd5e1; font-size: 0.9em; border-bottom: 1px solid rgba(255,255,255,0.05);">${v.name}</div>`
      ).join("");
      const html = `
        <div class="siren-db-searchable-select" style="position: relative; width: 100%; height: 32px;">
            <input type="hidden" class="siren-db-speaker-input" value="${currentValue || ""}">
            
            <input type="text" class="siren-ext-input siren-db-speaker-search" placeholder="\u641C\u7D22\u6216\u9009\u62E9\u97F3\u8272..." value="${initialName}" style="width: 100%; height: 32px; box-sizing: border-box; margin: 0; padding-right: 25px;">
            <i class="fa-solid fa-chevron-down" style="position: absolute; right: 10px; top: 10px; color: #64748b; font-size: 0.8em; pointer-events: none;"></i>
            
            <div class="siren-db-speaker-dropdown" style="display: none; position: absolute; top: 100%; left: 0; width: 100%; max-height: 200px; overflow-y: auto; background: #1e293b; border: 1px solid #475569; border-radius: 4px; z-index: 9999; margin-top: 4px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5);">
                ${listHtml}
            </div>
        </div>
      `;
      $speakerContainer.html(html);
      const $search = $speakerContainer.find(".siren-db-speaker-search");
      const $hidden = $speakerContainer.find(".siren-db-speaker-input");
      const $dropdown = $speakerContainer.find(".siren-db-speaker-dropdown");
      const $items = $speakerContainer.find(".siren-db-voice-item");
      $search.on("focus click", function() {
        $dropdown.show();
        $(this).select();
      });
      $search.on("input", function() {
        const keyword = $(this).val().toLowerCase();
        $dropdown.show();
        $items.each(function() {
          const text = $(this).data("name").toLowerCase();
          if (text.includes(keyword)) {
            $(this).show();
          } else {
            $(this).hide();
          }
        });
      });
      $search.on("blur", function() {
        setTimeout(() => {
          $dropdown.hide();
          const currentId = $hidden.val();
          const found = DOUBAO_VOICES_2_0.find((v) => v.id === currentId);
          if ($search.val().trim() === "") {
            $hidden.val("");
          } else if (found) {
            $search.val(found.name);
          } else {
            $search.val("");
            $hidden.val("");
          }
        }, 150);
      });
      $items.on("mouseenter", function() {
        $(this).css("background", "rgba(59, 130, 246, 0.5)");
      });
      $items.on("mouseleave", function() {
        $(this).css("background", "transparent");
      });
      $items.on("click", function() {
        const id = $(this).data("id");
        const name2 = $(this).data("name");
        $hidden.val(id);
        $search.val(name2);
        $dropdown.hide();
        $items.show();
      });
    } else {
      $speakerContainer.html(`
                <input type="text" class="siren-ext-input siren-db-speaker-input" placeholder="\u8F93\u5165\u590D\u523B\u97F3\u8272ID" style="width: 100%; height: 32px; box-sizing: border-box; margin: 0;">
            `);
      if (currentValue && !DOUBAO_VOICES_2_0.some((v) => v.id === currentValue)) {
        $speakerContainer.find("input").val(currentValue);
      }
    }
  }
  renderSpeakerField($modelSelect.val(), speaker);
  $modelSelect.on("change", function() {
    const newModel = $(this).val();
    const currentSpeaker = $speakerContainer.find(".siren-db-speaker-input").val();
    renderSpeakerField(newModel, currentSpeaker);
  });
  $row.find(".siren-db-btn-del").on("click", function() {
    $row.addClass("siren-db-deleted");
    $row.slideUp(150, () => $row.remove());
  });
  $("#siren-db-char-list").append($row);
}

// scripts/gpt-sovits.js
init_runtime();
init_settings();
init_gptsovits_logic();
init_utils();
var rowInputStyle = "height: 32px !important; min-height: 32px !important; max-height: 32px !important; box-sizing: border-box !important; padding: 0 8px !important; line-height: 30px !important; margin: 0 !important; vertical-align: middle;";
function getGptSovitsHtml() {
  return `
        <style>
            .siren-no-spin::-webkit-inner-spin-button, 
            .siren-no-spin::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
            .siren-no-spin { -moz-appearance: textfield; }
        </style>

        <div id="siren-gptsovits-wrapper" style="display: flex; flex-direction: column; gap: 15px;">
        <datalist id="siren-gsv-ref-list"></datalist>
            
            <div style="background: rgba(15, 23, 42, 0.4); border: 1px solid #334155; border-radius: 6px; padding: 15px;">
                <h4 style="color: #38bdf8; margin-top: 0; margin-bottom: 15px;">
                    <i class="fa-solid fa-server" style="margin-right: 5px;"></i>\u670D\u52A1\u8FDE\u63A5 (\u5168\u5C40\u4FDD\u5B58)
                </h4>
                
                <div class="siren-ext-setting-row siren-ext-flex-between" style="margin-bottom: 10px; gap: 10px;">
                    <div class="siren-ext-setting-label" style="white-space: nowrap; flex-shrink: 0;">API Base URL</div>
                    
                    <div style="display: flex; gap: 5px; flex: 1; max-width: 75%; min-width: 0; justify-content: flex-end;">
                        <input type="text" id="siren-gsv-api" class="siren-ext-input" style="flex: 1; min-width: 0; height: 32px; box-sizing: border-box;" placeholder="http://127.0.0.1:9880" value="http://127.0.0.1:9880">
                        
                        <button id="siren-gsv-check-btn" class="siren-ext-btn siren-ext-btn-secondary" title="\u6D4B\u8BD5\u8FDE\u63A5" style="width: 32px; height: 32px; padding: 0; flex-shrink: 0; display: flex; align-items: center; justify-content: center;">
                            <i class="fa-solid fa-link"></i>
                        </button>
                    </div>
                </div>

                <div class="siren-ext-setting-row siren-ext-flex-between" style="margin-bottom: 10px;">
                    <div class="siren-ext-setting-label">API Key</div>
                    <input type="password" id="siren-gsv-apikey" class="siren-ext-input" style="max-width: 60%;" placeholder="App Key">
                </div>

                <div class="siren-ext-setting-row siren-ext-flex-between">
                    <div class="siren-ext-setting-label">
                        <label>\u53C2\u8003\u97F3\u9891\u4E0A\u4F20</label>
                        <small style="display:block; color: #64748b;">\u4E0A\u4F20\u53C2\u8003\u97F3\u9891\u5230custom_refs</small>
                    </div>
                    <div>
                        <input type="file" id="siren-gsv-file-input" multiple accept=".wav,.mp3,.flac,.ogg" style="display: none;">
                        <button id="siren-gsv-upload-trigger" class="siren-ext-btn siren-ext-btn-secondary">
                            <i class="fa-solid fa-folder-open" style="margin-right: 5px;"></i>\u9009\u62E9\u6587\u4EF6
                        </button>
                    </div>
                </div>

                <div id="siren-gsv-upload-staging" style="display: none; margin-top: 10px; background: rgba(0,0,0,0.2); padding: 10px; border-radius: 4px; border: 1px dashed #475569;">
                    <div id="siren-gsv-upload-tags" style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 10px;">
                        </div>
                    <div style="display: flex; justify-content: flex-end; gap: 8px;">
                        <button id="siren-gsv-upload-cancel" class="siren-ext-btn siren-ext-btn-secondary" style="color: #ef4444; border-color: rgba(239,68,68,0.3);">\u53D6\u6D88</button>
                        <button id="siren-gsv-upload-confirm" class="siren-ext-btn siren-ext-btn-secondary" style="color: #10b981; border-color: rgba(16,185,129,0.3);">\u786E\u8BA4</button>
                    </div>
                </div>
            </div>

            <div style="background: rgba(15, 23, 42, 0.4); border: 1px solid #334155; border-radius: 6px; padding: 15px;">
                <h4 style="color: #fbbf24; margin-top: 0; margin-bottom: 15px;">
                    <i class="fa-solid fa-sliders" style="margin-right: 5px;"></i>\u5168\u5C40\u9AD8\u7EA7\u53C2\u6570 (\u9ED8\u8BA4\u4E0E\u964D\u7EA7\u515C\u5E95)
                </h4>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
    <div style="grid-column: 1 / -1; display: flex; flex-direction: column; gap: 6px;">
        <span style="font-size: 0.85em; color: #cbd5e1;">\u6587\u672C\u5207\u5206\u7B56\u7565</span>
        <select id="siren-gsv-global-split" class="siren-ext-select" style="${rowInputStyle} width: 100%;">
            <option value="\u6309\u6807\u70B9\u7B26\u53F7\u5207">\u6309\u6807\u70B9\u7B26\u53F7\u5207 (\u63A8\u8350)</option>
            <option value="\u51D1\u56DB\u53E5\u4E00\u5207">\u51D1\u56DB\u53E5\u4E00\u5207</option>
            <option value="\u51D150\u5B57\u4E00\u5207">\u51D150\u5B57\u4E00\u5207</option>
            <option value="\u6309\u4E2D\u6587\u53E5\u53F7\u3002\u5207">\u6309\u4E2D\u6587\u53E5\u53F7\u3002\u5207</option>
            <option value="\u6309\u82F1\u6587\u53E5\u53F7.\u5207">\u6309\u82F1\u6587\u53E5\u53F7.\u5207</option>
            <option value="\u4E0D\u5207">\u4E0D\u5207</option>
        </select>
    </div>

    <div style="display: flex; flex-direction: column; gap: 6px;">
        <div style="display:flex; justify-content:space-between; font-size: 0.85em; color: #94a3b8;">
            <span>\u53E5\u95F4\u505C\u987F</span><span id="siren-gsv-interval-val" style="color: #facc15;">0.3s</span>
        </div>
        <input type="range" id="siren-gsv-global-interval" class="siren-ext-slider-input" min="0.1" max="0.5" step="0.05" value="0.3" style="--theme-color: #facc15;">
    </div>

    <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 14px;">
        <span style="font-size: 0.85em; color: #cbd5e1;">\u5E76\u884C\u63A8\u7406</span>
        <label class="siren-ext-switch" style="flex-shrink: 0;">
            <input type="checkbox" id="siren-gsv-global-parallel" checked>
            <span class="siren-ext-slider"></span>
        </label>
    </div>

    <div style="display: flex; flex-direction: column; gap: 6px;">
        <div style="display:flex; justify-content:space-between; font-size:0.8em; color:#94a3b8;"><span>\u8BED\u901F</span><span id="siren-gsv-global-speed-val" style="color:#facc15;">1.0</span></div>
        <input type="range" id="siren-gsv-global-speed" class="siren-ext-slider-input" min="0.6" max="1.65" step="0.05" value="1.0" style="--theme-color: #facc15;">
    </div>

    <div style="display: flex; flex-direction: column; gap: 6px;">
        <div style="display:flex; justify-content:space-between; font-size:0.8em; color:#94a3b8;"><span>\u6E29\u5EA6</span><span id="siren-gsv-global-temp-val" style="color:#facc15;">1.0</span></div>
        <input type="range" id="siren-gsv-global-temp" class="siren-ext-slider-input" min="0" max="1" step="0.05" value="1.0" style="--theme-color: #facc15;">
    </div>

    <div style="display: flex; flex-direction: column; gap: 6px;">
        <div style="display:flex; justify-content:space-between; font-size:0.8em; color:#94a3b8;"><span>Top P</span><span id="siren-gsv-global-topp-val" style="color:#facc15;">1.0</span></div>
        <input type="range" id="siren-gsv-global-topp" class="siren-ext-slider-input" min="0" max="1" step="0.05" value="1.0" style="--theme-color: #facc15;">
    </div>

    <div style="display: flex; flex-direction: column; gap: 6px;">
        <div style="display:flex; justify-content:space-between; font-size:0.8em; color:#94a3b8;"><span>Top K</span><span id="siren-gsv-global-topk-val" style="color:#facc15;">15</span></div>
        <input type="range" id="siren-gsv-global-topk" class="siren-ext-slider-input" min="1" max="100" step="1" value="15" style="--theme-color: #facc15;">
    </div>

    <div style="display: flex; flex-direction: column; gap: 6px;">
        <div style="display:flex; justify-content:space-between; font-size:0.8em; color:#94a3b8;"><span>\u91CD\u590D\u60E9\u7F5A</span><span id="siren-gsv-global-rep-val" style="color:#facc15;">1.35</span></div>
        <input type="range" id="siren-gsv-global-rep" class="siren-ext-slider-input" min="1" max="2" step="0.05" value="1.35" style="--theme-color: #facc15;">
    </div>

    <div style="display: flex; flex-direction: column; gap: 6px;">
        <div style="font-size:0.8em; color:#94a3b8;">\u79CD\u5B50</div>
        <input type="number" id="siren-gsv-global-seed" class="siren-ext-input siren-no-spin" value="-1" style="${rowInputStyle} width: 100%;">
    </div>
</div>
            </div>

            <div style="background: rgba(15, 23, 42, 0.4); border: 1px solid #334155; border-radius: 6px; padding: 15px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <h4 style="color: #a855f7; margin: 0;">
                        <i class="fa-solid fa-users" style="margin-right: 5px;"></i>\u89D2\u8272\u97F3\u8272\u7ED1\u5B9A
                    </h4>
                    <button id="siren-gsv-refresh-models" class="siren-ext-btn siren-ext-btn-secondary" style="padding: 4px 8px; font-size: 0.85em;">
                        <i class="fa-solid fa-rotate" style="margin-right: 4px;"></i>\u83B7\u53D6\u6A21\u578B\u5217\u8868
                    </button>
                </div>
                
                <div id="siren-gsv-char-list" style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 10px;">
                    </div>
                
                <button id="siren-gsv-add-char" class="siren-ext-btn siren-ext-btn-secondary" style="width: 100%; border-style: dashed;">
                    <i class="fa-solid fa-plus"></i> \u6DFB\u52A0\u89D2\u8272\u6620\u5C04
                </button>
            </div>

            <div style="background: rgba(15, 23, 42, 0.4); border: 1px solid #334155; border-radius: 6px; padding: 15px;">
                <h4 style="color: #f472b6; margin-top: 0; margin-bottom: 10px;">
                    <i class="fa-solid fa-masks-theater" style="margin-right: 5px;"></i>\u60C5\u7EEA\u89C4\u5219\u914D\u7F6E
                </h4>
                <div id="siren-gsv-emo-list" style="display: flex; flex-direction: column; gap: 6px; margin-bottom: 8px;">
                </div>
                
                <button id="siren-gsv-add-emo" class="siren-ext-btn siren-ext-btn-secondary" style="width: 100%; border-style: dashed;">
                    <i class="fa-solid fa-plus"></i> \u6DFB\u52A0\u60C5\u7EEA\u89C4\u5219
                </button>
            </div>
            
            <div style="display: flex; justify-content: center; margin-top: 10px;">
                <button id="siren-gsv-save-btn" class="siren-ext-btn siren-ext-btn-primary" style="width: 100%; padding: 12px 0; justify-content: center; font-size: 1.05em; background: #10b981; border-color: #10b981;">
                    <i class="fa-solid fa-floppy-disk" style="margin-right: 8px;"></i>\u4FDD\u5B58 GSV \u914D\u7F6E
                </button>
            </div>

            <div style="margin-top: 10px; border-top: 1px dashed #475569; padding-top: 20px;">
                <h4 style="color: #10b981; margin-bottom: 10px; font-size: 1.1em;">
                    <i class="fa-solid fa-vial" style="margin-right: 5px;"></i> GPT-SoVITS \u53D1\u97F3\u6D4B\u8BD5
                </h4>
                <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 6px; padding: 15px;">
                    
                    <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 10px;">
                        <select id="siren-gsv-test-char" class="siren-ext-select" style="${rowInputStyle} flex: 1; min-width: 160px;">
                            <option value="">(\u8BF7\u5148\u4FDD\u5B58\u914D\u7F6E\u540E\u9009\u62E9\u89D2\u8272)</option>
                        </select>
                        <select id="siren-gsv-test-mood" class="siren-ext-select" style="${rowInputStyle} flex: 1; min-width: 160px;">
                            <option value="">(\u4F7F\u7528\u9ED8\u8BA4\u89D2\u8272\u60C5\u7EEA)</option>
                        </select>
                    </div>

                    <textarea id="siren-gsv-test-text" class="siren-ext-textarea" rows="2" placeholder="\u8F93\u5165\u4E00\u53E5\u53F0\u8BCD\uFF0C\u6D4B\u8BD5 GSV \u5F15\u64CE\u8F93\u51FA..." style="margin-bottom: 10px;"></textarea>
                    
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <button id="siren-gsv-test-generate" class="siren-ext-btn siren-ext-btn-primary" style="background: #10b981; border-color: #10b981;">
                            <i class="fa-solid fa-bolt"></i> \u751F\u6210
                        </button>
                        
                        <div id="siren-gsv-test-preview" style="flex: 1; margin-left: 15px; display: flex; align-items: center; gap: 10px;">
                            <audio id="siren-gsv-test-audio" controls style="height: 32px; flex: 1; display: none;"></audio>
                            
                            <a id="siren-gsv-test-download" class="siren-ext-btn siren-ext-btn-secondary" style="display: none; padding: 4px 10px; text-decoration: none; color: #cbd5e1;" download="siren_gsv_test.wav" title="\u4E0B\u8F7D\u97F3\u9891\u6392\u67E5\u541E\u5B57">
                                <i class="fa-solid fa-download"></i>
                            </a>
                            
                            <span id="siren-gsv-test-status" style="color: #64748b; font-size: 0.85em; white-space: nowrap;">\u7B49\u5F85\u751F\u6210...</span>
                        </div>
                    </div>
                </div>
            </div>

            <div id="siren-gsv-adv-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(6, 11, 23, 0.85); backdrop-filter: blur(4px); z-index: 10000; align-items: center; justify-content: center;">
                <div style="background: #0f172a; border: 1px solid #f59e0b; border-radius: 12px; width: 450px; padding: 25px; box-shadow: 0 10px 30px rgba(0,0,0,0.8);">
                    <h3 style="margin: 0 0 15px 0; color: #fcd34d; border-bottom: 1px solid #334155; padding-bottom: 10px;">
                        <i class="fa-solid fa-sliders" style="margin-right:8px;"></i>\u89D2\u8272\u72EC\u7ACB\u63A8\u7406\u53C2\u6570
                    </h3>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px;">
    <div>
        <div style="display:flex; justify-content:space-between; font-size:0.85em; color:#9ca3af;"><span>\u8BED\u901F</span><span id="siren-gsv-mod-speed-val" style="color:#facc15;">1.0</span></div>
        <input type="range" id="siren-gsv-mod-speed" class="siren-ext-slider-input" min="0.6" max="1.65" step="0.05" value="1.0" style="--theme-color: #facc15;">
    </div>
    <div>
        <div style="display:flex; justify-content:space-between; font-size:0.85em; color:#9ca3af;"><span>\u6E29\u5EA6</span><span id="siren-gsv-mod-temp-val" style="color:#facc15;">1.0</span></div>
        <input type="range" id="siren-gsv-mod-temp" class="siren-ext-slider-input" min="0" max="1" step="0.05" value="1.0" style="--theme-color: #facc15;">
    </div>
    <div>
        <div style="display:flex; justify-content:space-between; font-size:0.85em; color:#9ca3af;"><span>Top P</span><span id="siren-gsv-mod-topp-val" style="color:#facc15;">1.0</span></div>
        <input type="range" id="siren-gsv-mod-topp" class="siren-ext-slider-input" min="0" max="1" step="0.05" value="1.0" style="--theme-color: #facc15;">
    </div>
    <div>
        <div style="display:flex; justify-content:space-between; font-size:0.85em; color:#9ca3af;"><span>Top K</span><span id="siren-gsv-mod-topk-val" style="color:#facc15;">15</span></div>
        <input type="range" id="siren-gsv-mod-topk" class="siren-ext-slider-input" min="1" max="100" step="1" value="15" style="--theme-color: #facc15;">
    </div>
    <div>
        <div style="display:flex; justify-content:space-between; font-size:0.85em; color:#9ca3af;"><span>\u91CD\u590D\u60E9\u7F5A</span><span id="siren-gsv-mod-rep-val" style="color:#facc15;">1.35</span></div>
        <input type="range" id="siren-gsv-mod-rep" class="siren-ext-slider-input" min="1" max="2" step="0.05" value="1.35" style="--theme-color: #facc15;">
    </div>
    <div></div>
    <div>
        <div style="font-size:0.85em; color:#9ca3af; margin-bottom: 8px;">\u79CD\u5B50</div>
        <input type="number" id="siren-gsv-mod-seed" class="siren-ext-input siren-no-spin" value="-1" style="${rowInputStyle} width: 100%;">
    </div>
    <div>
        <div style="font-size:0.85em; color:#9ca3af; margin-bottom: 8px;">\u8F93\u51FA\u8BED\u8A00</div>
        <select id="siren-gsv-mod-textlang" class="siren-ext-select" style="${rowInputStyle} width: 100%;">
            <option value="\u4E2D\u6587">\u4E2D\u6587</option>
            <option value="\u82F1\u8BED">\u82F1\u8BED</option>
            <option value="\u65E5\u8BED">\u65E5\u8BED</option>
            <option value="\u7CA4\u8BED">\u7CA4\u8BED</option>
            <option value="\u97E9\u8BED">\u97E9\u8BED</option>
            <option value="\u4E2D\u82F1\u6DF7\u5408">\u4E2D\u82F1\u6DF7\u5408</option>
            <option value="\u65E5\u82F1\u6DF7\u5408">\u65E5\u82F1\u6DF7\u5408</option>
            <option value="\u7CA4\u82F1\u6DF7\u5408">\u7CA4\u82F1\u6DF7\u5408</option>
            <option value="\u97E9\u82F1\u6DF7\u5408">\u97E9\u82F1\u6DF7\u5408</option>
            <option value="\u591A\u8BED\u79CD\u6DF7\u5408">\u591A\u8BED\u79CD\u6DF7\u5408</option>
            <option value="\u591A\u8BED\u79CD\u6DF7\u5408(\u7CA4\u8BED)">\u591A\u8BED\u79CD\u6DF7\u5408(\u7CA4\u8BED)</option>
        </select>
    </div>
</div>

                    <div style="display: flex; justify-content: flex-end; gap: 12px;">
                        <button id="siren-gsv-mod-cancel" class="siren-ext-btn siren-ext-btn-secondary">\u53D6\u6D88</button>
                        <button id="siren-gsv-mod-save" class="siren-ext-btn siren-ext-btn-primary" style="background: linear-gradient(135deg, #d97706, #f59e0b); border: none; box-shadow: 0 2px 10px rgba(245,158,11,0.4);">
                            <i class="fa-solid fa-check"></i> \u786E\u8BA4
                        </button>
                    </div>
                </div>
            </div>

        </div>
    `;
}
function getGptSovitsCardData2() {
  const context = SillyTavern.getContext();
  const charId = context.characterId;
  if (charId !== void 0 && charId !== null && context.characters && context.characters[charId]) {
    return context.characters[charId].data?.extensions?.siren_voice_gptsovits || {};
  }
  return {};
}
function syncEmoCharDropdowns() {
  const charNames = [];
  $("#siren-gsv-char-list .siren-gsv-char-name").each(function() {
    const val = $(this).val().trim();
    if (val && !charNames.includes(val)) charNames.push(val);
  });
  $("#siren-gsv-emo-list .siren-gsv-emo-char").each(function() {
    const $sel = $(this);
    const currentVal = $sel.attr("data-current-val") || $sel.val();
    $sel.empty();
    $sel.append('<option value="">\u9009\u62E9\u5173\u8054\u89D2\u8272...</option>');
    let found = false;
    charNames.forEach((name) => {
      const selected = name === currentVal ? "selected" : "";
      if (name === currentVal) found = true;
      $sel.append(`<option value="${name}" ${selected}>${name}</option>`);
    });
    if (currentVal && !found) {
      $sel.append(
        `<option value="${currentVal}" selected>${currentVal} (\u672A\u5728\u5217\u8868\u4E2D\u627E\u5230)</option>`
      );
    }
    $sel.attr("data-current-val", $sel.val());
  });
}
function bindGptSovitsEvents() {
  const settings = getSirenSettings();
  let pendingUploadFiles = [];
  let cachedAudioList = [];
  async function fetchCustomRefs() {
    const apiBase = $("#siren-gsv-api").val().trim().replace(/\/$/, "");
    if (!apiBase) return;
    try {
      const res = await fetch(`${apiBase}/custom_refs`);
      if (res.ok) {
        const data = await res.json();
        cachedAudioList = data.files || [];
        const $datalist = $("#siren-gsv-ref-list");
        $datalist.empty();
        cachedAudioList.forEach((filename) => {
          $datalist.append(`<option value="${filename}">`);
        });
        console.log(
          `[Siren GSV] \u6210\u529F\u62C9\u53D6\u5E76\u7F13\u5B58 ${cachedAudioList.length} \u4E2A\u53C2\u8003\u97F3\u9891`
        );
      }
    } catch (e) {
      console.warn(
        "[Siren GSV] \u83B7\u53D6\u53C2\u8003\u97F3\u9891\u5217\u8868\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u540E\u7AEF\u63A5\u53E3:",
        e.message
      );
    }
  }
  $("#siren-gptsovits-wrapper").on(
    "focus",
    "input[list='siren-gsv-ref-list']",
    function() {
      if ($("#siren-gsv-ref-list").children().length === 0) {
        fetchCustomRefs();
      }
    }
  );
  $("#siren-gsv-check-btn").on("click", async function() {
    const apiBase = $("#siren-gsv-api").val().trim().replace(/\/$/, "");
    const $icon = $(this).find("i");
    $icon.removeClass("fa-link").addClass("fa-spinner fa-spin");
    try {
      const res = await fetch(`${apiBase}/version`, { method: "GET" });
      if (res.ok) {
        const data = await res.json();
        if (window.toastr)
          window.toastr.success(`GSV \u8FDE\u63A5\u6210\u529F\uFF01\u7248\u672C: ${JSON.stringify(data)}`);
        fetchCustomRefs();
      } else {
        throw new Error(`HTTP ${res.status}`);
      }
    } catch (err) {
      if (window.toastr)
        window.toastr.error("\u8FDE\u63A5\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u540E\u7AEF\u662F\u5426\u542F\u52A8\u53CA\u8DE8\u57DF\u8BBE\u7F6E");
      console.error("[Siren GSV] \u8FDE\u63A5\u6D4B\u8BD5\u5931\u8D25:", err);
    } finally {
      $icon.removeClass("fa-spinner fa-spin").addClass("fa-link");
    }
  });
  $("#siren-gsv-refresh-models").on("click", async function() {
    const apiBase = $("#siren-gsv-api").val().trim().replace(/\/$/, "");
    if (!apiBase) {
      if (window.toastr) window.toastr.warning("\u8BF7\u5148\u586B\u5199 API Base URL");
      return;
    }
    const $icon = $(this).find("i");
    $icon.removeClass("fa-rotate").addClass("fa-spinner fa-spin");
    const versions = ["v4", "v2Pro", "v2ProPlus"];
    let allGptOptions = [];
    let allSovitsOptions = [];
    try {
      for (const v of versions) {
        try {
          const res = await fetch(`${apiBase}/classic_model_list/${v}`);
          if (!res.ok) continue;
          const data = await res.json();
          console.log(`[Siren GSV] \u7248\u672C [${v}] \u83B7\u53D6\u5230\u7684\u539F\u59CB\u6570\u636E:`, data);
          const gpts = data.gpt_models || data.GPT_models || data.gpt_model_list || data.GPT_model_list || data.gpt || [];
          const sovits = data.sovits_models || data.SoVITS_models || data.sovits_model_list || data.SoVITS_model_list || data.sovits || [];
          gpts.forEach((m) => {
            allGptOptions.push({
              label: `[${v}] ${m}`,
              value: `${v}::${m}`
            });
          });
          sovits.forEach((m) => {
            allSovitsOptions.push({
              label: `[${v}] ${m}`,
              value: `${v}::${m}`
            });
          });
        } catch (e) {
          console.warn(`[Siren GSV] \u8DF3\u8FC7\u7248\u672C ${v}\uFF0C\u539F\u56E0:`, e.message);
        }
      }
      if (allGptOptions.length === 0 && allSovitsOptions.length === 0) {
        if (window.toastr)
          window.toastr.warning(
            "\u63A5\u53E3\u8C03\u7528\u6210\u529F\uFF0C\u4F46\u672A\u80FD\u89E3\u6790\u5230\u6A21\u578B\u3002\u8BF7\u6309 F12 \u68C0\u67E5\u63A7\u5236\u53F0\u6570\u636E\uFF01"
          );
      } else {
        if (window.toastr)
          window.toastr.success(
            `\u6A21\u578B\u540C\u6B65\u6210\u529F\uFF01\u5171\u53D1\u73B0 ${allGptOptions.length} \u4E2AGPT\u6A21\u578B`
          );
        fetchCustomRefs();
      }
      $(".siren-gsv-char-gpt, .siren-gsv-emo-gpt").each(function() {
        const currentVal = $(this).val();
        $(this).empty().append('<option value="">\u9009\u62E9GPT\u6A21\u578B</option>');
        allGptOptions.forEach(
          (opt) => $(this).append(`<option value="${opt.value}">${opt.label}</option>`)
        );
        if (currentVal && allGptOptions.find((o) => o.value === currentVal)) {
          $(this).val(currentVal);
        }
      });
      $(".siren-gsv-char-sovits").each(function() {
        const currentVal = $(this).val();
        $(this).empty().append('<option value="">\u9009\u62E9SoVITS\u6A21\u578B</option>');
        allSovitsOptions.forEach(
          (opt) => $(this).append(`<option value="${opt.value}">${opt.label}</option>`)
        );
        if (currentVal && allSovitsOptions.find((o) => o.value === currentVal)) {
          $(this).val(currentVal);
        }
      });
    } catch (err) {
      console.error("[Siren GSV] \u5237\u65B0\u5931\u8D25:", err);
      if (window.toastr)
        window.toastr.error("\u6A21\u578B\u5237\u65B0\u51FA\u9519\uFF0C\u8BF7\u68C0\u67E5\u7F51\u7EDC\u6216\u540E\u7AEF\u65E5\u5FD7\u3002");
    } finally {
      $icon.removeClass("fa-spinner fa-spin").addClass("fa-rotate");
    }
  });
  $("#siren-gsv-upload-trigger").on(
    "click",
    () => $("#siren-gsv-file-input").click()
  );
  $("#siren-gsv-file-input").on("change", function(e) {
    pendingUploadFiles = Array.from(e.target.files);
    if (pendingUploadFiles.length === 0) return;
    const $tagsContainer = $("#siren-gsv-upload-tags");
    $tagsContainer.empty();
    pendingUploadFiles.forEach((file) => {
      $tagsContainer.append(`
                <span style="background: rgba(14, 165, 233, 0.2); color: #38bdf8; padding: 2px 8px; border-radius: 4px; font-size: 0.85em; border: 1px solid rgba(56, 189, 248, 0.3);">
                    <i class="fa-solid fa-music" style="margin-right: 4px;"></i>${file.name}
                </span>
            `);
    });
    $("#siren-gsv-upload-staging").slideDown(200);
  });
  $("#siren-gsv-upload-cancel").on("click", function() {
    pendingUploadFiles = [];
    $("#siren-gsv-file-input").val("");
    $("#siren-gsv-upload-staging").slideUp(200);
  });
  $("#siren-gsv-upload-confirm").on("click", async function() {
    if (pendingUploadFiles.length === 0) return;
    const apiBase = $("#siren-gsv-api").val().trim().replace(/\/$/, "");
    const $btn = $(this);
    const originalHtml = $btn.html();
    $btn.html('<i class="fa-solid fa-spinner fa-spin"></i> \u4E0A\u4F20\u4E2D...').prop("disabled", true);
    let successCount = 0;
    for (const file of pendingUploadFiles) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await fetch(`${apiBase}/upload`, {
          method: "POST",
          body: formData
        });
        if (res.ok) successCount++;
      } catch (err) {
        console.error(`\u4E0A\u4F20\u6587\u4EF6 ${file.name} \u5931\u8D25:`, err);
      }
    }
    if (window.toastr) {
      if (successCount === pendingUploadFiles.length)
        window.toastr.success(`\u6210\u529F\u4E0A\u4F20 ${successCount} \u4E2A\u6587\u4EF6`);
      else
        window.toastr.warning(
          `\u6210\u529F ${successCount}/${pendingUploadFiles.length}`
        );
    }
    $btn.html(originalHtml).prop("disabled", false);
    $("#siren-gsv-upload-cancel").click();
    fetchCustomRefs();
  });
  $("#siren-gsv-add-char").on("click", () => {
    createCharRow();
    syncEmoCharDropdowns();
  });
  $("#siren-gsv-add-emo").on("click", () => {
    createEmoRow();
    syncEmoCharDropdowns();
  });
  $("#siren-gsv-global-interval").on("input", function() {
    $("#siren-gsv-interval-val").text($(this).val() + "s");
  });
  const allSliders = [
    "global-interval",
    "global-speed",
    "global-temp",
    "global-topp",
    "global-topk",
    "global-rep",
    "mod-speed",
    "mod-temp",
    "mod-topp",
    "mod-topk",
    "mod-rep"
  ];
  allSliders.forEach((id) => {
    $(`#siren-gsv-${id}`).on("input", function() {
      let val = $(this).val();
      if (id === "global-interval") val += "s";
      $(`#siren-gsv-${id}-val`).text(val);
    });
  });
  bindSirenSliders([
    "siren-gsv-global-interval",
    "siren-gsv-global-speed",
    "siren-gsv-global-temp",
    "siren-gsv-global-topp",
    "siren-gsv-global-topk",
    "siren-gsv-global-rep",
    "siren-gsv-mod-speed",
    "siren-gsv-mod-temp",
    "siren-gsv-mod-topp",
    "siren-gsv-mod-topk",
    "siren-gsv-mod-rep"
  ]);
  let activeCharRowForAdv = null;
  $("#siren-gsv-char-list").on("click", ".siren-gsv-adv-btn", function() {
    activeCharRowForAdv = $(this).closest(".siren-gsv-row-item");
    $("#siren-gsv-mod-speed").val(activeCharRowForAdv.attr("data-speed") || 1).trigger("input");
    $("#siren-gsv-mod-temp").val(activeCharRowForAdv.attr("data-temp") || 1).trigger("input");
    $("#siren-gsv-mod-topp").val(activeCharRowForAdv.attr("data-topp") || 1).trigger("input");
    $("#siren-gsv-mod-topk").val(activeCharRowForAdv.attr("data-topk") || 15).trigger("input");
    $("#siren-gsv-mod-rep").val(activeCharRowForAdv.attr("data-rep") || 1.35).trigger("input");
    $("#siren-gsv-mod-seed").val(activeCharRowForAdv.attr("data-seed") || -1);
    $("#siren-gsv-mod-textlang").val(
      activeCharRowForAdv.attr("data-textlang") || "\u4E2D\u6587"
    );
    $("#siren-gsv-adv-modal").css("display", "flex").hide().fadeIn(200);
  });
  $("#siren-gsv-mod-cancel").on("click", function() {
    $("#siren-gsv-adv-modal").fadeOut(200);
    activeCharRowForAdv = null;
  });
  $("#siren-gsv-mod-cancel").on("click", function() {
    $("#siren-gsv-adv-modal").fadeOut(200);
    activeCharRowForAdv = null;
  });
  $("#siren-gsv-mod-save").on("click", function() {
    if (activeCharRowForAdv) {
      activeCharRowForAdv.attr("data-speed", $("#siren-gsv-mod-speed").val());
      activeCharRowForAdv.attr("data-temp", $("#siren-gsv-mod-temp").val());
      activeCharRowForAdv.attr("data-topp", $("#siren-gsv-mod-topp").val());
      activeCharRowForAdv.attr("data-topk", $("#siren-gsv-mod-topk").val());
      activeCharRowForAdv.attr("data-rep", $("#siren-gsv-mod-rep").val());
      activeCharRowForAdv.attr("data-seed", $("#siren-gsv-mod-seed").val());
      activeCharRowForAdv.attr(
        "data-textlang",
        $("#siren-gsv-mod-textlang").val()
      );
    }
    $("#siren-gsv-adv-modal").fadeOut(200);
  });
  $("#siren-gsv-char-list, #siren-gsv-emo-list").on(
    "click",
    ".siren-gsv-del-btn",
    function() {
      const isCharRow = $(this).closest("#siren-gsv-char-list").length > 0;
      $(this).closest(".siren-gsv-row-item").slideUp(200, function() {
        $(this).remove();
        if (isCharRow) syncEmoCharDropdowns();
      });
    }
  );
  $("#siren-gsv-emo-list").on("change", ".siren-gsv-emo-mode-sel", function() {
    const mode = $(this).val();
    const $row = $(this).closest(".siren-gsv-row-item");
    if (mode === "audio") {
      $row.find(".siren-gsv-emo-audio-group").show();
      $row.find(".siren-gsv-emo-model-group").hide();
    } else {
      $row.find(".siren-gsv-emo-audio-group").hide();
      $row.find(".siren-gsv-emo-model-group").show();
    }
  });
  $("#siren-gsv-char-list").on("input", ".siren-gsv-char-name", function() {
    syncEmoCharDropdowns();
  });
  $("#siren-gsv-emo-list").on("change", ".siren-gsv-emo-char", function() {
    $(this).attr("data-current-val", $(this).val());
  });
  $("#siren-gsv-save-btn").on("click", async function(e, isSilent = false) {
    if (!settings.tts.gptsovits) settings.tts.gptsovits = {};
    settings.tts.gptsovits.api_base = $("#siren-gsv-api").val().trim();
    settings.tts.gptsovits.api_key = $("#siren-gsv-apikey").val().trim();
    settings.tts.gptsovits.text_split_method = $(
      "#siren-gsv-global-split"
    ).val();
    settings.tts.gptsovits.fragment_interval = parseFloat(
      $("#siren-gsv-global-interval").val()
    );
    settings.tts.gptsovits.parallel_infer = $("#siren-gsv-global-parallel").is(
      ":checked"
    );
    settings.tts.gptsovits.speed_factor = parseFloat(
      $("#siren-gsv-global-speed").val()
    );
    settings.tts.gptsovits.temperature = parseFloat(
      $("#siren-gsv-global-temp").val()
    );
    settings.tts.gptsovits.top_p = parseFloat(
      $("#siren-gsv-global-topp").val()
    );
    settings.tts.gptsovits.top_k = parseInt($("#siren-gsv-global-topk").val());
    settings.tts.gptsovits.repetition_penalty = parseFloat(
      $("#siren-gsv-global-rep").val()
    );
    settings.tts.gptsovits.seed = parseInt($("#siren-gsv-global-seed").val());
    saveSirenSettings(true);
    const charList = [];
    $("#siren-gsv-char-list .siren-gsv-row-item").each(function() {
      const charName = $(this).find(".siren-gsv-char-name").val().trim();
      if (charName) {
        charList.push({
          charName,
          gptModel: $(this).find(".siren-gsv-char-gpt").val(),
          sovitsModel: $(this).find(".siren-gsv-char-sovits").val(),
          // 默认参考音频配置
          refPath: $(this).find(".siren-gsv-char-ref-path").val().trim(),
          promptLang: $(this).find(".siren-gsv-char-prompt-lang").val(),
          refText: $(this).find(".siren-gsv-char-ref-text").val().trim(),
          // 高级参数 (从绑定的 data 属性读取)
          speedFactor: parseFloat($(this).attr("data-speed") || 1),
          temperature: parseFloat($(this).attr("data-temp") || 1),
          topP: parseFloat($(this).attr("data-topp") || 1),
          topK: parseInt($(this).attr("data-topk") || 15),
          repetitionPenalty: parseFloat($(this).attr("data-rep") || 1.35),
          seed: parseInt($(this).attr("data-seed") || -1),
          textLang: $(this).attr("data-textlang") || "\u4E2D\u6587"
        });
      }
    });
    const emoList = [];
    $("#siren-gsv-emo-list .siren-gsv-row-item").each(function() {
      const charName = $(this).find(".siren-gsv-emo-char").val();
      const emotion = $(this).find(".siren-gsv-emo-name").val().trim();
      const mode = $(this).find(".siren-gsv-emo-mode-sel").val();
      if (charName && emotion) {
        let config = {
          charName,
          emotion,
          mode
        };
        if (mode === "audio") {
          config.refPath = $(this).find(".siren-gsv-emo-ref-path").val().trim();
          config.refText = $(this).find(".siren-gsv-emo-ref-text").val().trim();
        } else if (mode === "model") {
          config.gptModel = $(this).find(".siren-gsv-emo-gpt").val();
          config.promptLang = $(this).find(".siren-gsv-emo-model-prompt-lang").val();
          config.refPath = $(this).find(".siren-gsv-emo-model-ref-path").val().trim();
          config.refText = $(this).find(".siren-gsv-emo-model-ref-text").val().trim();
        }
        emoList.push(config);
      }
    });
    const payload = {
      characters: charList,
      emotions: emoList
    };
    await saveToCharacterCard("siren_voice_gptsovits", payload, true);
    if (!isSilent && window.toastr) {
      window.toastr.success("GSV: \u914D\u7F6E\u5DF2\u4FDD\u5B58\uFF0C\u5DF2\u81EA\u52A8\u5207\u6362\u5E76\u540C\u6B65\u4E16\u754C\u4E66\uFF01");
    }
    if (typeof updateTestDropdowns === "function") {
      setTimeout(() => updateTestDropdowns(), 300);
    }
    const currentSettings = getSirenSettings();
    currentSettings.tts.provider = "gptsovits";
    currentSettings.tts.enabled = true;
    saveSirenSettings(true);
    await syncTtsWorldbookEntries("gptsovits", true);
  });
  $("#siren-gsv-test-char").on("change", function() {
    const selChar = $(this).val();
    const cardData = getGptSovitsCardData2();
    const emos = cardData.emotions || [];
    const $moodSel = $("#siren-gsv-test-mood");
    $moodSel.empty().append('<option value="">(\u4F7F\u7528\u9ED8\u8BA4\u89D2\u8272\u60C5\u7EEA)</option>');
    if (selChar) {
      const charEmos = emos.filter((e) => e.charName === selChar);
      charEmos.forEach((e) => {
        const modeLabel = e.mode === "audio" ? "\u97F3\u9891\u53C2\u8003" : "\u6A21\u578B\u5207\u6362";
        $moodSel.append(
          `<option value="${e.emotion}">${e.emotion} [${modeLabel}]</option>`
        );
      });
    }
  });
  refreshGptSovitsData();
  fetchCustomRefs();
  $("#siren-gsv-test-generate").on("click", async function() {
    const text = $("#siren-gsv-test-text").val().trim();
    const charName = $("#siren-gsv-test-char").val();
    const moodName = $("#siren-gsv-test-mood").val();
    if (!text || !charName) {
      if (window.toastr) window.toastr.warning("\u8BF7\u9009\u62E9\u6D4B\u8BD5\u89D2\u8272\u5E76\u8F93\u5165\u53F0\u8BCD\uFF01");
      return;
    }
    const $btn = $(this);
    const $status = $("#siren-gsv-test-status");
    const $audio = $("#siren-gsv-test-audio");
    const $download = $("#siren-gsv-test-download");
    $btn.prop("disabled", true).html('<i class="fa-solid fa-spinner fa-spin"></i> \u751F\u6210\u4E2D...');
    $status.text("\u6B63\u5728\u63A8\u7406\uFF0C\u8BF7\u7A0D\u5019...").css("color", "#0ea5e9");
    $audio.hide();
    $download.hide();
    try {
      const blob = await generateGptSovitsAudio(text, charName, moodName);
      const url = setAudioPreview($audio[0], blob);
      $audio.attr("src", url).show();
      $download.attr("href", url).show();
      $status.text("\u2705 \u63A8\u7406\u5B8C\u6210").css("color", "#10b981");
      $audio[0].play();
    } catch (err) {
      console.error("[Siren GSV Test]", err);
      $status.text("\u274C " + err.message).css("color", "#ef4444");
    } finally {
      $btn.prop("disabled", false).html('<i class="fa-solid fa-bolt"></i> \u751F\u6210');
    }
  });
}
function updateTestDropdowns() {
  const cardData = getGptSovitsCardData2();
  const chars = cardData.characters || [];
  const $charSel = $("#siren-gsv-test-char");
  const lastSelected = $charSel.val();
  $charSel.empty().append('<option value="">(\u9009\u62E9\u89D2\u8272\u97F3\u8272)</option>');
  if (chars.length > 0) {
    chars.forEach((c) => {
      $charSel.append(`<option value="${c.charName}">${c.charName}</option>`);
    });
    if (lastSelected && chars.find((c) => c.charName === lastSelected)) {
      $charSel.val(lastSelected);
    }
  } else {
    $charSel.append('<option value="">(\u672A\u68C0\u6D4B\u5230\u89D2\u8272\u914D\u7F6E)</option>');
  }
  $charSel.trigger("change");
}
function refreshGptSovitsData() {
  const currentSettings = getSirenSettings();
  if (currentSettings.tts?.gptsovits) {
    $("#siren-gsv-api").val(
      currentSettings.tts.gptsovits.api_base || "http://127.0.0.1:9880"
    );
    $("#siren-gsv-apikey").val(currentSettings.tts.gptsovits.api_key || "");
    $("#siren-gsv-global-split").val(
      currentSettings.tts.gptsovits.text_split_method || "\u6309\u6807\u70B9\u7B26\u53F7\u5207"
    );
    $("#siren-gsv-global-interval").val(
      currentSettings.tts.gptsovits.fragment_interval || 0.3
    );
    $("#siren-gsv-interval-val").text(
      $("#siren-gsv-global-interval").val() + "s"
    );
    $("#siren-gsv-global-parallel").prop(
      "checked",
      currentSettings.tts.gptsovits.parallel_infer ?? true
    );
  }
  $("#siren-gsv-char-list").empty();
  $("#siren-gsv-emo-list").empty();
  const cardData = getGptSovitsCardData2();
  const savedChars = cardData.characters || [];
  const savedEmos = cardData.emotions || [];
  if (savedChars.length === 0) createCharRow();
  else savedChars.forEach((c) => createCharRow(c));
  if (savedEmos.length === 0) createEmoRow();
  else savedEmos.forEach((e) => createEmoRow(e));
  syncEmoCharDropdowns();
  updateTestDropdowns();
}
$(window).off("siren:character_changed.gsv").on("siren:character_changed.gsv", function() {
  if ($("#siren-gptsovits-wrapper").length > 0) {
    console.log("[Siren GSV] \u{1F504} \u68C0\u6D4B\u5230\u5BF9\u8BDD\u5207\u6362\uFF0C\u6B63\u5728\u52A0\u8F7D\u65B0\u89D2\u8272\u5361\u914D\u7F6E...");
    refreshGptSovitsData();
  }
});
function formatModelNameForDisplay(rawVal) {
  if (!rawVal) return "";
  if (rawVal.includes("::")) {
    const parts = rawVal.split("::");
    return `[${parts[0]}] ${parts[1]}`;
  }
  return rawVal;
}
function createCharRow(data = {}) {
  const langOptions = [
    "\u4E2D\u6587",
    "\u82F1\u8BED",
    "\u65E5\u8BED",
    "\u7CA4\u8BED",
    "\u97E9\u8BED",
    "\u4E2D\u82F1\u6DF7\u5408",
    "\u65E5\u82F1\u6DF7\u5408",
    "\u7CA4\u82F1\u6DF7\u5408",
    "\u97E9\u82F1\u6DF7\u5408",
    "\u591A\u8BED\u79CD\u6DF7\u5408",
    "\u591A\u8BED\u79CD\u6DF7\u5408(\u7CA4\u8BED)"
  ];
  const buildLangOpts = (selected) => langOptions.map(
    (l) => `<option value="${l}" ${l === (selected || "\u4E2D\u6587") ? "selected" : ""}>${l}</option>`
  ).join("");
  const html = `
        <div class="siren-gsv-row-item siren-ext-setting-row" 
             data-speed="${data.speedFactor || 1}" data-temp="${data.temperature || 1}" 
             data-topp="${data.topP || 1}" data-topk="${data.topK || 15}" 
             data-rep="${data.repetitionPenalty || 1.35}" data-seed="${data.seed || -1}" data-textlang="${data.textLang || "\u4E2D\u6587"}"
             style="display: flex; flex-direction: column; gap: 8px; padding: 12px; background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; margin-bottom: 4px;">
            
            <div style="display: flex; gap: 8px; align-items: center; width: 100%; flex-wrap: wrap;">
                <input type="text" class="siren-ext-input siren-gsv-char-name" placeholder="\u89D2\u8272\u540D" value="${data.charName || ""}" style="${rowInputStyle} flex: 1.2; min-width: 100px;">
                <select class="siren-ext-select siren-gsv-char-gpt" style="${rowInputStyle} flex: 1.5; min-width: 130px;">
                    <option value="${data.gptModel || ""}">${formatModelNameForDisplay(data.gptModel) || "GPT\u6A21\u578B..."}</option>
                </select>
                <select class="siren-ext-select siren-gsv-char-sovits" style="${rowInputStyle} flex: 1.5; min-width: 130px;">
                    <option value="${data.sovitsModel || ""}">${formatModelNameForDisplay(data.sovitsModel) || "SoVITS\u6A21\u578B..."}</option>
                </select>
                <div style="display: flex; gap: 8px; margin-left: auto;">
                    <button class="siren-ext-btn siren-gsv-adv-btn" style="background:none; border:none; padding:0 5px; color:#f59e0b; width:30px; flex-shrink:0;" title="\u9AD8\u7EA7\u8BBE\u7F6E"><i class="fa-solid fa-sliders"></i></button>
                    <button class="siren-ext-btn siren-gsv-del-btn" style="background:none; border:none; padding:0 5px; color:#ef4444; width:30px; flex-shrink:0;" title="\u5220\u9664"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>
            
            <div style="display: flex; gap: 8px; width: 100%; flex-wrap: wrap;">
                <input type="text" list="siren-gsv-ref-list" class="siren-ext-input siren-gsv-char-ref-path" placeholder="\u9ED8\u8BA4\u53C2\u8003\u97F3\u9891\u6587\u4EF6\u540D" value="${data.refPath || ""}" style="${rowInputStyle} flex: 2; min-width: 150px;">
                <select class="siren-ext-select siren-gsv-char-prompt-lang" style="${rowInputStyle} flex: 1; min-width: 100px;" title="\u53C2\u8003\u97F3\u9891\u8BED\u79CD">
                    ${buildLangOpts(data.promptLang)}
                </select>
            </div>
            
            <div style="width: 100%;">
                <input type="text" class="siren-ext-input siren-gsv-char-ref-text" placeholder="\u9ED8\u8BA4\u53C2\u8003\u97F3\u9891\u6587\u4EF6\u5185\u5BB9" value="${data.refText || ""}" style="${rowInputStyle} width: 100%;">
            </div>
        </div>
    `;
  $("#siren-gsv-char-list").append(html);
}
function createEmoRow(data = {}) {
  const mode = data.mode || "audio";
  const langOptions = [
    "\u4E2D\u6587",
    "\u82F1\u8BED",
    "\u65E5\u8BED",
    "\u7CA4\u8BED",
    "\u97E9\u8BED",
    "\u4E2D\u82F1\u6DF7\u5408",
    "\u65E5\u82F1\u6DF7\u5408",
    "\u7CA4\u82F1\u6DF7\u5408",
    "\u97E9\u82F1\u6DF7\u5408",
    "\u591A\u8BED\u79CD\u6DF7\u5408",
    "\u591A\u8BED\u79CD\u6DF7\u5408(\u7CA4\u8BED)"
  ];
  const buildLangOpts = (selected) => langOptions.map(
    (l) => `<option value="${l}" ${l === (selected || "\u4E2D\u6587") ? "selected" : ""}>${l}</option>`
  ).join("");
  const html = `
        <div class="siren-gsv-row-item siren-ext-setting-row" style="display: flex; flex-direction: column; gap: 8px; padding: 12px; background: rgba(0,0,0,0.25); border-radius: 8px; border: 1px solid rgba(255,255,255,0.03);">
            
            <div style="display: flex; gap: 8px; align-items: center; width: 100%;">
                <select class="siren-ext-select siren-gsv-emo-char" data-current-val="${data.charName || ""}" style="${rowInputStyle} flex: 1; min-width: 100px;">
                    <option value="">\u9009\u62E9\u89D2\u8272</option>
                </select>
                <input type="text" class="siren-ext-input siren-gsv-emo-name" placeholder="\u60C5\u7EEA\u540D" value="${data.emotion || ""}" style="${rowInputStyle} flex: 1; min-width: 100px;">
                <button class="siren-ext-btn siren-gsv-del-btn" style="background:none; border:none; color: #ef4444; padding: 0 5px; width: 30px; flex-shrink: 0;" title="\u5220\u9664"><i class="fa-solid fa-trash"></i></button>
            </div>
            
            <div style="width: 100%;">
                <select class="siren-ext-select siren-gsv-emo-mode-sel" style="${rowInputStyle} width: 100%;">
                    <option value="audio" ${mode === "audio" ? "selected" : ""}>\u97F3\u9891\u53C2\u8003</option>
                    <option value="model" ${mode === "model" ? "selected" : ""}>\u6A21\u578B\u63A7\u5236</option>
                </select>
            </div>
            
            <div class="siren-gsv-emo-audio-group" style="display: ${mode === "audio" ? "flex" : "none"}; gap: 8px; padding-left: 12px; border-left: 2px solid #38bdf8; flex-wrap: wrap;">
                <input type="text" list="siren-gsv-ref-list" class="siren-ext-input siren-gsv-emo-ref-path" placeholder="\u9009\u62E9\u60C5\u7EEA\u53C2\u8003\u97F3\u9891..." value="${mode === "audio" ? data.refPath || "" : ""}" style="${rowInputStyle} flex: 1; min-width: 140px;">
                <input type="text" class="siren-ext-input siren-gsv-emo-ref-text" placeholder="\u60C5\u7EEA\u53C2\u8003\u97F3\u9891\u6587\u672C\u5185\u5BB9" value="${mode === "audio" ? data.refText || "" : ""}" style="${rowInputStyle} flex: 2; min-width: 140px;">
            </div>

            <div class="siren-gsv-emo-model-group" style="display: ${mode === "model" ? "flex" : "none"}; flex-direction: column; padding-left: 12px; border-left: 2px solid #a855f7; width: 100%;">
                
                <div style="display: flex; gap: 8px; margin-bottom: 8px; flex-wrap: wrap;">
                    <select class="siren-ext-select siren-gsv-emo-gpt" style="${rowInputStyle} flex: 1.5; min-width: 140px;">
                        <option value="${data.gptModel || ""}">${formatModelNameForDisplay(data.gptModel) || "\u9009\u62E9\u60C5\u7EEAGPT\u6A21\u578B..."}</option>
                    </select>
                    <select class="siren-ext-select siren-gsv-emo-model-prompt-lang" style="${rowInputStyle} flex: 1; min-width: 100px;" title="\u72EC\u7ACB\u53C2\u8003\u97F3\u9891\u8BED\u79CD">
                        ${buildLangOpts(data.promptLang)}
                    </select>
                    <input type="text" list="siren-gsv-ref-list" class="siren-ext-input siren-gsv-emo-model-ref-path" placeholder="\u72EC\u7ACB\u53C2\u8003\u97F3\u9891(\u4E0D\u586B\u7528\u89D2\u8272\u9ED8\u8BA4)" value="${mode === "model" ? data.refPath || "" : ""}" style="${rowInputStyle} flex: 1.5; min-width: 150px;">
                </div>
                
                <div style="width: 100%;">
                    <input type="text" class="siren-ext-input siren-gsv-emo-model-ref-text" placeholder="\u72EC\u7ACB\u53C2\u8003\u97F3\u9891\u6587\u672C(\u4E0D\u586B\u7528\u89D2\u8272\u9ED8\u8BA4)" value="${mode === "model" ? data.refText || "" : ""}" style="${rowInputStyle} width: 100%;">
                </div>
                
            </div>
        </div>
    `;
  $("#siren-gsv-emo-list").append(html);
}

// scripts/voxcpm.js
init_runtime();
init_settings();
init_voxcpm_logic();
function getVoxCpmHtml() {
  return `
    <style>
        .siren-vox-search-item:hover { background: rgba(6, 182, 212, 0.2); color: #06b6d4 !important; }
        .siren-vox-search-results::-webkit-scrollbar { width: 4px; }
        .siren-vox-search-results::-webkit-scrollbar-thumb { background: #06b6d4; border-radius: 2px; }
        .siren-vox-align-fix { margin: 0 !important; height: 34px !important; box-sizing: border-box !important; }

        /* \u89D2\u8272\u5361\u7247\u5BB9\u5668\uFF1A\u589E\u52A0\u5DE6\u4FA7\u4E3B\u9898\u8272\u88C5\u9970\u6761 */
        .siren-vox-char-row {
            background: rgba(15, 23, 42, 0.4) !important;
            border: 1px solid rgba(51, 65, 85, 0.6) !important;
            border-left: 4px solid #06b6d4 !important; /* \u4E3B\u9898\u9752\u8272\u4FA7\u8FB9\u680F */
            padding: 15px !important;
            border-radius: 8px !important;
            margin-bottom: 12px !important;
            transition: all 0.2s ease-in-out;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        /* \u60AC\u505C\u6548\u679C\uFF1A\u5361\u7247\u4EAE\u8D77 */
        .siren-vox-char-row:hover {
            background: rgba(6, 182, 212, 0.05) !important;
            border-color: rgba(6, 182, 212, 0.3) !important;
            transform: translateX(2px); /* \u60AC\u505C\u65F6\u8F7B\u5FAE\u53F3\u79FB\uFF0C\u589E\u52A0\u4EA4\u4E92\u611F */
        }

        /* \u6807\u7B7E\u5C0F\u6807\u9898\uFF1A\u7EDF\u4E00\u914D\u8272 */
        .siren-vox-row-label {
            font-size: 0.8em;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
            display: block;
        }
        
        .siren-vox-param-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            grid-auto-rows: 1fr; /* \u{1F31F} \u6838\u5FC3\u4FEE\u590D\uFF1A\u5F3A\u5236\u6240\u6709\u7684\u9690\u5F0F\u884C\u4FDD\u6301\u540C\u6837\u7684\u9AD8\u5EA6 */
        }
        /* \u{1F31F} \u589E\u52A0\u624B\u673A\u7AEF\u6781\u5C0F\u5C4F\u5E55\u5355\u5217\u663E\u793A\uFF0C\u907F\u514D\u6807\u7B7E\u592A\u6324 */
        @media screen and (max-width: 480px) {
            .siren-vox-param-grid { grid-template-columns: 1fr; }
        }
        @media screen and (min-width: 768px) {
            .siren-vox-param-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media screen and (min-width: 1024px) {
            .siren-vox-param-grid { grid-template-columns: repeat(4, 1fr); }
        }

        .siren-vox-param-card {
            display: flex;
            flex-direction: row; /* \u{1F31F} \u7EDF\u4E00\u6A2A\u5411\u6392\u5217 */
            justify-content: space-between;
            align-items: center;
            gap: 8px;
            background: rgba(30, 41, 59, 0.4);
            padding: 10px 12px;
            border-radius: 8px;
            border: 1px solid rgba(51, 65, 85, 0.5);
            transition: all 0.2s;
            height: 100%; /* \u{1F31F} \u6491\u6EE1\u7F51\u683C\u5355\u5143\u683C */
            box-sizing: border-box;
        }
        .siren-vox-param-card:hover {
            border-color: rgba(6, 182, 212, 0.4);
            background: rgba(30, 41, 59, 0.6);
        }

        .siren-vox-param-num::-webkit-outer-spin-button,
        .siren-vox-param-num::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }
        .siren-vox-param-num {
            -moz-appearance: textfield;
            width: 55px;
            text-align: center;
            padding: 2px 4px;
            font-family: monospace;
            font-size: 0.9em;
            color: #06b6d4 !important;
            background: rgba(15, 23, 42, 0.6) !important;
            border: 1px solid #334155 !important;
            border-radius: 4px;
        }
    </style>

    <div>
        <div style="margin-bottom: 20px;">
            <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 10px; align-items: center;">
                <h4 style="margin: 0; color: #cbd5e1; font-size: 1.1em; white-space: nowrap; width: 85px;"><i class="fa-solid fa-link" style="margin-right: 5px;"></i>API Base</h4>
                <div style="display: flex; gap: 5px; flex: 1; min-width: 200px; align-items: center;">
                    <input type="text" id="siren-vox-api" class="siren-ext-input" value="http://127.0.0.1:8000" style="flex: 1; min-width: 0;">
                    <button id="siren-vox-check" style="background:none; border:none; padding:5px; width:30px; flex-shrink:0; cursor:pointer;" title="\u5065\u5EB7\u68C0\u67E5">
                        <i class="fa-solid fa-heart-pulse" style="color:#ef4444; font-size:1.1em;"></i>
                    </button>
                    <button id="siren-vox-select-files-btn" style="background:none; border:none; padding:5px; width:30px; flex-shrink:0; cursor:pointer;" title="\u9009\u62E9\u53C2\u8003\u97F3\u9891">
                        <i class="fa-solid fa-cloud-arrow-up" style="color:#38bdf8; font-size:1.1em;"></i>
                    </button>
                    <input type="file" id="siren-vox-file-input" accept=".wav,.mp3,.flac" style="display: none;">
                </div>
            </div>
            
            <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 10px; align-items: center;">
                <h4 style="margin: 0; color: #cbd5e1; font-size: 1.1em; white-space: nowrap; width: 85px;"><i class="fa-solid fa-key" style="margin-right: 5px;"></i>API Key</h4>
                <div style="display: flex; flex: 1; min-width: 200px;">
                    <input type="password" id="siren-vox-apikey" class="siren-ext-input" placeholder="\u5982\u679C\u4E0D\u8BBE\u7F6E\u8BF7\u7559\u7A7A" style="flex: 1; min-width: 0;">
                </div>
            </div>
        </div>

        <hr class="siren-ext-divider" style="border-color: #334155;">

        <div style="margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <h4 style="margin: 0; color: #38bdf8; font-size: 1.1em;"><i class="fa-solid fa-users" style="margin-right: 5px;"></i>\u89D2\u8272\u97F3\u8272\u6620\u5C04\u5217\u8868</h4>
            </div>
            
            <div id="siren-vox-char-list" style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 10px;">
                </div>
            
            <button id="siren-vox-char-add" class="siren-ext-btn siren-ext-btn-secondary" style="width: 100%; justify-content: center; border: 1px dashed #38bdf8; color: #38bdf8; background: rgba(56, 189, 248, 0.05);">
                <i class="fa-solid fa-plus"></i> \u6DFB\u52A0\u89D2\u8272\u914D\u7F6E
            </button>
        </div>

        <hr class="siren-ext-divider" style="border-color: #334155;">

        <div style="background: rgba(0,0,0,0.2); padding: 10px; border-radius: 6px; margin-bottom: 20px;">
            <h4 style="margin: 0 0 10px 0; color: #94a3b8; font-size: 1.1em;"><i class="fa-solid fa-wrench" style="margin-right: 5px;"></i>\u9AD8\u7EA7\u53C2\u6570</h4>

            <div class="siren-vox-param-grid">

                <div class="siren-vox-param-card">
                    <label style="font-size: 0.85em; color: #cbd5e1;" title="\u63A8\u8350\u4F7F\u7528\u6807\u70B9\u5207\u5206\uFF0C\u4E0D\u5207\u5206\u6574\u6BB5\u9001\u5165\u6A21\u578B\u6613\u7206\u663E\u5B58">\u6587\u672C\u5207\u5206\u65B9\u5F0F</label>
                    <select id="siren-vox-param-split-method" style="background: rgba(15, 23, 42, 0.6); color: #06b6d4; border: 1px solid #334155; border-radius: 4px; padding: 2px 4px; font-size: 0.9em; outline: none; flex-shrink: 0; max-width: 100px;">
                        <option value="punctuation">\u6807\u70B9\u5207\u5206</option>
                        <option value="none">\u4E0D\u5207\u5206</option>
                    </select>
                </div>

                <div class="siren-vox-param-card">
                    <label style="font-size: 0.85em; color: #94a3b8;" title="\u4EC5\u5728\u6807\u70B9\u5207\u5206\u4E0B\u751F\u6548\u3002\u4F4E\u4E8E\u6B64\u5B57\u6570\u5411\u540E\u5408\u5E76">\u5207\u5206\u6700\u5C0F\u5B57\u6570</label>
                    <input type="number" id="siren-vox-param-chunk-min" class="siren-vox-param-num" value="15" step="1" min="1">
                </div>

                <div class="siren-vox-param-card">
                    <label style="font-size: 0.85em; color: #94a3b8;" title="\u4EC5\u5728\u6807\u70B9\u5207\u5206\u4E0B\u751F\u6548\u3002\u5408\u5E76\u65F6\u7684\u6700\u5927\u5B89\u5168\u5B57\u6570\u9650\u5236">\u5207\u5206\u6700\u5927\u5B57\u6570</label>
                    <input type="number" id="siren-vox-param-chunk-max" class="siren-vox-param-num" value="60" step="1" min="10">
                </div>
                
                <div class="siren-vox-param-card">
                    <label style="font-size: 0.85em; color: #cbd5e1;" title="\u5C06\u6570\u5B57\u3001\u65E5\u671F\u8F6C\u4E3A\u6587\u5B57\u8BFB\u97F3">\u6587\u672C\u89C4\u8303\u5316</label>
                    <label class="siren-ext-switch" style="flex-shrink: 0;">
                        <input type="checkbox" id="siren-vox-param-norm">
                        <span class="siren-ext-slider"></span>
                    </label>
                </div>

                <div class="siren-vox-param-card">
                    <label style="font-size: 0.85em; color: #cbd5e1;" title="\u9884\u5904\u7406\u53BB\u9664\u53C2\u8003\u97F3\u9891\u5E95\u566A">\u97F3\u9891\u9884\u964D\u566A</label>
                    <label class="siren-ext-switch" style="flex-shrink: 0;">
                        <input type="checkbox" id="siren-vox-param-denoise">
                        <span class="siren-ext-slider"></span>
                    </label>
                </div>

                <div class="siren-vox-param-card">
                    <label style="font-size: 0.85em; color: #cbd5e1;" title="\u751F\u6210\u5F02\u5E38\u65F6\u81EA\u52A8\u91CD\u8BD5">\u574F\u4F8B\u91CD\u8BD5</label>
                    <label class="siren-ext-switch" style="flex-shrink: 0;">
                        <input type="checkbox" id="siren-vox-param-retry" checked>
                        <span class="siren-ext-slider"></span>
                    </label>
                </div>

                <div class="siren-vox-param-card">
                    <label style="font-size: 0.85em; color: #94a3b8;" title="1.0-3.0">\u5F15\u5BFC\u5F3A\u5EA6 (CFG)</label>
                    <input type="number" id="siren-vox-param-cfg" class="siren-vox-param-num" value="2.5" step="0.1" min="1.0" max="5.0">
                </div>

                <div class="siren-vox-param-card">
                    <label style="font-size: 0.85em; color: #94a3b8;" title="4-30">\u6269\u6563\u6B65\u6570 (Steps)</label>
                    <input type="number" id="siren-vox-param-steps" class="siren-vox-param-num" value="10" step="1" min="4" max="50">
                </div>

                <div class="siren-vox-param-card">
                    <label style="font-size: 0.85em; color: #94a3b8;" title="\uFF08\u5E95\u5C42\u53C2\u6570\uFF09\u9650\u5236\u6A21\u578B\u5355\u6B21\u751F\u6210\u7684\u6781\u5C0F\u8BED\u97F3\u957F\u5EA6\uFF0C\u9632\u6B62\u751F\u6210\u51FA\u7A7A\u767D\u97F3\u9891\u3002\u4E00\u822C\u4FDD\u6301\u9ED8\u8BA4 2 \u5373\u53EF\u3002">\u6700\u5C0F\u751F\u6210Token</label>
                    <input type="number" id="siren-vox-param-minlen" class="siren-vox-param-num" value="2" step="1" min="1">
                </div>

                <div class="siren-vox-param-card">
                    <label style="font-size: 0.85em; color: #94a3b8;" title="\uFF08\u5E95\u5C42\u53C2\u6570\uFF09\u9650\u5236\u6A21\u578B\u5355\u6B21\u751F\u6210\u7684\u6700\u5927\u8BED\u97F3\u957F\u5EA6\uFF08\u9632\u6B7B\u5FAA\u73AF\u8DD1\u98DE\uFF09\u30024096 \u7EA6\u5BF9\u5E94 30 \u79D2\u4EE5\u4E0A\u7684\u97F3\u9891\u3002\u82E5\u957F\u6587\u672C\u751F\u6210\u603B\u662F\u4E2D\u65AD\uFF0C\u53EF\u9002\u5F53\u8C03\u5927\u3002">\u6700\u5927\u751F\u6210Token</label>
                    <input type="number" id="siren-vox-param-maxlen" class="siren-vox-param-num" value="4096" step="128" min="512">
                </div>

                <div class="siren-vox-param-card">
                    <label style="font-size: 0.85em; color: #94a3b8;" title="\u574F\u4F8B\u91CD\u8BD5\u6700\u5927\u6B21\u6570">\u6700\u5927\u91CD\u8BD5\u6B21\u6570</label>
                    <input type="number" id="siren-vox-param-retrymax" class="siren-vox-param-num" value="3" step="1" min="1" max="10">
                </div>

                <div class="siren-vox-param-card">
                    <label style="font-size: 0.85em; color: #94a3b8;" title="\u5224\u65AD\u4E3A\u574F\u4F8B\u7684\u6BD4\u4F8B\u9608\u503C">\u574F\u4F8B\u6BD4\u4F8B\u9608\u503C</label>
                    <input type="number" id="siren-vox-param-retrythresh" class="siren-vox-param-num" value="6.0" step="0.5" min="1.0" max="10.0">
                </div>

            </div>
        </div>

        <button id="siren-vox-global-save" class="siren-ext-btn siren-ext-btn-primary" style="width: 100%; padding: 12px 0; justify-content: center; font-size: 1.05em; margin-top: 15px; background: linear-gradient(135deg, #0ea5e9, #10b981); border: none;">
            <i class="fa-solid fa-layer-group"></i> \u4FDD\u5B58\u5F53\u524D\u914D\u7F6E
        </button>

        <hr class="siren-ext-divider" style="border-color: #334155;">

        <h4 style="color: #10b981; margin-bottom: 10px; font-size: 1.1em;"><i class="fa-solid fa-vial" style="margin-right: 5px;"></i> VoxCPM \u53D1\u97F3\u6D4B\u8BD5</h4>
        <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 6px; padding: 10px;">
            
            <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 10px;">
                <select id="siren-vox-test-char" class="siren-ext-select" style="flex: 1; min-width: 160px;">
                    <option value="custom">\u81EA\u5B9A\u4E49\u63A7\u5236 (\u4E0D\u4F7F\u7528\u9884\u8BBE\u5217\u8868)</option>
                    </select>
            </div>

            <div style="margin-bottom: 10px;">
                <input type="text" id="siren-vox-test-instruction" class="siren-ext-input" style="width: 100%;" placeholder="\u8F93\u5165\u63A7\u5236\u6307\u4EE4(\u5982: \u60B2\u4F24, \u6124\u6012, \u8BED\u901F\u7A0D\u5FEB\u7B49)">
                <small style="color: #64748b; margin-top: 4px; display: block;">* \u82E5\u9009\u62E9\u5177\u4F53\u89D2\u8272\uFF0C\u6B64\u5904\u4EC5\u586B\u60C5\u7EEA(\u5982: \u6FC0\u52A8\u5730)\uFF1B\u82E5\u81EA\u5B9A\u4E49\uFF0C\u53EF\u586B\u97F3\u8272+\u60C5\u7EEA(\u5982: \u6210\u719F\u7537\u6027, \u7591\u60D1\u5730)\u3002</small>
            </div>
            
            <textarea id="siren-vox-test-text" class="siren-ext-textarea" rows="3" placeholder="\u8F93\u5165\u4F60\u8981\u8BA9\u89D2\u8272\u8BF4\u51FA\u7684\u5177\u4F53\u8BED\u97F3\u5185\u5BB9..."></textarea>
            
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                <button id="siren-vox-test-generate" class="siren-ext-btn siren-ext-btn-primary" style="background: #10b981; border-color: #10b981;"><i class="fa-solid fa-bolt"></i> \u751F\u6210</button>
                
                <div id="siren-vox-test-preview" style="flex: 1; margin-left: 15px; display: flex; align-items: center; gap: 10px;">
                    <audio id="siren-vox-test-audio" controls style="height: 32px; flex: 1; display: none;"></audio>
                    
                    <a id="siren-vox-test-download" class="siren-ext-btn siren-ext-btn-secondary" style="display: none; padding: 4px 10px; text-decoration: none; color: #cbd5e1;" download="voxcpm_test.wav" title="\u4E0B\u8F7D\u97F3\u9891">
                        <i class="fa-solid fa-download"></i>
                    </a>
                    <span id="siren-vox-test-status" style="color: #64748b; font-size: 0.85em; white-space: nowrap;">\u7B49\u5F85\u751F\u6210...</span>
                </div>
            </div>
        </div>
    </div>
    `;
}
var voxCharRowHtml = `
<div class="siren-ext-setting-row siren-vox-char-row">
    <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 10px;">
        <div style="flex: 1;">
            <span class="siren-vox-row-label">\u89D2\u8272\u540D\u79F0</span>
            <input type="text" class="siren-ext-input siren-vox-align-fix siren-vox-char-name" placeholder="\u5982: Sam" style="width: 100%;">
        </div>
        <div style="flex: 1;">
            <span class="siren-vox-row-label">\u8BED\u97F3\u6A21\u5F0F</span>
            <select class="siren-ext-select siren-vox-align-fix siren-vox-char-mode" style="width: 100%;">
                <option value="clone">\u53C2\u8003\u97F3\u9891\u514B\u9686</option>
                <option value="design">\u81EA\u7136\u6587\u672C\u8BBE\u8BA1</option>
            </select>
        </div>
        <button class="siren-ext-btn siren-vox-row-del siren-vox-align-fix" style="background:none; border:none; color: #ef4444; margin-top: 18px; width: 30px;" title="\u5220\u9664">
            <i class="fa-solid fa-trash"></i>
        </button>
    </div>

    <div class="siren-vox-audio-ui" style="display: flex; flex-direction: column; gap: 10px; width: 100%;">
        <div>
            <span class="siren-vox-row-label">\u989D\u5916\u6307\u4EE4 (\u53EF\u9009)</span>
            <input type="text" class="siren-ext-input siren-vox-align-fix siren-vox-audio-extra-input" placeholder="\u4F8B\u5982: \u5FEB\u901F\u5730, \u7CA4\u8BED" style="width: 100%;">
        </div>
        <div>
            <span class="siren-vox-row-label">\u53C2\u8003\u97F3\u9891\u8DEF\u5F84</span>
            <div style="position: relative; display: flex; width: 100%;">
                <input type="text" class="siren-ext-input siren-vox-align-fix siren-vox-audio-input" placeholder="\u641C\u7D22\u6216\u8F93\u5165\u6587\u4EF6\u540D..." style="width: 100%;">
                <div class="siren-vox-search-results" style="display: none; position: absolute; top: calc(100% + 4px); left: 0; width: 100%; max-height: 150px; overflow-y: auto; background: #1e293b; border: 1px solid #06b6d4; border-radius: 6px; z-index: 100;"></div>
            </div>
        </div>
    </div>

    <div class="siren-vox-text-ui" style="display: none; width: 100%;">
        <span class="siren-vox-row-label">\u97F3\u8272\u63CF\u8FF0\u6587\u672C</span>
        <input type="text" class="siren-ext-input siren-vox-align-fix siren-vox-text-input" placeholder="\u63CF\u8FF0\u97F3\u8272\uFF0C\u5982: \u78C1\u6027\u7684\u7537\u4F4E\u97F3" style="width: 100%;">
    </div>
</div>
`;
function loadVoxCpmData() {
  const settings = getSirenSettings();
  const ttsSettings = settings?.tts?.voxcpm || {};
  $("#siren-vox-api").val(ttsSettings.api_base || "http://127.0.0.1:8888");
  $("#siren-vox-apikey").val(ttsSettings.api_key || "");
  $("#siren-vox-param-split-method").val(
    ttsSettings.split_method || "punctuation"
  );
  $("#siren-vox-param-chunk-min").val(ttsSettings.chunk_min_len ?? 15);
  $("#siren-vox-param-chunk-max").val(ttsSettings.chunk_max_len ?? 60);
  $("#siren-vox-param-norm").prop("checked", ttsSettings.norm_text || true);
  $("#siren-vox-param-denoise").prop("checked", ttsSettings.denoise || false);
  $("#siren-vox-param-retry").prop(
    "checked",
    ttsSettings.retry_badcase ?? true
  );
  $("#siren-vox-param-cfg").val(ttsSettings.cfg_value ?? 2.5);
  $("#siren-vox-param-steps").val(ttsSettings.inference_timesteps ?? 10);
  $("#siren-vox-param-minlen").val(ttsSettings.min_len ?? 2);
  $("#siren-vox-param-maxlen").val(ttsSettings.max_len ?? 4096);
  $("#siren-vox-param-retrymax").val(ttsSettings.retry_badcase_max_times ?? 3);
  $("#siren-vox-param-retrythresh").val(
    ttsSettings.retry_badcase_ratio_threshold ?? 6
  );
  const $charList = $("#siren-vox-char-list");
  $charList.empty();
  const context = SillyTavern.getContext();
  if (context && context.characterId !== void 0) {
    const charExt = context.characters?.[context.characterId]?.data?.extensions || {};
    const voices = charExt.siren_voice_tts_voxcpm?.voices || {};
    Object.entries(voices).forEach(([charName, config]) => {
      const $row = $(voxCharRowHtml);
      $row.find(".siren-vox-char-name").val(charName);
      $row.find(".siren-vox-char-mode").val(config.mode);
      if (config.mode === "clone") {
        $row.find(".siren-vox-audio-input").val(config.data);
        $row.find(".siren-vox-audio-extra-input").val(config.extra || "");
        $row.find(".siren-vox-audio-ui").show();
        $row.find(".siren-vox-text-ui").hide();
      } else {
        $row.find(".siren-vox-text-input").val(config.data);
        $row.find(".siren-vox-audio-ui").hide();
        $row.find(".siren-vox-text-ui").show();
      }
      $charList.append($row);
    });
  }
  updateTestDropdown();
}
function updateTestDropdown() {
  const $select = $("#siren-vox-test-char");
  const currentVal = $select.val();
  $select.empty().append('<option value="custom">\u81EA\u5B9A\u4E49\u63A7\u5236 (\u4E0D\u4F7F\u7528\u9884\u8BBE\u5217\u8868)</option>');
  $("#siren-vox-char-list .siren-vox-char-row").each(function() {
    const name = $(this).find(".siren-vox-char-name").val().trim();
    if (name) {
      $select.append(`<option value="${name}">${name}</option>`);
    }
  });
  if ($select.find(`option[value="${currentVal}"]`).length > 0) {
    $select.val(currentVal);
  }
}
function bindVoxCpmEvents() {
  $("#siren-vox-char-add").off("click").on("click", function() {
    $("#siren-vox-char-list").append(voxCharRowHtml);
  });
  $("#siren-vox-char-list").off("click", ".siren-vox-row-del").on("click", ".siren-vox-row-del", function() {
    $(this).closest(".siren-vox-char-row").remove();
    updateTestDropdown();
  });
  $("#siren-vox-char-list").off("change", ".siren-vox-char-mode").on("change", ".siren-vox-char-mode", function() {
    const mode = $(this).val();
    const $row = $(this).closest(".siren-vox-char-row");
    if (mode === "clone") {
      $row.find(".siren-vox-audio-ui").show();
      $row.find(".siren-vox-text-ui").hide();
    } else {
      $row.find(".siren-vox-audio-ui").hide();
      $row.find(".siren-vox-text-ui").show();
    }
  });
  $("#siren-vox-char-list").on(
    "input",
    ".siren-vox-char-name",
    updateTestDropdown
  );
  $("#siren-vox-check").off("click").on("click", async function() {
    const apiBase = $("#siren-vox-api").val().trim().replace(/\/$/, "");
    if (!apiBase) {
      if (window.toastr) window.toastr.warning("\u8BF7\u5148\u8F93\u5165 API Base \u5730\u5740\uFF01");
      return;
    }
    const $btn = $(this);
    const $icon = $btn.find("i");
    $icon.removeClass("fa-heart-pulse").addClass("fa-spinner fa-spin");
    try {
      const response = await fetch(`${apiBase}/health`, {
        method: "GET"
      });
      if (response.ok) {
        if (window.toastr) window.toastr.success("VoxCPM \u670D\u52A1\u8FDE\u63A5\u6B63\u5E38\uFF01");
        $icon.css("color", "#10b981");
        setTimeout(() => $icon.css("color", "#ef4444"), 2e3);
      } else {
        if (window.toastr)
          window.toastr.error(`\u5065\u5EB7\u68C0\u67E5\u5931\u8D25: HTTP ${response.status}`);
      }
    } catch (error) {
      console.error("[Siren Voice] VoxCPM \u5065\u5EB7\u68C0\u67E5\u5931\u8D25:", error);
      if (window.toastr)
        window.toastr.error(
          "\u8FDE\u63A5 VoxCPM \u670D\u52A1\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u5730\u5740\u662F\u5426\u6B63\u786E\u6216\u670D\u52A1\u662F\u5426\u542F\u52A8\u3002"
        );
    } finally {
      $icon.removeClass("fa-spinner fa-spin").addClass("fa-heart-pulse");
    }
  });
  $("#siren-vox-test-generate").off("click").on("click", async function() {
    const text = $("#siren-vox-test-text").val().trim();
    const instruction = $("#siren-vox-test-instruction").val().trim();
    const charSelect = $("#siren-vox-test-char").val();
    if (!text) {
      if (window.toastr)
        window.toastr.warning("\u8BF7\u8F93\u5165\u8981\u6D4B\u8BD5\u7684\u5177\u4F53\u8BED\u97F3\u5185\u5BB9\uFF01");
      return;
    }
    const $btn = $(this);
    const $status = $("#siren-vox-test-status");
    const $audio = $("#siren-vox-test-audio");
    const $download = $("#siren-vox-test-download");
    $btn.prop("disabled", true).html('<i class="fa-solid fa-spinner fa-spin"></i> \u751F\u6210\u4E2D');
    $status.text("\u6B63\u5728\u5408\u6210\u97F3\u9891\uFF0C\u8BF7\u7A0D\u5019...");
    $audio.hide();
    $download.hide();
    try {
      const speakObj = { text };
      if (charSelect === "custom") {
        speakObj.char = "";
        speakObj.detail = instruction;
      } else {
        speakObj.char = charSelect;
        speakObj.detail = instruction;
      }
      const settings = getSirenSettings();
      const ttsSettings = settings?.tts?.voxcpm || {};
      const blob = await generateVoxCpmAudioBlob(speakObj, ttsSettings);
      if (blob) {
        const url = setAudioPreview($audio[0], blob);
        $audio.attr("src", url).show()[0].play();
        $download.attr("href", url).show();
        $status.text("\u2705 \u751F\u6210\u6210\u529F");
      } else {
        $status.text("\u274C \u751F\u6210\u5931\u8D25\uFF0C\u8BF7\u67E5\u770B\u63A7\u5236\u53F0\u65E5\u5FD7");
      }
    } catch (err) {
      console.error("[Siren Voice] \u6D4B\u8BD5\u6A21\u5757\u751F\u6210\u5F02\u5E38:", err);
      $status.text("\u274C \u8BF7\u6C42\u53D1\u751F\u5F02\u5E38");
    } finally {
      $btn.prop("disabled", false).html('<i class="fa-solid fa-bolt"></i> \u751F\u6210');
    }
  });
  $("#siren-vox-global-save").off("click").on("click", async function(event, isGlobal = false) {
    const $btn = $(this);
    const voiceMap = {};
    $("#siren-vox-char-list .siren-vox-char-row").each(function() {
      const charName = $(this).find(".siren-vox-char-name").val().trim();
      const mode = $(this).find(".siren-vox-char-mode").val();
      let data = "";
      let extra = "";
      if (mode === "clone") {
        data = $(this).find(".siren-vox-audio-input").val().trim();
        extra = $(this).find(".siren-vox-audio-extra-input").val().trim();
      } else {
        data = $(this).find(".siren-vox-text-input").val().trim();
      }
      if (charName && data) {
        voiceMap[charName] = { mode, data, extra };
      }
    });
    let isCharSaved = false;
    const context2 = SillyTavern.getContext();
    if (context2 && context2.characterId !== void 0 && context2.characterId !== null) {
      await saveToCharacterCard(
        "siren_voice_tts_voxcpm",
        {
          voices: voiceMap,
          updated_at: Date.now()
        },
        true
      );
      isCharSaved = true;
    }
    const settings = getSirenSettings();
    if (!settings.tts) settings.tts = {};
    if (!settings.tts.voxcpm) settings.tts.voxcpm = {};
    const tts = settings.tts.voxcpm;
    tts.api_base = $("#siren-vox-api").val().trim();
    tts.api_key = $("#siren-vox-apikey").val().trim();
    tts.split_method = $("#siren-vox-param-split-method").val();
    tts.chunk_min_len = parseInt($("#siren-vox-param-chunk-min").val()) || 15;
    tts.chunk_max_len = parseInt($("#siren-vox-param-chunk-max").val()) || 60;
    tts.norm_text = $("#siren-vox-param-norm").is(":checked");
    tts.denoise = $("#siren-vox-param-denoise").is(":checked");
    tts.retry_badcase = $("#siren-vox-param-retry").is(":checked");
    tts.cfg_value = parseFloat($("#siren-vox-param-cfg").val()) || 2.5;
    tts.inference_timesteps = parseInt($("#siren-vox-param-steps").val()) || 10;
    tts.min_len = parseInt($("#siren-vox-param-minlen").val()) || 2;
    tts.max_len = parseInt($("#siren-vox-param-maxlen").val()) || 4096;
    tts.retry_badcase_max_times = parseInt($("#siren-vox-param-retrymax").val()) || 3;
    tts.retry_badcase_ratio_threshold = parseFloat($("#siren-vox-param-retrythresh").val()) || 6;
    saveSirenSettings(true);
    await updateTtsGlobalMacros("voxcpm");
    if (!isGlobal && window.toastr) {
      if (isCharSaved) {
        window.toastr.success("VoxCPM \u914D\u7F6E\u5DF2\u4FDD\u5B58\uFF01(\u5DF2\u540C\u6B65\u89D2\u8272\u5361\u4E0E\u5168\u5C40)");
      } else {
        window.toastr.success("VoxCPM \u5168\u5C40\u914D\u7F6E\u5DF2\u4FDD\u5B58");
      }
    }
  });
  let cachedAudioList = null;
  $("#siren-vox-select-files-btn").off("click").on("click", function() {
    $("#siren-vox-file-input").click();
  });
  $("#siren-vox-file-input").off("change").on("change", async function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const settings = getSirenSettings();
    const ttsSettings = settings?.tts?.voxcpm || {};
    if (window.toastr) window.toastr.info(`\u6B63\u5728\u4E0A\u4F20: ${file.name}...`);
    const $btn = $("#siren-vox-select-files-btn");
    const $icon = $btn.find("i");
    $icon.removeClass("fa-cloud-arrow-up").addClass("fa-spinner fa-spin");
    const result = await uploadVoxCpmAudio(file, ttsSettings);
    if (result && result.status === "success") {
      if (window.toastr)
        window.toastr.success(`\u4E0A\u4F20\u6210\u529F: ${result.filename}`);
      cachedAudioList = null;
    } else {
      if (window.toastr)
        window.toastr.error("\u97F3\u9891\u4E0A\u4F20\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u540E\u7AEF\u8FD0\u884C\u72B6\u6001\u3002");
    }
    $icon.removeClass("fa-spinner fa-spin").addClass("fa-cloud-arrow-up");
    $(this).val("");
  });
  const $charList = $("#siren-vox-char-list");
  $charList.off("focus input", ".siren-vox-audio-input").on("focus input", ".siren-vox-audio-input", async function() {
    const $input = $(this);
    const $resultsContainer = $input.siblings(".siren-vox-search-results");
    const keyword = $input.val().trim().toLowerCase();
    if (cachedAudioList === null) {
      const settings = getSirenSettings();
      const ttsSettings = settings?.tts?.voxcpm || {};
      cachedAudioList = await fetchVoxCpmAudioList(ttsSettings);
    }
    const filteredFiles = cachedAudioList.filter(
      (filename) => filename.toLowerCase().includes(keyword)
    );
    $resultsContainer.empty();
    if (filteredFiles.length > 0) {
      filteredFiles.forEach((filename) => {
        $resultsContainer.append(`
          <div class="siren-vox-search-item" style="padding: 6px 10px; cursor: pointer; color: #cbd5e1; font-size: 0.9em;">
            <i class="fa-solid fa-file-audio" style="margin-right: 5px; color: #38bdf8;"></i>${filename}
          </div>
        `);
      });
      $resultsContainer.slideDown(150);
    } else {
      $resultsContainer.append(`
        <div style="padding: 6px 10px; color: #64748b; font-size: 0.9em; text-align: center;">
          \u672A\u627E\u5230\u5339\u914D\u7684\u97F3\u9891
        </div>
      `);
      $resultsContainer.show();
    }
  });
  $charList.off("click", ".siren-vox-search-item").on("click", ".siren-vox-search-item", function() {
    const filename = $(this).text().trim();
    const $input = $(this).closest(".siren-vox-audio-ui").find(".siren-vox-audio-input");
    const $resultsContainer = $(this).closest(".siren-vox-search-results");
    $input.val(filename);
    $resultsContainer.hide();
  });
  $(document).off("click.sirenvox").on("click.sirenvox", function(e) {
    if (!$(e.target).closest(".siren-vox-audio-ui").length) {
      $(".siren-vox-search-results").hide();
    }
  });
  const context = SillyTavern.getContext();
  if (context && context.eventSource) {
    context.eventSource.removeListener("chat_id_changed", loadVoxCpmData);
    context.eventSource.on("chat_id_changed", loadVoxCpmData);
  }
  loadVoxCpmData();
}

// scripts/tts.js
init_settings();
init_utils();
init_db();
init_tts_logic();

// scripts/macros.js
init_settings();
var macroRefs = {
  voice: null,
  mood: null,
  ambience: null,
  sfx: null
};
var getBaseName = (name) => {
  if (!name || typeof name !== "string") return "";
  return name.replace(/-\d+$/, "").trim();
};
function updateTtsListMacros(voiceStr, moodStr) {
  if (!window.TavernHelper || typeof window.TavernHelper.registerMacroLike !== "function")
    return;
  if (macroRefs.voice) {
    macroRefs.voice.unregister();
    macroRefs.voice = null;
  }
  if (macroRefs.mood) {
    macroRefs.mood.unregister();
    macroRefs.mood = null;
  }
  macroRefs.voice = window.TavernHelper.registerMacroLike(
    /\{\{VOICE_LIST\}\}/gi,
    () => voiceStr ? `[${voiceStr}]` : "[]"
  );
  macroRefs.mood = window.TavernHelper.registerMacroLike(
    /\{\{MOOD_LIST\}\}/gi,
    () => moodStr ? `[${moodStr}]` : "[]"
  );
  console.log(
    `[Siren Voice] \u{1F504} TTS \u5B8F\u5DF2\u91CD\u8F7D -> \u97F3\u8272: [${voiceStr}], \u60C5\u7EEA: [${moodStr}]`
  );
}
function registerSirenMacros() {
  if (!window.TavernHelper || typeof window.TavernHelper.registerMacroLike !== "function") {
    console.warn("[Siren Voice] \u26A0\uFE0F TavernHelper \u672A\u5C31\u7EEA\uFF0C\u8DF3\u8FC7\u5B8F\u6CE8\u518C\u3002");
    return;
  }
  if (macroRefs.ambience) macroRefs.ambience.unregister();
  if (macroRefs.sfx) macroRefs.sfx.unregister();
  macroRefs.ambience = window.TavernHelper.registerMacroLike(
    /\{\{AMBIENCE_LIST\}\}/gi,
    () => {
      try {
        const settings = getSirenSettings() || {};
        const ambienceState = settings.ambience || {};
        const ambienceLib = ambienceState.libraries && ambienceState.current_list ? ambienceState.libraries[ambienceState.current_list] : [];
        const uniqueNames = [
          ...new Set(
            (ambienceLib || []).map((item) => getBaseName(item?.name)).filter(Boolean)
          )
        ];
        return uniqueNames.length > 0 ? `[${uniqueNames.join(", ")}]` : "[]";
      } catch (e) {
        return "[]";
      }
    }
  );
  macroRefs.sfx = window.TavernHelper.registerMacroLike(
    /\{\{SFX_LIST\}\}/gi,
    () => {
      try {
        const settings = getSirenSettings() || {};
        const ambienceState = settings.ambience || {};
        const sfxLib = ambienceState.sfx_libraries && ambienceState.sfx_current_list ? ambienceState.sfx_libraries[ambienceState.sfx_current_list] : [];
        const uniqueNames = [
          ...new Set(
            (sfxLib || []).map((item) => getBaseName(item?.name)).filter(Boolean)
          )
        ];
        return uniqueNames.length > 0 ? `[${uniqueNames.join(", ")}]` : "[]";
      } catch (e) {
        return "[]";
      }
    }
  );
  console.log("[Siren Voice] \u2705 Ambience \u4E0E SFX \u5B8F\u521D\u59CB\u5316\u5B8C\u6210\u3002");
}

// scripts/tts.js
var tempTtsStyles = {};
var currentTtsStyleName = "\u9ED8\u8BA4\u6C14\u6CE1";
function initTtsSettings() {
  const ttsTab = document.getElementById("tab-tts");
  if (!ttsTab) return;
  const ttsHtml = `
        <div class="siren-ext-settings-container">
            <h3 style="display: flex; align-items: center; justify-content: space-between;">
                <span><i class="fa-solid fa-microphone-lines fa-fw" style="color:#a855f7; margin-right:8px;"></i>\u585E\u58EC\u4E4B\u58F0 (TTS)</span>
                <div>
                    <i id="siren-tts-history-btn" class="fa-solid fa-clock-rotate-left" style="cursor: pointer; color: #a855f7; font-size: 1.2em; margin-right: 15px;" title="\u67E5\u770B\u8BED\u97F3\u5386\u53F2"></i>
                    <i id="siren-tts-save-global-btn" class="fa-solid fa-floppy-disk" style="cursor: pointer; color: #10b981; font-size: 1.2em;" title="\u4FDD\u5B58\u5168\u5C40TTS\u8BBE\u7F6E"></i>
                </div>
            </h3>

            <div class="siren-ext-setting-row siren-ext-flex-between" style="border-color: #06b6d4; background: rgba(6, 182, 212, 0.1);">
                <div class="siren-ext-setting-label">
                    <label for="siren-tts-enable" style="color: #06b6d4; font-size: 1.1em; font-weight: bold;">\u542F\u7528 TTS</label>
                </div>
                <label class="siren-ext-switch">
                    <input type="checkbox" id="siren-tts-enable">
                    <span class="siren-ext-slider"></span>
                </label>
            </div>

            <div id="siren-tts-main-wrapper" style="display: none; margin-top: 15px;">
                
                <h4 style="color: #94a3b8; margin-bottom: 10px;"><i class="fa-solid fa-sliders" style="margin-right: 5px;"></i> \u901A\u7528\u8BBE\u7F6E</h4>
                
                <div style="background: rgba(15, 23, 42, 0.5); border: 1px solid #334155; border-radius: 6px; padding: 10px 15px; margin-bottom: 15px;">
                    <div class="siren-ext-setting-row siren-ext-flex-between" style="border-bottom: 1px solid rgba(51, 65, 85, 0.5); padding-bottom: 10px; margin-bottom: 10px;">
                        <div class="siren-ext-setting-label">
                            <label>\u4FDD\u5B58\u6700\u65B0\u8BED\u97F3</label>
                            <small style="display:block;">\u9650\u5236\u672C\u5730\u5B58\u50A8\u7684\u8BED\u97F3\u6570\u91CF\u6761\u6570</small>
                        </div>
                        <div style="display: flex; align-items: center; gap: 5px;">
                            <style>
                                #siren-tts-history-length::-webkit-outer-spin-button,
                                #siren-tts-history-length::-webkit-inner-spin-button {
                                    -webkit-appearance: none;
                                    margin: 0;
                                }
                                #siren-tts-history-length {
                                    -moz-appearance: textfield; 
                                }
                            </style>
                            <input type="number" id="siren-tts-history-length" class="siren-ext-input" style="width: 60px; text-align: center;" min="0" max="200">
                            <span style="color: #94a3b8;">\u6761</span>
                        </div>
                    </div>

                    <div class="siren-ext-setting-row siren-ext-flex-between" style="padding-bottom: 5px;">
                        <div class="siren-ext-setting-label">
                            <label>\u5411\u5927\u6A21\u578B\u9690\u85CF\u8BED\u97F3\u6807\u7B7E</label>
                            <small style="display:block;">\u5F00\u542F\u540E\uFF0C\u53D1\u9001\u7ED9LLM\u7684\u4E0A\u4E0B\u6587\u4E2D\u4E0D\u518D\u5305\u542B &lt;speak&gt; \u4EE3\u7801</small>
                        </div>
                        <label class="siren-ext-switch">
                            <input type="checkbox" id="siren-tts-clean-prompt">
                            <span class="siren-ext-slider"></span>
                        </label>
                    </div>

                    <div id="siren-tts-clean-replacement-wrapper" style="display: none;">
                        <div class="siren-ext-flex-between" style="background: rgba(0,0,0,0.2); padding: 8px 15px; border-left: 2px solid #06b6d4; border-radius: 4px 4px 0 0; margin-top: 10px;">
                            <div class="siren-ext-setting-label">
                                <label style="color: #e2e8f0; font-size: 1.05em;">\u666E\u901A\u8BED\u97F3 (&lt;speak&gt;) \u66FF\u6362\u4E3A</label>
                            </div>
                            <input type="text" id="siren-tts-clean-replacement-speak" class="siren-ext-input" style="width: 80px; text-align: center;" placeholder="\u201C\u201D">
                        </div>
                        <div class="siren-ext-flex-between" style="background: rgba(0,0,0,0.2); padding: 8px 15px; border-left: 2px solid #06b6d4; border-top: 1px solid rgba(255,255,255,0.05);">
                            <div class="siren-ext-setting-label">
                                <label style="color: #e2e8f0; font-size: 1.05em;">\u7535\u8BDD\u8BED\u97F3 (&lt;phone&gt;) \u66FF\u6362\u4E3A</label>
                            </div>
                            <input type="text" id="siren-tts-clean-replacement-phone" class="siren-ext-input" style="width: 80px; text-align: center;" placeholder="\u201C\u201D">
                        </div>
                        <div class="siren-ext-flex-between" style="background: rgba(0,0,0,0.2); padding: 8px 15px; border-left: 2px solid #06b6d4; border-top: 1px solid rgba(255,255,255,0.05); border-radius: 0 0 4px 4px;">
                            <div class="siren-ext-setting-label">
                                <label style="color: #e2e8f0; font-size: 1.05em;">\u60F3\u6CD5\u8BED\u97F3 (&lt;inner&gt;) \u66FF\u6362\u4E3A</label>
                            </div>
                            <input type="text" id="siren-tts-clean-replacement-inner" class="siren-ext-input" style="width: 80px; text-align: center;" placeholder="**">
                        </div>
                    </div>

                </div>
                <hr class="siren-ext-divider">

                <div id="siren-tts-beautify-wrapper" style="background: rgba(15, 23, 42, 0.5); border: 1px dashed #64748b; padding: 15px; border-radius: 6px; margin-bottom: 20px; margin-top: 20px;">
                    <div style="margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid rgba(51, 65, 85, 0.5);">
                        <div class="siren-ext-setting-label" style="margin-bottom: 12px;">
                            <label style="color: #f472b6; font-size: 1.15em; font-weight: bold;"><i class="fa-solid fa-wand-magic-sparkles" style="margin-right: 8px;"></i>\u2728 \u8BED\u97F3\u6761\u7F8E\u5316</label>
                        </div>
    
                        <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 10px;">
                            <span style="color: #e2e8f0; font-size: 14px; white-space: nowrap;">\u5F53\u524D\u7F8E\u5316:</span>
                            <select id="siren-tts-beautify-select" class="siren-ext-select" style="flex: 1; background: rgba(0,0,0,0.3); border-color: #334155; min-width: 0;">
                            </select>
                        </div>
    
                        <div style="display: flex; gap: 15px; align-items: center; justify-content: space-around; padding: 5px 10px; background: rgba(0,0,0,0.1); border-radius: 4px;">
                            <button id="siren-tts-beautify-import" class="siren-ext-btn" style="background:none; border:none; padding:8px; width:auto; min-width:0; color:#cbd5e1;" title="\u5BFC\u5165">
                                <i class="fa-solid fa-file-import" style="font-size: 1.2em;"></i>
                            </button>
                            <button id="siren-tts-beautify-export" class="siren-ext-btn" style="background:none; border:none; padding:8px; width:auto; min-width:0; color:#cbd5e1;" title="\u5BFC\u51FA">
                                <i class="fa-solid fa-file-export" style="font-size: 1.2em;"></i>
                            </button>
                            <button id="siren-tts-beautify-add" class="siren-ext-btn" style="background:none; border:none; padding:8px; width:auto; min-width:0; color:#cbd5e1;" title="\u6DFB\u52A0">
                                <i class="fa-solid fa-plus" style="font-size: 1.2em;"></i>
                            </button>
                            <button id="siren-tts-beautify-del" class="siren-ext-btn" style="background:none; border:none; padding:8px; width:auto; min-width:0; color:#ef4444;" title="\u5220\u9664">
                                <i class="fa-solid fa-trash" style="font-size: 1.2em;"></i>
                            </button>
                            <input type="file" id="siren-tts-beautify-file-import" accept=".json" style="display: none;">
                        </div>
                    </div>
                    <textarea id="siren-tts-beautify-css" class="siren-ext-textarea" rows="5" placeholder="/* \u5728\u6B64\u7F16\u8F91 CSS/HTML \u7ED3\u6784 */" style="font-family: 'Consolas', 'Courier New', monospace; border: 1px solid #334155; border-radius: 6px; padding: 10px; background: #0f172a; resize: vertical; line-height: 1.5; color: #e2e8f0;"></textarea>
                    <div class="siren-ext-style-preview-box" style="margin-top: 15px; background: rgba(15, 23, 42, 0.6); border: 1px solid #1e293b; border-radius: 8px; padding: 15px;">
                        <div style="color: #94a3b8; font-size: 0.8em; margin-bottom: 12px; display:flex; justify-content:space-between;">
                            <span><i class="fa-solid fa-eye"></i> \u8BED\u97F3\u6761\u5B9E\u673A\u9884\u89C8</span>
                            <span id="siren-tts-preview-status" style="color:#10b981;">\u5DF2\u5C31\u7EEA</span>
                        </div>
                        
                        <div class="siren-ext-chat-msg-mock" style="display: flex; gap: 12px;">
                            <div style="width: 32px; height: 32px; border-radius: 50%; background: #1e293b; display: flex; align-items: center; justify-content: center; font-size: 1.2em; border: 1px solid #06b6d4; box-shadow: 0 0 8px rgba(6, 182, 212, 0.4); flex-shrink: 0;">\u{1F30A}</div>
                            <div style="flex: 1;">
                                <div style="font-size: 0.85em; color: #94a3b8; margin-bottom: 4px;">Siren</div>
                                <div style="color: #cbd5e1; font-size: 0.9em; line-height: 1.5;">
                                    \u4ECA\u5929\u60F3\u8981\u542C\u4EC0\u4E48\u5462\uFF1F
                                    <div id="siren-tts-preview-render" style="margin-top: 8px;">
                                        <div class="siren-speak-card" data-siren-speak="1" tabindex="0">
                                            <span class="siren-btn-wrap siren-play-wrap" title="\u64AD\u653E">
                                                <i class="fa-solid fa-circle-play"></i>
                                            </span>
                                            <span class="siren-speak-text">\u6765\u81EA\u6DF1\u6D77\u7684\u547C\u5524...</span>
                                            <span class="siren-btn-wrap siren-regen-wrap" title="\u91CD\u65B0\u751F\u6210">
                                                <i class="fa-solid fa-rotate-right"></i>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <hr class="siren-ext-divider">

                <div class="siren-ext-setting-row siren-ext-flex-between">
                    <div class="siren-ext-setting-label">
                        <label style="color: #a855f7; font-size: 1.1em; font-weight: bold;"><i class="fa-solid fa-microchip" style="margin-right: 5px;"></i>\u5F53\u524D TTS</label>
                    </div>
                    <select id="siren-tts-provider" class="siren-ext-select" style="max-width: 200px; border-color: #0ea5e9 !important; box-shadow: 0 0 10px rgba(14, 165, 233, 0.5) !important; outline: none; background-color: rgba(15, 23, 42, 0.8);">
                        <option value="indextts">Index-TTS 2</option>
                        <option value="gptsovits">GPT-SoVITS</option>
                        <option value="voxcpm">VoxCPM 2</option>
                        <option value="doubao">\u8C46\u5305\uFF08\u706B\u5C71\u5F15\u64CE\uFF09</option>
                        <option value="minimax">MiniMax</option>
                    </select>
                </div>

                <div id="siren-tts-provider-settings" style="margin-top: 15px; border: 1px dashed #64748b; border-radius: 6px; padding: 15px; background: rgba(15, 23, 42, 0.5);">
                    </div>

                <hr class="siren-ext-divider">
            </div>
        </div>

        <div id="siren-tts-history-overlay" style="display:none; position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.6); z-index:9998; backdrop-filter: blur(2px); align-items: center; justify-content: center;">
            
            <div id="siren-tts-history-modal" style="display:flex; width:650px; max-width:90vw; height:70vh; max-height:85vh; background:#0f172a; border:1px solid #38bdf8; border-radius:10px; flex-direction:column; box-shadow: 0 10px 30px rgba(0,0,0,0.7);">
                <div style="padding: 15px; border-bottom: 1px solid #1e293b; display: flex; justify-content: space-between; align-items: center; background: rgba(56, 189, 248, 0.1); border-radius: 10px 10px 0 0;">
                    <h3 style="margin:0; color:#38bdf8; font-size: 1.2em;"><i class="fa-solid fa-clock-rotate-left" style="margin-right:8px;"></i>\u5386\u53F2\u8BED\u97F3\u8BB0\u5F55</h3>
                    <i id="siren-tts-history-close" class="fa-solid fa-xmark" style="cursor:pointer; color:#ef4444; font-size:1.5em; transition: color 0.2s;"></i>
                </div>
                <div id="siren-tts-history-list" style="padding: 15px; overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 12px;">
                    <div style="text-align:center; color:#64748b; margin-top: 20px;">\u6B63\u5728\u52A0\u8F7D\u5386\u53F2\u8BB0\u5F55...</div>
                </div>
            </div>
            
        </div>
    `;
  ttsTab.innerHTML = ttsHtml;
  const settings = getSirenSettings();
  if (isTauriIOS()) {
    $("#tab-tts h3").first().after('<p style="color:#94a3b8;font-size:0.9em;">TT / iOS \u9002\u914D\u5DF2\u542F\u7528\uFF1A\u6574\u697C\u8BED\u97F3\u6309\u53E5\u52A0\u8F7D\u64AD\u653E\uFF0C\u964D\u4F4E\u8FDE\u7EED\u4F7F\u7528\u65F6\u7684\u5185\u5B58\u5360\u7528\u3002</p>');
  }
  $("#siren-tts-enable").prop("checked", settings.tts.enabled);
  if (settings.tts.enabled) $("#siren-tts-main-wrapper").show();
  $("#siren-tts-history-length").val(settings.tts.history_length ?? 30);
  const isCleanPromptEnabled = settings.tts.clean_speak_tags_to_llm ?? false;
  $("#siren-tts-clean-prompt").prop("checked", isCleanPromptEnabled);
  $("#siren-tts-clean-replacement-speak").val(
    settings.tts.clean_speak_tags_replacement || "\u201C\u201D"
  );
  $("#siren-tts-clean-replacement-phone").val(
    settings.tts.clean_phone_tags_replacement || "\u201C\u201D"
  );
  $("#siren-tts-clean-replacement-inner").val(
    settings.tts.clean_inner_tags_replacement || "**"
  );
  if (isCleanPromptEnabled) {
    $("#siren-tts-clean-replacement-wrapper").show();
  }
  tempTtsStyles = settings.tts.beautify_list || { \u9ED8\u8BA4\u6C14\u6CE1: "" };
  currentTtsStyleName = settings.tts.beautify_current || "\u9ED8\u8BA4\u6C14\u6CE1";
  if (!tempTtsStyles[currentTtsStyleName]) {
    currentTtsStyleName = Object.keys(tempTtsStyles)[0] || "\u9ED8\u8BA4\u6C14\u6CE1";
  }
  const $select = $("#siren-tts-beautify-select");
  $select.empty();
  for (const name in tempTtsStyles) {
    $select.append(`<option value="${name}">${name}</option>`);
  }
  $select.val(currentTtsStyleName);
  applyTtsBeautifyCss();
  updateTextareaState(currentTtsStyleName);
  if (settings.tts.provider) {
    $("#siren-tts-provider").val(settings.tts.provider);
  }
  bindTtsGlobalUiEvents();
  renderProviderSettings();
  const initialProvider = $("#siren-tts-provider").val() || "doubao";
  updateTtsGlobalMacros(initialProvider);
  const context = SillyTavern.getContext();
  context.eventSource.on("chat_id_changed", () => {
    setTimeout(async () => {
      const currentProvider = $("#siren-tts-provider").val() || "indextts";
      console.log(
        `[Siren Voice] \u{1F4E2} \u6355\u83B7 chat_id_changed\uFF0C\u51C6\u5907\u91CD\u8F7D\u5B8F -> \u6E20\u9053: [${currentProvider}]`
      );
      await updateTtsGlobalMacros(currentProvider);
      if ($("#siren-tts-history-modal").is(":visible")) {
        console.log("[Siren Voice] \u5237\u65B0\u5386\u53F2\u9762\u677F...");
        renderTtsHistory();
      }
    }, 150);
  });
}
function updateTextareaState(styleName) {
  const $textarea = $("#siren-tts-beautify-css");
  if (styleName === "\u9ED8\u8BA4\u6C14\u6CE1") {
    $textarea.prop("readonly", true);
    $textarea.css({
      background: "rgba(30, 41, 59, 0.5)",
      color: "#64748b",
      cursor: "not-allowed"
    });
    $textarea.val(
      "/* \u9ED8\u8BA4\u6C14\u6CE1\u4F7F\u7528\u5185\u7F6E\u6837\u5F0F\uFF0C\u4E0D\u53EF\u7F16\u8F91\u3002\n   \u8BF7\u70B9\u51FB\u53F3\u4E0A\u89D2 [+] \u65B0\u5EFA\u60A8\u7684\u81EA\u5B9A\u4E49\u6837\u5F0F\u3002 */"
    );
  } else {
    $textarea.prop("readonly", false);
    $textarea.css({
      background: "#0f172a",
      color: "#e2e8f0",
      cursor: "text"
    });
    $textarea.val(tempTtsStyles[styleName] || "");
  }
  $textarea.trigger("input");
}
function bindTtsGlobalUiEvents() {
  $("#siren-tts-enable").on("change", async function() {
    const isEnabled = $(this).is(":checked");
    const currentProvider = $("#siren-tts-provider").val();
    if (isEnabled) {
      $("#siren-tts-main-wrapper").slideDown(300);
    } else {
      $("#siren-tts-main-wrapper").slideUp(300);
    }
    const settings = getSirenSettings();
    settings.tts.enabled = isEnabled;
    saveSirenSettings(true);
    await syncTtsWorldbookEntries(currentProvider, isEnabled);
  });
  $("#siren-tts-clean-prompt").on("change", function() {
    if ($(this).is(":checked")) {
      $("#siren-tts-clean-replacement-wrapper").slideDown(250);
    } else {
      $("#siren-tts-clean-replacement-wrapper").slideUp(200);
    }
  });
  $("#siren-tts-beautify-select").on("change", function() {
    currentTtsStyleName = $(this).val();
    updateTextareaState(currentTtsStyleName);
  });
  $("#siren-tts-beautify-add").off("click").on("click", function() {
    const newName = prompt("\u8BF7\u8F93\u5165\u65B0\u7684\u7F8E\u5316\u6837\u5F0F\u540D\u79F0 (\u4F8B\u5982: \u8D5B\u535A\u7EC8\u7AEF\u98CE)\uFF1A");
    if (!newName || !newName.trim()) return;
    const cleanName = newName.trim();
    if (tempTtsStyles[cleanName] !== void 0) {
      if (window.toastr) window.toastr.warning("\u8BE5\u6837\u5F0F\u540D\u79F0\u5DF2\u5B58\u5728\uFF01");
      return;
    }
    tempTtsStyles[cleanName] = "";
    $("#siren-tts-beautify-select").append(
      `<option value="${cleanName}">${cleanName}</option>`
    );
    $("#siren-tts-beautify-select").val(cleanName).trigger("change");
    if (window.toastr) window.toastr.success(`\u5DF2\u521B\u5EFA\u6682\u5B58\u6837\u5F0F: ${cleanName}`);
  });
  $("#siren-tts-beautify-del").off("click").on("click", function() {
    if (currentTtsStyleName === "\u9ED8\u8BA4\u6C14\u6CE1") {
      if (window.toastr)
        window.toastr.error("\u5185\u7F6E\u7684 [\u9ED8\u8BA4\u6C14\u6CE1] \u65E0\u6CD5\u88AB\u5220\u9664\uFF01");
      return;
    }
    if (confirm(
      `\u786E\u5B9A\u8981\u5220\u9664\u7F8E\u5316\u6837\u5F0F [${currentTtsStyleName}] \u5417\uFF1F
\u6CE8\u610F\uFF1A\u5FC5\u987B\u70B9\u51FB\u53F3\u4E0A\u89D2\u4FDD\u5B58\u624D\u4F1A\u771F\u6B63\u751F\u6548\u3002`
    )) {
      delete tempTtsStyles[currentTtsStyleName];
      $(
        `#siren-tts-beautify-select option[value="${currentTtsStyleName}"]`
      ).remove();
      currentTtsStyleName = "\u9ED8\u8BA4\u6C14\u6CE1";
      $("#siren-tts-beautify-select").val("\u9ED8\u8BA4\u6C14\u6CE1").trigger("change");
    }
  });
  $("#siren-tts-beautify-export").off("click").on("click", function() {
    if (currentTtsStyleName === "\u9ED8\u8BA4\u6C14\u6CE1") {
      if (window.toastr)
        window.toastr.warning("\u5185\u7F6E\u7684 [\u9ED8\u8BA4\u6C14\u6CE1] \u65E0\u9700\u5BFC\u51FA\uFF01");
      return;
    }
    const currentCss = tempTtsStyles[currentTtsStyleName] || "";
    const exportData = {
      name: currentTtsStyleName,
      css: currentCss
    };
    const dataStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `siren_tts_style_${currentTtsStyleName}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });
  const ttsStyleFileInput = document.getElementById(
    "siren-tts-beautify-file-import"
  );
  $("#siren-tts-beautify-import").off("click").on("click", function() {
    ttsStyleFileInput.click();
  });
  $(ttsStyleFileInput).on("change", function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target.result);
        if (!importedData || typeof importedData.css !== "string") {
          throw new Error("\u6587\u4EF6\u683C\u5F0F\u9519\u8BEF\uFF0C\u975E Siren \u6837\u5F0F\u5BFC\u51FA\u4EF6");
        }
        let defaultName = importedData.name || file.name.replace(/\.json$/i, "");
        let newName = prompt("\u8BF7\u8F93\u5165\u5BFC\u5165\u7684\u8BED\u97F3\u6761\u6837\u5F0F\u540D\u79F0\uFF1A", defaultName);
        if (!newName) {
          ttsStyleFileInput.value = "";
          return;
        }
        let cleanName = newName.trim();
        let finalName = cleanName;
        let counter = 1;
        while (tempTtsStyles[finalName] !== void 0) {
          finalName = `${cleanName}_${counter}`;
          counter++;
        }
        tempTtsStyles[finalName] = importedData.css;
        $("#siren-tts-beautify-select").append(
          `<option value="${finalName}">${finalName}</option>`
        );
        $("#siren-tts-beautify-select").val(finalName).trigger("change");
        if (window.toastr)
          window.toastr.success(`\u6210\u529F\u5BFC\u5165\u5E76\u521B\u5EFA\u6837\u5F0F\uFF1A${finalName}`);
      } catch (err) {
        console.error(err);
        if (window.toastr)
          window.toastr.error("\u6837\u5F0F\u5BFC\u5165\u5931\u8D25\uFF1A\u6587\u4EF6\u683C\u5F0F\u4E0D\u6B63\u786E\u6216\u5DF2\u635F\u574F");
      }
      ttsStyleFileInput.value = "";
    };
    reader.readAsText(file);
  });
  $("#siren-tts-beautify-css").on("input", function() {
    const cssContent = $(this).val();
    let styleTag = document.getElementById("siren-tts-beautify-style");
    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = "siren-tts-beautify-style";
      document.head.appendChild(styleTag);
    }
    if (currentTtsStyleName === "\u9ED8\u8BA4\u6C14\u6CE1") {
      styleTag.textContent = "";
    } else {
      tempTtsStyles[currentTtsStyleName] = cssContent;
      styleTag.textContent = compileSirenCss(cssContent);
    }
    if (currentTtsStyleName !== "\u9ED8\u8BA4\u6C14\u6CE1") {
      const $status = $("#siren-tts-preview-status");
      $status.text("\u6B63\u5728\u9884\u89C8...").css("color", "#0ea5e9");
      clearTimeout(window.sirenPreviewTimer);
      window.sirenPreviewTimer = setTimeout(() => {
        $status.text("\u672A\u4FDD\u5B58").css("color", "#f59e0b");
      }, 800);
    } else {
      $("#siren-tts-preview-status").text("\u7CFB\u7EDF\u9ED8\u8BA4").css("color", "#64748b");
    }
  });
  $("#siren-tts-provider").on("change", async function() {
    renderProviderSettings();
    const newProvider = $(this).val();
    const isEnabled = $("#siren-tts-enable").is(":checked");
    await syncTtsWorldbookEntries(newProvider, isEnabled);
    await updateTtsGlobalMacros(newProvider);
  });
  $("#siren-tts-history-btn").off("click").on("click", function() {
    $("#siren-tts-history-overlay").css("display", "flex").hide().fadeIn(200);
    renderTtsHistory();
  });
  $("#siren-tts-history-close, #siren-tts-history-overlay").off("click").on("click", function(e) {
    if (e.target.id === "siren-tts-history-overlay" || e.target.id === "siren-tts-history-close") {
      $("#siren-tts-history-overlay").fadeOut(200);
    }
  });
  $("#siren-tts-save-global-btn").off("click").on("click", async function() {
    try {
      const settings = getSirenSettings();
      const isEnabled = $("#siren-tts-enable").is(":checked");
      const currentProvider = $("#siren-tts-provider").val();
      settings.tts.enabled = isEnabled;
      settings.tts.provider = currentProvider;
      const histLen = parseInt($("#siren-tts-history-length").val());
      settings.tts.history_length = isNaN(histLen) ? 30 : Math.max(0, histLen);
      settings.tts.clean_speak_tags_to_llm = $("#siren-tts-clean-prompt").is(
        ":checked"
      );
      settings.tts.clean_speak_tags_replacement = $("#siren-tts-clean-replacement-speak").val() || "\u201C\u201D";
      settings.tts.clean_phone_tags_replacement = $("#siren-tts-clean-replacement-phone").val() || "\u201C\u201D";
      settings.tts.clean_inner_tags_replacement = $("#siren-tts-clean-replacement-inner").val() || "**";
      settings.tts.beautify_enabled = true;
      settings.tts.beautify_list = tempTtsStyles;
      settings.tts.beautify_current = currentTtsStyleName;
      settings.tts.beautify_css = tempTtsStyles[currentTtsStyleName];
      saveSirenSettings(true);
      applyTtsBeautifyCss();
      await syncTtsWorldbookEntries(currentProvider, isEnabled);
      if (currentProvider === "indextts") {
        $("#siren-idx-global-save").trigger("click", [true]);
      } else if (currentProvider === "minimax") {
        $("#siren-mm-save-all").trigger("click", [true]);
      } else if (currentProvider === "doubao") {
        $("#siren-db-char-save").trigger("click", [true]);
      } else if (currentProvider === "gptsovits") {
        $("#siren-gsv-save-btn").trigger("click", [true]);
      } else if (currentProvider === "voxcpm") {
        $("#siren-vox-global-save").trigger("click", [true]);
      }
      await updateTtsGlobalMacros(currentProvider);
      if (window.toastr) {
        window.toastr.success(
          `\u5168\u91CF\u6570\u636E\u66F4\u65B0\uFF1A\u901A\u7528\u8BBE\u7F6E\u53CA [${currentProvider}] \u914D\u7F6E\u5DF2\u5206\u6D41\u4FDD\u5B58\u81F3\u5168\u5C40\u4E0E\u89D2\u8272\u5361\uFF01`
        );
      }
      const $status = $("#siren-tts-preview-status");
      $status.text("\u5168\u5C40\u4E0E\u6E20\u9053\u914D\u7F6E\u5DF2\u540C\u6B65\uFF01").css("color", "#10b981");
    } catch (error) {
      console.error("[Siren Voice] \u4FDD\u5B58\u8FC7\u7A0B\u4E2D\u53D1\u751F\u9519\u8BEF:", error);
      if (window.toastr) {
        window.toastr.error("\u4FDD\u5B58\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u63A7\u5236\u53F0\u62A5\u9519\uFF01");
      }
    }
  });
}
function renderProviderSettings() {
  const provider = $("#siren-tts-provider").val();
  const container = $("#siren-tts-provider-settings");
  container.empty();
  if (provider === "indextts") {
    container.html(getIndexTtsHtml());
    bindIndexTtsEvents();
  } else if (provider === "minimax") {
    container.html(getMinimaxHtml());
    bindMinimaxEvents();
  } else if (provider === "doubao") {
    container.html(getDoubaoHtml());
    bindDoubaoEvents();
  } else if (provider === "gptsovits") {
    container.html(getGptSovitsHtml());
    bindGptSovitsEvents();
  } else if (provider === "voxcpm") {
    container.html(getVoxCpmHtml());
    bindVoxCpmEvents();
  } else {
    container.html(
      `<div style="text-align:center; padding: 20px; color:#64748b;">${provider} \u8BBE\u7F6E\u754C\u9762\u6784\u5EFA\u4E2D... \u{1F6A7}</div>`
    );
  }
}
async function updateTtsGlobalMacros(provider) {
  const context = SillyTavern.getContext();
  const charId = context.characterId;
  const charExt = charId !== void 0 && charId !== null ? context.characters?.[charId]?.data?.extensions || {} : {};
  let currentVoice = "";
  let currentMood = "";
  try {
    const settings = getSirenSettings();
    if (provider === "doubao") {
      const voices = charExt.siren_voice_tts_doubao?.voices || {};
      currentVoice = Object.keys(voices).join(", ");
      currentMood = "";
    } else if (provider === "indextts") {
      const voices = charExt.siren_voice_tts?.voices || {};
      currentVoice = Object.keys(voices).join(", ");
      const presets = settings?.tts?.indextts?.emotion_presets || [];
      currentMood = presets.map((p) => p.name).filter(Boolean).join(", ");
    } else if (provider === "minimax") {
      const voices = charExt.siren_voice_tts_minimax?.voices || {};
      currentVoice = Object.keys(voices).join(", ");
      currentMood = "";
    } else if (provider === "gptsovits") {
      const charactersList = charExt.siren_voice_gptsovits?.characters || [];
      currentVoice = charactersList.map((c) => c.charName).filter(Boolean).join(", ");
      const emotionsList = charExt.siren_voice_gptsovits?.emotions || [];
      currentMood = emotionsList.map((e) => e.emotion).filter(Boolean).join(", ");
    } else if (provider === "voxcpm") {
      const voices = charExt.siren_voice_tts_voxcpm?.voices || {};
      currentVoice = Object.keys(voices).join(", ");
      currentMood = "";
    }
    console.log(
      `[Siren Voice] \u{1F504} \u5207\u6362\u81F3 [${provider}], \u63D0\u53D6\u5B8F\u53C2\u6570 -> Voice: "${currentVoice}", Mood: "${currentMood}"`
    );
    if (typeof updateTtsListMacros === "function") {
      updateTtsListMacros(currentVoice, currentMood);
    }
    if (window.TavernHelper && typeof window.TavernHelper.updateVariablesWith === "function") {
      await window.TavernHelper.updateVariablesWith(
        (vars) => {
          if (!vars["siren-voice"]) vars["siren-voice"] = {};
          if (!vars["siren-voice"].tts) vars["siren-voice"].tts = {};
          vars["siren-voice"].tts.provider = provider;
          vars["siren-voice"].tts.voice = currentVoice;
          vars["siren-voice"].tts.mood = currentMood;
          return vars;
        },
        { type: "global" }
      );
      console.log(
        "[Siren Voice] \u2728 \u5168\u5C40\u5B8F\u66F4\u65B0\u6210\u529F (\u53EF\u901A\u8FC7 {{global:siren-voice.tts.voice}} \u548C {{global:siren-voice.tts.mood}} \u63D0\u53D6)"
      );
    } else if (typeof window.executeSlashCommands === "function") {
      const safeVoice = currentVoice || "\u65E0";
      const safeMood = currentMood || "\u65E0";
      window.executeSlashCommands(`/setvar key=siren_tts_voice ${safeVoice}`);
      window.executeSlashCommands(`/setvar key=siren_tts_mood ${safeMood}`);
    }
  } catch (error) {
    console.error("[Siren Voice] \u274C \u66F4\u65B0 TTS \u5168\u5C40\u5B8F\u65F6\u53D1\u751F\u9519\u8BEF:", error);
  }
}
function applyTtsBeautifyCss() {
  const settings = getSirenSettings();
  const customCss = settings?.tts?.beautify_css ?? "";
  let styleTag = document.getElementById("siren-tts-beautify-style");
  if (!styleTag) {
    styleTag = document.createElement("style");
    styleTag.id = "siren-tts-beautify-style";
    document.head.appendChild(styleTag);
  }
  if (customCss) {
    styleTag.textContent = compileSirenCss(customCss);
  } else {
    styleTag.textContent = "";
  }
}
async function renderTtsHistory() {
  const context = SillyTavern.getContext();
  const currentChatId = context.chatId;
  const listContainer = $("#siren-tts-history-list");
  if (!currentChatId) {
    listContainer.html(
      `<div style="text-align:center; color:#64748b; margin-top: 20px;">\u672A\u68C0\u6D4B\u5230\u6D3B\u52A8\u5BF9\u8BDD\uFF0C\u8BF7\u5148\u5F00\u542F\u4E00\u4E2A\u804A\u5929\u3002</div>`
    );
    return;
  }
  listContainer.html(
    `<div style="text-align:center; color:#64748b; margin-top: 20px;"><i class="fa-solid fa-spinner fa-spin" style="margin-right: 8px;"></i>\u6B63\u5728\u6253\u635E\u5F53\u524D\u5BF9\u8BDD\u7684\u8BB0\u5FC6...</div>`
  );
  const records = await getTtsHistory(currentChatId, { includeAudio: false });
  listContainer.empty();
  if (records.length === 0) {
    listContainer.html(
      `<div style="text-align:center; color:#64748b; margin-top: 20px;">\u6682\u65E0\u8BED\u97F3\u8BB0\u5F55</div>`
    );
    return;
  }
  records.forEach((record) => {
    const timeStr = new Date(record.timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });
    const floorDisplay = record.floor ? `\u697C\u5C42 ${record.floor}` : "\u81EA\u7531\u6F5C\u6D41";
    const shortText = record.text.length > 80 ? record.text.substring(0, 80) + "..." : record.text;
    const isFav = record.isFavorite;
    const favColor = isFav ? "#f59e0b" : "";
    const favIconClass = isFav ? "fa-solid fa-star" : "fa-regular fa-star";
    const html = `
            <div class="siren-tts-history-item" data-id="${record.id}" style="background: rgba(30, 41, 59, 0.8); border: 1px solid #334155; border-radius: 6px; padding: 10px; display: flex; flex-direction: column; gap: 8px; transition: all 0.2s;">
                <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.9em;">
                    <span style="color: #94a3b8;"><i class="fa-solid fa-hashtag" style="margin-right:3px;"></i>${floorDisplay} | \u{1F464} ${record.char || "System"}</span>
                    <div style="display: flex; gap: 10px; align-items: center;">
                        <span style="background: rgba(6, 182, 212, 0.2); color: #06b6d4; padding: 2px 6px; border-radius: 4px; font-size: 0.8em;">${record.provider}</span>
                        <span style="color: #64748b;">${timeStr}</span>
                    </div>
                </div>
                <div style="color: #e2e8f0; font-size: 1.05em; line-height: 1.4;" title="${record.text}">${shortText}</div>
                <div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 4px;">
                    <button class="siren-ext-btn siren-ext-btn-secondary siren-tts-btn-fav" data-fav="${isFav ? "1" : "0"}" style="padding: 4px 10px; font-size: 0.9em; color: ${favColor};">
                        <i class="${favIconClass}" style="margin-right: 5px;"></i>\u6536\u85CF
                    </button>
                    <button class="siren-ext-btn siren-ext-btn-secondary siren-tts-btn-replay" style="padding: 4px 10px; font-size: 0.9em;"><i class="fa-solid fa-play" style="margin-right: 5px;"></i>\u91CD\u542C</button>
                    <button class="siren-ext-btn siren-ext-btn-secondary siren-tts-btn-download" style="padding: 4px 10px; font-size: 0.9em;"><i class="fa-solid fa-download" style="margin-right: 5px;"></i>\u4E0B\u8F7D</button>
                    <button class="siren-ext-btn siren-ext-btn-secondary siren-tts-btn-delete" style="padding: 4px 10px; font-size: 0.9em; color: #ef4444; border-color: rgba(239, 68, 68, 0.3); background: rgba(239, 68, 68, 0.1);">
                        <i class="fa-solid fa-trash" style="margin-right: 5px;"></i>\u5220\u9664
                    </button>
                </div>
            </div>
        `;
    const $el = $(html);
    $el.find(".siren-tts-btn-fav").on("click", async function() {
      const isFavNow = $(this).attr("data-fav") === "1";
      const newFavState = !isFavNow;
      await toggleFavoriteTtsRecord(record.id, newFavState);
      $(this).attr("data-fav", newFavState ? "1" : "0");
      $(this).css("color", newFavState ? "#f59e0b" : "");
      const $icon = $(this).find("i");
      if (newFavState) {
        $icon.removeClass("fa-regular").addClass("fa-solid");
        if (window.toastr) window.toastr.success("\u5DF2\u6536\u85CF\uFF0C\u6E05\u7406\u65F6\u5C06\u88AB\u4FDD\u7559\uFF01");
      } else {
        $icon.removeClass("fa-solid").addClass("fa-regular");
        if (window.toastr) window.toastr.info("\u5DF2\u53D6\u6D88\u6536\u85CF");
      }
    });
    $el.find(".siren-tts-btn-delete").on("click", async function() {
      $el.css({ transform: "scale(0.95)", opacity: 0 });
      setTimeout(async () => {
        $el.slideUp(200, function() {
          $(this).remove();
        });
        await deleteTtsRecord(record.id);
      }, 150);
    });
    $el.find(".siren-tts-btn-replay").on("click", async function() {
      const $icon = $(this).find("i");
      $icon.removeClass("fa-play").addClass("fa-spinner fa-spin");
      setTimeout(
        () => $icon.removeClass("fa-spinner fa-spin").addClass("fa-play"),
        1e3
      );
      const stored = await getTtsRecord(record.id);
      if (stored?.audioBlob) enqueueTTSBlob(stored.audioBlob);
      else window.toastr?.warning("\u8FD9\u6761\u8BED\u97F3\u5DF2\u88AB\u6E05\u7406\uFF0C\u8BF7\u91CD\u65B0\u751F\u6210\u3002");
    });
    $el.find(".siren-tts-btn-download").on("click", async function() {
      const stored = await getTtsRecord(record.id);
      if (!stored?.audioBlob) return window.toastr?.warning("\u8FD9\u6761\u8BED\u97F3\u5DF2\u88AB\u6E05\u7406\u3002");
      const blobUrl = URL.createObjectURL(stored.audioBlob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `Siren_${record.provider}_${record.char}_Floor${record.floor}_${record.timestamp}.wav`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    });
    listContainer.append($el);
  });
}

// scripts/ambience.js
init_settings();
init_utils();
var localAmbienceState = {
  fade_duration: 2,
  karaoke_speed: 1,
  current_list: "default",
  libraries: { default: [] },
  karaoke_style: { current: "default", dict: {} },
  card_style: { current: "default", dict: {} }
};
function initAmbienceSettings() {
  const container = document.getElementById("tab-ambience");
  if (!container) return;
  const globalSettings = getSirenSettings();
  localAmbienceState = JSON.parse(
    JSON.stringify(globalSettings.ambience || {})
  );
  if (typeof localAmbienceState.enabled === "undefined")
    localAmbienceState.enabled = true;
  if (!localAmbienceState.current_list)
    localAmbienceState.current_list = "default";
  if (!localAmbienceState.libraries)
    localAmbienceState.libraries = { default: [] };
  if (typeof localAmbienceState.auto_play === "undefined")
    localAmbienceState.auto_play = true;
  if (typeof localAmbienceState.custom_end_tags === "undefined")
    localAmbienceState.custom_end_tags = "";
  if (localAmbienceState.karaoke_speed === void 0)
    localAmbienceState.karaoke_speed = 1;
  if (!localAmbienceState.karaoke_style)
    localAmbienceState.karaoke_style = { current: "default", dict: {} };
  if (!localAmbienceState.card_style)
    localAmbienceState.card_style = { current: "default", dict: {} };
  if (!localAmbienceState.sfx_card_style)
    localAmbienceState.sfx_card_style = { current: "default", dict: {} };
  if (!localAmbienceState.sfx_libraries) {
    localAmbienceState.sfx_current_list = "default";
    localAmbienceState.sfx_libraries = { default: [] };
  }
  container.innerHTML = `
        <style>
            #siren-ambience-fade-input::-webkit-outer-spin-button,
            #siren-ambience-fade-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
            #siren-ambience-fade-input { -moz-appearance: textfield; }
            .siren-style-textarea { width: 100%; height: 80px; background: #0f172a; color: #38bdf8; border: 1px solid #334155; border-radius: 4px; padding: 8px; font-family: monospace; font-size: 12px; outline: none; resize: vertical; }
            .siren-style-textarea:focus { border-color: #3b82f6; }
            .siren-icon-btn { background: transparent; color: #e2e8f0; border: 1px solid #475569; border-radius: 4px; width: 30px; height: 30px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; }
            .siren-icon-btn:hover { background: #334155; }
            .siren-section-title { color: #e2e8f0; font-size: 1.05em; font-weight: bold; margin: 24px 0 12px 0; padding-bottom: 8px; border-bottom: 1px solid #334155; display: flex; align-items: center; gap: 8px; letter-spacing: 0.5px; }
            
            /* \u{1F31F} \u65B0\u589E\uFF1A\u6ED1\u5757\u5F00\u5173\u6837\u5F0F */
            .siren-toggle-switch { position: relative; display: inline-block; width: 44px; height: 22px; flex-shrink: 0; }
            .siren-toggle-switch input { opacity: 0; width: 0; height: 0; }
            .siren-toggle-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #475569; transition: .3s; border-radius: 22px; }
            .siren-toggle-slider:before { position: absolute; content: ""; height: 16px; width: 16px; left: 3px; bottom: 3px; background-color: white; transition: .3s; border-radius: 50%; }
            .siren-toggle-switch input:checked + .siren-toggle-slider { background-color: #10b981; }
            .siren-toggle-switch input:checked + .siren-toggle-slider:before { transform: translateX(22px); }
            /* =========================================================
               \u9632\u5FA1\u6027\u9694\u79BB\u8865\u4E01 (\u76F4\u63A5\u5728 tab \u5185\u63D0\u6743\uFF0C\u5E72\u6389\u5168\u5C40\u7F8E\u5316)
               ========================================================= */
            
            /* 1. \u4FEE\u590D\u6240\u6709 input\u3001select\u3001textarea \u88AB\u6C61\u67D3\u7684\u95EE\u9898 */
            .siren-ext-settings-container input:not([type="checkbox"]):not([type="file"]):not([type="range"]),
            .siren-ext-settings-container select,
            .siren-ext-settings-container textarea {
                background-image: none !important; /* \u53BB\u9664\u5168\u5C40\u5F3A\u52A0\u7684\u7EBF\u6027\u6E10\u53D8/\u80CC\u666F\u56FE */
                box-shadow: none !important;       /* \u53BB\u9664\u679C\u51BB\u9634\u5F71 */
                transform: none !important;        /* \u53BB\u9664\u4F4D\u79FB\u6F02\u79FB */
                appearance: none !important;
                -webkit-appearance: none !important;
            }

            /* \u9488\u5BF9 Select \u6D88\u9664\u679C\u51BB\u52A8\u753B\u3001\u7BE1\u6539\u80CC\u666F\u548C\u5938\u5F20 padding */
            .siren-ext-settings-container select {
                padding: 4px 8px !important;
            }
            .siren-ext-settings-container select:hover,
            .siren-ext-settings-container select:focus {
                transform: none !important;
                animation: none !important;
                box-shadow: 0 0 8px rgba(6, 182, 212, 0.3) !important;
                background-color: #1e293b !important;
            }
            .siren-ext-settings-container select option {
                background: #0f172a !important;
                color: #e2e8f0 !important;
            }

            /* \u6D88\u9664\u6587\u672C\u6846\u805A\u7126\u65F6\u7684\u4E0A\u6D6E\u548C\u5947\u602A\u63CF\u8FB9 */
            .siren-ext-settings-container input:focus,
            .siren-ext-settings-container textarea:focus {
                transform: none !important;
                box-shadow: 0 0 8px rgba(6, 182, 212, 0.3) !important;
                border-color: #38bdf8 !important;
            }

            /* 2. \u4FEE\u590D\u9884\u89C8\u9762\u677F (siren-ext-chat-msg-mock) \u5F02\u5E38\u62C9\u9AD8\u7684\u95EE\u9898 */
            /* \u5F3A\u5236\u62B9\u9664\u5168\u5C40\u7F8E\u5316\u5BF9 .mes_text \u5F3A\u52A0\u7684 9.2rem \u4E0A\u4E0B\u8FB9\u8DDD\uFF01 */
            .siren-ext-chat-msg-mock .mes_text {
                padding: 0 !important;
                margin: 0 !important;
                max-width: 100% !important;
                line-height: 1.6 !important;
                box-shadow: none !important;
            }
            
            /* \u6E05\u9664\u53EF\u80FD\u6302\u8F7D\u5728 .mes_text \u4E0A\u7684\u4F2A\u7C7B\u6C14\u6CE1\u88C5\u9970\u56FE\u7247 (\u5982\u98D8\u6563\u7684\u6A31\u82B1/\u5E95\u7EB9\u7B49) */
            .siren-ext-chat-msg-mock .mes_text::before,
            .siren-ext-chat-msg-mock .mes_text::after {
                display: none !important;
                background-image: none !important;
            }
            /* 3. \u4F18\u5316\u7279\u5B9A\u8F93\u5165\u6846\u7684\u5C3A\u5BF8\u4E0E\u5B57\u4F53\u9605\u8BFB\u4F53\u9A8C */
            #siren-b-icon-input,
            #siren-s-icon-input,
            .siren-ext-settings-container .siren-ambience-input-name,
            .siren-ext-settings-container .siren-ambience-input-url,
            .siren-ext-settings-container .siren-sfx-input-name,
            .siren-ext-settings-container .siren-sfx-input-url {
                height: 34px !important;         /* \u589E\u52A0\u56FA\u5B9A\u9AD8\u5EA6\uFF0C\u6491\u8D77\u8F93\u5165\u6846 */
                font-size: 14px !important;      /* \u589E\u5927\u5B57\u4F53\uFF0C\u9605\u8BFB\u66F4\u6E05\u6670 */
                padding: 4px 12px !important;    /* \u589E\u52A0\u5DE6\u53F3\u5185\u8FB9\u8DDD\uFF0C\u8BA9\u6587\u5B57\u4E0D\u8981\u592A\u8D34\u8FB9 */
                line-height: 1.5 !important;     /* \u4F18\u5316\u5149\u6807\u548C\u6587\u5B57\u7684\u5782\u76F4\u5C45\u4E2D */
                box-sizing: border-box !important;
            }
        </style>
        
        <div class="siren-ext-settings-container">
            <h3 style="display: flex; align-items: center; justify-content: space-between;">
                <span><i class="fa-solid fa-wand-magic-sparkles fa-fw" style="color:#3b82f6; margin-right:8px;"></i>\u5E7B\u5883\u6C1B\u56F4</span>
                <i id="siren-ambience-save-btn" class="fa-solid fa-floppy-disk interactable" style="color: #10b981; font-size: 1.2em; transition: transform 0.2s; cursor: pointer;" title="\u4FDD\u5B58\u5168\u5C40\u914D\u7F6E"></i>
            </h3>
            
            <div style="background: rgba(15, 23, 42, 0.6); padding: 12px; border-radius: 8px; border: 1px solid #334155; margin-bottom: 15px;">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                    <span style="font-weight: bold; color: #38bdf8; display: flex; align-items: center; gap: 8px;">
                        <i class="fa-solid fa-power-off"></i> \u5E7B\u5883\u542F\u52A8
                    </span>
                    <label class="siren-toggle-switch">
                        <input type="checkbox" id="siren-ambience-enable-toggle">
                        <span class="siren-toggle-slider"></span>
                    </label>
                </div>
            </div>

            <div id="siren-ambience-settings-body" style="${localAmbienceState.enabled ? "" : "display: none;"}">

                <div style="background: rgba(15, 23, 42, 0.6); padding: 12px; border-radius: 8px; border: 1px solid #334155; margin-bottom: 15px;">
                    <div style="font-weight: bold; color: #3b82f6; margin-bottom: 12px; display: flex; align-items: center; gap: 6px;">
                        <i class="fa-solid fa-play"></i> \u573A\u63A7\u64AD\u62A5\u7B56\u7565
                    </div>
                    
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
                        <span style="color: #e2e8f0; font-size: 14px;">\u5168\u5C40\u81EA\u52A8\u64AD\u653E (Auto Play)</span>
                        <label class="siren-toggle-switch">
                            <input type="checkbox" id="siren-ambience-auto-play">
                            <span class="siren-toggle-slider"></span>
                        </label>
                    </div>

                    <div id="siren-ambience-custom-end-tags-wrapper" style="display: ${localAmbienceState.auto_play ? "flex" : "none"}; align-items: center; justify-content: space-between; margin-bottom: 12px; background: rgba(0,0,0,0.2); padding: 8px; border-radius: 4px;">
                        <div style="display: flex; flex-direction: column;">
                            <span style="color: #e2e8f0; font-size: 14px;">\u81EA\u5B9A\u4E49\u89E6\u53D1\u6807\u7B7E</span>
                            <span style="color: #64748b; font-size: 12px;">\u8986\u76D6\u9ED8\u8BA4\u6807\u70B9\uFF0C\u591A\u4E2A\u7528\u9017\u53F7\u9694\u5F00</span>
                        </div>
                        <input type="text" id="siren-ambience-custom-end-tags" placeholder="\u9ED8\u8BA4\u4F7F\u7528\u6807\u70B9" 
                               style="width: 130px; height: 28px; box-sizing: border-box; background: #1e293b; color: white; border: 1px solid #475569; border-radius: 4px; padding: 0 8px; font-size: 13px; text-align: center; outline: none;">
                    </div>
                </div>
                
                <div style="background: rgba(15, 23, 42, 0.6); padding: 12px; border-radius: 8px; border: 1px solid #334155; margin-bottom: 15px;">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
                        <span style="font-weight: bold; color: #e2e8f0;">\u5E73\u6ED1\u8FC7\u6E21</span>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <input type="number" id="siren-ambience-fade-input" step="0.5" min="0" style="width: 50px; height: 28px; box-sizing: border-box; background: #1e293b; color: white; border: 1px solid #475569; border-radius: 4px; padding: 0 4px; font-size: 14px; text-align: center; outline: none;">
                            <span style="color: #94a3b8; font-size: 14px;">\u79D2</span>
                        </div>
                    </div>
                    
    
                    <div style="display: flex; flex-direction: column; gap: 10px; padding-top: 12px;">
                        <div style="display: flex; align-items: center; justify-content: space-between;">
                            <span style="font-weight: bold; color: #e2e8f0;">\u8D77\u59CB\u6807\u7B7E</span>
                            <input type="text" id="siren-ambience-start-tag-input" placeholder="<content>" 
                                   style="width: 200px; height: 28px; box-sizing: border-box; background: #1e293b; color: white; border: 1px solid #475569; border-radius: 4px; padding: 0 8px; font-family: monospace; font-size: 14px; text-align: center; outline: none;">
                        </div>
                        <div style="display: flex; align-items: center; justify-content: space-between;">
                            <span style="font-weight: bold; color: #e2e8f0;">\u7EC8\u6B62\u6807\u7B7E</span>
                            <input type="text" id="siren-ambience-end-tag-input" placeholder="</content>" 
                                   style="width: 200px; height: 28px; box-sizing: border-box; background: #1e293b; color: white; border: 1px solid #475569; border-radius: 4px; padding: 0 8px; font-family: monospace; font-size: 14px; text-align: center; outline: none;">
                        </div>
                    </div>
                </div> <div class="siren-section-title" style="color: #f472b6;">
                    <i class="fa-solid fa-palette" style="color: #f472b6;"></i> \u5E7B\u5F69\u8D1D\u58F3
                </div>

                <div style="background: rgba(15, 23, 42, 0.6); padding: 12px; border-radius: 8px; border: 1px solid #334155; margin-bottom: 15px;">
                    <div style="font-weight: bold; color: #a855f7; margin-bottom: 12px; display: flex; align-items: center; gap: 6px;">
                        <i class="fa-solid fa-microphone-lines"></i> \u65C1\u767D\u6EDA\u52A8
                    </div>
                
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
                        <span style="color: white; font-size: 14px;">\u6EDA\u52A8\u901F\u5EA6</span>
                        <div style="display: flex; align-items: center; gap: 8px; flex: 1; margin-left: 20px;">
                            <input type="range" id="siren-ambience-karaoke-speed" class="siren-ext-progress-bar" min="0.5" max="5.0" step="0.1" style="flex: 1;">
                            <span id="siren-ambience-karaoke-speed-val" style="color: white; font-size: 14px; width: 35px; text-align: right;"></span>
                        </div>
                    </div>

                    <div style="display: flex; gap: 8px; margin-bottom: 8px; align-items: center;">
                        <span style="color: white; font-size: 14px;">\u6837\u5F0F:</span>
                        <select id="siren-k-style-sel" style="flex: 1; background: #1e293b; color: white; border: 1px solid #475569; border-radius: 4px; padding: 4px; outline: none;"></select>
                        <button class="siren-icon-btn" id="siren-k-btn-new" title="\u65B0\u589E"><i class="fa-solid fa-plus"></i></button>
                        <button class="siren-icon-btn" id="siren-k-btn-del" title="\u5220\u9664"><i class="fa-solid fa-trash"></i></button>
                        <button class="siren-icon-btn" id="siren-k-btn-export" title="\u5BFC\u51FA"><i class="fa-solid fa-file-export"></i></button>
                        <button class="siren-icon-btn" id="siren-k-btn-import" title="\u5BFC\u5165"><i class="fa-solid fa-file-import"></i></button>
                        <input type="file" id="siren-k-file-import" accept=".json" style="display: none;">
                    </div>
                    <textarea id="siren-k-css-input" class="siren-style-textarea" spellcheck="false"></textarea>
                </div>

                <div style="background: rgba(15, 23, 42, 0.6); padding: 12px; border-radius: 8px; border: 1px solid #334155; margin-bottom: 15px;">
                    <div style="font-weight: bold; color: #0ed0e9; margin-bottom: 12px; display: flex; align-items: center; gap: 6px;">
                        <i class="fa-solid fa-palette"></i> \u80CC\u666F\u97F3\u7F8E\u5316
                    </div>
                    <div style="display: flex; gap: 8px; margin-bottom: 8px; align-items: center;">
                        <span style="color: white; font-size: 14px;">\u6837\u5F0F:</span>
                        <select id="siren-b-style-sel" style="flex: 1; background: #1e293b; color: white; border: 1px solid #475569; border-radius: 4px; padding: 4px; outline: none;"></select>
                        <button class="siren-icon-btn" id="siren-b-btn-new" title="\u65B0\u589E"><i class="fa-solid fa-plus"></i></button>
                        <button class="siren-icon-btn" id="siren-b-btn-del" title="\u5220\u9664"><i class="fa-solid fa-trash"></i></button>
                        <button class="siren-icon-btn" id="siren-b-btn-export" title="\u5BFC\u51FA"><i class="fa-solid fa-file-export"></i></button>
                        <button class="siren-icon-btn" id="siren-b-btn-import" title="\u5BFC\u5165"><i class="fa-solid fa-file-import"></i></button>
                        <input type="file" id="siren-b-file-import" accept=".json" style="display: none;">
                    </div>
                    <div style="display: flex; gap: 8px; margin-bottom: 8px; align-items: center;">
                        <span style="color: white; font-size: 14px;">\u56FE\u6807:</span>
                        <input type="text" id="siren-b-icon-input" placeholder="fa-solid fa-music" style="flex: 1; background: #1e293b; color: white; border: 1px solid #475569; border-radius: 4px; padding: 4px 8px; outline: none; font-family: monospace;">
                    </div>
                    <textarea id="siren-b-css-input" class="siren-style-textarea" spellcheck="false"></textarea>
                </div>

                <div style="background: rgba(15, 23, 42, 0.6); padding: 12px; border-radius: 8px; border: 1px solid #334155; margin-bottom: 15px;">
                    <div style="font-weight: bold; color: #fbbf24; margin-bottom: 12px; display: flex; align-items: center; gap: 6px;">
                        <i class="fa-solid fa-bolt"></i> \u6548\u679C\u97F3\u7F8E\u5316
                    </div>
                    <div style="display: flex; gap: 8px; margin-bottom: 8px; align-items: center;">
                        <span style="color: white; font-size: 14px;">\u6837\u5F0F:</span>
                        <select id="siren-s-style-sel" style="flex: 1; background: #1e293b; color: white; border: 1px solid #475569; border-radius: 4px; padding: 4px; outline: none;"></select>
                        <button class="siren-icon-btn" id="siren-s-btn-new" title="\u65B0\u589E"><i class="fa-solid fa-plus"></i></button>
                        <button class="siren-icon-btn" id="siren-s-btn-del" title="\u5220\u9664"><i class="fa-solid fa-trash"></i></button>
                        <button class="siren-icon-btn" id="siren-s-btn-export" title="\u5BFC\u51FA"><i class="fa-solid fa-file-export"></i></button>
                        <button class="siren-icon-btn" id="siren-s-btn-import" title="\u5BFC\u5165"><i class="fa-solid fa-file-import"></i></button>
                        <input type="file" id="siren-s-file-import" accept=".json" style="display: none;">
                    </div>
                    <div style="display: flex; gap: 8px; margin-bottom: 8px; align-items: center;">
                        <span style="color: white; font-size: 14px;">\u56FE\u6807:</span>
                        <input type="text" id="siren-s-icon-input" placeholder="fa-solid fa-bolt" style="flex: 1; background: #1e293b; color: white; border: 1px solid #475569; border-radius: 4px; padding: 4px 8px; outline: none; font-family: monospace;">
                    </div>
                    <textarea id="siren-s-css-input" class="siren-style-textarea" spellcheck="false"></textarea>
                </div>

                <div class="siren-ext-style-preview-box" style="margin-top: 5px; margin-bottom: 15px; background: rgba(15, 23, 42, 0.6); border: 1px solid #1e293b; border-radius: 8px; padding: 15px; box-shadow: inset 0 0 10px rgba(0,0,0,0.5);">
                    <div style="color: #94a3b8; font-size: 0.8em; margin-bottom: 12px; display:flex; justify-content:space-between;">
                        <span><i class="fa-solid fa-eye"></i> \u573A\u666F\u5B9E\u673A\u53CC\u6A21\u9884\u89C8</span>
                        <span id="siren-ambience-preview-status" style="color:#10b981;">\u5DF2\u5C31\u7EEA</span>
                    </div>
                
                    <div class="siren-ext-chat-msg-mock" style="display: flex; gap: 12px; background: #0f172a; padding: 12px; border-radius: 8px; border: 1px solid #334155;">
                        <div style="width: 32px; height: 32px; border-radius: 50%; background: #1e293b; display: flex; align-items: center; justify-content: center; font-size: 1.2em; border: 1px solid #3b82f6; box-shadow: 0 0 8px rgba(59, 130, 246, 0.4); flex-shrink: 0;">\u{1F30A}</div>
                        <div style="flex: 1; min-width: 0;">
                            <div style="font-size: 0.85em; color: #94a3b8; margin-bottom: 4px;">Siren Scene</div>
                            <div class="mes_text siren-scene-active" style="color: #cbd5e1; font-size: 0.9em; line-height: 1.6;">
                                <span class="siren-karaoke-done">\u8FD9\u662F\u4E00\u6BB5\u6765\u81EA\u6DF1\u6D77\u7684\u5F55\u97F3\u5E26\u3002</span>
                                <br>
                                <span class="siren-karaoke-playing" style="--k-prog: 45%;">\u53EF\u4EE5\u5DE5\u4F5C\u4E86\u5417\uFF1F\u7EE7\u7EED\u6D4B\u8BD5...</span>
                                <br>
                                <span class="siren-karaoke-target">\u6536\u5230\u6765\u81EA\u6DF1\u6D77\u7684\u547C\u5524\u3002</span>
                            
                                <div style="margin-top: 12px; display: flex; flex-direction: column; gap: 8px; align-items: flex-start;">
                                    <div class="siren-ambience-card" data-siren-ambience="1" tabindex="0">
                                        <span class="siren-btn-wrap" data-siren-action="play_ambience" title="\u64AD\u653E\u80CC\u666F\u97F3">
                                            <i class="fa-solid fa-music"></i>
                                        </span>
                                        <span class="siren-ambience-text">\u96E8\u58F0</span>
                                    </div>
                                    <div class="siren-sfx-card" data-siren-sfx="1" tabindex="0">
                                        <span class="siren-btn-wrap" data-siren-action="play_sfx" title="\u64AD\u653E\u6548\u679C\u97F3">
                                            <i class="fa-solid fa-bolt"></i>
                                        </span>
                                        <span class="siren-sfx-text">\u96F7\u9E23</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="siren-section-title" style="margin-top: 24px;">
                    <i class="fa-solid fa-compact-disc" style="color: #06b6d4;"></i> \u6DF1\u6D77\u97F3\u8F68\u5323
                </div>

                <div style="background: rgba(15, 23, 42, 0.6); padding: 12px; border-radius: 8px; border: 1px solid #334155;">
                    <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 15px;">
                        <div style="display: flex; gap: 12px; align-items: center;">
                            <span style="color: #e2e8f0; font-weight: bold; font-size: 14px; white-space: nowrap;">Ambience \u5E93</span>
                            <select id="siren-ambience-list-select" style="flex: 1; background: #1e293b; color: white; border: 1px solid #475569; border-radius: 4px; padding: 6px; outline: none;"></select>
                        </div>
                        <div style="display: flex; justify-content: space-around; align-items: center; background: rgba(0,0,0,0.2); padding: 5px; border-radius: 4px;">
                            <button class="siren-icon-btn" style="flex: 1; border: none; background: transparent;" id="siren-ambience-btn-import-list" title="\u5BFC\u5165\u80CC\u666F\u5E93"><i class="fa-solid fa-file-import"></i></button>
                            <button class="siren-icon-btn" style="flex: 1; border: none; background: transparent;" id="siren-ambience-btn-export-list" title="\u5BFC\u51FA\u5F53\u524D\u80CC\u666F\u5E93"><i class="fa-solid fa-file-export"></i></button>
                            <button class="siren-icon-btn" style="flex: 1; border: none; background: transparent;" id="siren-ambience-btn-new-list" title="\u65B0\u589E\u80CC\u666F\u5E93"><i class="fa-solid fa-plus"></i></button>
                            <button class="siren-icon-btn" style="flex: 1; border: none; background: transparent; color: #ef4444;" id="siren-ambience-btn-del-list" title="\u5220\u9664\u5F53\u524D\u80CC\u666F\u5E93"><i class="fa-solid fa-trash"></i></button>
                            <input type="file" id="siren-ambience-file-import-list" accept=".json" style="display: none;">
                        </div>
                    </div>

                    <div id="siren-ambience-items-container" style="display: flex; flex-direction: column; gap: 8px; max-height: 250px; overflow-y: auto; padding-right: 4px; margin-bottom: 12px;"></div>

                    <button id="siren-ambience-btn-add-row" style="width: 100%; padding: 8px; background: rgba(59, 130, 246, 0.1); border: 1px dashed #3b82f6; color: #3b82f6; border-radius: 4px; cursor: pointer; transition: all 0.2s;">
                        <i class="fa-solid fa-plus"></i> \u65B0\u589E Ambience
                    </button>
                </div>
                
                <div class="siren-section-title" style="margin-top: 24px;">
                    <i class="fa-solid fa-volume-high" style="color: #fbbf24;"></i> \u6D45\u6C34\u56DE\u58F0
                </div>

                <div style="background: rgba(15, 23, 42, 0.6); padding: 12px; border-radius: 8px; border: 1px solid #334155;">
                    <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 15px;">
                        <div style="display: flex; gap: 12px; align-items: center;">
                            <span style="color: #e2e8f0; font-weight: bold; font-size: 14px; white-space: nowrap;">SFX \u5E93</span>
                            <select id="siren-sfx-list-select" style="flex: 1; background: #1e293b; color: white; border: 1px solid #475569; border-radius: 4px; padding: 6px; outline: none;"></select>
                        </div>
                        <div style="display: flex; justify-content: space-around; align-items: center; background: rgba(0,0,0,0.2); padding: 5px; border-radius: 4px;">
                            <button class="siren-icon-btn" style="flex: 1; border: none; background: transparent;" id="siren-sfx-btn-import-list" title="\u5BFC\u5165\u6548\u679C\u97F3\u5E93"><i class="fa-solid fa-file-import"></i></button>
                            <button class="siren-icon-btn" style="flex: 1; border: none; background: transparent;" id="siren-sfx-btn-export-list" title="\u5BFC\u51FA\u5F53\u524D\u6548\u679C\u97F3\u5E93"><i class="fa-solid fa-file-export"></i></button>
                            <button class="siren-icon-btn" style="flex: 1; border: none; background: transparent;" id="siren-sfx-btn-new-list" title="\u65B0\u589E\u6548\u679C\u97F3\u5E93"><i class="fa-solid fa-plus"></i></button>
                            <button class="siren-icon-btn" style="flex: 1; border: none; background: transparent; color: #ef4444;" id="siren-sfx-btn-del-list" title="\u5220\u9664\u5F53\u524D\u5E93"><i class="fa-solid fa-trash"></i></button>
                            <input type="file" id="siren-sfx-file-import-list" accept=".json" style="display: none;">
                        </div>
                    </div>

                    <div id="siren-sfx-items-container" style="display: flex; flex-direction: column; gap: 8px; max-height: 250px; overflow-y: auto; padding-right: 4px; margin-bottom: 12px;"></div>

                    <button id="siren-sfx-btn-add-row" style="width: 100%; padding: 8px; background: rgba(245, 158, 11, 0.1); border: 1px dashed #fbbf24; color: #fbbf24; border-radius: 4px; cursor: pointer; transition: all 0.2s;">
                        <i class="fa-solid fa-plus"></i> \u65B0\u589E SFX
                    </button>
                </div>

                <button id="siren-ambience-save-btn-bottom" style="width: 100%; margin-top: 24px; padding: 12px; background: rgba(16, 185, 129, 0.1); border: 1px solid #10b981; color: #10b981; font-weight: bold; font-size: 16px; border-radius: 8px; cursor: pointer; transition: all 0.2s; display: flex; justify-content: center; align-items: center; gap: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                    <i class="fa-solid fa-floppy-disk"></i> \u4FDD\u5B58\u5168\u5C40\u914D\u7F6E
                </button>
                
            </div> </div> `;
  bindAmbienceEvents();
  renderAmbienceAll();
}
function updateProgressBar(inputEl) {
  const min = parseFloat(inputEl.min) || 0;
  const max = parseFloat(inputEl.max) || 100;
  const val = parseFloat(inputEl.value) || 0;
  const percentage = (val - min) / (max - min) * 100;
  inputEl.style.setProperty("--progress", `${percentage}%`);
}
function renderStyleModule(stateObj, prefix) {
  const sel = document.getElementById(`siren-${prefix}-style-sel`);
  const txt = document.getElementById(`siren-${prefix}-css-input`);
  sel.innerHTML = "";
  Object.entries(stateObj.dict).forEach(([key, val]) => {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = val.name;
    if (key === stateObj.current) option.selected = true;
    sel.appendChild(option);
  });
  const currentCode = stateObj.dict[stateObj.current]?.code || "";
  txt.value = currentCode;
  const iconInput = document.getElementById(`siren-${prefix}-icon-input`);
  if (iconInput) {
    const defaultIcon = prefix === "b" ? "fa-solid fa-music" : "fa-solid fa-bolt";
    iconInput.value = stateObj.dict[stateObj.current]?.icon || defaultIcon;
  }
  updateAmbiencePreview();
}
function renderAmbienceAll() {
  document.getElementById("siren-ambience-enable-toggle").checked = localAmbienceState.enabled;
  document.getElementById("siren-ambience-auto-play").checked = localAmbienceState.auto_play;
  document.getElementById("siren-ambience-custom-end-tags").value = localAmbienceState.custom_end_tags || "";
  document.getElementById(
    "siren-ambience-custom-end-tags-wrapper"
  ).style.display = localAmbienceState.auto_play ? "flex" : "none";
  document.getElementById("siren-ambience-fade-input").value = localAmbienceState.fade_duration;
  document.getElementById("siren-ambience-start-tag-input").value = localAmbienceState.start_tag || "<content>";
  document.getElementById("siren-ambience-end-tag-input").value = localAmbienceState.end_tag || "</content>";
  const speedInput = document.getElementById("siren-ambience-karaoke-speed");
  speedInput.value = localAmbienceState.karaoke_speed || 1;
  document.getElementById("siren-ambience-karaoke-speed-val").textContent = Number(localAmbienceState.karaoke_speed).toFixed(1) + "x";
  updateProgressBar(speedInput);
  renderStyleModule(localAmbienceState.karaoke_style, "k");
  renderStyleModule(localAmbienceState.card_style, "b");
  renderStyleModule(localAmbienceState.sfx_card_style, "s");
  const select = document.getElementById("siren-ambience-list-select");
  select.innerHTML = "";
  Object.keys(localAmbienceState.libraries).forEach((listName) => {
    const option = document.createElement("option");
    option.value = listName;
    option.textContent = listName;
    if (listName === localAmbienceState.current_list) option.selected = true;
    select.appendChild(option);
  });
  renderAmbienceRows();
  const sfxSelect = document.getElementById("siren-sfx-list-select");
  if (sfxSelect) {
    sfxSelect.innerHTML = "";
    Object.keys(localAmbienceState.sfx_libraries).forEach((listName) => {
      const option = document.createElement("option");
      option.value = listName;
      option.textContent = listName;
      if (listName === localAmbienceState.sfx_current_list)
        option.selected = true;
      sfxSelect.appendChild(option);
    });
    renderSfxRows();
  }
}
function renderAmbienceRows() {
  const container = document.getElementById("siren-ambience-items-container");
  container.innerHTML = "";
  const currentLib = localAmbienceState.libraries[localAmbienceState.current_list] || [];
  currentLib.forEach((item, index) => {
    const row = document.createElement("div");
    row.style.cssText = "display: flex; flex-direction: column; gap: 6px; padding: 10px; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.05); border-radius: 6px; margin-bottom: 4px;";
    row.innerHTML = `
        <div style="display: flex; gap: 8px; align-items: center;">
            <input type="text" class="siren-ambience-input-name" data-idx="${index}" placeholder="\u97F3\u9891\u540D" value="${item.name}" style="flex: 1; background: #0f172a; color: white; border: 1px solid #334155; border-radius: 4px; padding: 6px; outline: none;">
            <button class="siren-ambience-btn-del-row" data-idx="${index}" title="\u5220\u9664" style="background: transparent; border: none; color: #ef4444; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; cursor: pointer;"><i class="fa-solid fa-trash"></i></button>
        </div>
        <input type="text" class="siren-ambience-input-url" data-idx="${index}" placeholder="\u94FE\u63A5 URL" value="${item.url}" style="width: 100%; box-sizing: border-box; background: #0f172a; color: white; border: 1px solid #334155; border-radius: 4px; padding: 6px; outline: none;">
    `;
    container.appendChild(row);
  });
}
function renderSfxRows() {
  const container = document.getElementById("siren-sfx-items-container");
  if (!container) return;
  container.innerHTML = "";
  const currentLib = localAmbienceState.sfx_libraries[localAmbienceState.sfx_current_list] || [];
  currentLib.forEach((item, index) => {
    const row = document.createElement("div");
    row.style.cssText = "display: flex; flex-direction: column; gap: 6px; padding: 10px; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.05); border-radius: 6px; margin-bottom: 4px;";
    row.innerHTML = `
        <div style="display: flex; gap: 8px; align-items: center;">
            <input type="text" class="siren-sfx-input-name" data-idx="${index}" placeholder="\u97F3\u9891\u540D" value="${item.name}" style="flex: 1; background: #0f172a; color: white; border: 1px solid #334155; border-radius: 4px; padding: 6px; outline: none;">
            <button class="siren-sfx-btn-del-row" data-idx="${index}" title="\u5220\u9664" style="background: transparent; border: none; color: #ef4444; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; cursor: pointer;"><i class="fa-solid fa-trash"></i></button>
        </div>
        <input type="text" class="siren-sfx-input-url" data-idx="${index}" placeholder="\u94FE\u63A5 URL" value="${item.url}" style="width: 100%; box-sizing: border-box; background: #0f172a; color: white; border: 1px solid #334155; border-radius: 4px; padding: 6px; outline: none;">
    `;
    container.appendChild(row);
  });
}
function compileSirenCss2(rawCss) {
  if (!rawCss) return "";
  let safeCss = rawCss.replace(
    /\.siren-scene-active\s+\.mes_text/gi,
    ".siren-scene-active .siren-karaoke-target"
  );
  return safeCss.replace(
    /\.siren-([a-zA-Z0-9_-]+)/g,
    ":is(.siren-$1, .custom-siren-$1)"
  );
}
function updateAmbiencePreview() {
  const kCss = localAmbienceState.karaoke_style.dict[localAmbienceState.karaoke_style.current]?.code || "";
  const bCss = localAmbienceState.card_style.dict[localAmbienceState.card_style.current]?.code || "";
  const sCss = localAmbienceState.sfx_card_style.dict[localAmbienceState.sfx_card_style.current]?.code || "";
  const bIcon = localAmbienceState.card_style.dict[localAmbienceState.card_style.current]?.icon || "fa-solid fa-music";
  const sIcon = localAmbienceState.sfx_card_style.dict[localAmbienceState.sfx_card_style.current]?.icon || "fa-solid fa-bolt";
  const mockAmbienceIcon = document.querySelector(
    ".siren-ext-chat-msg-mock .siren-ambience-card i"
  );
  const mockSfxIcon = document.querySelector(
    ".siren-ext-chat-msg-mock .siren-sfx-card i"
  );
  if (mockAmbienceIcon) mockAmbienceIcon.className = bIcon;
  if (mockSfxIcon) mockSfxIcon.className = sIcon;
  let styleTag = document.getElementById("siren-ambience-preview-style");
  if (styleTag) {
    styleTag.remove();
  }
  styleTag = document.createElement("style");
  styleTag.id = "siren-ambience-preview-style";
  document.head.appendChild(styleTag);
  styleTag.textContent = compileSirenCss2(kCss) + "\n" + compileSirenCss2(bCss) + "\n" + compileSirenCss2(sCss);
  const status = document.getElementById("siren-ambience-preview-status");
  if (status) {
    status.textContent = "\u6B63\u5728\u9884\u89C8...";
    status.style.color = "#0ea5e9";
    clearTimeout(window.sirenAmbiencePreviewTimer);
    window.sirenAmbiencePreviewTimer = setTimeout(() => {
      status.textContent = "\u672A\u4FDD\u5B58";
      status.style.color = "#f59e0b";
    }, 800);
  }
}
function bindStyleEvents(stateObj, prefix) {
  document.getElementById(`siren-${prefix}-style-sel`).addEventListener("change", (e) => {
    stateObj.current = e.target.value;
    renderStyleModule(stateObj, prefix);
  });
  document.getElementById(`siren-${prefix}-css-input`).addEventListener("input", (e) => {
    if (stateObj.dict[stateObj.current]) {
      stateObj.dict[stateObj.current].code = e.target.value;
    }
    updateAmbiencePreview();
  });
  const iconInput = document.getElementById(`siren-${prefix}-icon-input`);
  if (iconInput) {
    let iconDebounceTimer = null;
    iconInput.addEventListener("input", (e) => {
      if (stateObj.dict[stateObj.current]) {
        stateObj.dict[stateObj.current].icon = e.target.value.trim();
      }
      if (iconDebounceTimer) clearTimeout(iconDebounceTimer);
      iconDebounceTimer = setTimeout(() => {
        updateAmbiencePreview();
      }, 500);
    });
  }
  document.getElementById(`siren-${prefix}-btn-new`).addEventListener("click", () => {
    const name = prompt("\u8BF7\u8F93\u5165\u65B0\u6837\u5F0F\u540D\u79F0\uFF1A");
    if (!name) return;
    const key = "custom_" + Date.now();
    stateObj.dict[key] = { name, code: "" };
    stateObj.current = key;
    renderStyleModule(stateObj, prefix);
  });
  document.getElementById(`siren-${prefix}-btn-del`).addEventListener("click", () => {
    if (stateObj.current === "default") {
      if (window.toastr) window.toastr.warning("\u9ED8\u8BA4\u6837\u5F0F\u4E0D\u53EF\u5220\u9664\uFF01");
      return;
    }
    if (confirm("\u786E\u5B9A\u5220\u9664\u5F53\u524D\u6837\u5F0F\u5417\uFF1F")) {
      delete stateObj.dict[stateObj.current];
      stateObj.current = "default";
      renderStyleModule(stateObj, prefix);
    }
  });
  document.getElementById(`siren-${prefix}-btn-export`).addEventListener("click", () => {
    const dataStr = JSON.stringify(stateObj.dict, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `siren_${prefix}_styles.json`;
    a.click();
    URL.revokeObjectURL(url);
  });
  const fileInput = document.getElementById(`siren-${prefix}-file-import`);
  document.getElementById(`siren-${prefix}-btn-import`).addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        Object.assign(stateObj.dict, imported);
        renderStyleModule(stateObj, prefix);
        if (window.toastr) window.toastr.success("\u6837\u5F0F\u5BFC\u5165\u6210\u529F\uFF01");
      } catch (err) {
        if (window.toastr) window.toastr.error("\u5BFC\u5165\u5931\u8D25\uFF1A\u683C\u5F0F\u9519\u8BEF");
      }
      fileInput.value = "";
    };
    reader.readAsText(file);
  });
}
function bindAmbienceEvents() {
  bindStyleEvents(localAmbienceState.karaoke_style, "k");
  bindStyleEvents(localAmbienceState.card_style, "b");
  bindStyleEvents(localAmbienceState.sfx_card_style, "s");
  document.getElementById("siren-ambience-enable-toggle").addEventListener("change", async (e) => {
    const isEnabled = e.target.checked;
    localAmbienceState.enabled = isEnabled;
    const settingsBody = document.getElementById(
      "siren-ambience-settings-body"
    );
    if (settingsBody) {
      settingsBody.style.display = isEnabled ? "block" : "none";
    }
    await syncAmbienceWorldbookEntries(isEnabled);
  });
  const performSave = async (btnEl) => {
    btnEl.style.transform = "scale(0.98)";
    setTimeout(() => btnEl.style.transform = "scale(1)", 150);
    const globalSettings = getSirenSettings();
    globalSettings.ambience = JSON.parse(JSON.stringify(localAmbienceState));
    saveSirenSettings(false);
    await syncAmbienceWorldbookEntries(localAmbienceState.enabled);
    window.dispatchEvent(new CustomEvent("siren:ambience_settings_updated"));
    const status = document.getElementById("siren-ambience-preview-status");
    if (status) {
      status.textContent = "\u5DF2\u5B58\u76D8\uFF01";
      status.style.color = "#10b981";
    }
  };
  document.getElementById("siren-ambience-save-btn").addEventListener("click", function() {
    performSave(this);
  });
  document.getElementById("siren-ambience-save-btn-bottom").addEventListener("click", function() {
    performSave(this);
  });
  document.getElementById("siren-ambience-auto-play").addEventListener("change", (e) => {
    localAmbienceState.auto_play = e.target.checked;
    const wrapper = document.getElementById(
      "siren-ambience-custom-end-tags-wrapper"
    );
    if (wrapper)
      wrapper.style.display = localAmbienceState.auto_play ? "flex" : "none";
  });
  document.getElementById("siren-ambience-custom-end-tags").addEventListener("input", (e) => {
    localAmbienceState.custom_end_tags = e.target.value;
  });
  document.getElementById("siren-ambience-fade-input").addEventListener("input", (e) => {
    localAmbienceState.fade_duration = parseFloat(e.target.value) || 0;
  });
  document.getElementById("siren-ambience-start-tag-input").addEventListener("input", (e) => {
    localAmbienceState.start_tag = e.target.value.trim();
  });
  document.getElementById("siren-ambience-end-tag-input").addEventListener("input", (e) => {
    localAmbienceState.end_tag = e.target.value.trim();
  });
  const speedInput = document.getElementById("siren-ambience-karaoke-speed");
  speedInput.addEventListener("input", (e) => {
    localAmbienceState.karaoke_speed = parseFloat(e.target.value);
    document.getElementById("siren-ambience-karaoke-speed-val").textContent = localAmbienceState.karaoke_speed.toFixed(1) + "x";
    updateProgressBar(e.target);
  });
  document.getElementById("siren-ambience-list-select").addEventListener("change", (e) => {
    localAmbienceState.current_list = e.target.value;
    renderAmbienceRows();
  });
  document.getElementById("siren-ambience-btn-new-list").addEventListener("click", () => {
    const name = prompt("\u8BF7\u8F93\u5165\u65B0\u5217\u8868\u540D\u79F0\uFF1A");
    if (name && !localAmbienceState.libraries[name]) {
      localAmbienceState.libraries[name] = [];
      localAmbienceState.current_list = name;
      renderAmbienceAll();
    }
  });
  document.getElementById("siren-ambience-btn-export-list").addEventListener("click", () => {
    const currentListName = localAmbienceState.current_list;
    const currentData = localAmbienceState.libraries[currentListName];
    if (!currentData || currentData.length === 0) {
      if (window.toastr) window.toastr.warning("\u5F53\u524D\u5217\u8868\u4E3A\u7A7A\uFF0C\u65E0\u9700\u5BFC\u51FA\uFF01");
      return;
    }
    const dataStr = JSON.stringify(currentData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `siren_ambience_list_${currentListName}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });
  const ambienceListFileInput = document.getElementById(
    "siren-ambience-file-import-list"
  );
  document.getElementById("siren-ambience-btn-import-list").addEventListener("click", () => ambienceListFileInput.click());
  ambienceListFileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target.result);
        if (!Array.isArray(importedData))
          throw new Error("\u6587\u4EF6\u683C\u5F0F\u9519\u8BEF\uFF1A\u975E\u6570\u7EC4\u7ED3\u6784");
        let defaultName = file.name.replace(/\.json$/i, "");
        let newListName = prompt("\u8BF7\u8F93\u5165\u5BFC\u5165\u7684 Ambience \u5E93\u540D\u79F0\uFF1A", defaultName);
        if (!newListName) {
          ambienceListFileInput.value = "";
          return;
        }
        let finalName = newListName;
        let counter = 1;
        while (localAmbienceState.libraries[finalName]) {
          finalName = `${newListName}_${counter}`;
          counter++;
        }
        localAmbienceState.libraries[finalName] = importedData;
        localAmbienceState.current_list = finalName;
        renderAmbienceAll();
        if (window.toastr)
          window.toastr.success(`\u6210\u529F\u5BFC\u5165\u5E76\u521B\u5EFA\u5217\u8868\uFF1A${finalName}`);
      } catch (err) {
        console.error(err);
        if (window.toastr)
          window.toastr.error("Ambience \u5217\u8868\u5BFC\u5165\u5931\u8D25\uFF1A\u6587\u4EF6\u683C\u5F0F\u4E0D\u6B63\u786E");
      }
      ambienceListFileInput.value = "";
    };
    reader.readAsText(file);
  });
  document.getElementById("siren-sfx-btn-export-list").addEventListener("click", () => {
    const currentListName = localAmbienceState.sfx_current_list;
    const currentData = localAmbienceState.sfx_libraries[currentListName];
    if (!currentData || currentData.length === 0) {
      if (window.toastr) window.toastr.warning("\u5F53\u524D\u5217\u8868\u4E3A\u7A7A\uFF0C\u65E0\u9700\u5BFC\u51FA\uFF01");
      return;
    }
    const dataStr = JSON.stringify(currentData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `siren_sfx_list_${currentListName}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });
  const sfxListFileInput = document.getElementById(
    "siren-sfx-file-import-list"
  );
  document.getElementById("siren-sfx-btn-import-list").addEventListener("click", () => sfxListFileInput.click());
  sfxListFileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target.result);
        if (!Array.isArray(importedData))
          throw new Error("\u6587\u4EF6\u683C\u5F0F\u9519\u8BEF\uFF1A\u975E\u6570\u7EC4\u7ED3\u6784");
        let defaultName = file.name.replace(/\.json$/i, "");
        let newListName = prompt("\u8BF7\u8F93\u5165\u5BFC\u5165\u7684 SFX \u5E93\u540D\u79F0\uFF1A", defaultName);
        if (!newListName) {
          sfxListFileInput.value = "";
          return;
        }
        let finalName = newListName;
        let counter = 1;
        while (localAmbienceState.sfx_libraries[finalName]) {
          finalName = `${newListName}_${counter}`;
          counter++;
        }
        localAmbienceState.sfx_libraries[finalName] = importedData;
        localAmbienceState.sfx_current_list = finalName;
        renderAmbienceAll();
        if (window.toastr)
          window.toastr.success(`\u6210\u529F\u5BFC\u5165\u5E76\u521B\u5EFA\u5217\u8868\uFF1A${finalName}`);
      } catch (err) {
        console.error(err);
        if (window.toastr)
          window.toastr.error("SFX \u5217\u8868\u5BFC\u5165\u5931\u8D25\uFF1A\u6587\u4EF6\u683C\u5F0F\u4E0D\u6B63\u786E");
      }
      sfxListFileInput.value = "";
    };
    reader.readAsText(file);
  });
  document.getElementById("siren-ambience-btn-del-list").addEventListener("click", () => {
    if (localAmbienceState.current_list !== "default" && confirm("\u5220\u9664\u6B64\u5217\u8868\uFF1F")) {
      delete localAmbienceState.libraries[localAmbienceState.current_list];
      localAmbienceState.current_list = "default";
      renderAmbienceAll();
    }
  });
  document.getElementById("siren-ambience-btn-add-row").addEventListener("click", () => {
    localAmbienceState.libraries[localAmbienceState.current_list].push({
      name: "",
      url: ""
    });
    renderAmbienceRows();
  });
  document.getElementById("siren-ambience-items-container").addEventListener("input", (e) => {
    if (e.target.tagName !== "INPUT") return;
    const idx = e.target.getAttribute("data-idx");
    const list = localAmbienceState.libraries[localAmbienceState.current_list];
    if (e.target.classList.contains("siren-ambience-input-name"))
      list[idx].name = e.target.value;
    else if (e.target.classList.contains("siren-ambience-input-url"))
      list[idx].url = e.target.value;
  });
  document.getElementById("siren-ambience-items-container").addEventListener("click", (e) => {
    const btn = e.target.closest(".siren-ambience-btn-del-row");
    if (!btn) return;
    const idx = btn.getAttribute("data-idx");
    localAmbienceState.libraries[localAmbienceState.current_list].splice(
      idx,
      1
    );
    renderAmbienceRows();
  });
  document.getElementById("siren-sfx-list-select").addEventListener("change", (e) => {
    localAmbienceState.sfx_current_list = e.target.value;
    renderSfxRows();
  });
  document.getElementById("siren-sfx-btn-new-list").addEventListener("click", () => {
    const name = prompt("\u8BF7\u8F93\u5165\u65B0 SFX \u5E93\u540D\u79F0\uFF1A");
    if (name && !localAmbienceState.sfx_libraries[name]) {
      localAmbienceState.sfx_libraries[name] = [];
      localAmbienceState.sfx_current_list = name;
      renderAmbienceAll();
    }
  });
  document.getElementById("siren-sfx-btn-del-list").addEventListener("click", () => {
    if (localAmbienceState.sfx_current_list !== "default" && confirm("\u786E\u5B9A\u5220\u9664\u6B64 SFX \u5E93\u5417\uFF1F")) {
      delete localAmbienceState.sfx_libraries[localAmbienceState.sfx_current_list];
      localAmbienceState.sfx_current_list = "default";
      renderAmbienceAll();
    }
  });
  document.getElementById("siren-sfx-btn-add-row").addEventListener("click", () => {
    localAmbienceState.sfx_libraries[localAmbienceState.sfx_current_list].push({
      name: "",
      url: ""
    });
    renderSfxRows();
  });
  document.getElementById("siren-sfx-items-container").addEventListener("input", (e) => {
    if (e.target.tagName !== "INPUT") return;
    const idx = e.target.getAttribute("data-idx");
    const list = localAmbienceState.sfx_libraries[localAmbienceState.sfx_current_list];
    if (e.target.classList.contains("siren-sfx-input-name"))
      list[idx].name = e.target.value;
    else if (e.target.classList.contains("siren-sfx-input-url"))
      list[idx].url = e.target.value;
  });
  document.getElementById("siren-sfx-items-container").addEventListener("click", (e) => {
    const btn = e.target.closest(".siren-sfx-btn-del-row");
    if (!btn) return;
    const idx = btn.getAttribute("data-idx");
    localAmbienceState.sfx_libraries[localAmbienceState.sfx_current_list].splice(idx, 1);
    renderSfxRows();
  });
}

// scripts/mixer.js
init_settings();
init_utils();
function initMixerSettings() {
  const container = document.getElementById("tab-audio-settings");
  if (!container) return;
  const settings = getSirenSettings();
  if (!settings.mixer) settings.mixer = {};
  if (!settings.mixer.volume)
    settings.mixer.volume = {
      master: 100,
      tts: 100,
      ambience: 100,
      sfx: 100,
      music: 100
    };
  if (settings.mixer.spatial_mode === void 0)
    settings.mixer.spatial_mode = 0;
  if (settings.mixer.stereo_width === void 0)
    settings.mixer.stereo_width = 0.8;
  if (settings.mixer.spatial_radius === void 0)
    settings.mixer.spatial_radius = 2;
  if (!settings.mixer.effects) {
    settings.mixer.effects = {
      inner_voice: { enabled: false, reverb: 50, echo: 30 },
      telephone: { enabled: false, bandwidth: 60, distortion: 40 }
    };
  }
  const vol = settings.mixer.volume;
  container.innerHTML = `
        <div class="siren-ext-panel-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
            <h2 style="margin: 0; color: #f3f4f6; font-size: 1.25rem;">\u8C03\u97F3\u53F0</h2>
            <i id="siren-mixer-save-btn" class="fa-solid fa-floppy-disk" style="cursor: pointer; color: #10b981; font-size: 1.2em; transition: color 0.2s, transform 0.2s;" title="\u4FDD\u5B58\u8C03\u97F3\u53F0\u8BBE\u7F6E" onmouseover="this.style.color='#34d399'; this.style.transform='scale(1.1)';" onmouseout="this.style.color='#10b981'; this.style.transform='scale(1)';"></i>
        </div>

        <div class="siren-mixer-sliders" style="background: rgba(15,23,42,0.6); padding: 20px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); margin-bottom: 24px;">
            ${createSlider("tts", "TTS", vol.tts, "#a855f7")}     
            ${createSlider("ambience", "Ambience", vol.ambience, "#3b82f6")}   
            ${createSlider("sfx", "SFX", vol.sfx, "#f59e0b")}   
            ${createSlider("music", "Music", vol.music, "#00f5d4")} 
        </div>

        <h3 style="color: #e2e8f0; margin-top: 32px; margin-bottom: 16px; font-size: 1.1rem;">\u7A7A\u95F4\u611F</h3>
        <div class="siren-mixer-spatial" style="background: rgba(15,23,42,0.6); padding: 20px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05);">
            <div style="display: flex; align-items: center; margin-bottom: 16px;">
                <div style="width: 100px; color: #cbd5e1; font-weight: 600; font-size: 0.95em;">\u6A21\u5F0F\u9009\u62E9</div>
                <select id="siren-spatial-mode" class="siren-ext-select" style="flex: 1; padding: 6px 12px; background: #1e293b; color: #f8fafc; border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; outline: none; cursor: pointer;">
                    <option value="0" ${settings.mixer.spatial_mode === 0 ? "selected" : ""}>\u65E0 (\u9ED8\u8BA4\u53CC\u58F0\u9053)</option>
                    <option value="1" ${settings.mixer.spatial_mode === 1 ? "selected" : ""}>\u7B80\u5355\u6A21\u5F0F (\u5DE6\u53F3\u7ACB\u4F53\u58F0)</option>
                    <option value="2" ${settings.mixer.spatial_mode === 2 ? "selected" : ""}>\u6C89\u6D78\u6A21\u5F0F (\u516B\u65B9\u5168\u666F\u58F0)</option>
                </select>
            </div>
            
            <div id="siren-spatial-controls"></div>
        </div>

        <h3 style="color: #e2e8f0; margin-top: 32px; margin-bottom: 16px; font-size: 1.1rem;">\u7279\u6B8A\u6548\u679C</h3>
        <div class="siren-mixer-effects" style="background: rgba(15,23,42,0.6); padding: 20px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05);">
            
            <div style="margin-bottom: 12px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <span style="color: #cbd5e1; font-weight: 600; font-size: 0.95em;">\u5FC3\u58F0\u56DE\u54CD</span>
                    <label class="siren-ext-switch">
                        <input type="checkbox" id="siren-fx-inner-enabled" ${settings.mixer.effects.inner_voice.enabled ? "checked" : ""}>
                        <span class="siren-ext-slider"></span>
                    </label>
                </div>
                <div id="siren-fx-inner-controls" style="margin-top: 12px; padding-left: 16px; border-left: 2px solid #38bdf8; display: ${settings.mixer.effects.inner_voice.enabled ? "block" : "none"}; transition: all 0.3s;">
                    <div style="color: #94a3b8; font-size: 0.85em; margin-bottom: 16px; line-height: 1.5;">
                        <i class="fa-solid fa-circle-info" style="color: #38bdf8;"></i> \u81EA\u52A8\u5BF9 <code style="background: rgba(0,0,0,0.3); padding: 2px 4px; border-radius: 4px; color: #7dd3fc;">&lt;inner&gt;</code> \u6807\u7B7E\u5185\u7684\u8BED\u97F3\u8FDB\u884C\u7A7A\u7075\u5316\u5904\u7406\u3002<br>
                        <div style="color: #64748b; margin-top: 6px;">
                            <span style="color: #cbd5e1;">\u2022 \u6DF7\u54CD\u7A7A\u95F4\uFF1A</span>\u6A21\u62DF\u58F0\u97F3\u5728\u591A\u5927\u4F53\u79EF\u7684\u623F\u95F4\u5185\u53CD\u5C04\uFF0C\u6570\u503C\u8D8A\u5927\u58F0\u97F3\u8D8A\u7A7A\u65F7\u3002<br>
                            <span style="color: #cbd5e1;">\u2022 \u56DE\u58F0\u5F3A\u5EA6\uFF1A</span>\u58F0\u97F3\u5728\u7A7A\u95F4\u4E2D\u53CD\u5F39\u56DE\u6765\u7684\u6E05\u6670\u5EA6\u548C\u97F3\u91CF\u5360\u6BD4\u3002
                        </div>
                    </div>
                    ${createFxSlider("inner_reverb", "\u6DF7\u54CD\u7A7A\u95F4", settings.mixer.effects.inner_voice.reverb, "#38bdf8")}
                    ${createFxSlider("inner_echo", "\u56DE\u58F0\u5F3A\u5EA6", settings.mixer.effects.inner_voice.echo, "#38bdf8")}
                </div>
            </div>

            <hr style="border: none; border-top: 1px dashed rgba(255,255,255,0.1); margin: 24px 0;">

            <div style="margin-bottom: 4px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <span style="color: #cbd5e1; font-weight: 600; font-size: 0.95em;">\u7535\u8BDD\u5931\u771F</span>
                    <label class="siren-ext-switch">
                        <input type="checkbox" id="siren-fx-tele-enabled" ${settings.mixer.effects.telephone.enabled ? "checked" : ""}>
                        <span class="siren-ext-slider"></span>
                    </label>
                </div>
                <div id="siren-fx-tele-controls" style="margin-top: 12px; padding-left: 16px; border-left: 2px solid #10b981; display: ${settings.mixer.effects.telephone.enabled ? "block" : "none"}; transition: all 0.3s;">
                    <div style="color: #94a3b8; font-size: 0.85em; margin-bottom: 16px; line-height: 1.5;">
                        <i class="fa-solid fa-circle-info" style="color: #10b981;"></i> \u81EA\u52A8\u5BF9 <code style="background: rgba(0,0,0,0.3); padding: 2px 4px; border-radius: 4px; color: #6ee7b7;">&lt;phone&gt;</code> \u6807\u7B7E\u5185\u7684\u8BED\u97F3\u8FDB\u884C\u7535\u8BDD\u5931\u771F\u6A21\u62DF\u3002<br>
                        <div style="color: #64748b; margin-top: 6px;">
                            <span style="color: #cbd5e1;">\u2022 \u9891\u6BB5\u538B\u7F29\uFF1A</span>\u5207\u9664\u9AD8\u9891\u548C\u4F4E\u9891\uFF0C\u6570\u503C\u8D8A\u5927\u58F0\u97F3\u8D8A\u663E\u5F97\u201C\u5E72\u762A\u201D\u548C\u5EC9\u4EF7\u3002<br>
                            <span style="color: #cbd5e1;">\u2022 \u5931\u771F\u5EA6\uFF1A</span>\u6A21\u62DF\u4FE1\u53F7\u53D7\u5E72\u6270\u4EA7\u751F\u7684\u201C\u7535\u6D41\u9EA6\u201D\u548C\u7834\u97F3\u6495\u88C2\u611F\u3002
                        </div>
                    </div>
                    ${createFxSlider("tele_bandwidth", "\u9891\u6BB5\u538B\u7F29", settings.mixer.effects.telephone.bandwidth, "#10b981")}
                    ${createFxSlider("tele_distortion", "\u5931\u771F\u5EA6", settings.mixer.effects.telephone.distortion, "#10b981")}
                </div>
            </div>
        </div>
    `;
  const channels = ["master", "tts", "ambience", "sfx", "music"];
  channels.forEach((ch) => {
    const slider = document.getElementById(`siren-vol-${ch}`);
    const display = document.getElementById(`siren-vol-val-${ch}`);
    if (!slider) return;
    slider.style.setProperty("--val", slider.value + "%");
    slider.addEventListener("input", (e) => {
      const val = e.target.value;
      display.innerText = val + "%";
      slider.style.setProperty("--val", val + "%");
      settings.mixer.volume[ch] = parseInt(val, 10);
      const targetChannels = ch === "master" ? ["tts", "ambience", "sfx", "music"] : [ch];
      targetChannels.forEach((targetCh) => {
        document.dispatchEvent(
          new CustomEvent("sirenVolumeChanged", {
            detail: { channel: targetCh }
          })
        );
      });
    });
  });
  const modeSelect = document.getElementById("siren-spatial-mode");
  modeSelect.addEventListener("change", (e) => {
    const newMode = parseInt(e.target.value, 10);
    settings.mixer.spatial_mode = newMode;
    renderSpatialControls(settings);
    syncSpatialWorldbookEntries(newMode);
  });
  renderSpatialControls(settings);
  const setupToggle = (id, subId, effectKey) => {
    const toggle = document.getElementById(id);
    const subPanel = document.getElementById(subId);
    if (toggle && subPanel) {
      toggle.addEventListener("change", (e) => {
        const isEnabled = e.target.checked;
        settings.mixer.effects[effectKey].enabled = isEnabled;
        subPanel.style.display = isEnabled ? "block" : "none";
      });
    }
  };
  setupToggle(
    "siren-fx-inner-enabled",
    "siren-fx-inner-controls",
    "inner_voice"
  );
  setupToggle("siren-fx-tele-enabled", "siren-fx-tele-controls", "telephone");
  const bindFxSlider = (id, effectKey, propKey) => {
    const slider = document.getElementById(`siren-fx-${id}`);
    const display = document.getElementById(`siren-fx-val-${id}`);
    if (!slider || !display) return;
    slider.addEventListener("input", (e) => {
      const val = parseInt(e.target.value, 10);
      display.innerText = val + "%";
      slider.style.setProperty("--val", val + "%");
      settings.mixer.effects[effectKey][propKey] = val;
    });
  };
  bindFxSlider("inner_reverb", "inner_voice", "reverb");
  bindFxSlider("inner_echo", "inner_voice", "echo");
  bindFxSlider("tele_bandwidth", "telephone", "bandwidth");
  bindFxSlider("tele_distortion", "telephone", "distortion");
  const saveBtn = document.getElementById("siren-mixer-save-btn");
  saveBtn.addEventListener("click", () => {
    saveBtn.className = "fa-solid fa-spinner fa-spin";
    saveBtn.style.color = "#0ea5e9";
    saveSirenSettings();
    setTimeout(() => {
      saveBtn.className = "fa-solid fa-floppy-disk";
      saveBtn.style.color = "#10b981";
    }, 500);
  });
}
function renderSpatialControls(settings) {
  const container = document.getElementById("siren-spatial-controls");
  const mode = settings.mixer.spatial_mode;
  if (mode === 0) {
    container.innerHTML = "";
    return;
  }
  if (mode === 1) {
    const initVal = Math.round(settings.mixer.stereo_width * 100);
    container.innerHTML = `
            <div style="color: #94a3b8; font-size: 0.85em; margin-bottom: 12px; padding-left: 100px;">
                <i class="fa-solid fa-circle-info"></i> \u63D0\u793A\uFF1A\u7B80\u5355\u6A21\u5F0F\u53EA\u652F\u6301\u5DE6\u53F3\u53CC\u58F0\u9053\u3002\u6570\u503C\u8D8A\u5927\uFF0C\u5DE6\u53F3\u58F0\u76F8\u8D8A\u5206\u79BB\u3002
            </div>
            ${createSpatialSlider("stereo_width", "\u58F0\u76F8\u5BBD\u5EA6", initVal, "#f472b6", 0, 100, "%")}
        `;
  } else if (mode === 2) {
    const initVal = Math.round(settings.mixer.spatial_radius * 10);
    container.innerHTML = `
            <div style="color: #94a3b8; font-size: 0.85em; margin-bottom: 12px; padding-left: 100px;">
                <i class="fa-solid fa-circle-info"></i> \u63D0\u793A\uFF1A\u6C89\u6D78\u6A21\u5F0F\u652F\u6301\u516B\u4E2A\u65B9\u5411\u3002\u534A\u5F84\u8D8A\u5927\uFF0C\u8DDD\u79BB\u611F\u8D8A\u8FDC\u3002
            </div>
            ${createSpatialSlider("spatial_radius", "\u58F0\u573A\u534A\u5F84", initVal, "#a855f7", 5, 50, "m")}
        `;
  }
  const sliderId = mode === 1 ? "stereo_width" : "spatial_radius";
  const slider = document.getElementById(`siren-spatial-${sliderId}`);
  const display = document.getElementById(`siren-spatial-val-${sliderId}`);
  if (slider) {
    const updateValProp = (val) => {
      const min = parseFloat(slider.min);
      const max = parseFloat(slider.max);
      const pct = (val - min) / (max - min) * 100;
      slider.style.setProperty("--val", pct + "%");
    };
    updateValProp(slider.value);
    slider.addEventListener("input", (e) => {
      const rawVal = parseFloat(e.target.value);
      updateValProp(rawVal);
      if (mode === 1) {
        settings.mixer.stereo_width = rawVal / 100;
        display.innerText = rawVal + "%";
      } else if (mode === 2) {
        settings.mixer.spatial_radius = rawVal / 10;
        display.innerText = (rawVal / 10).toFixed(1) + "m";
      }
    });
  }
}
function createSlider(id, label, value, color) {
  return `
        <div class="siren-vol-row" style="display: flex; align-items: center; margin: 16px 0;">
            <div style="width: 100px; color: #cbd5e1; font-weight: 600; font-size: 0.95em;">${label}</div>
            <div style="flex: 1; padding: 0 20px;">
                <input type="range" id="siren-vol-${id}" class="siren-ext-slider-input" min="0" max="100" value="${value}"
                    style="--theme-color: ${color};">
            </div>
            <div id="siren-vol-val-${id}" style="width: 45px; text-align: right; color: ${color}; font-family: monospace; font-weight: bold; font-size: 1.1em; text-shadow: 0 0 5px ${color}80;">
                ${value}%
            </div>
        </div>
    `;
}
function createFxSlider(id, label, value, color) {
  return `
        <div class="siren-fx-row" style="display: flex; align-items: center; margin: 12px 0;">
            <div style="width: 80px; color: #94a3b8; font-size: 0.85em;">${label}</div>
            <div style="flex: 1; padding: 0 16px;">
                <input type="range" id="siren-fx-${id}" class="siren-ext-slider-input" min="0" max="100" value="${value}"
                    style="--theme-color: ${color}; --val: ${value}%;">
            </div>
            <div id="siren-fx-val-${id}" style="width: 40px; text-align: right; color: ${color}; font-family: monospace; font-weight: bold; font-size: 1em; text-shadow: 0 0 5px ${color}80;">
                ${value}%
            </div>
        </div>
    `;
}
function createSpatialSlider(id, label, value, color, min, max, unit) {
  const displayStr = unit === "m" ? (value / 10).toFixed(1) + unit : value + unit;
  return `
        <div class="siren-spatial-row" style="display: flex; align-items: center; margin: 16px 0;">
            <div style="width: 100px; color: #cbd5e1; font-weight: 600; font-size: 0.95em;">${label}</div>
            <div style="flex: 1; padding: 0 20px;">
                <input type="range" id="siren-spatial-${id}" class="siren-ext-slider-input" min="${min}" max="${max}" value="${value}"
                    style="--theme-color: ${color};">
            </div>
            <div id="siren-spatial-val-${id}" style="width: 45px; text-align: right; color: ${color}; font-family: monospace; font-weight: bold; font-size: 1.1em; text-shadow: 0 0 5px ${color}80;">
                ${displayStr}
            </div>
        </div>
    `;
}

// scripts/interceptor.js
init_utils();
function initInterceptor() {
  globalThis.sirenVoicePromptInterceptor = async function(chat, contextSize, abort, type) {
    try {
      const context = SillyTavern.getContext();
      const settings = context?.extensionSettings?.siren_voice_settings;
      if (!settings?.tts?.clean_speak_tags_to_llm) {
        return;
      }
      for (let i = 0; i < chat.length; i++) {
        const msg = chat[i];
        if (!msg.mes || typeof msg.mes !== "string") continue;
        if (/<(speak|phone|inner)[^>]*>/i.test(msg.mes)) {
          chat[i] = structuredClone(msg);
          chat[i].mes = chat[i].mes.replace(
            /<(speak|phone|inner)[^>]*>([\s\S]*?)<\/\1>/gi,
            (match, tagName, innerText) => {
              const tagLower = tagName.toLowerCase();
              let replacement = "\u201C\u201D";
              if (tagLower === "speak") {
                replacement = settings.tts.clean_speak_tags_replacement || "\u201C\u201D";
              } else if (tagLower === "phone") {
                replacement = settings.tts.clean_phone_tags_replacement || "\u201C\u201D";
              } else if (tagLower === "inner") {
                replacement = settings.tts.clean_inner_tags_replacement || "**";
              }
              let prefix = replacement.length === 2 ? replacement[0] : replacement;
              let suffix = replacement.length === 2 ? replacement[1] : replacement;
              let cleanText = stripParentheticalAsides(innerText);
              cleanText = stripWrappingPunctuation(cleanText);
              return `${prefix}${cleanText}${suffix}`;
            }
          );
        }
      }
    } catch (err) {
      console.error("[Siren Voice][Interceptor] \u62E6\u622A\u5668\u6267\u884C\u5931\u8D25:", err);
    }
  };
  console.log("[Siren Voice] \u62E6\u622A\u5668 sirenVoicePromptInterceptor \u5DF2\u6210\u529F\u6302\u8F7D");
}

// index.js
(function() {
  if (window.sirenVoiceInitialized) return;
  const shellHtml = `
      <div id="siren-ext-overlay" class="siren-ext-hidden">
          <div class="siren-ext-header-bar">
              <div class="siren-ext-brand" style="display: flex; align-items: center;">
                  <div id="siren-ext-toggle-sidebar" style="cursor: pointer;"><i class="fa-solid fa-bars"></i></div>
                  
                  <span style="display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; background: linear-gradient(135deg, rgba(50, 206, 234, 0.66), rgba(181, 117, 241, 0.77)); border-radius: 50%; margin-left: 12px; margin-right: 8px; border: 1px solid rgba(168, 85, 247, 0.5); box-shadow: 0 0 10px rgba(168, 85, 247, 0.4);">
                      <span style="font-size: 1.5rem; line-height: 1; filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.6));">\u{1F9DC}\u200D\u2640\uFE0F</span>
                  </span>
                  <span style="font-weight: bold; letter-spacing: 1px; color: #f3f4f6;">Siren Voice</span>

                  <span id="siren-wb-warning-badge" style="display: none; margin-left: 12px; font-size: 0.75rem; color: #f59e0b; background: rgba(245, 158, 11, 0.15); padding: 3px 8px; border-radius: 12px; border: 1px solid rgba(245, 158, 11, 0.5); font-weight: normal; white-space: nowrap;">
                      <i class="fa-solid fa-triangle-exclamation"></i> \u672A\u7ED1\u5B9A Siren-Voice \u5168\u5C40\u4E16\u754C\u4E66
                  </span>
              </div>
              <div id="siren-ext-close-btn" title="\u5173\u95ED"><i class="fa-solid fa-xmark interactable"></i></div>
          </div>
          
          <div class="siren-ext-main-layout">
              <div class="siren-ext-sidebar collapsed" id="siren-ext-sidebar">
              
                  <div class="siren-ext-nav-item active" data-tab="tab-tts">
                      <i class="fa-solid fa-microphone-lines fa-fw" style="color: #a855f7;"></i> <span>\u585E\u58EC\u4E4B\u58F0</span>
                  </div>
                  <div class="siren-ext-nav-item" data-tab="tab-ambience">
                      <i class="fa-solid fa-wand-magic-sparkles fa-fw" style="color: #3b82f6;"></i> <span>\u5E7B\u5883\u6C1B\u56F4</span>
                  </div>
                  <div class="siren-ext-nav-item" data-tab="tab-music">
                      <i class="fa-solid fa-compact-disc fa-fw" style="color: #06b6d4;"></i> <span>\u6F6E\u6C50\u97F3\u4E50\u53F0</span>
                  </div>
                  <div class="siren-ext-nav-item" data-tab="tab-audio-settings">
                      <i class="fa-solid fa-sliders fa-fw" style="color: #f59e0b;"></i> <span>\u6DF7\u97F3\u4E0E\u914D\u7F6E</span>
                  </div>
              </div>
              
              <div class="siren-ext-content-area">
                  <div id="tab-tts" class="siren-ext-tab-content active"></div>
                  <div id="tab-music" class="siren-ext-tab-content"></div>
                  <div id="tab-audio-settings" class="siren-ext-tab-content"></div>
                  <div id="tab-ambience" class="siren-ext-tab-content"></div>
              </div>
          </div>
      </div>
      `;
  function initPlugin() {
    if (window.sirenVoiceInitialized || document.getElementById("siren-ext-overlay"))
      return;
    window.sirenVoiceInitialized = true;
    document.body.insertAdjacentHTML("beforeend", shellHtml);
    bindGlobalEvents();
    checkMobileState();
    initFloatingPlayer();
    initMusicSettings();
    initTtsSettings();
    applyTtsBeautifyCss();
    initAmbienceSettings();
    initMixerSettings();
    registerSirenMacros();
    bindSTEvents();
    checkWorldbookStatus();
    initInterceptor();
    window.addEventListener("pagehide", () => {
      for (const audio of document.querySelectorAll("#siren-ext-overlay audio")) releaseAudioElement(audio);
    });
    console.log("[Siren Voice] Plugin UI initialized successfully.");
  }
  function bindGlobalEvents() {
    $(document).off("click", "#siren-ext-close-btn").on("click", "#siren-ext-close-btn", function(e) {
      e.stopPropagation();
      e.preventDefault();
      $("#siren-ext-overlay").addClass("siren-ext-hidden");
    });
    $(document).off("click", "#siren-ext-toggle-sidebar").on("click", "#siren-ext-toggle-sidebar", function(e) {
      e.stopPropagation();
      $("#siren-ext-sidebar").toggleClass("collapsed");
    });
    $(document).off("click", ".siren-ext-nav-item").on("click", ".siren-ext-nav-item", function() {
      $(".siren-ext-nav-item").removeClass("active");
      $(".siren-ext-tab-content").removeClass("active");
      $(this).addClass("active");
      const tabId = $(this).data("tab");
      $(`#${tabId}`).addClass("active");
      if (window.innerWidth <= 768) {
        $("#siren-ext-sidebar").addClass("collapsed");
      }
    });
  }
  function checkWorldbookStatus() {
    if (!window.TavernHelper) return;
    let isMissing = true;
    try {
      const globalWbs = window.TavernHelper.getGlobalWorldbookNames();
      if (globalWbs.some((name) => name.includes("Siren-Voice"))) {
        isMissing = false;
      }
    } catch (error) {
      console.warn("[Siren Voice] \u8BFB\u53D6\u5168\u5C40\u4E16\u754C\u4E66\u72B6\u6001\u5931\u8D25:", error);
    }
    const badge = document.getElementById("siren-wb-warning-badge");
    if (badge) {
      badge.style.display = isMissing ? "inline-block" : "none";
    }
  }
  function bindSTEvents() {
    try {
      const { eventSource, event_types } = SillyTavern.getContext();
      if (event_types.APP_READY) {
        eventSource.on(event_types.APP_READY, () => {
          console.log("[Siren Voice] ST \u51C6\u5907\u5C31\u7EEA\uFF0C\u68C0\u67E5\u4E16\u754C\u4E66...");
          checkWorldbookStatus();
        });
      }
      const worldInfoEvent = event_types.WORLDINFO_SETTINGS_UPDATED || "worldinfo_settings_updated";
      eventSource.on(worldInfoEvent, () => {
        console.log(
          "[Siren Voice] \u68C0\u6D4B\u5230 worldinfo \u53D8\u52A8\uFF0C\u5EF6\u8FDF 300ms \u540E\u68C0\u67E5..."
        );
        setTimeout(() => {
          checkWorldbookStatus();
        }, 300);
      });
      const settingsEvent = event_types.SETTINGS_UPDATED || "settings_updated";
      eventSource.on(settingsEvent, () => {
        console.log("[Siren Voice] \u68C0\u6D4B\u5230 settings \u53D8\u52A8\uFF0C\u5EF6\u8FDF 300ms \u540E\u68C0\u67E5...");
        setTimeout(() => {
          checkWorldbookStatus();
        }, 300);
      });
      initEvents();
    } catch (error) {
      console.warn("[Siren Voice] \u7ED1\u5B9A ST \u4E8B\u4EF6\u6E90\u5931\u8D25:", error);
    }
  }
  function checkMobileState() {
    if (window.innerWidth <= 768) {
      $("#siren-ext-sidebar").addClass("collapsed");
    }
  }
  function addExtensionButton() {
    const menuId = "extensionsMenu";
    const menu = document.getElementById(menuId);
    if (!menu) {
      setTimeout(addExtensionButton, 500);
      return;
    }
    if (document.getElementById("siren-ext-wand-btn")) return;
    const container = document.createElement("div");
    container.className = "extension_container interactable";
    container.innerHTML = `
              <div id="siren-ext-wand-btn" class="list-group-item flex-container flexGap5 interactable" title="Siren Voice \u97F3\u4E50\u4E0E\u8BED\u97F3\u7CFB\u7EDF">
                  <div class="fa-fw fa-solid fa-music extensionsMenuExtensionButton" style="color: #06b6d4;"></div>
                  <span>Siren Voice</span>
              </div>
          `;
    container.addEventListener("click", (e) => {
      const extensionsMenu = document.getElementById("extensionsMenu");
      if (extensionsMenu) {
        extensionsMenu.style.display = "none";
      }
      $("#siren-ext-overlay").removeClass("siren-ext-hidden");
      checkWorldbookStatus();
    });
    menu.appendChild(container);
  }
  function waitForTavernHelper(retryCount = 0) {
    const MAX_RETRIES = 30;
    if (typeof window.TavernHelper !== "undefined") {
      console.log("[Siren Voice] TavernHelper \u68C0\u6D4B\u901A\u8FC7\uFF0C\u542F\u52A8\u63D2\u4EF6\u3002");
      initPlugin();
      addExtensionButton();
    } else {
      if (retryCount >= MAX_RETRIES) {
        console.error("[Siren Voice] \u542F\u52A8\u5931\u8D25\uFF1A\u7B49\u5F85 \u9152\u9986\u52A9\u624B \u8D85\u65F6\u3002");
        return;
      }
      setTimeout(() => waitForTavernHelper(retryCount + 1), 500);
    }
  }
  $(document).ready(function() {
    waitForTavernHelper();
  });
})();
