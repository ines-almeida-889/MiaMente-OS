import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { authManager } from "@/lib/auth";
import { User } from "lucide-react";

interface RoleSwitcherProps {
  onRoleChange?: (role: string) => void;
}

export function RoleSwitcher({ onRoleChange }: RoleSwitcherProps) {
  const [currentRole, setCurrentRole] = useState<string>("parent");
  const [user, setUser] = useState(authManager.getState().user);

  useEffect(() => {
    const unsubscribe = authManager.subscribe((state) => {
      setUser(state.user);
      if (state.user) {
        setCurrentRole(state.user.role);
      }
    });

    return unsubscribe;
  }, []);

  const handleRoleChange = async (role: string) => {
    try {
      await authManager.switchRole(role as 'parent' | 'clinic' | 'insurance');
      setCurrentRole(role);
      onRoleChange?.(role);
    } catch (error) {
      console.error('Failed to switch role:', error);
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'parent':
        return 'Parent Dashboard';
      case 'clinic':
        return 'Clinic Dashboard';
      case 'insurance':
        return 'Insurance Dashboard';
      default:
        return 'Select Role';
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <Select value={currentRole} onValueChange={handleRoleChange}>
        <SelectTrigger className="w-[180px] bg-slate-100 border-slate-300">
          <SelectValue placeholder="Select role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="parent">Parent Dashboard</SelectItem>
          <SelectItem value="clinic">Clinic Dashboard</SelectItem>
          <SelectItem value="insurance">Insurance Dashboard</SelectItem>
        </SelectContent>
      </Select>
      
      <div className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors cursor-pointer">
        <User className="h-4 w-4" />
        <span>{user?.name || 'User'}</span>
      </div>
    </div>
  );
}
