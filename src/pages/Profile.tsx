import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type ProfileFormData = {
  fullName: string;
  gender: string;
  age: string;
  complaint: string;
};

const Profile = () => {
  const navigate = useNavigate();
  
  const handleSubmit = async (data: ProfileFormData) => {
    try {
      const userPhone = localStorage.getItem('userPhone');
      if (!userPhone) {
        toast.error("Please sign in to continue");
        navigate("/signin");
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: data.fullName,
          gender: data.gender,
          age: data.age,
          complaint: data.complaint,
        })
        .eq('phone', userPhone);

      if (error) throw error;

      toast.success("Profile updated successfully");
      navigate("/medical-information");
    } catch (error) {
      toast.error("Error updating profile");
      console.error("Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-6">
        <h1 className="text-2xl font-bold">Profile</h1>
        <Form onSubmit={handleSubmit}>
          <FormItem>
            <FormLabel htmlFor="fullName">Full Name</FormLabel>
            <FormControl>
              <Input id="fullName" name="fullName" required />
            </FormControl>
            <FormMessage />
          </FormItem>
          <FormItem>
            <FormLabel htmlFor="gender">Gender</FormLabel>
            <FormControl>
              <Input id="gender" name="gender" required />
            </FormControl>
            <FormMessage />
          </FormItem>
          <FormItem>
            <FormLabel htmlFor="age">Age</FormLabel>
            <FormControl>
              <Input id="age" name="age" required />
            </FormControl>
            <FormMessage />
          </FormItem>
          <FormItem>
            <FormLabel htmlFor="complaint">Complaint</FormLabel>
            <FormControl>
              <Input id="complaint" name="complaint" required />
            </FormControl>
            <FormMessage />
          </FormItem>
          <Button type="submit" className="mt-4">Update Profile</Button>
        </Form>
      </div>
    </div>
  );
};

export default Profile;
