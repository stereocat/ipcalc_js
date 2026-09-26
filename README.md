# ipcalc_js

Vue.jsで実装したIPv4サブネット計算機です。
[IP Calculator / IP Subnetting](http://jodies.de/ipcalc)を参考にしています。

IPv4アドレスとCIDRプレフィックス長、またはドット区切りのサブネットマスクを入力すると、アドレス表記、サブネット情報、特殊用途アドレスとの関係、およびアドレスブロックツリーを表示します。

## 必要環境

- Node.js 24.15以上、25未満（推奨バージョンは`.nvmrc`を参照）
- npm

## セットアップ

```sh
npm install
```

## 開発サーバー

```sh
npm run serve
```

`npm run dev`も同じVite開発サーバーを起動します。

## テスト

```sh
npm test
```

## Lint

```sh
npm run lint
```

## 本番ビルド

```sh
npm run build
```

生成された`dist/`は、次のコマンドでExpressから配信できます。

```sh
npm start
```

Viteのプレビューサーバーを利用する場合は、次を実行します。

```sh
npm run preview
```

## ドキュメント

- [AIコーディング向け作業指針](AGENTS.md)
- [アーキテクチャ](docs/architecture.md)
