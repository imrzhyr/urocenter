import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const documentTypes = [
  {
    title: "Diagnostic Imaging",
    items: [
      "Ultrasound scans of kidneys, bladder, and prostate",
      "CT scans of the urinary tract",
      "MRI reports of the pelvic area",
      "X-rays of the urinary system",
      "Nuclear medicine scan results",
    ],
  },
  {
    title: "Laboratory Results",
    items: [
      "PSA (Prostate-Specific Antigen) test results",
      "Urinalysis reports",
      "Blood test results",
      "Kidney function tests",
      "Hormone level assessments",
    ],
  },
  {
    title: "Medical Documentation",
    items: [
      "Previous consultation notes",
      "Surgical reports and post-operative notes",
      "Treatment plans and protocols",
      "Medication prescriptions and history",
      "Hospital discharge summaries",
    ],
  },
  {
    title: "Special Tests",
    items: [
      "Urodynamic study results",
      "Cystoscopy reports",
      "Prostate biopsy results",
      "Stone analysis reports",
      "Genetic test results (if applicable)",
    ],
  },
];

export const UploadInformationDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Info className="h-5 w-5 text-muted-foreground" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>What to Upload</DialogTitle>
          <DialogDescription>
            To help us provide the best care possible, please upload any relevant medical documents from the following categories:
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-6">
            {documentTypes.map((category) => (
              <div key={category.title} className="animate-fade-in">
                <h3 className="font-semibold text-lg text-primary mb-2">
                  {category.title}
                </h3>
                <ul className="list-disc pl-5 space-y-1.5">
                  {category.items.map((item) => (
                    <li key={item} className="text-muted-foreground">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="bg-muted p-4 rounded-lg mt-4">
              <p className="text-sm text-muted-foreground">
                <strong>Important Note:</strong> Please ensure all documents are clear and readable. 
                We accept files in PDF, JPG, JPEG, and PNG formats. Each file should be less than 10MB.
              </p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};