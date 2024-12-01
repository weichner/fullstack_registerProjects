import {
  Controller,
  Body,
  Query,
  HttpStatus,
  Post,
  UseGuards,
  HttpException,
  Param,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './DTO/create-user.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('register')
  async register(@Body() input: CreateUserDto) {
    return await this.userService.registerUser(input);
  }

  @UseGuards(RolesGuard)
  @Roles('admin user', 'operational user')
  @Post(':id/report-dedications')
  async reportDedications(
    @Param('id') userId: number,
    @Query('week-number') weekNumber: number,
    @Body() reportData: { projectId: number; dedicationPercentage: number }[],
  ) {
    // const results = [];

    // for (const report of reportData) {
    //   const result = await this.userService.reportDedications({
    //     projectId: report.projectId,
    //     weekNumber,
    //     dedicationPercentage: report.dedicationPercentage,
    //     userId,
    //   });
    //   results.push(result);
    // }

    const reports = reportData.map((report) => ({
      projectId: report.projectId,
      dedicationPercentage: report.dedicationPercentage,
      weekNumber,
      userId,
    }));

    const results = await this.userService.reportDedications(reports);

    // Checking erros
    const errors = results.filter((res) => !res.success);

    if (errors.length) {
      throw new HttpException(
        {
          message: 'Error reporting dedications',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      message: 'Reports created successfully',
      results,
    };
  }
}

// @UseGuards(RolesGuard)
// @Roles('admin user', 'operational user')
// @Post(':id/report-dedications')
// async reportDedications(
//   @Body('projectId') projectId: number,
//   @Param('id') userId: number,
//   @Query('week-number') weekNumber: number,
//   @Body('dedicationPercentage') dedicationPercentage: number,
// ) {
//   const result = await this.userService.reportDedications({
//     projectId,
//     weekNumber,
//     dedicationPercentage,
//     userId,
//   });

//   console.log(result);

//   if (!result.success) {
//     throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
//   }

//   return {
//     message: 'Report created successfully',
//   };
// }
