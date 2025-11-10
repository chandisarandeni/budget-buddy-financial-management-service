import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SavingService } from './saving.service';
import { CreateSavingDto } from './dto/create-saving.dto';
import { UpdateSavingDto } from './dto/update-saving.dto';

@Controller('saving')
export class SavingController {
  constructor(private readonly savingService: SavingService) {}

  // ADD NEW SAVING
  @Post()
  create(@Body() createSavingDto: CreateSavingDto) {
    return this.savingService.create(createSavingDto);
  }

  // GET ALL SAVINGS
  @Get()
  findAll() {
    return this.savingService.findAll();
  }

  // FIND SAVING BY USER ID
  @Get('user/:userId')
  findByUserId(@Param('userId') userId: string) {
    return this.savingService.findByUserId(+userId);
  }

  // GET ALL NON-DELETED SAVINGS
  @Get('non-deleted')
  findAllNonDeleted() {
    return this.savingService.findAllNonDeleted();
  }

  // GET SAVING BY ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.savingService.findOne(+id);
  }

  // UPDATE SAVING BY ID
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSavingDto: UpdateSavingDto) {
    return this.savingService.update(+id, updateSavingDto);
  }

  // DELETE SAVING BY ID
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.savingService.remove(+id);
  }
}
