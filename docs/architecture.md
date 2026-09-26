# アーキテクチャ

## 1. アプリケーション概要

`ipcalc_js`は、ブラウザ上で動作するIPv4サブネット計算機です。IPv4アドレスと、任意のCIDRプレフィックス長またはドット区切りサブネットマスクを検証し、次を表示します。

- 2進数、8進数、10進整数、16進数でのアドレス表記
- サブネット長、マスク、ホストマスク、ネットワーク、ホスト範囲、ブロードキャスト
- 前、現在、次のCIDRブロック
- 特殊用途IPv4範囲との包含関係とRFC
- 親ブロックと子サブネットの操作可能なD3階層図

計算はすべてブラウザ内で実行されます。HTTP API、認証、データベース、永続化はありません。

## 2. 技術スタック

| 分類 | 技術 | 役割 |
| --- | --- | --- |
| UI | Vue 3 | Options APIによるコンポーネント描画 |
| 状態管理 | Pinia | 選択中IPv4アドレスとブロックの共有 |
| UI部品 | Element Plus | 入力欄、折りたたみ、アイコン表示 |
| IP解析 | `ipaddr.js` | 厳格なIPv4解析、バイト列、CIDR境界計算 |
| サブネット | `netmask` | サブネット属性と前後ブロック計算 |
| 可視化 | D3モジュール | 階層構築、SVG data join、アニメーション |
| ビルド | Vite | 開発サーバーと本番バンドル |
| 配信 | Express 5 | `dist/`の静的配信のみ |
| 品質 | ESLint 10 | Flat Configによる静的検査 |
| テスト | Vitest、Vue Test Utils、jsdom | ユニットテストとアプリスモークテスト |

## 3. 実行構成

### 開発環境

```text
ブラウザ
  -> Vite開発サーバー（npm run serve）
     -> index.html
     -> src/main.js
     -> Vueアプリケーション
```

`index.html`が`#app`と`/src/main.js`のmodule scriptを定義します。ViteがVue単一ファイルコンポーネントの変換、依存関係のバンドル、HMRを担当します。

### 本番環境

```text
npm run build
  -> dist/

ブラウザ
  -> Express（npm start）
     -> dist/の静的ファイル
     -> クライアント側Vueアプリケーション
```

`server.js`は絶対パスで`dist/`を解決し、`process.env.PORT`またはポート3000で待ち受けます。業務APIやSSRは提供しません。

## 4. 起動処理とコンポーネント構成

`src/main.js`は次を行います。

1. Vueアプリケーションを生成する。
2. Piniaを登録する。
3. 使用するElement PlusコンポーネントとCSSだけを登録する。
4. `App.vue`を`#app`へマウントする。

```text
App
├── AppHeader
├── AppInput
└── Element Plusの折りたたみ領域
    ├── IPAddressTable
    ├── NetmaskTable
    │   └── AppIPBlockAnchor
    ├── SpecialAddressContainer
    │   └── SpecialAddressList
    │       ├── AppIPBlockAnchor
    │       └── AppRFCAnchor
    └── IPBlockTree
```

Vue Routerは使用していません。

## 5. 状態モデルとデータフロー

Piniaの`useIPStore`が表示コンポーネント間の統合点です。

```text
テキスト入力 / CIDRリンク / D3ツリーノード
                    |
                    v
        selectIPBlock(address, block)
                    |
                    v
          Pinia共有選択状態
          - ipAddrString: string
          - ipBlock: Netmask
                    |
      +-------------+--------------+----------------+-------------+
      |                            |                |             |
      v                            v                v             v
IPAddressTable               NetmaskTable   SpecialAddress   IPBlockTree
                                             Container
```

初期状態は`127.0.0.1`と`127.0.0.0/8`です。

- `ipAddrString`は表記変換するホストアドレスです。
- `ipBlock`は正規化された所属ネットワークを表す`Netmask`インスタンスです。

両方は`selectIPBlock()`内の`$patch()`で原子的に更新されます。`Netmask`インスタンスはVueによる内部変換を避けるため`markRaw()`されています。この状態は単純なJSONではないため、永続化やSSRを導入する場合はプリミティブなCIDR表現へ見直す必要があります。

## 6. 入力処理

`AppInput.vue`は編集中の値をローカルに保持します。

```text
keyup
  -> 標準4オクテット10進表記をipaddr.jsで検証
  -> 任意のプレフィックス長またはドットマスクを検証
  -> Netmaskを生成
  -> 失敗時は警告を表示
  -> 有効入力後1000ミリ秒待機
  -> selectIPBlock()でPiniaを更新
```

受け付ける代表形式は次のとおりです。

```text
192.0.2.1
192.0.2.1/24
192.0.2.1/255.255.255.0
```

`ipaddr.js`の一般的なparserは短縮・8進・16進表記も解釈できるため、アプリケーションは`IPv4.isValidFourPartDecimal()`で先に制限します。IPv6は受け付けません。

コンポーネントはPiniaストアを購読し、表やツリーからの選択を入力欄へ反映します。購読は`beforeUnmount()`で解除します。

## 7. IP計算の責務

### `src/js/ip-address.js`

`ipaddr.js`を直接各コンポーネントへ広げず、次の操作をアダプターへ集約します。

- 厳格なIPv4検証と解析
- 符号なし32ビット相当の整数値への変換
- ネットワーク順バイト配列への変換
- CIDRのネットワーク、ブロードキャスト、プレフィックス長、サイズの取得

### `IPAddressTable.vue`

`ipv4ToLong()`の結果をJavaScript標準の基数変換で2、8、10、16進表記へ変換します。

### `NetmaskTable.vue`

`Netmask`の`bitmask`、`mask`、`hostmask`、`base`、`first`、`last`、`broadcast`、`size`、`next()`を表示します。2進表記には`ipaddr.js`由来のバイト配列を使い、ネットワーク部とホスト部を分けます。

### 特殊用途アドレス

`special-addr-info-defs.js`の静的CIDR一覧に対し、選択ブロックが特殊範囲を含む場合と、特殊範囲が選択ブロックを含む場合の両方を調べます。

## 8. D3可視化

`IPBlockTree.vue`は、選択CIDRの親ブロックを求め、設定深度または`/32`まで各CIDRを2分割します。CIDR境界の取得には`ip-address.js`を使用します。

D3は次を担当します。

- `hierarchy()`によるツリー化
- `partition()`による配置
- CIDRをキーとした矩形・ラベルのdata join
- 不要になったSVGノードの`exit().remove()`
- ホバー、選択、クリック、トランジション

VueはコンポーネントライフサイクルとPinia状態を管理し、D3はコンポーネント内部のSVGノードを管理します。

## 9. スタイルとUI

- Element Plusは入力欄、折りたたみ、アイコンだけを個別importします。
- `@element-plus/icons-vue`のSVGアイコンを使用します。
- `src/css/info-table.css`が情報表をスタイリングします。
- `src/css/addr-tree.css`がD3ノードをスタイリングします。
- VueのトランジションはVue 3形式の`v-enter-from`などを使用します。

Element Plus全体をimportするとバンドルが大きくなるため、`src/main.js`の個別importを維持します。

## 10. テスト構成

Vitestをjsdom環境で実行します。

- `tests/ip-address.test.js`: IPv4検証、整数、バイト列、CIDR境界
- `tests/store.test.js`: Piniaによるアドレスとブロックの原子的更新
- `tests/app.test.js`: アプリ全体の初期描画、入力値、D3 SVG、特殊用途表示

変更時は次を実行します。

```sh
npm run lint
npm test
npm run build
```

依存関係を変更した場合は、さらに`npm audit`を実行します。

## 11. 制約と今後の課題

- 入力、データ、計算、表示はIPv4専用です。
- `Netmask`インスタンスを状態として保持するため、状態はシリアライズできません。
- D3が命令的にSVGを更新するため、Vueテンプレートだけでは描画を検証できません。
- 特殊用途アドレスとRFC情報は静的データで、定期的な更新が必要です。
- 現在のテストは主要ロジックと初期描画を対象とします。入力遅延、クリック移動、D3再描画の詳細な操作テストは今後拡充できます。
