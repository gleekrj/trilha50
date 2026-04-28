import { Controller, Get } from '@nestjs/common';

/**
 * Rotas HTTP na raiz (saúde da API e smoke tests).
 */
@Controller()
export class AppController {
  /**
   * Endpoint de smoke test para deploy e monitoramento.
   */
  @Get('admin/test')
  getAdminTest(): { readonly status: string } {
    return { status: 'ok' };
  }

  /**
   * Verificação simples de que a API está no ar.
   */
  @Get('health')
  health(): { readonly status: string } {
    return { status: 'ok' };
  }
}
