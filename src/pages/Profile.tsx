import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useProfile } from "@/hooks/useProfile";
import { ProgressSteps } from "@/components/ProgressSteps";

type ProfileFormData = {
  fullName: string;
  gender: string;
  age: string;
  complaint: string;
};

const Profile = () => {
  const navigate = useNavigate();
  const { profile, updateProfile } = useProfile();
  const steps = ["Sign Up", "Profile", "Medical Info", "Payment"];
  
  const form = useForm<ProfileFormData>({
    defaultValues: {
      fullName: profile.full_name || "",
      gender: profile.gender || "",
      age: profile.age || "",
      complaint: profile.complaint || "",
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
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
        <ProgressSteps steps={steps} currentStep={1} />
        <h1 className="text-2xl font-bold mb-6">Profile</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="complaint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Complaint</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Continue to Medical Info</Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Profile;