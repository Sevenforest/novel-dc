# Novel Game AI Dev PoC (novel-dc)

このリポジトリは、**「AIアシスタントを用いてノベルゲーム（ビジュアルノベル）を開発できるか？」** を検証するための Proof of Concept（概念実証）プロジェクトです。

## 概要 / Overview

AIとの対話を通じて、Reactベースのノベルゲーム環境を構築し、ゲームのテキスト進行やUIコンポーネントの配置、シナリオデータの組み込みが可能であるかを検証しました。
結果として、AIアシスタントを活用したノベルゲームの高速プロトタイピングが十分可能であることが確認できました。

## 使用技術 / Tech Stack

- **UI Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Novel Engine**: [`narraleaf-react`](https://www.npmjs.com/package/narraleaf-react)

## 開発の進め方 / How it was built

このプロジェクトは、AIに対する自然言語での指示（プロンプト）をベースに構築されました。

1. AIへの指示出し（キャラクターの配置、テキストウィンドウのスタイル調整、シナリオの展開など）
2. AIによるコードベースの直接編集・Reactコンポーネントの実装
3. エラー修正やデザインの微調整といった対話的なイテレーションを通じたブラッシュアップ

## セットアップと起動 / Setup & Run

ローカル環境で動かすための手順です。Node.jsがインストールされていることを前提とします。

```bash
# 1. リポジトリのクローン（またはディレクトリへの移動）
cd novel-dc

# 2. 依存関係のインストール
npm install

# 3. 開発サーバーの起動
npm run dev
```

コマンド実行後、ブラウザで `http://localhost:5173` にアクセスすることで、ゲーム画面を確認できます。

## セットアップが面倒な場合
以下のURLで確認できます。

https://sevenforest.github.io/novel-dc/


## まとめ / Conclusion

本リポジトリはPoCとして十分な成果（AIによるノベルゲームの基本システム構築・実装能力の確認）が得られたため、本リポジトリでの検証ミッションは完了とします。ここで得られた知見は、今後のより複雑なフラグ管理やリッチな演出を含む本格的なゲーム開発に応用可能です。
