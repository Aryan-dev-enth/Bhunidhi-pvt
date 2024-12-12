"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface AIAnalysisProps {
  selectedFile: File | null;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  generateConclusion: () => Promise<void>;
  isGenerating: boolean;
  aiResponse: string;
}

export function AIAnalysis({
  selectedFile,
  handleFileChange,
  generateConclusion,
  isGenerating,
  aiResponse,
}: AIAnalysisProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  let parsedResponse: any;

  try {
    parsedResponse = aiResponse ? JSON.parse(aiResponse) : null;
  } catch (error) {
    console.error("Error parsing AI response:", error);
    parsedResponse = null;
  }

  if (selectedFile) {
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <input type="file" onChange={handleFileChange} className="block mb-4" />
        {!aiResponse ? (
          <Button onClick={generateConclusion} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Generate AI Conclusion"
            )}
          </Button>
        ) : (
          <div className="flex flex-wrap md:flex-nowrap gap-4 rounded-lg bg-muted p-4 w-full">
            <div className="text-muted-foreground flex-1">
              {parsedResponse ? (
                <div className="space-y-2">
                  <p>
                    <strong>Description:</strong> {parsedResponse.description}
                  </p>
                  <p>
                    <strong>Floors:</strong> {parsedResponse.floors}
                  </p>
                  <p>
                    <strong>Height:</strong> {parsedResponse.height.value}{" "}
                    {parsedResponse.height.unit} ({parsedResponse.height.note})
                  </p>
                  <p>
                    <strong>Width:</strong> {parsedResponse.width.value}{" "}
                    {parsedResponse.width.unit} ({parsedResponse.width.note})
                  </p>
                </div>
              ) : (
                <p>Invalid AI Response</p>
              )}
            </div>
            {selectedFile && (
              <div className="flex items-center justify-center max-w-sm mx-auto">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-w-full max-h-64 rounded-lg shadow-md"
                />
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
