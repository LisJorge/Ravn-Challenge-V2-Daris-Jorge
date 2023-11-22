import { HttpStatus } from "@nestjs/common";
import { ApiResponseOptions } from "@nestjs/swagger";

export const FORBIDDEN_RESPONSE: ApiResponseOptions = 
  {
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden'
  }

export const UNAUTHORIZED_RESPONSE: ApiResponseOptions = {
  status: HttpStatus.UNAUTHORIZED,
  description: 'Unauthorized'
}

export const BAD_REQUEST_RESPONSE: ApiResponseOptions = 
  {
    status: HttpStatus.BAD_REQUEST,
    description: 'The input data provided could contain errors'
  }

export const CREATED_RESPONSE:ApiResponseOptions = 
  {
    status: HttpStatus.CREATED,
    description: 'Resource created succesfully',    
  }

export const UPDATE_RESPONSE:ApiResponseOptions = 
  {
    status: HttpStatus.NO_CONTENT,
    description: 'Resource updated succesfully'
  }

export const GENERAL_RESPONSE:ApiResponseOptions =
  {
    status: HttpStatus.OK,
    description: 'Operation permormed as expected'
  }