import { HostWizard } from "@/components/host-wizard";

export default function HostPage() {
  return (
    <div className="container py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          Turn your backyard into a Barkyard
        </h1>
        <p className="mt-2 text-muted-foreground">
          Earn by hosting dogs by the hour. List in minutes.
        </p>
        <div className="mt-8">
          <HostWizard />
        </div>
      </div>
    </div>
  );
}
