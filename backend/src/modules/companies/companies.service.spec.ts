import { ConflictException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Prisma } from '../../generated/prisma/client';
import { PasswordHasherService } from '../../common/services/password-hasher.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { CompanyModel } from './models/company.model';
import { ICompaniesRepository } from './repositories/companies.repository.interface';
import { COMPANIES_REPOSITORY } from './repositories/companies.repository.token';
import { CompaniesService } from './companies.service';

const mockCompany: CompanyModel = {
  id: 'company-1',
  name: 'Empresa Teste',
  email: 'contato@exemplo.com',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('CompaniesService', () => {
  let companiesService: CompaniesService;
  let companiesRepository: ICompaniesRepository;
  let passwordHasherService: PasswordHasherService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CompaniesService,
        {
          provide: COMPANIES_REPOSITORY,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: PasswordHasherService,
          useValue: {
            hashPassword: jest.fn(),
          },
        },
      ],
    }).compile();

    companiesService = moduleRef.get(CompaniesService);
    companiesRepository = moduleRef.get(COMPANIES_REPOSITORY);
    passwordHasherService = moduleRef.get(PasswordHasherService);
  });

  it('cria empresa com passwordHash e retorna CompanyModel', async () => {
    const inputDto: CreateCompanyDto = {
      name: 'Empresa Teste',
      email: 'contato@exemplo.com',
      password: 'senha12',
    };

    jest
      .spyOn(passwordHasherService, 'hashPassword')
      .mockResolvedValueOnce('hash-argon2id');
    jest.spyOn(companiesRepository, 'create').mockResolvedValueOnce(mockCompany);

    const result = await companiesService.create(inputDto);

    expect(passwordHasherService.hashPassword).toHaveBeenCalledWith('senha12');
    expect(companiesRepository.create).toHaveBeenCalledWith({
      name: inputDto.name,
      email: inputDto.email,
      passwordHash: 'hash-argon2id',
    });
    expect(result).toEqual(mockCompany);
  });

  it('mapeia erro de e-mail duplicado para ConflictException', async () => {
    const inputDto: CreateCompanyDto = {
      name: 'Empresa Teste',
      email: 'contato@exemplo.com',
      password: 'senha12',
    };

    jest
      .spyOn(passwordHasherService, 'hashPassword')
      .mockResolvedValueOnce('hash-argon2id');

    const prismaError = new Prisma.PrismaClientKnownRequestError('unique', {
      code: 'P2002',
      clientVersion: 'test',
    });

    jest.spyOn(companiesRepository, 'create').mockRejectedValueOnce(prismaError);

    await expect(companiesService.create(inputDto)).rejects.toBeInstanceOf(
      ConflictException,
    );
  });
});

