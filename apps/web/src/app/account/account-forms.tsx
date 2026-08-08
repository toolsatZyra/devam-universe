"use client";

import { useActionState } from "react";
import type { ReactNode } from "react";
import {
  requestMagicLink,
  saveProfile,
} from "./actions";
import { initialAccountActionState } from "./account-state";
import styles from "./account.module.css";

function Status({ state }: { state: typeof initialAccountActionState }) {
  if (state.status === "idle") return null;
  return <p className={state.status === "success" ? styles.success : styles.error} role="status">{state.message}</p>;
}

export function SignInForm() {
  const [state, action, pending] = useActionState(requestMagicLink, initialAccountActionState);
  return (
    <form className={styles.form} action={action}>
      <label htmlFor="email">Email address</label>
      <div className={styles.inlineField}>
        <input id="email" name="email" type="email" autoComplete="email" required placeholder="you@example.com" />
        <button type="submit" disabled={pending}>{pending ? "Sending…" : "Send sign-in link"}</button>
      </div>
      <Status state={state} />
      <small>No password. The secure link creates an account if this is your first visit.</small>
    </form>
  );
}

type ProfileDefaults = {
  displayName: string;
  preferredLanguage: string;
  city: string;
  practiceRegion: string;
  sampradayaCode: string;
  familyPractice: string;
  personalizationConsent: boolean;
};

function Field({ children }: { children: ReactNode }) {
  return <div className={styles.field}>{children}</div>;
}

export function ProfileForm({ defaults }: { defaults: ProfileDefaults }) {
  const [state, action, pending] = useActionState(saveProfile, initialAccountActionState);
  return (
    <form className={styles.profileForm} action={action}>
      <div className={styles.fieldGrid}>
        <Field><label htmlFor="displayName">What should Sarthi call you?</label><input id="displayName" name="displayName" defaultValue={defaults.displayName} maxLength={80} /></Field>
        <Field><label htmlFor="preferredLanguage">Preferred language</label><select id="preferredLanguage" name="preferredLanguage" defaultValue={defaults.preferredLanguage}><option value="">Ask each time</option><option value="en">English</option><option value="hi">Hindi</option></select></Field>
        <Field><label htmlFor="city">Home city</label><input id="city" name="city" defaultValue={defaults.city} maxLength={100} placeholder="e.g. Delhi" /></Field>
        <Field><label htmlFor="practiceRegion">Regional practice context</label><select id="practiceRegion" name="practiceRegion" defaultValue={defaults.practiceRegion}><option value="">Ask each time</option><option value="north-india">North India</option><option value="west-india">West India</option><option value="bengal">Bengal</option><option value="south-india">South India</option></select></Field>
        <Field><label htmlFor="sampradayaCode">Sampradaya or tradition</label><input id="sampradayaCode" name="sampradayaCode" defaultValue={defaults.sampradayaCode} maxLength={80} placeholder="Leave blank if unknown" /></Field>
      </div>
      <Field><label htmlFor="familyPractice">Family practice Sarthi should respect</label><textarea id="familyPractice" name="familyPractice" defaultValue={defaults.familyPractice} maxLength={600} rows={4} placeholder="Optional: tell Sarthi about practices followed at home." /></Field>
      <label className={styles.consent}>
        <input type="checkbox" name="personalizationConsent" defaultChecked={defaults.personalizationConsent} />
        <span><strong>Allow Sarthi to use saved context</strong><small>You stay in control. You can inspect, export, or delete saved memories at any time.</small></span>
      </label>
      <button className={styles.primaryButton} type="submit" disabled={pending}>{pending ? "Saving…" : "Save my context"}</button>
      <Status state={state} />
    </form>
  );
}
