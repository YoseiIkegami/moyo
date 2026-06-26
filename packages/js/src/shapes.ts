export type ShapeData = {
  id: string;
  name: string;
  nameJa: string;
  description: string;
  path: string;
  viewBox: string;
  tags: string[];
};

export const shapes: Record<string, ShapeData> = {
  kidney: {
    id: "kidney",
    name: "Kidney",
    nameJa: "キドニー",
    description: "豆型の柔らかい形状",
    path: "M30,30 C50,10 90,20 85,60 C80,100 30,90 40,65 C45,50 15,50 30,30 Z",
    viewBox: "0 0 100 100",
    tags: ["organic", "blob", "simple"]
  },
  reuleaux: {
    id: "reuleaux",
    name: "Reuleaux",
    nameJa: "ルーローの三角形",
    description: "完璧な曲率を持つ有機形",
    path: "M50,10 A90,90 0 0 0 11,77 A90,90 0 0 0 89,77 A90,90 0 0 0 50,10 Z",
    viewBox: "0 0 100 100",
    tags: ["organic", "geometric", "smooth"]
  },
  capsule: {
    id: "capsule",
    name: "Capsule",
    nameJa: "カプセル",
    description: "UI背景やボタンに使いやすい丸みのある長円形",
    path: "M25,22 H75 C91,22 98,35 98,50 C98,65 91,78 75,78 H25 C9,78 2,65 2,50 C2,35 9,22 25,22 Z",
    viewBox: "0 0 100 100",
    tags: ["soft", "ui", "simple"]
  },
  squircle: {
    id: "squircle",
    name: "Squircle",
    nameJa: "スクワークル",
    description: "角丸矩形より自然な曲率を持つベース形状",
    path: "M50,6 C80,6 94,20 94,50 C94,80 80,94 50,94 C20,94 6,80 6,50 C6,20 20,6 50,6 Z",
    viewBox: "0 0 100 100",
    tags: ["geometric", "ui", "smooth"]
  },
  pebble: {
    id: "pebble",
    name: "Pebble",
    nameJa: "小石",
    description: "自然物のような控えめな不均一さを持つ形状",
    path: "M19,39 C23,17 45,8 66,14 C89,20 96,43 86,67 C77,88 52,95 30,84 C10,74 6,55 19,39 Z",
    viewBox: "0 0 100 100",
    tags: ["organic", "natural", "blob"]
  },
  leaf: {
    id: "leaf",
    name: "Leaf",
    nameJa: "リーフ",
    description: "アクセントや自然な流れを作る葉型",
    path: "M12,84 C16,40 45,11 88,12 C89,55 60,84 12,84 Z",
    viewBox: "0 0 100 100",
    tags: ["organic", "natural", "sharp"]
  },
  droplet: {
    id: "droplet",
    name: "Droplet",
    nameJa: "しずく",
    description: "流動感と焦点を作る水滴形状",
    path: "M50,7 C67,31 85,49 85,68 C85,86 70,96 50,96 C30,96 15,86 15,68 C15,49 33,31 50,7 Z",
    viewBox: "0 0 100 100",
    tags: ["organic", "fluid", "simple"]
  },
  amoeba: {
    id: "amoeba",
    name: "Amoeba",
    nameJa: "アメーバ",
    description: "自由で有機的な印象を出す不定形",
    path: "M22,30 C36,8 64,11 76,26 C92,45 85,76 61,87 C39,97 14,85 10,61 C7,45 13,39 22,30 Z",
    viewBox: "0 0 100 100",
    tags: ["organic", "blob", "playful"]
  },
  wave: {
    id: "wave",
    name: "Wave",
    nameJa: "ウェーブ",
    description: "セクション区切りや動きのある装飾に向く波形",
    path: "M5,61 C18,31 36,31 50,51 C64,71 82,71 95,41 V92 H5 Z",
    viewBox: "0 0 100 100",
    tags: ["fluid", "layout", "motion"]
  },
  egg: {
    id: "egg",
    name: "Egg",
    nameJa: "エッグ",
    description: "安定感と親しみを持つ卵型",
    path: "M50,5 C72,5 88,34 88,60 C88,83 72,96 50,96 C28,96 12,83 12,60 C12,34 28,5 50,5 Z",
    viewBox: "0 0 100 100",
    tags: ["organic", "soft", "simple"]
  },
  cloud: {
    id: "cloud",
    name: "Cloud",
    nameJa: "クラウド",
    description: "軽さや余白感を作る雲のような形状",
    path: "M24,74 C12,74 5,66 5,55 C5,45 13,38 24,38 C29,22 45,15 59,23 C68,19 81,24 85,37 C94,40 99,48 99,58 C99,69 90,76 77,76 H24 Z",
    viewBox: "0 0 100 100",
    tags: ["organic", "soft", "background"]
  },
  petal: {
    id: "petal",
    name: "Petal",
    nameJa: "ペタル",
    description: "繊細なアクセントに使える花びら形状",
    path: "M50,93 C27,75 17,53 23,32 C30,10 52,4 70,17 C88,30 87,55 70,73 C62,82 55,88 50,93 Z",
    viewBox: "0 0 100 100",
    tags: ["organic", "natural", "soft"]
  },
  bean: {
    id: "bean",
    name: "Bean",
    nameJa: "ビーンズ",
    description: "小さな装飾やアイコン背景に向く豆型",
    path: "M33,17 C57,2 91,19 90,48 C89,76 57,97 31,84 C8,72 7,44 25,37 C37,32 21,25 33,17 Z",
    viewBox: "0 0 100 100",
    tags: ["organic", "blob", "small"]
  },
  shield: {
    id: "shield",
    name: "Shield",
    nameJa: "シールド",
    description: "安心感や保護の意味を柔らかく伝える形状",
    path: "M50,6 C63,16 78,18 90,20 V45 C90,68 75,85 50,95 C25,85 10,68 10,45 V20 C22,18 37,16 50,6 Z",
    viewBox: "0 0 100 100",
    tags: ["symbol", "soft", "geometric"]
  },
  orbit: {
    id: "orbit",
    name: "Orbit",
    nameJa: "オービット",
    description: "中心性や回遊感を出す楕円軌道形",
    path: "M50,22 C77,10 98,20 96,44 C94,70 66,91 39,88 C13,85 1,64 10,43 C19,22 33,30 50,22 Z",
    viewBox: "0 0 100 100",
    tags: ["motion", "organic", "dynamic"]
  },
  softDiamond: {
    id: "softDiamond",
    name: "Soft Diamond",
    nameJa: "ソフトダイヤ",
    description: "ダイヤ形の緊張感を丸みで和らげた形状",
    path: "M50,4 C63,17 82,31 96,50 C82,69 63,83 50,96 C37,83 18,69 4,50 C18,31 37,17 50,4 Z",
    viewBox: "0 0 100 100",
    tags: ["geometric", "soft", "symbol"]
  },
  bubble: {
    id: "bubble",
    name: "Bubble",
    nameJa: "バブル",
    description: "吹き出しや軽いハイライトに使える丸い形状",
    path: "M50,7 C74,7 93,24 93,47 C93,70 74,87 50,87 C42,87 35,85 29,82 L12,93 L18,73 C11,66 7,57 7,47 C7,24 26,7 50,7 Z",
    viewBox: "0 0 100 100",
    tags: ["ui", "soft", "communication"]
  },
  manta: {
    id: "manta",
    name: "Manta",
    nameJa: "マンタ",
    description: "横方向の広がりと浮遊感を持つ形状",
    path: "M4,50 C24,24 39,29 50,43 C61,29 76,24 96,50 C78,65 63,70 50,58 C37,70 22,65 4,50 Z",
    viewBox: "0 0 100 100",
    tags: ["organic", "motion", "wide"]
  }
};

export function getShape(id: string): ShapeData | undefined {
  return shapes[id];
}

export function listShapes(): ShapeData[] {
  return Object.values(shapes);
}

export function searchShapes(tag: string): ShapeData[] {
  return listShapes().filter((shape) => shape.tags.includes(tag));
}
