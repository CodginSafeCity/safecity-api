import { ApiProperty } from '@nestjs/swagger';

class UploadIncidentFileDataDto {
  @ApiProperty({ example: '1e2d3f4g-5h6i-7j8k-9l0m-n1o2p3q4r5s6' })
  id!: string;

  @ApiProperty({ example: 'https://files.myserver.com/uploads/evidencia-123.jpg' })
  fileUrl!: string;
}

export class UploadIncidentFileResponseDto {
  @ApiProperty({ example: 201 })
  statusCode!: number;

  @ApiProperty({ example: 'File uploaded successfully' })
  message!: string;

  @ApiProperty({ type: UploadIncidentFileDataDto })
  data!: UploadIncidentFileDataDto;
}
