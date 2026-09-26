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

生成された`dist/`をローカルで確認する場合は、Viteのプレビューサーバーを利用します。

```sh
npm run preview
```

## GitHub Pagesへの公開

`develop`ブランチへpushすると、GitHub ActionsがLint、テスト、本番ビルドを実行し、成功した`dist/`をGitHub Pagesへ公開します。手動実行もActions画面から行えます。

初回のみ、GitHubリポジトリの「Settings」→「Pages」→「Build and deployment」で、Sourceを「GitHub Actions」に設定してください。公開先は次のURLです。

```text
https://stereocat.github.io/ipcalc_js/
```

ビルド時のベースパスはGitHub Pagesの設定から自動取得するため、後から独自ドメインへ変更してもVite設定の書き換えは不要です。

## ドキュメント

- [AIコーディング向け作業指針](AGENTS.md)
- [アーキテクチャ](docs/architecture.md)
