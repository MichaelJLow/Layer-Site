# Layer homepage offer journey implementation plan

## Outcome

Replace the homepage operating-model and four-service sequence with the approved audit → workflow build → handover/managed branch, while preserving Layer’s current visual system and existing progressive-disclosure behaviour.

## Context and evidence

- The homepage content, service data, dialog markup and local styles are in `src/pages/index.astro`.
- Global CTA and navigation copy are in `src/config/site.ts`; the homepage form label and email subject are in `src/components/ContactForm.astro`.
- The current `#what-we-build` navigation target belongs to the operating-model section that will be removed.
- The existing service dialogs already provide accessible, keyboard-operable deeper explanations.
- The current branch is `layer-managed-hero` and contains the approved hero change plus requirements documentation.
- Michael approved the audit/build/branch commercial model. This user decision intentionally supersedes the earlier homepage portfolio sequence.

Capability band: standard. The change is a bounded content and layout update in one repository with no permission or production-system changes. The installed capability-routing reference was unavailable, so the documented CE Plan default was used.

## Decisions and assumptions

- Remove the standalone Connect, Coordinate and Control section.
- Retain its useful principles within the new workflow-build copy.
- Replace the current four equal service cards with two sequential service cards followed by two post-launch choices.
- The visible headings use plain language; formal service names appear within the cards and dialogs.
- AI Opportunity Audit replaces AI Opportunity Session on the homepage and is initially offered at no cost to selected businesses.
- AI Workflow Build covers design, build, launch, stabilisation and handover.
- AI Workflow Management is optional and separately scoped.
- Preserve the current page palette, type, atmospheric gradients, modal treatment, reveal motion and card construction.

## Scope

### In scope

- Homepage data, markup and styles for the offer journey.
- Removal of now-unused homepage operating-model data and styles.
- Homepage and shared primary CTA language required to avoid an Opportunity Session/Audit mismatch.
- Navigation anchor correction after removing `#what-we-build`.
- Contact form button and subject alignment.
- Homepage structured service data alignment.

### Out of scope

- Pricing, SLAs, response times, 24/7 support or guaranteed uptime.
- A redesign of example systems, value, FAQ or contact presentation.
- Production deployment, commit, push, pull request or merge.
- Rewriting legacy lab pages or unrelated editorial content.

## High-level technical design

Use one local data array for the two sequential services and one array for the two post-launch choices. Reuse the existing service-detail dialog pattern for Audit, Workflow Build and Workflow Management. Render the journey as a wide, responsive composition with an explicit “After launch” choice point. On narrow screens, the sequence and choices stack in reading order.

## Implementation units

### U-001 — Replace the homepage offer model

**Dependencies:** none.  
**Files:** `src/pages/index.astro`.

Replace the four existing service objects with the approved Audit and Workflow Build services plus the two post-launch choices. Add complete, bounded dialog content for Audit, Build and Management.

**Completion check:** the data expresses one audit, one complete build and two optional post-launch paths without Knowledge Foundation or Enablement Partner as primary offers.

### U-002 — Replace the operating model and service grid

**Dependencies:** U-001.  
**Files:** `src/pages/index.astro`.

Remove the operating-model section and render the offer journey immediately after the hero. Include an explicit choice between handover and Managed by Layer. Preserve the existing More about this service interaction for the three purchasable services.

**Completion check:** reading order is hero → audit → build → choice; neither post-launch path appears mandatory.

### U-003 — Adapt the existing visual system

**Dependencies:** U-002.  
**Files:** `src/pages/index.astro`.

Replace obsolete process-grid and operating-model CSS with responsive journey, connector and branch styles using the current Layer palette, type and atmospheric card treatment.

**Completion check:** desktop shows a deliberate sequence and visible branch; mobile stacks cleanly without horizontal overflow; reduced-motion behaviour remains intact.

### U-004 — Align primary terminology and navigation

**Dependencies:** U-002.  
**Files:** `src/pages/index.astro`, `src/config/site.ts`, `src/components/ContactForm.astro`.

Change current public Opportunity Session references that feed primary navigation, homepage/contact CTAs and enquiry subjects to the AI Opportunity Audit. Point How It Works to the new offer journey. Do not bulk-edit unrelated historical copy unless it is rendered by the current primary path.

**Completion check:** the homepage, header CTA, contact form and relevant metadata use Audit consistently and no navigation link targets the removed section.

### U-005 — Verify the change set

**Dependencies:** U-001 through U-004.  
**Files:** no additional production files expected.

Run the production build, inspect desktop and mobile layouts, open each service dialog, test close/focus restoration and verify the primary anchors.

**Completion check:** build passes and the rendered page satisfies the behavioural scenarios below.

## File impact

- `src/pages/index.astro`
- `src/config/site.ts`
- `src/components/ContactForm.astro`
- `docs/2026-09-08-offer-journey-requirements-brief.md`
- `docs/plans/2026-09-08-offer-journey-refresh-plan.md`

## Verification scenarios

1. **Journey comprehension:** load `/`; scroll below the hero. Expected: Audit, Design/build/launch and the two post-launch choices appear in that order.
2. **Optional retainer:** inspect the post-launch area. Expected: handover and Managed by Layer are presented as peer choices, and neither copy implies the retainer is required.
3. **Service details:** open each More about this service control. Expected: the correct dialog opens, Escape/close works and focus returns to the originating control.
4. **Terminology:** inspect header, hero, offer section and contact form. Expected: AI Opportunity Audit is used consistently; no primary CTA says Opportunity Session.
5. **Responsive layout:** inspect at a wide viewport and at 390px. Expected: no clipped copy or horizontal overflow and the branch retains a clear reading order.
6. **Build:** run `npm run build`. Expected: Astro builds every route successfully.
7. **Rollback:** discard only this branch change set. Expected: the previously merged homepage remains unaffected because no external state or schema changed.

## Risks and mitigations

- **Audit sounds broader than its actual scope:** state that it is structured and focused, and promise specific tangible findings.
- **Free offer appears low-value:** describe a limited number as available at no cost to selected businesses rather than permanently pricing it at zero.
- **Management overclaim:** use bounded language and explicitly exclude guaranteed uptime, unlimited support and compulsory retainers.
- **Branch layout becomes confusing on mobile:** stack the choice heading before both peer options and verify at 390px.
- **Stale global terminology:** update only active shared primary paths and use search to report remaining legacy references.

## Permission and operational impact

Repository files only. No credentials, connectors, production workflows, analytics, hosting, permissions or client systems are changed. Commit, push, PR, merge and publication remain separate approval gates.

## Rollout and rollback

Keep all work on `layer-managed-hero`. Michael reviews the local preview before any commit or publication. Rollback is the removal of this branch’s uncommitted change set; there is no data migration or external state.

## Open questions and approval gates

- Exact pricing and duration of the future paid Audit remain outside this implementation.
- Operational boundaries for the first management retainers must be defined before public launch.
- Michael must visually approve the local section before any commit, push or publication.
