import { Label } from "@/components/ui/label";
import { cn } from "@/utils/cn";
import { isFieldRequired } from "@/utils/isFieldRequired";

interface ZodLabelInputProps {
    schema: any;
    name: string;
    children: React.ReactNode;
    className?: string;
}

export function ZodLabelInput({ schema, name, children, className = "" }: ZodLabelInputProps) {
    const required = isFieldRequired(schema, name);

    return (
        <Label className={cn("", className)}>
            {children}
            {required && <span className="text-red-500">*</span>}
        </Label>
    );
}
