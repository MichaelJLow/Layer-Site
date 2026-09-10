# Layer site section-by-section content refresh plan

## Outcome

Evolve the existing Layer homepage in the `layer-site-content-refresh` branch so its messaging reflects the approved LayerOS service model and reliability principles, while preserving the current visual system and giving Michael a review gate after each bounded section.

This is a content-led refresh, not a full visual redesign.

## Context and evidence

- The repository is an Astro site. Homepage structure and copy are primarily in `src/pages/index.astro`; supporting homepage content lives in `src/config/site.ts`.
- The current homepage already has the required structural anchors: operating model, example systems, `From friction to flow`, FAQ, and contact CTA.
- The current four process headings are `Understand`, `Build`, `Extend`, and `Improve`.
- The current FAQ is an accordion rendered from a local `faqs` array in `src/pages/index.astro`, with FAQ JSON-LD generated from the same data.
- The current branch is clean and named `layer-site-content-refresh`.
- LayerOS evidence establishes the public service language: No-cost AI Opportunity Session, Paid AI Workflow Assessment, AI Workflow Implementation, AI Knowledge Foundation, and selective AI Enablement Partner. Layer Managed Systems remains future/evidence-gated and must not be presented as a standard public offer.
- The six canonical value measures are Hard savings, Capacity released, Cost avoidance, Revenue and cash impact, Risk and control improvement, and Service and experience improvement.

Evidence and decisions are separated as follows: repository structure is evidence; the section-by-section approach and visual preservation are Michael's decisions; exact copy below is a proposal to be reviewed during implementation.

## Decisions and assumptions

- Preserve the existing typography, colour system, atmospheric treatment, spacing, card language, navigation, and page rhythm.
- Keep the four process headings and adapt the copy beneath them to the approved service journey.
- Keep the current FAQ presentation and add the agreed reliability/monitoring questions.
- Treat monitoring and observability as part of responsible production implementation and as support that may be available where appropriate; do not publish a packaged Managed Operations/Managed Systems offer, SLAs, response times, pricing, 24/7 coverage, or guaranteed uptime.
- Use “design for failure” as client-facing reassurance: workflows should fail safely, surface problems, prevent duplicate actions, limit access, and keep people in control of important decisions.
- Add the six value measures in a new section using the existing visual grammar. Do not imply that every measure becomes cash or that results are guaranteed.
- Work in atomic section changes. Michael reviews and approves each section before the next section is implemented.

## Scope

### In scope

- Refresh the `From friction to flow` section to reflect the canonical service journey.
- Add a six-value-measures section in the current homepage style.
- Extend the existing FAQ with failure handling, post-launch monitoring, and monitoring data-minimisation answers.
- Add concise production/reliability language in one appropriate homepage location and fold monitoring into `Improve`.
- Add a small built-in-controls treatment to the Invoice Processing, Shared Inbox Routing, and Sales Opportunity Intelligence example systems.
- Update stale service terminology and related homepage CTA/supporting copy where required for consistency.
- Run local build and responsive/accessibility checks after each approved unit and before handoff.

### Out of scope

- Replacing the visual design system or generating another full-page redesign.
- Publishing Layer Managed Systems as a current standard service.
- Publishing pricing, tiers, SLAs, response times, 24/7 support, guaranteed uptime, or internal security checklists.
- Changing the LayerOS service model, company policy, credentials, integrations, analytics, or production hosting.
- Rewriting unrelated case studies, lab pages, or inner pages unless a later review identifies a blocking terminology conflict.

## High-level technical design

Keep homepage rendering in `src/pages/index.astro` and use small local data structures for section content, matching the existing `pillars`, `steps`, `systems`, and `faqs` arrays. Add a value-measures data array and a section that reuses existing shell, section-header, card, border, and reveal conventions. Keep FAQ JSON-LD sourced from the rendered FAQ data so visible and structured content cannot drift.

Where exact content is still a human decision, implementation should use clearly labelled copy proposals and stop at the review gate rather than inventing claims.

## Implementation units

### U-001 — Refresh “From friction to flow” service journey

**Dependency:** none.  
**Files:** `src/pages/index.astro`; discover any homepage-only styles in the same file if needed.

Retain `Understand`, `Build`, `Extend`, and `Improve`. Update each card so the progression is accurate:

- Understand: opportunity session followed by paid workflow assessment when deeper investigation is justified.
- Build: bounded AI Workflow Implementation, with AI Knowledge Foundation as a path when trusted knowledge is the constraint.
- Extend: further workflow implementations and selective AI Enablement Partner support only where evidence and operating need justify it.
- Improve: stabilisation, outcome review, observability, and support/monitoring where appropriate; avoid implying a standard managed-operations package.

Keep the first-step CTA aligned to the no-cost opportunity session/review language approved for the public site.

**Completion check:** the section reads as a coherent service journey, names no non-canonical “Implementation Partner” offer, and preserves the existing four-card layout at desktop and mobile widths.

### U-002 — Add six value measures section

**Dependency:** U-001 copy direction accepted.  
**Files:** `src/pages/index.astro`; homepage-local styles only if the existing card treatment cannot support the section.

Add one section explaining how Layer measures value, using the six canonical names and concise client-facing definitions. Include a short framing line that evidence can be known, estimated, or unknown and that capacity released is not automatically cash. Keep the section visually native to the current site and avoid dashboard-like or generic analytics imagery.

**Completion check:** all six exact measure names are present, definitions do not overclaim outcomes, the section has a stable anchor for navigation if needed, and it is readable without relying on colour alone.

### U-003 — Add design-for-failure and monitoring FAQ entries

**Dependency:** U-001.  
**Files:** `src/pages/index.astro`.

Extend the existing FAQ array and preserve the current accordion. Add answers for:

- What happens if an automation stops working?
- Can Layer monitor the workflows after launch?
- Does Layer need to see all of our workflow data to monitor it? (optional but recommended)

Explain that workflows are designed to fail safely, surface failures and missed runs, use controls such as retries and manual override where appropriate, and keep people in control. Use the approved data-minimisation language without exposing internal security checklists or support commitments. Confirm FAQ JSON-LD includes the new entries.

**Completion check:** each new question has a plain-language answer, no answer promises 24/7 support or guaranteed uptime, and the generated FAQ structured data matches the visible questions.

### U-004 — Add restrained production/reliability reassurance

**Dependency:** U-001.  
**Files:** `src/pages/index.astro`; homepage-local styles only if needed.

Choose one homepage placement for “Built to run. Designed to be monitored.” and add supporting copy that says Layer does not stop at deployment and can monitor systems it builds where ongoing support makes sense. Fold “Monitor, maintain and improve” into the `Improve` card. Keep any visual treatment in the existing glass/flow language; no NOC, server-rack, red-dashboard, or generic cybersecurity imagery.

**Completion check:** the language is clearly bounded and supportive, appears once at homepage level, and does not turn monitoring into the site's dominant theme or a packaged service.

### U-005 — Add built-in controls to selected system examples

**Dependency:** U-001.  
**Files:** `src/pages/index.astro`; discover any system-card styles in the same file if needed.

Add a compact “Built-in controls” treatment to Invoice Processing, Shared Inbox Routing, and Sales Opportunity Intelligence. Use the agreed control concepts where applicable: human approval, failure handling, retries, operational monitoring, audit trail, and manual override. Keep the treatment subordinate to the existing system descriptions and avoid implementation-detail overload.

**Completion check:** the three named systems expose control expectations consistently, the marketing system is not forced into an inaccurate claim, and card height/overflow remains usable on mobile.

### U-006 — Consistency pass and handoff verification

**Dependency:** U-001 through U-005 individually approved.  
**Files:** `src/config/site.ts` and any homepage/metadata files identified by search; `src/pages/index.astro`.

Search for stale public terminology such as “workflow review” where the approved opportunity-session/assessment language is required, and reconcile homepage metadata/CTA copy without changing unrelated legacy pages. Confirm no “Implementation Partner” or public Managed Systems claim remains in the homepage surface.

Run the production build, inspect the rendered homepage at desktop and mobile widths, test FAQ interaction and anchor links, and check heading hierarchy, focus visibility, alt text, and reduced-motion behaviour.

**Completion check:** build passes, all homepage anchors and FAQ interactions work, copy is internally consistent, and a review-ready diff exists on `layer-site-content-refresh`.

## File impact

- Primary implementation target: `src/pages/index.astro`.
- Likely supporting consistency target: `src/config/site.ts`.
- Plan artifact: `docs/plans/2026-08-25-section-by-section-content-refresh-plan.md`.
- No new dependencies, external services, credentials, or image assets are required by this plan.

## Verification scenarios

1. **Service journey:** Load the homepage and read the four process cards in order. Expected: the journey moves from opportunity/assessment to implementation, selective extension, and bounded improvement without implying a current Managed Systems offer.
2. **Value measures:** Load the new section at desktop and mobile widths. Expected: all six measures and definitions are visible, legible, and not dependent on colour alone.
3. **FAQ behaviour:** Open each new FAQ entry, then open another. Expected: the existing single-open accordion behaviour remains intact and answers are visible to keyboard users.
4. **Failure/monitoring boundaries:** Inspect visible copy and FAQ JSON-LD. Expected: design-for-failure and monitoring claims are present, but no SLA, 24/7, guaranteed uptime, pricing, or packaged Managed Operations language appears.
5. **System controls:** Inspect the three named system cards on mobile and desktop. Expected: controls do not overflow, obscure imagery, or make unsupported claims.
6. **Accessibility and motion:** Navigate with keyboard and with reduced-motion preference enabled. Expected: focus remains visible, headings are ordered, interactive FAQ controls remain usable, and reveal effects do not prevent content access.
7. **Build/rollback:** Run the documented build on the branch. Expected: build succeeds; reverting an individual unit restores the prior section without requiring data migration or external state changes.

## Risks and mitigations

- **Service-language drift:** Keep canonical names in a single reviewed copy pass and flag any proposed shorthand for Michael's approval.
- **Monitoring overclaim:** Use “where ongoing support makes sense” and “can monitor” language; do not publish Managed Systems, SLA, or 24/7 claims.
- **Section sprawl:** Add one value section and one restrained reassurance line; preserve the existing page rhythm.
- **Mobile density:** Verify the process cards, value cards, and system-control labels at narrow widths before moving on.
- **Structured-data mismatch:** Generate FAQ JSON-LD from the same array used for visible FAQ rendering.

## Permission and operational impact

This plan changes only repository files on the review branch. It does not change credentials, permissions, connectors, analytics, production workflows, hosting, or external systems. Publishing remains a separate human approval gate.

## Rollout and rollback

Implement and review one unit at a time on `layer-site-content-refresh`. Keep each unit small enough to revert independently. Before any merge or deployment, Michael reviews the accumulated diff and explicitly approves the release path. If a section is rejected, revert that unit on the branch without touching `main`.

## Open questions and approval gates

- Michael must approve the final wording for each section, especially the exact service labels and monitoring sentence.
- Michael must decide whether the optional data-minimisation FAQ is included in the initial pass.
- Michael must approve the value-measures section layout after seeing it in the existing visual system.
- CE Work/implementation is not authorized by this plan alone; it begins only after this plan is accepted.

## Planning context

Capability band: standard. The outcome is settled, the work is a bounded single-repository content/UI change, and no permission or architecture surface changes are planned.
