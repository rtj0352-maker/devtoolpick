---
title: "PHP重大RCE脆弱性（PHP2Shell）の事実とデマ【2026年10月】"
description: "2026年10月21日（JST）に修正されたPHPの認証不要RCE（CVE-2026-109618／109619）。公式情報で確認できる事実と、拡散された主張の真偽を整理します。"
pubDate: 2026-10-22
updatedDate: 2026-10-23
tags: ["PHP", "セキュリティ", "ニュース", "脆弱性"]
heroLabel: "セキュリティニュース"
verdict: "脆弱性は実在し、深刻度はCritical（CVSS v4.0 9.2）です。2026年10月21日22時30分頃（JST）に修正版が公開されました。PHP 8.5.12／8.4.27／8.3.36／8.2.35へ更新し、PHPのワーカーをすべて再起動してください。Cloudflareは公開前に情報が漏れ、攻撃通信を観測したと報告しています。一方、「59%」という数字の出典は確認できませんでした。"
faq:
  - q: "どのバージョンで修正されましたか？"
    a: "PHP 8.5.12、8.4.27、8.3.36、8.2.35です。各ブランチでこれより前のバージョンはすべて影響を受けます。"
  - q: "PHP 8.1以前に修正はありますか？"
    a: "公式リリースはありません（サポート終了）。ただしPHPセキュリティチームが7.4／8.0／8.1向けの最小限のソースバックポートを公開しており、ディストリビューションやLTSベンダーが修正を提供している場合もあります。"
  - q: "設定変更による回避策はありますか？"
    a: "公式の緩和策は一部の攻撃経路を減らすだけで、安全になるわけではないとPHPは明言しています。根本的な対策はアップデートのみです。"
---

2026年10月21日、PHPは認証不要でリモートコード実行（RCE）が可能になる重大な脆弱性2件を修正する緊急リリースを公開しました。リリース前にXで拡散された投稿（42万回以上表示）について、一次情報と照らし合わせて真偽を確認します。時刻はすべて**日本時間（JST）**です。

> 2026年10月22日2時10分（JST）までに確認した情報源：[Wiz](https://www.wiz.io/blog/php2shell-php-rce)、[Cloudflare](https://blog.cloudflare.com/php-vulnerabilities-waf-protection/)、[IPA](https://www.ipa.go.jp/security/security-alert/2026/pre-alert20261021.html)、[php.net](https://www.php.net/archive/2026.php)、[GHSA-w8hw-w9fx-j79w](https://github.com/php/php-src/security/advisories/GHSA-w8hw-w9fx-j79w)、[GHSA-6wmf-4rv5-p3rp](https://github.com/php/php-src/security/advisories/GHSA-6wmf-4rv5-p3rp)、[NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-109618)、[CERT-EU](https://cert.europa.eu/publications/security-advisories/2026-018/)、[W3Techs](https://w3techs.com/technologies/details/pl-php)。攻撃手法の詳細は掲載しません。

## 追記：10月23日12時（JST）

- **パッチ公開前から攻撃が始まっていた**：[Amazon](https://aws.amazon.com/blogs/security/amazon-threat-intelligence-identifies-php2shell-exploitation-prior-to-public-disclosure-in-madpot/)は、公開4日前の10月17日にハニーポットへの攻撃の試みを観測したと発表。公開後は広範な攻撃の試みが続いているとしています。
- **攻撃成功の確認はまだない**：[Sophos](https://www.sophos.com/en-us/blog/proof-of-concept-exploit-released-for-php-vulnerabilities-109618-109619)は「攻撃成功1件」という先の報告を撤回し、観測されたのはスキャンと失敗した試みのみだと訂正しました。[InstaWP](https://instawp.com/php2shell-exploitation-attempts/)とDataminrも、成功例はないと報告しています。
- **NVDのスコア**：NVD独自のCVSS v3.1評価は、CVE-2026-109618が9.8、CVE-2026-109619が8.1です（PHP側の評価CVSS v4.0 9.2は変わらず）。
- **CISA KEV**：10月23日時点で、どちらのCVEも未登録です。
- **PHP公式**：10月21日以降、新たなリリースはありません。

## 時系列（JST）

- **10月21日 5時32分頃**：php.netがセキュリティリリースを予告（23時予定、CVSS 9.2）。IPAも事前準備を呼びかける
- **10月21日 12時02分**：CloudflareがWAFによる防御を全プランで既定で有効化
- **10月21日 17時07分**：「流出」を主張するX投稿が拡散
- **10月21日 22時30分頃**：修正版を公開。同時にWizが研究内容を公表し、Hacker Newsでトップ記事になる
- **10月21日 23時17分**：NVDがCVE-2026-109618を公開
- **10月22日時点**：PHP公式による悪用の確認なし。CISA KEVへの登録もなし（SecurityOnline）

## 2件の脆弱性

| CVE | 内容（PHP公式の説明） | 深刻度 |
| --- | --- | --- |
| [CVE-2026-109618](https://nvd.nist.gov/vuln/detail/CVE-2026-109618) | メモリ不足（OOM）処理時のメモリ破損によるRCE | CVSS v4.0 9.2 |
| [CVE-2026-109619](https://nvd.nist.gov/vuln/detail/CVE-2026-109619) | 解放済みのグローバル状態が残ることによるRCE | CVSS v4.0 9.2 |

Webリクエストを処理するすべての構成（PHP-FPM、Apache mod_php、php-cgi、FrankenPHP、LiteSpeed）が対象です。PHPは**mod_phpのリスクが最も高い**としています。

## 拡散された主張の検証

| 主張 | 判定 | 根拠 |
| --- | --- | --- |
| 認証不要のRCEが2件 | **事実** | 公式アドバイザリの記載どおり |
| 「1リクエストでシェル」 | **一部事実** | mod_phpで1回の未認証リクエストによる攻撃が実証済みと公式が記載。ただし攻撃の複雑さは「高（AC:H）」と評価されている |
| 「今夜22時にパッチ」 | **おおむね正しい** | 予定は23時、実際の公開は22時30分頃（CERT-EU） |
| 脆弱性が「流出」した | **Cloudflareが報告** | 発見と開示はWiz Researchによる協調的開示。ただしCloudflareは、正式公開前に情報が漏れ、顧客への攻撃通信を観測したと報告している。CERT-EUもPoCが出回り始めたと報告 |
| 「PHP2Shell」ツールの流出 | **未確認** | php2shellはWizが作成した実証用エクスプロイトの名称。それが流出したことを示す一次情報は見つからなかった |
| 8.1未満にパッチなし | **ほぼ事実** | 8.1以前の公式リリースはない（EOL）。7.4／8.0／8.1向けの最小限のソースバックポートは公開されている |
| 公開ホストの59%が旧版 | **未確認** | 出典は見つからなかった。W3Techsのデータでは、サポート切れ（8.1以前）のサイトは約48〜49% |

## 今すぐやること

1. PHP **8.5.12／8.4.27／8.3.36／8.2.35**、またはディストリビューションの修正版パッケージへ更新する
2. PHP-FPMやApacheなど、PHPのワーカーを**すべて再起動**する
3. Webサーバーが実際に使っているPHPのバージョンを確認する（`php -v`で表示されるCLI版とは別の場合があります）
4. 8.1以前を使っている場合は、ベンダーのバックポートを当てたうえで、サポート中のブランチへ移行する計画を立てる

詳しい手順：[PHPバージョンの確認とアップデート手順](/devtoolpick/ja/news/php-version-check-upgrade-2026/)／[PHPのサポート期限一覧](/devtoolpick/news/php-supported-versions-eol-2026/)
