"use client";

import { useEffect, useState } from "react";
import { DoctorCard } from "@/components/DoctorCard";
import { PublicShell } from "@/components/public/public-shell";
import { Input } from "@/components/ui/input";
import { useApi } from "@/hooks/use-api";
import { publicService } from "@/services/public.service";

/* ------------ CARD COLORS ------------ */

const colors = [
  "bg-blue-100",
  "bg-green-100",
  "bg-yellow-100",
  "bg-purple-100",
  "bg-pink-100",
  "bg-orange-100",
  "bg-red-100",
  "bg-indigo-100",
  "bg-teal-100",
  "bg-cyan-100",
];

/* ---------------- DEMO DOCTORS ---------------- */

const demoDoctors = [
  { id: 101, name: "Dr. Amit Sharma", specialization: "Cardiologist", experienceYears: 12, email: "amit@hospital.com", phone: "9876543210", hospital: "Apollo Hospital", rating: "4.8" },
  { id: 102, name: "Dr. Neha Patel", specialization: "Dermatologist", experienceYears: 9, email: "neha@hospital.com", phone: "9823456712", hospital: "Fortis Hospital", rating: "4.6" },
  { id: 103, name: "Dr. Raj Verma", specialization: "Orthopedic Surgeon", experienceYears: 15, email: "raj@hospital.com", phone: "9812345670", hospital: "City Care Hospital", rating: "4.9" },
  { id: 104, name: "Dr. Priya Nair", specialization: "Pediatrician", experienceYears: 8, email: "priya@hospital.com", phone: "9876123456", hospital: "Rainbow Hospital", rating: "4.5" },
  { id: 105, name: "Dr. Ankit Gupta", specialization: "Neurologist", experienceYears: 11, email: "ankit@hospital.com", phone: "9123456780", hospital: "AIIMS", rating: "4.7" },
  { id: 106, name: "Dr. Kavita Singh", specialization: "Gynecologist", experienceYears: 13, email: "kavita@hospital.com", phone: "9988776655", hospital: "Mother Care Hospital", rating: "4.6" },
  { id: 107, name: "Dr. Rohit Mehta", specialization: "ENT Specialist", experienceYears: 7, email: "rohit@hospital.com", phone: "9098765432", hospital: "Metro Hospital", rating: "4.4" },
  { id: 108, name: "Dr. Sneha Iyer", specialization: "Oncologist", experienceYears: 14, email: "sneha@hospital.com", phone: "9876001234", hospital: "Cancer Care Institute", rating: "4.8" },
  { id: 109, name: "Dr. Arjun Reddy", specialization: "Urologist", experienceYears: 10, email: "arjun@hospital.com", phone: "9811112345", hospital: "Global Hospital", rating: "4.7" },
  { id: 110, name: "Dr. Meera Kapoor", specialization: "Psychiatrist", experienceYears: 6, email: "meera@hospital.com", phone: "9898989898", hospital: "Mind Wellness Center", rating: "4.5" },
  { id: 111, name: "Dr. Vikram Joshi", specialization: "Radiologist", experienceYears: 12, email: "vikram@hospital.com", phone: "9871112233", hospital: "Scan Diagnostic Center", rating: "4.6" },
  { id: 112, name: "Dr. Pooja Desai", specialization: "Endocrinologist", experienceYears: 9, email: "pooja@hospital.com", phone: "9887766554", hospital: "LifeCare Hospital", rating: "4.5" },
  { id: 113, name: "Dr. Sanjay Kulkarni", specialization: "Nephrologist", experienceYears: 16, email: "sanjay@hospital.com", phone: "9991112233", hospital: "Kidney Care Center", rating: "4.9" },
  { id: 114, name: "Dr. Riya Shah", specialization: "Ophthalmologist", experienceYears: 7, email: "riya@hospital.com", phone: "9822223344", hospital: "Vision Eye Hospital", rating: "4.6" },
  { id: 115, name: "Dr. Manish Yadav", specialization: "Pulmonologist", experienceYears: 11, email: "manish@hospital.com", phone: "9812233445", hospital: "Lung Care Hospital", rating: "4.7" },
  { id: 116, name: "Dr. Aisha Khan", specialization: "Dentist", experienceYears: 8, email: "aisha@hospital.com", phone: "9878887776", hospital: "Smile Dental Clinic", rating: "4.5" },
  { id: 117, name: "Dr. Deepak Mishra", specialization: "General Surgeon", experienceYears: 17, email: "deepak@hospital.com", phone: "9890001122", hospital: "Surgical Care Center", rating: "4.9" },
  { id: 118, name: "Dr. Anjali Gupta", specialization: "Pathologist", experienceYears: 10, email: "anjali@hospital.com", phone: "9871237890", hospital: "Lab Diagnostics", rating: "4.4" },
  { id: 119, name: "Dr. Karan Malhotra", specialization: "Plastic Surgeon", experienceYears: 14, email: "karan@hospital.com", phone: "9820002233", hospital: "Cosmetic Surgery Center", rating: "4.8" },
  { id: 120, name: "Dr. Shweta Patil", specialization: "Family Medicine", experienceYears: 9, email: "shweta@hospital.com", phone: "9765432100", hospital: "Family Health Clinic", rating: "4.6" },
  { id: 121, name: "Dr. Rahul Bansal", specialization: "Gastroenterologist", experienceYears: 13, email: "rahul@hospital.com", phone: "9874501236", hospital: "Digestive Care Hospital", rating: "4.7" },
  { id: 122, name: "Dr. Tanvi Kulkarni", specialization: "Rheumatologist", experienceYears: 10, email: "tanvi@hospital.com", phone: "9897654321", hospital: "Arthritis Care Center", rating: "4.6" },
  { id: 123, name: "Dr. Sameer Khan", specialization: "Hematologist", experienceYears: 11, email: "sameer@hospital.com", phone: "9823459987", hospital: "Blood Care Institute", rating: "4.8" },
  { id: 124, name: "Dr. Nidhi Verma", specialization: "Allergist", experienceYears: 7, email: "nidhi@hospital.com", phone: "9876543210", hospital: "Allergy Care Center", rating: "4.5" },
  { id: 125, name: "Dr. Aditya Singh", specialization: "Infectious Disease Specialist", experienceYears: 12, email: "aditya@hospital.com", phone: "9876543210", hospital: "Infectious Disease Center", rating: "4.7" },

  { id: 126, name: "Dr. Kavya Reddy", specialization: "Diabetologist", experienceYears: 9, email: "kavya@hospital.com", phone: "9812349876", hospital: "Diabetes Care Clinic", rating: "4.6" },
  { id: 127, name: "Dr. Mohit Agarwal", specialization: "Hepatologist", experienceYears: 14, email: "mohit@hospital.com", phone: "9898981234", hospital: "Liver Care Hospital", rating: "4.7" }
];

export default function DoctorsPage() {

  const [specialty, setSpecialty] = useState("");

  const { data, execute } = useApi(publicService.getDoctors);

  useEffect(() => {
    void execute(specialty || undefined);
  }, [execute, specialty]);

  const doctors = [...(data || []), ...demoDoctors];

  const filteredDoctors = doctors.filter((doctor) =>
    doctor.specialization.toLowerCase().includes(specialty.toLowerCase())
  );

  return (
    <PublicShell>

      <div className="mx-auto max-w-7xl px-4 py-12">

        <div className="mb-8 flex items-center justify-between gap-4">

          <h1 className="text-3xl font-bold">Our Doctors</h1>

          <Input
            value={specialty}
            onChange={(event) => setSpecialty(event.target.value)}
            className="max-w-sm"
            placeholder="Filter by specialization"
          />

        </div>

        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

          {filteredDoctors.map((doctor, index) => (

            <div
              key={`${doctor.id}-${index}`}
              className={`rounded-xl shadow-lg p-5 hover:scale-105 transition ${colors[index % colors.length]}`}
            >

              <DoctorCard
                name={doctor.name}
                specialization={doctor.specialization}
                experienceYears={doctor.experienceYears}
                email={doctor.email}
              />

              <div className="mt-3 text-sm space-y-1">

                {(doctor as any).phone && (
                  <p><b>Phone:</b> {(doctor as any).phone}</p>
                )}

                {(doctor as any).hospital && (
                  <p><b>Hospital:</b> {(doctor as any).hospital}</p>
                )}

                {(doctor as any).rating && (
                  <p><b>Rating:</b> ⭐ {(doctor as any).rating}</p>
                )}

              </div>

            </div>

          ))}

        </div>

      </div>

    </PublicShell>
  );
}