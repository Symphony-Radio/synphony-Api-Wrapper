# symphony-radio-api

A fast, dependency-free TypeScript API wrapper for **Symphony Radio**.

It wraps these endpoints:

- `GET /api/stats`
- `GET /api/upcoming`
- `GET /api/recentlyplayed`

Default base URL: `https://panel.symphradio.live/api`

## Install

```bash
npm i symphony-radio-api
```

## Quick start

```ts
import { SymphonyRadioClient } from "symphony-radio-api";

const client = new SymphonyRadioClient();

const stats = await client.getStats();
console.log(stats.song?.artist, "-", stats.song?.track);
console.log("Listeners:", stats.listeners?.current);

const upcoming = await client.getUpcoming();
console.log("Now:", upcoming.now.presenter?.name);
console.log("Next:", upcoming.next.presenter?.name, "in", upcoming.next.timeUntil);

const recent = await client.getRecentlyPlayed({ limit: 10 });
console.log("Recently played:", recent.recentlyPlayed?.[0]?.artist);
```

## Configuration

```ts
const client = new SymphonyRadioClient({
  baseUrl: "https://panel.symphradio.live/api",
  timeoutMs: 8000,
  retries: 2,
  headers: {
    "User-Agent": "my-app/1.0.0"
  }
});
```

### Options

- `baseUrl` *(string)*: API base (default: `https://panel.symphradio.live/api`)
- `timeoutMs` *(number)*: request timeout in ms (default: `10000`)
- `retries` *(number)*: retry count for transient failures (default: `1`)
- `headers` *(Record<string,string>)*: extra headers merged onto each request

## Errors

All errors extend `SymphonyRadioError`.

```ts
import { HttpError, TimeoutError } from "symphony-radio-api";

try {
  await client.getStats();
} catch (err) {
  if (err instanceof TimeoutError) {
    console.error("Timed out");
  } else if (err instanceof HttpError) {
    console.error("HTTP", err.status, err.bodyText);
  } else {
    console.error(err);
  }
}
```

## Notes

- Uses `fetch` (Node 18+ or browsers).
- Performs safe URL joining, JSON parsing, timeout via `AbortController`, and minimal retries.
- Response types are intentionally tolerant (lots of optional fields) so minor backend changes don't instantly break consumers.

## Development

```bash
npm i
npm run build
npm test
```

## License

MIT
