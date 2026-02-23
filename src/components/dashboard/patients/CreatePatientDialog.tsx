'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { patientSchema, PatientInput } from '@/validations/patient';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useI18n } from '@/components/providers/I18nProvider';

interface BasePatientDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  initialValues?: Partial<PatientInput>;
  patientId?: string;
  mode: 'create' | 'edit';
  onSuccess?: () => void;
}

function BasePatientDialog({
  open,
  setOpen,
  initialValues,
  patientId,
  mode,
  onSuccess,
}: BasePatientDialogProps) {
  const { t } = useI18n();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<PatientInput>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      name: '',
      age: 0,
      phone: '',
      ssn: '',
      address: '',
      governorate: '',
      children: 0,
      status: 'pending',
      maritalStatus: 'single',
      diagnosis: '',
      solution: '',
      cost: 0,
      ...initialValues,
    },
  });

  async function onSubmit(data: PatientInput) {
    setIsLoading(true);
    try {
      const url = patientId ? `/api/patients/${patientId}` : '/api/patients';
      const method = patientId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error(t('patients.dialog.error'));
      }

      toast.success(t(mode === 'create' ? 'patients.dialog.successCreate' : 'patients.dialog.successUpdate'));
      setOpen(false);
      form.reset();
      router.refresh();
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || t('auth.errorGeneric'));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t(mode === 'create' ? 'patients.dialog.createTitle' : 'patients.dialog.editTitle')}</DialogTitle>
          <DialogDescription>
            {t(mode === 'create' ? 'patients.dialog.createDescription' : 'patients.dialog.editDescription')}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('patients.dialog.name')}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('patients.dialog.age')}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('patients.dialog.phone')}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="ssn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('patients.dialog.ssn')}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('patients.dialog.status')}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('patients.dialog.selectStatus')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {['pending', 'approved', 'rejected'].map((state) => (
                            <SelectItem key={state} value={state}>
                              {t(`patients.${state}`)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="maritalStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('patients.dialog.maritalStatus')}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('patients.dialog.selectMaritalStatus')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {['single', 'married', 'divorced', 'widowed'].map((status) => (
                            <SelectItem key={status} value={status}>
                              {t(`patients.dialog.${status}`)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="children"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('patients.dialog.children')}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('patients.dialog.cost')}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="governorate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('patients.dialog.governorate')}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('patients.dialog.address')}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="diagnosis"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('patients.dialog.diagnosis')}</FormLabel>
                    <FormControl>
                      <Textarea rows={3} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="solution"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('patients.dialog.solution')}</FormLabel>
                    <FormControl>
                      <Textarea rows={3} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading} className="w-full">
                {t(mode === 'create' ? 'patients.dialog.save' : 'patients.dialog.update')}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function CreatePatientDialog() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button suppressHydrationWarning>{t('patients.addPatient')}</Button>
      </DialogTrigger>
      <BasePatientDialog open={open} setOpen={setOpen} mode="create" />
    </Dialog>
  );
}

export function EditPatientDialog({
  patient,
}: {
  patient: any;
}) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" suppressHydrationWarning>
          {t('common.edit')}
        </Button>
      </DialogTrigger>
      <BasePatientDialog
        open={open}
        setOpen={setOpen}
        mode="edit"
        patientId={patient._id}
        initialValues={patient}
      />
    </Dialog>
  );
}
