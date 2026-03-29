<!-- VERCEL BEST PRACTICES START -->
## Best practices for developing on Vercel

These defaults are optimized for AI coding agents (and humans) working on apps that deploy to Vercel.

- Treat Vercel Functions as stateless + ephemeral (no durable RAM/FS, no background daemons), use Blob or marketplace integrations for preserving state
- Edge Functions (standalone) are deprecated; prefer Vercel Functions
- Don't start new projects on Vercel KV/Postgres (both discontinued); use Marketplace Redis/Postgres instead
- Store secrets in Vercel Env Variables; not in git or `NEXT_PUBLIC_*`
- Provision Marketplace native integrations with `vercel integration add` (CI/agent-friendly)
- Sync env + project settings with `vercel env pull` / `vercel pull` when you need local/offline parity
- Use `waitUntil` for post-response work; avoid the deprecated Function `context` parameter
- Set Function regions near your primary data source; avoid cross-region DB/service roundtrips
- Tune Fluid Compute knobs (e.g., `maxDuration`, memory/CPU) for long I/O-heavy calls (LLMs, APIs)
- Use Runtime Cache for fast **regional** caching + tag invalidation (don't treat it as global KV)
- Use Cron Jobs for schedules; cron runs in UTC and triggers your production URL via HTTP GET
- Use Vercel Blob for uploads/media; Use Edge Config for small, globally-read config
- If Enable Deployment Protection is enabled, use a bypass secret to directly access them
- Add OpenTelemetry via `@vercel/otel` on Node; don't expect OTEL support on the Edge runtime
- Enable Web Analytics + Speed Insights early
- Use AI Gateway for model routing, set AI_GATEWAY_API_KEY, using a model string (e.g. 'anthropic/claude-sonnet-4.6'), Gateway is already default in AI SDK
  needed. Always curl https://ai-gateway.vercel.sh/v1/models first; never trust model IDs from memory
- For durable agent loops or untrusted code: use Workflow (pause/resume/state) + Sandbox; use Vercel MCP for secure infra access
<!-- VERCEL BEST PRACTICES END -->

## Internationalization (i18n)
- ALWAYS implement texts and features in three languages: English (en), Azerbaijani (az), and French (fr). Any new keys added to `en.json` MUST also be added to `az.json` and `fr.json`.

## Data Integrity Rules
- **No hardcoded data**: All dates, CO₂ values, region statistics, and infrastructure metadata MUST be fetched from their respective source files — never hardcoded inline in components.
- **Single source of truth for regions**: Use `azerbaijan_economic_regions_main.geojson` (imported as `src/data/economicRegions.json`) for ALL economic region data across the app (Map, Analytics, Dashboard).
- **Single source of truth for infrastructure**: Use `azerbaijan_energy_sites.geojson` (imported as `src/data/energySites.json`) for ALL infrastructure data.
- **Prediction engine as central data source**: All emissions projections (2023–2030) MUST use `src/utils/predictionEngine.ts` — no separate inline data arrays.
