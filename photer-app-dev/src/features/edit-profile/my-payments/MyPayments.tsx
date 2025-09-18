import { ReactNode, useMemo, useState, useEffect } from 'react';
import { Button, IconSprite } from '@/shared/ui';
import { appLogger } from '@/shared/lib/appLogger';
import { useGetMyPaymentsQuery } from '../api/subscriptionsApi';

type PaymentRow = {
  id: string;
  dateOfPayment: string; // dd.mm.yyyy
  endDateOfSubscription: string; // dd.mm.yyyy
  price: string; // $10
  subscriptionType: string; // 1 day / 7 days / 1 month
  paymentType: 'Stripe' | 'PayPal';
};

const mockRows: PaymentRow[] = [
  {
    id: '1',
    dateOfPayment: '12.12.2022',
    endDateOfSubscription: '12.12.2022',
    price: '$10',
    subscriptionType: '1 day',
    paymentType: 'Stripe',
  },
  {
    id: '2',
    dateOfPayment: '12.12.2022',
    endDateOfSubscription: '12.12.2022',
    price: '$50',
    subscriptionType: '7 days',
    paymentType: 'Stripe',
  },
  {
    id: '3',
    dateOfPayment: '12.12.2022',
    endDateOfSubscription: '12.12.2022',
    price: '$100',
    subscriptionType: '1 month',
    paymentType: 'Stripe',
  },
  {
    id: '4',
    dateOfPayment: '12.12.2022',
    endDateOfSubscription: '12.12.2022',
    price: '$100',
    subscriptionType: '1 month',
    paymentType: 'PayPal',
  },
  {
    id: '5',
    dateOfPayment: '12.12.2022',
    endDateOfSubscription: '12.12.2022',
    price: '$50',
    subscriptionType: '7 days',
    paymentType: 'PayPal',
  },
  {
    id: '6',
    dateOfPayment: '12.12.2022',
    endDateOfSubscription: '12.12.2022',
    price: '$50',
    subscriptionType: '7 days',
    paymentType: 'PayPal',
  },
  {
    id: '7',
    dateOfPayment: '12.12.2022',
    endDateOfSubscription: '12.12.2022',
    price: '$50',
    subscriptionType: '7 days',
    paymentType: 'PayPal',
  },
  {
    id: '8',
    dateOfPayment: '12.12.2022',
    endDateOfSubscription: '12.12.2022',
    price: '$100',
    subscriptionType: '1 month',
    paymentType: 'PayPal',
  },
];

export const MyPayments = (): ReactNode => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(8);
  const { data, isLoading, isError } = useGetMyPaymentsQuery({
    pageNumber: page,
    pageSize: perPage,
    sortDirection: 'desc',
    sortBy: 'dateOfPayment',
  });

  const [rows, setRows] = useState<PaymentRow[]>(mockRows);

  useEffect(() => {
    if (data?.items) {
      setRows(
        data.items.map((p: any, idx: number) => ({
          id: String(p.subscriptionId ?? idx),
          dateOfPayment: new Date(p.dateOfPayment).toLocaleDateString(),
          endDateOfSubscription: new Date(
            p.endDateOfSubscription
          ).toLocaleDateString(),
          price: `$${p.price}`,
          subscriptionType: p.subscriptionType,
          paymentType: p.paymentType === 'STRIPE' ? 'Stripe' : 'PayPal',
        }))
      );
    }
  }, [data]);

  const totalPages = useMemo(() => data?.pagesCount ?? 1, [data]);

  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="overflow-hidden rounded-sm border-2 border-zinc-700">
        <table className="w-full table-auto bg-black">
          <thead className="bg-zinc-900">
            <tr className="text-left">
              <th className="px-6 py-4 font-normal text-zinc-300">
                Date of Payment
              </th>
              <th className="px-6 py-4 font-normal text-zinc-300">
                End date of subscription
              </th>
              <th className="px-6 py-4 font-normal text-zinc-300">Price</th>
              <th className="px-6 py-4 font-normal text-zinc-300">
                Subscription Type
              </th>
              <th className="px-6 py-4 font-normal text-zinc-300">
                Payment Type
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-zinc-800">
                <td className="px-6 py-4 text-zinc-200">{r.dateOfPayment}</td>
                <td className="px-6 py-4 text-zinc-200">
                  {r.endDateOfSubscription}
                </td>
                <td className="px-6 py-4 text-zinc-200">{r.price}</td>
                <td className="px-6 py-4 text-zinc-200">
                  {r.subscriptionType}
                </td>
                <td className="px-6 py-4 text-zinc-200">
                  <span className="inline-flex items-center gap-2">
                    {r.paymentType === 'Stripe' ? (
                      <IconSprite iconName="stripe" width="20" height="20" />
                    ) : (
                      <IconSprite iconName="paypal" width="20" height="20" />
                    )}
                    {r.paymentType}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Пагинация */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="text" onClick={handlePrev}>
            <IconSprite iconName="arrow-back-outline" width="18" height="18" />
          </Button>
          <div className="flex items-center gap-2 text-zinc-300">
            <Button variant="secondary" className="h-[28px] px-3">
              {page}
            </Button>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
            <span>...</span>
            <span>55</span>
          </div>
          <Button variant="text" onClick={handleNext}>
            <IconSprite
              iconName="arrow-forward-outline"
              width="18"
              height="18"
            />
          </Button>
        </div>

        <div className="flex items-center gap-2 text-zinc-300">
          <span>Show</span>
          <select
            className="rounded-sm border border-zinc-700 bg-black px-2 py-1"
            value={perPage}
            onChange={(e) => {
              const v = Number(e.target.value);
              setPerPage(v);
              appLogger.profileSettings('MY_PAYMENTS_PER_PAGE_CHANGED', {
                value: v,
                timestamp: new Date().toISOString(),
              });
            }}
          >
            {[8, 10, 20, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <span>on page</span>
        </div>
      </div>
    </div>
  );
};
