import { IsString, IsNumber, IsOptional, IsArray, IsDecimal, Min } from 'class-validator';

export class CreateProductDto {
    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsNumber()
    @Min(0)
    price: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    bulkPrice?: number;

    @IsNumber()
    @Min(0)
    quantity: number;

    @IsString()
    category: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    images?: string[];
}
