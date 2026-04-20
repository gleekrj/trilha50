import { CompanyModel } from '../models/company.model';
import { CreateCompanyPersistence } from './create-company.persistence';

/**
 * Contrato para persistência e leitura do recurso de empresas.
 */
export interface ICompaniesRepository {
  create(data: CreateCompanyPersistence): Promise<CompanyModel>;
}

