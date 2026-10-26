# VKU StudyHub — Planning Poker \& Sprint Plan

**Project:** VKU StudyHub Mobile (`VKU-STUDYHUB`)  
**Team:** Nhóm 05 — StudyHub  
**Estimation scale:** Modified Fibonacci — 1, 2, 3, 5, 8, 13  
**Basis:** User stories in `0\_Painpoints and UserStory.docx`, WBS v1.0 and the current React Native/Expo implementation.

## 1\. Estimation assumptions

* One story point represents relative effort, complexity, integration work and testing; it is not a number of hours.
* The team has five members and works in two-week sprints.
* Stories are estimated after splitting technical work from user-facing work. A 13-point story must be split before sprint commitment.
* A story is complete only when its acceptance behavior works on a real Android device, TypeScript checks pass and the related PR is reviewed.
* The estimates below are a planning baseline; the team must record the final consensus and actual result after each sprint.

## 2\. Planning Poker results

|ID|User story / technical story|Priority|Points|Sprint|Dependencies / acceptance focus|
|-|-|:-:|:-:|:-:|-|
|TS-01|Expo + TypeScript scaffold and project structure|High|3|1|Build starts; agreed module structure|
|TS-02|CI, branch protection, PR and Conventional Commit rules|High|3|1|`tsc` and lint run on PR|
|TS-03|Cloud database, Auth and Storage configuration|High|5|1|Secrets stay in environment configuration|
|US-01|Register with email|High|3|1|Validation and useful error states|
|US-03|Login, logout and persistent session|High|3|1|Session survives app restart|
|US-04|Select current courses|High|3|1|Course data feeds Radar and documents|
|US-07|Turn study status on with course and location|High|5|1|Maximum three taps; fixed VKU locations|
|US-08|Turn status off and auto-expire it|High|3|1|No stale “online” status|
|US-09|View students studying the same course|High|5|1|Results show course and safe location label|
|US-11|Send table-join request|High|3|1|Request can be sent once and is visible|
|US-12|Accept or reject table-join request|High|3|1|Both parties receive the resulting state|
|US-15|Upload and classify a document|High|5|1|File is linked to a course|
|US-16|Browse documents by course|High|3|1|Empty/loading/error states included|
|US-17|Generate a document QR code|High|3|1|QR identifies the current document version|
|US-19|Scan QR and save document|High|5|1|Camera permission, success and failure paths|
|US-20|Explain camera permission and recovery|High|2|1|User is not stuck after denying permission|
|US-21|View document in app|Medium|3|2|Preview works without another app|
|US-22|Disable QR or replace document version|Medium|3|2|Old QR cannot expose disabled content|
|US-23|Create Pomodoro room|High|3|2|Room has join code|
|US-24|Join room by code or QR|High|3|2|Invalid/expired code handled|
|US-25|Synchronize countdown|High|8|2|Members remain within acceptable drift|
|US-26|Start, pause and end a session|High|5|2|Host-only controls enforced|
|US-27|Show active participants|High|3|2|Focus/break state is visible|
|US-30|Fast startup and smooth response|High|5|2|Startup under 3s; response under 1.5s in normal test conditions|
|US-31|Responsive Vietnamese UI|High|5|2|Small and large Android screens checked|
|US-32|Offline/error notice and retry|Medium|5|2|Retry does not duplicate writes|
|US-33|Keep secrets out of client code|High|3|2|No service key in bundle or repository|
|TS-07|Integration, security and camera permission testing|High|5|2|Regression evidence recorded|
|TS-08|Android APK build and device installation|High|3|2|APK installs on a real device|

**Baseline total:** 105 points. The baseline is a product backlog estimate, not a promise that all items fit into two sprints. Sprint 1 commits to the foundation plus the Radar/QR vertical slice; Sprint 2 commits to Pomodoro, hardening and release evidence.

## 3\. Sprint commitment

### Sprint 1 — Radar and QR vertical slice

Commit: `TS-01`, `TS-02`, `TS-03`, `US-01`, `US-03`, `US-04`, `US-07`, `US-08`, `US-09`, `US-11`, `US-12`, `US-15`, `US-16`, `US-17`, `US-19`, `US-20` (**57 points**).

The sprint goal is to let a student sign in, select a course, appear at a VKU location, find a peer, request a study table and scan a document QR into the personal library.

### Sprint 2 — Group focus and release quality

Commit: `US-21`, `US-22`, `US-23`, `US-24`, `US-25`, `US-26`, `US-27`, `US-30`, `US-31`, `US-32`, `US-33`, `TS-07`, `TS-08` (**48 points**).

The sprint goal is to provide a synchronized study room and produce a reliable APK with evidence for performance, security and UAT.

## 4\. Estimation review record

|Review point|Decision|Evidence to attach|
|-|-|-|
|Before Sprint 1|Use 5-point cap for first vertical slice; split larger work|Planning Poker notes and board snapshot|
|Sprint 1 review|Re-estimate stories affected by camera permissions, storage or API behavior|Closed issues, PR links and retrospective|
|Sprint 2 planning|Replace estimates with team consensus after velocity is known|Completed points and remaining backlog|



