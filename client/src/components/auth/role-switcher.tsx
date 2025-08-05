import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { authManager } from "@/lib/auth";
import { User, Smile, Heart, Shield } from "lucide-react";

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

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'parent':
        return <Heart className="h-4 w-4 text-mia-pink" />;
      case 'clinic':
        return <Smile className="h-4 w-4 text-mia-blue" />;
      case 'insurance':
        return <Shield className="h-4 w-4 text-mia-yellow" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <Select value={currentRole} onValueChange={handleRoleChange}>
        <SelectTrigger className="w-[200px] bg-white/90 border-mia-pink/20 hover:border-mia-pink/40 transition-colors shadow-sm">
          <div className="flex items-center space-x-2">
            {getRoleIcon(currentRole)}
            <SelectValue placeholder="Select role" />
          </div>
        </SelectTrigger>
        <SelectContent className="bg-white/95 backdrop-blur-sm border-mia-pink/20">
          <SelectItem value="parent" className="hover:bg-mia-pink/10">
            <div className="flex items-center space-x-2">
              <Heart className="h-4 w-4 text-mia-pink" />
              <span>Parent Dashboard</span>
            </div>
          </SelectItem>
          <SelectItem value="clinic" className="hover:bg-mia-blue/10">
            <div className="flex items-center space-x-2">
              <Smile className="h-4 w-4 text-mia-blue" />
              <span>Clinic Dashboard</span>
            </div>
          </SelectItem>
          <SelectItem value="insurance" className="hover:bg-mia-yellow/10">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-mia-yellow" />
              <span>Insurance Dashboard</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
      
      <div className="flex items-center space-x-2 bg-white/90 hover:bg-mia-pink/5 rounded-xl px-4 py-2 text-sm font-medium text-mia-navy transition-colors cursor-pointer shadow-sm border border-mia-pink/20">
        <User className="h-4 w-4 text-mia-blue" />
        <span>{user?.name || 'User'}</span>
      </div>
    </div>
  );
}
