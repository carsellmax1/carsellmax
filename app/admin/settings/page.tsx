"use client";

import { AdminLayout } from "@/components/layouts/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  Settings, 
  User, 
  Shield, 
  Bell, 
  Database,
  Save,
  RefreshCw
} from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    // General Settings
    companyName: "CarSellMax",
    companyEmail: "admin@carsellmax.com",
    companyPhone: "+1 (555) 123-4567",
    companyAddress: "123 Business St, City, State 12345",
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    dailyReports: true,
    weeklyReports: false,
    
    // System Settings
    autoApproveQuotes: false,
    requirePhotoVerification: true,
    maxFileSize: "10",
    quoteExpiryDays: "7",
    
    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: "30",
    passwordExpiry: "90",
    ipWhitelist: "",
    
    // API Settings
    enableApiLogging: true,
    rateLimitPerMinute: "100",
    enableWebhooks: false,
    webhookUrl: "",
  });

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Settings saved:", settings);
      // Here you would typically make an API call to save settings
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    // Reset to default values
    setSettings({
      companyName: "CarSellMax",
      companyEmail: "admin@carsellmax.com",
      companyPhone: "+1 (555) 123-4567",
      companyAddress: "123 Business St, City, State 12345",
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      dailyReports: true,
      weeklyReports: false,
      autoApproveQuotes: false,
      requirePhotoVerification: true,
      maxFileSize: "10",
      quoteExpiryDays: "7",
      twoFactorAuth: false,
      sessionTimeout: "30",
      passwordExpiry: "90",
      ipWhitelist: "",
      enableApiLogging: true,
      rateLimitPerMinute: "100",
      enableWebhooks: false,
      webhookUrl: "",
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your platform settings and preferences
          </p>
        </div>

        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              General Settings
            </CardTitle>
            <CardDescription>
              Basic company information and contact details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={settings.companyName}
                  onChange={(e) => setSettings({...settings, companyName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyEmail">Company Email</Label>
                <Input
                  id="companyEmail"
                  type="email"
                  value={settings.companyEmail}
                  onChange={(e) => setSettings({...settings, companyEmail: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyPhone">Company Phone</Label>
                <Input
                  id="companyPhone"
                  value={settings.companyPhone}
                  onChange={(e) => setSettings({...settings, companyPhone: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyAddress">Company Address</Label>
                <Textarea
                  id="companyAddress"
                  value={settings.companyAddress}
                  onChange={(e) => setSettings({...settings, companyAddress: e.target.value})}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5" />
              Notification Settings
            </CardTitle>
            <CardDescription>
              Configure how you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications via email
                </p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => setSettings({...settings, emailNotifications: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>SMS Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications via SMS
                </p>
              </div>
              <Switch
                checked={settings.smsNotifications}
                onCheckedChange={(checked) => setSettings({...settings, smsNotifications: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Push Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive push notifications in browser
                </p>
              </div>
              <Switch
                checked={settings.pushNotifications}
                onCheckedChange={(checked) => setSettings({...settings, pushNotifications: checked})}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Daily Reports</Label>
                <p className="text-sm text-muted-foreground">
                  Receive daily summary reports
                </p>
              </div>
              <Switch
                checked={settings.dailyReports}
                onCheckedChange={(checked) => setSettings({...settings, dailyReports: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Weekly Reports</Label>
                <p className="text-sm text-muted-foreground">
                  Receive weekly summary reports
                </p>
              </div>
              <Switch
                checked={settings.weeklyReports}
                onCheckedChange={(checked) => setSettings({...settings, weeklyReports: checked})}
              />
            </div>
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="mr-2 h-5 w-5" />
              System Settings
            </CardTitle>
            <CardDescription>
              Configure system behavior and limits
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-approve Quotes</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically approve quotes without manual review
                </p>
              </div>
              <Switch
                checked={settings.autoApproveQuotes}
                onCheckedChange={(checked) => setSettings({...settings, autoApproveQuotes: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Require Photo Verification</Label>
                <p className="text-sm text-muted-foreground">
                  Require photo verification for all submissions
                </p>
              </div>
              <Switch
                checked={settings.requirePhotoVerification}
                onCheckedChange={(checked) => setSettings({...settings, requirePhotoVerification: checked})}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maxFileSize">Max File Size (MB)</Label>
                <Input
                  id="maxFileSize"
                  type="number"
                  value={settings.maxFileSize}
                  onChange={(e) => setSettings({...settings, maxFileSize: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quoteExpiryDays">Quote Expiry (Days)</Label>
                <Input
                  id="quoteExpiryDays"
                  type="number"
                  value={settings.quoteExpiryDays}
                  onChange={(e) => setSettings({...settings, quoteExpiryDays: e.target.value})}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Security Settings
            </CardTitle>
            <CardDescription>
              Configure security and access controls
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">
                  Require 2FA for admin access
                </p>
              </div>
              <Switch
                checked={settings.twoFactorAuth}
                onCheckedChange={(checked) => setSettings({...settings, twoFactorAuth: checked})}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => setSettings({...settings, sessionTimeout: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                <Input
                  id="passwordExpiry"
                  type="number"
                  value={settings.passwordExpiry}
                  onChange={(e) => setSettings({...settings, passwordExpiry: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ipWhitelist">IP Whitelist</Label>
              <Textarea
                id="ipWhitelist"
                placeholder="Enter IP addresses separated by commas"
                value={settings.ipWhitelist}
                onChange={(e) => setSettings({...settings, ipWhitelist: e.target.value})}
              />
            </div>
          </CardContent>
        </Card>

        {/* API Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="mr-2 h-5 w-5" />
              API Settings
            </CardTitle>
            <CardDescription>
              Configure API behavior and integrations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable API Logging</Label>
                <p className="text-sm text-muted-foreground">
                  Log all API requests and responses
                </p>
              </div>
              <Switch
                checked={settings.enableApiLogging}
                onCheckedChange={(checked) => setSettings({...settings, enableApiLogging: checked})}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rateLimitPerMinute">Rate Limit (requests/minute)</Label>
                <Input
                  id="rateLimitPerMinute"
                  type="number"
                  value={settings.rateLimitPerMinute}
                  onChange={(e) => setSettings({...settings, rateLimitPerMinute: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="webhookUrl">Webhook URL</Label>
                <Input
                  id="webhookUrl"
                  type="url"
                  placeholder="https://example.com/webhook"
                  value={settings.webhookUrl}
                  onChange={(e) => setSettings({...settings, webhookUrl: e.target.value})}
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Webhooks</Label>
                <p className="text-sm text-muted-foreground">
                  Send webhook notifications for events
                </p>
              </div>
              <Switch
                checked={settings.enableWebhooks}
                onCheckedChange={(checked) => setSettings({...settings, enableWebhooks: checked})}
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={handleReset} disabled={isLoading}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset to Defaults
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Settings
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}

