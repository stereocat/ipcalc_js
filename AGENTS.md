# AGENTS.md

## 目的

このリポジトリには、Vue 3で実装されたIPv4計算用のシングルページアプリケーションがあります。IPv4アドレスとCIDRプレフィックス長、またはドット区切りのサブネットマスクを受け取り、アドレス表記、サブネット情報、特殊用途アドレスとの一致、および操作可能なアドレスブロックツリーを表示します。

複数コンポーネントや状態管理にまたがる変更を行う前に、[docs/architecture.md](docs/architecture.md)を参照してください。

## スコープと不変条件

- この計算機はIPv4専用です。IPv6対応は、入力、計算、表示、データフロー、テストをまとめて設計する必要があります。
- `src/store.js`のPiniaストアが、選択中アドレスとネットワークブロックの信頼できる情報源です。
- 共有選択状態は`selectIPBlock()`で原子的に更新し、`ipAddrString`と`ipBlock`を別々に変更しないでください。
- `ipBlock`は`netmask`パッケージの`Netmask`インスタンスであり、単純なJSONではありません。
- 入力は、Piniaストアへ反映する前に検証してください。
- IPv4の解析・変換・CIDR境界計算は`src/js/ip-address.js`へ集約し、コンポーネント内へ重複実装しないでください。
- 標準の4オクテット10進表記だけを受け付け、`127.1`、8進数、16進数などを暗黙に許可しないでください。
- 表、特殊アドレス結果、D3ツリーのCIDR選択は、同じ共有状態を更新して全表示へ反映される必要があります。
- バックエンドAPIや永続化ストレージ、アプリケーション固有の本番サーバーはありません。`dist/`は静的ファイルとして配信します。

## 主要ファイル

- `index.html`: ViteのHTMLエントリポイントです。
- `vite.config.mjs`: Vue用Vite設定です。
- `.github/workflows/deploy-pages.yml`: `develop`ブランチからGitHub Pagesへ検証・ビルド・デプロイします。
- `src/main.js`: Vue、Pinia、Element Plusを初期化します。
- `src/App.vue`: ルートレイアウトです。
- `src/store.js`: 選択中IPv4アドレスと`Netmask`を保持するPiniaストアです。
- `src/js/ip-address.js`: `ipaddr.js`を利用するIPv4操作アダプターです。
- `src/components/AppInput.vue`: 入力検証と遅延付き状態更新です。
- `src/components/IPAddressTable.vue`: アドレスの数値表現です。
- `src/components/NetmaskTable.vue`: サブネット情報と隣接CIDRです。
- `src/components/IPBlockTree.vue`: D3/SVGによるブロック可視化です。
- `src/components/SpecialAddressContainer.vue`: 特殊用途範囲との包含判定です。
- `src/js/special-addr-info-defs.js`: 手動管理する特殊用途アドレスデータです。
- `tests/`: Vitestによるユニットテストとスモークテストです。
- `dist/`: Viteが生成する出力です。直接編集しないでください。

## 開発ワークフロー

```sh
npm install
npm run serve
npm run lint
npm test
npm run build
npm run preview
```

- Node.jsは`.nvmrc`と`package.json`の`engines`に従ってください。
- `npm run serve`または`npm run dev`でVite開発サーバーを起動します。
- `npm test`でVitestを1回実行します。
- `npm run build`で`dist/`を生成します。
- `npm run preview`はビルド済み`dist/`をローカルで確認するためのコマンドです。本番配信には使用しません。
- GitHub Pagesビルドでは、Pagesが返すベースパスを`VITE_BASE_PATH`環境変数としてViteへ渡します。ローカルでは未指定のため`/`になります。
- 依存関係を変更した場合は`package.json`と`package-lock.json`を両方更新し、`npm audit`も確認してください。

## 変更時の指針

### 入力とIP計算

- `192.0.2.1`、`192.0.2.1/24`、`192.0.2.1/255.255.255.0`を受け付けます。
- マスク省略時は`/32`として扱います。
- `ipaddr.js`の一般的な`parse()`は複数のIPv4表記を許可するため、ユーザー入力には必ず厳格なIPv4検証を先に適用してください。
- 入力値は1000ミリ秒の遅延後にストアへ反映されます。UIテストではタイマーを考慮してください。
- `/0`、`/31`、`/32`の境界動作を必ず確認してください。

### Vue、Pinia、Element Plus

- Vue 3のOptions APIを使用しています。依頼されていないComposition APIやTypeScriptへの全面移行を同時に行わないでください。
- 共有状態の読み取りにはPiniaの`mapState`、更新には`mapActions`と`selectIPBlock()`を使用します。
- ストア購読を追加した場合は`beforeUnmount()`で解除してください。
- Element Plusは必要なコンポーネントとCSSだけを`src/main.js`で読み込みます。全量importへ戻すとバンドルサイズが大きくなります。
- アイコンは`@element-plus/icons-vue`のSVGコンポーネントを使用してください。

### D3

- `IPBlockTree.vue`は`mounted()`でSVGを生成し、D3がその内部ノードを管理します。
- data joinにはCIDRをキーとして使用し、不要ノードを`exit().remove()`で削除してください。
- 初回描画、Pinia更新後の再描画、`/0`と`/32`付近の描画を確認してください。

### 特殊用途アドレス

- `src/js/special-addr-info-defs.js`はアプリケーションデータです。
- CIDR、説明、現行RFC、廃止済みRFC、双方向の包含判定を確認してください。
- 無関係な変更でRFC参照を更新しないでください。

## 検証要件

コード変更後は次を実行してください。

1. `npm run lint`
2. `npm test`
3. `npm run build`
4. 依存関係を変更した場合は`npm audit`
5. UI変更時は開発サーバーまたは本番相当サーバーで手動確認

計算・操作変更では、少なくとも次を確認してください。

- `127.0.0.1/8`
- `192.168.1.10/24`
- `192.0.2.1/255.255.255.0`
- 無効なIPv4アドレスまたはマスク
- `/0`、`/31`、`/32`
- テキストリンクとD3ツリーからのCIDR選択

## 保守上の注意点

- `Netmask`インスタンスはPinia内で`markRaw()`されています。状態永続化やSSRを追加する場合はデータモデルを再検討してください。
- 特殊用途アドレス定義は静的であり、最新レジストリとの差分を定期的に確認する必要があります。
- RFCリンクは現在`tools.ietf.org`を参照しています。
- UIは英語です。ローカライズが依頼範囲に含まれない限り、表示言語を混在させないでください。
