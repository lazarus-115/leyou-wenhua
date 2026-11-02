# 乐游文华 · 校园任务巡游网站

文华学院 11 月 30 日游戏任务巡游活动网站。红橙主题、红枫元素、现代活泼风格。

## 目录结构

```
leyou-wenhua/
├── index.html      首页
├── guide.html      流程向导（分步）
├── overview.html   任务总览
├── css/style.css   全局样式
├── js/data.js      ★ 活动数据（改这里即可）
└── js/main.js      交互逻辑（一般不用动）
```

## 怎么改内容

所有活动信息都集中在 **`js/data.js`**，改这一个文件即可更新全站：

- `SITE`：活动名称、口号、日期、地点、简介
- `ACTIVITIES`：任务点列表，按顺序排列，字段含义：
  - `name` 任务名、`location` 地点、`time` 时间
  - `description` 一句话说明、`rules` 任务规则、`passCondition` 通关条件
  - `image` 图片链接（**留空则显示占位框**）

### 加图片

把图片链接填到对应活动的 `image` 字段即可自动显示，例如：

```js
image: "images/task-2.jpg",        // 本地图片（放到 images/ 文件夹）
image: "https://xxx.com/xxx.jpg",  // 或网络图片链接
```

### 增删任务点

直接在 `ACTIVITIES` 数组里增删对象即可，序号、进度、总览会自动更新。

## 本地预览

双击 `index.html` 即可在浏览器打开；或在项目目录运行：

```bash
python -m http.server 8000
# 然后访问 http://localhost:8000
```

## 部署到 GitHub Pages

1. 在 GitHub 新建仓库，把整个 `leyou-wenhua/` 文件夹内容推上去
2. 仓库 Settings → Pages → 选择 `main` 分支根目录 → Save
3. 等待几分钟，访问 `https://<用户名>.github.io/<仓库名>/` 即可
