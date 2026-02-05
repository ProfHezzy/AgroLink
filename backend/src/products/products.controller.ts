import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Prisma } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
export class ProductsController {
    constructor(private productsService: ProductsService) { }

    /**
     * GET /products
     * Retrieve all products with optional pagination
     */
    @Get()
    async findAll(
        @Query('skip') skip?: string,
        @Query('take') take?: string,
        @Query('category') category?: string,
    ) {
        const where: Prisma.ProductWhereInput = category
            ? { category: { contains: category, mode: 'insensitive' } }
            : {};

        return this.productsService.findAll({
            skip: skip ? parseInt(skip) : undefined,
            take: take ? parseInt(take) : undefined,
            where,
            orderBy: { createdAt: 'desc' },
        });
    }

    /**
     * GET /products/search?q=query
     * Search products by name, category, or description
     */
    @Get('search')
    async search(@Query('q') query: string) {
        return this.productsService.search(query);
    }

    /**
     * GET /products/:id
     * Get a single product by ID
     */
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.productsService.findOne(id);
    }

    /**
     * POST /products
     * Create a new product (protected route - requires authentication)
     */
    @UseGuards(AuthGuard('jwt'))
    @Post()
    async create(@Body() data: CreateProductDto, @Request() req: any) {
        console.log(`Creating product for user: ${req.user.userId}`);
        // Ensure the product is associated with the authenticated user
        const { name, description, price, bulkPrice, quantity, category, images } = data;

        return this.productsService.create({
            name,
            description,
            price: price.toString(), // Prisma Decimal expects string or Decimal object
            bulkPrice: bulkPrice ? bulkPrice.toString() : null,
            quantity,
            category,
            images: images || [],
            owner: {
                connect: { id: req.user.userId },
            },
        });
    }

    /**
     * PUT /products/:id
     * Update an existing product (protected route)
     */
    @UseGuards(AuthGuard('jwt'))
    @Put(':id')
    async update(@Param('id') id: string, @Body() data: CreateProductDto, @Request() req: any) {
        // Verify ownership
        const product = await this.productsService.findOne(id);
        if (!product) throw new Error('Product not found');

        if (req.user.role !== 'ADMIN' && product.ownerId !== req.user.userId) {
            throw new Error('Unauthorized');
        }

        const { name, description, price, bulkPrice, quantity, category, images } = data;

        return this.productsService.update(id, {
            name,
            description,
            price: price.toString(),
            bulkPrice: bulkPrice ? bulkPrice.toString() : null,
            quantity,
            category,
            images: images || [],
        });
    }

    /**
     * DELETE /products/:id
     * Delete a product (protected route)
     */
    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.productsService.delete(id);
    }

    /**
     * GET /products/member/me
     * Get products owned by the authenticated farmer
     */
    @UseGuards(AuthGuard('jwt'))
    @Get('member/me')
    async getMyProducts(@Request() req: any) {
        return this.productsService.findAll({
            where: { ownerId: req.user.userId },
            orderBy: { createdAt: 'desc' }
        });
    }

    /**
     * GET /products/member/stats
     * Get stats for the authenticated farmer
     */
    @UseGuards(AuthGuard('jwt'))
    @Get('member/stats')
    async getMyStats(@Request() req: any) {
        return this.productsService.getFarmerStats(req.user.userId);
    }
}
