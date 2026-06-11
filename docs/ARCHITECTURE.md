# Hoshi — Target Architecture

This is the agreed structure of the platform. New work must follow this model;
when existing code contradicts it, migrate the code (pre-release — breaking
changes are fine).

## Topology

```
Web app (Nuxt) ─┐
                ├──► apps/api (Nitro, :4100) ──► per-user OpenCode machine
Electron app ───┘        auth · tenancy · admin        (cloud, per user)
                         provisioning · proxy
```

Clients never reach OpenCode directly — every OpenCode call goes through the
authenticated `/opencode/**` proxy on apps/api.

## Tenancy model

1. **Organization** — the top-level tenant (e.g. "JTI"). Owns billing-level
   settings and, critically, **owns the projects**.
2. **Users** — belong to one or more organizations via membership
   (roles: owner / admin / member).
3. **Groups** — groups of developers inside an organization, used to grant
   project access in bulk.
4. **Projects belong to organizations, not users.** The projects list shows
   only projects the current user has access to (via org membership / group
   grants). Org admins and owners can create projects; members see what they
   are given.
5. **Machines** — every user has their **own cloud machine running OpenCode**.
   - The machine is user-specific: each user can inspect and modify *their*
     machine (its OpenCode config, agents, skills, commands, MCP connectors,
     schedules…).
   - When a developer opens a project, the workspace is **their machine** —
     project + user's machine is the working pair. Two users in the same
     project work on their own machines.
   - The **Customize** surface configures the *machine*, not the project or
     the org. It must expose which machine you're on and allow switching.
   - `resolveOpencodeUpstream()` in `apps/api/utils/opencode.ts` is the seam:
     it resolves the request's user → their machine's upstream URL.

## Provisioning

Accepting an invite (or first login into an org) is the provisioning moment:

- ensure the user has a machine (create/boot one if not),
- initialize project bindings for what they were invited to.

Provisioning is a first-class step with visible status — a user whose machine
is still booting should see that state, not an error.

## Auth

- Web: JWT cookie session (SameSite=lax).
- Electron: PAT / bearer tokens (planned with CLI tokens).
- SSO (OIDC) planned: providers configured in the instance admin panel,
  domain → organization mapping.
- Inactivity lock: the client locks itself after idle time and requires
  re-auth (password now; WebAuthn/Touch ID planned).

## Product center

One big, modern, compact **session** is the center of the product, with
dynamic generative UI elements in the thread — interactive cards/forms the
agent emits and the user answers with — beyond plain text/voice.
