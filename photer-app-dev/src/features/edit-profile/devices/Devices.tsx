import { ReactNode, useMemo, useState, useEffect } from 'react';
import { Button } from '@/shared/ui';
import { appLogger } from '@/shared/lib/appLogger';
import {
  useGetDevicesQuery,
  useTerminateAllOtherSessionsMutation,
  useTerminateDeviceSessionMutation,
  DeviceSessionDto,
} from '../api/securityApi';

// Временный тип для мок-данных (после интеграции заменим на тип из API)
type DeviceSession = {
  deviceId: string;
  title: string; // например: 'Chrome on Windows'
  ip: string;
  lastActiveDate?: string; // ISO или дата из макета
  isCurrent?: boolean; // пометка текущего устройства
};

export const Devices = (): ReactNode => {
  const { data, isLoading, isError } = useGetDevicesQuery();
  const [terminateAllOther] = useTerminateAllOtherSessionsMutation();
  const [terminateDevice] = useTerminateDeviceSessionMutation();

  // Локальная проекция данных для соответствия макету
  const [items, setItems] = useState<DeviceSession[]>([]);

  useEffect(() => {
    if (data) {
      const mapped: DeviceSession[] = data.map((d: DeviceSessionDto) => ({
        deviceId: d.deviceId,
        title: d.title,
        ip: d.ip,
        lastActiveDate: new Date(d.lastActiveDate).toLocaleDateString(),
      }));

      // эвристика: первое устройство считаем текущим (пока бэк не отдаёт флаг)
      if (mapped.length > 0) {
        mapped[0].isCurrent = true;
      }
      setItems(mapped);
    }
  }, [data]);
  const current = useMemo(() => items.find((i) => i.isCurrent), [items]);
  const active = useMemo(() => items.filter((i) => !i.isCurrent), [items]);

  // Завершить все остальные сессии (кроме текущей)
  const handleTerminateAllOther = () => {
    appLogger.profileSettings('DEVICES_TERMINATE_ALL_OTHER_CLICKED', {
      currentDeviceId: current?.deviceId,
      count: items.length,
      timestamp: new Date().toISOString(),
    });
    terminateAllOther()
      .unwrap()
      .then((res) => {
        appLogger.profileSettings('DEVICES_TERMINATE_ALL_OTHER_SUCCESS', {
          result: res,
          timestamp: new Date().toISOString(),
        });
      })
      .catch((error) => {
        appLogger.profileSettings('DEVICES_TERMINATE_ALL_OTHER_ERROR', {
          error: String(error),
          timestamp: new Date().toISOString(),
        });
      });
  };

  // Завершить конкретную сессию
  const handleTerminate = (deviceId: string) => {
    appLogger.profileSettings('DEVICES_TERMINATE_CLICKED', {
      deviceId,
      timestamp: new Date().toISOString(),
    });
    terminateDevice(deviceId)
      .unwrap()
      .then((res) => {
        appLogger.profileSettings('DEVICES_TERMINATE_SUCCESS', {
          result: res,
          timestamp: new Date().toISOString(),
        });
        setItems((prev) =>
          prev.filter((d) => d.deviceId !== deviceId || d.isCurrent)
        );
      })
      .catch((error) => {
        appLogger.profileSettings('DEVICES_TERMINATE_ERROR', {
          error: String(error),
          timestamp: new Date().toISOString(),
        });
      });
  };

  return (
    <div className="flex w-full flex-col gap-8">
      {isLoading && (
        <div className="text-sm text-zinc-400">Loading devices...</div>
      )}
      {isError && (
        <div className="text-sm text-red-400">Failed to load devices</div>
      )}
      {/* Текущие устройство */}
      <section className="flex flex-col gap-4">
        <h3 className="h3-text">Current device</h3>

        <div className="rounded-sm border-2 border-zinc-700 bg-black p-6">
          <div className="flex items-center justify-between">
            <div className="flex min-w-0 flex-col">
              <span className="h3-text truncate">{current?.title ?? '—'}</span>
              <span className="text-sm text-zinc-400">
                IP: {current?.ip ?? '—'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button variant="secondary" onClick={handleTerminateAllOther}>
            Terminate all other session
          </Button>
        </div>
      </section>

      {/* Активные сессии */}
      <section className="flex flex-col gap-4">
        <h3 className="h3-text">Active sessions</h3>

        <div className="flex flex-col gap-4">
          {active.map((d) => (
            <div
              key={d.deviceId}
              className="flex items-center justify-between rounded-sm border-2 border-zinc-700 bg-black p-6"
            >
              <div className="flex min-w-0 flex-col">
                <span className="h3-text truncate">{d.title}</span>
                <span className="text-sm text-zinc-400">IP: {d.ip}</span>
                {d.lastActiveDate && (
                  <span className="text-xs text-zinc-500">
                    Last visit: {d.lastActiveDate}
                  </span>
                )}
              </div>

              <Button
                variant="outlined"
                onClick={() => handleTerminate(d.deviceId)}
              >
                Log Out
              </Button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
