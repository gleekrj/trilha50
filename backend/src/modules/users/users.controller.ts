import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserModel } from './models/user.model';
import { UsersService } from './users.service';

/**
 * API HTTP do recurso `users`.
 */
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Endpoint de smoke test para deploy e monitoramento.
   */
  @Get('admin/test')
  getAdminTest(): { readonly status: string } {
    return { status: 'ok' };
  }

  /**
   * Cria um usuário.
   */
  @Post()
  create(@Body() dto: CreateUserDto): Promise<UserModel> {
    return this.usersService.create(dto);
  }

  /**
   * Lista todos os usuários.
   */
  @Get()
  findAll(): Promise<UserModel[]> {
    return this.usersService.findAll();
  }

  /**
   * Busca um usuário pelo id.
   */
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<UserModel> {
    return this.usersService.findOne(id);
  }

  /**
   * Atualiza um usuário.
   */
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<UserModel> {
    return this.usersService.update(id, dto);
  }

  /**
   * Remove um usuário.
   */
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.usersService.remove(id);
  }
}
