import { ReactNode, useState } from 'react';
import { Button, IconSprite, RadioReusableGroup } from '@/shared/ui';
import { appLogger } from '@/shared/lib/appLogger';
import { Modal } from '@/widgets/modal/Modal';
import {
  useCreateSubscriptionMutation,
  useCancelAutoRenewalMutation,
  useEnableAutoRenewalMutation,
  useGetSubscriptionsQuery,
} from '../api/subscriptionsApi';

type AccountType = 'personal' | 'business';
type PlanType = 'day' | 'week' | 'month';

type Provider = 'STRIPE' | 'PAYPAL';
type ProviderAll = Provider | 'PAYME';

export const AccountManagement = (): ReactNode => {
  const [accountType, setAccountType] = useState<AccountType>('personal');
  const [plan, setPlan] = useState<PlanType | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [agree, setAgree] = useState(false);
  const [provider, setProvider] = useState<ProviderAll | null>(null);
  const [createSubscription, { isLoading }] = useCreateSubscriptionMutation();
  const { data: subs } = useGetSubscriptionsQuery({
    pageNumber: 1,
    pageSize: 1,
  });
  const [cancelAuto] = useCancelAutoRenewalMutation();
  const [enableAuto] = useEnableAutoRenewalMutation();

  const handleAccountTypeChange = (value: string) => {
    const v = value as AccountType;
    setAccountType(v);
    appLogger.profileSettings('AM_ACCOUNT_TYPE_CHANGED', {
      value: v,
      timestamp: new Date().toISOString(),
    });
  };

  const handlePlanChange = (value: string) => {
    const v = value as PlanType;
    setPlan(v);
    appLogger.profileSettings('AM_PLAN_CHANGED', {
      value: v,
      timestamp: new Date().toISOString(),
    });
  };

  const openConfirm = (p: ProviderAll) => {
    setProvider(p);
    setAgree(false);
    setConfirmOpen(true);
    appLogger.profileSettings('AM_PAYMENT_PROVIDER_CLICKED', {
      provider: p,
      accountType,
      plan,
      timestamp: new Date().toISOString(),
    });
  };

  const handleConfirm = async () => {
    if (!provider || !plan) {
      return;
    }

    const subscriptionPeriod =
      plan === 'day' ? 'DAILY' : plan === 'week' ? 'WEEKLY' : 'MONTHLY';
    try {
      const { url } = await createSubscription({
        subscriptionPeriod,
        paymentProvider: provider,
        baseUrl:
          typeof window !== 'undefined'
            ? window.location.origin
            : 'http://localhost:3000',
      }).unwrap();

      appLogger.profileSettings('AM_SUBSCRIPTION_CREATED', {
        provider,
        subscriptionPeriod,
        url,
        timestamp: new Date().toISOString(),
      });

      if (typeof window !== 'undefined') {
        window.location.href = url;
      }
    } catch (error) {
      appLogger.profileSettings('AM_SUBSCRIPTION_CREATE_ERROR', {
        error: String(error),
        timestamp: new Date().toISOString(),
      });
      setConfirmOpen(false);
    }
  };

  return (
    <div className="flex w-full flex-col gap-8">
      {/* Current subscription */}
      <section className="rounded-sm border-2 border-zinc-700 bg-black p-6">
        <h3 className="h3-text mb-4">Current Subscription:</h3>
        <div className="mb-4 grid grid-cols-2 gap-6 md:grid-cols-4">
          <div>
            <div className="text-sm text-zinc-400">Expire at</div>
            <div className="text-zinc-200">
              {subs?.items?.[0]?.validUntil
                ? new Date(subs.items[0].validUntil).toLocaleDateString()
                : '--'}
            </div>
          </div>
          <div>
            <div className="text-sm text-zinc-400">Next payment</div>
            <div className="text-zinc-200">--</div>
          </div>
        </div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={!!subs?.items?.[0]?.autoRenewal}
            onChange={async (e) => {
              try {
                if (e.target.checked) {
                  await enableAuto().unwrap();
                } else {
                  await cancelAuto().unwrap();
                }
              } catch (error) {
                appLogger.profileSettings('AM_TOGGLE_AUTORENEWAL_ERROR', {
                  error: String(error),
                  timestamp: new Date().toISOString(),
                });
              }
            }}
          />
          <span>Auto-Renewal</span>
        </label>
      </section>
      {/* Account type */}
      <section className="rounded-sm border-2 border-zinc-700 bg-black p-6">
        <h3 className="h3-text mb-6">Account type:</h3>
        <RadioReusableGroup
          options={[
            { value: 'personal', label: 'Personal' },
            { value: 'business', label: 'Business' },
          ]}
          defaultValue={accountType}
          onValueChange={handleAccountTypeChange}
          orientation="vertical"
        />
      </section>

      {/* Subscription costs */}
      <section className="rounded-sm border-2 border-zinc-700 bg-black p-6">
        <h3 className="h3-text mb-6">Your subscription costs:</h3>
        <RadioReusableGroup
          options={[
            { value: 'day', label: '$10 per 1 Day' },
            { value: 'week', label: '$50 per 7 Day' },
            { value: 'month', label: '$100 per month' },
          ]}
          defaultValue={plan ?? undefined}
          onValueChange={handlePlanChange}
          orientation="vertical"
        />
      </section>

      {/* Payment providers */}
      <section className="flex items-center justify-center gap-6">
        <Button
          variant="secondary"
          className="h-[72px] w-[180px] gap-3"
          onClick={() => openConfirm('PAYME')}
          icon={<IconSprite iconName="credit-card" width="28" height="28" />}
          disabled={!plan || accountType !== 'business'}
        >
          Payme
        </Button>
        <span className="text-zinc-400">Or</span>
        <Button
          variant="secondary"
          className="h-[72px] w-[180px] gap-3"
          onClick={() => openConfirm('PAYPAL')}
          icon={<IconSprite iconName="paypal" width="28" height="28" />}
          disabled={!plan || accountType !== 'business'}
        >
          PayPal
        </Button>
        <span className="text-zinc-400">Or</span>
        <Button
          variant="secondary"
          className="h-[72px] w-[180px] gap-3"
          onClick={() => openConfirm('STRIPE')}
          icon={<IconSprite iconName="stripe" width="28" height="28" />}
          disabled={!plan || accountType !== 'business'}
        >
          Stripe
        </Button>
      </section>

      {/* Confirm modal */}
      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Create payment"
        size="sm"
      >
        <p className="mb-4 text-zinc-200">
          Auto-renewal will be enabled with this payment. You can disable it
          anytime in your profile settings
        </p>
        {(provider === 'PAYPAL' || provider === 'PAYME') && (
          <p className="mb-4 text-sm text-yellow-400">
            For {provider === 'PAYPAL' ? 'PayPal' : 'Payme'} auto-renewal may
            require enabling recurring/billing agreements in your{' '}
            {provider === 'PAYPAL' ? 'PayPal' : 'Payme'} test account.
          </p>
        )}
        <label className="mb-6 flex items-center gap-2">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
          />
          <span>Agree</span>
        </label>
        <div className="flex justify-end gap-3">
          <Button variant="outlined" onClick={() => setConfirmOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!agree || isLoading}>
            OK
          </Button>
        </div>
      </Modal>
    </div>
  );
};
