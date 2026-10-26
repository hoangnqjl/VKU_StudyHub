# VKU StudyHub — Burndown, Burnup & EVM Practice

**Purpose:** A project-specific practice baseline for interpreting progress before replacing it with the actual GitHub Projects export. Values are illustrative and must be replaced by real board data at the end of each sprint.

## 1. Sprint 1 sample data

Sprint 1 commits 57 story points from `3_Planning_Poker_Estimation.md`. Assume a 10-day sprint and a straight-line plan.

| Day | 0 | 2 | 4 | 6 | 8 | 10 |
|---|---:|---:|---:|---:|---:|---:|
| Planned remaining | 57 | 46 | 34 | 23 | 11 | 0 |
| Actual remaining | 57 | 50 | 41 | 33 | 22 | 8 |
| Completed | 0 | 7 | 16 | 24 | 35 | 49 |

### Interpretation

The team is behind plan from Day 2 onward: 8 points remain on Day 10 instead of zero. The response is to inspect unfinished work and quality blockers, not to silently move incomplete stories into Done. At Day 8, the stand-up message should be: “We completed 35 points but have 20 remaining against 11 planned; finish the QR and Radar acceptance paths, remove blockers, and negotiate scope before adding work.”

## 2. Burnup reveals scope change

The following example shows why a burndown alone can hide scope expansion.

| Day | 0 | 2 | 4 | 6 | 8 | 10 |
|---|---:|---:|---:|---:|---:|---:|
| Completed | 0 | 8 | 16 | 24 | 32 | 40 |
| Total scope | 40 | 40 | 40 | 55 | 55 | 55 |
| Remaining | 40 | 32 | 24 | 31 | 23 | 15 |

At Day 6, a burndown-equivalent view shows remaining work rising from 24 to 31 and could be misread as a productivity collapse. Burnup shows the actual cause: the scope increased from 40 to 55 points. The additional five stories must be recorded as an approved change, not treated as unplanned team failure.

## 3. EVM calculation

Use the Sprint 1 plan at Day 4: 33 points were planned to be complete, but 16 points are complete. For effort-based cost, assume 3.5 person-days were planned and 5 person-days were actually spent.

| Metric | Formula | Result | Meaning |
|---|---|---:|---|
| Planned Value (PV) | Planned completed points | 33 points | Baseline work by Day 4 |
| Earned Value (EV) | Accepted completed points | 16 points | Value actually delivered |
| Schedule Variance (SV) | EV − PV | **−17 points** | Behind schedule |
| Actual Cost (AC) | Recorded effort | 5 person-days | Effort spent |
| Cost variance (effort proxy) | EV / planned points-per-person-day − AC | **−0.24 person-days** | Slightly more effort than earned value supports |

For a normalized index, the schedule performance index is `SPI = EV / PV = 16 / 33 = 0.48`. The team has earned less than half of the planned value by Day 4. Negative SV together with negative cost variance is worse than negative SV alone because the team is both late and spending more effort than the value delivered. The corrective action is to remove blockers and reduce or defer low-priority scope, not to count partially tested work as complete.

## 4. Data replacement checklist

- Export completed, remaining and total story points from GitHub Projects for each sprint.
- Use only accepted issues for Earned Value; exclude work that is merely coded but not reviewed/tested.
- Record scope changes with the change ID, approval and date so burnup movement is explainable.
- Record person-days or another agreed cost proxy consistently; do not compare effort logged by different rules.
- Attach the export, chart screenshot, calculation sheet and corrective action to the Week 12 evidence package.
