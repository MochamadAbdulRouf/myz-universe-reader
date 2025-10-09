import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, User } from "lucide-react";
import { toast } from "sonner";

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
}

interface UserRole {
  user_id: string;
  role: "admin" | "user";
}

const AdminUsers = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [userRoles, setUserRoles] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data: profilesData, error: profilesError } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (profilesError) {
      toast.error("Error fetching users");
      return;
    }

    const { data: rolesData } = await supabase
      .from("user_roles")
      .select("user_id, role");

    const rolesMap = new Map<string, string>();
    rolesData?.forEach((role: UserRole) => {
      rolesMap.set(role.user_id, role.role);
    });

    setProfiles(profilesData || []);
    setUserRoles(rolesMap);
  };

  const toggleAdminRole = async (userId: string) => {
    const currentRole = userRoles.get(userId);
    const isAdmin = currentRole === "admin";

    if (isAdmin) {
      // Remove admin role
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId)
        .eq("role", "admin");

      if (error) {
        toast.error("Error removing admin role");
        return;
      }

      toast.success("Admin role removed");
    } else {
      // Add admin role
      const { error } = await supabase
        .from("user_roles")
        .insert([{ user_id: userId, role: "admin" }]);

      if (error) {
        toast.error("Error adding admin role");
        return;
      }

      toast.success("Admin role added");
    }

    fetchUsers();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Kelola User</h2>

      <div className="grid gap-4">
        {profiles.map((profile) => {
          const isAdmin = userRoles.get(profile.id) === "admin";

          return (
            <Card key={profile.id} className="hover-glow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      {isAdmin ? (
                        <Shield className="h-6 w-6 text-primary" />
                      ) : (
                        <User className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">
                          {profile.full_name || "No Name"}
                        </h3>
                        {isAdmin && (
                          <Badge variant="default">Admin</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {profile.email}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Joined: {new Date(profile.created_at).toLocaleDateString("id-ID")}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant={isAdmin ? "destructive" : "outline"}
                    onClick={() => toggleAdminRole(profile.id)}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    {isAdmin ? "Remove Admin" : "Make Admin"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {profiles.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">
                Belum ada user terdaftar
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
