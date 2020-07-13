import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';

import GetCategoryService from './GetCategoryService';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: 'string';
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionsRepository);

    const { total } = await transactionRepository.getBalance();

    if (type === 'outcome' && value > total)
      throw new AppError('Oppss! Do u not have this money 😥');

    const categoryService = new GetCategoryService();

    const foundedCategory = await categoryService.execute({ title: category });

    const transactionCreated = await transactionRepository.create({
      category_id: foundedCategory.id,
      title,
      type,
      value,
    });

    await transactionRepository.save(transactionCreated);

    return transactionCreated;
  }
}

export default CreateTransactionService;
