# Odds Polling Jobs

This directory contains background jobs for fetching and storing odds data.

## ⚠️ Analytics Only

**Important**: This is an analytics-only system. No real betting, wagering, deposits, or withdrawals are supported.

## Odds Polling Job

The `pollOdds.ts` script fetches odds from external providers and stores them in the database.

### Features

- ✅ **Provider Interface**: Pluggable odds providers (currently supports The Odds API)
- ✅ **Deduplication**: Only stores odds when they change or every 10 minutes
- ✅ **Rate Limiting**: Exponential backoff for API rate limits
- ✅ **Structured Logging**: JSON logs for easy parsing
- ✅ **Dry Run Mode**: Test without external API calls
- ✅ **Continuous Mode**: Run as a daemon with configurable intervals

### Usage

```bash
# Run once (dry run if no API key)
npm run poll-odds

# Run once with dry run flag
npm run poll-odds:dry

# Run continuously (every 60 seconds)
npm run poll-odds:loop
```

### Configuration

Set these environment variables in `.env`:

```env
# Required for live data
ODDS_API_KEY="your-api-key-here"

# Optional configuration
POLL_INTERVAL_SECONDS="60"        # How often to poll (default: 60)
DEDUPE_INTERVAL_MINUTES="10"      # Store at least every N minutes (default: 10)
DEBUG="true"                       # Enable verbose logging
```

### How It Works

1. **Fetch Games**: Queries database for upcoming/live games in next 24 hours
2. **Fetch Odds**: Calls external API to get latest odds for those games
3. **Normalize**: Standardizes bookmaker names and market types
4. **Deduplicate**: Only stores if odds changed or 10+ minutes since last store
5. **Store**: Writes `OddsSnapshot` records to database
6. **Log**: Outputs structured JSON logs with stats

### Deduplication Logic

Odds are only stored when:
- **Odds have changed**: Any price or line movement detected
- **Time threshold**: At least 10 minutes since last snapshot (configurable)

This prevents database bloat while capturing all meaningful odds movements.

### Rate Limiting

The job handles rate limits automatically:
- Exponential backoff (2^attempt seconds)
- Configurable max retries (default: 3)
- Respects API rate limit headers
- Logs remaining quota

### Logging

All logs are structured JSON for easy parsing:

```json
{
  "level": "info",
  "timestamp": "2024-12-23T10:30:00.000Z",
  "message": "Poll completed",
  "duration": "2341ms",
  "stats": {
    "gamesProcessed": 10,
    "oddsSnapshotsStored": 45,
    "oddsDeduplicated": 23,
    "errors": 0
  }
}
```

### Production Deployment

#### Option 1: Cron Job

Add to crontab to run every minute:

```bash
* * * * * cd /path/to/Sports_AI && npm run poll-odds >> /var/log/poll-odds.log 2>&1
```

#### Option 2: Systemd Service

Create `/etc/systemd/system/poll-odds.service`:

```ini
[Unit]
Description=Sports AI Odds Polling
After=network.target

[Service]
Type=simple
User=your-user
WorkingDirectory=/path/to/Sports_AI
ExecStart=/usr/bin/npm run poll-odds:loop
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
sudo systemctl enable poll-odds
sudo systemctl start poll-odds
sudo systemctl status poll-odds
```

#### Option 3: Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
CMD ["npm", "run", "poll-odds:loop"]
```

### Monitoring

Monitor the job with:

```bash
# View logs
tail -f /var/log/poll-odds.log | jq .

# Check stats
tail -100 /var/log/poll-odds.log | jq 'select(.message == "Poll completed") | .stats'

# Check errors
tail -1000 /var/log/poll-odds.log | jq 'select(.level == "error")'
```

### Troubleshooting

**No odds being stored:**
- Check `ODDS_API_KEY` is set correctly
- Verify games exist in database with `externalId` set
- Check API quota: `tail -f logs | jq 'select(.rateLimit)'`

**Database connection errors:**
- Verify `DATABASE_URL` in `.env`
- Check database is running and accessible
- Ensure migrations are applied: `npm run db:migrate`

**Rate limit errors:**
- The Odds API free tier has limits (500 requests/month)
- Reduce `POLL_INTERVAL_SECONDS` or poll fewer leagues
- Consider upgrading API plan

### API Provider

Currently using [The Odds API](https://the-odds-api.com/):
- Free tier: 500 requests/month
- Covers: NFL, NBA, MLB, NHL, NCAAF, NCAAB
- Live and pre-game odds
- Multiple bookmakers

Get your free API key at: https://the-odds-api.com/

### Adding New Providers

To add a new odds provider:

1. Implement the `OddsProvider` interface in `lib/odds/providers/`
2. Update `jobs/pollOdds.ts` to use your provider
3. Add configuration to `.env.example`

Example:

```typescript
import { OddsProvider } from "../provider";

export class MyProvider implements OddsProvider {
  async getEvents(league, dateRange) {
    // Implementation
  }

  async getOdds(eventIds, markets, isLive) {
    // Implementation
  }

  async healthCheck() {
    // Implementation
  }

  getName() {
    return "My Provider";
  }
}
```

