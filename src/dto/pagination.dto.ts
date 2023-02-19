import {
  IsInt,
  IsNumber,
  IsNumberString,
  IsOptional,
  Length,
  Max,
  Min,
} from 'class-validator';

export class Pagination {
  @IsNumberString()
  @IsOptional()
  limit?: number;

  @IsNumberString()
  @IsOptional()
  page?: number;
}
