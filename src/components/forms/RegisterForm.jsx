"use client";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Link } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
const signUpAction = async (prevState, formData) => {
  window.location.href = '/account';
  return { ok: true };
};
function SubmitButton() {
  const { pending } = useFormStatus();
  return <button
    type="submit"
    disabled={pending}
    className="mt-2 rounded-full bg-brand-magenta px-6 py-2.5 text-sm font-semibold text-white shadow hover:opacity-90 transition-opacity disabled:opacity-60"
  >{pending ? "Creating account…" : "Create Account"}</button>;
}
export function RegisterForm() {
  const [state, formAction] = useActionState(signUpAction, {});
  return <form action={formAction} noValidate className="flex flex-col gap-4">{
    /* Server-side error */
  }{state.error && <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">{state.error}</p>}{
    /* Success message (email confirmation required) */
  }{state.message && <p className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700 border border-green-200" role="status">{state.message}</p>}{
    /* Business Name */
  }<div className="flex flex-col gap-1.5"><Label htmlFor="businessName">Business Name</Label><Input
    id="businessName"
    name="businessName"
    type="text"
    required
    placeholder="Your bakery or restaurant name"
  /></div>{
    /* Contact Name */
  }<div className="flex flex-col gap-1.5"><Label htmlFor="contactName">Contact Name</Label><Input
    id="contactName"
    name="contactName"
    type="text"
    autoComplete="name"
    required
    placeholder="Your full name"
  /></div>{
    /* Phone */
  }<div className="flex flex-col gap-1.5"><Label htmlFor="phone">Phone</Label><Input
    id="phone"
    name="phone"
    type="tel"
    autoComplete="tel"
    required
    placeholder="10-digit mobile number"
  /></div>{
    /* Email */
  }<div className="flex flex-col gap-1.5"><Label htmlFor="email">Email</Label><Input
    id="email"
    name="email"
    type="email"
    autoComplete="email"
    required
    placeholder="you@example.com"
  /></div>{
    /* Password */
  }<div className="flex flex-col gap-1.5"><Label htmlFor="password">Password</Label><Input
    id="password"
    name="password"
    type="password"
    autoComplete="new-password"
    required
    placeholder="Choose a password"
  /></div>{
    /* Referral code (optional) */
  }<div className="flex flex-col gap-1.5"><Label htmlFor="referralCode">Referral code (optional)</Label><Input
    id="referralCode"
    name="referralCode"
    type="text"
    autoComplete="off"
    placeholder="e.g. SHRP-ABC123"
  /></div><SubmitButton /><p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}<Link to="/login" className="font-medium text-brand-navy hover:underline">
          Log In
        </Link></p></form>;
}
