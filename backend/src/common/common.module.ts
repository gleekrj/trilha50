import { Global, Module } from '@nestjs/common';
import { PasswordHasherService } from './services/password-hasher.service';

/**
 * Módulo global para utilitários e serviços compartilhados.
 */
@Global()
@Module({
  providers: [PasswordHasherService],
  exports: [PasswordHasherService],
})
export class CommonModule {}

