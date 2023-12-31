import * as bcrypt from 'bcrypt';

export async function encodePassword(rawPassword:string): Promise<string>{
  return bcrypt.hash(rawPassword,Number(process.env.SALT_ROUNDS));
}
export async function checkPassword(dbPassword: string, loginPassword: string){
  return bcrypt.compare(loginPassword, dbPassword);
}