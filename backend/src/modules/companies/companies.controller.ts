import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { CompanyModel } from './models/company.model';
import { CompaniesService } from './companies.service';

/**
 * API HTTP do recurso `companies`.
 */
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  /**
   * Endpoint de smoke test para deploy e monitoramento.
   */
  @Get('admin/test')
  getAdminTest(): { readonly status: string } {
    return { status: 'ok' };
  }

  /**
   * Cria uma empresa (com conta de acesso).
   */
  @Post()
  create(@Body() dto: CreateCompanyDto): Promise<CompanyModel> {
    return this.companiesService.create(dto);
  }
}

