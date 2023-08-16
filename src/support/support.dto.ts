import { ListDto } from '@/shared/dtos/common.dto';
import { User } from '@/user/user.entity';
import { ApiHideProperty } from '@nestjs/swagger';

export class ListSupportDto extends ListDto {
  @ApiHideProperty()
  user: User;
}
