---
title: "PHP重大RCE脆弱性（PHP2Shell）の事実とデマ【2026年10月】"
description: "2026年10月21日（JST）に修正されたPHPの認証不要RCE（CVE-2026-109618／109619）。公式情報で確認できる事実と、拡散された主張の真偽を整理します。"
pubDate: 2026-10-22
tags: ["PHP", "セキュリティ", "ニュース", "脆弱性"]
heroLabel: "セキュリティニュース"
verdict: "脆弱性は実在し、深刻度はCritical（CVSS v4.0 9.2）です。2026年10月21日22時30分頃（JST）に修正版が公開されました。PHP 8.5.12／8.4.27／8.3.36／8.2.35へ更新し、PHPのワーカーをすべて再起動してください。なお「流出」「59%」といった主張は、一次情報では確認できません。"
faq:
  - q: "どのバージョンで修正されましたか？"
    a: "PHP 8.5.12、8.4.27、8.3.36、8.2.35です。各ブランチでこれより前のバージョンはすべて影響を受けます。"
  - q: "PHP 8.1以前に修正はありますか？"
    a: "公式リリースはありません（サポート終了）。ただしPHPセキュリティチームが7.4／8.0／8.1向けの最小限のソースバックポートを公開しており、ディストリビューションやLTSベンダーが修正を提供している場合もあります。"
  - q: "設定変更による回避策はありますか？"
    a: "公式の緩和策は一部の攻撃経路を減らすだけで、安全になるわけではないとPHPは明言しています。根本的な対策はアップデートのみです。"
---

2026年10月21日、PHPは認証不要でリモートコード実行（RCE）が可能になる重大な脆弱性2件を修正する緊急リリースを公開しました。リリース前にXで拡散された投稿（42万回以上表示）について、一次情報と照らし合わせて真偽を確認します。時刻はすべて**日本時間（JST）**です。

> 2026年10月22日（JST）に確認した情報源：[php.net](https://www.php.net/archive/2026.php)、[GHSA-w8hw-w9fx-j79w](https://github.com/php/php-src/security/advisories/GHSA-w8hw-w9fx-j79w)、[GHSA-6wmf-4rv5-p3rp](https://github.com/php/php-src/security/advisories/GHSA-6wmf-4rv5-p3rp)、[NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-109618)、[CERT-EU](https://cert.europa.eu/publications/security-advisories/2026-018/)、[W3Techs](https://w3techs.com/technologies/details/pl-php)。攻撃手法の詳細は掲載しません。

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
| 脆弱性が「流出」した | **根拠なし** | Googleの記事によるとWiz Researchによる協調的開示。公開後、CERT-EUはPoCが出回り始めたと報告している |
| 「PHP2Shell」ツールの流出 | **誤解を招く** | PHP2Shellは脆弱性2件の通称。流出ツールを示す一次情報は見つからなかった |
| 8.1未満にパッチなし | **ほぼ事実** | 8.1以前の公式リリースはない（EOL）。7.4／8.0／8.1向けの最小限のソースバックポートは公開されている |
| 公開ホストの59%が旧版 | **未確認** | 出典は見つからなかった。W3Techsのデータでは、サポート切れ（8.1以前）のサイトは約48〜49% |

## 今すぐやること

1. PHP **8.5.12／8.4.27／8.3.36／8.2.35**、またはディストリビューションの修正版パッケージへ更新する
2. PHP-FPMやApacheなど、PHPのワーカーを**すべて再起動**する
3. Webサーバーが実際に使っているPHPのバージョンを確認する（`php -v`で表示されるCLI版とは別の場合があります）
4. 8.1以前を使っている場合は、ベンダーのバックポートを当てたうえで、サポート中のブランチへ移行する計画を立てる

英語版の詳しい手順：[How to check and upgrade your PHP version safely](/devtoolpick/reviews/how-to-check-and-upgrade-php-version-safely/)／[PHPのサポート期限一覧](/devtoolpick/reviews/php-supported-versions-eol-2026/)
