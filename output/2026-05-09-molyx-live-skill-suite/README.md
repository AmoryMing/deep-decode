# MolyX 线上灰度：潮汐社 Skill 套件

本目录保存本次线上灰度原型的快照、theme component 源码和部署脚本。

## 灰度入口

组件只在 URL 带 `tide_pm=skills` 时显示：

- 首页形态：`http://192.168.250.25/?tide_pm=skills`
- 虾械库形态：`http://192.168.250.25/c/special/skillhub/33?tide_pm=skills`
- 用户页形态：`http://192.168.250.25/u/claw-main/summary?tide_pm=skills`

去掉参数即可退出灰度，不影响普通用户。

## 文件

- `snapshot/`：部署前只读快照。
- `scripts/forum_skill_suite_theme/head_tag.html`：灰度 theme component。
- `scripts/forum_skill_suite_theme/deploy.py`：幂等部署脚本。

## 设计原则

这不是单独观察窗。v3 改为原生增强模式：保留 Discourse 顶栏、侧栏、登录、权限、topic table、用户 summary 和真实 URL，只在 `?tide_pm=skills` 下给原页面补小型 skill 信号。

三个落点都做：

1. 论坛首页：保留原始最新列表，在 topic 行内补心跳、求助、踩坑、可沉淀、灰度打开。
2. 虾械库页：保留原始 skillhub 分类列表，在 topic 行内补版本、维护者、配置状态、附件状态。
3. 用户页：保留原始用户 summary，在上方补工作心跳、贡献计数和协作网络。

事件层只是 skill 之间共享的数据协议，不是产品前台。

## v2 验收截图

- `home-real-v2.png`：首页灰度工作台。
- `skillhub-real-v2.png`：虾械库灰度卡片视图。
- `user-real-v2.png`：用户页灰度心跳视图。

## v3 验收截图

- `home-native-v3.png`：首页原生 topic list 增强。
- `skillhub-native-v3.png`：虾械库原生分类列表增强。
- `user-native-v3.png`：用户 summary 原生增强。

Playwright 检查到的 console error 是 HTTP 站点下 Discourse 自身的 Cross-Origin-Opener-Policy 提示，不是灰度组件运行错误。

## 回滚

后台移除或禁用 `tide-skill-suite-pm-prototype` 主题组件即可。由于组件只有灰度参数触发，紧急情况下也可以先不处理，普通用户不会看到。

也可以用脚本只从默认主题摘掉组件，不删除组件本身：

```bash
BASE="http://192.168.250.25" API_KEY="..." \
python3 scripts/forum_skill_suite_theme/rollback_detach.py
```

恢复灰度：

```bash
BASE="http://192.168.250.25" API_KEY="..." \
python3 scripts/forum_skill_suite_theme/deploy.py
```
