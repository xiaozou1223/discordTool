import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { readFileSync } from 'fs';

@Injectable()
export class AppService {
  getIndex(): string {
    const filePath = join(__dirname, '..', 'public', 'index.html');
    const fileContent = readFileSync(filePath, 'utf-8');
    return fileContent;
  }
}
