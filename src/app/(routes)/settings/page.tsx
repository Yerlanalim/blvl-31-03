"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSettings } from "@/hooks/useSettings";
import { useAuth } from "@/hooks/useAuth";
import ProfileSettingsForm from "@/components/features/settings/ProfileSettingsForm";
import AppearanceSettingsForm from "@/components/features/settings/AppearanceSettingsForm";
import NotificationSettingsForm from "@/components/features/settings/NotificationSettingsForm";
import AccountSettingsForm from "@/components/features/settings/AccountSettingsForm";

export default function SettingsPage() {
  const { user } = useAuth();
  const { isLoading } = useSettings(user?.uid);

  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold">Настройки</h1>
        <p className="text-muted-foreground">
          Управляйте настройками своего аккаунта и приложения
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="profile">Профиль</TabsTrigger>
          <TabsTrigger value="appearance">Внешний вид</TabsTrigger>
          <TabsTrigger value="notifications">Уведомления</TabsTrigger>
          <TabsTrigger value="account">Аккаунт</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Профиль</CardTitle>
              <CardDescription>
                Управляйте своими личными данными. Эта информация будет видна другим пользователям.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileSettingsForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Внешний вид</CardTitle>
              <CardDescription>
                Настройте внешний вид приложения по вашему вкусу.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AppearanceSettingsForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Уведомления</CardTitle>
              <CardDescription>
                Настройте какие уведомления вы хотите получать и каким способом.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <NotificationSettingsForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Аккаунт</CardTitle>
              <CardDescription>
                Управляйте настройками своего аккаунта и безопасностью.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AccountSettingsForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 