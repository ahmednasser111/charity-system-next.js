import dbConnect from '@/lib/dbConnect';
import Patient from '@/models/Patient';
import { CreatePatientDialog, EditPatientDialog } from '@/components/dashboard/patients/CreatePatientDialog';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Requested Cost</TableHead>
              <TableHead>Date Added</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No patients found.
                </TableCell>
              </TableRow>
            ) : (
              patients.map((patient) => (
                <TableRow key={patient._id.toString()}>
                  <TableCell className="font-medium">{patient.name}</TableCell>
                  <TableCell>{patient.phone}</TableCell>
                  <TableCell>{patient.status}</TableCell>
                  <TableCell>${patient.cost}</TableCell>
                  <TableCell>{new Date(patient.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <EditPatientDialog patient={patient} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
