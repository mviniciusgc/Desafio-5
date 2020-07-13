// import AppError from '../errors/AppError';

import { getRepository } from 'typeorm';
import Category from '../models/Category';

interface Request {
  title: 'string';
}

class GetCategoryService {
  public async execute({ title }: Request): Promise<Category> {
    const categoryRepository = getRepository(Category);

    const foundedCategory = await categoryRepository.findOne({
      where: {
        title,
      },
    });

    if (foundedCategory) {
      return foundedCategory;
    }

    const categoryCreated = await categoryRepository.create({
      title,
    });

    await categoryRepository.save(categoryCreated);

    return categoryCreated;
  }
}

export default GetCategoryService;
