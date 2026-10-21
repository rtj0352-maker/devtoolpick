---
title: "PHP Supported Versions and EOL Dates in 2026"
description: "Which PHP branches still get fixes in October 2026: 8.5 and 8.4 in active support, 8.3 and 8.2 security-only (8.2 ends Dec 31, 2026), 8.1 and older end-of-life. Dates from php.net."
pubDate: 2026-10-22
tags: ["PHP", "EOL", "security", "news"]
heroLabel: "Explainer"
verdict: "As of Oct 22, 2026 (JST), PHP 8.2–8.5 get security fixes. PHP 8.2 stops on Dec 31, 2026, and 8.1 and older already get none. New projects should use 8.4 or 8.5. PHP 8.6 is still a release candidate."
faq:
  - q: "Is PHP 8.1 still supported?"
    a: "No. PHP 8.1 is past its security-support end date on php.net's supported versions page. For the Oct 2026 critical bugs, PHP offered only minimal source backports for 7.4, 8.0 and 8.1, and no official releases."
  - q: "When does PHP 8.2 reach end of life?"
    a: "December 31, 2026, per php.net. It gets no security fixes after that."
  - q: "Should I use PHP 8.6?"
    a: "Not in production yet. As of Oct 8, 2026, PHP 8.6.0 was at RC3, with RC4 planned for Oct 22, 2026."
---

The PHP project supports each branch for about four years: two years of active support, then two of security-only fixes. Here's where things stand. The dates come from [php.net/supported-versions](https://www.php.net/supported-versions.php), checked on **October 22, 2026 (JST)**.

| Branch | Released | Active support until | Security fixes until | Status (Oct 2026) |
| --- | --- | --- | --- | --- |
| 8.5 | Nov 20, 2025 | Dec 31, 2027 | Dec 31, 2029 | Active |
| 8.4 | Nov 21, 2024 | Dec 31, 2026 | Dec 31, 2028 | Active |
| 8.3 | Nov 23, 2023 | Dec 31, 2025 | Dec 31, 2027 | Security only |
| 8.2 | Dec 8, 2022 | Dec 31, 2024 | **Dec 31, 2026** | Security only, ending soon |
| 8.1 and older | n/a | ended | ended | **EOL** |

## Why it matters right now

The [October 21, 2026 critical RCE fixes](/devtoolpick/reviews/php2shell-cve-2026-109618-109619-facts/) shipped only for 8.2–8.5. That's the normal EOL policy at work. The security team made an exception by publishing minimal source backports for 7.4, 8.0 and 8.1, but there were no official releases for those branches.

## How many sites are behind?

According to [W3Techs](https://w3techs.com/technologies/details/pl-php) (Oct 21, 2026), PHP 7 accounts for 27.0% and PHP 5 for 7.7% of sites with a detectable PHP version. Within PHP 8, 8.1 accounts for 15.2% and 8.0 for 5.8%. Together, roughly half of these sites run an EOL branch. Distribution backports can't be seen in these figures.

## What to pick

- **New projects:** 8.4 or 8.5, if your framework supports it.
- **On 8.2:** plan the move before **Dec 31, 2026**.
- **On 8.1 or older:** use a vendor LTS or distro backport now, and upgrade. See [how to upgrade safely](/devtoolpick/reviews/how-to-check-and-upgrade-php-version-safely/).
