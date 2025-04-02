'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { NotificationSettingsFormValues, notificationSettingsSchema } from '@/lib/zod-schemas';
import { useAuth } from '@/hooks/useAuth';
import { useSettingsContext } from '@/hooks/useSettingsContext';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';

export default function NotificationSettingsForm() {
  const { user } = useAuth();
  const { settings, isLoading, updateNotifications, updateEmailNotifications } = useSettingsContext();
  
  const form = useForm<NotificationSettingsFormValues>({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: {
      notificationsEnabled: settings?.notificationsEnabled || false,
      emailNotificationsEnabled: settings?.emailNotificationsEnabled || false,
    },
    values: {
      notificationsEnabled: settings?.notificationsEnabled || false,
      emailNotificationsEnabled: settings?.emailNotificationsEnabled || false,
    },
  });
  
  const onSubmit = async (data: NotificationSettingsFormValues) => {
    if (!user) return;
    
    await updateNotifications(data.notificationsEnabled);
    await updateEmailNotifications(data.emailNotificationsEnabled);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="notificationsEnabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Уведомления в приложении</FormLabel>
                <FormDescription>
                  Получать уведомления о новых материалах и достижениях в приложении.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="emailNotificationsEnabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={!form.getValues().notificationsEnabled}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Email-уведомления</FormLabel>
                <FormDescription>
                  Получать важные уведомления по электронной почте.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Сохранение...' : 'Сохранить настройки'}
        </Button>
      </form>
    </Form>
  );
} 