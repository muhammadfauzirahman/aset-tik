import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function makeAdmin() {
  const email = "admin@aseti-tik.com";
  
  try {
    const user = await prisma.user.update({
      where: { email },
      data: { role: "admin" },
    });
    
    console.log(`✅ User ${email} has been promoted to ADMIN.`);
    console.log(`User ID: ${user.id}`);
  } catch (error) {
    const err = error as Error;
    console.error(`❌ Failed to promote user: ${err.message}`);
  } finally {
    await prisma.$disconnect();
  }
}

makeAdmin();
