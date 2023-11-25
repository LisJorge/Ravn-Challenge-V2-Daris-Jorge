export function formatFileName(filename: string){
  const originalFileName = filename.split('.')
  const fileExtension = originalFileName[originalFileName.length -1];
  return `${Date.now()}.${fileExtension}`;
}