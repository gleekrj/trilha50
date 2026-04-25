import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { LoginResponseModel } from './models/login-response.model';
import { AuthService } from './auth.service';

/**
 * API HTTP de autenticação.
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Endpoint de smoke test para deploy e monitoramento.
   */
  @Get('admin/test')
  getAdminTest(): { readonly status: string } {
    return { status: 'ok' };
  }

  /**
   * Autentica usuário ou empresa por e-mail e senha.
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto): Promise<LoginResponseModel> {
    return this.authService.login(dto);
  }
}
