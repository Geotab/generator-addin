# Generated-project dependency audit

Reviewed October 13, 2026 against a generated React + Zenith project.

The original generated project reported **18 findings (13 high, 5 moderate)**. The template changes reduce this to **4 high findings**. All four are the `braces` stack-exhaustion advisory (`GHSA-vfj7-8cjw-p6xm`) through:

```text
webpack-dev-server@6
└─ http-proxy-middleware
   └─ micromatch
      └─ braces
```

There is no patched `braces` release in the registry at review time; npm reports the advisory for all versions, including the latest `3.0.3`. `http-proxy-middleware` is part of webpack-dev-server and is required by its development-server functionality. Forcing a different `braces` version does not resolve the advisory. The remaining findings are confined to development dependencies; `npm audit --omit=dev` reported zero vulnerabilities for both plain and React + Zenith output.

Other original findings were removed by upgrading `copy-webpack-plugin` to 14 and `webpack-dev-server` to 6, and removing the unused `css` and `eslint-webpack-plugin` dependencies. The obsolete CSS sandbox loader and `npm-force-resolutions` preinstall script were removed as well.

Revisit the remaining advisory when upstream releases a patched `braces` or `http-proxy-middleware`. A full audit-clean result would otherwise require replacing webpack-dev-server's proxy dependency or the development server itself.
