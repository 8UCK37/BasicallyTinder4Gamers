const PrismaClient =require( '@prisma/client')

const prisma = new PrismaClient()

const newUser = await prisma.User.create({
    data: {
      name: 'Alice',
    },
  })