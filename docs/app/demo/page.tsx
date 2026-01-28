import { Card, CardBody, CardHeader } from "@heroui/card";
import { Link } from "@heroui/link";
import { button as buttonStyles } from "@heroui/theme";

export default function Home() {
  const demos = [
    {
      description: "Complete form with all field types and validation",
      href: "/comprehensive-demo",
      title: "Comprehensive Demo",
    },
    {
      description: "Complex multi-section registration form",
      href: "/advanced-demo",
      title: "Advanced Demo",
    },
    {
      description:
        "Advanced features with conditional fields and real-time feedback",
      href: "/interactive-demo",
      title: "Interactive Demo",
    },
    {
      description:
        "E-commerce checkout with payment processing and order management",
      href: "/real-world-demo",
      title: "Real World Demo",
    },
    {
      description: "Form validation using Zod schema",
      href: "/zod-demo",
      title: "Zod Demo",
    },
    {
      description: "Showcase of new field types like sliders",
      href: "/new-fields-demo",
      title: "New Fields Demo",
    },
    {
      description:
        "Date input styling and default value (HeroHookFormProvider + defaultValues)",
      href: "/date-input-demo",
      title: "Date Input Demo",
    },
    {
      description: "Demonstration of form configuration options",
      href: "/config-demo",
      title: "Config Demo",
    },
    {
      description: "Dynamic form configuration example",
      href: "/configurable-form-demo",
      title: "Configurable Form Demo",
    },
  ];

  return (
    <section className="flex flex-col items-center justify-center gap-6 py-8 md:py-10">
      <div className="inline-block max-w-xl text-center justify-center">
        <h1 className="text-4xl font-bold mb-4">Hero Hook Form Demos</h1>
        <p className="text-lg text-default-600">
          Explore different form implementations and configurations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {demos.map((demo) => (
          <Card key={demo.href} className="w-full">
            <CardHeader className="pb-3">
              <h3 className="text-xl font-semibold">{demo.title}</h3>
            </CardHeader>
            <CardBody className="pt-0">
              <p className="text-default-600 mb-4">{demo.description}</p>
              <Link
                className={buttonStyles({
                  color: "primary",
                  radius: "full",
                  variant: "shadow",
                })}
                href={demo.href}
              >
                View Demo
              </Link>
            </CardBody>
          </Card>
        ))}
      </div>
    </section>
  );
}
