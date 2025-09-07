export interface LogData {
  [key: string]: any;
}

export interface LogEntry {
  timestamp: string;
  component: string;
  action: string;
  data?: LogData;
  level: 'info' | 'warn' | 'error' | 'debug';
}

class AppLogger {
  private logs: LogEntry[] = [];
  private isEnabled = false; // ❌ Отключено по умолчанию для избежания спама
  private logCounts: Map<string, number> = new Map(); // Счетчики для защиты от спама
  private maxLogsPerType = 50; // Максимальное количество одинаковых логов

  enable() {
    this.isEnabled = true;
    console.log('🔍 AppLogger: Логирование ВКЛЮЧЕНО');
  }

  disable() {
    this.isEnabled = false;
    console.log('🔍 AppLogger: Логирование ОТКЛЮЧЕНО');
  }

  // Новый метод для быстрого переключения
  toggle() {
    this.isEnabled = !this.isEnabled;
    console.log(
      `🔍 AppLogger: Логирование ${this.isEnabled ? 'ВКЛЮЧЕНО' : 'ОТКЛЮЧЕНО'}`
    );
    return this.isEnabled;
  }

  private createLogEntry(
    component: string,
    action: string,
    data?: LogData,
    level: LogEntry['level'] = 'info'
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      component,
      action,
      data,
      level,
    };
  }

  private log(entry: LogEntry) {
    if (!this.isEnabled) return;

    // Защита от спама: ограничиваем количество одинаковых логов
    const logKey = `${entry.component}_${entry.action}`;
    const currentCount = this.logCounts.get(logKey) || 0;

    if (currentCount >= this.maxLogsPerType) {
      // Показываем предупреждение только один раз при достижении лимита
      if (currentCount === this.maxLogsPerType) {
        console.warn(
          `🔍 ⚠️ Лог "${logKey}" достиг лимита ${this.maxLogsPerType}. Дальнейшие логи этого типа будут пропущены.`
        );
        this.logCounts.set(logKey, currentCount + 1);
      }
      return;
    }

    this.logCounts.set(logKey, currentCount + 1);
    this.logs.push(entry);

    const prefix = `🔍 [${entry.component}] ${entry.action}`;
    const style = this.getConsoleStyle(entry.level);

    if (entry.data) {
      console.groupCollapsed(`%c${prefix}`, style);
      console.log('Timestamp:', entry.timestamp);
      console.log('Data:', entry.data);
      console.log(`Count: ${currentCount + 1}/${this.maxLogsPerType}`);
      console.groupEnd();
    } else {
      console.log(
        `%c${prefix}`,
        style,
        entry.timestamp,
        `(${currentCount + 1}/${this.maxLogsPerType})`
      );
    }
  }

  private getConsoleStyle(level: LogEntry['level']): string {
    const styles = {
      info: 'color: #2196F3; font-weight: bold;',
      warn: 'color: #FF9800; font-weight: bold;',
      error: 'color: #F44336; font-weight: bold;',
      debug: 'color: #9C27B0; font-weight: bold;',
    };
    return styles[level];
  }

  // Основные методы логирования
  info(component: string, action: string, data?: LogData) {
    this.log(this.createLogEntry(component, action, data, 'info'));
  }

  warn(component: string, action: string, data?: LogData) {
    this.log(this.createLogEntry(component, action, data, 'warn'));
  }

  error(component: string, action: string, data?: LogData) {
    this.log(this.createLogEntry(component, action, data, 'error'));
  }

  debug(component: string, action: string, data?: LogData) {
    this.log(this.createLogEntry(component, action, data, 'debug'));
  }

  // Специальные методы для отслеживания аутентификации
  auth(action: string, data?: LogData) {
    this.info('AUTH', action, data);
  }

  sidebar(action: string, data?: LogData) {
    this.info('SIDEBAR', action, data);
  }

  profileSettings(action: string, data?: LogData) {
    this.info('PROFILE_SETTINGS', action, data);
  }

  rtk(action: string, data?: LogData) {
    this.debug('RTK_QUERY', action, data);
  }

  // Утилитарные методы
  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
    this.logCounts.clear(); // Сбрасываем счетчики
    console.clear();
    console.log('🔍 AppLogger: Логи очищены');
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  getLogsByComponent(component: string): LogEntry[] {
    return this.logs.filter((log) => log.component === component);
  }

  getLogsByTimeRange(from: Date, to: Date): LogEntry[] {
    return this.logs.filter((log) => {
      const logDate = new Date(log.timestamp);
      return logDate >= from && logDate <= to;
    });
  }

  // Специальный метод для отслеживания проблемы с Profile Settings
  trackProfileSettingsBug() {
    // Сначала очищаем все
    this.clearLogs();

    // Включаем логирование
    this.enable();

    console.group('🐛 Profile Settings Bug Tracking');
    console.log('='.repeat(50));
    console.log('Отслеживание проблемы с Profile Settings');
    console.log('Время начала:', new Date().toISOString());
    console.log('🔍 Логирование ВКЛЮЧЕНО');
    console.log('📝 Используйте appLogger.stop() для остановки');
    console.log('='.repeat(50));
    console.groupEnd();
  }

  // Быстрая остановка для случаев зацикливания
  stop() {
    this.disable();
    console.log('🛑 AppLogger: Отслеживание ОСТАНОВЛЕНО');
    return 'Логирование остановлено';
  }

  // Статус логгера
  status() {
    console.log('🔍 AppLogger Status:');
    console.log('- Enabled:', this.isEnabled);
    console.log('- Total logs:', this.logs.length);
    console.log('- Log counts:', Object.fromEntries(this.logCounts));
    console.log('- Max logs per type:', this.maxLogsPerType);
  }

  // Настройка лимита логов
  setMaxLogsPerType(max: number) {
    this.maxLogsPerType = max;
    console.log(`🔍 AppLogger: Установлен лимит ${max} логов на тип`);
  }
}

// Создаем единственный экземпляр логгера
export const appLogger = new AppLogger();

// Делаем логгер доступным в window для отладки в браузере
if (typeof window !== 'undefined') {
  (window as any).appLogger = appLogger;
}
