import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Req,
  Res,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegistrationDto } from './dto/registration.dto';
import { RegistrationConfirmationDto } from './dto/registration-confirmation.dto';
import { RegistrationEmailResendingDto } from './dto/registration-email-resending.dto';
import { PasswordRecoveryDto } from './dto/password-recovery.dto';
import { PasswordRecoveryResendingDto } from './dto/password-recovery-resending.dto';
import { NewPasswordDto } from './dto/new-password.dto';
import { AuthMeDto } from './dto/auth-me.dto';
import { ApiErrorResult } from './dto/api-error-result.dto';

/**
 * Контроллер для аутентификации и регистрации пользователей
 *
 * Этот контроллер обрабатывает все запросы, связанные с:
 * - Регистрацией новых пользователей
 * - Подтверждением email
 * - Повторной отправкой email подтверждения
 * - Входом в систему
 * - OAuth аутентификацией
 */
@ApiTags('Auth')
@Controller('api/v1/auth') // Изменяем путь согласно спецификации Photer API
export class AuthController {
  constructor(private authService: AuthService) {}

  // Преобразует TTL вида '120000', '60s', '2m', '1h', '7d' в миллисекунды
  private parseTtlToMs(
    value: string | undefined,
    defaultValue: string,
  ): number {
    const src = (value || defaultValue).toString().trim();
    const match = src.match(/^(\d+)(ms|s|m|h|d)?$/i);
    if (!match) {
      const asNum = Number(src);
      return Number.isFinite(asNum) ? asNum : 0;
    }
    const amount = Number(match[1]);
    const unit = (match[2] || 's').toLowerCase();
    switch (unit) {
      case 'ms':
        return amount;
      case 's':
        return amount * 1000;
      case 'm':
        return amount * 60 * 1000;
      case 'h':
        return amount * 60 * 60 * 1000;
      case 'd':
        return amount * 24 * 60 * 60 * 1000;
      default:
        return amount * 1000;
    }
  }

  /**
   * Регистрация нового пользователя
   *
   * Принимает данные пользователя, проверяет их уникальность,
   * создает аккаунт и отправляет email с кодом подтверждения.
   *
   * @param registrationDto - данные для регистрации (username, email, password)
   * @returns 204 No Content при успешной регистрации
   */
  @Post('registration')
  @HttpCode(HttpStatus.NO_CONTENT) // Возвращаем 204 согласно спецификации
  @ApiOperation({
    summary:
      'Registration in the system. Email will be send to passed email address',
  })
  @ApiResponse({
    status: 204,
    description:
      'Input data is accepted. Email with confirmation code will be send to passed email address',
  })
  @ApiResponse({
    status: 400,
    description:
      'If the inputModel has incorrect values (in particular if the user with the given email or username already exists',
    type: ApiErrorResult,
  })
  @ApiResponse({
    status: 429,
    description: 'More than 5 attempts from one IP-address during 10 seconds',
  })
  async registration(@Body() registrationDto: RegistrationDto) {
    return this.authService.registration(registrationDto);
  }

  /**
   * Подтверждение регистрации по коду
   *
   * Пользователь переходит по ссылке из email и передает
   * код подтверждения для активации аккаунта.
   *
   * @param confirmationDto - объект с кодом подтверждения
   * @returns 204 No Content при успешном подтверждении
   */
  @Post('registration-confirmation')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Confirm registration' })
  @ApiResponse({
    status: 204,
    description: 'Email was verified. Account was activated',
  })
  @ApiResponse({
    status: 400,
    description:
      'If the confirmation code is incorrect, expired or already been applied',
    type: ApiErrorResult,
  })
  @ApiResponse({
    status: 429,
    description: 'More than 5 attempts from one IP-address during 10 seconds',
  })
  async registrationConfirmation(
    @Body() confirmationDto: RegistrationConfirmationDto,
  ) {
    return this.authService.registrationConfirmation(confirmationDto.code);
  }

  /**
   * Повторная отправка email подтверждения
   *
   * Используется когда пользователь не получил email или
   * код подтверждения истек.
   *
   * @param resendingDto - объект с email адресом
   * @returns 204 No Content при успешной отправке
   */
  @Post('registration-email-resending')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Resend confirmation registration email if user exists',
  })
  @ApiResponse({
    status: 204,
    description:
      'Input data is accepted. Email with confirmation code will be send to passed email address',
  })
  @ApiResponse({
    status: 400,
    description: 'If the inputModel has incorrect values',
    type: ApiErrorResult,
  })
  @ApiResponse({
    status: 429,
    description: 'More than 5 attempts from one IP-address during 10 seconds',
  })
  async registrationEmailResending(
    @Body() resendingDto: RegistrationEmailResendingDto,
  ) {
    return this.authService.registrationEmailResending(resendingDto.email);
  }

  /**
   * Вход пользователя в систему
   *
   * Архитектура аутентификации:
   * - accessToken: обычный cookie (не httpOnly) - JavaScript может читать для Authorization header
   * - refreshToken: httpOnly cookie - защищен от XSS атак
   *
   * Почему accessToken не httpOnly:
   * 1. JavaScript должен читать токен для добавления в Authorization header
   * 2. Без этого все API запросы будут возвращать 401 Unauthorized
   * 3. Короткий срок жизни (5 мин) + автоматическое обновление обеспечивают безопасность
   */
  @Post('login')
  @UseGuards(AuthGuard('local'))
  @ApiOperation({ summary: 'Try login user to the system' })
  @ApiResponse({
    status: 200,
    description:
      'Returns JWT accessToken (expired after 5 minutes) in body and JWT refreshToken in cookie (http-only, secure) (expired 7 days).',
  })
  @ApiResponse({
    status: 400,
    description: 'If the inputModel has incorrect values',
  })
  @ApiResponse({
    status: 401,
    description: 'If the password or login is wrong',
  })
  @ApiResponse({
    status: 429,
    description: 'More than 5 attempts from one IP-address during 10 seconds',
  })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: any,
    @Req() req: any,
  ) {
    // LocalStrategy уже проверил пользователя и поместил в req.user
    const user = req.user;

    const result = await this.authService.login(user);

    // Берем TTL из env (поддержка форматов 120000 | 60s | 2m | 1h | 7d)
    const accessMaxAgeMs = this.parseTtlToMs(
      process.env.JWT_ACCESS_EXPIRATION_TIME,
      '5m',
    );
    const refreshMaxAgeMs = this.parseTtlToMs(
      process.env.JWT_REFRESH_EXPIRATION_TIME,
      '7d',
    );

    // Устанавливаем accessToken в обычный cookie (не httpOnly)
    // JavaScript может читать этот токен для добавления в Authorization header
    res.cookie('accessToken', result.accessToken, {
      httpOnly: false, // false чтобы JavaScript мог читать
      secure: process.env.NODE_ENV === 'production', // только HTTPS в продакшене
      sameSite: 'strict', // защита от CSRF атак
      maxAge: accessMaxAgeMs,
      path: '/',
    });

    // Устанавливаем refreshToken в httpOnly cookie
    // Этот токен защищен от XSS атак, используется только для обновления accessToken
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true, // true для защиты от XSS
      secure: process.env.NODE_ENV === 'production', // только HTTPS в продакшене
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: refreshMaxAgeMs,
      path: '/',
    });

    // Возвращаем accessToken в теле ответа для совместимости
    // Frontend может использовать его, но основной способ - через cookies
    return {
      accessToken: result.accessToken,
    };
  }

  /**
   * Универсальный OAuth login
   *
   * Перенаправляет пользователя на страницу авторизации указанного провайдера.
   * Поддерживаемые провайдеры: google, github
   *
   * @param provider - OAuth провайдер (google, github)
   * @returns Перенаправление на страницу авторизации провайдера
   */
  @Get('oauth/:provider/login')
  @UseGuards(AuthGuard('universal-oauth'))
  @ApiOperation({
    summary: 'Redirects user to OAuth authentication',
    description:
      'Redirects user to the OAuth login page for the specified provider',
  })
  @ApiResponse({
    status: 200,
    description: 'Redirects user to the OAuth login page',
  })
  @ApiResponse({
    status: 400,
    description: 'Unsupported OAuth provider',
  })
  @ApiResponse({
    status: 429,
    description: 'Too many requests from the same IP in a short time',
  })
  async oauthLogin(@Param('provider') provider: string) {
    // Проверяем поддерживаемые провайдеры
    const supportedProviders = ['google', 'github'];
    if (!supportedProviders.includes(provider)) {
      throw new BadRequestException(`Unsupported OAuth provider: ${provider}`);
    }

    // Guard будет обрабатывать аутентификацию
    return { message: `Redirecting to ${provider} OAuth...` };
  }

  /**
   * Универсальный OAuth callback
   *
   * Обрабатывает ответ от OAuth провайдера и выдает JWT токены.
   *
   * @param provider - OAuth провайдер (google, github)
   * @param req - объект запроса с данными пользователя
   * @param res - объект ответа для редиректа
   * @returns Перенаправление на фронтенд с токеном
   */
  @Get('oauth/:provider/callback')
  @UseGuards(AuthGuard('universal-oauth'))
  @ApiOperation({
    summary: 'Handles OAuth callback and issues tokens',
    description:
      'Handles OAuth callback from the specified provider and issues JWT accessToken and refreshToken',
  })
  @ApiResponse({
    status: 200,
    description: 'Issues JWT accessToken and refreshToken in cookie',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized if authentication fails',
  })
  @ApiResponse({
    status: 429,
    description: 'Too many requests from the same IP in a short time',
  })
  async oauthCallback(
    @Param('provider') provider: string,
    @Req() req,
    @Res() res,
  ) {
    // Проверяем поддерживаемые провайдеры
    const supportedProviders = ['google', 'github'];
    if (!supportedProviders.includes(provider)) {
      throw new BadRequestException(`Unsupported OAuth provider: ${provider}`);
    }

    const result = await this.authService.validateOAuthUser(req.user, provider);

    // Перенаправляем на фронтенд с токеном
    res.redirect(
      `${process.env.FRONTEND_URL}/auth/callback?token=${result.accessToken}`,
    );
  }

  /**
   * Восстановление пароля
   *
   * Отправляет email с кодом восстановления пароля.
   * Включает проверку reCAPTCHA для предотвращения спама.
   *
   * @param passwordRecoveryDto - данные для восстановления (email, recaptchaValue)
   * @returns 204 No Content при успешной отправке email
   */
  @Post('password-recovery')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary:
      'Password recovery via Email confirmation. Email should be send with RecoveryCode inside',
  })
  @ApiResponse({
    status: 204,
    description:
      'Email with confirmation code will be send to passed email address',
  })
  @ApiResponse({
    status: 400,
    description:
      'If the inputModel has invalid email (for example 222^gmail.com)',
    type: ApiErrorResult,
  })
  @ApiResponse({
    status: 404,
    description: 'If user with this email does not exist',
  })
  @ApiResponse({
    status: 429,
    description: 'More than 5 attempts from one IP-address during 10 seconds',
  })
  async passwordRecovery(@Body() passwordRecoveryDto: PasswordRecoveryDto) {
    return this.authService.passwordRecovery(
      passwordRecoveryDto.email,
      passwordRecoveryDto.recaptchaValue,
    );
  }

  /**
   * Повторная отправка восстановления пароля
   *
   * Генерирует новый код восстановления и отправляет email.
   *
   * @param passwordRecoveryResendingDto - данные для повторной отправки (email)
   * @returns 204 No Content при успешной отправке email
   */
  @Post('password-recovery-resending')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Resend password recovery link via email',
  })
  @ApiResponse({
    status: 204,
    description: 'Email with a new recovery link has been sent',
  })
  @ApiResponse({
    status: 400,
    description:
      'If the inputModel has invalid email (for example 222^gmail.com)',
    type: ApiErrorResult,
  })
  @ApiResponse({
    status: 404,
    description: 'If user with this email does not exist',
  })
  @ApiResponse({
    status: 429,
    description: 'More than 5 attempts from one IP-address during 10 seconds',
  })
  async passwordRecoveryResending(
    @Body() passwordRecoveryResendingDto: PasswordRecoveryResendingDto,
  ) {
    return this.authService.passwordRecoveryResending(
      passwordRecoveryResendingDto.email,
    );
  }

  /**
   * Установка нового пароля
   *
   * Подтверждает восстановление пароля по коду из email
   * и устанавливает новый пароль.
   *
   * @param newPasswordDto - данные для смены пароля (newPassword, recoveryCode)
   * @returns 204 No Content при успешной смене пароля
   */
  @Post('new-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Confirm password recovery',
  })
  @ApiResponse({
    status: 204,
    description: 'If code is valid and new password is accepted',
  })
  @ApiResponse({
    status: 400,
    description:
      'If the inputModel has incorrect value (for incorrect password length) or RecoveryCode is incorrect or expired',
    type: ApiErrorResult,
  })
  @ApiResponse({
    status: 429,
    description: 'More than 5 attempts from one IP-address during 10 seconds',
  })
  async newPassword(@Body() newPasswordDto: NewPasswordDto) {
    return this.authService.setNewPassword(
      newPasswordDto.newPassword,
      newPasswordDto.recoveryCode,
    );
  }

  /**
   * Обновление токенов
   *
   * Генерирует новую пару access и refresh токенов
   * на основе refresh токена из cookie.
   *
   * @param req - HTTP запрос с refresh токеном в cookie
   * @returns новые access и refresh токены
   */
  @Post('refresh-token')
  @ApiOperation({
    summary: 'Generate new pair of access and refresh token',
  })
  @ApiResponse({
    status: 200,
    description:
      'Returns JWT accessToken (expired after 5 minutes) in body and JWT refreshToken in cookie (http-only, secure) (expired 7 days).',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async refreshToken(@Req() req, @Res({ passthrough: true }) res: any) {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const result = await this.authService.refreshTokens(refreshToken);

    // Берем TTL из env (поддержка форматов 120000 | 60s | 2m | 1h | 7d)
    const accessMaxAgeMs = this.parseTtlToMs(
      process.env.JWT_ACCESS_EXPIRATION_TIME,
      '5m',
    );
    const refreshMaxAgeMs = this.parseTtlToMs(
      process.env.JWT_REFRESH_EXPIRATION_TIME,
      '7d',
    );

    // Устанавливаем новый accessToken в обычный cookie
    res.cookie('accessToken', result.accessToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: accessMaxAgeMs,
      path: '/',
    });

    // Устанавливаем новый refreshToken в httpOnly cookie
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: refreshMaxAgeMs,
      path: '/',
    });

    // Возвращаем accessToken в теле ответа для совместимости
    return {
      accessToken: result.accessToken,
    };
  }

  /**
   * Выход из системы
   *
   * Аннулирует refresh токен пользователя.
   * Refresh токен должен быть передан в HTTP-only cookie.
   *
   * @returns 204 No Content при успешном выходе
   */
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary:
      'In cookie client must send correct refreshToken that will be revoked',
  })
  @ApiResponse({
    status: 204,
    description: 'Logout successfully',
  })
  async logout() {
    return this.authService.logout();
  }

  /**
   * Информация о текущем пользователе
   *
   * Возвращает информацию о пользователе на основе JWT токена.
   * Требует авторизации через Bearer токен.
   *
   * @param req - HTTP запрос с JWT токеном
   * @returns информация о пользователе
   */
  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: 'Get information about current user',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: AuthMeDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async getMe(@Req() req): Promise<AuthMeDto> {
    return this.authService.getCurrentUser(req.user.userId);
  }
}
