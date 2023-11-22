import * as bcrypt from 'bcrypt';

export async function encodePassword(rawPassword:string): Promise<string>{
  return bcrypt.hashedPassword(rawPassword, process.env.SALT_ROUNDS);
}
export function checkPassword(dbPassword: string, loginPassword: string){
  return bcrypt.compare(dbPassword, loginPassword);
}