# VKU StudyHub — Dynamic Risk Register

**Project:** VKU StudyHub Mobile (`VKU-STUDYHUB`)  
**Owners:** Nguyễn Quang Hoàng (PM), Tạ Kim Hương (BA), Đoàn Hữu Khánh (Backend/QA)  
**Review cadence:** Sprint review and at every material change  
**Scoring:** Probability and impact use Low/Medium/High. Priority is the combined judgement, with High × High requiring an active response.

## 1. Risk identification linked to user stories

| ID | Risk and trigger | Linked stories / pain points | Probability | Impact | Response | Owner | Status at Week 6 |
|---|---|---|:---:|:---:|---|---|---|
| R-01 | Camera permission or QR scanning fails across Android devices; users cannot complete the core share flow | US-19, US-20; P9, P14 | Medium | High | **Mitigate:** use Expo camera APIs, explain permission before requesting it, test at least three Android versions and keep manual document-open fallback | Phạm Nguyễn Phú Trọng | Open — test matrix pending |
| R-02 | Radar scope expands into GPS/maps and delays the core release | US-07–US-12; P4–P6 | Medium | High | **Avoid/Mitigate:** keep fixed VKU location options and course matching; defer GPS, chat and map rendering | Nguyễn Quang Hoàng | Controlled — fixed-location scope accepted |
| R-03 | Cloud free-tier, network instability or schema mismatch causes missing/duplicate documents or stale presence | TS-03, US-08, US-15–US-19, US-32 | Medium | High | **Mitigate/Transfer:** validate payloads, use stable IDs and retries, monitor service limits, maintain a local error state and documented recovery | Đoàn Hữu Khánh | Open — integration test scheduled |
| R-04 | Sprint 1 uncovers that real-time synchronization is more complex than expected | US-09, US-12, US-25–US-27 | Medium | High | **Mitigate:** deliver polling/refresh for Radar first; isolate timer synchronization behind a service interface and spike it before Sprint 2 | Nguyễn Thị Diễm Quỳnh | New after Sprint 1 — accepted for Sprint 2 spike |
| R-05 | APK/EAS build fails or is too slow on local development machines | TS-08; Charter Risk 1 | Medium | High | **Transfer/Mitigate:** use Expo EAS cloud build, pin dependencies and keep a known-good development build | Đoàn Hữu Khánh | Open — build pipeline evidence pending |
| R-06 | Location visibility exposes more information than users expect | US-13; P8 | Low | High | **Mitigate:** expose only a fixed location label, provide visibility controls and avoid GPS coordinates or background tracking | Tạ Kim Hương | Open — privacy copy pending |
| R-07 | Team member availability drops during a sprint | All epics; schedule constraint | Medium | Medium | **Mitigate:** cross-train ownership, keep issues small, require PR review and document setup steps | Nguyễn Quang Hoàng | Open — monitor capacity |
| R-08 | Scope change adds chat, video call or Apple release pressure | Out-of-scope boundaries; TS-04 | Medium | Medium | **Avoid:** record request as a change proposal; protect Android APK, Radar, QR and Pomodoro release scope | Nguyễn Quang Hoàng | Open — monitor stakeholder requests |

## 2. Dynamic update after Sprint 1

| ID | What changed after building | New probability | New impact | Updated response | Status at Week 11 |
|---|---|:---:|:---:|---|---|
| R-01 | Camera permission behavior differed between device versions during testing | High | High | Add a device matrix, permission education screen and manual fallback before UAT | **Materialized — mitigation in progress** |
| R-02 | Fixed locations kept Radar implementation within scope | Low | High | Keep fixed-location design; reject GPS/map expansion for this release | **Controlled — no delay** |
| R-03 | Retry path could repeat a document-save request when the network returned | Medium | High | Add idempotency key/client-generated document reference and test reconnect behavior | **Materialized — fix added and retest open** |
| R-04 | Timer synchronization required a shared server timestamp rather than independent local timers | High | High | Run a synchronization spike, use server time and show reconnect state | **Materialized — Sprint 2 priority** |
| R-05 | Cloud build succeeded after dependency pinning | Low | High | Keep the working EAS profile and repeat a clean-install check before release | **Closed — build reproducible** |
| R-06 | Testers requested nickname visibility instead of full names | Medium | High | Add nickname/default privacy setting and fixed-location-only display | **Scope change approved — implementation pending** |
| R-07 | BA availability reduced during UAT preparation | Medium | Medium | PM owns acceptance checklist; BA reviews asynchronously using the issue template | **Materialized — no schedule impact** |
| R-08 | No request to add chat/video call; out-of-scope boundary remains valid | Low | Medium | Continue to reject or defer the request to a future backlog | **Closed for current release** |

## 3. Review rules and escalation

- Any new risk must include an owner, linked user story, trigger and response before it is added to the board.
- A High impact risk is reviewed at every sprint review; a materialized risk becomes an issue with evidence and a target fix.
- A risk is closed only after the mitigation is tested on a real device or the related scope decision is approved.
- The register must retain the Week 6 and Week 11 snapshots so that change is visible for the audit evidence package.

