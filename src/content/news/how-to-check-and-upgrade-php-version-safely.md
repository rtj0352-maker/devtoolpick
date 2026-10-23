---
title: "How to Check and Upgrade Your PHP Version Safely (2026)"
description: "Find which PHP version your server actually runs, apply the Oct 2026 security releases (8.5.12, 8.4.27, 8.3.36, 8.2.35), restart workers, and plan a move off EOL branches."
pubDate: 2026-10-22
tags: ["PHP", "security", "how-to", "upgrade"]
heroLabel: "Guide"
verdict: "Check the version your web server actually runs, not just the CLI. Move to the latest patch in your branch (8.5.12, 8.4.27, 8.3.36 or 8.2.35 as of Oct 21, 2026 JST), restart every PHP worker, then confirm again. If you're on 8.1 or older, use a vendor backport now and plan a branch upgrade."
faq:
  - q: "Why does php -v show a different version than my website?"
    a: "The command-line PHP and the PHP behind your web server (PHP-FPM, mod_php) can be separate installs. Check the web-facing one through your control panel or a temporary, access-restricted check, and remove that check afterward."
  - q: "Do I need to restart after updating PHP?"
    a: "Yes. Running PHP-FPM, Apache or FrankenPHP workers keep the old code in memory until they restart."
  - q: "My distro shows an older version number. Am I patched?"
    a: "Possibly. Distributions often backport fixes without changing the upstream version. Check your distro's security tracker for CVE-2026-109618 and CVE-2026-109619."
---

PHP's October 21, 2026 (JST) security releases fix two critical pre-auth RCE vulnerabilities (see [the facts](/devtoolpick/news/php2shell-cve-2026-109618-109619-facts/)). Here's how to confirm what you run and update without breaking things.

> Version numbers come from [php.net](https://www.php.net/archive/2026.php) and the [supported versions page](https://www.php.net/supported-versions.php), checked on **October 22, 2026 (JST)**.

## 1. Find the version you actually run

- **CLI:** run `php -v`. This may *not* be the PHP your website uses.
- **PHP-FPM:** run `php-fpm -v`, or the versioned binary such as `php-fpm8.3 -v`, and check which pools are running.
- **Shared hosting:** look at the control panel's PHP selector. Many hosts let you pick a version per site.
- **Containers:** check the image tag (for example `php:8.3-fpm`) and rebuild from a fresh base image.
- If you add a temporary `phpinfo()` page to check, protect it and **delete it right away**, because it reveals configuration details.

## 2. Target versions (as of Oct 21, 2026 JST)

| Branch | Patched release | Status |
| --- | --- | --- |
| 8.5 | **8.5.12** | Active support until Dec 31, 2027 |
| 8.4 | **8.4.27** | Active support until Dec 31, 2026 |
| 8.3 | **8.3.36** | Security fixes only, until Dec 31, 2027 |
| 8.2 | **8.2.35** | Security fixes only, **EOL Dec 31, 2026** |
| 8.1 and older | none (EOL) | Vendor backports, or upgrade the branch |

## 3. Update

- **Debian/Ubuntu, RHEL/Alma/Rocky:** install your distribution's security updates and check its tracker for the two CVEs. Distros received the patches in advance, according to PHP.
- **remirepo users:** PHP warned that `rpms.remirepo.net` would not have updates on release day, and urged users to switch to distro packages or build from source.
- **Docker:** pull or rebuild on the new patch tag and redeploy.
- **Managed hosting / PaaS:** check your provider's status page. Many patch the runtime for you, but some need you to switch versions.

## 4. Restart and verify

Restart PHP-FPM, Apache or FrankenPHP so that **every worker** runs the new binary. Then run step 1 again for the web-facing PHP.

## 5. Plan off EOL branches

Moving across branches (for example 7.4 to 8.3) can break code. Test it in staging: check your framework and CMS support matrix, update Composer dependencies, and run your test suite. Until then, a vendor-backported build is the stopgap. PHP also published minimal source backports for 7.4, 8.0 and 8.1 for people building from source.

## Related

- [PHP2Shell facts vs rumor](/devtoolpick/news/php2shell-cve-2026-109618-109619-facts/)
- [PHP supported versions and EOL dates in 2026](/devtoolpick/news/php-supported-versions-eol-2026/)
