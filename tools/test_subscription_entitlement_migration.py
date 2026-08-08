import re
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
MIGRATION = ROOT / "supabase" / "migrations" / "20260807103543_add_devam_one_subscription_entitlements.sql"


class SubscriptionEntitlementMigrationTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.sql = MIGRATION.read_text(encoding="utf-8")
        cls.normalized = re.sub(r"\s+", " ", cls.sql.lower()).strip()

    def test_entitlement_shape_is_provider_neutral(self) -> None:
        self.assertIn("create table public.subscriptions", self.normalized)
        self.assertIn("user_id uuid not null unique references auth.users(id) on delete cascade", self.normalized)
        self.assertIn("check (plan_code = 'devam_one')", self.normalized)
        for forbidden in ("stripe", "razorpay", "customer_id", "subscription_id", "webhook_payload"):
            self.assertNotIn(forbidden, self.normalized)

    def test_public_table_has_owner_read_only_rls(self) -> None:
        self.assertIn("alter table public.subscriptions enable row level security", self.normalized)
        self.assertIn("revoke all on table public.subscriptions from anon", self.normalized)
        self.assertIn("revoke all on table public.subscriptions from authenticated", self.normalized)
        self.assertIn("grant select on table public.subscriptions to authenticated", self.normalized)
        self.assertIn("for select to authenticated using ((select auth.uid()) = user_id)", self.normalized)
        self.assertNotRegex(self.normalized, r"create policy .* for (insert|update|delete|all)")

    def test_only_explicit_access_statuses_can_grant_product_access(self) -> None:
        for status in ("trialing", "active", "beta_access", "past_due", "canceled", "incomplete", "paused"):
            self.assertIn(f"'{status}'", self.normalized)
        self.assertIn("check (status <> 'beta_access' or source = 'manual_beta')", self.normalized)


if __name__ == "__main__":
    unittest.main()
