import { FileText, Image, FileVideo, FileAudio } from "lucide-react";
import { DocumentTypeCard } from "./DocumentTypeCard";

export const DocumentTypes = () => {
  const documentTypes = [
    {
      title: "Medical Reports",
      description: "Upload your medical reports and test results",
      icon: FileText,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Medical Images",
      description: "X-rays, MRIs, and other medical images",
      icon: Image,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Video Reports",
      description: "Medical procedure videos or consultations",
      icon: FileVideo,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Audio Records",
      description: "Voice notes or audio consultations",
      icon: FileAudio,
      color: "bg-orange-100 text-orange-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {documentTypes.map((type) => (
        <DocumentTypeCard key={type.title} {...type} />
      ))}
    </div>
  );
};