import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";

export const MigrateUsers = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleMigration = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('migrate-profiles-to-auth');
      
      if (error) {
        console.error('Migration error:', error);
        toast.error('Failed to migrate users');
        return;
      }

      console.log('Migration results:', data);
      
      if (data.success) {
        const results = data.results;
        const successful = results.filter(r => r.status === 'success').length;
        const skipped = results.filter(r => r.status === 'skipped').length;
        const failed = results.filter(r => r.status === 'error').length;
        
        toast.success(`Migration completed: ${successful} users migrated, ${skipped} skipped, ${failed} failed`);
      } else {
        toast.error('Migration failed');
      }
    } catch (error) {
      console.error('Error during migration:', error);
      toast.error('Failed to run migration');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleMigration}
      disabled={isLoading}
      className="w-full"
    >
      {isLoading ? 'Migrating Users...' : 'Migrate Users to Auth'}
    </Button>
  );
};