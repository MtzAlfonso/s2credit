import { MD5 } from 'crypto-js';

export function generateMD5Hash(str: string) {
  return MD5(str).toString();
}
