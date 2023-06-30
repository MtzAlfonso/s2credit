/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateTodoDto, UpdateTodoDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Todo } from '@prisma/client';

@Injectable()
export class TodosService {
  private readonly logger = new Logger(TodosService.name);
  constructor(private readonly prisma: PrismaService) {}

  async create(createTodoDto: CreateTodoDto) {
    try {
      const todo = await this.prisma.todo.create({
        data: { ...createTodoDto },
        include: { History: true },
      });

      if (!!todo) return todo;

      return null;
    } catch (error) {
      this.handleError(error);
    }
  }

  async findAll(): Promise<Todo[]> {
    try {
      const todos = await this.prisma.todo.findMany({
        include: { History: true },
      });

      if (!todos) return [];

      return todos;
    } catch (error) {
      this.handleError(error);
    }
  }

  async findOne(id: string): Promise<Todo> {
    try {
      const todo = await this.prisma.todo.findUnique({
        where: { id: +id },
        include: { History: true },
      });

      if (!todo) throw new NotFoundException(`Todo with id ${id} not found`);

      return todo;
    } catch (error) {
      this.handleError(error);
    }
  }

  async update(id: string, updateTodoDto: UpdateTodoDto) {
    try {
      const existingTodo = await this.prisma.todo.findUnique({
        where: { id: +id },
      });

      const { id: _, ...rest } = updateTodoDto;

      const todo = await this.prisma.todo.upsert({
        where: { id: +id },
        create: {
          id: +id,
          userId: updateTodoDto.userId,
          title: updateTodoDto.title,
          completed: updateTodoDto.completed,
          updated: true,
          deleted: updateTodoDto.deleted,
          History: {
            create: {
              userId: updateTodoDto.userId,
              title: updateTodoDto.title,
              completed: updateTodoDto.completed,
            },
          },
        },
        update: {
          ...rest,
          updated: true,
          History: {
            create: existingTodo
              ? {
                  userId: existingTodo.userId,
                  title: existingTodo.title,
                  completed: existingTodo.completed,
                }
              : {
                  userId: updateTodoDto.userId,
                  title: updateTodoDto.title,
                  completed: updateTodoDto.completed,
                },
          },
        },
        include: { History: true },
      });

      return todo;
    } catch (error) {
      this.handleError(error);
    }
  }

  async restore(id: string, historyId: string) {
    try {
      await this.findOne(id);

      const history = await this.prisma.history.findUnique({
        where: { historyId },
      });

      if (!history) {
        throw new NotFoundException(`History with id ${id} not found`);
      }

      const todo = await this.prisma.todo.update({
        where: { id: +id },
        data: {
          title: history.title,
          completed: history.completed,
          updated: true,
          currentHistoryId: history.historyId,
        },
        include: { History: true },
      });

      return todo;
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: any) {
    this.logger.error(error);

    if (error instanceof NotFoundException) throw error;

    throw new InternalServerErrorException(error.message);
  }
}
