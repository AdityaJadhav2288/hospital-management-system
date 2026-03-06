const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const FIXED_ADMIN_EMAIL = "adityajadhav121248@gmail.com";
const FIXED_ADMIN_PASSWORD = "aditya123";

const doctors = [
  ["Dr. Aarav Mehta", "Cardiologist", 14, "aarav.mehta@hospital.com", "9876501001", "Cardiology"],
  ["Dr. Isha Kapoor", "Neurologist", 11, "isha.kapoor@hospital.com", "9876501002", "Neurology"],
  ["Dr. Rohan Verma", "Orthopedic", 9, "rohan.verma@hospital.com", "9876501003", "Orthopedics"],
  ["Dr. Sana Sheikh", "Dermatologist", 8, "sana.sheikh@hospital.com", "9876501004", "Dermatology"],
  ["Dr. Vivaan Nair", "Pediatrician", 12, "vivaan.nair@hospital.com", "9876501005", "Pediatrics"],
  ["Dr. Myra Joshi", "Psychiatrist", 10, "myra.joshi@hospital.com", "9876501006", "Psychiatry"],
  ["Dr. Arjun Malhotra", "Gynecologist", 15, "arjun.malhotra@hospital.com", "9876501007", "Gynecology"],
  ["Dr. Kiara Sinha", "ENT", 7, "kiara.sinha@hospital.com", "9876501008", "ENT"],
  ["Dr. Dev Patel", "Urologist", 13, "dev.patel@hospital.com", "9876501009", "Urology"],
  ["Dr. Anaya Rao", "Gastroenterologist", 11, "anaya.rao@hospital.com", "9876501010", "Gastroenterology"],
  ["Dr. Reyansh Bhatia", "Nephrologist", 16, "reyansh.bhatia@hospital.com", "9876501011", "Nephrology"],
  ["Dr. Tara Menon", "Oncologist", 12, "tara.menon@hospital.com", "9876501012", "Oncology"],
  ["Dr. Kabir Chawla", "Radiologist", 9, "kabir.chawla@hospital.com", "9876501013", "Radiology"],
  ["Dr. Anika Das", "Endocrinologist", 8, "anika.das@hospital.com", "9876501014", "Endocrinology"],
  ["Dr. Yash Khanna", "Pulmonologist", 14, "yash.khanna@hospital.com", "9876501015", "Pulmonology"],
  ["Dr. Nitya Iyer", "General Physician", 10, "nitya.iyer@hospital.com", "9876501016", "General Medicine"],
  ["Dr. Dhruv Agarwal", "Surgeon", 17, "dhruv.agarwal@hospital.com", "9876501017", "Surgery"],
  ["Dr. Riya Banerjee", "Ophthalmologist", 9, "riya.banerjee@hospital.com", "9876501018", "Ophthalmology"],
  ["Dr. Siddharth Jain", "Immunologist", 13, "siddharth.jain@hospital.com", "9876501019", "Immunology"],
  ["Dr. Mehek Arora", "Dentist", 6, "mehek.arora@hospital.com", "9876501020", "Dental Care"],
  ["Dr. Aditya Kulkarni", "Cardiologist", 18, "aditya.kulkarni@hospital.com", "9876501021", "Cardiology"],
  ["Dr. Pihu Reddy", "Neurologist", 9, "pihu.reddy@hospital.com", "9876501022", "Neurology"],
  ["Dr. Neil Thomas", "Orthopedic", 12, "neil.thomas@hospital.com", "9876501023", "Orthopedics"],
  ["Dr. Kavya Bansal", "Dermatologist", 7, "kavya.bansal@hospital.com", "9876501024", "Dermatology"],
  ["Dr. Samar Gupta", "Pediatrician", 11, "samar.gupta@hospital.com", "9876501025", "Pediatrics"],
  ["Dr. Zoya Ali", "Psychiatrist", 10, "zoya.ali@hospital.com", "9876501026", "Psychiatry"],
  ["Dr. Parth Deshmukh", "Gynecologist", 13, "parth.deshmukh@hospital.com", "9876501027", "Gynecology"],
  ["Dr. Aditi Paul", "ENT", 8, "aditi.paul@hospital.com", "9876501028", "ENT"],
  ["Dr. Manav Srivastava", "Urologist", 12, "manav.srivastava@hospital.com", "9876501029", "Urology"],
  ["Dr. Trisha Roy", "Gastroenterologist", 15, "trisha.roy@hospital.com", "9876501030", "Gastroenterology"],
];

function profileImage(name) {
  return `https://ui-avatars.com/api/?background=0f766e&color=ffffff&name=${encodeURIComponent(name)}`;
}

async function main() {
  const adminPasswordHash = await bcrypt.hash(FIXED_ADMIN_PASSWORD, 10);

  await prisma.admin.upsert({
    where: { email: FIXED_ADMIN_EMAIL },
    update: {
      name: "Hospital Administrator",
      password: adminPasswordHash,
    },
    create: {
      name: "Hospital Administrator",
      email: FIXED_ADMIN_EMAIL,
      password: adminPasswordHash,
    },
  });

  await prisma.admin.deleteMany({
    where: {
      email: {
        not: FIXED_ADMIN_EMAIL,
      },
    },
  });

  const departments = [...new Set(doctors.map(([, , , , , department]) => department))];

  for (const department of departments) {
    await prisma.department.upsert({
      where: { name: department },
      update: {
        description: `${department} department`,
      },
      create: {
        name: department,
        description: `${department} department`,
      },
    });
  }

  const doctorPasswordHash = await bcrypt.hash("doctor123", 10);
  const seededEmails = doctors.map(([, , , email]) => email);

  for (const [name, specialization, experience, email, phone, department] of doctors) {
    await prisma.doctor.upsert({
      where: { email },
      update: {
        name,
        specialization,
        experience,
        phone,
        department,
        profileImage: profileImage(name),
        bio: `${specialization} consultant with ${experience} years of clinical experience in the ${department} department.`,
      },
      create: {
        name,
        specialization,
        email,
        password: doctorPasswordHash,
        experience,
        phone,
        department,
        profileImage: profileImage(name),
        bio: `${specialization} consultant with ${experience} years of clinical experience in the ${department} department.`,
      },
    });
  }

  await prisma.doctor.deleteMany({
    where: {
      email: {
        notIn: seededEmails,
      },
    },
  });

  console.log("Seed complete: fixed admin and 30 predefined doctors are available.");
  console.log(`Admin login: ${FIXED_ADMIN_EMAIL} / ${FIXED_ADMIN_PASSWORD}`);
  console.log("Doctor default password: doctor123");
}

main()
  .catch((error) => {
    console.error("Seed failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
