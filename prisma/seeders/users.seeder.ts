import { Role } from "@prisma/client"

export const USERS_SEED = [
  {
    name: 'Juan',
    lastname: 'Perez',
    email: 'juan498237@mailinator.com',
    role: Role.CLIENT,
    password: '$2a$12$JH3YHGDfp7E1bxR2jeOP7ek8dUJQZ8jE368s3KC3Lei/aYbR9GuBy',
  },
  {
    name: 'Diana',
    lastname: 'Hernandez',
    email: 'diana2313213hdz@mailinator.com',
    role: Role.MANAGER,
    password: '$2a$12$U8UgturDUp2IfYTXzbky6.uT6x1115Q5RKE6kICjg3a9OXeKG2Aou',
  },
]