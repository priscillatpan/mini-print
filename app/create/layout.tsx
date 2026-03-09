import StepIndicator from "@/components/step-indicator";

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh flex flex-col items-center px-4 pb-8">
      <StepIndicator />
      <div className="flex-1 flex flex-col items-center w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
