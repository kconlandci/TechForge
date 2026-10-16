// ============================================================
// TechForge — RevenueCat Configuration
// Wiring package (prepared 2026-10-16): API key replaced with
// TechForge's real Google Play public SDK key, and the product
// identifiers aligned to the shared Forge Labs Pro entitlement
// + subscription model, following the family config pattern.
//
// The key below is TechForge's own, from the TechForge app in
// the existing Forge Labs RevenueCat project (app id
// appbc400bc922, package com.techforge.app), confirmed on the
// dashboard 2026-10-16. It is app-specific — not ThreatForge's
// or CloudForge's key. The entitlement "Forge Labs Pro" and
// the product "techforge_lifetime" are likewise confirmed on
// the dashboard. Still outstanding for launch (not needed for
// this config to be correct): create the Play Console
// subscription "techforge_pro" (monthly/yearly base plans),
// attach it to Forge Labs Pro in RevenueCat, and upload the
// Play service-account credentials to the TechForge app — all
// launch-time steps.
// ============================================================

/** Google Play public API key from RevenueCat dashboard (TechForge app) */
export const REVENUECAT_API_KEY = "goog_uNfznkyLPMZzQBUCPGtKVOvatjd";

/** RevenueCat entitlement identifier — shared across the Forge family.
 *  Exact string as configured in the RevenueCat dashboard:
 *  "Forge Labs Pro" (case- and space-sensitive). */
export const ENTITLEMENT_ID = "Forge Labs Pro";

/** Google Play subscription product identifier (must match Play Console
 *  and the product attached to Forge Labs Pro in RevenueCat).
 *  Naming follows the family pattern: "<app>_pro"
 *  (ThreatForge: "threatforge_pro", CloudForge: "cloudforge_pro").
 *  Monthly/yearly are base plans on this one Play subscription product.
 *  VERIFY IN DASHBOARD: create/confirm this exact ID before launch. */
export const SUBSCRIPTION_ID = "techforge_pro";

/** One-time lifetime product identifier. Already exists for TechForge
 *  and is attached to Forge Labs Pro in RevenueCat (dashboard-confirmed
 *  2026-10-16); it is also the product TechForge's purchase flow has
 *  bought by ID up to now. Kept available for a lifetime SKU/button;
 *  the subscription pivot does not remove it. */
export const LIFETIME_PRODUCT_ID = "techforge_lifetime";

/** Backwards-compatible alias: TechForge's existing usePurchase.ts
 *  imports PRODUCT_ID. It now points at the subscription product so
 *  this config is a true drop-in with no hook changes. (TechForge's
 *  previous PRODUCT_ID was "techforge_lifetime" — see
 *  LIFETIME_PRODUCT_ID above; nothing else in the repo imports it.) */
export const PRODUCT_ID = SUBSCRIPTION_ID;
