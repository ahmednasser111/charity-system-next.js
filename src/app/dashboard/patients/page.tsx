import dbConnect from '@/lib/dbConnect';
import Patient from '@/models/Patient';
import { CreatePatientDialog } from '@/components/dashboard/patients/CreatePatientDialog';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { PatientsTable } from '@/components/dashboard/patients/PatientsTable';

export const dynamic = 'force-dynamic';

export default async function PatientsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || !['admin', 'user'].includes(session.user.role)) {
    redirect('/dashboard');
  }

  await dbConnect();
  const patientDocs = await Patient.find({}).sort({ createdAt: -1 }).lean();

  const patients = patientDocs.map((p: any) => ({
    _id: p._id.toString(),
    name: p.name,
    age: p.age,
    ssn: p.ssn,
    phone: p.phone,
    maritalStatus: p.maritalStatus,
    status: p.status,
    children: p.children,
    governorate: p.governorate,
    address: p.address,
    diagnosis: p.diagnosis,
    solution: p.solution,
    cost: p.cost,
    createdAt: p.createdAt?.toISOString?.() ?? String(p.createdAt),
    updatedAt: p.updatedAt?.toISOString?.() ?? String(p.updatedAt),
  }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Patients</h1>
        <CreatePatientDialog />
      </div>

      <div className="rounded-md border bg-white">
        <PatientsTable patients={patients} />
      </div>
    </div>
  );
}
